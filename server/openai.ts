// Based on blueprint:javascript_openai integration
// @ts-nocheck
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateQuiz(subject: string, topic: string, content: string, numQuestions: number) {
  const prompt = `Based on the following content about ${subject} - ${topic}, generate ${numQuestions} multiple choice questions.
  
Content:
${content}

Return a JSON object with this exact structure:
{
  "questions": [
    {
      "question": "string",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "explanation": "string"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an expert educator creating high-quality quiz questions. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function generateFlashcards(subject: string, topic: string, content: string) {
  const prompt = `Based on the following content about ${subject} - ${topic}, generate 10 flashcards for studying.

Content:
${content}

Return a JSON object with this exact structure:
{
  "flashcards": [
    {
      "front": "question or term",
      "back": "answer or definition"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an expert educator creating effective flashcards. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function generateSummary(content: string): Promise<string> {
  const prompt = `Please create a comprehensive summary of the following content, highlighting key concepts and important points:\n\n${content}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content || "";
}

export async function generateStudyPlan(subject: string, topics: string[], daysAvailable: number, hoursPerDay: number) {
  const prompt = `Create a ${daysAvailable}-day study plan for ${subject} covering the following topics: ${topics.join(', ')}.
  
The student has ${hoursPerDay} hours available per day.

Return a JSON object with this exact structure:
{
  "plan": {
    "title": "string",
    "description": "string",
    "dailyTasks": [
      {
        "day": 1,
        "topic": "string",
        "duration": 60,
        "activities": ["activity1", "activity2"],
        "priority": "high|medium|low"
      }
    ]
  }
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an expert study planner creating personalized learning schedules. Always respond with valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}

export async function chatWithTutor(messages: { role: string; content: string }[], subject?: string) {
  const systemMessage = subject
    ? `You are an expert tutor specializing in ${subject}. Provide clear, step-by-step explanations. Break down complex concepts into simple terms. Use examples to illustrate points.`
    : "You are a helpful AI tutor. Provide clear, educational responses to student questions. Use examples and break down complex topics.";

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      ...messages,
    ],
    max_completion_tokens: 2048,
  });

  return response.choices[0].message.content || "";
}

export async function extractTextFromImage(base64Image: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract and transcribe all text from this image. If it contains educational content, notes, or diagrams, describe them in detail.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    max_completion_tokens: 2048,
  });

  return response.choices[0].message.content || "";
}
