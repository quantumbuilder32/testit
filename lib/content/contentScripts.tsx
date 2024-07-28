import { system } from "@/types";

export const contentPromptsStarter: { [key in system]: string } = {
    script:
        `Help creators by providing personalized content related to AI tools and techniques that can assist with their content interests. You should generate a video script that is engaging, relatable, with practical content that combines the benefits of AI masterfully to these topics: {{topicsToReplace}}. All in a friendly and accessible manner. 

Include:
1) An engaging Video script 30 seconds long. Create concise, attention-grabbing videos scripts.

2) Quick Tips: Before-and-After Demonstrations - Show tasks performed with and without AI assistance to highlight the benefits.
   
3) Q&A Sessions: Create engagement by leaving with a question for the viewer. 
   
4) AI Tool Reviews: Offer short, honest reviews of AI tools beneficial for content.
   
Keep the content authentic and relatable, focusing on real-life applications of AI, the aim is to make AI accessible and beneficial, avoiding intimidating or overly technical language. Combine humor with practical tips to create a friendly and approachable content style.
`,
    audible: "",
    ebook: "",
}


// Using the provided topics {{topicsToReplace}}, search for the latest and most relevant content across top sites like YouTube, LinkedIn, Reddit, X.com, and other significant platforms. Conduct a deep dive to identify trending discussions, key points, and popular opinions under each topic. Merge these topics into a unified narrative that ties the different subjects together in a meaningful way. Based on this information, craft a 30-second video script optimized for virality. The script should include:

// Attention-Grabbing Introduction: Start with a hook that integrates elements from the different topics, presenting them in a way that highlights their interconnections or contrasts. Use a compelling statistic, surprising fact, or provocative question to capture attention.
// Engaging Main Content: Seamlessly weave the key points and insights from each topic into a cohesive story. Use storytelling techniques to illustrate how these topics relate to one another or impact a broader issue. Ensure the narrative is engaging and easy to follow.
// Call to Action and Viewer Engagement: End with a compelling call to action and a question for the viewer, encouraging them to engage with the content. For example, ask them to share their thoughts on the connections between the topics or to answer a relevant question in the comments.
// Visual and Audio Cues: Provide detailed suggestions for images, footage, graphics, and sound elements that support the unified narrative and enhance viewer engagement.
// Voiceover Instructions: Specify the tone, pace, and style to match the integrated content's mood and target audience (e.g., insightful, thought-provoking, friendly).
// The script should be concise, well-structured, and formatted for direct input into InVideo. The goal is to create a compelling video that not only informs but also captivates and encourages interaction, leveraging the interconnected nature of the topics and current trends.