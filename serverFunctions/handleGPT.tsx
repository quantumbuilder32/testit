"use server"
import OpenAI from "openai"
import { keyword } from "@/types";

const apiKey = process.env.OPENAI_API_KEY || ""

const openai = new OpenAI({
    apiKey: apiKey
})

const nicePropmpt = `Using the provided topics {{topicsToReplace}}, search for the latest and most relevant content across top sites like YouTube, LinkedIn, Reddit, X.com, and other significant platforms. Conduct a deep dive to identify trending discussions, key points, and popular opinions under each topic. Based on this information, craft a concise video script optimized for virality. The script should include:

Attention-Grabbing Introduction: Start with a hook that captures viewers' attention immediately. This could include shocking statistics, surprising facts, or intriguing questions.
Engaging Main Content: Highlight key points and insights from the trending discussions. Use storytelling techniques, emotional appeal, and relatable examples to engage the audience.
Clear Call to Action: End with a compelling call to action that encourages viewers to like, comment, share, or subscribe.
Visual and Audio Cues: Provide detailed suggestions for images, footage, graphics, and sound elements that enhance the message and retain viewer engagement.
Voiceover Instructions: Specify tone, pace, and style to match the content's mood and target audience (e.g., energetic, authoritative, friendly).
The script should be concise and crafted to hold viewers' attention, ensuring all content is clear and impactful. It should be formatted and detailed enough for direct input into InVideo, including specific visual and audio instructions. The goal is to create a video with a high potential for virality, leveraging current trends, emotional engagement, and effective storytelling.`

const getTopTrendsPrompt =
    `
you are an award winning trend specialist system. Please search the web - social media, articles rss feeds, google trends and anything you think is best to get top trendy keywords for today that people would want to talk about. 2 total.

please give me back the data as a string separated by commas

e.g ai, tech

really important the data I receive is like the example. Don't give any other conversational response, or explanation, or error messages, if you can't search live just make up whatever you think would be trendy today, just need back the string with topics separated by comma
`

export async function getTopKeywords(): Promise<keyword[]> {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: getTopTrendsPrompt
            }
        ],
        temperature: .7,
        max_tokens: 2000
    })

    let textResponse = response.choices[0].message.content
    if (textResponse === null) throw new Error("no text response from gpt")

    if (textResponse.includes("sorry")) throw new Error("gpt didnt give proper response")

    const keywords: keyword[] = textResponse.split(",").map(eachString => {
        const keyWord: keyword = {
            name: eachString
        }
        return keyWord
    })

    return keywords
}
//
export async function getGptVideoScript(prompt: string): Promise<string | undefined> {
    const response = await openai.chat.completions.create({
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
    if (textResponse === null) return

    return textResponse
}