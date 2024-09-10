import { NextResponse } from "next/server";
import OpenAI from "openai"

const apiKey = process.env.OPENAI_API_KEY || ""

const openaiGPT = new OpenAI({
    apiKey: apiKey
})

export async function GET(request: Request) {
    const seenURL = new URL(request.url)
    const imageDescription = seenURL.searchParams.get("description")

    if (imageDescription === null) return NextResponse.json("no image description provided", { status: 400 })

    const finalPrompt = `
    Generate an image from this detailed description ${imageDescription}.`

    const response = await openaiGPT.images.generate({
        prompt: finalPrompt,
        n: 1, // Generate one image
        size: "1024x1024", // You can choose "256x256", "512x512", or "1024x1024"
        response_format: "url" // This ensures only the URL is returned
    });

    const imageUrl = response.data[0].url; // Extract the URL of the generated image

    return NextResponse.json(imageUrl)
}
