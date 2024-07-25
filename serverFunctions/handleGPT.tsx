"use server"
import OpenAI from "openai"

import { keyword, keywordSchema } from "@/types";
require('dotenv').config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const getTopTrendsPrompt =
    `
you are an award winning trend specialist system. Please search the web - social media, articles rss feeds, google trends and anything you think is best to get top trendy keywords for today that people would want to talk about. 2 total.

please give me back the data in an JSON array

e.g 
[{"name":"ai"},{"name":"tech"}]


really important the data I receive is in an array like this. Don't give any other conversational response, or explanation, just the array
`


export async function getTopKeywords(): Promise<keyword[] | undefined> {
    try {
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

        const textResponse = response.choices[0].message.content
        if (textResponse === null) throw new Error("no text")

        const keywords: keyword[] = JSON.parse(textResponse)

        keywords.forEach(eachKeyWord => {
            keywordSchema.parse(eachKeyWord)
        })

        return keywords
    } catch (error) {
        console.log(`$error getTopKeywords`, error);
    }
}

