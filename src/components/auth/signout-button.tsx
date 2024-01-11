"use client"

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SignOutButton() {
    return (
        <Button onClick={() => { signOut(); redirect('/') }}>Logout</Button>
    )
}
