"use server"
import OpenAI from "openai"
import { keyword } from "@/types";

const perplexityApiKey = process.env.PERPLEXITY_API_KEY || ""

const openaiPerplexity = new OpenAI({
    apiKey: perplexityApiKey,
    baseURL: "https://api.perplexity.ai"
})

const getTopTrendsPrompt =
    `
you are an award winning trend specialist system. Please search the web - social media, articles rss feeds, google trends and anything you think is best to get the top 2 trendy topics from the last 24 hours that people are talking about.

For each of those top topics, please find the most trending story/article/piece under that category and summarize it in 500 words or less. Add the topic, summary, and reference links to a JSON array. Format the response strictly as a JSON array with the following structure:
    
[
    {
        "topic": "topic1",
        "summary": "summary of story found under topic1",
        "references": ["link1", "link2"]
    },
    {
        "topic": "topic2",  
        "summary": "summary of story found under topic2",
        "references": ["link1", "link2"]
    }
]
    
    Please return only the JSON string starting and ending with brackets [] like the example above, without any conversational response or error messages. it needs to be json only parsable response as I will be running JSON.parse() on your output, so only valid json please. 
`

const getTopTrendFromSpecificTopicPrompt = (specificTopic: string) => {
    return `
    you are an award winning trend specialist system. Please search the web - social media, articles rss feeds, google trends and anything you think is best for the top trending story/article/piece related to the topic "${specificTopic}" withing the last 24 hours.
    
    For this topic please summarize it in 500 words or less. Add the topic, summary, and reference links to a JSON array. Format the response strictly as a JSON array with the following structure:
    
    [
    {
        "topic": "topic1",
        "summary": "summary of story found under topic1",
        "references": ["link1", "link2"]
    }
    ]
    
    Please return only the JSON string starting and ending with brackets [] like the example above, without any conversational response or error messages. it needs to be json only parsable response as I will be running JSON.parse() on your output, so only valid json please. 
    `
}

export async function getTopKeywords(specificTopic?: string): Promise<keyword[]> {
    const response = await openaiPerplexity.chat.completions.create({
        model: "llama-3.1-sonar-large-128k-online",
        messages: [
            {
                role: "user",
                content: specificTopic ? getTopTrendFromSpecificTopicPrompt(specificTopic) : getTopTrendsPrompt
            }
        ],
    }
    )

    let textResponse = response.choices[0].message.content
    if (textResponse === null) throw new Error("no text response from gpt")

    const cleanedString = textResponse
        .replace(/\\n/g, '')        // Remove \n (newline characters)
        .replace(/```json/g, '')
        .replace(/```/g, '')

    console.log(`$cleanedString`, JSON.stringify(cleanedString, null, 2));
    const keywords: keyword[] = JSON.parse(cleanedString)

    return keywords
}

// export async function getTopKeywords(): Promise<keyword[]> {
//     const response = await openai.chat.completions.create({
//         model: "gpt-4o",
//         messages: [
//             {
//                 role: "user",
//                 content: getTopTrendsPrompt
//             }
//         ],
//         temperature: .7,
//         max_tokens: 2000
//     })

//     let textResponse = response.choices[0].message.content
//     if (textResponse === null) throw new Error("no text response from gpt")

//     if (textResponse.includes("sorry")) throw new Error("gpt didnt give proper response")

//     const keywords: keyword[] = textResponse.split(",").map(eachString => {
//         const keyWord: keyword = {
//             name: eachString
//         }
//         return keyWord
//     })

//     return keywords
// }