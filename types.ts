import { z } from "zod";

export const feedlyDatabaseResultSchema = z.object({
    id: z.string().min(1),
    description: z.string().min(1),
    title: z.string().min(1),
    website: z.string().min(1),
    feedId: z.string().min(1),
    searchTerm: z.string().min(1),

    score: z.number(),
    estimatedEngagement: z.number(),

    lastUpdated: z.string().min(1),
    updated: z.string().min(1),

    topics: z.array(z.string()),
})

export type feedlyDatabaseResult = z.infer<typeof feedlyDatabaseResultSchema>










// get info from keyword
export type feedlyApiResponse = {
    success: boolean;
    results: feedlyApiResult[];
}

export type feedlyApiResult = {
    score: number;
    lastUpdated: number;
    partial: boolean;
    description: string;
    language: string;
    id: string;
    title: string;
    website: string;
    topics?: string[];
    feedId: string;
    velocity: number;
    updated: number;
    subscribers: number;
    estimatedEngagement?: number;
    visualUrl?: string;
    iconUrl?: string;
    coverUrl?: string;
}//dont edit













//get expanded info 
export type feedlyApiMoreInfoResponse = {
    id: string;
    title: string;
    direction: string;
    updated: number;
    alternate: Alternate[];
    items: feedlyMoreInfoApiItem[];
}

export type Alternate = {
    href: string;
    type: string;
}

export type feedlyMoreInfoApiItem = {
    fingerprint: string;
    language: string;
    id: string;
    originId: string;
    keywords: string[];
    origin: Origin;
    content: Content;
    title: string;
    crawled: number;
    published: number;
    author: string;
    alternate: Alternate[];
    summary: Content;
    visual: Visual;
    canonicalUrl: string;
    unread: boolean;
}

export type Content = {
    content: string;
    direction: string;
}

export type Origin = {
    streamId: string;
    title: string;
    htmlUrl: string;
}

export type Visual = {
    processor: string;
    contentType: string;
    url: string;
    width: number;
    height: number;
}
