"use client"
import React, { useState } from 'react'
import HandleKeywords from '../handleKeywords/HandleKeywords'
import { keyword, system, systems } from '@/types'
import styles from "./styles.module.css"
import ScriptContent from '../scriptContent/ScriptContent'
import AudibleContent from '../audibleContent/AudibleContent'
import EBookContent from '../ebookContent/EBookContent'

const defaultTrendingKeywords: keyword[] = [
    {
        topic: "Meta Expands Reels Overlay Ads to More Brands",
        summary: "Meta is expanding its Reels overlay ads to more brands, providing additional ways for businesses to promote their products and services through the platform. This move aims to enhance engagement and advertising capabilities on Meta's platforms, including Instagram and Facebook. The expansion is part of Meta's broader strategy to increase monetization options for creators and brands, leveraging the popularity of Reels to drive more effective advertising campaigns.",
        references: ["https://www.socialmediatoday.com"]
    },
    {
        topic: "X Tests Auto Advance Mode for Video Viewing",
        summary: "X is testing an auto advance mode for video viewing, which would allow users to watch videos in a more lean-back manner. This feature aims to enhance user experience by automatically playing the next video in a sequence, similar to how other streaming platforms operate. The auto advance mode is part of X's efforts to improve user engagement and make video consumption more seamless.",
        references: ["https://www.socialmediatoday.com"]
    }
]

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
                    <EBookContent style={{ display: currentSystem === "ebook" ? "grid" : "none" }} />
                    <AudibleContent style={{ display: currentSystem === "audible" ? "grid" : "none" }} />
                </div>
            </div>
        </div>
    )
}
