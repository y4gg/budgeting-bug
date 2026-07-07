import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Overview() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  })

  if (!session) redirect("/login")

  return <Link href="/transactions">Only transactions are functional rn</Link>
}
