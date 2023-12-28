import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getAuthSession();
  console.log(session)

  const userId = session?.user?.email
  if (!userId) {
    notFound()
  }

  return <>
    {children}
  </>
}
