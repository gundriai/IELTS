"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

export default function IELTSWritingTest() {
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes total for Writing
  const [activeTab, setActiveTab] = useState(0);
  
  const [task1Text, setTask1Text] = useState("");
  const [task2Text, setTask2Text] = useState("");
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newLeftWidth = (e.clientX / window.innerWidth) * 100;
      if (newLeftWidth > 20 && newLeftWidth < 80) {
        setLeftWidth(newLeftWidth);
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getWordCount = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const task1WordCount = useMemo(() => getWordCount(task1Text), [task1Text]);
  const task2WordCount = useMemo(() => getWordCount(task2Text), [task2Text]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-8 shadow-sm z-20">
        <div className="flex items-center">
          <Link href="/" className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">Writing 18.4</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200 shadow-inner">
            <Clock className="w-5 h-5 text-slate-500 mr-3" />
            <span className={`font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-slate-700'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex flex-1 overflow-hidden flex-col p-6 gap-4">
        {/* Tabs Header */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-2 gap-2 shrink-0 rounded-t-xl">
          {['Task 1', 'Task 2'].map((tabName, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-8 py-3 rounded-t-lg font-bold text-sm transition-colors border-x border-t ${
                activeTab === idx 
                  ? 'bg-white border-slate-200 text-blue-700 shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.1)] relative top-[1px]' 
                  : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {tabName}
            </button>
          ))}
        </div>

        {/* Task 1 Layout */}
        <div className="flex-1 flex overflow-hidden" style={{ display: activeTab === 0 ? 'flex' : 'none' }}>
          {/* Left Pane: Prompt */}
          <section style={{ flex: `0 0 calc(${leftWidth}% - 12px)` }} className="relative bg-white rounded-b-2xl rounded-tr-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-y-auto p-8 flex flex-col">
            <div className="max-w-2xl mx-auto w-full">
              <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-wider">Writing Task 1</h2>
              <p className="mb-6 text-slate-700 font-medium">You should spend about 20 minutes on this task.</p>
              
              <div className="border-l-4 border-slate-300 bg-slate-50 p-5 mb-6 text-slate-500 italic">
                <p>Task 1 prompt will be added here later.</p>
              </div>
              
              <p className="mb-8 text-slate-700 font-medium">Write at least 150 words.</p>
              
              <div className="mt-8 flex justify-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <img 
                  src="/18-4-writing-task1.png" 
                  alt="Task 1 map/chart" 
                  className="max-w-full h-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://placehold.co/600x800/f8fafc/64748b?text=Please+save+the+image%5Cninside+the+public+folder+as%5Cn18-4-writing-task1.png";
                  }}
                />
              </div>
            </div>
          </section>

          {/* Resizer */}
          <div className="w-6 shrink-0 flex flex-col justify-center items-center cursor-col-resize hover:bg-slate-200/50 transition-colors z-20 group" onMouseDown={() => setIsDragging(true)}>
            <div className="w-1 h-16 bg-slate-300 rounded-full group-hover:bg-blue-400 transition-colors"></div>
          </div>

          {/* Right Pane: Writing Space */}
          <section style={{ flex: `0 0 calc(${100 - leftWidth}% - 12px)` }} className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden p-6">
            <div className="flex justify-between items-center mb-4 shrink-0 px-2">
              <h3 className="text-lg font-bold text-slate-800">Your Response</h3>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <span className={`px-3 py-1 rounded-full ${task1WordCount < 150 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  Word count: {task1WordCount} / 150 min
                </span>
              </div>
            </div>
            <textarea 
              className="flex-1 w-full p-5 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 leading-relaxed text-lg"
              placeholder="Start writing your response here..."
              value={task1Text}
              onChange={(e) => setTask1Text(e.target.value)}
              spellCheck="false"
            />
          </section>
        </div>

        {/* Task 2 Layout */}
        <div className="flex-1 flex overflow-hidden" style={{ display: activeTab === 1 ? 'flex' : 'none' }}>
          {/* Left Pane: Prompt */}
          <section style={{ flex: `0 0 calc(${leftWidth}% - 12px)` }} className="relative bg-white rounded-b-2xl rounded-tl-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-y-auto p-8 flex flex-col">
            <div className="max-w-2xl mx-auto w-full">
              <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-wider">Writing Task 2</h2>
              <p className="mb-6 text-slate-700 font-medium">You should spend about 40 minutes on this task.</p>
              
              <div className="border-l-4 border-slate-300 bg-slate-50 p-5 mb-6 text-slate-500 italic">
                <p>Task 2 prompt will be added here later.</p>
              </div>
              
              <p className="mb-8 text-slate-700 font-medium">Write at least 250 words.</p>
            </div>
          </section>

          {/* Resizer */}
          <div className="w-6 shrink-0 flex flex-col justify-center items-center cursor-col-resize hover:bg-slate-200/50 transition-colors z-20 group" onMouseDown={() => setIsDragging(true)}>
            <div className="w-1 h-16 bg-slate-300 rounded-full group-hover:bg-blue-400 transition-colors"></div>
          </div>

          {/* Right Pane: Writing Space */}
          <section style={{ flex: `0 0 calc(${100 - leftWidth}% - 12px)` }} className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden p-6">
            <div className="flex justify-between items-center mb-4 shrink-0 px-2">
              <h3 className="text-lg font-bold text-slate-800">Your Response</h3>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <span className={`px-3 py-1 rounded-full ${task2WordCount < 250 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  Word count: {task2WordCount} / 250 min
                </span>
              </div>
            </div>
            <textarea 
              className="flex-1 w-full p-5 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 leading-relaxed text-lg"
              placeholder="Start writing your response here..."
              value={task2Text}
              onChange={(e) => setTask2Text(e.target.value)}
              spellCheck="false"
            />
          </section>
        </div>

      </main>
    </div>
  );
}
