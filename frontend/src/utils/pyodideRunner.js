/**
 * In-Browser WebAssembly execution engine using Pyodide
 * Provides instant execution, 0 server cost, and interactive input() handling
 */

let pyodideInstance = null;
let pyodideLoadingPromise = null;

/**
 * Loads Pyodide from CDN once and caches the instance
 */
export async function loadPyodideInstance(onStatus) {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadingPromise) return pyodideLoadingPromise;

  pyodideLoadingPromise = (async () => {
    if (onStatus) onStatus('Loading Python WebAssembly runtime from CDN...');

    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load Pyodide script from CDN. Check network connection.'));
        document.head.appendChild(script);
      });
    }

    if (onStatus) onStatus('Initializing Python 3 environment in browser...');
    const py = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
    });

    pyodideInstance = py;
    return py;
  })();

  return pyodideLoadingPromise;
}

/**
 * Executes Python code inside the browser with interactive STDIN support
 */
export async function runPythonInBrowser(code, stdinText, onStatus) {
  const py = await loadPyodideInstance(onStatus);

  if (onStatus) onStatus('Executing Python script in browser...');

  let stdoutBuffer = '';
  let stderrBuffer = '';

  const stdinQueue = stdinText && stdinText.trim() ? stdinText.split('\n') : [];

  py.setStdout({
    batched: (text) => {
      stdoutBuffer += text + '\n';
    }
  });

  py.setStderr({
    batched: (text) => {
      stderrBuffer += text + '\n';
    }
  });

  py.setStdin({
    stdin: () => {
      // 1. If user pre-filled STDIN in the textarea, consume line by line
      if (stdinQueue.length > 0) {
        return stdinQueue.shift();
      }

      // 2. Interactive Terminal Input prompt
      const promptMsg = stdoutBuffer.trim()
        ? `Interactive Input needed:\n\n${stdoutBuffer.slice(-200)}`
        : 'Program requested input:';

      const userInput = window.prompt(promptMsg);

      if (userInput !== null && userInput !== undefined) {
        return userInput;
      }

      // If user cancelled, return empty string to avoid unhandled EOF crash
      return '';
    }
  });

  let exitCode = 0;
  try {
    await py.runPythonAsync(code);
  } catch (err) {
    exitCode = 1;
    // Clean Python traceback formatting
    const errStr = err.message || String(err);
    stderrBuffer += errStr;
  }

  return {
    stdout: stdoutBuffer,
    stderr: stderrBuffer,
    code: exitCode,
    isWasm: true
  };
}

/**
 * In-browser interactive JavaScript execution
 */
export async function runJavaScriptInBrowser(code) {
  let stdoutBuffer = '';
  let stderrBuffer = '';

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalTable = console.table;

  try {
    console.log = (...args) => {
      stdoutBuffer += args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ') + '\n';
    };
    console.warn = (...args) => {
      stdoutBuffer += '[WARN] ' + args.join(' ') + '\n';
    };
    console.error = (...args) => {
      stderrBuffer += args.join(' ') + '\n';
    };
    console.table = (data) => {
      try {
        stdoutBuffer += JSON.stringify(data, null, 2) + '\n';
      } catch (e) {
        stdoutBuffer += String(data) + '\n';
      }
    };

    const fn = new Function(code);
    const res = await Promise.resolve(fn());

    if (res !== undefined && !stdoutBuffer) {
      stdoutBuffer += (typeof res === 'object' ? JSON.stringify(res, null, 2) : String(res)) + '\n';
    }

    return {
      stdout: stdoutBuffer,
      stderr: stderrBuffer,
      code: 0,
      isWasm: true
    };
  } catch (err) {
    stderrBuffer += (err.stack || err.message || String(err)) + '\n';
    return {
      stdout: stdoutBuffer,
      stderr: stderrBuffer,
      code: 1,
      isWasm: true
    };
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
    console.table = originalTable;
  }
}
