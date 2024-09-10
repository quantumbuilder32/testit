import { NextResponse } from "next/server";
import OpenAI from "openai"

const perplexityApiKey = process.env.PERPLEXITY_API_KEY || ""

const openaiPerplexity = new OpenAI({
    apiKey: perplexityApiKey,
    baseURL: "https://api.perplexity.ai"
})

export async function GET(request: Request) {
    const seenURL = new URL(request.url)
    const topic = seenURL.searchParams.get("topic")
    const mainTopic = seenURL.searchParams.get("mainTopic")

    if (topic === null) return new Response(null, { status: 400 })
    if (mainTopic === null) return new Response(null, { status: 400 })

    let prompt = `
    Generate an in-depth course chapter based on this topic "{{mainTopic}}" using the below structure. This will be used in a course dedicated to teaching people about {{topic}}. Use these exact labels for each section to ensure accurate parsing into a corresponding object:
    
    **Title** [Chapter Title]
    **Content** [Detailed explanation for each subtopic]
    **References** [urls to websites you gathered the info from - separated by a new line]
    
    Ensure that each label is followed by the corresponding content, formatted clearly so that it can be easily parsed. 
    
    For the content I need your response back as valid html elements. Please follow the below guidlines
    
    Subheading = <h2>[Brief overview or tagline]</h2>
    Section Heading  = <h3>[Main sections of the course, e.g., 'Introduction to X']</h3> 
     
    Introduction = <p>[Introduction to the course, setting the context and explaining the importance of the topic]</p>
    
    Examples = <p>[Examples related to the content]</p>
    
    Image Descriptions = <img src="" alt="[Describe in great detail a description of the image that accompanies the text, such as a diagram or chart, photo]"/> [ensure you just return the image element exactly like this and the alt with the specific description of the image, I will use that to generate images later]
    
    Practice Questions = <p>[Questions for the reader to practice what they've learned]</p>
    
    Summary = <p>[Summary of the chapter]</p>
    
    provide only the requested content no other feedback, no errors, prompt feedback or explanations. 
    
    The output from this prompt should follow this format in an order thats appropriate, e.g:
    
    **Title**
    Title of chapter
    
    **References** 
    url1
    url2
    
    **Content**
    <h2>Sub heading</h2>
    <p>introduction</p>
    <p>summary</p>
    <img src="" alt="[incredibly detailed description of image]" />
    <p>examples</p>
    `

    prompt = prompt.replace("{{topic}}", topic)
    const finalPrompt = prompt.replace("{{mainTopic}}", mainTopic)

    const response = await openaiPerplexity.chat.completions.create({
        model: "llama-3.1-sonar-large-128k-online",
        messages: [
            {
                role: "user",
                content: finalPrompt
            }
        ],
    }
    )

    const textResponse = response.choices[0].message.content
    if (textResponse === null) return new Response(null, { status: 400 })

    return NextResponse.json(textResponse)
}
