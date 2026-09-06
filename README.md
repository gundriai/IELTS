# IELTS Reading Pro

A full-stack React web application designed for taking and managing IELTS Reading tests. Features include a dynamic test library, a split-screen test interface mirroring the real computer-delivered IELTS UI, text highlighting capabilities, and automated grading.

## Features

- **Test Library Dashboard**: View available tests and track your history (scores and completion dates).
- **Split-Screen Interface**: Reading passages on the left, interactive questions on the right.
- **Text Highlighting**: Select text in the reading passage and click the "Highlight" button to mark important information in yellow, just like the real exam.
- **Auto-Grading**: Submit your test to see immediate results, highlighting correct and incorrect answers.
- **Local Storage History**: Your test scores and history are securely saved in your browser's local storage.
- **Built-in Web Scraper**: Includes a basic scraping API endpoint to fetch tests from external URLs (tailored for common IELTS practice sites).

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Database**: Local JSON file (`data/tests.json`)
- **Scraping**: Cheerio & Axios
- **Icons**: Lucide React

## How to Run Locally

Follow these steps to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js)

### 1. Clone the repository (if you haven't already)
```bash
git clone https://github.com/gundriai/IELTS.git
cd IELTS
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open the application
Open your web browser and navigate to:
[http://localhost:3000](http://localhost:3000)

## How to Add New Tests

The application reads tests from the `data/tests.json` file. 

You can add tests in two ways:
1. **Via the Dashboard**: Use the "Add a New Practice Test" input field on the home page to paste a URL from an IELTS practice website. The backend will attempt to scrape and parse it automatically.
2. **Manually**: Open `data/tests.json` and follow the existing JSON structure to add your own custom tests, passages, and questions.
