"use client"
import React, { useState } from 'react'
import HandleKeywords from '../handleKeywords/HandleKeywords'
import { keyword } from '@/types'

export default function WorkFlow() {
    const [trendingKeywords, trendingKeywordsSet] = useState<keyword[]>([])

    return (
        <div>
            <HandleKeywords trendingKeywords={trendingKeywords} trendingKeywordsSet={trendingKeywordsSet} />
        </div>
    )
}
