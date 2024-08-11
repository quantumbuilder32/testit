"use client"
import React, { useState } from 'react'
import { keyword } from '@/types';
import styles from "./styles.module.css"
import { toast } from 'react-hot-toast';
import { shuffleArray } from '@/usefulFunctions/randomizeArray';
import { logAndToast } from '@/usefulFunctions/logAndToast';
import { getTopKeywords } from '@/serverFunctions/handlePerplexity';
import Link from 'next/link';

export default function HandleKeywords({ trendingKeywords, trendingKeywordsSet }: { trendingKeywords: keyword[], trendingKeywordsSet: React.Dispatch<React.SetStateAction<keyword[]>> }) {
    const [search, searchSet] = useState("")

    async function handleGetTopKeywords(specificTopic?: string) {
        try {
            //get top trends from chat gpt
            specificTopic ? toast.success("getting content on topic") : toast.success("getting trending topics")

            const topKeywords = await getTopKeywords(specificTopic)
            toast.success("retrieved")

            trendingKeywordsSet(prevKeywords => {
                const newKeywords = [...prevKeywords, ...topKeywords]

                return newKeywords
            })

        } catch (error) {
            logAndToast("error getting keywords", error)
        }
    }

    return (
        <div className={styles.main}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                <input type='text' value={search} style={{ flex: "1 1 150px" }} placeholder='Enter trending topics'
                    onChange={(e) => {
                        searchSet(e.target.value)
                    }}
                />

                <div style={{ flex: "0 1 150px", display: "flex", }}>
                    <button className='button' onClick={() => { handleGetTopKeywords() }}>Get Top Trends</button>

                    <button className='button'
                        onClick={async () => {
                            if (search === "") return

                            await handleGetTopKeywords(search)

                            searchSet("")
                        }}
                    >Add Keyword</button>
                </div>
            </div>

            {trendingKeywords.length > 0 && (
                <div className={`snap`} style={{ display: "flex", gap: ".5rem", alignItems: "flex-start", marginTop: "1rem", overflowX: "auto" }}>
                    {trendingKeywords.map((eachKeyWord, eachKeyWordIndex) => {
                        return (
                            <div className={`showOnHoverParent`} key={eachKeyWordIndex} style={{ flex: "0 0 auto", width: "min(350px, 100%)", backgroundColor: "var(--backgroundColor)", color: "#fff", display: "grid", gap: "1rem", maxHeight: "60vh", overflowY: "auto" }}>
                                <div style={{ display: "flex", justifyContent: "flex-end", backgroundColor: true ? "var(--color3)" : "var(--color3)", padding: "1rem", cursor: "pointer" }}>
                                    <span className={`showOnHoverChild`} style={{}}
                                        onClick={() => {
                                            trendingKeywordsSet(prevKeyWords => {
                                                let newKeywords = [...prevKeyWords]

                                                newKeywords = newKeywords.filter(eachNewKeyWord => eachNewKeyWord.topic !== eachKeyWord.topic)
                                                return newKeywords
                                            })
                                        }}
                                    >
                                        <svg style={{ width: "1.3rem", fill: "#fff" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                    </span>
                                </div>

                                <div style={{ display: "grid", gap: "1rem", padding: "1rem" }}>
                                    <h2>topic:</h2>
                                    <p>{eachKeyWord.topic}</p>

                                    <h2>summary:</h2>
                                    <p>{eachKeyWord.summary}</p>

                                    <h2>references:</h2>
                                    <div style={{ display: "flex", gap: ".5rem", overflowX: "auto" }}>
                                        {eachKeyWord.references.map((eachReference, eachReferenceIndex) => {
                                            return (
                                                <Link key={eachReferenceIndex} href={eachReference} target='blank_'>{eachReference}</Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
