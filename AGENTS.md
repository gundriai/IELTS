<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Instructions for Adding New IELTS Tests

> **📄 REFERENCE FILE:** Use `app/test/18.1/reading/page.tsx` as the canonical template for all new reading tests. Read it before writing any code. It contains the complete, working implementation of every feature described below.

When the user asks you to add a new IELTS test and provides the raw HTML, follow these instructions strictly:

## 1. Directory Structure
Create a new folder for the test ID provided by the user under `app/test/`. Inside it, create the specific category folder (e.g., `reading`, `listening`, `writing`), and inside that, `page.tsx`.
Example for Test 231 Reading: `app/test/231/reading/page.tsx`

## 2. Layout Structure
The page must be a `"use client"` React component (`page.tsx`) with a split-screen layout:
- **Left Side (1/2 width):** All Questions (synced with active tab) and the "Show Answers" button/section.
- **Right Side (1/2 width):** All Reading Passages separated into 3 Tabs.

### Required Imports
```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Highlighter, Trash2 } from 'lucide-react';
```

### Required State & Refs
```tsx
const [showAnswers, setShowAnswers] = useState(false);
const [timeLeft, setTimeLeft] = useState(60 * 60);
const [activeTab, setActiveTab] = useState(0);
const [highlightCount, setHighlightCount] = useState(0);
const [userAnswers, setUserAnswers] = useState<string[]>([]);
const passageRef = useRef<HTMLDivElement>(null);
const questionsRef = useRef<HTMLDivElement>(null);
```

### Required Data
```tsx
const correctAnswers: Record<number, string> = {
  1: 'Answer1', 2: 'Answer2', /* ... up to 40 */
};
```

### Required Functions
Copy these functions exactly from `app/test/18.1/reading/page.tsx`:
- `collectUserAnswers()` — reads all input values from the DOM via `questionsRef`
- `isAnswerCorrect(userAns, correctAns)` — case-insensitive comparison, handles "X or Y", "X/ Y", "X, Y" alternatives, and parenthetical optional words like "(food) consumption"
- `updateHighlightCount()` — counts `mark.user-highlight` elements in passage
- `handleHighlight()` — wraps selected text in `<mark>` tags, click-to-remove
- `clearAllHighlights()` — removes all highlights from passages

## 3. Tab Rendering — CSS Display Toggle (CRITICAL)
**DO NOT** use conditional rendering (`{activeTab === 0 && <div ... />}`) for tab content. This unmounts the DOM and **destroys all user-typed answers** when switching tabs.

**INSTEAD**, use CSS display toggling to keep all tabs mounted:
```tsx
{/* ✅ CORRECT — preserves input state */}
<div style={{ display: activeTab === 0 ? 'block' : 'none' }}
  dangerouslySetInnerHTML={{ __html: questions1HTML }}
/>

{/* ❌ WRONG — destroys input values on tab switch */}
{activeTab === 0 && <div dangerouslySetInnerHTML={{ __html: questions1HTML }} />}
```

Apply this to **all 6 tab divs** (3 question tabs + 3 passage tabs).

## 4. Header — Highlight Controls + Timer
The header must include:
1. A **"Clear All (N)"** button (visible only when `highlightCount > 0`)
2. A **"Select text to highlight"** hint with `Highlighter` icon
3. The **countdown timer** with `Clock` icon

See `app/test/18.1/reading/page.tsx` header section for exact implementation.

## 5. Passage Highlighting
The passage container (right side) must have:
```tsx
<div ref={passageRef} onMouseUp={handleHighlight}
  className="... selection:bg-amber-200/50">
```
This enables:
- Selecting text in passages wraps it in a yellow `<mark>` tag
- Clicking a highlight removes it
- "Clear All" button in the header removes all highlights at once

## 6. Questions Container Ref
The questions container (left side) must have:
```tsx
<div ref={questionsRef} className="...">
```
This is used by `collectUserAnswers()` to read all input values when "Show Answers" is clicked.

## 7. Parsing the HTML
The provided HTML usually interleaves Passages and Questions (e.g., Passage 1 -> Questions 1-13 -> Passage 2...). 
You must separate them:
- **Passages:** Extract the text that forms the reading content. Split the passages logically (e.g., by "Reading Passage 1", "Reading Passage 2") and render them into the 3 Tabs on the Right Side.
- **Questions:** Extract the questions and split them up logically to correspond with their respective passage. Render them in the Left Side container conditionally based on the active tab.
- **Answers:** Extract the answer key and populate the `correctAnswers` object (1-40).

## 8. Input Boxes for User Answers
You CANNOT erase any part of the questions text.
In IELTS Reading, there are various types of questions. You must inject an input box for *every* numbered question, following these rules:

**A. Fill in the Blanks**
Whenever you see a blank space intended for user input, such as `(1) …………………` or `(1) _______`, replace the dotted/underscore line with an HTML input element:
```html
<input type="text" class="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />
```
Keep the numbering (e.g., "(1)") intact next to the input box.

**B. Standard Numbered Questions (Multiple Choice, True/False, Matching)**
For questions that start with a number but have no blanks (e.g., `14. a mention of...` or `36. What is...`), you must inject the input box immediately after the number.
Example: `14. [INPUT] a mention of...`

**C. Block Questions without Inline Numbers**
Sometimes a block of questions says "Questions 23 and 24. Choose TWO letters..." but the options (A, B, C, D, E) do not contain the numbers 23 or 24. For these, you must manually append the input boxes after the options list.
Example: 
```html
<p>23. [INPUT] <br> 24. [INPUT]</p>
```

## 9. "Show Answers" — Your Answers Comparison Table
The "Show Answers" button must:
1. **Collect user answers** from all 40 input fields via `collectUserAnswers()` when clicked
2. Display a **"Your Answers" comparison table** with columns: `#`, `Your Answer`, `Correct Answer`, `✓/✗`
3. Show a **score summary**: `✓ X/40 Correct` | `✗ Y Wrong` | `— Z Unanswered`
4. Below it, show the plain **"Answer Key"** list for reference

```tsx
onClick={() => {
  if (!showAnswers) collectUserAnswers();
  setShowAnswers(!showAnswers);
}}
```

See `app/test/18.1/reading/page.tsx` for the full comparison table JSX (search for `"Your Answers"`).

## 10. Update the Dashboard
After adding the new test page, update `app/page.tsx` to include a simple HTML link to the new test.

## Quick Checklist
Before marking a test page as done, verify:
- [ ] Imports include `useRef`, `useCallback`, `Highlighter`, `Trash2`
- [ ] All 6 tab divs use `style={{ display: ... }}` NOT conditional `&&` rendering
- [ ] `questionsRef` is attached to the questions container div
- [ ] `passageRef` + `onMouseUp={handleHighlight}` is on the passage container div
- [ ] `correctAnswers` object has all 40 answers
- [ ] "Show Answers" calls `collectUserAnswers()` before revealing
- [ ] Comparison table + score summary is present
- [ ] Highlight controls (Clear All + hint) are in the header
- [ ] `app/page.tsx` has a link to the new test
