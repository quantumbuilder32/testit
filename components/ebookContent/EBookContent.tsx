"use client"
import { contentPromptsStarter } from '@/lib/content/contentScripts'
import React, { useState, useRef } from 'react'
import ShowMore from '../showMore/ShowMore'
import { toast } from 'react-hot-toast'
import { getPerplexityEbook } from '@/serverFunctions/handlePerplexity'
import { defaultImageSrc } from '@/utility/globalState'
import { generateEpub } from '@/serverFunctions/handleEpub'

//custom prompt from gpt to get back title, each page text
//display the story in editor
//editor has title, and each page listed in text form
//see how gpt returns images - parse them and display them
//confirmation to start conversion - each page content is converted into p elements, and each image is converted into img elements with absolute url
//sent to epub library to convert 
//each page content and edits are saved to a database for safe keeping
//epub can be downloaded

export default function EBookContent({ ...elProps }: {} & React.HTMLAttributes<HTMLDivElement>) {
    const [fullPrompt, fullPromptSet] = useState(contentPromptsStarter["ebook"])
    const [topic, topicSet] = useState("")
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    const [scriptLoading, scriptLoadingSet] = useState(false)
    const [script, scriptSet] = useState("To create an engaging and comprehensive 7th grade science ebook, you can structure the content around key topics and include a variety of learning activities. Here’s a suggested outline: ### **Introduction to 7th Grade Science** - **Welcome to 7th Grade Science**: Overview of the course, expectations, and importance of science in everyday life. - **Scientific Method**: Understanding the steps of the scientific method and its application in various scientific disciplines. ### **Unit 1: Physical Sciences** - **Chapter 1: Motion and Forces** - **What is Motion?**: Basic concepts of motion, types of motion, and measurement. - **Forces and Newton's Laws**: Introduction to forces, Newton's laws of motion, and their applications. - **Lab Activities**: Experiments to demonstrate motion and forces. - **Chapter 2: Energy and Work** - **Types of Energy**: Kinetic energy, potential energy, thermal energy, and more. - **Work and Efficiency**: Understanding work, efficiency, and energy transfer. - **Lab Activities**: Experiments to measure energy and work. ### **Unit 2: Life Sciences** - **Chapter 3: Cells and Cellular Processes** - **Cell Structure**: Introduction to cell components and functions. - **Cellular Processes**: Photosynthesis, respiration, and cell division. - **Lab Activities**: Observing cells under a microscope, modeling cellular processes. - **Chapter 4: Genetics and Heredity** - **Basic Genetics**: Mendel's laws, DNA structure, and genetic traits. - **Hereditary Patterns**: Understanding inheritance and genetic variation. - **Lab Activities**: Simulating genetic experiments, creating family trees. ### **Unit 3: Earth and Environmental Sciences** - **Chapter 5: Earth's Landforms and Surface Features** - **Geological Processes**: Formation of mountains, valleys, and plate tectonics. - **Earth's Systems**: Understanding the water cycle, weathering, and erosion. - **Lab Activities**: Modeling geological processes, creating a model of the Earth's surface. - **Chapter 6: Environmental Science** - **Ecosystems and Biodiversity**: Understanding ecosystems, food chains, and biodiversity. - **Human Impact on the Environment**: Acid rain, pollution, and conservation. - **Lab Activities**: Conducting environmental surveys, creating a model ecosystem. ### **Unit 4: Scientific Inquiry and Critical Thinking** - **Chapter 7: Scientific Inquiry** - **Designing Experiments**: Steps to design and conduct a scientific experiment. - **Data Analysis**: Understanding and interpreting data from experiments. - **Lab Activities**: Designing and conducting experiments on various topics. - **Chapter 8: Critical Thinking in Science** - **Evaluating Evidence**: How to evaluate scientific evidence and arguments. - **Scientific Literacy**: Understanding the role of science in society and critical thinking skills. ### **Appendices and Resources** - **Glossary**: Key terms and definitions from the course. - **Additional Resources**: Links to online resources, videos, and interactive tools. - **Assessment Tools**: Quizzes, tests, and project ideas for assessment. ### **Interactive Elements** - **Quizzes and Tests**: Regular assessments to check understanding. - **Lab Activities and Experiments**: Hands-on activities to reinforce learning. - **Discussion Questions**: Encouraging critical thinking and class discussions. - **Real-World Applications**: Examples of how science is used in everyday life and current research. This structure ensures a balanced coverage of physical sciences, life sciences, and earth sciences, while also emphasizing scientific inquiry and critical thinking. The inclusion of lab activities, quizzes, and real-world applications will make the course engaging and relevant.")
    // const [script, scriptSet] = useState("")

    return (
        <div {...elProps} style={{ padding: "1rem", ...elProps?.style }}>
            <ShowMore label='Edit Prompt'
                content={
                    <textarea ref={textAreaRef} value={fullPrompt} placeholder='enter prompt to create script' style={{ width: "100%", backgroundColor: "var(--color1)" }}
                        onChange={(e) => {
                            if (textAreaRef.current === null) return

                            textAreaRef.current.style.height = 'auto';
                            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';

                            fullPromptSet(e.target.value)
                        }}
                    />
                }
            />

            <input type='text' value={topic} onChange={(e) => { topicSet(e.target.value) }} placeholder="What's this ebook about?" />

            <button className='button' style={{ justifySelf: "center" }}
                onClick={async () => {
                    try {
                        if (topic === "") return
                        const finalPrompt = fullPrompt.replace("{{topic}}", topic)

                        console.log(`$finalPrompt`, finalPrompt);

                        scriptLoadingSet(true)
                        const scriptromGpt = await getPerplexityEbook(finalPrompt)
                        scriptLoadingSet(false)

                        scriptSet(scriptromGpt)

                    } catch (error) {
                        toast.error("error getting script")
                        console.log(`$error`, error);
                    }
                }}
            >Generate Text</button>

            {scriptLoading && (
                <p>Loading</p>
            )}

            {script !== "" && (
                <>
                    <button className='button' style={{ justifySelf: "center" }}
                        onClick={async () => {

                            try {
                                await generateEpub()

                                const response = await fetch(`/api/downloadEbook`)
                                const responseBlob = await response.blob()

                                const url = window.URL.createObjectURL(responseBlob);

                                const a = document.createElement('a');
                                a.href = url;
                                a.download = "ebook.epub"
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);

                                toast.success("Ebook generated!")

                            } catch (error) {
                                toast.error("error")
                                console.log(`$error`, error);
                            }
                        }}
                    >Download Ebook</button>


                    <div style={{}}>
                        {script}
                    </div>
                </>
            )}
        </div>
    )
}
