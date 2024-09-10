"use server"

import fs from 'fs/promises';
import path from 'path';
import { execFile } from 'child_process';
import Epub from "epub-gen"

export async function generateEpub(options: Epub.Options) {
    const optionsInJSON = JSON.stringify(options, null, 2)

    //generate script content
    const scriptText =
        `
    const Epub = require("epub-gen")
    const path = require("path")

    const seenOptions = JSON.parse(\`${optionsInJSON.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}\`)

    const workingDirectory = path.join(process.cwd(), "Epubs", "${options.title}.epub")

    new Epub(seenOptions, workingDirectory).promise.then(
        () => console.log("Ebook Generated Successfully!"),
        err => console.error("Failed to generate Ebook because of ", err)
    )
    `

    //write the script
    const scriptPath = path.join(process.cwd(), "liveScript", "epubScript.js")
    await fs.writeFile(scriptPath, scriptText)

    await new Promise(resolve => {
        // Run the script
        execFile('node', [scriptPath], (error, stdout, stderr) => {
            if (error) {
                throw new Error(`Error executing script: ${error.message}`);
            }

            if (stderr) {
                throw new Error(`Error output: ${stderr}`);
            }

            console.log(`Script output: ${stdout}`);
            if (stdout.includes("successfully")) {//ensures it completed
                resolve(true)
            }
        });
    })
};







