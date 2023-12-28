"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
// import { calSans } from "@/app/fonts";

export default function LoginForm({ session }: { session: Session | null }) {

    if (!session) return null;

    const signId = async () => {
        var response = await signIn('email', { email: 'franck.martin12@hotmail.com', redirect: false });
        console.log(response);
    }

    if (session) {
        return (
            <>
                Signed in as {session?.user?.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signId()}>Sign in</button>
        </>
    )
}
