"use server"

export async function sendToZapier<T>(formObj: T) {
    const response = await fetch("https://hooks.zapier.com/hooks/catch/19204449/22t5eep/", {
        method: 'POST',
        body: JSON.stringify(formObj),
        headers: {
            'Content-Type': 'application/json'
        },
    })

    console.log(`$response`, JSON.stringify(response));
}

