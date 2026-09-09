
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Highlighter, Trash2 } from 'lucide-react';

export default function IELTSReadingTest17_2() {
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [activeTab, setActiveTab] = useState(0);
  const [highlightCount, setHighlightCount] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const passageRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);

  const correctAnswers: Record<number, string> = {
    1: 'Rock',
    2: 'Cave',
    3: 'Clay',
    4: 'Essenes',
    5: 'Hebrew',
    6: 'Not given',
    7: 'False',
    8: 'True',
    9: 'True',
    10: 'False',
    11: 'False',
    12: 'True',
    13: 'Not given',
    14: 'C',
    15: 'B',
    16: 'E',
    17: 'A',
    18: 'C',
    19: 'B',
    20: 'D',
    21: 'A',
    22: 'C',
    23: 'A',
    24: 'Falvour/ flavor',
    25: 'Size',
    26: 'Salt',
    27: 'D',
    28: 'A',
    29: 'A',
    30: 'C',
    31: 'A',
    32: 'No',
    33: 'Not given',
    34: 'Yes',
    35: 'No',
    36: 'Not given',
    37: 'F',
    38: 'D',
    39: 'E',
    40: 'B'
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
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <header className="flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-8 shadow-sm z-20">
        <div className="flex items-center">
          <Link href="/" className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Link>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">IELTS Reading Test 17.2</h1>
        </div>
        <div className="flex items-center gap-3">
          {highlightCount > 0 && (
            <button onClick={clearAllHighlights} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-all text-sm font-semibold shadow-sm" title="Clear all highlights">
              <Trash2 className="w-4 h-4" /> Clear All ({highlightCount})
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50/60 border border-amber-200/50 text-amber-600 text-sm font-medium">
            <Highlighter className="w-4 h-4" /> <span>Select text to highlight</span>
          </div>
          <div className="flex items-center bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200 shadow-inner">
            <Clock className="w-5 h-5 text-slate-500 mr-3" />
            <span className="font-mono text-xl font-bold text-slate-700">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden relative p-6 gap-6">
        <section className="w-1/2 relative z-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-y-auto scroll-smooth flex flex-col">
          <div ref={questionsRef} className="p-10 prose prose-slate prose-p:mb-6 prose-headings:text-slate-800 prose-p:text-slate-700 max-w-none flex-1">
            <div style={{ display: activeTab === 0 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: `
<p><strong>Questions 1-5</strong><br/>Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.</p>
<p><strong>The Dead Sea Scrolls</strong><br/>
<strong>Discovery</strong><br/>
Qumran, 1946/7<br/>
• three Bedouin shepherds in their teens were near an opening on side of cliff<br/>
• heard a noise of breaking when one teenager threw a (1) <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />.<br/>
• teenagers went into the (2) <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> and found a number of containers made of (3) <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />.</p>
<p><strong>The scrolls</strong><br/>
• date from between 150 BCE and 70 CE<br/>
• thought to have been written by group of people known as the (4) <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />.<br/>
• written mainly in the (5) <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> language<br/>
• most are on religious topics, written using ink on parchment or papyrus</p>
<p><strong>Questions 6-13</strong><br/>Do the following statements agree with the information given in Reading Passage? In boxes 6-13 on your answer sheet, write</p>
<p>TRUE if the statement agrees with the information<br/>
FALSE if the statement contradicts the information<br/>
NOT GIVEN if there is no information on this</p>
<p>6. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> The Bedouin teenagers who found the scrolls were disappointed by how little money they received for them.<br/>
7. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> There is agreement among academics about the origin of the Dead Sea Scrolls.<br/>
8. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Most of the books of the Bible written on the scrolls are incomplete.<br/>
9. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> The information on the Copper Scroll is written in an unusual way.<br/>
10. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Mar Samuel was given some of the scrolls as a gift.<br/>
11. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> In the early 1950s, a number of educational establishments in the US were keen to buy scrolls from Mar Samuel.<br/>
12. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> The scroll that was pieced together in 2017 contains information about annual occasions in the Qumran area 2.000 yea-s ago.<br/>
13. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Academics at the University of Haifa are currently researching how to decipher the final scroll.</p>
` }} />
            <div style={{ display: activeTab === 1 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: `
<p><strong>Questions 14-18</strong><br/>Reading Passage has five sections, A-E. Which section contains the following information? Write the correct letter, A-E, in boxes 14-18 on your answer sheet. NB You may use any letter more than once.</p>
<p>14. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> a reference to a type of tomato that can resist a dangerous infection<br/>
15. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> an explanation of how problems can arise from focusing only on a certain type of tomato plant.<br/>
16. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> a number of examples of plants that are not cultivated at present but could be useful as food sources<br/>
17. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> a comparison between the early domestication of the tomato and more recent research<br/>
18. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> a personal reaction to the flavour of a tomato that has been genetically edited</p>
<p><strong>Questions 19-23</strong><br/>Look at the following statements (Questions 19-23) and the list of researchers below. Match each statement with the correct researcher, A-D. Write the correct letter, A-D, in boxes 19-23 on your answer sheet. NB You may use any letter more than once.</p>
<p>19. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Domestication of certain plants could allow them to adapt to future environmental challenges.<br/>
20. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> The idea of growing and eating unusual plants may not be accepted on a large scale.<br/>
21. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> It is not advisable for the future direction of certain research to be made public.<br/>
22. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Present efforts to domesticate one wild fruit are limited by the costs involved.<br/>
23. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Humans only make use of a small proportion of the plant food available on Earth.</p>
<p><strong>List of Researchers</strong><br/>
A Jorg Kudla<br/>
B Caixia Gao<br/>
C Joyce Van Eck<br/>
D Jonathan Jones</p>
<p><strong>Questions 24-26</strong><br/>Complete the sentences below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 24-26 on your answer sheet.</p>
<p>24. An undesirable trait such as loss of <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> may be caused by a mutation in a tomato gene.<br/>
25. By modifying one gene in a tomato plant, researchers made the tomato three times its original <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />.<br/>
26. A type of tomato which was not badly affected by <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> and was rich in vitamin C, was produced by a team of researchers in China.</p>
` }} />
            <div style={{ display: activeTab === 2 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: `
<p><strong>Questions 27-31</strong><br/>Choose the correct letter, A, B, C or D.</p>
<p>27. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> The purpose of the first paragraph is to<br/>
A defend particular ideas.<br/>
B compare certain beliefs.<br/>
C disprove a widely held view.<br/>
D outline a common assumption.</p>
<p>28 <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> What are the writers doing in the second<br/>
A criticising an opinion<br/>
B justifying a standpoint<br/>
C explaining an approach<br/>
D supporting an argument</p>
<p>29. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> In the third paragraph, what do the writers suggest about Darwin and Einstein?<br/>
A They represent an exception to a general rule.<br/>
B Their way of working has been misunderstood.<br/>
C They are an ideal which others should aspire to.<br/>
D Their achievements deserve greater recognition.</p>
<p>30. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> John Nicholson is an example of a person whose idea<br/>
A established his reputation as an influential scientist.<br/>
B was only fully understood at a later point in history.<br/>
C laid the foundation for someone else's breakthrough.<br/>
D initially met with scepticism from the scientific community.</p>
<p>31. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> What is the key point of interest about the 'acey-deucy' stirrup placement?<br/>
A the simple reason why it was invented<br/>
B the enthusiasm with which it was adopted<br/>
C the research that went into its development<br/>
D the cleverness of the person who first used it</p>
<p><strong>Questions 32-36</strong><br/>Do the following statements agree with the claims of the writer in Reading Passage? In boxes 32-36 on your answer sheet, write</p>
<p>YES if the statement agrees with the claims of the writer<br/>
NO if the statement contradicts the claims of the writer<br/>
NOT GIVEN if it is impossible to say what the writer thinks about this</p>
<p>32. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Acknowledging people such as Plato or da Vinci as geniuses will help us understand the process by which great minds create new ideas.<br/>
33. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> The Law of Effect was discovered at a time when psychologies were seeking a scientific reason why creativity occurs.<br/>
34. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> The Law of Effect states that no planning is involved in the behaviour of organisms.<br/>
35. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> The Law of Effect sets out clear explanations about sources of new ideas and behaviours.<br/>
36. <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> Many scientists are now turning away from the notion of intelligent design and genius.</p>
<p><strong>Questions 37-40</strong><br/>Complete the summary using the list of words, A-G, below. Write the correct letter, A-G, in boxes 37-40 on your answer sheet.</p>
<p><strong>The origins of creative behaviour</strong><br/>
The traditional view of scientific discovery is that breakthroughs happen when a single great mind has sudden (37) <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />. Although this can occur, it is not often the case. Advances are more likely to be the result of a longer process. In some cases, this process involves (38) <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />, such as Nicholson's theory about proto-elements. In others, simple necessity may provoke innovation, as with Westrope's decision to modify the position of his riding stirrups. There is also often an element of (39) <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />, for example, the coincidence of ideas that led to the invention of the Post-It note. With both the Law of Natural Selection and the Law of Effect, there may be no clear (40) <input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" /> involved, but merely a process of variation and selection.</p>
<p><strong>List of Words</strong><br/>
A invention<br/>
B goals<br/>
C compromise<br/>
D mistakes<br/>
E luck<br/>
F inspiration<br/>
G experiments</p>
` }} />
            
            <div className="mt-12 border-t border-slate-100 pt-8 pb-8">
              <button
                onClick={() => {
                  if (!showAnswers) collectUserAnswers();
                  setShowAnswers(!showAnswers);
                }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5"
              >
                {showAnswers ? 'Hide Answers' : 'Show Answers'}
              </button>
              
              {showAnswers && (
                <div className="mt-6 space-y-6">
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
                                <td className={`py-2 px-4 font-semibold ${!answered ? 'text-slate-400 italic' : correct ? 'text-emerald-700' : 'text-red-600'}`}>
                                  {answered ? userAns : '—'}
                                </td>
                                <td className="py-2 px-4 font-semibold text-slate-700">{correctAns}</td>
                                <td className="py-2 px-4 text-center text-lg">
                                  {!answered ? <span className="text-slate-300">—</span> : correct ? <span className="text-emerald-500">✓</span> : <span className="text-red-500">✗</span>}
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

                  <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Answer Key</h3>
                    <div className="text-sm text-slate-700">
                      <p dangerouslySetInnerHTML={{ __html: `1. Rock<br />2. Cave<br />3. Clay<br />4. Essenes<br />5. Hebrew<br />6. Not given<br />7. False<br />8. True<br />9. True<br />10. False<br />11. False<br />12. True<br />13. Not given<br />14. C<br />15. B<br />16. E<br />17. A<br />18. C<br />19. B<br />20. D<br />21. A<br />22. C<br />23. A<br />24. Falvour/ flavor<br />25. Size<br />26. Salt<br />27. D<br />28. A<br />29. A<br />30. C<br />31. A<br />32. No<br />33. Not given<br />34. Yes<br />35. No<br />36. Not given<br />37. F<br />38. D<br />39. E<br />40. B` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="w-1/2 relative z-10 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden">
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
          <div ref={passageRef} onMouseUp={handleHighlight} className="p-10 prose prose-slate prose-headings:text-slate-800 prose-p:text-slate-700 prose-p:mb-6 prose-strong:text-slate-700 max-w-none overflow-y-auto scroll-smooth flex-1 selection:bg-amber-200/50">
            <div style={{ display: activeTab === 0 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: `
<h3>The Dead Sea Scrolls</h3>
<p>In late 1946 or early 1947, three Bedouin teenagers were tending their goats and sheep near the ancient settlement of Qumran, located on the northwest shore of the Dead Sea in what is now known as the West Bank. One of these young shepherds tossed a rock into an opening on the side of a cliff and was surprised to hear a shattering sound. He and his companions later entered the cave and stumbled across a collection of large clay jars, seven of which contained scrolls with writing on them. The teenagers took the seven scrolls to a nearby town where they were sold for a small sum to a local antiquities dealer. Word of the find spread, and Bedouins and archaeologists eventually unearthed tens of thousands of additional scroll fragments from 10 nearby caves; together they make up between 800 and 900 manuscripts. It soon became clear that this was one of the greatest archaeological discoveries ever made.</p>
<p>The origin of the Dead Sea Scrolls, which were written around 2,000 years ago between 150 BCE and 70 CE, is still the subject of scholarly debate even today. According to the prevailing theory, they are the work of a population that inhabited the area until Roman troops destroyed the settlement around 70 CE. The area was known as Judea at that time, and the people are thought to have belonged to a group called the Essenes, a devout Jewish sect.</p>
<p>The majority of the texts on the Dead Sea Scrolls are in Hebrew, with some fragments written in an ancient version of its alphabet thought to have fallen out of use in the fifth century BCE. Bu' there are other languages as well. Some scrolls are in Aramaic, the language spoken by many inhabitants of the region from the sixth century BCE to the siege of Jerusalem in 70 CE. In addition, several texts feature translations of the Hebrew Bible into Greek.</p>
<p>The Dead Sea Scrolls include fragments from every book of the Old Testament of the Bible except for the Book of Esther. The only entire book of the Hebrew Bible preserved among the manuscripts from Qumran is Isaiah; this copy, dated to the first century BCE, is considered the earliest biblical manuscript still in existence. Along with biblical texts, the scrolls include documents about sectarian regulations and religious writings that do not appear in the Old Testament.</p>
<p>The writing on the Dead Sea Scrolls is mostly in black or occasionally red ink, and the scrolls themselves are nearly all made of either parchment (animal skin) or an early form of paper called 'papyrus'. The only exception is the scroll numbered 3Q15, which was created out of a combination of copper and tin. Known as the Copper Scroll, this curious document features letters chiselled onto metal - perhaps, as some have theorized, to better withstand the passage of time. One of the most intriguing manuscripts from Qumran, this is a sort of ancient treasure map that lists dozens of gold and silver caches. Using an unconventional vocabulary and odd spelling, it describes 64 underground hiding places that supposedly contain riches buried for safekeeping. None of these hoards have been recovered, possibly because the Romans pillaged Judea during the first century CE. According to various hypotheses, the treasure belonged to local people, or was rescued from the Second Temple before its destruction or never existed to begin with.</p>
<p>Some of the Dead Sea Scrolls have been on interesting journeys. In 1948, a Syrian Orthodox archbishop known as Mar Samuel acquired four of the original seven scrolls from a Jerusalem shoemaker and part-time antiquity dealer, paying less than $100 for them. He then travelled to the United States and unsuccessfully offered them to a number of universities, including Yale. Finally, in 1954, he placed an advertisement in the business newspaper The Wall Street Journal' - under the category 'Miscellaneous Items for Sale' - that read: 'Biblical Manuscripts : dating back to at least 200 B.C. are for sale. This would be an ideal gift to an educational or religious institution by an individual or group.' Fortunately, Israeli archaeologist and statesman Yigael Yadin negotiated their purchase and brought the scrolls back to Jerusalem, where they remain to this day.</p>
<p>In 2017, researchers from the University of Haifa restored and deciphered one of the last untranslated scrolls. The university's Eshbal Ratson and Jonathan Ben-Dov spent one year reassembling the 60 fragments that make up the scroll. Deciphered from a band of coded text on parchment, the find provides insight into the community of people who wrote it and the 364-day calendar they would have used. The scroll names celebrations that indicate shifts in seasons and details two yearly religious events known from another Dead Sea Scroll. Only one more known scroll remains untranslated.</p>
` }} />
            <div style={{ display: activeTab === 1 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: `
<h3>A second attempt at domesticating the tomato</h3>
<p><strong>A</strong> It took at least 3,000 years for humans to learn how to domesticate the wild tomato and cultivate it for food. Now two separate teams in Brazil and China have done it all over again in less than three years. And they have done it better in some ways, as the re-domesticated tomatoes are more nutritious than the ones we eat at present. This approach relies on the revolutionary CRISPR genome editing technique, in which changes are deliberately made to the DNA of a living cell, allowing genetic material to be added, removed or altered. The technique could not only improve existing crops, but could also be used to turn thousands of wild plants into useful and appealing foods. In fact, a third team in the US has already begun to do this with a relative of the tomato called the groundcherry.</p>
<p>This fast-track domestication could help make the world's food supply healthier and far more resistant to diseases, such as the 'us fungus devastating wheat crops. 'This could transform what we eat,' says Jo-g Kudla at the University of Munster in Germany, a member of the Brazilian team. 'There are 50,000 edible plants in the world, but 90 percent of our energy comes from just 15 crops.' 'We can now mimic the known domestication course of major crops like rice, maize, sorghum or others,' says Caixia Gao of the Chinese Academy of Sciences in Beijing. 'Then we might try to domesticate plants that have never been domesticated.'</p>
<p><strong>B</strong> Wild tomatoes, which, are native to the Andes region in South America, produce pea-sized fruits. many generations, peoples such as the Aztecs and Incas transformed the pint by selecting and breeding plants with mutations in their genetic structure, which resulted in desirable traits such as larger fruit. But every time a single plant with a mutation is taken from a larger population for breeding, much genetic diversity is lost. And sometimes the desirable mutations come with less desirable traits. For instance, the tomato strains grown for supermarkets have lost much of their flavour. By comparing the genomes of modern plants to those of their wild relatives, biologists have been working out what genetic changes occurred as plants were domesticated. The teams in Brazil and China have now used this knowledge to reintroduce these changes from scratch while maintaining or even enhancing the desirable traits of wild strains.</p>
<p><strong>C</strong> Kudla's team made six changes altogether. For instance, they tripled the size of fruit by editing a gene called FRUIT WEIGHT, and increased the number of tomatoes per truss by editing another called MULTIFLORA. While the historical domestication of tomatoes reduced levels of the red pigment lycopene - thought to have potential health benefits - the team in Brazil managed to boost it instead. The wild tomato has twice as much lycopene as cultivated ones; the newly domesticated one has five times as much. 'They are quite tasty,' says Kudla. 'A little bit strong. And very aromatic.' The team in China re-domesticated several strains of wild tomatoes with desirable traits lost in domesticated tomatoes. In this way they managed to create a strain resistant to a common disease called bacterial spot race, which can devastate yields. They also created another strain that is more salt tolerant - and has higher levels of vitamin C.</p>
<p><strong>D</strong> Meanwhile, Joyce Van Eck at the Boyce Thompson Institute in New York state decided to use the same approach to domesticate the groundcherry or goldenberry (Physalis pruinosa) for the first time. This fruit looks similar to the closely related Cape gooseberry (Physalis peruviana). Groundcherries are already sold to a limited extent in the US but they are hard to produce because the plant has a sprawling growth habit and the small fruits fall off the branches when ripe. Van Ecks team has edited the plants to increase fruit size, make their growth more compact and to stop fruits dropping. 'There's potential for this to be a commercial e^,' says Van Eck. But she adds that taking the work further would be expensive because of the need to pay for a licence for the CRISPR technology and get regulatory approval.</p>
<p><strong>E</strong> This approach could boost the use of many obscure plants, says Jonathan Jones of the Sainsbury Lab in the UK. But it will be hard for new foods to grow so popular with farmers and consumers that they become new staple crops, he thinks. The three teams already have their eye on other plants that could be 'catapulted into the mainstream', including foxtail, oat-grass and cowpea. By choosing wild plants that are drought or heat tolerant, says Gao, we could create crops that will thrive even as the planet warms. But Kudla didn't want to reveal which species were in his team's sights, because CRISPR has made the process so easy. 'Any one with the right skills could go to their lab and do this.'</p>
` }} />
            <div style={{ display: activeTab === 2 ? 'block' : 'none' }} dangerouslySetInnerHTML={{ __html: `
<h3>Insight or evolution?</h3>
<p><strong>Two scientists consider the origins of discoveries and other innovative behavior</strong></p>
<p>Scientific discovery is popularly believed to result from the sheer genius of such intellectual stars as naturalist Charles Darwin and theoretical physicist Albert Einstein. Our view of such unique contributions to science often disregards the person's prior experience and the efforts of their lesser-known predecessors. Conventional wisdom also places great weight on insight in promoting breakthrough scientific achievements, as if ideas spontaneously pop into someone's head - fully formed and functional.</p>
<p>There may be some limited truth to this view. However, we believe that it largely misrepresents the real nature of scientific discovery, as well as that of creativity and innovation in many other realms of human endeavor. Setting aside such greats as Darwin and Einstein - whose monumental contributions are duly celebrated - we suggest that innovation is more a process of trial and error, where two steps forward may sometimes come with one step back, as well as one or more steps to the right or left. This evolutionary view of human innovation undermines the notion of creative genius and recognizes the cumulative nature of scientific progress.</p>
<p>Consider one unheralded scientist John Nicholson, a mathematical physicist working in the 1910s who postulated the existence of 'proto-elements' in outer space. By combining different numbers of weights of these proto-elements' atoms, Nicholson could recover the weights of all the elements in the then-known periodic table. These successes are all the more noteworthy given the fact that Nicholson was wrong about the presence of proto-elements: they do not actually exist. Yet, amid his often fanciful theories and wild speculations, Nicholson also proposed a novel theory about the structure of atoms. Niels Bohr, the Nobel prize-winning father of modern atomic theory, jumped off from this interesting idea to conceive his now-famous model of the atom.</p>
<p>What are we to make of this story? One might simply conclude that science is a collective and cumulative enterprise. That may be true, but there may be a deeper insight to be gleaned. We propose that science is constantly evolving, much as species of animals do. In biological systems, organisms may display new characteristics that result from random genetic mutations. In the same way, random, arbitrary or accidental mutations of ideas may help pave the way for advances in science. If mutations prove beneficial, then the animal or the scientific theory will continue to thrive and perhaps reproduce.</p>
<p>Support for this evolutionary view of behavioral innovation comes from many domains. Consider one example of an influential innovation in US horseracing. The so-called 'acey-deucy' stirrup placement, in which the rider's foot in his left stirrup is placed as much as 25 centimeters lower than the right, is believed to confer important speed advantages when turning on oval tracks. It was developed by a relatively unknown jockey named Jackie Westrope. Had Westrope conducted methodical investigations or examined extensive film records in a shrewd plan to outrun his rivals? Had he foreseen the speed advantage that would be conferred by riding acey-deucy? No. He suffered a leg injury, which left him unable to fully bend his left knee. His modification just happened to coincide with enhanced left-hand turning performance. This led to the rapid and widespread adoption of riding acey-deucy by many riders, a racing style which continues in today's thoroughbred racing.</p>
<p>Plenty of other stories show that fresh advances can arise from error, misadventure, and also pure serendipity - a happy accident. For example, in the early 1970s, two employees of the company 3M each had a problem: Spencer Silver had a product - a glut which was only slightly sticky - and no use for it, while his colleague Art Fry was trying to figure out how to affix temporary bookmarks in his hymn book without damaging its pages. The solution to both these problems was the invention of the brilliantly simple yet phenomenally successful Post-It note. Such examples give lie to the claim that ingenious, designing minds are responsible for human creativity and invention. Far more banal and mechanical forces may be at work; forces that are fundamentally connected to the laws of science.</p>
<p>The notions of insight, creativity and genius are often invoked, but they remain vague and of doubtful scientific utility, especially when one considers the diverse and enduring contributions of individuals such as Plato, Leonardo da Vinci, Shakespeare, Beethoven, Galileo, Newton, Kepler, Curie, Pasteur and Edison. These notions merely label rather than explain the evolution of human innovations. We need another approach, and there is a promising candidate.</p>
<p>The Law of Effect was advanced by psychologist Edward Thorndike in 1898, some 40 years after Charles Darwin published his ground breaking work on biological evolution, On the Origin of Species. This simple law holds that organisms tend to repeat successful behaviors and to refrain from performing unsuccessful ones. Just like Darwin's Law of Natural Selection, the Law of Effect involves a entirely mechanical process of variation and selection, without any end objective in sight.</p>
<p>Of course, the origin of human innovation demands much further study. In particular, the provenance of the raw material on which the Law of Effect operates is not as clearly known as that of the genetic mutations on which the Law of Natural Selection operates. The generation of novel ideas and behaviors may not be entirely random, but constrained by prior successes and failures - of the current individual (such as Bohr) or of predecessors (such as Nicholson). The time seems right for abandoning the naive notions of intelligent design and genius, and for scientifically exploring the true origins of creative behavior.</p>
` }} />
          </div>
        </section>
      </main>
    </div>
  );
}
