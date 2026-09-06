const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/test/230/reading/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The passages start at <h1 class="page-title entry-title">IELTS  Reading Test 230</h1>
const passagesStartStr = '<h1 class="page-title entry-title">IELTS  Reading Test 230</h1>';
const passage2StartStr = '<p style="text-align: center;"><strong>Stadiums: past, present and future</strong></p>';
const passage3StartStr = '<p style="text-align: center;"><strong>To catch a king</strong></p>';

// Find the dangerouslySetInnerHTML block for Passages
// It's in the second dangerouslySetInnerHTML
const parts = content.split('dangerouslySetInnerHTML={{ __html: `');
if (parts.length < 3) {
  console.log("Could not find Passages HTML");
  process.exit(1);
}

// parts[0] is everything before questions
// parts[1] is questions, followed by closing tags and the start of the Passages section
// parts[2] is passages

const passagesEndIndex = parts[2].indexOf('` }} />');
let passagesHTML = parts[2].substring(0, passagesEndIndex).trim();
const afterPassages = parts[2].substring(passagesEndIndex);

// Split passagesHTML into 3 parts
let p1 = passagesHTML.substring(0, passagesHTML.indexOf(passage2StartStr));
let p2 = passagesHTML.substring(passagesHTML.indexOf(passage2StartStr), passagesHTML.indexOf(passage3StartStr));
let p3 = passagesHTML.substring(passagesHTML.indexOf(passage3StartStr));

// We need to inject state for tabs in the component
let newContent = content;

if (!newContent.includes('const [activeTab, setActiveTab] = useState(0);')) {
  newContent = newContent.replace(
    'const [timeLeft, setTimeLeft] = useState(60 * 60);',
    'const [timeLeft, setTimeLeft] = useState(60 * 60);\n  const [activeTab, setActiveTab] = useState(0);'
  );
}

// Build the new UI for the right pane
const newRightPane = `
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
            {activeTab === 0 && <div dangerouslySetInnerHTML={{ __html: \`${p1.trim()}\` }} />}
            {activeTab === 1 && <div dangerouslySetInnerHTML={{ __html: \`${p2.trim()}\` }} />}
            {activeTab === 2 && <div dangerouslySetInnerHTML={{ __html: \`${p3.trim()}\` }} />}
          </div>
        </section>
      </main>
    </div>
  );
}
`;

// Replace the old right pane with the new right pane
const startRightPane = '{/* Right Pane: Passages */}';
const indexOfRightPane = newContent.indexOf(startRightPane);
newContent = newContent.substring(0, indexOfRightPane) + newRightPane;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated page.tsx with tabs');
