"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck, MailWarning } from "lucide-react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const SignInSchema = z.object({
    email: z.string().email()
})

type SignInSchemaType = z.infer<typeof SignInSchema>;

export default function SubscribeForm() {

    const form = useForm<SignInSchemaType>({
        resolver: zodResolver(SignInSchema)
    })

    const { handleSubmit,
        register,
        setError,
        formState: { isSubmitting, isSubmitSuccessful, errors },
    } = form;

    const signWithEmail = async (data: SignInSchemaType) => {
        var response = await signIn('email', { email: data.email, redirect: false });
        if (!response?.ok) {
            setError("root.serverError", { type: "custom", message: "Error to send mail" })
        }
    }

    return (
        <>
            <form noValidate className="flex space-x-2" onSubmit={handleSubmit(signWithEmail)}>
                <Input placeholder="Enter your email" type="email" {...register('email')} />
                <Button type="submit" disabled={isSubmitting} >
                    {isSubmitting && <Loader2 className="animate-spin -ml-1 mr-3" />}
                    Sign In
                </Button>
            </form>

            {isSubmitSuccessful && !isSubmitting &&
                <p className="animate-wiggle text-green-700 font-semibold">
                    <MailCheck className="inline mr-2" />Check your mail to sign in
                </p>}

            {errors.root?.serverError &&
                <p className="animate-wiggle text-red-700 font-semibold">
                    <MailWarning className="inline mr-2" /> {errors.root?.serverError.message}
                </p>}
        </>
    )
}
