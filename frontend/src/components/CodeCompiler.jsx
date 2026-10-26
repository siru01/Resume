import { useState, useRef } from 'react';
import { SUPPORTED_LANGUAGES } from '../data/compilerLanguages';
import { runPythonInBrowser, runJavaScriptInBrowser } from '../utils/pyodideRunner';
import './CodeCompiler.css';

export default function CodeCompiler() {
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);
  const [code, setCode] = useState(SUPPORTED_LANGUAGES[0].boilerplate);
  const [stdin, setStdin] = useState('');
  const [showStdin, setShowStdin] = useState(false);
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Executing in sandbox environment…');
  const [execTime, setExecTime] = useState(null);

  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Sync line numbers scroll with textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleLanguageChange = (langId) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.id === langId);
    if (!lang) return;
    setSelectedLang(lang);
    setCode(lang.boilerplate);
    setOutput(null);
    setExecTime(null);
  };

  const handleKeyDown = (e) => {
    // Run on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
      return;
    }

    // Indentation with Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '  ';

      const newCode = code.substring(0, start) + spaces + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  const runCode = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setOutput(null);
    setExecTime(null);
    setStatusMessage('Preparing execution environment…');

    const startTime = performance.now();

    try {
      // 1. In-browser Python WebAssembly execution
      if (selectedLang.id === 'python') {
        try {
          const result = await runPythonInBrowser(
            code,
            showStdin ? stdin : '',
            (msg) => setStatusMessage(msg)
          );
          const duration = ((performance.now() - startTime) / 1000).toFixed(2);
          setExecTime(`${duration}s`);
          setOutput({
            stdout: result.stdout,
            stderr: result.stderr,
            code: result.code,
            isWasm: true,
            isMissingInput: (result.stderr || '').includes('EOFError')
          });
          return;
        } catch (wasmErr) {
          console.warn('Pyodide execution failed, falling back to Wandbox cloud runner:', wasmErr);
          setStatusMessage('Connecting to Wandbox cloud runner…');
        }
      }

      // 2. In-browser JavaScript execution
      if (selectedLang.id === 'javascript') {
        try {
          const result = await runJavaScriptInBrowser(code);
          const duration = ((performance.now() - startTime) / 1000).toFixed(2);
          setExecTime(`${duration}s`);
          setOutput({
            stdout: result.stdout,
            stderr: result.stderr,
            code: result.code,
            isWasm: true
          });
          return;
        } catch (jsErr) {
          console.warn('In-browser JS run failed, falling back to Wandbox:', jsErr);
        }
      }

      // 3. Wandbox Cloud Sandbox Execution (C++, C, Java, Go, Rust, Bash, or fallback)
      const payload = {
        compiler: selectedLang.compiler,
        code: code,
        stdin: showStdin ? stdin : '',
      };

      let response;
      try {
        // Primary: use Vite proxy in dev & Vercel rewrite in prod (bypasses browser CORS)
        response = await fetch('/api/wandbox/compile.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (proxyErr) {
        // Fallback: direct API call
        response = await fetch('https://wandbox.org/api/compile.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error(`Execution service responded with status ${response.status}`);
      }

      const data = await response.json();
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      setExecTime(`${duration}s`);

      const stdout = data.program_output || data.compiler_output || '';
      const stderr = (data.compiler_error ? data.compiler_error + '\n' : '') + (data.program_error || '');
      const exitCode = data.status !== undefined && data.status !== null 
        ? parseInt(data.status, 10) 
        : (stderr && !stdout ? 1 : 0);

      const isMissingInput =
        stderr.includes('EOFError') ||
        stderr.includes('NoSuchElementException');

      setOutput({
        stdout: stdout,
        stderr: stderr,
        code: isNaN(exitCode) ? 0 : exitCode,
        isWasm: false,
        isMissingInput: isMissingInput
      });
    } catch (err) {
      setOutput({
        stderr: err.message || 'Execution failed. Check internet connection or CORS.',
        code: 1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetCode = () => {
    setCode(selectedLang.boilerplate);
    setOutput(null);
    setExecTime(null);
  };

  const clearOutput = () => {
    setOutput(null);
    setExecTime(null);
  };

  const lineCount = Math.max(1, code.split('\n').length);

  return (
    <section className="compiler-page">
      {/* ── Top Bar / Header ── */}
      <div className="compiler-top-header">
        <div>
          <h2 className="compiler-section-title">Code [Compiler]</h2>
          <p className="compiler-subtitle">Run and test code in real-time right in your browser.</p>
        </div>

        <div className="compiler-toolbar">
          <div className="compiler-lang-wrapper">
            <select
              className="compiler-lang-select"
              value={selectedLang.id}
              onChange={(e) => handleLanguageChange(e.target.value)}
              aria-label="Select Programming Language"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.version})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className={`compiler-action-btn ${showStdin ? 'active' : ''}`}
            onClick={() => setShowStdin(!showStdin)}
            title="Custom Input for programs with input() or cin"
          >
            {showStdin ? 'Hide STDIN' : 'Add STDIN'}
          </button>

          <button
            type="button"
            className="compiler-action-btn"
            onClick={resetCode}
            title="Reset to starter template"
          >
            Reset
          </button>

          <button
            type="button"
            className={`compiler-run-btn ${isLoading ? 'loading' : ''}`}
            onClick={runCode}
            disabled={isLoading}
            title="Execute code (Ctrl+Enter)"
          >
            {isLoading ? (
              <span className="compiler-spinner"></span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
            <span>{isLoading ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* ── Optional STDIN Input Box ── */}
      {showStdin && (
        <div className="compiler-stdin-box">
          <div className="compiler-stdin-header">
            <span>Standard Input (stdin):</span>
          </div>
          <textarea
            className="compiler-stdin-textarea"
            rows="2"
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Enter standard input values (e.g. for input() or cin >>)..."
          />
        </div>
      )}

      {/* ── Workspace: Split Window (Code Editor on Left, Output on Right) ── */}
      <div className="compiler-workspace">
        
        {/* LEFT: Code Editor Window */}
        <div className="compiler-window compiler-editor-window">
          <div className="compiler-window-bar">
            <div className="compiler-window-title">
              <span className="compiler-file-icon">●</span>
              <span>main.{selectedLang.extension}</span>
              <span className="compiler-lang-badge">{selectedLang.name}</span>
            </div>
            <div className="compiler-window-hint">
              <span>Ctrl + ↵ to run</span>
            </div>
          </div>

          <div className="compiler-editor-body">
            {/* Line numbers column */}
            <div className="compiler-line-numbers" ref={lineNumbersRef} aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1} className="compiler-line-number">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code input */}
            <textarea
              ref={textareaRef}
              className="compiler-code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />
          </div>
        </div>

        {/* RIGHT: Output Terminal Window */}
        <div className="compiler-window compiler-output-window">
          <div className="compiler-window-bar">
            <div className="compiler-window-title">
              <span className="compiler-terminal-icon">&gt;_</span>
              <span>OUTPUT</span>
              {execTime && <span className="compiler-time-tag">{execTime}</span>}
              {output && (
                <span className={`compiler-mode-tag ${output.isWasm ? 'wasm' : 'cloud'}`}>
                  {output.isWasm ? '⚡ Browser Wasm' : '☁️ Cloud'}
                </span>
              )}
              {output && (
                <span className={`compiler-status-tag ${output.code === 0 ? 'success' : 'error'}`}>
                  Exit: {output.code}
                </span>
              )}
            </div>

            <div className="compiler-window-actions">
              {output && (
                <button
                  type="button"
                  className="compiler-clear-btn"
                  onClick={clearOutput}
                  title="Clear terminal output"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="compiler-output-body">
            {!output && !isLoading && (
              <div className="compiler-output-idle">
                <p>⚡ Output will appear here after clicking <strong>Run Code</strong>.</p>
                <p className="compiler-idle-sub">Supports interactive inputs, WebAssembly speed, and standard errors.</p>
              </div>
            )}

            {isLoading && (
              <div className="compiler-output-loading">
                <span className="compiler-spinner"></span>
                <span>{statusMessage}</span>
              </div>
            )}

            {output && (
              <>
                <pre className="compiler-terminal-text">
                  {output.stdout && <span className="terminal-stdout">{output.stdout}</span>}
                  {output.stderr && <span className="terminal-stderr">{output.stderr}</span>}
                  {!output.stdout && !output.stderr && (
                    <span className="terminal-muted">[Program finished with no output]</span>
                  )}
                </pre>

                {output.isMissingInput && (
                  <div className="compiler-missing-input-banner">
                    <div className="compiler-missing-input-text">
                      <div>💡 <strong>Input Required:</strong> Your program called <code>input()</code> but no input was provided.</div>
                      <div className="compiler-missing-input-sub">Click below to open the STDIN box, or run again to type interactively when prompted.</div>
                    </div>
                    <button
                      type="button"
                      className="compiler-helper-btn"
                      onClick={() => setShowStdin(true)}
                    >
                      Open STDIN
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
