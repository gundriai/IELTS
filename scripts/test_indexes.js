const fs = require('fs');
const rawHtmlPath = '/Users/sudhirbhandari/.gemini/antigravity-ide/brain/00bba1d1-13d2-4d6d-a7d5-20bd1fe345db/scratch/test230.html';
const rawHtml = fs.readFileSync(rawHtmlPath, 'utf8');

let mainContentStart = rawHtml.indexOf('<h1 class="page-title entry-title">IELTS  Reading Test 230</h1>');
let mainContentEnd = rawHtml.indexOf('<div class="addtoany_share_save_container');
let mainContent = rawHtml.substring(mainContentStart, mainContentEnd);

console.log("mainContentStart:", mainContentStart);
console.log("mainContentEnd:", mainContentEnd);

const p1Title = '<p style="text-align: center;"><strong>The development of the London underground railway</strong></p>';
const p1Q = '<strong>Questions 1-6</strong><br />';
const p2Title = '<p style="text-align: center;"><strong>Stadiums: past, present and future</strong></p>';
const p2Q = '<strong>Questions 14-17</strong><br />';
const p3Title = '<p style="text-align: center;"><strong>To catch a king</strong></p>';
const p3Q = '<strong>Questions 27-31</strong><br />';
const answersStart = "value='Show Answers'>";

console.log("i_p1Title:", mainContent.indexOf(p1Title));
console.log("i_p1Q:", mainContent.lastIndexOf('<p', mainContent.indexOf(p1Q)));
console.log("i_p2Title:", mainContent.indexOf(p2Title));
console.log("i_p2Q:", mainContent.lastIndexOf('<p', mainContent.indexOf(p2Q)));
console.log("i_p3Title:", mainContent.indexOf(p3Title));
console.log("i_p3Q:", mainContent.lastIndexOf('<p', mainContent.indexOf(p3Q)));
console.log("i_answers:", mainContent.indexOf(answersStart));

