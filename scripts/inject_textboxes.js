const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/test/230/reading/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const inputBoxHTML = '<input type="text" className="inline-flex w-32 px-3 py-1.5 mx-2 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 text-center font-bold transition-all hover:bg-blue-100" />';

// Function to find numbers followed by dot (e.g. "14. ") inside HTML paragraphs/breaks
content = content.replace(/(<(?:br|p)[^>]*>)\s*(\d{1,2})\.\s+([A-Za-z])/g, `$1$2. ${inputBoxHTML} $3`);

// Also look for block instructions like "Questions 23 and 24" that don't have explicit line numbers in the answers.
// We'll insert these input boxes at the end of the multiple choice options list.
// E.g. after "<br><strong>E</strong> They are made of less durable materials.</p>" we append the text boxes.
content = content.replace(/(<strong>E<\/strong> They are made of less durable materials\.<\/p>)/, `$1<p style="text-align: justify;">23. ${inputBoxHTML} <br/> 24. ${inputBoxHTML}</p>`);
content = content.replace(/(<strong>E<\/strong> providing a suitable site for the installation of renewable power generators<\/p>)/, `$1<p style="text-align: justify;">25. ${inputBoxHTML} <br/> 26. ${inputBoxHTML}</p>`);


fs.writeFileSync(filePath, content, 'utf8');
console.log("Input boxes injected successfully.");
