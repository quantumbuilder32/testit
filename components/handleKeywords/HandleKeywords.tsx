"use client"
import React, { useState } from 'react'
import { keyword, keywordSchema } from '@/types';
import styles from "./styles.module.css"
import { getAPIKey, getTopKeywords } from '@/serverFunctions/handleGPT';
import { toast } from 'react-hot-toast';
import { shuffleArray } from '@/usefulFunctions/randomizeArray';


export default function HandleKeywords({ trendingKeywords, trendingKeywordsSet }: { trendingKeywords: keyword[], trendingKeywordsSet: React.Dispatch<React.SetStateAction<keyword[]>> }) {
    const [search, searchSet] = useState("")

    async function handleGetTopKeywords() {
        try {
            //get top trends from chat gpt
            const topKeywords = await getTopKeywords()

            trendingKeywordsSet(prevKeywords => {
                const newKeywords = [...prevKeywords, ...topKeywords]

                return newKeywords
            })

        } catch (error) {
            toast.error("error getting keywords")
            console.log(`$error handleGetTopKeywords`, error);

            const optionsStrArr = shuffleArray(["AI", "cryptocurrency", "blockchain", "climate change", "remote work", "Web3", "metaverse", "NFTs", "machine learning", "cybersecurity", "5G", "quantum computing", "virtual reality", "augmented reality", "electric vehicles", "renewable energy", "biotech", "fintech", "data science", "cloud computing", "automation", "IoT", "big data", "e-commerce", "digital transformation", "smart cities", "healthtech", "edge computing", "robotics", "social media trends", "telemedicine", "green technology", "space exploration", "AI ethics", "genomics", "digital marketing", "sustainable fashion", "cyber threats", "AR/VR gaming", "self-driving cars", "smart home technology", "quantum internet", "3D printing", "personalized medicine", "biodegradable materials", "sustainable agriculture", "VR education", "carbon capture", "AI in healthcare"])
            const backupKeywords: keyword[] = `${optionsStrArr[0]}, ${optionsStrArr[1]}`.split(",").map(eachString => {
                const keyWord: keyword = {
                    name: eachString
                }
                return keyWord
            })

            toast.error("couldn't fetch, using example keywords")

            trendingKeywordsSet(prevKeywords => {
                const newKeywords = [...prevKeywords, ...backupKeywords]

                return newKeywords
            })
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

            <button onClick={async () => {
                console.log(`$key`, await getAPIKey());
            }}>check</button>

            {trendingKeywords.length > 0 && (
                <div style={{ display: "flex", gap: ".5rem", alignItems: "center", marginTop: "1rem", overflowX: "auto" }}>
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
