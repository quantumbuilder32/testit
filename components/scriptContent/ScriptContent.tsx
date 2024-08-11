"use client"
import { contentPromptsStarter } from '@/lib/content/contentScripts'
import { keyword } from '@/types'
import React, { useRef, useState } from 'react'
import ShowMore from '../showMore/ShowMore'
import { calculateTokens } from '@/usefulFunctions/tokenCalculator'
import { getGptVideoScript } from '@/serverFunctions/handleGPT'
import { toast } from 'react-hot-toast'


// const lastScript = `**Video Script: Taylor Swift Meets AI Advancements**
// **Attention-Grabbing Introduction:**

// [Opening Visual: A split screen with Taylor Swift performing on one side and futuristic AI visuals on the other.]

// Narrator (Engaging tone): "What do Taylor Swift and the latest AI advancements have in common? You'd be surprised how one musician is singing to the beat of our tech-driven future!"

// [Text Overlay:  "Stunning Connection Between Music and Technology ➟"]

// **Engaging Main Content:**

// [Cut to scenes of Taylor Swift at a concert.]

// Narrator: "Taylor Swift, a cultural icon, recently wowed fans with groundbreaking concerts. But there's more behind the scenes. Did you know AI is revolutionizing the way artists like Taylor create, promote, and perform music?"

// [Visuals: Footage of AI-driven music platforms, virtual concerts, and fans engaging online.]

// Narrator: "AI algorithms are now fine-tuning everything from setlists to stage designs, creating immersive experiences that keep fans on the edge of their seats. Even Swift's latest album benefited from AI, helping to identify trends and predict hit songs!"

// [Cut to developers working on AI projects.]

// Narrator: "On the flip side, advancements in AI are reshaping our world. From healthcare to entertainment, brands are using machine learning to create more personalized and impactful experiences."

// [Text Overlay: "AI Impacting Every Sector ➟"]

// **Call to Action and Viewer Engagement:**

// [Scene transitions to Taylor Swift fans interacting on social media.]

// Narrator: "But what does this mean for us? Will AI create the next music superstar, or will it amplify the talents of legends like Taylor Swift?"

// [Text on screen: "Join the Conversation!"]

// Narrator: "Comment below – Do you see AI as a new partner in creativity, or is it changing the entertainment landscape too much? Let's discuss!"

// **Visual and Audio Cues:**

// - **Visuals:** Blend concert clips with shots of AI tech, developers at work, and fan reactions.
// - **Graphics:** Modern, sleek transitions with a vibrant color palette mimicking Taylor Swift's album art.
// - **Sounds:** Background music inspired by Taylor Swift's latest hits, synchronizing key points with upbeat tempos.

// **Voiceover Instructions:**

// - **Tone:** Enthusiastic yet thought-provoking, mirroring the intrigue and excitement of both Swift’s impact and AI’s advancements.
// - **Pace:** Dynamic and engaging, keeping the narrative brisk but clear, ensuring viewers stay captivated from start to finish.

// **Final Scene:**

// [Call to Action: Bright, inviting text encouraging viewers.]

// Narrator: "Like, comment, and share this video if you believe in the power of blending creativity with technology. Stay tuned for more surprises at the intersection of music and innovation!"

// [End Screen: Subscribe, like, follow prompts with icons of a bell, thumbs up, and heart.]

// **Voiceover:** "Till next time, keep grooving to the rhythm of tomorrow's tech!"

// ---

// This script is designed to captivate viewers by highlighting the unexpected connections between Taylor Swift and AI advancements. It calls for visually engaging graphics and a lively voiceover to draw viewers into the narrative, encouraging them to engage and share their thoughts on the intriguing intersection of these topics.`

export default function ScriptContent({ trendingKeywords, ...elProps }: { trendingKeywords: keyword[] } & React.HTMLAttributes<HTMLDivElement>) {
    const [fullPrompt, fullPromptSet] = useState(contentPromptsStarter["script"])
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const [scriptLoading, scriptLoadingSet] = useState(false)

    // const [script, scriptSet] = useState(lastScript)
    const [script, scriptSet] = useState("")

    return (
        <div {...elProps} style={{ padding: "1rem", ...elProps?.style }}>
            <ShowMore label='Edit Prompt'
                content={
                    <textarea ref={textAreaRef} value={fullPrompt} placeholder='enter prompt to create script' style={{ width: "100%", backgroundColor: "var(--color1)" }}
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
                        let combinedTopicString = ""

                        trendingKeywords.forEach(eachKeyword => {
                            combinedTopicString += `topic: ${eachKeyword.topic} \n summary: ${eachKeyword.summary}\n\n`
                        })

                        const finalPrompt = fullPrompt.replace("{{topicsToReplace}}", combinedTopicString)

                        console.log(`$finalPrompt`, finalPrompt);
                        console.log(`$calculateTokens`, calculateTokens(finalPrompt));

                        scriptLoadingSet(true)
                        const scriptromGpt = await getGptVideoScript(finalPrompt)
                        scriptLoadingSet(false)

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
                <div style={{ padding: "1rem", whiteSpace: "pre-wrap", display: "grid", border: "", marginTop: "1rem", backgroundColor: "var(--color1)" }}>
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
