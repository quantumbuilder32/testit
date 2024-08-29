"use server"

import fs from 'fs/promises';
import path from 'path';
import { execFile } from 'child_process';

export async function generateEpub() {
    // const option = {
    //     title: "Alice's Adventures in Wonderland", // *Required, title of the book.
    //     author: "Lewis Carroll", // *Required, name of the author.
    //     publisher: "Macmillan & Co.", // optional
    //     cover: "https://images.pexels.com/photos/16534745/pexels-photo-16534745/free-photo-of-pavilions-on-gadisar-lake.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Url or File path, both ok.
    //     content: [
    //         {
    //             title: "About the author", // Optional
    //             author: "John Doe", // Optional
    //             data: "<h2>Charles Lutwidge Dodgson</h2>"
    //                 + "<div lang=\"en\">Better known by the pen name Lewis Carroll...</div>"
    //         },
    //         {
    //             title: "Down the Rabbit Hole",
    //             data: "<p>Alice was beginning to get very tired...</p>"
    //         },
    //     ]
    // };

    const epubsFolder = path.join(process.cwd(), "Epubs")

    for (const file of await fs.readdir(epubsFolder)) {
        await fs.unlink(path.join(epubsFolder, file));
    }


    const epubName = `ebook_${Date.now()}.epub`

    const scriptText =
        `
const Epub = require("epub-gen")
const path = require("path")
    
const option = {
    title: "Alice's Adventures in Wonderland", // *Required, title of the book.
    author: "Lewis Carroll", // *Required, name of the author.
    publisher: "Macmillan & Co.", // optional
    cover: "https://images.pexels.com/photos/16534745/pexels-photo-16534745/free-photo-of-pavilions-on-gadisar-lake.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Url or File path, both ok.
    content: [
        {
            title: "About the author", // Optional
            author: "John Doe", // Optional
            data: "<h2>Charles Lutwidge Dodgson</h2>"
            + "<div lang=\\"en\\">Better known by the pen name Lewis Carroll...</div>" // pass html string
        },
        {
            title: "Down the Rabbit Hole",
            data: "<p>Alice was beginning to get very tired...</p>"
        },
    ]
};
    
const workingDirectory = path.join(process.cwd(), "Epubs", "${epubName}")
 
new Epub(option, workingDirectory).promise.then(
    () => console.log("Ebook Generated Successfully!"),
    err => console.error("Failed to generate Ebook because of ", err)
)
`
    const scriptPath = path.join(process.cwd(), "liveScript", "epubScript.js")
    const scriptPathDirectory = path.dirname(scriptPath)

    for (const file of await fs.readdir(scriptPathDirectory)) {
        await fs.unlink(path.join(scriptPathDirectory, file));
    }

    await fs.writeFile(scriptPath, scriptText)

    // Run the script
    execFile('node', [scriptPath], (error, stdout, stderr) => {
        if (error) {
            throw new Error(`Error executing script: ${error.message}`);
        }

        if (stderr) {
            throw new Error(`Error output: ${stderr}`);
        }

        console.log(`Script output: ${stdout}`);
    });
};







