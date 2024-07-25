"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { keyword, keywordSchema } from '@/types';
import styles from "./styles.module.css"
import { getTopKeywords } from '@/serverFunctions/handleGPT';


export default function HandleKeywords({ trendingKeywords, trendingKeywordsSet }: { trendingKeywords: keyword[], trendingKeywordsSet: React.Dispatch<React.SetStateAction<keyword[]>> }) {
    const [search, searchSet] = useState("")
    const searchDebounce = useRef<NodeJS.Timeout>()

    //fetch top articles from gpt
    useEffect(() => {
        // handleGetTopTrends()
    }, [])

    async function searchTopKeywords() {
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
            <div>
                <input type='text' value={search}
                    onChange={(e) => {
                        searchSet(e.target.value)
                    }}
                />

                <button onClick={() => {
                    if (search === "") return

                    trendingKeywordsSet(prevKeywords => {
                        const newKeywords = [...prevKeywords, {
                            name: search
                        }]

                        return newKeywords
                    })
                }}>Add Keyword</button>
            </div>

            <button onClick={searchTopKeywords}> check</button>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                {trendingKeywords.map((eachKeyWord, eachKeyWordIndex) => {
                    console.log(`$each`, eachKeyWord);
                    return (
                        <p key={eachKeyWordIndex} style={{ padding: "1rem", backgroundColor: "var(--gray1)" }}>{eachKeyWord.name}</p>
                    )
                })}
            </div>
        </div>
    )
}
