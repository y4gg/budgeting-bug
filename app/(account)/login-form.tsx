"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

export function LoginForm({
  className,
  mode = "login",
  ...props
}: React.ComponentProps<"div"> & {
  mode?: "login" | "register"
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const isRegister = mode === "register"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const name = String(formData.get("name") ?? "")

    const response = isRegister
      ? await authClient.signUp.email({
          email,
          name,
          password,
          callbackURL: "/overview",
        })
      : await authClient.signIn.email({
          email,
          password,
          callbackURL: "/overview",
        })

    setIsPending(false)

    if (response.error) {
      setError(response.error.message ?? "Something went wrong.")
      return
    }

    router.push("/overview")
    router.refresh()
  }

  async function handleOAuthSignIn() {
    setError(null)
    setIsPending(true)

    const response = await authClient.signIn.social({
      provider: "hackclub",
      callbackURL: "/overview",
      errorCallbackURL: isRegister ? "/register" : "/login",
    })

    setIsPending(false)

    if (response.error) {
      setError(response.error.message ?? "Something went wrong.")
      return
    }

    if (response.data?.url) {
      window.location.href = response.data.url
      return
    }

    router.push("/overview")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isRegister ? "Create your account" : "Login to your account"}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? "Enter your details below to create your account"
              : "Enter your email below to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {isRegister && (
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                  />
                </Field>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {!isRegister && (
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  minLength={8}
                  required
                />
              </Field>
              {error && <FieldError>{error}</FieldError>}
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending
                    ? "Please wait..."
                    : isRegister
                      ? "Create account"
                      : "Login"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isPending}
                  onClick={handleOAuthSignIn}
                >
                  Continue with Hack Club
                </Button>
                <FieldDescription className="text-center">
                  {isRegister ? (
                    <>
                      Already have an account? <Link href="/login">Login</Link>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <Link href="/register">Sign up</Link>
                    </>
                  )}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
