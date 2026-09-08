"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Highlighter, Trash2 } from 'lucide-react';

export default function IELTSReadingTest18_2() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [activeTab, setActiveTab] = useState(0);
  const [highlightCount, setHighlightCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const passageRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  const correctAnswers: Record<number, string> = {
    1: '(deer) antlers',
    2: '(timber) posts',
    3: 'Tree trunk',
    4: 'Oxen',
    5: 'Glaciers',
    6: 'Druids',
    7: 'Burial',
    8: 'Calendar',
    9: 'True',
    10: 'False',
    11: 'False',
    12: 'True',
    13: 'Not given',
    14: 'C',
    15: 'A',
    16: 'B',
    17: 'D',
    18: 'C',
    19: 'D',
    20: 'Yes',
    21: 'Not given',
    22: 'No',
    23: 'Yes',
    24: 'C',
    25: 'A',
    26: 'E',
    27: 'Not given',
    28: 'Not given',
    29: 'True',
    30: 'False',
    31: 'True',
    32: 'Not given',
    33: 'False',
    34: 'Transport',
    35: 'Staircases',
    36: 'Engineering',
    37: 'Rule',
    38: 'Roman',
    39: 'Paris',
    40: 'Outwards',
  };

  const collectUserAnswers = useCallback(() => {
    if (!questionsRef.current) return;
    const inputs = questionsRef.current.querySelectorAll('input[type="text"]:not([type="hidden"])');
    const ans: string[] = [];
    inputs.forEach((input) => {
      ans.push((input as HTMLInputElement).value.trim());
    });
    setUserAnswers(ans);
  }, []);

  const isAnswerCorrect = (userAns: string, correctAns: string) => {
    if (!userAns) return false;
    const c = correctAns.toLowerCase();
    const u = userAns.toLowerCase();
    if (c.includes(' or ') || c.includes('/ ') || c.includes(', ')) {
      const sep = c.includes(' or ') ? ' or ' : c.includes('/ ') ? '/ ' : ', ';
      return c.split(sep).map(o => o.trim()).includes(u);
    }
    if (c.includes('(')) {
      const w = c.replace(/\([^)]+\)\s*/g, '').trim();
      const wp = c.replace(/[()]/g, '').trim();
      return u === w || u === wp || u === c;
    }
    return u === c;
  };

  const updateHighlightCount = useCallback(() => {
    if (passageRef.current) {
      setHighlightCount(passageRef.current.querySelectorAll('mark.user-highlight').length);
    }
  }, []);

  const handleHighlight = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (!passageRef.current?.contains(range.commonAncestorContainer)) return;
    const anchorEl = selection.anchorNode?.parentElement;
    const focusEl = selection.focusNode?.parentElement;
    if (anchorEl?.tagName === 'INPUT' || focusEl?.tagName === 'INPUT') return;
    const mark = document.createElement('mark');
    mark.className = 'user-highlight';
    mark.style.backgroundColor = '#fef08a';
    mark.style.borderRadius = '2px';
    mark.style.padding = '1px 0';
    mark.style.cursor = 'pointer';
    mark.style.transition = 'background-color 0.2s ease';
    mark.title = 'Click to remove highlight';
    mark.addEventListener('click', () => {
      const parent = mark.parentNode;
      if (parent) {
        while (mark.firstChild) { parent.insertBefore(mark.firstChild, mark); }
        parent.removeChild(mark);
        parent.normalize();
        updateHighlightCount();
      }
    });
    try { range.surroundContents(mark); } catch {
      const fragment = range.extractContents();
      mark.appendChild(fragment);
      range.insertNode(mark);
    }
    selection.removeAllRanges();
    updateHighlightCount();
  }, [updateHighlightCount]);

  const clearAllHighlights = useCallback(() => {
    if (!passageRef.current) return;
    const marks = passageRef.current.querySelectorAll('mark.user-highlight');
    marks.forEach((m) => {
      const parent = m.parentNode;
      if (parent) {
        while (m.firstChild) { parent.insertBefore(m.firstChild, m); }
        parent.removeChild(m);
        parent.normalize();
      }
    });
    setHighlightCount(0);
  }, []);

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

  const inputClass = "inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-8 shadow-sm z-20">
        <div className="flex items-center">
          <Link href="/" className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">Reading 18.2</h1>
        </div>
<div className="flex items-center gap-3">
          {highlightCount > 0 && (
            <button
              onClick={clearAllHighlights}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-all text-sm font-semibold shadow-sm"
              title="Clear all highlights"
            >
              <Trash2 className="w-4 h-4" />
              Clear All ({highlightCount})
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50/60 border border-amber-200/50 text-amber-600 text-sm font-medium">
            <Highlighter className="w-4 h-4" />
            <span>Select text to highlight</span>
          </div>
          <div className="flex items-center bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200 shadow-inner">
            <Clock className="w-5 h-5 text-slate-500 mr-3" />
            <span className="font-mono text-xl font-bold text-slate-700">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex flex-1 overflow-hidden relative p-6 gap-6">
        {/* Left Pane: Questions */}
        <section className="w-1/2 relative z-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-y-auto scroll-smooth flex flex-col">
          <div ref={questionsRef} className="p-10 prose prose-slate prose-p:mb-6 prose-headings:text-slate-800 prose-p:text-slate-700 max-w-none flex-1">
            <div style={{ display: activeTab === 0 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: justify;"><strong>Questions 1-8</strong><br />Complete the notes below. Choose <strong>NO MORE THAN TWO WORDS</strong> from the passage for each answer. Write your answers in boxes 1-8 on your answer sheet.</p>

<p style="text-align: justify;"><strong>Stonehenge</strong></p>

<p style="text-align: justify;"><strong>Construction</strong><br />
<strong>Stage 1:</strong><br />
• the ditch and henge were dug, possibly using tools made from (1) <input type="text" class="${inputClass}" /><br />
• (2) <input type="text" class="${inputClass}" /> may have been arranged in deep pits inside the circle</p>

<p style="text-align: justify;"><strong>Stage 2:</strong><br />
• bluestones from the Preseli Hills were placed in standing position<br />
• theories about the transportation of the bluestones:<br />
&nbsp;&nbsp;o <em>archaeological:</em><br />
&nbsp;&nbsp;&nbsp;&nbsp;– builders used (3) <input type="text" class="${inputClass}" /> to make sledges and rollers<br />
&nbsp;&nbsp;&nbsp;&nbsp;– (4) <input type="text" class="${inputClass}" /> pulled them on giant baskets<br />
&nbsp;&nbsp;o <em>geological:</em><br />
&nbsp;&nbsp;&nbsp;&nbsp;– they were brought from Wales by (5) <input type="text" class="${inputClass}" /></p>

<p style="text-align: justify;"><strong>Stage 3:</strong><br />
• sandstone slabs were arranged into an outer crescent or ring</p>

<p style="text-align: justify;"><strong>Builders</strong><br />
• a theory arose in the 17th century that its builders were Celtic (6) <input type="text" class="${inputClass}" /></p>

<p style="text-align: justify;"><strong>Purpose</strong><br />
• many experts agree it has been used as a (7) <input type="text" class="${inputClass}" /> site<br />
• in the 1960s, it was suggested that it worked as a kind of (8) <input type="text" class="${inputClass}" /></p>

<p style="text-align: justify;"><strong>Questions 9-13</strong><br />Do the following statements agree with the information given in reading passage? In boxes 9-13 on your answer sheet, write</p>
<p style="text-align: justify;">
<strong>TRUE</strong> if the statement agrees with the information<br />
<strong>FALSE</strong> if the statement contradicts the information<br />
<strong>NOT GIVEN</strong> if there is no information on this
</p>
<p style="text-align: justify;">
9. <input type="text" class="${inputClass}" /> During the third phase of construction, sandstone slabs were placed in both the outer areas and the middle of the Stonehenge site.<br />
10. <input type="text" class="${inputClass}" /> There is scientific proof that the bluestones stood in the same spot until approximately 1600 BCE.<br />
11. <input type="text" class="${inputClass}" /> John Aubrey’s claim about Stonehenge was supported by 20th-century findings.<br />
12. <input type="text" class="${inputClass}" /> Objects discovered at Stonehenge seem to indicate that it was constructed by a number of different groups of people.<br />
13. <input type="text" class="${inputClass}" /> Criticism of Gerald Hawkins’ theory about Stonehenge has come mainly from other astronomers.
</p>
`
                }}
              />

            <div style={{ display: activeTab === 1 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: justify;"><strong>Questions 14-19</strong><br />Choose the correct letter, <strong>A, B, C or D</strong>.</p>

<p style="text-align: justify;">
14. <input type="text" class="${inputClass}" /> What point does the writer make about AI in the first paragraph?<br />
<strong>A</strong> It is difficult to predict how quickly AI will progress.<br />
<strong>B</strong> Much can be learned about the use of AI in chess machines.<br />
<strong>C</strong> The future is unlikely to see limitations on the capabilities of AI.<br />
<strong>D</strong> Experts disagree on which specialised tasks AI will be able to perform.
</p>

<p style="text-align: justify;">
15. <input type="text" class="${inputClass}" /> What is the writer doing in the second paragraph?<br />
<strong>A</strong> explaining why machines will be able to outperform humans<br />
<strong>B</strong> describing the characteristics that humans and machines share<br />
<strong>C</strong> giving information about the development of machine intelligence<br />
<strong>D</strong> indicating which aspects of humans are the most advanced
</p>

<p style="text-align: justify;">
16. <input type="text" class="${inputClass}" /> Why does the writer mention the story of King Midas?<br />
<strong>A</strong> to compare different visions of progress<br />
<strong>B</strong> to illustrate that poorly defined objectives can go wrong<br />
<strong>C</strong> to emphasise the need for cooperation<br />
<strong>D</strong> to point out the financial advantages of a course of action
</p>

<p style="text-align: justify;">
17. <input type="text" class="${inputClass}" /> What challenge does the writer refer to in the fourth paragraph?<br />
<strong>A</strong> encouraging humans to behave in a more principled way<br />
<strong>B</strong> deciding which values we want AI to share with us<br />
<strong>C</strong> creating a better world for all creatures on the planet<br />
<strong>D</strong> ensuring AI is more human-friendly than we are ourselves
</p>

<p style="text-align: justify;">
18. <input type="text" class="${inputClass}" /> What does the writer suggest about the future of AI in the fifth paragraph?<br />
<strong>A</strong> The safety of machines will become a key issue.<br />
<strong>B</strong> It is hard to know what impact machines will have on the world.<br />
<strong>C</strong> Machines will be superior to humans in certain respects.<br />
<strong>D</strong> Many humans will oppose machines having a wider role.
</p>

<p style="text-align: justify;">
19. <input type="text" class="${inputClass}" /> Which of the following best summarises the writer’s argument in the sixth paragraph?<br />
<strong>A</strong> More intelligent machines will result in greater abuses of power.<br />
<strong>B</strong> Machine learning will share very few features with human learning.<br />
<strong>C</strong> There are a limited number of people with the knowledge to program machines.<br />
<strong>D</strong> Human shortcomings will make creating the machines we need more difficult.
</p>

<p style="text-align: justify;"><strong>Questions 20-23</strong><br />Do the following statements agree with the information given in reading passage? In boxes 20-23 on your answer sheet, write</p>
<p style="text-align: justify;">
<strong>YES</strong> if the statement agrees with the information<br />
<strong>NO</strong> if the statement contradicts the information<br />
<strong>NOT GIVEN</strong> if there is no information on this
</p>

<p style="text-align: justify;">
20. <input type="text" class="${inputClass}" /> Machines with the ability to make moral decisions may prevent us from promoting the interests of our communities.<br />
21. <input type="text" class="${inputClass}" /> Silicon police would need to exist in large numbers in order to be effective.<br />
22. <input type="text" class="${inputClass}" /> Many people are comfortable with the prospect of their independence being restricted by machines.<br />
23. <input type="text" class="${inputClass}" /> If we want to ensure that machines act in our best interests, we all need to work together.
</p>

<p style="text-align: justify;"><strong>Questions 24-26</strong><br />Complete the summary using the list of phrases, A-F, below. Write the correct letter, <strong>A-F</strong>, in boxes 24-26 on your answer sheet.</p>

<p style="text-align: center;"><strong>Using AI in the UK health system</strong></p>
<p style="text-align: justify;">AI currently has a limited role in the way (24) <input type="text" class="${inputClass}" /> are allocated in the health service. The positive aspect of AI having a bigger role is that it would be more efficient and lead to patient benefits. However, such a change would result, for example, in certain (25) <input type="text" class="${inputClass}" /> not having their current level of (26) <input type="text" class="${inputClass}" /> It is therefore important that AI goals are appropriate so that discriminatory practices could be avoided.</p>

<div class="grid grid-cols-2 gap-2 my-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm">
  <div><strong>A</strong> medical practitioners</div>
  <div><strong>B</strong> specialised tasks</div>
  <div><strong>C</strong> available resources</div>
  <div><strong>D</strong> reduced illness</div>
  <div><strong>E</strong> professional authority</div>
  <div><strong>F</strong> technology experts</div>
</div>
`
                }}
              />

            <div style={{ display: activeTab === 2 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: justify;"><strong>Questions 27-33</strong><br />Do the following statements agree with the information given in reading passage? In boxes 27-33 on your answer sheet, write</p>
<p style="text-align: justify;">
<strong>TRUE</strong> if the statement agrees with the information<br />
<strong>FALSE</strong> if the statement contradicts the information<br />
<strong>NOT GIVEN</strong> if there is no information on this
</p>

<p style="text-align: justify;">
27. <input type="text" class="${inputClass}" /> People first referred to Leonardo da Vinci as a genius 500 years ago.<br />
28. <input type="text" class="${inputClass}" /> The current climate crisis is predicted to cause more deaths than the plague.<br />
29. <input type="text" class="${inputClass}" /> Some of the challenges we face today can be compared to those of earlier times.<br />
30. <input type="text" class="${inputClass}" /> Leonardo da Vinci’s ‘ideal city’ was constructed in the 15th century.<br />
31. <input type="text" class="${inputClass}" /> Poor town planning is a major contributor to climate change.<br />
32. <input type="text" class="${inputClass}" /> In Renaissance times, local people fought against the changes to Pienza and Ferrara.<br />
33. <input type="text" class="${inputClass}" /> Leonardo da Vinci kept a neat, organised record of his designs.
</p>

<p style="text-align: justify;"><strong>Questions 34-40</strong><br />Complete the summary below. Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p>

<p style="text-align: center;"><strong>Leonardo da Vinci’s ideal city</strong></p>
<p style="text-align: justify;">A collection of Leonardo da Vinci’s paperwork reveals his design of a new city beside the Ticino River. This was to provide better (34) <input type="text" class="${inputClass}" /> for trade and a less polluted environment. Although Leonardo da Vinci’s city shared many of the ideals of his time, some of his innovations were considered unconventional in their design. They included features that can be seen in some tower blocks today, such as (35) <input type="text" class="${inputClass}" /> on the exterior of a building. Leonardo da Vinci wasn’t only an architect. His expertise in (36) <input type="text" class="${inputClass}" /> was evident in his plans for artificial canals within his ideal city. He also believed that the height of houses should relate to the width of streets in case earthquakes occurred. The design of many cities in Italy today follows this (37) <input type="text" class="${inputClass}" /></p>

<p style="text-align: justify;">While some cities from (38) <input type="text" class="${inputClass}" /> times have aspects that can also be found in Leonardo’s designs, his ideas weren’t put into practice until long after his death. (39) <input type="text" class="${inputClass}" /> is one example of a city that was redesigned in the 19th century in the way that Leonardo had envisaged. His ideas are also relevant to today’s world, where building (40) <input type="text" class="${inputClass}" /> no longer seems to be the best approach.</p>
`
                }}
              />

            <div className="mt-12 border-t border-slate-100 pt-8 pb-8">
              <button 
                onClick={() => {
                  if (!showAnswers) collectUserAnswers();
                  setShowAnswers(!showAnswers);
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center w-full sm:w-auto"
              >
                {showAnswers ? 'Hide Answers' : 'Show Answers'}
              </button>
              
              {showAnswers && (
                <div className="mt-6 space-y-6">
                  {/* Your Answers vs Correct Answers */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200">
                    <h3 className="font-bold text-lg mb-4 text-blue-800 flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">✎</span>
                      Your Answers
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-blue-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-blue-100">
                            <th className="py-2.5 px-4 text-left font-bold text-blue-900 w-16">#</th>
                            <th className="py-2.5 px-4 text-left font-bold text-blue-900">Your Answer</th>
                            <th className="py-2.5 px-4 text-left font-bold text-blue-900">Correct Answer</th>
                            <th className="py-2.5 px-4 text-center font-bold text-blue-900 w-16">✓/✗</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: 40 }, (_, i) => {
                            const qNum = i + 1;
                            const userAns = userAnswers[i] || '';
                            const correctAns = correctAnswers[qNum] || '';
                            const correct = isAnswerCorrect(userAns, correctAns);
                            const answered = userAns.length > 0;
                            return (
                              <tr key={qNum} className={`border-t border-blue-100 ${i % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}>
                                <td className="py-2 px-4 font-bold text-slate-600">{qNum}</td>
                                <td className={`py-2 px-4 font-semibold ${
                                  !answered ? 'text-slate-400 italic' : correct ? 'text-emerald-700' : 'text-red-600'
                                }`}>
                                  {answered ? userAns : '—'}
                                </td>
                                <td className="py-2 px-4 font-semibold text-slate-700">{correctAns}</td>
                                <td className="py-2 px-4 text-center text-lg">
                                  {!answered ? (
                                    <span className="text-slate-300">—</span>
                                  ) : correct ? (
                                    <span className="text-emerald-500">✓</span>
                                  ) : (
                                    <span className="text-red-500">✗</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-semibold">
                        <span>✓</span>
                        <span>{userAnswers.filter((ans, i) => ans && isAnswerCorrect(ans, correctAnswers[i + 1] || '')).length} / 40 Correct</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-semibold">
                        <span>✗</span>
                        <span>{userAnswers.filter((ans, i) => ans && !isAnswerCorrect(ans, correctAnswers[i + 1] || '')).length} Wrong</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg font-semibold">
                        <span>—</span>
                        <span>{40 - userAnswers.filter(a => a).length} Unanswered</span>
                      </div>
                    </div>
                  </div>

                  {/* Answer Key */}
                  <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Answer Key</h3>
                    <div className="text-sm text-slate-700">
                      <p>1. (deer) antlers<br />2. (timber) posts<br />3. Tree trunk<br />4. Oxen<br />5. Glaciers<br />6. Druids<br />7. Burial<br />8. Calendar<br />9. True<br />10. False<br />11. False<br />12. True<br />13. Not given<br />14. C<br />15. A<br />16. B<br />17. D<br />18. C<br />19. D<br />20. Yes<br />21. Not given<br />22. No<br />23. Yes<br />24. C<br />25. A<br />26. E<br />27. Not given<br />28. Not given<br />29. True<br />30. False<br />31. True<br />32. Not given<br />33. False<br />34. Transport<br />35. Staircases<br />36. Engineering<br />37. Rule<br />38. Roman<br />39. Paris<br />40. Outwards</p>
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
                className={`px-6 py-3 rounded-t-lg font-bold text-sm transition-colors border-x border-t ${
                  activeTab === idx 
                    ? 'bg-white border-slate-200 text-blue-700 shadow-sm relative top-[1px]' 
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                Passage {tabNum}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div ref={passageRef} onMouseUp={handleHighlight} className="p-10 prose prose-slate prose-headings:text-slate-800 prose-p:text-slate-700 prose-p:mb-6 prose-strong:text-slate-700 max-w-none overflow-y-auto scroll-smooth flex-1 selection:bg-amber-200/50">
            <div style={{ display: activeTab === 0 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: center;"><strong>Stonehenge</strong></p>
<p style="text-align: justify;">For centuries, historians and archaeologists have puzzled over the many mysteries of Stonehenge, a prehistoric monument that took an estimated 1,500 years to erect. Located on Salisbury Plain in southern England, it is comprised of roughly 100 massive upright stones placed in a circular layout.</p>
<p style="text-align: justify;">Archaeologists believe England’s most iconic prehistoric ruin was built in several stages, with the earliest constructed 5,000 or more years ago. First, Neolithic Britons used primitive tools, which may have been fashioned out of deer antlers, to dig a massive circular ditch and bank, or henge. Deep pits dating back to that era and located within the circle may have once held a ring of timber posts, according to some scholars.</p>
<p style="text-align: justify;">Several hundred years later, it is thought, Stonehenge’s builders hoisted an estimated 80 bluestones, 43 of which remain today, into standing positions and placed them in either a horseshoe or circular formation. These stones have been traced all the way to the Preseli Hills in Wales, some 300 kilometres from Stonehenge. How, then, did prehistoric builders without sophisticated tools or engineering haul these boulders, which weigh up to four tons, over such a great distance?</p>
<p style="text-align: justify;">According to one long-standing theory among archaeologists, Stonehenge’s builders fashioned sledges and rollers out of tree trunks to lug the bluestones from the Preseli Hills. They then transferred the boulders onto rafts and floated them first along the Welsh coast and then up the River Avon toward Salisbury Plain; alternatively, they may have towed each stone with a fleet of vessels. More recent archaeological hypotheses have them transporting the bluestones with supersized wicker baskets on a combination of ball bearings and long grooved planks, hauled by oxen.</p>
<p style="text-align: justify;">As early as the 1970s, geologists have been adding their voices to the debate over how Stonehenge came into being. Challenging the classic image of industrious builders pushing, carting, rolling or hauling giant stones from faraway Wales, some scientists have suggested that it was glaciers, not humans, that carried the bluestones to Salisbury Plain. Most archaeologists have remained sceptical about this theory, however, wondering how the forces of nature could possibly have delivered the exact number of stones needed to complete the circle.</p>
<p style="text-align: justify;">The third phase of construction took place around 2000 BCE. At this point, sandstone slabs – known as ‘sarsens’ – were arranged into an outer crescent or ring; some were assembled into the iconic three-pieced structures called trilithons that stand tall in the centre of Stonehenge. Some 50 of these stones are now visible on the site, which may once have contained many more. Radiocarbon dating has revealed that work continued at Stonehenge until roughly 1600 BCE, with the bluestones in particular being repositioned multiple times.</p>
<p style="text-align: justify;">But who were the builders of Stonehenge? In the 17th century, archaeologist John Aubrey made the claim that Stonehenge was the work of druids, who had important religious, judicial and political roles in Celtic society. This theory was widely popularized by the antiquarian William Stukeley, who had unearthed primitive graves at the site. Even today, people who identify as modern druids continue to gather at Stonehenge for the summer solstice. However, in the mid-20th century, radiocarbon dating demonstrated that Stonehenge stood more than 1,000 years before the Celts inhabited the region.</p>
<p style="text-align: justify;">Many modern historians and archaeologists now agree that several distinct tribes of people contributed to Stonehenge, each undertaking a different phase of its construction. Bones, tools and other artefacts found on the site seem to support this hypothesis. The first stage was achieved by Neolithic agrarians who were likely to have been indigenous to the British Isles. Later, it is believed, groups with advanced tools and a more communal way of life left their mark on the site. Some believe that they were immigrants from the European continent, while others maintain that they were probably native Britons, descended from the original builders.</p>
<p style="text-align: justify;">If the facts surrounding the architects and construction of Stonehenge remain shadowy at best, the purpose of the striking monument is even more of a mystery. While there is consensus among the majority of modern scholars that Stonehenge once served the function of burial ground, they have yet to determine what other purposes it had.</p>
<p style="text-align: justify;">In the 1960s, the astronomer Gerald Hawkins suggested that the cluster of megalithic stones operated as a form of calendar, with different points corresponding to astrological phenomena such as solstices, equinoxes and eclipses occurring at different times of the year. While his theory has received a considerable amount of attention over the decades, critics maintain that Stonehenge’s builders probably lacked the knowledge necessary to predict such events or that England’s dense cloud cover would have obscured their view of the skies.</p>
<p style="text-align: justify;">More recently, signs of illness and injury in the human remains unearthed at Stonehenge led a group of British archaeologists to speculate that it was considered a place of healing, perhaps because bluestones were thought to have curative powers.</p>
`
                }}
              />

            <div style={{ display: activeTab === 1 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: center;"><strong>Living with artificial intelligence</strong></p>
<p style="text-align: justify;"><em>Powerful artificial intelligence (AI) needs to be reliably aligned with human values, but does this mean AI will eventually have to police those values?</em></p>
<p style="text-align: justify;">This has been the decade of AI, with one astonishing feat after another. A chess-playing AI that can defeat not only all human chess players, but also all previous human-programmed chess machines, after learning the game in just four hours? That’s yesterday’s news, what’s next? True, these prodigious accomplishments are all in so-called narrow AI, where machines perform highly specialised tasks. But many experts believe this restriction is very temporary. By mid-century, we may have artificial general intelligence (AGI) – machines that can achieve human-level performance on the full range of tasks that we ourselves can tackle.</p>
<p style="text-align: justify;">If so, there’s little reason to think it will stop there. Machines will be free of many of the physical constraints on human intelligence. Our brains run at slow biochemical processing speeds on the power of a light bulb, and their size is restricted by the dimensions of the human birth canal. It is remarkable what they accomplish, given these handicaps. But they may be as far from the physical limits of thought as our eyes are from the incredibly powerful Webb Space Telescope.</p>
<p style="text-align: justify;">Once machines are better than us at designing even smarter machines, progress towards these limits could accelerate. What would this mean for us? Could we ensure a safe and worthwhile coexistence with such machines? On the plus side, AI is already useful and profitable for many things, and super AI might be expected to be super useful, and super profitable. But the more powerful AI becomes, the more important it will be to specify its goals with great care. Folklore is full of tales of people who ask for the wrong thing, with disastrous consequences – King Midas, for example, might have wished that everything he touched turned to gold, but didn’t really intend this to apply to his breakfast.</p>
<p style="text-align: justify;">So we need to create powerful AI machines that are ‘human-friendly’ – that have goals reliably aligned with our own values. One thing that makes this task difficult is that we are far from reliably human-friendly ourselves. We do many terrible things to each other and to many other creatures with whom we share the planet. If superintendent machines don’t do a lot better than us, we’ll be in deep trouble. We’ll have powerful new intelligence amplifying the dark sides of our own fallible natures.</p>
<p style="text-align: justify;">For safety’s sake, then, we want the machines to be ethically as well as cognitively superhuman. We want them to aim for the moral high ground, not for the troughs in which many of us spend some of our time. Luckily they’ll be smart enough for the job. If there are routes to the moral high ground, they’ll be better than us at finding them, and steering us in the right direction.</p>
<p style="text-align: justify;">However, there are two big problems with this utopian vision. One is how we get the machines started on the journey, the other is what it would mean to reach this destination. The ‘getting started’ problem is that we need to tell the machines what they’re looking for with sufficient clarity that we can be confident they will find it – whatever ‘it’ actually turns out to be. This won’t be easy, given that we are tribal creatures and conflicted about the ideals ourselves. We often ignore the suffering of strangers, and even contribute to it, at least indirectly. How then, do we point machines in the direction of something better?</p>
<p style="text-align: justify;">As for the ‘destination’ problem, we might, by putting ourselves in the hands of these moral guides and gatekeepers, be sacrificing our own autonomy – an important part of what makes us human. Machines who are better than us at sticking to the moral high ground may be expected to discourage some of the lapses we presently take for granted. We might lose our freedom to discriminate in favour of our own communities, for example. Loss of freedom to behave badly isn’t always a bad thing, of course: denying ourselves the freedom to put children to work in factories, or to smoke in restaurants are signs of progress. But are we ready for ethical silicon police limiting our options? They might be so good at doing it that we won’t notice them; but few of us are likely to welcome such a future.</p>
<p style="text-align: justify;">These issues might seem far-fetched, but they are to some extent already here. AI already has some input into how resources are used in our National Health Service (NHS) here in the UK, for example. If it was given a greater role, it might do so much more efficiently than humans can manage, and act in the interests of taxpayers and those who use the health system. However, we’d be depriving some humans (e.g. senior doctors) of the control they presently enjoy. Since we’d want to ensure that people are treated equally and that policies are fair, the goals of AI would need to be specified correctly.</p>
<p style="text-align: justify;">We have a new powerful technology to deal with – itself, literally, a new way of thinking. For our own safety, we need to point these new thinkers in the right direction, and get them to act well for us. It is not yet clear whether this is possible, but if it is, it will require a cooperative spirit, and a willingness to set aside self-interest. Both general intelligence and moral reasoning are often thought to be uniquely human capacities. But safety seems to require that we think of them as a package: if we are to give general intelligence to machines, we’ll need to give them moral authority, too. And where exactly would that leave human beings? All the more reason to think about the destination now, and to be careful about what we wish for.</p>
`
                }}
              />

            <div style={{ display: activeTab === 2 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: center;"><strong>An ideal city</strong></p>
<p style="text-align: center;"><em>Leonardo da Vinci’s ideal city was centuries ahead of its time</em></p>
<p style="text-align: justify;">The word ‘genius’ is universally associated with the name of Leonardo da Vinci. A true Renaissance man, he embodied scientific spirit, artistic talent and humanist sensibilities. Five hundred years have passed since Leonardo died in his home at Chateau du Clos Luce, outside Tours, France. Yet far from fading into insignificance, his thinking has carried down the centuries and still surprises today.</p>
<p style="text-align: justify;">The Renaissance marked the transition from the 15th century to modernity and took place after the spread of the plague in the 14th century, which caused a global crisis resulting in some 200 million deaths across Europe and Asia. Today, the world is on the cusp of a climate crisis, which is predicted to cause widespread displacement, extinctions and death, if left unaddressed. Then, as now, radical solutions were called for to revolutionise the way people lived and safeguard humanity against catastrophe.</p>
<p style="text-align: justify;">Around 1486 – after a pestilence that killed half the population in Milan, Italy – Leonardo turned his thoughts to urban planning problems. Following a typical Renaissance trend, he began to work on an ‘ideal city’ project, which – due to its excessive costs – would remain unfulfilled. Yet given that unsustainable urban models are a key cause of global climate change today, it’s only natural to wonder how Leonardo might have changed the shape of modern cities.</p>
<p style="text-align: justify;">Although the Renaissance is renowned as an era of incredible progress in art and architecture, it is rarely noted that the 15th century also marked the birth of urbanism as a true academic discipline. The rigour and method behind the conscious conception of a city had been largely missing in Western thought until the moment when prominent Renaissance men pushed forward large-scale urban projects in Italy, such as the reconfiguration of the town of Pienza and the expansion of the city of Ferrara. These works surely inspired Leonardo’s decision to rethink the design of medieval cities, with their winding and overcrowded streets and with houses piled against one another.</p>
<p style="text-align: justify;">It is not easy to identify a coordinated vision of Leonardo’s ideal city because of his disordered way of working with notes and sketches. But from the largest collection of Leonardo’s papers ever assembled, a series of innovative thoughts can be reconstructed regarding the foundation of a new city along the Ticino River, which runs from Switzerland into Italy and is 248 kilometres long. He designed the city for the easy transport of goods and clean urban spaces, and he wanted a comfortable and spacious city, with well-ordered streets and architecture. He recommended ‘high, strong walls’, with ‘towers and battlements of all necessary and pleasant beauty’.</p>
<p style="text-align: justify;">His plans for a modern and ‘rational’ city were consistent with Renaissance ideals. But, in keeping with his personality, Leonardo included several innovations in his urban design. Leonardo wanted the city to be built on several levels, linked with vertical outdoor staircases. This design can be seen in some of today’s high-rise buildings but was unconventional at the time. Indeed, this idea of taking full advantage of the interior spaces wasn’t implemented until the 1920s and 1930s, with the birth of the Modernist movement.</p>
<p style="text-align: justify;">While in the upper layers of the city, people could walk undisturbed between elegant palaces and streets, the lower layer was the place for services, trade, transport and industry. But the true originality of Leonardo’s vision was its fusion of architecture and engineering. Leonardo designed extensive hydraulic plants to create artificial canals throughout the city. The canals, regulated by clocks and basins, were supposed to make it easier for boats to navigate inland. Leonardo also thought that the width of the streets ought to match the average height of the adjacent houses: a rule still followed in many contemporary cities across Italy, to allow access to sun and reduce the risk of damage from earthquakes.</p>
<p style="text-align: justify;">Although some of these features existed in Roman cities, before Leonardo’s drawings there had never been a multi-level, compact modern city which was thoroughly technically conceived. Indeed, it wasn’t until the 19th century that some of his ideas were applied. For example, the subdivision of the city by function – with services and infrastructures located in the lower levels and wide and well-ventilated boulevards and walkways above for residents – is an idea that can be found in Georges-Eugene Haussmann’s renovation of Paris under Emperor Napoleon III between 1853 and 1870.</p>
<p style="text-align: justify;">Today, Leonardo’s ideas are not simply valid, they actually suggest a way forward for urban planning. Many scholars think that the compact city, built upwards instead of outwards, integrated with nature (especially water systems), with efficient transport infrastructure, could help modern cities become more efficient and sustainable. This is yet another reason why Leonardo was aligned so closely with modern urban planning and centuries ahead of his time.</p>
`
                }}
              />
          </div>
        </section>
      </main>
    </div>
  );
}
