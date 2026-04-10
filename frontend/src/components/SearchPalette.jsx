import { useState, useEffect, useRef } from 'react'
import { searchData } from '../data/searchData'
import './SearchPalette.css'

export default function SearchPalette({ isOpen, onClose, setPage }) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  // Safety filter
  const filteredItems = (searchData || []).filter(item =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.type?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8)

  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (filteredItems.length ? (prev + 1) % filteredItems.length : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (filteredItems.length ? (prev - 1 + filteredItems.length) % filteredItems.length : 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex])
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredItems, onClose])

  const handleSelect = (item) => {
    if (setPage && item.page) {
      setPage(item.page)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-palette" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            className="search-input-palette"
            placeholder="Search posts, projects, tools..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="esc-hint">ESC</div>
        </div>

        <div className="search-results">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className={`search-item ${index === selectedIndex ? 'selected' : ''}`}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => handleSelect(item)}
              >
                <div className="item-info">
                  <span className="item-title">{item.title}</span>
                  <span className="item-type">{item.type}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No results found for "{search}"</div>
          )}
        </div>

        <div className="search-footer">
          <div className="hint-group">
            <span className="hint-key">↑↓</span>
            <span className="hint-text">navigate</span>
          </div>
          <div className="hint-group">
            <span className="hint-key">↵</span>
            <span className="hint-text">open</span>
          </div>
          <div className="hint-group">
            <span className="hint-key">ESC</span>
            <span className="hint-text">close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
