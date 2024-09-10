import path from "path"
import fs from "fs/promises"

export async function GET(request: Request,) {
    const newUrl = new URL(request.url)
    const epubName = newUrl.searchParams.get("epubName")
    console.log(`$epubName`, epubName);
    if (epubName === null) return new Response(null, { status: 400 })

    const epubFilePath = path.join(process.cwd(), "Epubs", `${epubName}.epub`);

    const epub = await fs.readFile(epubFilePath)

    return new Response(epub);
}
