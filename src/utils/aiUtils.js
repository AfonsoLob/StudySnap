import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { GoogleGenAI } from "@google/genai"

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

  // Google GEN AI
  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: inputText,
        config: {
          systemInstruction: `
          You are a helpful assistant that creates flashcards.
          Generate flashcards from the text provided below.
        
          STRICT FORMATTING RULES:
          1. Use exactly the format:
            Q: <question>
            A: <answer>
            ---
          2. Do not add bolding, markdown, or numbering.
          3. Separate every card with "---".
        `,
        },
      });
      return response.text;
    }

    const aiOutput = await main();
    console.log(aiOutput);

    // Parse flashcards
    const cards = [];
    // Updated regex to be slightly more robust to extra newlines
    const regex = /Q:\s*([\s\S]*?)\nA:\s*([\s\S]*?)\n---/g;
    
    let match;
    while ((match = regex.exec(aiOutput)) !== null) {
      cards.push({ 
        front: match[1].trim(), 
        back: match[2].trim(), 
        category: selectedCategory 
      });
    }

    if (cards.length === 0) {
      console.warn("Regex match failed. Dumping output for debugging:", aiOutput);
      throw new Error('No flashcards found in AI response. The text might be too short or the format was not followed.');
    }

    return cards;

  } catch (error) {
      console.error("Gemini API Error:", error);
      // Error message for UI
      throw new Error(`AI Generation failed: ${error.message}`);
    }
}
