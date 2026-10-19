import { Suspense } from "react"
import type { Metadata } from "next"
import { googleSignInEnabled } from "@/auth"
import { SignInCard } from "@/features/auth/components/sign-in-card"

export const metadata: Metadata = {
  title: "Sign in — La-fe Beauty Parlor",
}

export default function LoginPage() {
  return (
    // SignInCard reads `callbackUrl` via useSearchParams, which opts the route
    // into client rendering unless it sits behind a Suspense boundary.
    <Suspense>
      <SignInCard googleEnabled={googleSignInEnabled} />
    </Suspense>
  )
}
