"use client"
import { sendToZapier } from '@/serverFunctions/handleSendToZapier'
import React from 'react'

export default function ClickButton() {
    return (
        <button onClick={() => {
            sendToZapier({
                signal: true
            })
        }}>Create New Script</button>
    )
}
