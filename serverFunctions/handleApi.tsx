"use server"

import { feedlyApiMoreInfoResponse, feedlyApiResponse } from "@/types";

export async function getFeedApiBySearch(search: string): Promise<feedlyApiResponse | undefined> {
    try {
        const response = await fetch(`https://cloud.feedly.com/v3/search/feeds?q=${search}`)
        const data = await response.json() as feedlyApiResponse

        return data

    } catch (error) {
        console.log(`$error searching`, error);
    }
}

export async function getFeedApiMoreInfo(feedId: string): Promise<feedlyApiMoreInfoResponse | undefined> {
    try {
        const response = await fetch(`https://cloud.feedly.com/v3/streams/contents?streamId=${feedId}`)
        const data = await response.json() as feedlyApiMoreInfoResponse

        return data

    } catch (error) {
        console.log(`$error getting more info`, error);
    }
}

