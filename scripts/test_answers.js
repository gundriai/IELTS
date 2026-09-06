const fs = require('fs');
const rawHtmlPath = '/Users/sudhirbhandari/.gemini/antigravity-ide/brain/00bba1d1-13d2-4d6d-a7d5-20bd1fe345db/scratch/test230.html';
const rawHtml = fs.readFileSync(rawHtmlPath, 'utf8');

let mainContentStart = rawHtml.indexOf('<h1 class="page-title entry-title">IELTS  Reading Test 230</h1>');
let mainContentEnd = rawHtml.indexOf('<div class="addtoany_share_save_container');
let mainContent = rawHtml.substring(mainContentStart, mainContentEnd);

const answersStart = "value='Show Answers'>";
const i_answers = mainContent.indexOf(answersStart);
const answersHtml = mainContent.substring(i_answers);

const ansMatch = answersHtml.match(/<div id="bg-showmore-hidden-[^>]+><p><\/p>(.*?)<p><\/p><\/div>/s);
let rawAnswers = '';
if (ansMatch) {
    rawAnswers = ansMatch[1];
} else {
    // fallback
    let divStart = answersHtml.indexOf('<div id="bg-showmore-hidden');
    let divEnd = answersHtml.indexOf('</div>', divStart) + 6;
    rawAnswers = answersHtml.substring(divStart, divEnd);
}
rawAnswers = rawAnswers.replace(/<div id="bg-showmore-hidden[^>]+>/, '').replace(/<\/div>$/, '');
console.log(rawAnswers.substring(0, 200));

