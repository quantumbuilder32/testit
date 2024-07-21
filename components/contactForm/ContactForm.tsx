"use client"
import React, { useState, FormEvent } from 'react'
import styles from "./styles.module.css"
import { toast } from 'react-hot-toast'
import Z from "zod"
import TextInput from '../textInput/TextInput'
import TextAreaInput from '../textAreaInput/TextAreaInput'
import { sendToZapier } from '@/serverFunctions/handleSendToZapier'

const userFormSchema = Z.object({
    firstKeyword: Z.string().min(1),
    secondKeyword: Z.string().min(1),
})

type userForm = Z.infer<typeof userFormSchema>

export default function ContactForm() {
    const initialForm: userForm = {
        firstKeyword: "",
        secondKeyword: "",
    }

    const [formObj, formObjSet] = useState<userForm>({ ...initialForm })

    type userFormKey = keyof userForm

    type moreFormInfo = Partial<{
        [key in userFormKey]: {
            label?: string,
            placeHolder?: string,
            type?: "input" | "textArea",
            required?: boolean
        }
    }>

    const [moreFormInfoObj,] = useState<moreFormInfo>({
        // f: {
        //     label: "Content You'd like to make",
        //     type: "textArea",
        //     placeHolder: "What kind of content would you like to make on tiktok"
        // },
    })

    const [formErrors, formErrorsSet] = useState<Partial<{
        [key in userFormKey]: string
    }>>({})

    function checkIfValid(seenFormObj: userForm, seenName: keyof userForm, schema: any) {
        const testSchema = schema.pick({ [seenName]: true }).safeParse(seenFormObj);

        if (testSchema.success) {//worked
            formErrorsSet(prevObj => {
                const newObj = { ...prevObj }
                delete newObj[seenName]
                return newObj
            })

        } else {
            formErrorsSet(prevObj => {
                const newObj = { ...prevObj }

                let errorMessage = ""

                JSON.parse(testSchema.error.message).forEach((eachErrorObj: any) => {
                    errorMessage += ` ${eachErrorObj.message}`
                })

                newObj[seenName] = errorMessage

                return newObj
            })
        }
    }

    const handleSubmit = async () => {
        try {
            if (!userFormSchema.safeParse(formObj).success) return toast.error("Form not valid")

            await sendToZapier(formObj)

            toast.success("Sent!")

            formObjSet({ ...initialForm })
        } catch (error) {
            toast.error("Couldn't send")
            console.log(`$error sending`, error);
        }
    }

    return (
        <form action={handleSubmit} className={styles.formDiv}>
            {Object.entries(formObj).map(eachEntry => {
                const eachKey = eachEntry[0] as userFormKey

                let label: string = `${eachKey.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, char => char.toUpperCase())}`; //name or intro
                let placeHolder = `Please Enter ${eachKey.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, char => char.toUpperCase())}`;

                let type: "input" | "textArea" = "input"
                let required = true

                const seenMoreInfo = moreFormInfoObj[eachKey]

                if (seenMoreInfo !== undefined) {
                    if (seenMoreInfo.label !== undefined) {
                        label = seenMoreInfo.label
                    }

                    if (seenMoreInfo.placeHolder !== undefined) {
                        placeHolder = seenMoreInfo.placeHolder
                    }

                    if (seenMoreInfo.type !== undefined) {
                        type = seenMoreInfo.type
                    }

                    if (seenMoreInfo.required !== undefined) {
                        required = seenMoreInfo.required
                    }
                }

                return (
                    <React.Fragment key={eachKey}>
                        {type === "input" && (
                            <TextInput
                                label={label === undefined ? undefined : `${label}${required ? "" : " (optional)"}`}
                                name={eachKey}
                                value={formObj[eachKey] ?? ""}
                                placeHolder={placeHolder}
                                onChange={e => {
                                    formObjSet(prevObj => {
                                        // @ts-ignore
                                        prevObj[eachKey] = e.target.value

                                        return { ...prevObj }
                                    })
                                }}
                                onBlur={() => {
                                    checkIfValid(formObj, eachKey, userFormSchema)
                                }}
                                errors={formErrors[eachKey]}
                            />
                        )}

                        {type === "textArea" && (
                            <TextAreaInput
                                label={label === undefined ? undefined : `${label}${required ? "" : " (optional)"}`}
                                name={eachKey}
                                value={formObj[eachKey] ?? ""}
                                placeHolder={placeHolder}
                                onInput={e => {
                                    formObjSet(prevObj => {
                                        // @ts-ignore
                                        prevObj[eachKey] = e.target.value

                                        return { ...prevObj }
                                    })
                                }}
                                onBlur={() => { checkIfValid(formObj, eachKey, userFormSchema) }}
                                errors={formErrors[eachKey]}
                            />
                        )}
                    </React.Fragment>
                )
            })}

            <button disabled={!userFormSchema.safeParse(formObj).success} type='submit' style={{ justifySelf: "flex-end", opacity: !userFormSchema.safeParse(formObj).success ? ".6" : "", backgroundColor: "var(--primaryColor)", padding: '1rem 2rem', borderRadius: ".2rem", marginTop: '1rem' }}>Send Message</button>
        </form>
    )
}
