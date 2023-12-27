import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

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
    1
    <section>{children}</section>
    2
  </>
}
