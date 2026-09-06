const fs = require('fs');
const path = require('path');

const rawHtmlPath = '/Users/sudhirbhandari/.gemini/antigravity-ide/brain/00bba1d1-13d2-4d6d-a7d5-20bd1fe345db/scratch/test230.html';
const rawHtml = fs.readFileSync(rawHtmlPath, 'utf8');

// Find the main content
let mainContentStart = rawHtml.indexOf('<h1 class="page-title entry-title">IELTS  Reading Test 230</h1>');
let mainContentEnd = rawHtml.indexOf('<div class="addtoany_share_save_container');
let mainContent = rawHtml.substring(mainContentStart, mainContentEnd);

// Split markers
const p1Title = '<p style="text-align: center;"><strong>The development of the London underground railway</strong></p>';
const p1Q = '<strong>Questions 1-6</strong><br />';
const p2Title = '<p style="text-align: center;"><strong>Stadiums: past, present and future</strong></p>';
const p2Q = '<strong>Questions 14-17</strong><br />';
const p3Title = '<p style="text-align: center;"><strong>To catch a king</strong></p>';
const p3Q = '<strong>Questions 27-31</strong><br />';
const answersStart = "value='Show Answers'>";

// Indexes
const i_p1Title = mainContent.indexOf(p1Title);
const i_p1Q = mainContent.lastIndexOf('<p', mainContent.indexOf(p1Q));
const i_p2Title = mainContent.indexOf(p2Title);
const i_p2Q = mainContent.lastIndexOf('<p', mainContent.indexOf(p2Q));
const i_p3Title = mainContent.indexOf(p3Title);
const i_p3Q = mainContent.lastIndexOf('<p', mainContent.indexOf(p3Q));
const i_answers = mainContent.indexOf(answersStart);

if (i_p1Title === -1 || i_p1Q === -1 || i_p2Title === -1 || i_p2Q === -1 || i_p3Title === -1 || i_p3Q === -1 || i_answers === -1) {
    console.error("Could not find all markers.");
    process.exit(1);
}

const p1Text = mainContent.substring(i_p1Title, i_p1Q);
let q1Text = mainContent.substring(i_p1Q, i_p2Title);
// There is an ad banner in between q1 and p2 potentially:
q1Text = q1Text.replace(/<p><br><ins style="display: block;"[^>]+><\/ins><\/p>/, '');

const p2Text = mainContent.substring(i_p2Title, i_p2Q);
let q2Text = mainContent.substring(i_p2Q, i_p3Title);
q2Text = q2Text.replace(/<p><br><ins style="display: block;"[^>]+><\/ins><\/p>/, '');

const p3Text = mainContent.substring(i_p3Title, i_p3Q);
let q3Text = mainContent.substring(i_p3Q, i_answers);
q3Text = q3Text.replace(/<p><br><ins style="display: block;"[^>]+><\/ins><\/p>/, '');

const answersHtml = mainContent.substring(i_answers);

const inputBoxHTML = '<input type="text" className="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />';

function injectInputs(html) {
    // Fill in blanks
    let out = html.replace(/\(\d{1,2}\)\s*(?:…{3,}|_{3,})/g, `$& ${inputBoxHTML}`);
    // Standard numbered questions (e.g. "14. a mention of" or "<br>14. a mention of" or "<p>14. a mention of")
    out = out.replace(/(<(?:br|p)[^>]*>)\s*(\d{1,2})\.\s+([A-Za-z])/g, `$1$2. ${inputBoxHTML} $3`);
    // Specific block questions for test 230 that don't have standard numbering
    out = out.replace(/(<strong>E<\/strong> They are made of less durable materials\.<\/p>)/, `$1<p style="text-align: justify;">23. ${inputBoxHTML} <br/> 24. ${inputBoxHTML}</p>`);
    out = out.replace(/(<strong>E<\/strong> providing a suitable site for the installation of renewable power generators<\/p>)/, `$1<p style="text-align: justify;">25. ${inputBoxHTML} <br/> 26. ${inputBoxHTML}</p>`);
    return out;
}

q1Text = injectInputs(q1Text);
q2Text = injectInputs(q2Text);
q3Text = injectInputs(q3Text);

// Extract the answers text for our own custom render instead of their hidden input
const ansMatch = answersHtml.match(/<div id='bg-showmore-hidden-[^>]+>\s*<\/p><p>(.*?)<\/p><\/div>/s);
let rawAnswers = '';
if (ansMatch) {
    rawAnswers = ansMatch[1];
} else {
    // fallback
    let divStart = answersHtml.indexOf("<div id='bg-showmore-hidden");
    let divEnd = answersHtml.lastIndexOf('</div>');
    rawAnswers = answersHtml.substring(divStart, divEnd);
}
// Strip the wrapper div if it's there
rawAnswers = rawAnswers.replace(/<div id='bg-showmore-hidden[^>]+><\/p><p>/, '').replace(/<\/p><\/div>$/, '');


// Format answers nicely in columns
const ansLines = rawAnswers.split('<br>').map(s => s.trim()).filter(Boolean);
let ansCol1 = [];
let ansCol2 = [];
ansLines.forEach((line, i) => {
    // Strip <p> tags
    line = line.replace(/<\/?p>/g, '').trim();
    if (i < 20) ansCol1.push(line);
    else ansCol2.push(line);
});

const pageContent = `"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

export default function IELTSReadingTest230() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return \`\${m}:\${s}\`;
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-8 shadow-sm z-20">
        <div className="flex items-center">
          <Link href="/" className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">IELTS Reading Test 230</h1>
        </div>
        <div className="flex items-center bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200 shadow-inner">
          <Clock className="w-5 h-5 text-slate-500 mr-3" />
          <span className="font-mono text-xl font-bold text-slate-700">{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex flex-1 overflow-hidden relative p-6 gap-6">
        {/* Left Pane: Questions */}
        <section className="w-1/2 relative z-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-y-auto scroll-smooth flex flex-col">
          <div className="p-10 prose prose-slate prose-p:mb-6 prose-headings:text-slate-800 prose-p:text-slate-700 max-w-none flex-1">
            {activeTab === 0 && <div dangerouslySetInnerHTML={{ __html: \`${q1Text.replace(/`/g, "\\`").trim()}\` }} />}
            {activeTab === 1 && <div dangerouslySetInnerHTML={{ __html: \`${q2Text.replace(/`/g, "\\`").trim()}\` }} />}
            {activeTab === 2 && <div dangerouslySetInnerHTML={{ __html: \`${q3Text.replace(/`/g, "\\`").trim()}\` }} />}
            
            <div className="mt-12 border-t border-slate-100 pt-8 pb-8">
              <button 
                onClick={() => setShowAnswers(!showAnswers)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center w-full sm:w-auto"
              >
                {showAnswers ? 'Hide Answers' : 'Show Answers'}
              </button>
              
              {showAnswers && (
                <div className="mt-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-lg mb-4">Answers</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                      ${ansCol1.map(a => `<p>${a}</p>`).join('\\n                      ')}
                    </div>
                    <div>
                      ${ansCol2.map(a => `<p>${a}</p>`).join('\\n                      ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Pane: Passages */}
        <section className="w-1/2 relative z-10 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden">
          {/* Tabs Header */}
          <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 pt-4 gap-2">
            {[1, 2, 3].map((tabNum, idx) => (
              <button
                key={tabNum}
                onClick={() => setActiveTab(idx)}
                className={\`px-6 py-3 rounded-t-lg font-bold text-sm transition-colors border-x border-t \${
                  activeTab === idx 
                    ? 'bg-white border-slate-200 text-blue-700 shadow-sm relative top-[1px]' 
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }\`}
              >
                Passage {tabNum}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="p-10 prose prose-slate prose-headings:text-slate-800 prose-p:text-slate-700 prose-p:mb-6 prose-strong:text-slate-700 max-w-none overflow-y-auto scroll-smooth flex-1">
            {activeTab === 0 && <div dangerouslySetInnerHTML={{ __html: \`${p1Text.replace(/`/g, "\\`").trim()}\` }} />}
            {activeTab === 1 && <div dangerouslySetInnerHTML={{ __html: \`${p2Text.replace(/`/g, "\\`").trim()}\` }} />}
            {activeTab === 2 && <div dangerouslySetInnerHTML={{ __html: \`${p3Text.replace(/`/g, "\\`").trim()}\` }} />}
          </div>
        </section>
      </main>
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, '../app/test/230/reading/page.tsx'), pageContent, 'utf8');
console.log('Fixed page.tsx');
