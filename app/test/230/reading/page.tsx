"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Highlighter, Trash2 } from 'lucide-react';

export default function IELTSReadingTest230() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [activeTab, setActiveTab] = useState(0);
  const [highlightCount, setHighlightCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const passageRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  const correctAnswers: Record<number, string> = {
    1: 'Population', 2: 'Suburbs', 3: 'Businessmen', 4: 'Funding', 5: 'Press',
    6: 'Soil', 7: 'False', 8: 'Not given', 9: 'True', 10: 'True',
    11: 'False', 12: 'False', 13: 'Not given', 14: 'A', 15: 'F',
    16: 'E', 17: 'D', 18: 'Fortress', 19: 'Bullfights', 20: 'Opera',
    21: 'Salt', 22: 'Shops', 23: 'C or D', 24: 'C or D', 25: 'B or E',
    26: 'B or E', 27: 'H', 28: 'J', 29: 'F', 30: 'B',
    31: 'D', 32: 'Not given', 33: 'No', 34: 'No', 35: 'Yes',
    36: 'B', 37: 'C', 38: 'A', 39: 'B', 40: 'D',
  };

  const collectUserAnswers = useCallback(() => {
    if (!questionsRef.current) return;
    const inputs = questionsRef.current.querySelectorAll('input[type="text"]:not([type="hidden"])');
    const answers: string[] = [];
    inputs.forEach((input) => {
      answers.push((input as HTMLInputElement).value.trim());
    });
    setUserAnswers(answers);
  }, []);

  const isAnswerCorrect = (userAns: string, correctAns: string) => {
    if (!userAns) return false;
    const correct = correctAns.toLowerCase();
    const user = userAns.toLowerCase();
    // Handle "X or Y" style answers
    if (correct.includes(' or ')) {
      const options = correct.split(' or ').map(o => o.trim());
      return options.includes(user);
    }
    return user === correct;
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

    // Only highlight within the passage container
    if (!passageRef.current?.contains(range.commonAncestorContainer)) return;

    // Don't highlight if selection is inside an input
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

    // Click to remove individual highlight
    mark.addEventListener('click', () => {
      const parent = mark.parentNode;
      if (parent) {
        while (mark.firstChild) {
          parent.insertBefore(mark.firstChild, mark);
        }
        parent.removeChild(mark);
        parent.normalize();
        updateHighlightCount();
      }
    });

    try {
      range.surroundContents(mark);
    } catch {
      // surroundContents fails if selection crosses element boundaries
      // Fallback: extract and wrap
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
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        while (mark.firstChild) {
          parent.insertBefore(mark.firstChild, mark);
        }
        parent.removeChild(mark);
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

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-8 shadow-sm z-20">
        <div className="flex items-center">
          <Link href="/" className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">17.1 IELTS Reading Test 17.1</h1>
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
            <div style={{ display: activeTab === 0 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: `<p style="text-align: justify;"><strong>Questions 1-6</strong><br />Complete the notes below. Choose <strong>ONE WORD ONLY</strong> from the passage for each answer.</p><p style="text-align: justify;"><strong>The London underground railway</strong><br /><strong>The problem</strong><br />• The (1) ………………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> of London increased rapidly between 1800 and 1850<br />• The streets were full of horse-drawn vehicles</p><p style="text-align: justify;"><strong>The proposed solution</strong><br />• Charles Pearson, a solicitor, suggested building an underground railway<br />• Building the railway would make it possible to move people to better housing in the (2) ……………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />.<br />• A number of (3) ………………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />. agreed with Pearson’s idea<br />• The company initially had problems getting the (4) ………………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />. needed for the project<br />• Negative articles about the project appeared in the 5</p><p style="text-align: justify;"><strong>The construction</strong><br />• The chosen route did not require many buildings to be pulled down<br />• The ‘cut and cover’ method was used to construct the tunnels<br />• With the completion of the brick arch, the tunnel was covered with (6) ………………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />.</p><p style="text-align: justify;"><strong>Questions 7-13</strong><br />Do the following statements agree with the information given in Reading Passage? In boxes 7-13 on your answer sheet, write</p><p style="text-align: justify;"><strong>TRUE</strong> if the statement agrees with the information<br /><strong>FALSE</strong> if the statement contradicts the information<br /><strong>NOT GIVEN</strong> if there is no information on this</p><p style="text-align: justify;">7. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Other countries had built underground railways before the Metropolitan line opened.<br />8. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> More people than predicted travelled on the Metropolitan line on &#8216;he first day.<br />9. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> The use of ventilation shafts failed to prevent pollution in the tunnels.<br />10. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> A different approach from the ‘cut and cover’ technique was required in London’s central area.<br />11. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> The windows on City &amp; South London trains were at eye level.<br />12. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> The City &amp; South London Railway was a financial success.<br />13. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Trains on the ‘Tuppenny Tube’ nearly always ran on time.</p><p><br /><ins style="display: block;" data-ad-client="ca-pub-5700321813195736" data-ad-slot="7372142965" data-ad-format="auto" data-full-width-responsive="true"></ins></p>` }} />
            <div style={{ display: activeTab === 1 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: `<p style="text-align: justify;"><strong>Questions 14-17</strong><br />Reading Passage has seven sections, A-G. Which section contains the following information? Write the correct letter, A-G, in boxes 14-17 on your answer sheet. NB You may use any letter more than once.</p><p style="text-align: justify;">14. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> a mention of negative attitudes towards stadium building projects<br />15. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> figures demonstrating the environmental benefits of a certain stadium<br />16. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> examples of the wide range of facilities available at some new stadiums<br />17. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> reference to the disadvantages of the stadiums built during a certain era</p><p style="text-align: justify;"><strong>Questions 18-22</strong><br />Complete the summary below. Choose <strong>ONE WORD ONLY</strong> from the passage for each answer. Write your answers in boxes 18-22 on your answer sheet.</p><p style="text-align: justify;"><strong>Roman amphitheatres</strong><br />The Roman stadiums o&#8217;1 Europe have proved very versatile. The amphitheatre of Arles, for example, was converted first into a (18) ………………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />. , then into a residential area and finally into an arena where spectators could watch (19) …………………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Meanwhile, the arena in Verona, one of the oldest Roman amphitheatres, is famous today as a venue where (20) ……………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />. is performed. The site of Lucca’s amphitheatre has also been used for many purposes over the centuries, including the storage of (21) ………………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />.. It is now a market square with (22) …………………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />.. and homes incorporated into the remains of the Roman amphitheatre.</p><p style="text-align: justify;"><strong>Questions 23 and 24</strong><br />Choose <strong>TWO</strong> letters, A-E. Write the correct letters in boxes 23 and 24 on your answer sheet.</p><p style="text-align: justify;">When comparing twentieth-century stadiums to ancient amphitheatres in Section D, which TWO negative features does the writer mention?<br /><strong>A</strong> They are less imaginatively designed.<br /><strong>B</strong> They are less spacious.<br /><strong>C</strong> They are in less convenient locations.<br /><strong>D</strong> They are less versatile.<br /><strong>E</strong> They are made of less durable materials.</p><p style="text-align: justify;">23. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> <br/> 24. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /></p><p style="text-align: justify;"><strong>Questions 25 and 26</strong><br />Choose <strong>TWO</strong> letters, A-E. Write the correct letters in boxes 25 and 26 on your answer sheet.</p><p style="text-align: justify;">Which <strong>TWO</strong> advantages of modern stadium design does the writer mention?<br /><strong>A</strong> offering improved amenities for the enjoyment of sports events<br /><strong>B</strong> bringing community life back into the city environment<br /><strong>C</strong> facilitating research into solar and wind energy solutions<br /><strong>D</strong> enabling local residents to reduce their consumption of electricity<br /><strong>E</strong> providing a suitable site for the installation of renewable power generators</p><p style="text-align: justify;">25. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> <br/> 26. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /></p><p><br /><ins style="display: block;" data-ad-client="ca-pub-5700321813195736" data-ad-slot="5477565220" data-ad-format="auto" data-full-width-responsive="true"></ins></p>` }} />
            <div style={{ display: activeTab === 2 ? 'block' : 'none' }} dangerouslySetInnerHTML={{
              __html: `<p style="text-align: justify;"><strong>Questions 27-31</strong><br />Complete the summary using the list of phrases, A-J, below. Write the correct letter, A-J, in boxes 27-31 on your answer sheet.</p><p style="text-align: justify;"><strong>The story behind the hunt for Charles II</strong></p><p style="text-align: justify;">Charles II’s father was executed by the Parliamentarian forces in 1649. Charles II then formed a (27) ………………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />. with the Scots, and in order to become King of Scots, he abandoned an important (28) …………………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> that was held by his father and had contributed to his father’s death. The opposing sides then met outside Worcester in 1651. The battle led to a (29) ……………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />.. for the Parliamentarians and Charles had to flee for his life. A (30) ………………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />. was offered for Charles’s capture, but after six weeks spent in hiding, he eventually managed to reach the (31) …………………… <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />. of continental Europe.</p><p style="text-align: justify;"><strong>A</strong> military innovation<br /><strong>B</strong> large reward<br /><strong>C</strong> widespread conspiracy<br /><strong>D</strong> relative safety<br /><strong>E</strong> new government<br /><strong>F</strong> decisive victory<br /><strong>G</strong> political debate<br /><strong>H</strong> strategic alliance<br /><strong>I</strong> popular solution<br /><strong>J</strong> religious conviction</p><p style="text-align: justify;"><strong>Questions 32-35</strong><br />Do the following statements agree with the claims of the writer in Reading Passage? In boxes 32-35 on your answer sheet, write</p><p style="text-align: justify;"><strong>YES</strong> if the statement agrees with the claims of the writer<br /><strong>NO</strong> if the statement contradicts the claims of the writer<br /><strong>NOT GIVEN</strong> if it is impossible to say what the writer thinks about this</p><p style="text-align: justify;">32. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Charles chose Pepys for the task because he considered him to be trustworthy.<br />33. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Charles’s personal recollection of the escape lacked sufficient detail.<br />34. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Charles indicated to Pepys that he had planned his escape before the battle.<br />35. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> The inclusion of Charles’s account is a positive aspect of the book.</p><p style="text-align: justify;"><strong>Questions 36-40</strong><br />Choose the correct letter, A, B, C or D.</p><p style="text-align: justify;">36. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> What is the reviewer’s main purpose in the first paragraph?<br /><strong>A</strong> to describe what happened during the Battle of Worcester<br /><strong>B</strong> to give an account of the circumstances leading to Charles II’s escape<br /><strong>C</strong> to provide details of the Parliamentarians’ political views<br /><strong>D</strong> to compare Charles Il’s beliefs with those of his father</p><p style="text-align: justify;">37. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Why does the reviewer include examples of the fugitives’ behaviour in the third paragraph?<br /><strong>A</strong> to explain how close Charles II came to losing his life<br /><strong>B</strong> to suggest that Charles II’s supporters were badly prepared<br /><strong>C</strong> to illustrate how the events of the six weeks are brought to life<br /><strong>D</strong> to argue that certain aspects are not as well known as they should be</p><p style="text-align: justify;">38. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> What point does the reviewer make about Charles II in the fourth paragraph?<br /><strong>A</strong> He chose to celebrate what was essentially a defeat.<br /><strong>B</strong> He misunderstood the motives of his opponents.<br /><strong>C</strong> He aimed to restore people’s faith in the monarchy.<br /><strong>D</strong> He was driven by a desire to be popular.</p><p style="text-align: justify;">39. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> What does the reviewer say about Charles Spencer in the fifth paragraph?<br /><strong>A</strong> His decision to write the book comes as a surprise.<br /><strong>B</strong> He takes an unbiased approach to the subject matter.<br /><strong>C</strong> His descriptions of events would be better if they included more detail.<br /><strong>D</strong> He chooses language that is suitable for a twenty-first-century audience.</p><p style="text-align: justify;">40. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> When the reviewer says the book ‘doesn’t quite hit the mark’, she is making the point that<br /><strong>A</strong> it overlooks the impact of events on ordinary people.<br /><strong>B</strong> it lacks an analysis of prevalent views on monarchy.<br /><strong>C</strong> it omits any references to the deceit practised by Charles II during his time in hiding.<br /><strong>D</strong> it fails to address whether Charles II’s experiences had a lasting influence on him.</p><p><br /><ins style="display: block;" data-ad-client="ca-pub-5700321813195736" data-ad-slot="7372142965" data-ad-format="auto" data-full-width-responsive="true"></ins></p>
<input type='hidden' bg_collapse_expand='6a9a51ad94e456043122101' value='6a9a51ad94e456043122101'><input type='hidden' id='bg-show-more-text-6a9a51ad94e456043122101'` }} />

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

                  {/* Correct Answers Reference */}
                  <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Answer Key</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                      <div>
                        <p>1. Population<br />2. Suburbs<br />3. Businessmen<br />4. Funding<br />5. Press<br />6. Soil<br />7. False<br />8. Not given<br />9. True<br />10. True<br />11. False<br />12. False<br />13. Not given<br />14. A<br />15. F<br />16. E<br />17. D<br />18. Fortress<br />19. Bullfights<br />20. Opera<br />21. Salt<br />22. Shops<br />23. C or D<br />24. C or D<br />25. B or E<br />26. B or E<br />27. H<br />28. J<br />29. F<br />30. B<br />31. D<br />32. Not given<br />33. No<br />34. No<br />35. Yes<br />36. B<br />37. C<br />38. A<br />39. B<br />40. D</p>
                      </div>
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
                className={`px-6 py-3 rounded-t-lg font-bold text-sm transition-colors border-x border-t ${activeTab === idx
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
            <div style={{ display: activeTab === 0 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: `<p style="text-align: center;"><strong>The development of the London underground railway</strong></p><p style="text-align: justify;">In the first half of the 1800s, London’s population grew at an astonishing rate, and the central area became increasingly congested. In addition, the expansion of the overground railway network resulted in more and more passengers arriving in the capital. However, in 1846, a Royal Commission decided that the railways should not be allowed to enter the City, the capital’s historic and business centre. The result was that the overground railway stations formed a ring around the City. The area within consisted of poorly built, overcrowded slums and the streets were full of horse-drawn traffic. Crossing the City became a nightmare. It could take an hour and a half to travel 8 km by horse-drawn carriage or bus. Numerous schemes were proposed to resolve these problems, but few succeeded.</p><p style="text-align: justify;">Amongst the most vocal advocates for a solution t0 London’s traffic problems was Charles Pearson, who worked as a solicitor for the City of London. He saw both social and economic advantages in building an underground railway that would link the overground railway stations together and clear London slums at the same time. His idea was to relocate the poor workers who lived in the inner-city slums to newly constructed suburbs, and to provide cheap rail travel for them to get to work. Pearson’s ideas gained support amongst some businessmen and in 1851 he submitted a plan to Parliament. It was rejected, but coincided with a proposal from another group for an underground connecting line, which Parliament passed.</p><p><br /><ins style="display: block;" data-ad-client="ca-pub-5700321813195736" data-ad-slot="5477565220" data-ad-format="auto" data-full-width-responsive="true"></ins></p><p style="text-align: justify;">The two groups merged and established the Metropolitan Railway Company in August 1854. The company’s plan was to construct an underground railway line from the Great Western Railway’s (GWR) station at Paddington to the edge of the City at Farringdon Street &#8211; a distance of almost 5 km. The organisation had difficulty in raising the funding for such a radical and expensive scheme, not least because of the critical articles printed by the press. Objectors argued that the tunnels would collapse under the weight of traffic overhead, buildings would be shaken and passengers would be poisoned by the emissions from the train engines. However, Pearson and his partners persisted.</p><p style="text-align: justify;">The GWR, aware that the new line would finally enable them to run trains into the heart of the City, invested almost £250,000 in the scheme. Eventually, over a five-year period, £1m was raised. The chosen route ran beneath existing main roads to minimise the expense of demolishing buildings. Originally scheduled to be completed in 21 months, the construction of the underground line took three years. It was built just below street level using a technique known as ‘cut and cover’. A trench about ten metres wide and six metres deep was dug, and the sides temporarily held up with timber beams. Brick walls were then constructed, and finally a brick arch was added to create a tunnel. A two-metre-deep layer of soil was laid on top of the tunnel and the road above rebuilt.</p><p style="text-align: justify;">The Metropolitan line, which opened on 10 January 1863, was the world’s first underground railway. On its first day, almost 40,000 passengers were carried between Paddington and Farringdon, the journey taking about 18 minutes. By the end of the Metropolitan’s first year of operation, 9.5 million journeys had been made. Even as the Metropolitan began operation, the first extensions to the line wen being authorised; these were built over the next five years, reaching Moorgate in the east of London and Hammersmith in the west. The original plan was to pull the trains with steam locomotives, using firebricks in the boilers to provide steam, but these engines were never introduced. Instead, the line used specially designed locomotives that were fitted with water tanks in which steam could be condensed. However, smoke and fumes remained a problem, even though ventilation shafts were added to the tunnels.</p><p style="text-align: justify;">Despite the extension of the underground railway, by the 1880s, congestion on London’s streets had become worse. The problem was partly that the exiting underground lines formed a circuit around the centre of London and extended *o tie suburbs, but did not cross the capital’s centre. The ‘cut and cover’ method of construction; not an option in this part of the capital. The only alternative was to tunnel deep underground. Although the technology to create these tunnels existed, steam locomotives could not be used in such a confined space. It wasn’t until the development of a reliable electric motor, and a means of transferring power from the generator to a moving train, that the world’s first deep-level electric railway, the City &amp; South London, became possible. The line opened in 1890, and ran from the City to Stockwell, south of the River Thames. The trains were made up of three carriages and driven by electric engines. The carriages were narrow and had tiny windows just below the roof because it was thought that passengers would not want to look out at the tunnel walls. The line was not without its problems, mainly caused by an unreliable power supply. Although the City &amp; South London Railway was a great technical achievement, it did not make a profit. Then, in 1900, the Central London Railway, known as the ‘Tuppenny Tube’, began operation using new electric locomotives. It was very popular and soon afterwards new railways and extensions were added to the growing tube network. By 1907, the heart of today’s Underground system was in place.</p>` }} />
            <div style={{ display: activeTab === 1 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: `<p style="text-align: center;"><strong>Stadiums: past, present and future</strong></p><p style="text-align: justify;"><strong>A</strong> Stadiums are among the oldest forms of urban architecture: vast stadiums where the public could watch sporting events were at the centre of western city life as far back as the ancient Greek and Roman Empires, well before the construction of the great medieval cathedrals and the grand 19th- and 20th-century railway stations which dominated urban skylines in later eras. Today, however, stadiums are regarded with growing scepticism. Construction costs can soar above £1 billion, and stadiums finished for major events such as the Olympic Games or the FIFA World Cup have notably fallen into disuse and disrepair. But this need not be the case. History shows that stadiums can drive urban development and adapt to the culture of every age. Even today, architects and planners are finding new ways to adapt the mono-functional sports arenas which became emblematic of modernisation during the 20th century.</p><p style="text-align: justify;"><strong>B</strong> The amphitheatre of Arles in southwest France, with a capacity of 25,000 spectators, is perhaps the best example of just how versatile stadiums can be. Built by the Romans in 90 AD, it became a fortress with four towers after the fifth century, and was then transformed into a village containing more than 200 houses. With the growing interest in conservation during the 19th century, it was converted back into an arena for the staging of bullfights, thereby returning the structure to its original use as a venue for public spectacles. Another example is the imposing arena of Verona in northern Italy, with space for 30,000 spectators, which was built 60 years before the Arles amphitheatre and 40 years before Rome’s famous Colosseum. It has endured the centuries and is currently considered one of the world’s prime sites for opera, thanks to its outstanding acoustics.</p><p style="text-align: justify;"><strong>C</strong> The area in the centre of the Italian town of Lucca, known as the Piazza dell’ Anfiteatro, is yet another impressive example of an amphitheatre becoming absorbed into the fabric of the city. The site evolved in a similar way to Arles and was progressively filled with buildings from the Middle Ages until the 19th century, variously used as houses, a salt depot and a prison. But rather than reverting to an arena, it became a market square, designed by Romanticist architect Lorenzo Nottolini. Today, the ruins of the amphitheatre remain embedded in the various shops and residences surrounding the public square.</p><p style="text-align: justify;"><strong>D</strong> There are many similarities between modern stadiums and the ancient amphitheatres intended for games. But some of the flexibility was lost at the beginning of the 20th century, as stadiums were developed using new products such as steel and reinforced concrete, and made use of bright lights for night-time matches. Many such stadiums are situated in suburban areas, designed for sporting use only and surrounded by parking lots. These factors mean that they may not be as accessible to the general public, require more energy to run and contribute to urban heat.</p><p style="text-align: justify;"><strong>E</strong> But many of today’s most innovative architects see scope for the stadium to help improve the city. Among the current strategies, two seem to be having particular success: the stadium as an urban hub, and as a power plant.<br />There’s a growing trend for stadiums to be equipped with public spaces and services that serve a function beyond sport, such as hotels, retail outlets, conference centres, restaurants and bars, children’s playgrounds and green space. Creating mixed-use developments such as this reinforces compactness and multi-functionality, making more efficient use of land and helping to regenerate urban spaces. This opens the space up to families and a wider cross-section of society, instead of catering only to sportspeople and supporters. There have been many examples of this in the UK: the mixed-use facilities at Wembley and Old Trafford have become a blueprint for many other stadiums in the world.</p><p style="text-align: justify;"><strong>F</strong> The phenomenon of stadiums as power stations has arisen from the idea that energy problems can be overcome by integrating interconnected buildings by means of a smart grid, which is an electricity supply network that uses digital communications technology to detect and react to local changes in usage, without significant energy losses. Stadiums are ideal for these purposes, because their canopies have a large surface area for fitting photovoltaic panels and rise high enough (more than 4) metres) to make use of micro wind turbines. Freiburg Mage Solar Stadium in Germany is the first of a new wave of stadiums as power plants, which also includes the Amsterdam Arena and the Kaohsiung Stadium. The latter, inaugurated in 2009, has 8,844 photovoltaic panels producing up to 1.14 GWh of electricity annually. This reduces the annual output of carbon dioxide by 660 tons and supplies up to 80 percent of the surrounding area when the stadium is not in use. This is proof that a stadium can serve its city, and have a decidedly positive impact in terms of reduction of CO2 emissions.</p><p style="text-align: justify;"><strong>G</strong> Sporting arenas have always been central to the life and culture of cities. In every era, the stadium has acquired new value and uses: from military fortress to residential village, public space to theatre and most recently a field for experimentation in advanced engineering. The stadium of today now brings together multiple functions, thus helping cities to create a sustainable future.</p>` }} />
            <div style={{ display: activeTab === 2 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: `<p style="text-align: center;"><strong>To catch a king</strong></p><p style="text-align: justify;">Charles Spencer’s latest book, To Catch a King, tells us the story of the hunt for King Charles II in the six weeks after his resounding defeat at the Battle of Worcester in September 1651. And what a story it is. After his father was executed by the Parliamentarians in 1649, the young Charles II sacrificed one of the very principles his father had died for and did a deal with the Scots, thereby accepting Presbyterianism as the national religion in return for being crowned King of Scots. His arrival in Edinburgh prompted the English Parliamentary army to invade Scotland in a pre-emptive strike. This was followed by a Scottish invasion of England. The two sides finally faced one another at Worcester in the west of England in 1651. After being comprehensively defeated on the meadows outside the city by the Parliamentarian army, the 21-year-old king found himself the subject of a national manhunt, with a huge sum offered for his capture. Over the following six weeks he managed, through a series of heart-poundingly close escapes, to evade the Parliamentarians before seeking refuge in France. For the next nine years, the penniless and defeated Charles wandered around Europe with only a small group of loyal supporters.</p><p style="text-align: justify;">Years later, after his restoration as king, the 50-year-old Charles II requested a meeting with the writer and diarist Samuel Pepys. His intention when asking Pepys to commit his story to paper was to ensure that this most extraordinary episode was never forgotten. Over two three-hour sittings, the king related to him in great detail his personal recollections of the six weeks he had spent as a fugitive. As the king and secretary settled down (a scene that is surely a gift for a future scriptwriter), Charles commenced his story: ‘After the battle was so absolutely lost as to be beyond hope of recovery, I began to think of the best way of saving myself.’</p><p style="text-align: justify;">One of the joys of Spencer’s book, a result not least of its use of Charles II’s own narrative as well as those of his supporters, is just how close the reader gets to the action. The day-by-day retelling of the fugitives’ doings provides delicious details: the cutting of the king’s long hair with agricultural shears, the use of walnut leaves to dye his pale skin, and the day Charles spent lying on a branch of the great oak tree in Boscobel Wood as the Parliamentary soldiers scoured the forest floor below. Spencer draws out both the humour &#8211; such as the preposterous refusal of Charles’s friend Henry Wilmot to adopt disguise on the grounds that it was beneath his dignity &#8211; and the emotional tension when the secret of king’s presence was cautiously revealed to his supporters.</p><p style="text-align: justify;">Charles’s adventures after losing the Battle of Worcester hide the uncomfortable truth that whilst almost everyone in England had been appalled by the execution of his father, they had not welcomed the arrival of his son with the Scots army, but had instead firmly bolted their doors. This was partly because he rode at the head of what looked like a foreign invasion force and partly because, after almost a decade of civil war, people were desperate to avoid it beginning again. This makes it all the more interesting that Charles II himself loved the story so much ever after. As well as retelling it to anyone who would listen, causing eye-rolling among courtiers, he set in train a series of initiatives to memorialise it. There was to be a new order of chivalry, the Knights of the Royal Oak. A series of enormous oil paintings depicting the episode were produced, including a two-metre-wide canvas of Boscobel Wood and a set of six similarly enormous paintings of the king on the run. In 1660, Charles II commissioned the artist John Michael Wright to paint a flying squadron of cherubs carrying an oak tree to the heavens on the ceiling of his bedchamber. It is hard to imagine many other kings marking the lowest point in their life so enthusiastically, or indeed pulling off such an escape in the first place.</p><p style="text-align: justify;">Charles Spencer is the perfect person to pass the story on to a new generation. His pacey, readable prose steers deftly clear of modern idioms and elegantly brings to life the details of the great tale. He has even-handed sympathy for both the fugitive king and the fierce republican regime that hunted him, and he succeeds in his desire to explore far more of the background of the story than previous books on the subject have done. Indeed, the opening third of the book is about how Charles II found himself at Worcester in the first place, which for some will be reason alone to read To Catch a King.</p><p style="text-align: justify;">The tantalising question left, in the end, is that of what it all meant. Would Charles II have been a different king had these six weeks never happened? The days and nights spent in hiding must have affected him in some way. Did the need to assume disguises, to survive on wit and charm alone, to use trickery and subterfuge to escape from tight corners help form him? This is the one area where the book doesn’t quite hit the mark. Instead its depiction of Charles II in his final years as an ineffective, pleasure-loving monarch doesn’t do justice to the man (neither is it accurate), or to the complexity of his character. But this one niggle aside, To Catch a King is an excellent read, and those who come to it knowing little of the famous tale will find they have a treat in store.</p>` }} />
          </div>
        </section>
      </main>
    </div>
  );
}
