"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Highlighter, Trash2 } from 'lucide-react';

export default function IELTSReadingTest18_4() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [activeTab, setActiveTab] = useState(0);
  const [highlightCount, setHighlightCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const passageRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  const correctAnswers: Record<number, string> = {
    1: 'D',
    2: 'C',
    3: 'E',
    4: 'B',
    5: 'D',
    6: 'Energy',
    7: 'Food',
    8: 'Gardening',
    9: 'Obesity',
    10: 'C, D',
    11: 'C, D',
    12: 'A, D',
    13: 'A, D',
    14: 'B',
    15: 'C',
    16: 'D',
    17: 'C',
    18: 'B',
    19: 'A',
    20: 'E',
    21: 'B',
    22: 'D',
    23: 'Yes',
    24: 'No',
    25: 'Not given',
    26: 'Yes',
    27: 'Yes',
    28: 'Not given',
    29: 'No',
    30: 'No',
    31: 'I',
    32: 'F',
    33: 'A',
    34: 'C',
    35: 'H',
    36: 'E',
    37: 'B',
    38: 'A',
    39: 'D',
    40: 'C',
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
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">Reading 18.4</h1>
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
<p style="text-align: justify;"><strong>Questions 1-5</strong><br />Reading Passage 1 has five paragraphs, A-E. Which paragraph contains the following information? Write the correct letter, <strong>A-E</strong>, in boxes 1-5 on your answer sheet. NB You may use any letter more than once.</p>

<p style="text-align: justify;">
1. <input type="text" class="${inputClass}" /> mention of several challenges to be overcome before a green roof can be installed<br />
2. <input type="text" class="${inputClass}" /> reference to a city where green roofs have been promoted for many years<br />
3. <input type="text" class="${inputClass}" /> a belief that existing green roofs should be used as a model for new ones<br />
4. <input type="text" class="${inputClass}" /> examples of how green roofs can work in combination with other green urban initiatives<br />
5. <input type="text" class="${inputClass}" /> the need to make a persuasive argument for the financial benefits of green roofs
</p>

<p style="text-align: justify;"><strong>Questions 6-9</strong><br />Complete the summary below. Choose <strong>ONE WORD ONLY</strong> from the passage for each answer. Write your answers in boxes 6-9 on your answer sheet.</p>

<p style="text-align: center;"><strong>Advantages of green roofs</strong></p>
<p style="text-align: justify;">City rooftops covered with greenery have many advantages. These include lessening the likelihood that floods will occur, reducing how much money is spent on (6) <input type="text" class="${inputClass}" /> and creating environments that are suitable for wildlife. In many cases, they can also be used for producing (7) <input type="text" class="${inputClass}" /> There are also social benefits of green roofs. For example, the medical profession recommends (8) <input type="text" class="${inputClass}" /> as an activity to help people cope with mental health issues. Studies have also shown that the availability of green spaces can prevent physical problems such as (9) <input type="text" class="${inputClass}" /></p>

<p style="text-align: justify;"><strong>Questions 10 and 11</strong><br />Choose <strong>TWO</strong> letters, <strong>A-E</strong>. Write the correct letters in boxes 10 and 11 on your answer sheet.</p>

<p style="text-align: justify;">Which <strong>TWO</strong> advantages of using newer buildings for green roofs are mentioned in Paragraph C of the passage?<br />
<strong>A</strong> a longer growing season for edible produce<br />
<strong>B</strong> more economical use of water<br />
<strong>C</strong> greater water-storage capacity<br />
<strong>D</strong> ability to cultivate more plant types<br />
<strong>E</strong> a large surface area for growing plants</p>

<p style="text-align: justify;">
10. <input type="text" class="${inputClass}" /><br />
11. <input type="text" class="${inputClass}" />
</p>

<p style="text-align: justify;"><strong>Questions 12 and 13</strong><br />Choose <strong>TWO</strong> letters, <strong>A-E</strong>. Write the correct letters in boxes 12 and 13 on your answer sheet.</p>

<p style="text-align: justify;">Which <strong>TWO</strong> aims of new variations on the concept of green roofs are mentioned in Paragraph E of the passage?<br />
<strong>A</strong> to provide habitats for a wide range of species<br />
<strong>B</strong> to grow plants successfully even in the wettest climates<br />
<strong>C</strong> to regulate the temperature of the immediate environment<br />
<strong>D</strong> to generate power from a sustainable source<br />
<strong>E</strong> to collect water to supply other buildings</p>

<p style="text-align: justify;">
12. <input type="text" class="${inputClass}" /><br />
13. <input type="text" class="${inputClass}" />
</p>
`
                }}
              />

            <div style={{ display: activeTab === 1 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: justify;"><strong>Questions 14-16</strong><br />Choose the correct letter, <strong>A, B, C or D</strong>.</p>

<p style="text-align: justify;">
14. <input type="text" class="${inputClass}" /> What can we learn from the first paragraph?<br />
<strong>A</strong> where the notion of innate intelligence first began<br />
<strong>B</strong> when ideas about the nature of intelligence began to shift<br />
<strong>C</strong> how scientists have responded to changing views of intelligence<br />
<strong>D</strong> why thinkers turned away from the idea of intelligence being fixed
</p>

<p style="text-align: justify;">
15. <input type="text" class="${inputClass}" /> The second paragraph describes how schools encourage students to<br />
<strong>A</strong> identify their personal ambitions.<br />
<strong>B</strong> help each other to realise their goals.<br />
<strong>C</strong> have confidence in their potential to succeed.<br />
<strong>D</strong> concentrate on where their particular strengths lie.
</p>

<p style="text-align: justify;">
16. <input type="text" class="${inputClass}" /> In the third paragraph, the writer suggests that students with a fixed mindset<br />
<strong>A</strong> tend to be less competitive.<br />
<strong>B</strong> generally have a low sense of self-esteem.<br />
<strong>C</strong> will only work hard if they are given constant encouragement.<br />
<strong>D</strong> are afraid to push themselves beyond what they see as their limitations.
</p>

<p style="text-align: justify;"><strong>Questions 17-22</strong><br />Look at the following statements (Questions 17-22) and the list of people below. Match each statement with the correct person or people, <strong>A-E</strong>. Write the correct letter, A-E, in boxes 17-22 on your answer sheet. NB You may use any letter more than once.</p>

<p style="text-align: justify;">
17. <input type="text" class="${inputClass}" /> The methodology behind the growth mindset studies was not strict enough.<br />
18. <input type="text" class="${inputClass}" /> The idea of the growth mindset has been incorrectly interpreted.<br />
19. <input type="text" class="${inputClass}" /> Intellectual ability is an unchangeable feature of each individual.<br />
20. <input type="text" class="${inputClass}" /> The growth mindset should be promoted without students being aware of it.<br />
21. <input type="text" class="${inputClass}" /> The growth mindset is not simply about boosting students’ morale.<br />
22. <input type="text" class="${inputClass}" /> Research shows that the growth mindset has no effect on academic achievement.
</p>

<p style="text-align: justify;"><strong>List of People</strong><br />
<strong>A</strong> Alfred Binet<br />
<strong>B</strong> Carol Dweck<br />
<strong>C</strong> Andrew Gelman<br />
<strong>D</strong> Timothy Bates<br />
<strong>E</strong> David Yeager and Gregory Walton</p>

<p style="text-align: justify;"><strong>Questions 23-26</strong><br />Do the following statements agree with the views of the writer in reading passage? In boxes 23-26 on your answer sheet, write</p>
<p style="text-align: justify;">
<strong>YES</strong> if the statement agrees with the views of the writer<br />
<strong>NO</strong> if the statement contradicts the views of the writer<br />
<strong>NOT GIVEN</strong> if it is impossible to say what the writer thinks about this
</p>

<p style="text-align: justify;">
23. <input type="text" class="${inputClass}" /> Dweck has handled criticisms of her work in an admirable way.<br />
24. <input type="text" class="${inputClass}" /> Students’ self-perception is a more effective driver of self-confidence than actual achievement is.<br />
25. <input type="text" class="${inputClass}" /> Recent evidence about growth mindset interventions has attracted unfair coverage in the media.<br />
26. <input type="text" class="${inputClass}" /> Deliberate attempts to encourage students to strive for high achievement may have a negative effect.
</p>
`
                }}
              />

            <div style={{ display: activeTab === 2 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: justify;"><strong>Questions 27-30</strong><br />Do the following statements agree with the claims of the writer in reading passage? In boxes 27-30 on your answer sheet, write</p>
<p style="text-align: justify;">
<strong>YES</strong> if the statement agrees with the claims of the writer<br />
<strong>NO</strong> if the statement contradicts the claims of the writer<br />
<strong>NOT GIVEN</strong> if it is impossible to say what the writer thinks about this
</p>

<p style="text-align: justify;">
27. <input type="text" class="${inputClass}" /> Wegener’s ideas about continental drift were widely disputed while he was alive.<br />
28. <input type="text" class="${inputClass}" /> The idea that the continents remained fixed in place was defended in a number of respected scientific publications.<br />
29. <input type="text" class="${inputClass}" /> Wegener relied on a limited range of scientific fields to support his theory of continental drift.<br />
30. <input type="text" class="${inputClass}" /> The similarities between Wegener’s theory of continental drift and modern-day plate tectonics are enormous.
</p>

<p style="text-align: justify;"><strong>Questions 31-36</strong><br />Complete the summary using the list of phrases, A-J, below. Write the correct letter, <strong>A-J</strong>, in boxes 31-36 on your answer sheet.</p>

<p style="text-align: center;"><strong>Wegener’s life and work</strong></p>
<p style="text-align: justify;">One of the remarkable things about Wegener from a (31) <input type="text" class="${inputClass}" /> is that although he proposed a theory of continental drift, he was not a geologist. His (32) <input type="text" class="${inputClass}" /> were limited to atmospheric physics. However, at the time he proposed his theory of continental drift in 1912, he was already a person of (33) <input type="text" class="${inputClass}" /> Six years previously, there had been his (34) <input type="text" class="${inputClass}" /> of 52 hours in a hot-air balloon, followed by his well-publicised but (35) <input type="text" class="${inputClass}" /> of Greenland’s coast. With the publication of his textbook on thermodynamics, he had also come to the attention of a (36) <input type="text" class="${inputClass}" /> of German scientists.</p>

<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 my-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm">
  <div><strong>A</strong> modest fame</div>
  <div><strong>B</strong> vast range</div>
  <div><strong>C</strong> record-breaking achievement</div>
  <div><strong>D</strong> research methods</div>
  <div><strong>E</strong> select group</div>
  <div><strong>F</strong> professional interests</div>
  <div><strong>G</strong> scientific debate</div>
  <div><strong>H</strong> hazardous exploration</div>
  <div><strong>I</strong> biographer’s perspective</div>
  <div><strong>J</strong> narrow investigation</div>
</div>

<p style="text-align: justify;"><strong>Questions 37-40</strong><br />Choose the correct letter, <strong>A, B, C or D</strong>.</p>

<p style="text-align: justify;">
37. <input type="text" class="${inputClass}" /> What is Mott T Greene doing in the fifth paragraph?<br />
<strong>A</strong> describing what motivated him to write the book<br />
<strong>B</strong> explaining why it is desirable to read the whole book<br />
<strong>C</strong> suggesting why Wegener pursued so many different careers<br />
<strong>D</strong> indicating what aspects of Wegener’s life interested him most
</p>

<p style="text-align: justify;">
38. <input type="text" class="${inputClass}" /> What is said about Wegener in the sixth paragraph?<br />
<strong>A</strong> He was not a particularly ambitious person.<br />
<strong>B</strong> He kept a record of all his scientific observations.<br />
<strong>C</strong> He did not adopt many of the scientific practices of the time.<br />
<strong>D</strong> He enjoyed discussing new discoveries with other scientists.
</p>

<p style="text-align: justify;">
39. <input type="text" class="${inputClass}" /> What does Greene say about some other famous scientists?<br />
<strong>A</strong> Their published works had a greater impact than Wegener’s did.<br />
<strong>B</strong> They had fewer doubts about their scientific ideas than Wegener did.<br />
<strong>C</strong> Their scientific ideas were more controversial than Wegener’s.<br />
<strong>D</strong> They are easier subjects to write about than Wegener.
</p>

<p style="text-align: justify;">
40. <input type="text" class="${inputClass}" /> What is Greene’s main point in the final paragraph?<br />
<strong>A</strong> It is not enough in life to have good intentions.<br />
<strong>B</strong> People need to plan carefully if they want to succeed.<br />
<strong>C</strong> People have little control over many aspects of their lives.<br />
<strong>D</strong> It is important that people ensure they have the freedom to act.
</p>
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
                      <p>1. D<br />2. C<br />3. E<br />4. B<br />5. D<br />6. Energy<br />7. Food<br />8. Gardening<br />9. Obesity<br />10. C, D<br />11. C, D<br />12. A, D<br />13. A, D<br />14. B<br />15. C<br />16. D<br />17. C<br />18. B<br />19. A<br />20. E<br />21. B<br />22. D<br />23. Yes<br />24. No<br />25. Not given<br />26. Yes<br />27. Yes<br />28. Not given<br />29. No<br />30. No<br />31. I<br />32. F<br />33. A<br />34. C<br />35. H<br />36. E<br />37. B<br />38. A<br />39. D<br />40. C</p>
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
<p style="text-align: center;"><strong>Green roofs</strong></p>
<p style="text-align: justify;"><strong>A</strong> Rooftops covered with grass, vegetable gardens and lush foliage are now a common sight in many cities around the world. More and more private companies and city authorities are investing in green roofs, drawn to their wide-ranging benefits. Among the benefits are saving on energy costs, mitigating the risk of floods, making habitats for urban wildlife, tackling air pollution and even growing food. These increasingly radical urban designs can help cities adapt to the monumental problems they face, such as access to resources and a lack of green space due to development. But the involvement of city authorities, businesses and other institutions is crucial to ensuring their success – as is research investigating different options to suit the variety of rooftop spaces found in cities. The UK is relatively new to developing green roofs, and local governments and institutions are playing a major role in spreading the practice. London is home to much of the UK’s green roof market, mainly due to forward-thinking policies such as the London Plan, which has paved the way to more than doubling the area of green roofs in the capital.</p>
<p style="text-align: justify;"><strong>B</strong> Ongoing research is showcasing how green roofs in cities can integrate with ‘living walls’: environmentally friendly walls which are partially or completely covered with greenery, including a growing medium, such as soil or water. Research also indicates that green roofs can be integrated with drainage systems on the ground, such as street trees, so that the water is managed better and the built environment is made more sustainable. There is also evidence to demonstrate the social value of green roofs. Doctors are increasingly prescribing time spent gardening outdoors for patients dealing with anxiety and depression. And research has found that access to even the most basic green spaces can provide a better quality of life for dementia sufferers and help people avoid obesity.</p>
<p style="text-align: justify;"><strong>C</strong> In North America, green roofs have become mainstream, with a wide array of expansive, accessible and food-producing roofs installed in buildings. Again, city leaders and authorities have helped push the movement forward – only recently, San Francisco, USA, created a policy requiring new buildings to have green roofs. Toronto, Canada, has policies dating from the 1990s, encouraging the development of urban farms on rooftops. These countries also benefit from having newer buildings than in many parts of the world, which makes it easier to install green roofs. Being able to keep enough water at roof height and distribute it right across the rooftop is crucial to maintaining the plants on any green roof – especially on ‘edible roofs’ where fruit and vegetables are farmed. And it’s much easier to do this in newer buildings, which can typically hold greater weight, than to retro-fit old ones. Having a stronger roof also makes it easier to grow a greater variety of plants, since the soil can be deeper.</p>
<p style="text-align: justify;"><strong>D</strong> For green roofs to become the norm for new developments, there needs to be support from public authorities and private investors. Those responsible for maintaining buildings may have to acquire new skills, such as landscaping, and in some cases, volunteers may be needed to help out. Other considerations include installing drainage paths, meeting health and safety requirements and perhaps allowing access for the public, as well as planning restrictions and disruption from regular activities in and around the buildings during installation. To convince investors and developers that installing green roofs is worthwhile, economic arguments are still the most important. The term ‘natural capital’ has been developed to explain the economic value of nature; for example, measuring the money saved by installing natural solutions to protect against flood damage, adapt to climate change or help people lead healthier and happier lives.</p>
<p style="text-align: justify;"><strong>E</strong> As the expertise about green roofs grows, official standards have been developed to ensure that they are designed, constructed and maintained properly, and function well. Improvements in the science and technology underpinning green roof development have also led to new variations in the concept. For example, ‘blue roofs’ enable buildings to hold water over longer periods of time, rather than draining it away quickly – crucial in times of heavier rainfall. There are also combinations of green roofs with solar panels, and ‘brown roofs’ which are wilder in nature and maximise biodiversity. If the trend continues, it could create new jobs and a more vibrant and sustainable local food economy – alongside many other benefits. There are still barriers to overcome, but the evidence so far indicates that green roofs have the potential to transform cities and help them function sustainably long into the future. The success stories need to be studied and replicated elsewhere, to make green, blue, brown and food-producing roofs the norm in cities around the world.</p>
`
                }}
              />

            <div style={{ display: activeTab === 1 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: center;"><strong>The growth mindset</strong></p>
<p style="text-align: justify;">Over the past century, a powerful idea has taken root in the educational landscape. The concept of intelligence as something innate has been supplanted by the idea that intelligence is not fixed, and that, with the right training, we can be the authors of our own cognitive capabilities. Psychologist Alfred Binet, the developer of the first intelligence tests, was one of many 19th-century scientists who held that earlier view and sought to quantify cognitive ability. Then, in the early 20th century, progressive thinkers revolted against the notion that inherent ability is destiny. Instead, educators such as John Dewey argued that every child’s intelligence could be developed, given the right environment.</p>
<p style="text-align: justify;">‘Growth mindset theory’ is a relatively new – and extremely popular – version of this idea. In many schools today you will see hallways covered in motivational posters and hear speeches on the mindset of great sporting heroes who simply believed their way to the top. A major focus of the growth mindset in schools is coaxing students away from seeing failure as an indication of their ability, and towards seeing it as a chance to improve that ability. As educationalist Jeff Howard noted several decades ago: ‘Smart is not something that you just are, smart is something that you can get.’</p>
<p style="text-align: justify;">The idea of the growth mindset is based on the work of psychologist Carol Dweck in California in the 1990s. In one key experiment, Dweck divided a group of 10- to 12-year-olds into two groups. All were told that they had achieved a high score on a test but the first group were praised for their intelligence in achieving this, while the others were praised for their effort. The second group – those who had been instilled with a ‘growth mindset’ – were subsequently far more likely to put effort into future tasks. Meanwhile, the former took on only those tasks that would not risk their sense of worth. This group had inferred that success or failure is due to innate ability, and this ‘fixed mindset’ had led them to fear of failure and lack of effort. Praising ability actually made the students perform worse, while praising effort emphasised that change was possible.</p>
<p style="text-align: justify;">One of the greatest impediments to successfully implementing a growth mindset, however, is the education system itself: in many parts of the world, the school climate is obsessed with performance in the form of constant testing, analysing and ranking of students – a key characteristic of the fixed mindset. Nor is it unusual for schools to create a certain cognitive dissonance, when they applaud the benefits of a growth mindset but then hand out fixed target grades in lessons based on performance.</p>
<p style="text-align: justify;">Aside from the implementation problem, the original growth mindset research has also received harsh criticism. The statistician Andrew Gelman claims that ‘their research designs have enough degrees of freedom that they could take their data to support just about any theory at all’. Professor of Psychology Timothy Bates, who has been trying to replicate Dweck’s work, is finding that the results are repeatedly null. He notes that: ‘People with a growth mindset don’t cope any better with failure … Kids with the growth mindset aren’t getting better grades, either before or after our intervention study.’</p>
<p style="text-align: justify;">Much of this criticism is not lost on Dweck, and she deserves great credit for responding to it and adapting her work accordingly. In fact, she argues that her work has been misunderstood and misapplied in a range of ways. She has also expressed concerns that her theories are being misappropriated in schools by being conflated with the self-esteem movement: ‘For me the growth mindset is a tool for learning and improvement. It’s not just a vehicle for making children feel good.’</p>
<p style="text-align: justify;">But there is another factor at work here. The failure to translate the growth mindset into the classroom might reflect a misunderstanding of the nature of teaching and learning itself. Growth mindset supporters David Yeager and Gregory Walton claim that interventions should be delivered in a subtle way to maximise their effectiveness. They say that if adolescents perceive a teacher’s intervention as conveying that they are in need of help, this could undo its intended effects.</p>
<p style="text-align: justify;">A lot of what drives students is their innate beliefs and how they perceive themselves. There is a strong correlation between self-perception and achievement, but there is evidence to suggest that the actual effect of achievement on self-perception is stronger than the other way round. To stand up in a classroom and successfully deliver a good speech is a genuine achievement, and that is likely to be more powerfully motivating than vague notions of ‘motivation’ itself.</p>
<p style="text-align: justify;">Recent evidence would suggest that growth mindset interventions are not the elixir of student learning that its proponents claim it to be. The growth mindset appears to be a viable construct in the lab, which, when administered in the classroom via targeted interventions, doesn’t seem to work. It is hard to dispute that having faith in the capacity to change is a good attribute for students. Paradoxically, however, that aspiration is not well served by direct interventions that try to instil it. Motivational posters and talks are often a waste of time, and might well give students a deluded notion of what success actually means. Teaching concrete skills such as how to write an effective introduction to an essay then praising students’ effort in getting there is probably a far better way of improving confidence than telling them how unique they are, or indeed how capable they are of changing their own brains. Perhaps growth mindset works best as a philosophy and not an intervention.</p>
`
                }}
              />

            <div style={{ display: activeTab === 2 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: center;"><strong>Alfred Wegener: science, exploration and the theory of continental drift</strong></p>
<p style="text-align: justify;"><strong>Introduction</strong><br />
This is a book about the life and scientific work of Alfred Wegener, whose reputation today rests with his theory of continental displacements, better known as ‘continental drift’. Wegener proposed this theory in 1912 and developed it extensively for nearly 20 years. His book on the subject, The Origin of Continents and Oceans, went through four editions and was the focus of an international controversy in his lifetime and for some years after his death.</p>
<p style="text-align: justify;">Wegener’s basic idea was that many mysteries about the Earth’s history could be solved if one supposed that the continents moved laterally, rather than supposing that they remained fixed in place. Wegener showed in great detail how such continental movements were plausible and how they worked, using evidence from a large number of sciences including geology, geophysics, paleontology, and climatology. Wegener’s idea – that the continents move – is at the heart of the theory that guides Earth sciences today: namely plate tectonics. Plate tectonics is in many respects quite different from Wegener’s proposal, in the same way that modern evolutionary theory is very different from the ideas Charles Darwin proposed in the 1850s about biological evolution. Yet plate tectonics is a descendant of Alfred Wegener’s theory of continental drift, in quite the same way that modern evolutionary theory is a descendant of Darwin’s theory of natural selection.</p>
<p style="text-align: justify;">When I started writing about Wegener’s life and work, one of the most intriguing things about him for me was that, although he came up with a theory on continental drift, he was not a geologist. He trained as an astronomer and pursued a career in atmospheric physics. When he proposed the theory of continental displacements in 1912, he was a lecturer in physics and astronomy at the University of Marburg, in southern Germany. However, he was not an ‘unknown’. In 1906 he had set a world record (with his brother Kurt) for time aloft in a hot-air balloon: 52 hours. Between 1906 and 1908 he had taken part in a highly publicized and extremely dangerous expedition to the coast of northeast Greenland. He had also made a name for himself amongst a small circle of meteorologists and atmospheric physicists in Germany as the author of a textbook, Thermodynamics of the Atmosphere (1911), and of a number of interesting scientific papers.</p>
<p style="text-align: justify;">As important as Wegener’s work on continental drift has turned out to be, it was largely a sideline to his interest in atmospheric physics, geophysics, and paleoclimatology , and thus I have been at great pains to put Wegener’s work on continental drift in the larger context of his other scientific work, and in the even larger context of atmospheric sciences in his lifetime. This is a ‘continental drift book’ only to the extent that Wegener was interested in that topic and later became famous for it. My treatment of his other scientific work is no less detailed, though I certainly have devoted more attention to the reception of his ideas on continental displacement, as they were much more controversial than his other work.</p>
<p style="text-align: justify;">Readers interested in the specific detail of Wegener’s career will see that he often stopped pursuing a given line of investigation (sometimes for years on end), only to pick it up later. I have tried to provide guideposts to his rapidly shifting interests by characterizing different phases of his life as careers in different sciences, which is reflected in the titles of the chapters. Thus, the index should be a sufficient guide for those interested in a particular aspect of Wegener’s life but perhaps not all of it. My own feeling, however, is that the parts do not make as much sense on their own as do all of his activities taken together. In this respect I urge readers to try to experience Wegener’s life as he lived it, with all the interruptions, changes of mind, and renewed efforts this entailed.</p>
<p style="text-align: justify;">Wegener left behind a few published works but, as was standard practice, these reported the results of his work – not the journey he took to reach that point. Only a few hundred of the many thousands of letters he wrote and received in his lifetime have survived and he didn’t keep notebooks or diaries that recorded his life and activities. He was not active (with a few exceptions) in scientific societies, and did not seek to find influence or advance his ideas through professional contacts and politics, spending most of his time at home in his study reading and writing, or in the field collecting observations.</p>
<p style="text-align: justify;">Some famous scientists, such as Newton, Darwin, and Einstein, left mountains of written material behind, hundreds of notebooks and letters numbering in the tens of thousands. Others, like Michael Faraday, left extensive journals of their thoughts and speculations, parallel to their scientific notebooks. The more such material a scientist leaves behind, the better chance a biographer has of forming an accurate picture of how a scientist’s ideas took shape and evolved.</p>
<p style="text-align: justify;">I am firmly of the opinion that most of us, Wegener included, are not in any real sense the authors of our own lives. We plan, think, and act, often with apparent freedom, but most of the time our lives ‘happen to us’, and we only retrospectively turn this happenstance into a coherent narrative of fulfilled intentions. This book, therefore, is a story both of the life and scientific work that Alfred Wegener planned and intended and of the life and scientific work that actually ‘happened to him’. These are, as I think you will soon see, not always the same thing.</p>
`
                }}
              />
          </div>
        </section>
      </main>
    </div>
  );
}
