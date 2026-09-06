const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/test/230/reading/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the left pane questions dangerouslySetInnerHTML
const startMarker = '<div dangerouslySetInnerHTML={{ __html: `';
const endMarker = '` }} />';

let searchStartIndex = content.indexOf('Left Pane: Questions');
let htmlStartIndex = content.indexOf(startMarker, searchStartIndex) + startMarker.length;
let htmlEndIndex = content.indexOf(endMarker, htmlStartIndex);

let fullQuestionsHTML = content.substring(htmlStartIndex, htmlEndIndex);

// Define the split points
const split1 = '<p style="text-align: justify;"><strong>Questions 14-17</strong><br>';
const split2 = '<p style="text-align: justify;"><strong>Questions 27-31</strong><br>';

let p1End = fullQuestionsHTML.indexOf(split1);
let p2End = fullQuestionsHTML.indexOf(split2);

if (p1End === -1 || p2End === -1) {
    console.error("Could not find split points");
    process.exit(1);
}

let q1 = fullQuestionsHTML.substring(0, p1End).trim();
let q2 = fullQuestionsHTML.substring(p1End, p2End).trim();
let q3 = fullQuestionsHTML.substring(p2End).trim();

// Create the new React code for the questions based on activeTab
const newQuestionsCode = `
            {activeTab === 0 && <div dangerouslySetInnerHTML={{ __html: \`${q1}\` }} />}
            {activeTab === 1 && <div dangerouslySetInnerHTML={{ __html: \`${q2}\` }} />}
            {activeTab === 2 && <div dangerouslySetInnerHTML={{ __html: \`${q3}\` }} />}
`;

let newContent = content.substring(0, htmlStartIndex - startMarker.length) + newQuestionsCode.trim() + content.substring(htmlEndIndex + endMarker.length);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Questions split successfully!");
