"use client"
import { contentPromptsStarter } from '@/lib/content/contentScripts'
import { keyword } from '@/types'
import React, { useRef, useState } from 'react'
import ShowMore from '../showMore/ShowMore'
import { calculateTokens } from '@/usefulFunctions/tokenCalculator'
import { getGptVideoScript } from '@/serverFunctions/handleGPT'
import { toast } from 'react-hot-toast'

// const lastScript = `### **Video Script (30 Seconds)**

// **[Opening Scene: Energetic background music, bright friendly graphics, and host smiling at the camera]**

// **Host:** "Hey, crypto enthusiasts and AI adventurers! 🌐 Today, we're merging the future of finance with the power of artificial intelligence! But what does AI have to do with Bitcoin? Let's dive in!"

// **[Cut to Before-and-After Demo: Split-screen view, on the left, a stressed-out creator manually analyzing Bitcoin price trends on multiple charts. On the right, relaxed creator using AI software.]**

// **Host:** "Imagine analyzing Bitcoin trends by yourself versus having an AI assistance! Without AI, you're over here [points left], drowning in data. With AI [points right], you get instant insights! Boom, more time for your next big idea! 🚀"

// **[Quick cut to smiling host with engaging Q&A]**

// **Host:** "Question for you: What’s the biggest challenge you face with Bitcoin investments? Drop your thoughts in the comments below—let’s get the conversation rolling! 💬"

// **[Cut to AI Tool Review: Host holding a smartphone with an AI app open]**

// **Host:** "Quick shout-out to 'CryptoGenius,' an AI tool that simplifies Bitcoin trend analysis. It’s fast, efficient, and—guess what—it’s actually easy to use! We love a user-friendly sidekick, right? 😎"

// **[Closing Scene: Host waving, cheerful music playing]**

// **Host:** "Stay tuned for more AI tips and tricks. Smash that like button, and don't forget to subscribe! Let's master the future together!"

// **[End Screen: Subscribe and follow icons with cheerful outro music]**

// ---

// ### **Quick Tips: Before-and-After Demonstrations**

// **Before:** 
// Host manually flipping through charts, looking frustrated with countless tabs, and haphazardly jotting down notes.

// **After:** 
// Host using an AI-powered app to get streamlined data visuals and trend predictions in seconds, looking relaxed with more time on their hands.

// ### **Q&A Sessions:**

// "What's the most time-consuming part of your cryptocurrency journey? Is it keeping up with market trends, or something else? Share your thoughts, and let’s find an AI solution together!"

// ### **AI Tool Reviews:**

// "Have you tried 'CryptoGenius' yet? This AI marvel turns complex Bitcoin data into actionable insights at the tap of a button. It's intuitive, lightning-fast, and perfect for both newbies and pros. We'll be posting a full review soon, so stay tuned!"

// ---

// And there you have it—friendly, practical, and engaging content that makes the world of Bitcoin and AI accessible and enjoyable for everyone. 🎥✨`

export default function ScriptContent({ trendingKeywords, ...elProps }: { trendingKeywords: keyword[] } & React.HTMLAttributes<HTMLDivElement>) {
    const [fullPrompt, fullPromptSet] = useState(contentPromptsStarter["script"])
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const [scriptLoading, scriptLoadingSet] = useState(false)
    // const [script, scriptSet] = useState(lastScript)
    const [script, scriptSet] = useState("")
    //update full prompt trendingkeywords



    return (
        <div {...elProps} style={{ padding: "1rem", ...elProps?.style }}>
            <ShowMore label='Edit Prompt'
                content={
                    <textarea ref={textAreaRef} value={fullPrompt} placeholder='enter prompt to create script' style={{ width: "100%", backgroundColor: "var(--color2)" }}
                        onChange={(e) => {
                            if (textAreaRef.current === null) return

                            textAreaRef.current.style.height = 'auto';
                            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';

                            fullPromptSet(e.target.value)
                        }}
                    />
                }
            />

            <button className='button' style={{ justifySelf: "center" }}
                onClick={async () => {
                    try {
                        const finalPrompt = fullPrompt.replace("{{topicsToReplace}}", trendingKeywords.map(eachKeyword => eachKeyword.name).join(","))

                        console.log(`$finalPrompt`, finalPrompt);
                        console.log(`$calculateTokens`, calculateTokens(finalPrompt));

                        scriptLoadingSet(true)
                        const scriptromGpt = await getGptVideoScript(finalPrompt)
                        scriptLoadingSet(false)
                        if (scriptromGpt === undefined) return

                        scriptSet(scriptromGpt)

                    } catch (error) {
                        toast.error("error getting script")
                        console.log(`$error`, error);
                    }
                }}
            >Generate Script</button>

            {scriptLoading && (
                <p>Loading</p>
            )}

            {script !== "" && (
                <div style={{ padding: "1rem", whiteSpace: "pre-wrap", display: "grid", border: "", marginTop: "1rem", backgroundColor: "var(--color2)" }}>
                    <button className='settingsButton' style={{ justifySelf: "flex-end" }}
                        onClick={() => {
                            navigator.clipboard.writeText(script);
                            toast.success("copied")
                        }}
                    >copy</button>

                    {script}
                </div>
            )}
        </div>
    )
}
