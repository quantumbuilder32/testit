"use server"

import { db } from "@/db";
import { feedlyDatabaseResults } from "@/db/schema"
import { feedlyApiResult, feedlyDatabaseResult, feedlyDatabaseResultSchema } from "@/types";
import { eq, desc, ilike } from "drizzle-orm";

export async function getFeedlyDatabaseResultsBySearch(searchTerm: string, orderBy: "estimatedEngagement" | "score", seenLimit = 1, seenOffset = 0): Promise<feedlyDatabaseResult[]> {
    const results = await db.query.feedlyDatabaseResults.findMany({
        limit: seenLimit,
        offset: seenOffset,
        orderBy: desc(feedlyDatabaseResults[orderBy]),
        where: eq(feedlyDatabaseResults.searchTerm, searchTerm)
    });

    return results
}

export async function checkSearchTermsUsed(searchTerm: string) {
    const results = await db.query.feedlyDatabaseResults.findMany({
        where: ilike(feedlyDatabaseResults.searchTerm, `%${searchTerm}%`)
    });

    return results.map(eachResult => eachResult.searchTerm)
}

export async function addFeedlyResultsToDatabase(searchTerm: string, feedlyApiResults: feedlyApiResult[]) {
    await Promise.all(
        feedlyApiResults.map(async (eachApiResult) => {
            const newDatabaseResult: feedlyDatabaseResult = {
                id: eachApiResult.id,
                description: eachApiResult.description,
                title: eachApiResult.title,
                website: eachApiResult.website,
                feedId: eachApiResult.feedId,
                searchTerm: searchTerm,
                score: eachApiResult.score,
                estimatedEngagement: eachApiResult.estimatedEngagement ?? 0,
                lastUpdated: new Date(eachApiResult.lastUpdated).toString(),
                updated: new Date(eachApiResult.updated).toString(),
                topics: eachApiResult.topics ?? [],
            }

            //check ensure not there already
            const feedInDb = await getSpecificFeedlyDatabaseResult({ id: eachApiResult.id })

            if (feedInDb) {
                //see if can update
                if ((eachApiResult.estimatedEngagement ?? 0) > feedInDb.estimatedEngagement) {//update if ranked higher
                    await updateFeedlyDatabaseResult(newDatabaseResult)
                }

                console.log(`$was already in db - returned`);

            } else {
                //add new

                //ensure valid with schema
                feedlyDatabaseResultSchema.parse(newDatabaseResult)

                //insert into db
                await db.insert(feedlyDatabaseResults).values(newDatabaseResult);
            }
        })
    )
}

export async function getSpecificFeedlyDatabaseResult(resultId: Pick<feedlyDatabaseResult, 'id'>): Promise<feedlyDatabaseResult | undefined> {
    const results = await db.query.feedlyDatabaseResults.findFirst({
        where: eq(feedlyDatabaseResults.id, resultId.id),
    });

    return results
}

export async function updateFeedlyDatabaseResult(newFeedlyDatabaseResult: feedlyDatabaseResult) {

    feedlyDatabaseResultSchema.parse(newFeedlyDatabaseResult)

    await db.update(feedlyDatabaseResults)
        .set(newFeedlyDatabaseResult)
        .where(eq(feedlyDatabaseResults.id, newFeedlyDatabaseResult.id));
}