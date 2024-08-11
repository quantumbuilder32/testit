// "use server"
// import EPub from "@lesjoursfr/html-to-epub"
// import path from "path"

// const epubContentPageOne: EPub.EpubContentOptions = {
//     title: "Chapter One",
//     data: `<p>this is some ebook text</p>`,
// }

// const epubContentPageTwo: EPub.EpubContentOptions = {
//     title: "Chapter Two",
//     data: `<p>this is some more ebook text, cool</p>`,
// }

// export async function makeEpub(): Promise<string> {
//     const options: EPub.EpubOptions = {
//         title: "first ebook",
//         description: "an ebook for the ages",
//         author: "bruce",
//         content: [epubContentPageOne, epubContentPageTwo]
//     }

//     const output = path.join(process.cwd(), "newestEbook.epub")

//     const epub = new EPub.EPub(options, output);

//     const renderedEbook = await epub.render()

//     return renderedEbook.result
// }
