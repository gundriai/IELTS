<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Instructions for Adding New IELTS Tests

When the user asks you to add a new IELTS test and provides the raw HTML, follow these instructions strictly:

## 1. Directory Structure
Create a new folder for the test ID provided by the user under `app/test/`. Inside it, create the specific category folder (e.g., `reading`, `listening`, `writing`), and inside that, `page.tsx`.
Example for Test 231 Reading: `app/test/231/reading/page.tsx`

## 2. Layout Structure
The page must be a static React component (`page.tsx`) with a split-screen layout:
- **Left Side (1/2 width):** All Questions and the "Show Answers" button/section.
- **Right Side (1/2 width):** All Reading Passages separated into 3 Tabs.

Use Tailwind CSS for styling to make it look premium. Add state for the timer and tabs, and use a layout like this:
```tsx
  const [showAnswers, setShowAnswers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [activeTab, setActiveTab] = useState(0);

  // ... timer useEffect logic ...

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <header className="flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-8 shadow-sm z-20">
        <div className="flex items-center">
           <Link href="/" className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm">
              <ArrowLeft className="h-5 w-5 text-slate-700" />
           </Link>
           <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">IELTS Reading Test [ID]</h1>
        </div>
        {/* Timer UI here */}
      </header>
      <main className="flex flex-1 overflow-hidden relative p-6 gap-6">
        <section className="w-1/2 relative z-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-y-auto scroll-smooth">
          <div className="p-10 prose prose-slate prose-headings:text-slate-800 prose-p:text-slate-700 prose-p:mb-6 max-w-none">
            {activeTab === 0 && <div dangerouslySetInnerHTML={{ __html: questions1HTML }} />}
            {activeTab === 1 && <div dangerouslySetInnerHTML={{ __html: questions2HTML }} />}
            {activeTab === 2 && <div dangerouslySetInnerHTML={{ __html: questions3HTML }} />}
            {/* Show answers button and answers block */}
          </div>
        </section>
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
            {activeTab === 0 && <div dangerouslySetInnerHTML={{ __html: passage1HTML }} />}
            {activeTab === 1 && <div dangerouslySetInnerHTML={{ __html: passage2HTML }} />}
            {activeTab === 2 && <div dangerouslySetInnerHTML={{ __html: passage3HTML }} />}
          </div>
        </section>
      </main>
    </div>
  );
```
Ensure both sides are scrollable independently. Use gradient buttons for the answers toggle.

## 3. Parsing the HTML
The provided HTML usually interleaves Passages and Questions (e.g., Passage 1 -> Questions 1-13 -> Passage 2...). 
You must separate them:
- **Passages:** Extract the text that forms the reading content. Split the passages logically (e.g., by "Reading Passage 1", "Reading Passage 2") and render them into the 3 Tabs on the Right Side.
- **Questions:** Extract the questions and split them up logically to correspond with their respective passage. Render them in the Left Side container conditionally based on the active tab.
- **Answers:** Extract the answers block at the bottom and place it inside a conditionally rendered or toggleable section on the Left Side.

## 4. Input Boxes for User Answers
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

## 5. Do Not Complicate the Logic
Do NOT build complex state management to grade the answers automatically unless requested. The user simply wants to be able to type their answers into the text boxes while reading the passage on the right. At the bottom of the questions side, provide a button to reveal the correct answers (which were provided in the HTML) so the user can self-grade.

## 6. Update the Dashboard
After adding the new test page, update `app/page.tsx` to include a simple HTML link to the new test.
