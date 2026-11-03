/**
 * Pyodide Web Worker with SharedArrayBuffer & Atomics support
 * Enables real-time, non-blocking synchronous input() inside the terminal
 */

let pyodide = null;
let pyodidePromise = null;
let sab = null;
let controlView = null; // Int32Array: [0] = status, [1] = byte length
const textDecoder = new TextDecoder();

let stdoutChunk = '';
let stdoutTimer = null;
function flushStdout() {
  if (stdoutTimer) {
    clearTimeout(stdoutTimer);
    stdoutTimer = null;
  }
  if (stdoutChunk) {
    self.postMessage({ type: 'STDOUT', text: stdoutChunk });
    stdoutChunk = '';
  }
}

let stderrChunk = '';
let stderrTimer = null;
function flushStderr() {
  if (stderrTimer) {
    clearTimeout(stderrTimer);
    stderrTimer = null;
  }
  if (stderrChunk) {
    self.postMessage({ type: 'STDERR', text: stderrChunk });
    stderrChunk = '';
  }
}

async function initPyodide() {
  if (pyodide) return pyodide;
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      self.postMessage({ type: 'STATUS', message: 'Initializing Python 3 runtime…' });
      
      const { loadPyodide } = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs');

      const py = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
      });

      // Stream stdout character-by-character with short debounce
      py.setStdout({
        isatty: true,
        raw: (charCode) => {
          stdoutChunk += String.fromCharCode(charCode);
          if (stdoutChunk.length >= 64 || charCode === 10) {
            flushStdout();
          } else if (!stdoutTimer) {
            stdoutTimer = setTimeout(flushStdout, 15);
          }
        }
      });

      // Stream stderr character-by-character with short debounce
      py.setStderr({
        isatty: true,
        raw: (charCode) => {
          stderrChunk += String.fromCharCode(charCode);
          if (stderrChunk.length >= 64 || charCode === 10) {
            flushStderr();
          } else if (!stderrTimer) {
            stderrTimer = setTimeout(flushStderr, 15);
          }
        }
      });

      // Intercept stdin using SharedArrayBuffer + Atomics
      py.setStdin({
        stdin: () => {
          if (!controlView) {
            return null;
          }

          // Make sure any unprinted prompt before input() is flushed to the terminal UI
          flushStdout();
          flushStderr();

          // Reset status flag: 0 means waiting for input
          Atomics.store(controlView, 0, 0);

          // Request input from the main thread UI
          self.postMessage({ type: 'INPUT_REQUEST' });

          // Block worker thread safely until main thread writes input
          Atomics.wait(controlView, 0, 0);

          const status = Atomics.load(controlView, 0);
          if (status === 2) {
            // Cancelled or abort
            return null;
          }

          const length = Atomics.load(controlView, 1);
          if (length <= 0) {
            return '\n';
          }

          const bytes = new Uint8Array(sab, 8, length);
          const inputString = textDecoder.decode(bytes);
          return inputString.endsWith('\n') ? inputString : inputString + '\n';
        },
        isatty: true,
        autoEOF: false
      });

      pyodide = py;
      return py;
    })();
  }
  return pyodidePromise;
}

self.onmessage = async (e) => {
  const data = e.data;
  if (!data) return;

  if (data.type === 'INIT') {
    if (data.sab) {
      sab = data.sab;
      controlView = new Int32Array(sab, 0, 2);
    }
    try {
      await initPyodide();
      self.postMessage({ type: 'READY' });
    } catch (err) {
      self.postMessage({ type: 'ERROR', error: err.message || String(err) });
    }
  } else if (data.type === 'RUN') {
    try {
      const py = await initPyodide();
      self.postMessage({ type: 'STATUS', message: 'Executing Python code…' });
      await py.runPythonAsync(data.code);
      flushStdout();
      flushStderr();
      self.postMessage({ type: 'DONE', code: 0 });
    } catch (err) {
      flushStdout();
      flushStderr();
      const errStr = err.message || String(err);
      self.postMessage({ type: 'STDERR', text: errStr.endsWith('\n') ? errStr : errStr + '\n' });
      self.postMessage({ type: 'DONE', code: 1 });
    }
  }
};
