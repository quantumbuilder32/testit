"use client"
import { toast } from "react-hot-toast";

export function logAndToast(name: string, data: unknown, isError = true, extraInfo = " more info available in console") {
    if (isError) {
        toast.error(`${name}${extraInfo}`)
    } else {
        toast.success(name)
    }

    console.log(`${name} `, data);
}