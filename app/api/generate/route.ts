import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  // Initialize OpenAI only when the API is called
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ''
  });

  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is missing');
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { input, length, language } = body;

    if (!input || !length || !language) {
      console.error('Missing required fields:', { input, length, language });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let completion;
    let image;

    try {
      console.log('Generating completion...');
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

      console.log('Generating image...');
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

    console.log('Successfully generated content');
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

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}