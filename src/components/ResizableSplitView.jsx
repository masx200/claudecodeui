import React, { useState, useRef, useCallback } from 'react'

const ResizableSplitView = ({
  left,
  right,
  minLeftWidth = 240,
  maxLeftWidth = 500,
  defaultLeftWidth = 320
}) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const newWidth = e.clientX - containerRect.left
    const clampedWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newWidth))

    setLeftWidth(clampedWidth)
  }, [minLeftWidth, maxLeftWidth])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch events for mobile support
  const handleTouchStart = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current) return

    const touch = e.touches[0]
    const containerRect = containerRef.current.getBoundingClientRect()
    const newWidth = touch.clientX - containerRect.left
    const clampedWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newWidth))

    setLeftWidth(clampedWidth)
  }, [minLeftWidth, maxLeftWidth])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse/touch event listeners when dragging
  React.useEffect(() => {
    if (!isDragging) return

    const onMouseMove = (e) => {
      if (!containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = e.clientX - containerRect.left
      const clampedWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newWidth))
      setLeftWidth(clampedWidth)
    }

    const onMouseUp = () => setIsDragging(false)

    const onTouchMove = (e) => {
      if (!containerRef.current) return
      const touch = e.touches[0]
      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = touch.clientX - containerRect.left
      const clampedWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newWidth))
      setLeftWidth(clampedWidth)
    }

    const onTouchEnd = () => setIsDragging(false)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd)

    // Prevent text selection while dragging
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ew-resize'

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)

      // Restore text selection and cursor
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging, minLeftWidth, maxLeftWidth])

  return (
    <div
      ref={containerRef}
      className="flex h-full bg-background"
    >
      {/* Left Panel */}
      <div
        style={{ width: `${leftWidth}px` }}
        className="flex-shrink-0 border-r border-border bg-card overflow-hidden"
      >
        {left}
      </div>

      {/* Resize Handle */}
      <div
        className={`relative w-1 bg-border hover:bg-blue-500 cursor-ew-resize flex-shrink-0 transition-colors duration-150 ${
          isDragging ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Visual indicator when hovering or dragging */}
        <div className={`absolute inset-y-0 -left-1 -right-1 ${isDragging ? 'bg-blue-500/20' : 'hover:bg-blue-500/10'} transition-colors duration-150`} />

        {/* Drag handle dots */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col space-y-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {right}
      </div>
    </div>
  )
}

export default ResizableSplitView