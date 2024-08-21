"use client"
import { contentPromptsStarter } from '@/lib/content/contentScripts'
import React, { useState, useRef } from 'react'
import ShowMore from '../showMore/ShowMore'
import { toast } from 'react-hot-toast'
import { getPerplexityEbook } from '@/serverFunctions/handlePerplexity'

//custom prompt from gpt to get back title, each page text
//display the story in editor
//editor has title, and each page listed in text form
//see how gpt returns images - parse them and display them
//confirmation to start conversion - each page content is converted into p elements, and each image is converted into img elements with absolute url
//sent to epub library to convert 
//each page content and edits are saved to a database for safe keeping
//epub can be downloaded

export default function EBookContent({ ...elProps }: {} & React.HTMLAttributes<HTMLDivElement>) {
    const [fullPrompt, fullPromptSet] = useState(contentPromptsStarter["ebook"])
    const [topic, topicSet] = useState("")
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const [scriptLoading, scriptLoadingSet] = useState(false)
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

            <input type='text' value={topic} onChange={(e) => { topicSet(e.target.value) }} placeholder="What's this ebook about?" />

            <button className='button' style={{ justifySelf: "center" }}
                onClick={async () => {
                    try {
                        if (topic === "") return
                        const finalPrompt = fullPrompt.replace("{{topic}}", topic)

                        console.log(`$finalPrompt`, finalPrompt);

                        scriptLoadingSet(true)
                        const scriptromGpt = await getPerplexityEbook(finalPrompt)
                        scriptLoadingSet(false)

                        scriptSet(scriptromGpt)

                    } catch (error) {
                        toast.error("error getting script")
                        console.log(`$error`, error);
                    }
                }}
            >Generate Ebook</button>

            {scriptLoading && (
                <p>Loading</p>
            )}

            {script !== "" && (
                <div style={{}}>
                    {script}
                </div>
            )}
        </div>
    )
}
