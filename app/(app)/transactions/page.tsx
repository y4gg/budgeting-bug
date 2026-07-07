import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Overview() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/login")

  return (
    <div>
      <h1>Transactions</h1>
      <p>Welcome, {session.user.email}</p>
    </div>
  )
}
