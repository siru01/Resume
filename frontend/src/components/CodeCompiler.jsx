import { useState, useRef } from 'react';
import { SUPPORTED_LANGUAGES } from '../data/compilerLanguages';
import { runPythonInBrowser, runJavaScriptInBrowser } from '../utils/pyodideRunner';
import './CodeCompiler.css';

export default function CodeCompiler() {
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);

  // Multiple files management
  // Each file has: id, name, langId, content
  const [files, setFiles] = useState([
    {
      id: 'main-1',
      name: `main.${SUPPORTED_LANGUAGES[0].extension}`,
      langId: SUPPORTED_LANGUAGES[0].id,
      content: ''
    }
  ]);
  const [activeFileId, setActiveFileId] = useState('main-1');

  // New file modal / dropdown state
  const [showNewFileMenu, setShowNewFileMenu] = useState(false);
  const [isCreatingNewFile, setIsCreatingNewFile] = useState(false);
  const [newFileNameInput, setNewFileNameInput] = useState('');

  // Editing file name state
  const [editingFileId, setEditingFileId] = useState(null);
  const [editingFileName, setEditingFileName] = useState('');

  // Execution state
  const [stdin, setStdin] = useState('');
  const [showStdin, setShowStdin] = useState(false);
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Executing in sandbox environment…');
  const [execTime, setExecTime] = useState(null);

  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

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

    // Update active file language and rename extension if it's default
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === activeFileId) {
          const baseName = f.name.includes('.') ? f.name.substring(0, f.name.lastIndexOf('.')) : f.name;
          return {
            ...f,
            langId: lang.id,
            name: `${baseName}.${lang.extension}`
          };
        }
        return f;
      })
    );
    setOutput(null);
    setExecTime(null);
  };

  const handleCodeChange = (newCode) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: newCode } : f))
    );
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '  ';

      const currentContent = activeFile.content;
      const newCode = currentContent.substring(0, start) + spaces + currentContent.substring(end);
      handleCodeChange(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  // Add Empty File
  const handleCreateEmptyFile = (customName) => {
    const defaultName = customName && customName.trim() 
      ? customName.trim() 
      : `file_${files.length + 1}.${selectedLang.extension}`;

    // detect language from extension if possible
    const ext = defaultName.includes('.') ? defaultName.split('.').pop().toLowerCase() : '';
    const matchedLang = SUPPORTED_LANGUAGES.find(l => l.extension === ext) || selectedLang;

    const newFile = {
      id: `file-${Date.now()}`,
      name: defaultName,
      langId: matchedLang.id,
      content: ''
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setSelectedLang(matchedLang);
    setShowNewFileMenu(false);
    setIsCreatingNewFile(false);
    setNewFileNameInput('');
  };

  // File Import / Upload from computer
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const fileName = file.name;
      const ext = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';
      const matchedLang = SUPPORTED_LANGUAGES.find(l => l.extension === ext) || selectedLang;

      const newFile = {
        id: `file-${Date.now()}`,
        name: fileName,
        langId: matchedLang.id,
        content: content
      };

      setFiles((prev) => [...prev, newFile]);
      setActiveFileId(newFile.id);
      setSelectedLang(matchedLang);
      setShowNewFileMenu(false);
    };
    reader.readAsText(file);
    // Reset input so same file can be re-uploaded if needed
    e.target.value = '';
  };

  // File deletion
  const handleDeleteFile = (e, fileId) => {
    e.stopPropagation();
    if (files.length <= 1) return; // Keep at least one file
    const remaining = files.filter(f => f.id !== fileId);
    setFiles(remaining);
    if (activeFileId === fileId) {
      setActiveFileId(remaining[0].id);
      const matchedLang = SUPPORTED_LANGUAGES.find(l => l.id === remaining[0].langId);
      if (matchedLang) setSelectedLang(matchedLang);
    }
  };

  // Rename file
  const handleStartRename = (file) => {
    setEditingFileId(file.id);
    setEditingFileName(file.name);
  };

  const handleSaveRename = (fileId) => {
    if (!editingFileName.trim()) {
      setEditingFileId(null);
      return;
    }
    const cleanName = editingFileName.trim();
    const ext = cleanName.includes('.') ? cleanName.split('.').pop().toLowerCase() : '';
    const matchedLang = SUPPORTED_LANGUAGES.find(l => l.extension === ext);

    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          name: cleanName,
          langId: matchedLang ? matchedLang.id : f.langId
        };
      }
      return f;
    }));

    if (matchedLang && fileId === activeFileId) {
      setSelectedLang(matchedLang);
    }
    setEditingFileId(null);
  };

  const runCode = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setOutput(null);
    setExecTime(null);
    setStatusMessage('Preparing execution environment…');

    const startTime = performance.now();
    const currentCode = activeFile.content;

    try {
      // 1. In-browser Python WebAssembly execution
      if (selectedLang.id === 'python') {
        try {
          const result = await runPythonInBrowser(
            currentCode,
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
          const result = await runJavaScriptInBrowser(currentCode);
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
        code: currentCode,
        stdin: showStdin ? stdin : '',
      };

      let response;
      try {
        response = await fetch('/api/wandbox/compile.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (proxyErr) {
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
    handleCodeChange('');
    setOutput(null);
    setExecTime(null);
  };

  const clearOutput = () => {
    setOutput(null);
    setExecTime(null);
  };

  const lineCount = Math.max(1, (activeFile.content || '').split('\n').length);

  return (
    <section className="compiler-page">
      {/* Hidden file input for importing */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImportFile}
      />

      {/* ═══════════════════════════════════════════════════════════
          TOP HEADER ROW:
          - Left: Page Title & Subtitle
          - Right: (GREEN BOX) Run Code Button & Action Controls
         ═══════════════════════════════════════════════════════════ */}
      <div className="compiler-header-row">
        <div className="compiler-title-group">
          <h2 className="compiler-section-title">Code [Compiler]</h2>
          <p className="compiler-subtitle">Run and test code in real-time right in your browser.</p>
        </div>

        {/* GREEN BOX: RUN CODE BUTTON & QUICK ACTIONS */}
        <div className="compiler-run-zone">
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
            title="Reset active file to starter template"
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
            <span className="compiler-run-icon-slot">
              {isLoading ? (
                <span className="compiler-spinner"></span>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </span>
            <span className="compiler-run-label">Run</span>
          </button>
        </div>
      </div>

      {/* STDIN Collapsible Drawer */}
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

      {/* ═══════════════════════════════════════════════════════════
          MAIN WORKSPACE GRID:
          - LEFT SIDEBAR:
              [YELLOW BOX] Language Selector Card
              [BLUE BOX] File Heading + Multi-file tabs + '+' (Add/Import)
          - CENTER: Code Editor Window
          - RIGHT: [WHITE BOX] Terminal Output Box
         ═══════════════════════════════════════════════════════════ */}
      <div className="compiler-main-grid">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="compiler-sidebar">
          
          {/* Language Selector Card */}
          <div className="compiler-sidebar-card">
            <div className="sidebar-box-label">
              <span className="box-title">SELECTED LANGUAGE</span>
            </div>
            <div className="compiler-lang-selector-card">
              <div className="lang-icon-badge">
                <span className="lang-ext-text">{selectedLang.extension.toUpperCase()}</span>
              </div>
              <div className="lang-select-details">
                <select
                  className="sidebar-lang-select"
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
                <div className="lang-meta-info">
                  <span className="lang-compiler-tag">{selectedLang.compiler}</span>
                </div>
              </div>
            </div>
          </div>

          {/* File Heading, List of Files, + Add/Import Button */}
          <div className="compiler-sidebar-card compiler-files-card">
            <div className="sidebar-box-label file-header-label">
              <div className="file-header-left">
                <span className="box-title">FILES / PROJECT</span>
              </div>

              {/* + NEW FILE / IMPORT BUTTON */}
              <div className="file-add-dropdown-container">
                <button
                  type="button"
                  className="file-plus-btn"
                  onClick={() => setShowNewFileMenu(!showNewFileMenu)}
                  title="Create new file or import"
                  aria-label="New file or import options"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>

                {showNewFileMenu && (
                  <div className="file-dropdown-menu">
                    <button
                      type="button"
                      className="file-dropdown-item"
                      onClick={() => {
                        setShowNewFileMenu(false);
                        setIsCreatingNewFile(true);
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                      </svg>
                      <span>New Empty File</span>
                    </button>
                    <button
                      type="button"
                      className="file-dropdown-item"
                      onClick={() => {
                        setShowNewFileMenu(false);
                        fileInputRef.current?.click();
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <span>Import from Computer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick new file inline prompt */}
            {isCreatingNewFile && (
              <div className="file-create-input-box">
                <input
                  type="text"
                  className="file-inline-name-input"
                  placeholder={`e.g. script.${selectedLang.extension}`}
                  value={newFileNameInput}
                  onChange={(e) => setNewFileNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateEmptyFile(newFileNameInput);
                    if (e.key === 'Escape') setIsCreatingNewFile(false);
                  }}
                  autoFocus
                />
                <div className="file-create-actions">
                  <button
                    type="button"
                    className="file-confirm-btn"
                    onClick={() => handleCreateEmptyFile(newFileNameInput)}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="file-cancel-btn"
                    onClick={() => setIsCreatingNewFile(false)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* List of files in project */}
            <div className="compiler-file-list">
              {files.map((f) => {
                const isActive = f.id === activeFileId;
                const isEditing = editingFileId === f.id;

                return (
                  <div
                    key={f.id}
                    className={`compiler-file-item ${isActive ? 'active-file' : ''}`}
                    onClick={() => {
                      setActiveFileId(f.id);
                      const matchedLang = SUPPORTED_LANGUAGES.find(l => l.id === f.langId);
                      if (matchedLang) setSelectedLang(matchedLang);
                    }}
                  >
                    <div className="file-item-left">
                      <span className="file-item-icon">📄</span>
                      {isEditing ? (
                        <input
                          type="text"
                          className="file-rename-input"
                          value={editingFileName}
                          onChange={(e) => setEditingFileName(e.target.value)}
                          onBlur={() => handleSaveRename(f.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(f.id);
                            if (e.key === 'Escape') setEditingFileId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="file-item-name"
                          onDoubleClick={() => handleStartRename(f)}
                          title="Double-click to rename"
                        >
                          {f.name}
                        </span>
                      )}
                    </div>

                    <div className="file-item-actions">
                      <button
                        type="button"
                        className="file-action-icon"
                        title="Rename file"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartRename(f);
                        }}
                      >
                        ✎
                      </button>
                      {files.length > 1 && (
                        <button
                          type="button"
                          className="file-action-icon delete-icon"
                          title="Delete file"
                          onClick={(e) => handleDeleteFile(e, f.id)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="file-sidebar-footer">
              <span className="file-active-badge">Active: {activeFile.name}</span>
            </div>
          </div>

        </aside>

        {/* ── CENTER: CODE EDITOR ── */}
        <div className="compiler-editor-container">
          <div className="compiler-window-bar">
            <div className="compiler-window-title">
              <span className="compiler-active-file-header">{activeFile.name}</span>
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
              value={activeFile.content}
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              placeholder={`Write your ${selectedLang.name} code here...`}
            />
          </div>
        </div>

        {/* ── RIGHT: OUTPUT TERMINAL (WHITE BOX) ── */}
        <div className="compiler-output-container">
          <div className="compiler-window-bar output-bar">
            <div className="compiler-window-title">
              <span className="compiler-terminal-heading">TERMINAL OUTPUT</span>
            </div>

            <div className="compiler-terminal-actions">
              {execTime && <span className="compiler-time-tag">{execTime}</span>}
              {output && (
                <button
                  type="button"
                  className="compiler-clear-btn"
                  onClick={clearOutput}
                  title="Clear terminal output"
                >
                  Clr
                </button>
              )}
            </div>
          </div>

          <div className="compiler-output-body">
            {!output && !isLoading && (
              <div className="compiler-output-idle">
                <div className="terminal-idle-icon">⚡</div>
                <p>Output will appear here after clicking <strong>Run Code</strong>.</p>
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
