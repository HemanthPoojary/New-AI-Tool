import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { input, length, language } = body;

    if (!input || !length || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add error handling for OpenAI API calls
    let completion;
    let image;

    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a comedy writer. Generate a ${length} punchline in ${language} based on the given input.`
          },
          {
            role: "user",
            content: input
          }
        ]
      });

      image = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a funny comic style illustration for this joke: ${completion.choices[0].message.content}`,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });
    } catch (apiError) {
      console.error('OpenAI API Error:', apiError);
      return NextResponse.json(
        { error: 'Failed to generate content from OpenAI' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      punchline: completion.choices[0].message.content,
      imageUrl: image.data[0].url
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 