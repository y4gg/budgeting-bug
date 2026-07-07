import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">
        Hi, this landing page is still being built
      </h1>
      <Link href={"/overview"}>Click me to visit the app</Link>
    </div>
  )
}
