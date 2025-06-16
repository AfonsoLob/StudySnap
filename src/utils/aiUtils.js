import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdfjs/pdf.worker.min.mjs`;

// PDF text extraction helper
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text;
}

// File reading helper
async function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    
    if (file.type === 'application/pdf') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}

// AI flashcard generation handler
export async function generateFlashcards(input, apiKey, selectedCategory) {
  if (!apiKey) {
    throw new Error('No API key set. Please add your API key in settings.');
  }

  let inputText = '';
  
  if (input instanceof File) {
    // Read file content
    try {
      inputText = await readFileContent(input);
      if (input.type === 'application/pdf') {
        // For PDFs, we need to extract text
        const pdf = await pdfjsLib.getDocument({ data: inputText }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ') + '\n';
        }
        inputText = text;
      }
    } catch (error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
  } else if (typeof input === 'string') {
    inputText = input;
  } else {
    throw new Error('Invalid input type');
  }

  if (!inputText.trim()) {
    throw new Error('No content provided.');
  }

  // Prompt for AI
  const prompt = `Generate flashcards from the following text. Format each as:\nQ: <question>\nA: <answer>\n---\n${inputText}`;
  
  // Use AIMLAPI endpoint
  const AI_API_URL = 'https://api.aimlapi.com/v1/chat/completions';
  const response = await fetch(AI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that creates flashcards.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    let errorMsg = 'AI API error';
    try {
      const errorData = await response.json();
      if (errorData.error && errorData.error.message) {
        errorMsg += ': ' + errorData.error.message;
      } else {
        errorMsg += ` (${response.status} ${response.statusText})`;
      }
    } catch {
      errorMsg += ` (${response.status} ${response.statusText})`;
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const aiOutput = data.choices[0].message.content;
  console.log(aiOutput);
  
  // Parse flashcards from AI output
  const cards = [];
  const regex = /Q:\s*(.*?)\nA:\s*(.*?)\n---/gs;
  let match;
  while ((match = regex.exec(aiOutput)) !== null) {
    cards.push({ front: match[1].trim(), back: match[2].trim(), category: selectedCategory });
  }

  if (cards.length === 0) {
    throw new Error('No flashcards found in AI response.');
  }

  return cards;
} 