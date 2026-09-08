"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Highlighter, Trash2 } from 'lucide-react';

export default function IELTSReadingTest18_1() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [activeTab, setActiveTab] = useState(0);
  const [highlightCount, setHighlightCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const passageRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  const correctAnswers: Record<number, string> = {
    1: 'Lettuces',
    2: '1000 kg',
    3: '(food) consumption',
    4: 'Pesticides',
    5: 'Journeys',
    6: 'Producers',
    7: 'Flavor/ flavour',
    8: 'True',
    9: 'Not given',
    10: 'False',
    11: 'True',
    12: 'False',
    13: 'Not given',
    14: 'B',
    15: 'A',
    16: 'C',
    17: 'E',
    18: 'B',
    19: 'B',
    20: 'C',
    21: 'C',
    22: 'Fire',
    23: 'Nutrients',
    24: 'Cavities',
    25: 'Hawthorn',
    26: 'Rare',
    27: 'C',
    28: 'F',
    29: 'A',
    30: 'E',
    31: 'B',
    32: 'Sustainability',
    33: 'Fuel',
    34: 'Explosions',
    35: 'Bankrupt',
    36: 'C',
    37: 'D',
    38: 'B',
    39: 'D',
    40: 'A',
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
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">Reading 18.1</h1>
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
<p style="text-align: justify;"><strong>Questions 1-3</strong><br />Complete the sentences below. Choose <strong>NO MORE THAN TWO WORDS AND/ OR A NUMBER</strong> from the passage for each answer.</p>
<p style="text-align: justify;"><strong>Urban farming in Paris</strong></p>
<p style="text-align: justify;">1. Vertical tubes are used to grow strawberries <input type="text" class="${inputClass}" /> and herbs.<br />
2. There will eventually be a daily harvest of as much as <input type="text" class="${inputClass}" /> in weight of fruit and vegetables.<br />
3. It may be possible that the farm’s produce will account for as much as 10% of the city’s <input type="text" class="${inputClass}" /> overall.</p>

<p style="text-align: justify;"><strong>Questions 4-7</strong><br />Complete the table below. Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p>

<div class="overflow-x-auto my-4">
<table class="w-full border-collapse border border-slate-300 text-sm">
  <thead>
    <tr class="bg-slate-100">
      <th colspan="4" class="border border-slate-300 p-2 text-center font-bold">Intensive farming versus aeroponic urban farming</th>
    </tr>
    <tr class="bg-slate-50">
      <th class="border border-slate-300 p-2 text-center">&nbsp;</th>
      <th class="border border-slate-300 p-2 text-center font-bold">Growth</th>
      <th class="border border-slate-300 p-2 text-center font-bold">Selection</th>
      <th class="border border-slate-300 p-2 text-center font-bold">Sale</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-slate-300 p-2 font-semibold bg-slate-50/50">Intensive farming</td>
      <td class="border border-slate-300 p-2">
        <ul class="list-disc pl-4 space-y-1">
          <li>wide range of (4) <input type="text" class="${inputClass}" /> used</li>
          <li>techniques pollute air</li>
        </ul>
      </td>
      <td class="border border-slate-300 p-2">
        <ul class="list-disc pl-4 space-y-1">
          <li>quality not good</li>
          <li>varieties of fruit and vegetables chosen that can survive long (5) <input type="text" class="${inputClass}" /></li>
        </ul>
      </td>
      <td class="border border-slate-300 p-2">
        <ul class="list-disc pl-4 space-y-1">
          <li>(6) <input type="text" class="${inputClass}" /> receive very little of overall income</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td class="border border-slate-300 p-2 font-semibold bg-slate-50/50">Aeroponic urban farming</td>
      <td class="border border-slate-300 p-2">
        <ul class="list-disc pl-4 space-y-1">
          <li>no soil used</li>
          <li>nutrients added to water which is recycled</li>
        </ul>
      </td>
      <td class="border border-slate-300 p-2">
        <ul class="list-disc pl-4 space-y-1">
          <li>produce chosen because of its (7) <input type="text" class="${inputClass}" /></li>
        </ul>
      </td>
      <td class="border border-slate-300 p-2">&nbsp;</td>
    </tr>
  </tbody>
</table>
</div>

<p style="text-align: justify;"><strong>Questions 8-13</strong><br />Do the following statements agree with the information given in the passage? In boxes 8-13 of your answer sheet write</p>
<p style="text-align: justify;">
<strong>TRUE</strong> if the statement agrees with the information<br />
<strong>FALSE</strong> if the statement contradicts the information<br />
<strong>NOT GIVEN</strong> if there is no information on this
</p>
<p style="text-align: justify;">
8. <input type="text" class="${inputClass}" /> Urban farming can take place above or below ground.<br />
9. <input type="text" class="${inputClass}" /> Some of the equipment used in aeroponic farming can be made by hand.<br />
10. <input type="text" class="${inputClass}" /> Urban farming relies more on electricity than some other types of farming.<br />
11. <input type="text" class="${inputClass}" /> Fruit and vegetables grown on an aeroponic urban farm are cheaper than traditionally grown organic produce.<br />
12. <input type="text" class="${inputClass}" /> Most produce can be grown on an aeroponic urban farm at any time of the year.<br />
13. <input type="text" class="${inputClass}" /> Beans take longer to grow on an urban farm than other vegetables.
</p>
`
                }}
              />

            <div style={{ display: activeTab === 1 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: justify;"><strong>Questions 14-18</strong><br />Reading Passage 2 has seven paragraphs, A-G. Which paragraph contains the following information?<br />Write the correct letter, A-G, in boxes 14-18 on your answer sheet. NB You may use any letter more than once.</p>
<p style="text-align: justify;">
14. <input type="text" class="${inputClass}" /> bad outcomes for a forest when people focus only on its financial reward<br />
15. <input type="text" class="${inputClass}" /> reference to the aspects of any tree that contribute to its worth<br />
16. <input type="text" class="${inputClass}" /> mention of the potential use of wood to help run vehicles<br />
17. <input type="text" class="${inputClass}" /> examples of insects that attack trees<br />
18. <input type="text" class="${inputClass}" /> an alternative name for trees that produce low-use wood
</p>

<p style="text-align: justify;"><strong>Questions 19-21</strong><br />Look at the following purposes (Questions 19-21) and the list of timber cuts below. Match each purpose with the correct timber cut, A, B or C. Write the correct letter, A, B or C, in boxes 19-21 on your answer sheet. NB You may use any letter more than once.</p>
<p style="text-align: justify;">
19. <input type="text" class="${inputClass}" /> to remove trees that are diseased<br />
20. <input type="text" class="${inputClass}" /> to generate income across a number of years<br />
21. <input type="text" class="${inputClass}" /> to create a forest whose trees are close in age
</p>

<p style="text-align: justify;"><strong>List of Timber Cuts</strong><br />
<strong>A</strong> a TSI Cut<br />
<strong>B</strong> a Salvage Cut<br />
<strong>C</strong> a Shelterwood Cut</p>

<p style="text-align: justify;"><strong>Questions 22-26</strong><br />Complete the sentences below. Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p>
<p style="text-align: justify;">
22. Some dead wood is removed to avoid the possibility of <input type="text" class="${inputClass}" /><br />
23. The <input type="text" class="${inputClass}" /> from the tops of cut trees can help improve soil quality.<br />
24. Some damaged trees should be left, as their <input type="text" class="${inputClass}" /> provide habitats for a range of creatures.<br />
25. Some trees that are small, such as <input type="text" class="${inputClass}" /> are a source of food for animals and insects.<br />
26. Any trees that are <input type="text" class="${inputClass}" /> should be left to grow, as they add to the variety of species in the forest.
</p>
`
                }}
              />

            <div style={{ display: activeTab === 2 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: justify;"><strong>Questions 27-31</strong><br />Reading Passage has six sections, A-F. Which section contains the following information?</p>
<p style="text-align: justify;">
27. <input type="text" class="${inputClass}" /> a reference to the cooperation that takes place to try and minimise risk<br />
28. <input type="text" class="${inputClass}" /> an explanation of a person’s aims<br />
29. <input type="text" class="${inputClass}" /> a description of a major collision that occurred in space<br />
30. <input type="text" class="${inputClass}" /> a comparison between tracking objects in space and the efficiency of a transportation system<br />
31. <input type="text" class="${inputClass}" /> a reference to efforts to classify space junk
</p>

<p style="text-align: justify;"><strong>Questions 32-35</strong><br />Complete the summary below. Choose <strong>ONE WORD ONLY</strong> from the passage for each answer. Write your answers in boxes 32-35 on your answer sheet.</p>

<p style="text-align: justify;"><strong>The Inter-Agency Space Debris Coordination Committee</strong></p>
<p style="text-align: justify;">The committee gives advice on how the (32) <input type="text" class="${inputClass}" /> of space can be achieved. The committee advises that when satellites are no longer active, any unused (33) <input type="text" class="${inputClass}" /> or pressurised material that could cause<br />(34) <input type="text" class="${inputClass}" /> should be removed.</p>
<p style="text-align: justify;">Although operators of large satellite constellations accept that they have obligations as stewards of space, Holger Krag points out that the operators that become (35) <input type="text" class="${inputClass}" /> are unlikely to prioritise removing their satellites from space.</p>

<p style="text-align: justify;"><strong>Questions 36-40</strong><br />Look at the following statements (Questions 36-40) and the list of people below. Match each statement with the correct person, A, B, C or D. Write the correct letter, A, B or C, in boxes 36-40 on your answer sheet. NB You may use any letter more than once.</p>
<p style="text-align: justify;">
36. <input type="text" class="${inputClass}" /> Knowing the exact location of space junk would help prevent any possible danger.<br />
37. <input type="text" class="${inputClass}" /> Space should be available to everyone and should be preserved for the future.<br />
38. <input type="text" class="${inputClass}" /> A recommendation regarding satellites is widely ignored.<br />
39. <input type="text" class="${inputClass}" /> There is conflicting information about where some satellites are in space.<br />
40. <input type="text" class="${inputClass}" /> There is a risk we will not be able to undo the damage that occurs in space.
</p>

<p style="text-align: justify;"><strong>List of People</strong><br />
<strong>A</strong> Carolin Frueh<br />
<strong>B</strong> Holger Krag<br />
<strong>C</strong> Marlon Sorge<br />
<strong>D</strong> Moriba Jah</p>
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
                      <p>1. Lettuces<br />2. 1000 kg<br />3. (food) consumption<br />4. Pesticides<br />5. Journeys<br />6. Producers<br />7. Flavor/ flavour<br />8. True<br />9. Not given<br />10. False<br />11. True<br />12. False<br />13. Not given<br />14. B<br />15. A<br />16. C<br />17. E<br />18. B<br />19. B<br />20. C<br />21. C<br />22. Fire<br />23. Nutrients<br />24. Cavities<br />25. Hawthorn<br />26. Rare<br />27. C<br />28. F<br />29. A<br />30. E<br />31. B<br />32. Sustainability<br />33. Fuel<br />34. Explosions<br />35. Bankrupt<br />36. C<br />37. D<br />38. B<br />39. D<br />40. A</p>
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
<p style="text-align: center;"><strong>Urban farming</strong></p>
<p style="text-align: justify;">In Paris, urban farmers are trying a soil-free approach to agriculture that uses less space and fewer resources. Could it help cities face the threats to our food supplies?</p>
<p style="text-align: justify;">On top of a striking new exhibition hall in southern Paris, the world’s largest urban rooftop farm has started to bear fruit. Strawberries that are small, intensely flavoured and resplendently red sprout abundantly from large plastic tubes. Peer inside and you see the tubes are completely hollow, the roots of dozens of strawberry plants dangling down inside them. From identical vertical tubes nearby burst row upon row of lettuces; near those are aromatic herbs, such as basil, sage and peppermint. Opposite, in narrow, horizontal trays packed not with soil but with coconut fibre, grow cherry tomatoes, shiny aubergines and brightly coloured chards.</p>
<p style="text-align: justify;">Pascal Hardy, an engineer and sustainable development consultant, began experimenting with vertical farming and aeroponic growing towers – as the soil-free plastic tubes are known – on his Paris apartment block roof five years ago. The urban rooftop space above the exhibition hall is somewhat bigger: 14,000 square metres and almost exactly the size of a couple of football pitches. Already, the team of young urban farmers who tend it have picked, in one day, 3,000 lettuces and 150 punnets of strawberries. When the remaining two thirds of the vast open area are in production, 20 staff will harvest up to 1,000 kg of perhaps 35 different varieties of fruit and vegetables, every day. ‘We’re not ever, obviously, going to feed the whole city this way,’ cautions Hardy. ‘In the urban environment you’re working with very significant practical constraints, clearly, on what you can do and where. But if enough unused space can be developed like this, there’s no reason why you shouldn’t eventually target maybe between 5% and 10% of consumption.’</p>
<p style="text-align: justify;">Perhaps most significantly, however, this is a real-life showcase for the work of Hardy’s flourishing urban agriculture consultancy, Agripolis, which is currently fielding enquiries from around the world to design, build and equip a new breed of soil-free inner-city farm. ‘The method’s advantages are many,’ he says. ‘First, I don’t much like the fact that most of the fruit and vegetables we eat have been treated with something like 17 different pesticides, or that the intensive farming techniques that produced them are such huge generators of greenhouse gases. I don’t much like the fact, either, that they’ve travelled an average of 2,000 refrigerated kilometres to my plate, that their quality is so poor, because the varieties are selected for their capacity to withstand such substantial journeys, or that 80% of the price I pay goes to wholesalers and transport companies, not the producers.’</p>
<p style="text-align: justify;">Produce grown using this soil-free method, on the other hand – which relies solely on a small quantity of water, enriched with organic nutrients, pumped around a closed circuit of pipes, towers and trays – is ‘produced up here, and sold locally, just down there. It barely travels at all,’ Hardy says. ‘You can select crop varieties for their flavour, not their resistance to the transport and storage chain, and you can pick them when they’re really at their best, and not before.’ No soil is exhausted, and the water that gently showers the plants’ roots every 12 minutes is recycled, so the method uses 90% less water than a classic intensive farm for the same yield.</p>
<p style="text-align: justify;">Urban farming is not, of course, a new phenomenon. Inner-city agriculture is booming from Shanghai to Detroit and Tokyo to Bangkok. Strawberries are being grown in disused shipping containers, mushrooms in underground carparks. Aeroponic farming, he says, is ‘virtuous’. The equipment weighs little, can be installed on almost any flat surface and is cheap to buy: roughly €100 to €150 per square metre. It is cheap to run, too, consuming a tiny fraction of the electricity used by some techniques.</p>
<p style="text-align: justify;">Produce grown this way typically sells at prices that, while generally higher than those of classic intensive agriculture, are lower than soil-based organic growers. There are limits to what farmers can grow this way, of course, and much of the produce is suited to the summer months. ‘Root vegetables we cannot do, at least not yet,’ he says. ‘Radishes are OK, but carrots, potatoes, that kind of thing – the roots are simply too long. Fruit trees are obviously not an option. And beans tend to take up a lot of space for not much return.’ Nevertheless, urban farming of the kind being practised in Paris is one part of a bigger and fast-changing picture that is bringing food production closer to our lives.</p>
`
                }}
              />

            <div style={{ display: activeTab === 1 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: center;"><strong>Forest management in Pennsylvania, USA</strong></p>
<p style="text-align: justify;"><em>How managing low-quality wood (also known as low-use wood) for bioenergy can encourage sustainable forest management</em></p>
<p style="text-align: justify;"><strong>A</strong> A tree’s ‘value’ depends on several factors including its species, size, form, condition, quality, function, and accessibility, and depends on the management goals for a given forest. The same tree can be valued very differently by each person who looks at it. A large, straight black cherry tree has high value as timber to be cut into logs or made into furniture, but for a landowner more interested in wildlife habitat, the real value of that stem (or trunk) may be the food it provides to animals. Likewise, if the tree suffers from black knot disease, its value for timber decreases, but to a woodworker interested in making bowls, it brings an opportunity for a unique and beautiful piece of art.</p>
<p style="text-align: justify;"><strong>B</strong> In the past, Pennsylvania landowners were solely interested in the value of their trees as high-quality timber. The norm was to remove the stems of highest quality and leave behind poorly formed trees that were not as well suited to the site where they grew. This practice, called ‘high-grading’, has left a legacy of low-use wood’ in the forests. Some people even call these ‘junk trees’, and they are abundant in Pennsylvania. These trees have lower economic value for traditional timber markets, compete for growth with higher-value trees, shade out desirable regeneration and decrease the health of a stand leaving it more vulnerable to poor weather and disease. Management that specifically targets low-use wood can help landowners manage these forest health issues, and wood energy markets help promote this.</p>
<p style="text-align: justify;"><strong>C</strong> Wood energy markets can accept less expensive wood material of lower quality than would be suitable for traditional timber markets. Most wood used for energy in Pennsylvania is used to produce heat or electricity through combustion. Many schools and hospitals use wood boiler systems to heat and power their facilities, many homes are primarily heated with wood, and some coal plants incorporate wood into their coal streams to produce electricity. Wood can also be gasified for electrical generation and can even be made into liquid fuels like ethanol and gasoline for lorries and cars. All these products are made primarily from low-use wood. Several tree- and plant-cutting approaches, which could greatly improve the long-term quality of a forest, focus strongly or solely on the use of wood for those markets.</p>
<p style="text-align: justify;"><strong>D</strong> One such approach is called a Timber Stand Improvement (TSI) Cut. In a TSI Cut, really poor-quality tree and plant material is cut down to allow more space, light, and other resources to the highest-valued stems that remain. Removing invasive plants might be another primary goal of a TSI Cut. The stems that are left behind might then grow in size and develop more foliage and larger crowns or tops that produce more coverage for wildlife; they have a better chance to regenerate in a less crowded environment. TSI Cuts can be tailored to one farmer’s specific management goals for his or her land.</p>
<p style="text-align: justify;"><strong>E</strong> Another approach that might yield a high amount of low-use wood is a Salvage Cut. With the many pests and pathogens visiting forests including hemlock wooly adelgid, Asian longhorned beetle, emerald ash borer, and gypsy moth, to name just a few, it is important to remember that those working in the forests can help ease these issues through cutting procedures. These types of cut reduce the number of sick trees and seek to manage the future spread of a pest problem. They leave vigorous trees that have stayed healthy enough to survive the outbreak.</p>
<p style="text-align: justify;"><strong>F</strong> A Shelterwood Cut, which only takes place in a mature forest that has already been thinned several times, involves removing all the mature trees when other seedlings have become established. This then allows the forester to decide which tree species are regenerated. It leaves a young forest where all trees are at a similar point in their growth. It can also be used to develop a two-tier forest so that there are two harvests and the money that comes in is spread out over a decade or more.</p>
<p style="text-align: justify;"><strong>G</strong> Thinnings and dense and dead wood removal for fire prevention also center on the production of low-use wood. However, it is important to remember that some retention of what many would classify as low-use wood is very important. The tops of trees that have been cut down should be left on the site so that their nutrients cycle back into the soil. In addition, trees with many cavities are extremely important habitats for insect predators like woodpeckers, bats and small mammals. They help control problem insects and increase the health and resilience of the forest. It is also important to remember that not all small trees are low-use. For example, many species like hawthorn provide food for wildlife. Finally, rare species of trees in a forest should also stay behind as they add to its structural diversity.</p>
`
                }}
              />

            <div style={{ display: activeTab === 2 ? 'block' : 'none' }}
                dangerouslySetInnerHTML={{
                  __html: `
<p style="text-align: center;"><strong>Conquering Earth’s space junk problem</strong></p>
<p style="text-align: justify;"><em>Satellites, rocket shards and collision debris are creating major traffic risks in orbit around the planet. Researchers are working to reduce these threats</em></p>
<p style="text-align: justify;"><strong>A</strong> Last year, commercial companies, military and civil departments and amateurs sent more than 400 satellites into orbit, over four times the yearly average in the previous decade. Numbers could rise even more sharply if leading space companies follow through on plans to deploy hundreds to thousands of large constellations of satellites to space in the next few years.</p>
<p style="text-align: justify;">All that traffic can lead to disaster. Ten years ago, a US commercial Iridium satellite smashed into an inactive Russian communications satellite called Cosmos-2251, creating thousands of new pieces of space shrapnel that now threaten other satellites in low Earth orbit – the zone stretching up to 2,000 kilometres in altitude. Altogether, there are roughly 20,000 human-made objects in orbit, from working satellites to small rocket pieces. And satellite operators can’t steer away from every potential crash, because each move consumes time and fuel that could otherwise be used for the spacecraft’s main job.</p>
<p style="text-align: justify;"><strong>B</strong> Concern about space junk goes back to the beginning of the satellite era, but the number of objects in orbit is rising so rapidly that researchers are investigating new ways of attacking the problem. Several teams are trying to improve methods for assessing what is in orbit, so that satellite operators can work more efficiently in ever-more-crowded space. Some researchers are now starting to compile a massive data set that includes the best possible information on where everything is in orbit. Others are developing taxonomies of space debris – working on measuring properties such as the shape and size of an object, so that satellite operators know how much to worry about what’s coming their way. The alternative, many say, is unthinkable. Just a few uncontrolled space crashes could generate enough debris to set off a runaway cascade of fragments, rendering near-Earth space unusable. ‘If we go on like this, we will reach a point of no return,’ says Carolin Frueh, an astrodynamical researcher at Purdue University in West Lafayette, Indiana.</p>
<p style="text-align: justify;"><strong>C</strong> Even as our ability to monitor space objects increases, so too does the total number of items in orbit. That means companies, governments and other players in space are collaborating in new ways to avoid a shared threat. International groups such as the Inter-Agency Space Debris Coordination Committee have developed guidelines on space sustainability. Those include inactivating satellites at the end of their useful life by venting pressurised materials or leftover fuel that might lead to explosions. The intergovernmental groups also advise lowering satellites deep enough into the atmosphere that they will burn up or disintegrate within 25 years. But so far, only about half of all missions have abided by this 25-year goal, says Holger Krag, head of the European Space Agency’s space-debris office in Darmstadt, Germany. Operators of the planned large constellations of satellites say they will be responsible stewards in their enterprises in space, but Krag worries that problems could increase, despite their best intentions. ‘What happens to those that fail or go bankrupt?’ he asks. They are probably not going to spend money to remove their satellites from space.’</p>
<p style="text-align: justify;"><strong>D</strong> In theory, given the vastness of space, satellite operators should have plenty of room for all these missions to fly safely without ever nearing another object. So some scientists are tackling the problem of space junk by trying to find out where all the debris is to a high degree of precision. That would alleviate the need for many of the unnecessary manoeuvres that are carried out to avoid potential collisions. ‘If you knew precisely where everything was, you would almost never have a problem,’ says Marlon Sorge, a space-debris specialist at the Aerospace Corporation in El Segundo, California.</p>
<p style="text-align: justify;"><strong>E</strong> The field is called space traffic management, because it’s similar to managing traffic on the roads or in the air. Think about a busy day at an airport, says Moriba Jah, an astrodynamicist at the University of Texas at Austin: planes line up in the sky, landing and taking off close to one another in a carefully choreographed routine. Air-traffic controllers know the location of the planes down to one metre in accuracy. The same can’t be said for space debris. Not all objects in orbit are known, and even those included in databases are not tracked consistently.</p>
<p style="text-align: justify;"><strong>F</strong> An additional problem is that there is no authoritative catalogue that accurately lists the orbits of all known space debris. Jah illustrates this with a web-based database that he has developed. It draws on several sources, such as catalogues maintained by the US and Russian governments, to visualise where objects are in space. When he types in an identifier for a particular space object, the database draws a purple line to designate its orbit. Only this doesn’t quite work for a number of objects, such as a Russian rocket body designated in the database as object number 32280. When Jah enters that number, the database draws two purple lines: the US and Russian sources contain two completely different orbits for the same object. Jah says that it is almost impossible to tell which is correct, unless a third source of information made it possible to cross-correlate. Jah describes himself as a space environmentalist: ‘I want to make space a place that is safe to operate, that is free and useful for generations to come.’ Until that happens, he argues, the space community will continue devolving into a tragedy in which all spaceflight operators are polluting a common resource.</p>
`
                }}
              />
          </div>
        </section>
      </main>
    </div>
  );
}
