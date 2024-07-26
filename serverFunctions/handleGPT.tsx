"use server"
import OpenAI from "openai"
import { keyword } from "@/types";

const apiKey = process.env.OPENAI_API_KEY || ""

// const openai = new OpenAI({
//     apiKey: apiKey
// })

const getTopTrendsPrompt =
    `
you are an award winning trend specialist system. Please search the web - social media, articles rss feeds, google trends and anything you think is best to get top trendy keywords for today that people would want to talk about. 2 total.

please give me back the data as a string separated by commas

e.g ai, tech

really important the data I receive is like the example. Don't give any other conversational response, or explanation, or error messages, if you can't search live just make up whatever you think would be trendy today, just need back the string with topics separated by comma
`

export async function getTopKeywords(): Promise<keyword[]> {
    return [{ name: "" }]
    // const response = await openai.chat.completions.create({
    //     model: "gpt-4o",
    //     messages: [
    //         {
    //             role: "user",
    //             content: getTopTrendsPrompt
    //         }
    //     ],
    //     temperature: .7,
    //     max_tokens: 2000
    // })

    // let textResponse = response.choices[0].message.content
    // if (textResponse === null) throw new Error("no text response from gpt")

    // if (textResponse.includes("sorry")) throw new Error("gpt didnt give proper response")

    // const keywords: keyword[] = textResponse.split(",").map(eachString => {
    //     const keyWord: keyword = {
    //         name: eachString
    //     }
    //     return keyWord
    // })

    // return keywords
}

export async function getAPIKey() {
    return apiKey
}

export async function getGptVideoScript(prompt: string): Promise<string | undefined> {
    return ""
    // const response = await openai.chat.completions.create({
    //     model: "gpt-4o",
    //     messages: [
    //         {
    //             role: "user",
    //             content: prompt
    //         }
    //     ],
    //     temperature: 1,
    //     //1750 tokens, 7000 characters per average script - 1 token = 4 characters
    // })

    // const textResponse = response.choices[0].message.content
    // if (textResponse === null) return

    // return textResponse
}