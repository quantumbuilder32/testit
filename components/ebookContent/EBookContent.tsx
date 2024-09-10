"use client"
import React, { useState, useRef } from 'react'
import ShowMore from '../showMore/ShowMore'
import { toast } from 'react-hot-toast'
import { getEbookMainTopics } from '@/serverFunctions/handlePerplexity'
import { defaultImageSrc } from '@/utility/globalState'
import { generateEpub } from '@/serverFunctions/handleEpub'
import Epub from "epub-gen"
import Image from 'next/image'
import { v4 as uuidV4 } from "uuid"
import Link from 'next/link'

export default function EBookContent({ ...elProps }: {} & React.HTMLAttributes<HTMLDivElement>) {
    //edit prompts of automation / save results in storage
    //display errors in automation 
    //change image loader to accept text
    //track if its running - have options to refetch failed images - adjust prompt

    const topic = useRef("")
    const [, refresherSet] = useState(false)
    const [editEbookHTML, editEbookHTMLSet] = useState(false)
    const [referencesUsed, referencesUsedSet] = useState<string[]>([])
    const [ebookGenerated, ebookGeneratedSet] = useState(false)
    const [bookComplete, bookCompleteSet] = useState({
        chapter: false,
        images: false
    })

    const [epubOptions, epubOptionsSet] = useState<Epub.Options>({
        title: "", // *Required, title of the book.
        author: "Bruce Wedderburn", // *Required, name of the author.
        publisher: "Macmillan & Co.", // optional
        cover: "https://images.pexels.com/photos/68507/spring-flowers-flowers-collage-floral-68507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // Url or File path, both ok.
        content: [
        ]
    })

    const writingImageToDocument = useRef(false)
    const imageLoader = useRef<{
        list: {
            [key: string]: {
                status: "queued" | "success" | "error",
                element: HTMLImageElement
            }
        },
        running: boolean
    }>({
        list: {},
        running: false
    })

    type segmentData =
        {
            id: "aa",
            data: string[]
        } |
        {
            id: "bb",
            data: string[]
        }

    type automationSegment = {
        id: segmentData["id"],
        title: string,
        prompt: string | undefined,
        automatic: boolean,
        running: boolean,
        dataSegment: segmentData | undefined,
        error: string | undefined,
        function: () => Promise<void>,
    }

    const automation = useRef<automationSegment[]>([
        {
            id: "aa",
            title: "generate main topics",
            prompt:
                `Generate a list of main topics that should be covered in an ebook on {{topic}}. Approach this as a best-selling ebook author who specializes in creating educational content and teaching courses. Think about the most critical and impactful topics that will help readers deeply understand the subject, ensuring they are well-organized and comprehensive. Each topic should be listed on a new line, with no additional content or explanation. Only provide the list of topics in plain text no symbols to denote it.
                
                e.g
                topic1
                topic2
                topic3

                provide only the topics no other feedback, no errors, prompt feedback or explanations, only the topics separated by a new line. 
                `,
            automatic: true,
            running: false,
            dataSegment: undefined,
            error: undefined,
            function: async function () {
                try {
                    // reach out to perplexity get all topics

                    //ensure prompt is not empty
                    let prompt = this.prompt
                    if (prompt === undefined) throw new Error("prompt empty")

                    if (topic.current === "") throw new Error("enter topic")

                    //get latest topic in prompt
                    const updatedPrompt = prompt.replace("{{topic}}", topic.current)

                    const seenResponse = await getEbookMainTopics(updatedPrompt)

                    this.dataSegment = {
                        id: "aa",
                        data: seenResponse.split("\n")
                    }

                } catch (error) {
                    const errorMessage = (error as Error).message
                    toast.error(errorMessage)
                    this.error = errorMessage
                }
            }
        },
        {
            id: "bb",
            title: "expound on each topic",
            prompt: undefined,
            automatic: false,
            running: false,
            dataSegment: undefined,
            error: undefined,
            function: async function () {
                try {
                    //find data from main topic segment
                    const seenSegment = automation.current.find(eachArrItem => eachArrItem.id === "aa")
                    if (seenSegment === undefined) throw new Error("not seeing segment")

                    // reach out to perplexity expound on each topic
                    const seenMainTopics = seenSegment.dataSegment?.data
                    if (seenMainTopics === undefined) throw new Error("not seeing main topics")

                    //update epub with correct amount of chapters
                    epubOptionsSet(prevOtions => {
                        const newOptions = { ...prevOtions }

                        //make ebub content
                        const epubContent: Epub.Chapter[] = seenMainTopics.map(eachMainTopic => {
                            return {
                                title: eachMainTopic,
                                data: "<p>still loading</p>"
                            }
                        })

                        newOptions.content = [...epubContent] //maybe add intro chapters

                        return newOptions
                    })

                    bookCompleteSet(prev => {
                        const newObj = { ...prev }
                        newObj.chapter = false
                        return newObj
                    })

                    //expound on all topics
                    await Promise.all(
                        seenMainTopics.map(async (eachMainTopic, eachMainTopicIndex) => {
                            //reach out to api
                            const fetchResponse = await fetch(`/api/expound?topic=${topic.current}&mainTopic=${eachMainTopic}`)
                            const seenResponse = await fetchResponse.json()
                            console.log(`$seenResponse`, seenResponse);

                            // parse title
                            const titleMatch = seenResponse.match(/\*\*Title\*\*\n(.+?)\n/);
                            const title: string = titleMatch ? titleMatch[1].trim() : '';

                            //parse content
                            const contentMatch = seenResponse.match(/\*\*Content\*\*\n([\s\S]*)/);
                            let content: string = contentMatch ? contentMatch[1].trim() : '';

                            //parse references
                            const referencesMatch = seenResponse.match(/\*\*References\*\*\s+([\s\S]+?)\s+\*\*Content\*\*/);
                            const references = referencesMatch ? referencesMatch[1].trim() : '';

                            // Split by newlines to get each reference URL
                            const referencesArray = references.split(/\s+/).filter((url: any) => url.startsWith('http') || url.startsWith('www'));

                            const parser = new DOMParser();
                            const doc = parser.parseFromString(content, 'text/html');
                            const seenImageElements = doc.querySelectorAll('img');

                            //notify loading images once
                            if (seenImageElements.length > 0 && Object.entries(imageLoader.current).length === 0) {
                                toast.success("loading images")
                            }

                            //for each image element seen add to image loader
                            seenImageElements.forEach(async (eachImageElement) => {
                                // // Get the alt text / image description
                                // const altText = eachImageElement.alt;

                                // Add an id 
                                eachImageElement.id = uuidV4()

                                //add to image loader queue
                                addToMediaLoaderQueue(eachImageElement.id, eachImageElement)
                            });

                            // Serialize the updated HTML back to a string - add image sources to html
                            content = doc.body.innerHTML;

                            //update that chapter index with seen content
                            epubOptionsSet(prevOtions => {
                                const newOptions = { ...prevOtions }

                                newOptions.content[eachMainTopicIndex] = {
                                    title: title,
                                    data: content,
                                }

                                return newOptions
                            })

                            //save references
                            referencesUsedSet(prevReferences => {
                                const newReferences = [...prevReferences, ...referencesArray]

                                return newReferences
                            })
                        })
                    )

                    bookCompleteSet(prev => {
                        const newObj = { ...prev }
                        newObj.chapter = true

                        if (newObj.chapter) {
                            toast.success("all chapters loaded")
                        }

                        return newObj
                    })

                } catch (error) {
                    const errorMessage = (error as Error).message
                    toast.error(errorMessage)
                    this.error = errorMessage
                }
            }
        }
    ])

    async function runAutomation(runFromIndex: number) {
        console.log(`$running for automation index`, runFromIndex);

        automation.current[runFromIndex].running = true
        refresh()

        await automation.current[runFromIndex].function()

        automation.current[runFromIndex].running = false
        refresh()

        // await new Promise(resolve => setTimeout(() => resolve, 10000))

        const nextIndex = runFromIndex + 1
        if (automation.current[nextIndex] !== undefined && automation.current[nextIndex].automatic) {
            toast.success("continuing automation!")
            runAutomation(nextIndex)

        } else {
            toast.success("automation stopped")
        }
    }

    function refresh() {
        refresherSet(prev => !prev)
    }

    async function addToMediaLoaderQueue(id: string, imageElement: HTMLImageElement) {
        //also starts the loader if not running

        //note that images are not loaded yet
        bookCompleteSet(prev => {
            const newObj = { ...prev }
            newObj.images = false
            return newObj
        })

        //query image generation api
        imageLoader.current.list[id] = {
            status: "queued",
            element: imageElement
        }

        //if not running - start running
        if (!imageLoader.current.running) {
            imageLoader.current.running = true //just to update value

            runMediaLoader()
        }
    }

    async function runMediaLoader() {
        //get current list and process n queued images
        const step = 5
        const imageArrayList = Object.entries(imageLoader.current.list)
        const queuedImages = imageArrayList.filter(eachEntry => eachEntry[1].status === "queued").slice(0, step)

        const startTime = Date.now()

        //fetch the images
        await Promise.all(
            queuedImages.map(async eachEntry => {
                const imageId = eachEntry[0]
                const imageObj = eachEntry[1]
                const imageDescription = imageObj.element.alt

                try {
                    const response = await fetch(`/api/generateImage?description=${imageDescription}`)
                    const newImageSrc = await response.json()

                    const checkToWrite = () => {
                        //cant write now try again later
                        if (writingImageToDocument.current) {
                            console.log(`$cant write not trying later`);

                            //check back later
                            setTimeout(() => {
                                checkToWrite()
                            }, 100);

                        } else {
                            //update content that has correct id with src
                            writingImageToDocument.current = true

                            //update content with image src
                            epubOptionsSet(prevOtions => {
                                const newOptions = { ...prevOtions }

                                newOptions.content = newOptions.content.map(eachContentSection => {
                                    const parser = new DOMParser();
                                    const document = parser.parseFromString(eachContentSection.data, 'text/html');

                                    const imageElementsInDocument: NodeListOf<HTMLImageElement> = document.querySelectorAll(`img`);

                                    let foundImgId = false
                                    imageElementsInDocument.forEach(eachImageElement => {
                                        if (eachImageElement.id === imageId) {
                                            foundImgId = true

                                            // update the src on the image if id matches
                                            eachImageElement.src = newImageSrc
                                        }
                                    })

                                    if (foundImgId) {
                                        //update the data for the correct id
                                        eachContentSection.data = document.body.innerHTML
                                        imageLoader.current.list[imageId].status = "success"
                                    }

                                    return eachContentSection
                                })

                                return newOptions
                            })

                            writingImageToDocument.current = false
                        }
                    }

                    checkToWrite()

                } catch (error) {
                    console.log(`$error fetching images`, error);
                    imageLoader.current.list[imageId].status = "error"
                }
            })
        )

        //check for success and more items
        const seenLoadedEntries = Object.entries(imageLoader.current.list)
        let successCount = 0
        let queuedCount = 0

        seenLoadedEntries.forEach(eachEntry => {
            if (eachEntry[1].status === "success") {
                successCount++
            }

            if (eachEntry[1].status === "queued") {
                queuedCount++
            }
        })

        if (successCount === seenLoadedEntries.length) {
            bookCompleteSet(prev => {
                const newObj = { ...prev }
                newObj.images = true

                return newObj
            })

            toast.success("all images loaded!")
            imageLoader.current.running = false
        }

        //check time
        const endTime = Date.now()
        const timeDifference = endTime - startTime

        let waitTime = 60000 - timeDifference

        if (waitTime > 0) {
            //ensure don't hit rate limit - wait
            toast.success(`Loading next images in ${waitTime / 1000}s`)
            await new Promise(resolve => setTimeout(resolve, waitTime))
        }

        //rerun function cause more to do
        if (queuedCount > 0) {
            toast.success("loading more images")
            runMediaLoader()
        }
    }

    return (
        <div {...elProps} style={{ padding: "1rem", gap: "1rem", ...elProps?.style }}>
            <input type='text' value={topic.current} onChange={(e) => { topic.current = e.target.value; refresh() }} placeholder="Ebook topic" />

            <button className='button' style={{ justifySelf: "center" }}
                onClick={() => { runAutomation(0) }}
            >Start automation</button>

            <div style={{ display: "grid", gap: "1rem", backgroundColor: "#eee" }}>
                {automation.current.map((eachAutomationStep, eachAutomationStepIndex) => {
                    return (
                        <div key={eachAutomationStepIndex} style={{ padding: "1rem", backgroundColor: "#ddd", borderRadius: "1rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                            <div style={{ padding: ".5rem", fontWeight: "bold", backgroundColor: eachAutomationStep.running ? "green" : "#ccc", alignSelf: "flex-start" }}>{eachAutomationStepIndex + 1}</div>

                            <div style={{ display: "grid", gap: ".5rem" }}>
                                <h3 style={{ textTransform: "capitalize", fontWeight: "bold" }}>{eachAutomationStep.title}</h3>

                                <p>{eachAutomationStep.running ? "running" : "inactive"}</p>

                                <div style={{ display: "flex", gap: "1rem" }}>
                                    <button className='button' style={{ justifySelf: "flex-start" }}
                                        onClick={() => {
                                            if (eachAutomationStep.automatic) {
                                                //make manual
                                                eachAutomationStep.automatic = false
                                            } else {
                                                //make automatic
                                                eachAutomationStep.automatic = true
                                            }

                                            refresh()
                                        }}>{eachAutomationStep.automatic ? "Automated" : "Manual"}</button>

                                    <button className='button' style={{ justifySelf: "flex-start" }}
                                        onClick={() => {
                                            runAutomation(eachAutomationStepIndex)
                                        }}>Play from here</button>
                                </div>

                                {eachAutomationStep.dataSegment !== undefined && (
                                    <ShowMore
                                        label='Got Data'
                                        labelStyle={{ color: "green", fontWeight: "bold" }}
                                        content={
                                            <>
                                                {eachAutomationStep.dataSegment.id === "aa" && (
                                                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                                                        {eachAutomationStep.dataSegment.data.map((eachString, eachStringIndex) => (
                                                            <div key={eachStringIndex} style={{ display: "grid", gridTemplateColumns: "1fr auto" }}>
                                                                <input key={eachStringIndex} type='text' value={eachString} style={{}}
                                                                    onChange={(e) => {
                                                                        eachAutomationStep.dataSegment!.data[eachStringIndex] = e.target.value
                                                                        refresh()
                                                                    }}
                                                                />

                                                                <button className='button'
                                                                    onClick={() => {
                                                                        (eachAutomationStep.dataSegment!.data as string[]) = (eachAutomationStep.dataSegment!.data as string[]).filter((eachFilterString, eachFilterStringIndex) => eachFilterStringIndex !== eachStringIndex)
                                                                        refresh()
                                                                    }}
                                                                >x</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Display epub chapters */}
            <ShowMore startShowing={true} label='Ebook Base' content={
                <div style={{ display: "grid" }}>
                    <label htmlFor='title'>Title</label>
                    <input id="title" type='text' value={epubOptions.title} placeholder='Enter ebook title'
                        onChange={(e) => {
                            epubOptionsSet(prevOptions => {
                                const newOptions = { ...prevOptions }
                                newOptions.title = e.target.value
                                return newOptions
                            })
                        }}
                    />

                    <label htmlFor='Author'>Author</label>
                    <input id='Author' type='text' value={epubOptions.author} placeholder='Enter ebook author'
                        onChange={(e) => {
                            epubOptionsSet(prevOptions => {
                                const newOptions = { ...prevOptions }
                                newOptions.author = e.target.value
                                return newOptions
                            })
                        }}
                    />

                    <label htmlFor='publisher'>Publisher</label>
                    <input id='publisher' type='text' value={epubOptions.publisher} placeholder='Enter ebook publisher'
                        onChange={(e) => {
                            epubOptionsSet(prevOptions => {
                                const newOptions = { ...prevOptions }
                                newOptions.publisher = e.target.value
                                return newOptions
                            })
                        }}
                    />

                    <label htmlFor='coverImage'>Cover Image Url</label>
                    <input id="coverImage" type='text' value={epubOptions.cover} placeholder='Enter ebook cover url'
                        onChange={(e) => {
                            epubOptionsSet(prevOptions => {
                                const newOptions = { ...prevOptions }
                                newOptions.cover = e.target.value
                                return newOptions
                            })
                        }}
                    />

                    <Image src={epubOptions.cover ?? defaultImageSrc} height={1000} width={1000} alt='Ebook Cover' style={{ objectFit: "contain", width: "100%", height: "auto" }} />
                </div>
            } />

            {epubOptions.content.length > 0 && (
                <>
                    <button className='button' style={{ justifySelf: "center" }}
                        onClick={() => { editEbookHTMLSet(prev => !prev) }}
                    >{editEbookHTML ? "View Ebook" : "Edit HTML"}</button>

                    <div style={{ display: "grid", gap: "3rem" }}>
                        {epubOptions.content.map((eachChapter, eachChapterIndex) => {
                            return (
                                <div key={eachChapterIndex} style={{ display: "grid", gap: "1rem", backgroundColor: "#fff" }}>
                                    <h1
                                        dangerouslySetInnerHTML={{ __html: eachChapter.title ?? "" }}
                                        contentEditable
                                        onBlur={(e) => {
                                            epubOptionsSet(prevOptions => {
                                                const newOptions = { ...prevOptions }

                                                newOptions.content[eachChapterIndex].title = e.target.innerText

                                                return newOptions
                                            })
                                        }}
                                        style={{ fontWeight: "bold", fontSize: "1.5rem", padding: "1rem" }}
                                    ></h1>

                                    {editEbookHTML ? (
                                        <textarea rows={5} value={eachChapter.data}
                                            onChange={(e) => {
                                                epubOptionsSet(prevOptions => {
                                                    const newOptions = { ...prevOptions };

                                                    newOptions.content[eachChapterIndex].data = e.target.value

                                                    return newOptions;
                                                });
                                            }}
                                        />

                                    ) : (
                                        <div
                                            contentEditable
                                            onBlur={(e) => {
                                                //save edited html to state
                                                epubOptionsSet(prevOptions => {
                                                    const newOptions = { ...prevOptions };

                                                    newOptions.content[eachChapterIndex].data = e.target.innerHTML;

                                                    return newOptions;
                                                });
                                            }}
                                            dangerouslySetInnerHTML={{ __html: eachChapter.data }}
                                            style={{ padding: "1rem" }}
                                        ></div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <ShowMore label='References' content={
                        <div style={{ display: "grid", gap: ".5rem" }}>
                            {referencesUsed.map((eachReference, eachReferenceIndex) => {
                                return (
                                    <Link key={eachReferenceIndex} href={eachReference} target='blank_' >{eachReference}</Link>
                                )
                            })}
                        </div>
                    } />

                    <div>
                        <p>Images Loaded: {bookComplete.images.toString()}</p>
                        <p>Chapters Loaded: {bookComplete.chapter.toString()}</p>
                    </div>

                    <button className='button' style={{ justifySelf: "center" }}
                        onClick={async () => {
                            try {
                                if (epubOptions.title === "") {
                                    toast.error("ensure you have an ebook title")
                                    return
                                }

                                ebookGeneratedSet(false)
                                await generateEpub(epubOptions)
                                ebookGeneratedSet(true)
                                toast.success("Ebook generated!")

                            } catch (error) {
                                toast.error("error")
                                console.log(`$error`, error);
                            }
                        }}
                    >Generate Ebook</button>

                    {ebookGenerated && (
                        <button className='button' style={{ justifySelf: "center" }}
                            onClick={async () => {
                                try {
                                    const response = await fetch(`/api/downloadEpub?epubName=${epubOptions.title}`)
                                    const responseBlob = await response.blob()

                                    const url = window.URL.createObjectURL(responseBlob);

                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${epubOptions.title}.epub`
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);

                                } catch (error) {
                                    toast.error("error")
                                    console.log(`$error downlaoding`, error);
                                }
                            }}
                        >Download Ebook</button>
                    )}
                </>
            )}
        </div>
    )
}
