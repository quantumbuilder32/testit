"use server"

import { OpenAIResponse, feedlyApiMoreInfoResponse, feedlyApiResponse } from "@/types";
import puppeteer from 'puppeteer';
require('dotenv').config()

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

export async function getWebsiteBody(url: string) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url);

        const textContent = await page.evaluate(() => {
            const elements = document.querySelectorAll('h1, h2, h3, h4, h5, p, b');

            // @ts-ignore
            return Array.from(elements).map(el => el.innerText).join('\n');
        });

        await browser.close();

        return textContent;

    } catch (error) {
        console.log(`$error with getWebsiteBody`, error);
    }
}



