import { DashboardHeader } from "@/components/dashboard-layout/header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  if (!session) {
    redirect('/')
  }

  return (
    <>
      <DashboardHeader />

      <main className="mx-auto p-8">
        {children}
      </main>
    </>
  )
}
