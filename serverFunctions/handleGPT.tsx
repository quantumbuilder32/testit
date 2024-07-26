"use server"
import OpenAI from "openai"

import { keyword, keywordSchema, system } from "@/types";
import { shuffleArray } from "@/usefulFunctions/randomizeArray";
require('dotenv').config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

console.log(`$ process.env.OPENAI_API_KEY`, process.env.OPENAI_API_KEY);

const getTopTrendsPrompt =
    `
you are an award winning trend specialist system. Please search the web - social media, articles rss feeds, google trends and anything you think is best to get top trendy keywords for today that people would want to talk about. 2 total.

please give me back the data as a string separated by commas

e.g ai, tech

really important the data I receive is like the example. Don't give any other conversational response, or explanation, or error messages, if you can't search live just make up whatever you think would be trendy today, just need back the string with topics separated by comma
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

        let textResponse = response.choices[0].message.content
        if (textResponse === null) return

        if (textResponse.includes("sorry")) {
            let optionsStrArr = ["AI", "cryptocurrency", "blockchain", "climate change", "remote work", "Web3", "metaverse", "NFTs", "machine learning", "cybersecurity", "5G", "quantum computing", "virtual reality", "augmented reality", "electric vehicles", "renewable energy", "biotech", "fintech", "data science", "cloud computing", "automation", "IoT", "big data", "e-commerce", "digital transformation", "smart cities", "healthtech", "edge computing", "robotics", "social media trends", "telemedicine", "green technology", "space exploration", "AI ethics", "genomics", "digital marketing", "sustainable fashion", "cyber threats", "AR/VR gaming", "self-driving cars", "smart home technology", "quantum internet", "3D printing", "personalized medicine", "biodegradable materials", "sustainable agriculture", "VR education", "carbon capture", "AI in healthcare"]
            optionsStrArr = shuffleArray(optionsStrArr)
            textResponse = `${optionsStrArr[0]}, ${optionsStrArr[1]}`
            console.log(`$used backup trends`);
        }

        const keywords: keyword[] = textResponse.split(",").map(eachString => {
            const keyWord: keyword = {
                name: eachString
            }
            return keyWord
        })

        return keywords
    } catch (error) {
        console.log(`$error getTopKeywords`, error);
    }
}

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