"use server"
import fs from "fs/promises"
import path from "path"

const baseDir = process.cwd()

export async function writeToStorage<T>(filePathNameFromBase: string[], object: T) {
    try {
        const filePath = path.join(baseDir, ...filePathNameFromBase)
        const folderPath = path.dirname(filePath);

        if (!await checkIfFileExists(filePath)) {
            console.log(`$filePath didnt exist`);

            await fs.mkdir(folderPath, { recursive: true });
            console.log(`$made directory`, folderPath);
        }

        // Write the file to the correct path
        await fs.writeFile(filePath, JSON.stringify(object));
        console.log(`wrote the file: ${filePath}`);


    } catch (error) {
        console.log(`$error writing to storage`, error);
    }
}

export async function checkIfFileExists(filePath: string) {
    try {
        await fs.access(filePath, fs.constants.F_OK);

        return true;
    } catch (error) {
        //@ts-ignore
        if (error.code === 'ENOENT') {
            return false;
        } else {
            throw error;
        }
    }
}

export async function deleteDirectory(filePathFromBase: string) {
    console.log(`$called to delete`, filePathFromBase);
    const fullPath = path.join(process.cwd(), filePathFromBase)
    await fs.rm(fullPath, { force: true, recursive: true })
}

// export async function updateFeedlyLocalStorage(search: string, feedResponse: feedlyApiResponse, defaultFilePath = "feedlyStorage.json") {
//     try {
//         const filePath = path.join(baseDir, defaultFilePath)
//         const folderPath = path.dirname(filePath);

//         if (!await checkIfFileExists(filePath)) {
//             console.log(`$file didnt exist`);

//             await fs.mkdir(folderPath, { recursive: true });
//             console.log(`$made directory`, folderPath);

//             await fs.writeFile(filePath, JSON.stringify({}));
//         }


//         const feedlyStorageJsonString = await fs.readFile(filePath, { encoding: "utf-8" })
//         const feedlyStorage = JSON.parse(feedlyStorageJsonString) as feedlyStorage

//         if (feedlyStorage[search] === undefined) {
//             feedlyStorage[search] = feedResponse

//         } else {
//             const pastResponse = feedlyStorage[search]
//             const pastFeeds = pastResponse.results

//             const feedsToAdd: feedlyApiResult[] = []

//             feedResponse.results.forEach(eachFeed => {
//                 let foundInArray = false

//                 pastFeeds.forEach(eachPastFeed => {
//                     if (eachFeed.id === eachPastFeed.id) {
//                         foundInArray = true
//                     }
//                 })

//                 if (!foundInArray) {
//                     feedsToAdd.push(eachFeed)
//                 }
//             })

//             const newFeeds: feedlyApiResult[] = [...pastFeeds, ...feedsToAdd]
//             newFeeds.sort((a, b) => (b.estimatedEngagement ?? 0) - (a.estimatedEngagement ?? 0))

//             feedlyStorage[search].results = newFeeds
//         }

//         await fs.writeFile(filePath, JSON.stringify(feedlyStorage));

//     } catch (error) {
//         console.log(`$error updating local feedly storage`, error);
//     }
// }

// export async function readFeedlyLocalStorage(defaultFilePath = "feedlyStorage.json") {
//     try {
//         const filePath = path.join(baseDir, defaultFilePath)

//         const feedlyStorageJsonString = await fs.readFile(filePath, { encoding: "utf-8" })

//         const feedlyStorage = JSON.parse(feedlyStorageJsonString) as feedlyStorage

//         return feedlyStorage
//     } catch (error) {
//         console.log(`$error reading local feedly storage`, error);
//     }
// }


