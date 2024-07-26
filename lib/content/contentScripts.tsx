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