"use server"
import OpenAI from "openai"
import { keyword } from "@/types";

const apiKey = process.env.OPENAI_API_KEY || ""

const openaiGPT = new OpenAI({
    apiKey: apiKey
})


const nicePropmpt = `Using the provided topics {{topicsToReplace}}, search for the latest and most relevant content across top sites like YouTube, LinkedIn, Reddit, X.com, and other significant platforms. Conduct a deep dive to identify trending discussions, key points, and popular opinions under each topic. Based on this information, craft a concise video script optimized for virality. The script should include:

Attention-Grabbing Introduction: Start with a hook that captures viewers' attention immediately. This could include shocking statistics, surprising facts, or intriguing questions.
Engaging Main Content: Highlight key points and insights from the trending discussions. Use storytelling techniques, emotional appeal, and relatable examples to engage the audience.
Clear Call to Action: End with a compelling call to action that encourages viewers to like, comment, share, or subscribe.
Visual and Audio Cues: Provide detailed suggestions for images, footage, graphics, and sound elements that enhance the message and retain viewer engagement.
Voiceover Instructions: Specify tone, pace, and style to match the content's mood and target audience (e.g., energetic, authoritative, friendly).
The script should be concise and crafted to hold viewers' attention, ensuring all content is clear and impactful. It should be formatted and detailed enough for direct input into InVideo, including specific visual and audio instructions. The goal is to create a video with a high potential for virality, leveraging current trends, emotional engagement, and effective storytelling.`


export async function getGptVideoScript(prompt: string): Promise<string> {
    const response = await openaiGPT.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 1,
        //1750 tokens, 7000 characters per average script - 1 token = 4 characters
    })

    const textResponse = response.choices[0].message.content
    if (textResponse === null) throw new Error("no video script")

    return textResponse
}