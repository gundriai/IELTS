"use client";

import { useState, useRef, useEffect } from 'react';
import { Highlighter } from 'lucide-react';

interface Passage {
  id: string;
  title: string;
  content: string;
}

interface PassageViewerProps {
  passages: Passage[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export default function PassageViewer({ passages, activeTab, onTabChange }: PassageViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showHighlighter, setShowHighlighter] = useState(false);
  const [highlightPos, setHighlightPos] = useState({ top: 0, left: 0 });
  const [currentSelection, setCurrentSelection] = useState<Range | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0 && contentRef.current?.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Position the button slightly above the selection
        setHighlightPos({
          top: rect.top - 40 + window.scrollY,
          left: rect.left + rect.width / 2,
        });
        setCurrentSelection(range);
        setShowHighlighter(true);
      } else {
        setShowHighlighter(false);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  const applyHighlight = () => {
    if (!currentSelection) return;
    
    const span = document.createElement('span');
    span.className = 'bg-yellow-200 rounded px-0.5';
    
    try {
      currentSelection.surroundContents(span);
    } catch (e) {
      console.warn("Complex selection highlighting not fully supported. Need more robust highlighting logic for crossing DOM nodes.");
      // Fallback for simple single-node highlight or just extract contents
      const extracted = currentSelection.extractContents();
      span.appendChild(extracted);
      currentSelection.insertNode(span);
    }
    
    window.getSelection()?.removeAllRanges();
    setShowHighlighter(false);
  };

  if (!passages || passages.length === 0) return <div>No passages found.</div>;

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {passages.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => onTabChange(idx)}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === idx
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-y-auto p-8 text-slate-800 leading-relaxed text-lg"
        ref={contentRef}
      >
        <div dangerouslySetInnerHTML={{ __html: passages[activeTab].content }} />
      </div>

      {/* Floating Highlighter Button */}
      {showHighlighter && (
        <button
          onClick={applyHighlight}
          style={{
            position: 'absolute',
            top: highlightPos.top,
            left: highlightPos.left,
            transform: 'translateX(-50%)',
          }}
          className="z-50 flex items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          <Highlighter className="mr-1.5 h-4 w-4 text-yellow-300" />
          Highlight
        </button>
      )}
    </div>
  );
}
