"use client"
import { makeEpub } from '@/serverFunctions/handleEpub'
import React from 'react'

//custom prompt from gpt to get back title, each page text
//display the story in editor
//editor has title, and each page listed in text form
//see how gpt returns images - parse them and display them
//confirmation to start conversion - each page content is converted into p elements, and each image is converted into img elements with absolute url
//sent to epub library to convert 
//each page content and edits are saved to a database for safe keeping
//epub can be downloaded

export default function EBookContent({ ...elProps }: {} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...elProps} style={{ ...elProps?.style }}>
            <button onClick={async () => {
                try {
                    const result = await makeEpub()
                    console.log("Ebook Generated Successfully!");
                    console.log(`$result`, result);

                } catch (error) {
                    console.error("Failed to generate Ebook because of ", error);
                }
            }}></button>
        </div>
    )
}
