import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    
    const $ = cheerio.load(data);
    
    // Scraper heuristics for IELTS practice sites like practicepteonline.com
    const title = $('h1').first().text().trim() || 'Scraped IELTS Test';
    const passages: any[] = [];
    const questions: any[] = [];
    const testId = `test-${Date.now()}`;

    // A very rough heuristic: extract all <p> and look for "READING PASSAGE". 
    // This is a naive implementation since real DOM structure varies wildly.
    // We will dump the main content into one passage for simplicity if we can't split it.
    
    // For practicepteonline, the content is usually in `.entry-content`
    const content = $('.entry-content');
    
    if (content.length > 0) {
      passages.push({
        id: `p1`,
        title: 'Passage 1',
        content: content.html() || '<p>No content found</p>'
      });
      
      // Try to extract some questions if there are form inputs or numbered lists.
      // As a fallback, we'll provide some dummy questions so the UI works.
      questions.push({
        id: `q1`,
        passageId: `p1`,
        type: 'multiple-choice',
        text: 'Did the scraper successfully load the content? (This is an auto-generated question)',
        options: ['Yes', 'No'],
        answer: 'Yes'
      });
    } else {
      // Fallback if we can't find `.entry-content`
      passages.push({
        id: `p1`,
        title: 'Extracted Content',
        content: $('body').html() || '<p>Failed to scrape content</p>'
      });
    }

    const newTest = {
      id: testId,
      title,
      sourceUrl: url,
      passages,
      questions,
    };

    // Save to tests.json
    const filePath = path.join(process.cwd(), 'data', 'tests.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const tests = JSON.parse(fileContent);
    
    // Prevent duplicate URLs (optional, but good for UX)
    const existingIndex = tests.findIndex((t: any) => t.sourceUrl === url);
    if (existingIndex > -1) {
      tests[existingIndex] = newTest;
    } else {
      tests.push(newTest);
    }
    
    await fs.writeFile(filePath, JSON.stringify(tests, null, 2));

    return NextResponse.json({ success: true, test: newTest });
  } catch (error: any) {
    console.error('Scraping error:', error.message);
    return NextResponse.json({ error: 'Failed to scrape the URL' }, { status: 500 });
  }
}
