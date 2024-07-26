"use client"
import React, { useState } from 'react'
import HandleKeywords from '../handleKeywords/HandleKeywords'
import { keyword, system, systems } from '@/types'
import styles from "./styles.module.css"
import ScriptContent from '../scriptContent/ScriptContent'
import AudibleContent from '../audibleContent/AudibleContent'
import EBookContent from '../ebookContent/EBookContent'

// const defaultTrendingKeywords = [
//     {
//         "name": "Taylor Swift"
//     },
//     {
//         "name": " Bitcoin"
//     }
// ]

export default function WorkFlow() {
    // const [trendingKeywords, trendingKeywordsSet] = useState<keyword[]>([...defaultTrendingKeywords])
    const [trendingKeywords, trendingKeywordsSet] = useState<keyword[]>([])

    const [currentSystem, currentSystemSet] = useState<system>("script")

    return (
        <div className={styles.main}>
            <HandleKeywords trendingKeywords={trendingKeywords} trendingKeywordsSet={trendingKeywordsSet} />

            <div style={{ display: "grid" }}>
                <div style={{ display: "flex", overflowX: "auto" }}>
                    {systems.map((eachSystem, eachSystemIndex) => {
                        return (
                            <button key={eachSystemIndex} className={eachSystem === currentSystem ? "settingsButton settingsButtonActive" : "settingsButton"} style={{}}
                                onClick={() => {
                                    currentSystemSet(eachSystem)
                                }}
                            >Make {eachSystem}</button>
                        )
                    })}
                </div>

                <div style={{ display: "grid", backgroundColor: "var(--gray1)" }}>
                    <ScriptContent style={{ display: currentSystem === "script" ? "grid" : "none" }} trendingKeywords={trendingKeywords} />
                    <AudibleContent style={{ display: currentSystem === "audible" ? "grid" : "none" }} />
                    <EBookContent style={{ display: currentSystem === "ebook" ? "grid" : "none" }} />
                </div>
            </div>
        </div>
    )
}
