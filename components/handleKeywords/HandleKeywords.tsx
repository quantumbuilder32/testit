"use client"
import React, { useState } from 'react'
import { keyword, keywordSchema } from '@/types';
import styles from "./styles.module.css"
import { getTopKeywords } from '@/serverFunctions/handleGPT';


export default function HandleKeywords({ trendingKeywords, trendingKeywordsSet }: { trendingKeywords: keyword[], trendingKeywordsSet: React.Dispatch<React.SetStateAction<keyword[]>> }) {
    const [search, searchSet] = useState("")

    async function handleGetTopKeywords() {
        //get top trends from chat gpt
        const topKeywords = await getTopKeywords()
        if (topKeywords === undefined) return

        (topKeywords.forEach(eachKeyword => {
            keywordSchema.parse(eachKeyword)
        }))

        trendingKeywordsSet(prevKeywords => {
            const newKeywords = [...prevKeywords, ...topKeywords]

            return newKeywords
        })
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
                    <button className='button' onClick={handleGetTopKeywords}>Get Top Trends</button>

                    <button className='button'
                        onClick={() => {
                            if (search === "") return

                            trendingKeywordsSet(prevKeywords => {
                                const newKeywords = [...prevKeywords, {
                                    name: search
                                }]

                                return newKeywords
                            })

                            searchSet("")
                        }}
                    >Add Keyword</button>
                </div>
            </div>


            {trendingKeywords.length > 0 && (
                <div style={{ display: "flex", gap: ".5rem", alignItems: "center", marginTop: "1rem" }}>
                    {trendingKeywords.map((eachKeyWord, eachKeyWordIndex) => {
                        return (
                            <p className={`showOnHoverParent tag`} key={eachKeyWordIndex} style={{ position: "relative" }}>
                                {eachKeyWord.name}

                                <span className={`showOnHoverChild`} style={{ position: "absolute", top: 0, right: 0, height: "100%" }}
                                    onClick={() => {
                                        trendingKeywordsSet(prevKeyWords => {
                                            let newKeywords = [...prevKeyWords]

                                            newKeywords = newKeywords.filter(eachNewKeyWord => eachNewKeyWord.name !== eachKeyWord.name)
                                            return newKeywords
                                        })
                                    }}
                                >
                                    <svg style={{ width: "1.3rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                </span>
                            </p>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
