import path from "path"
import fs from "fs/promises"

export async function GET(request: Request,) {
    const epubFolder = path.join(process.cwd(), "Epubs");

    const files = await fs.readdir(epubFolder);
    if (files.length === 0) {
        return new Response('No EPUB file found', { status: 404 });
    }

    const epubFile = files[0];
    const epubFilePath = path.join(epubFolder, epubFile);

    const seenEpubFile = await fs.readFile(epubFilePath)

    return new Response(seenEpubFile);
}
