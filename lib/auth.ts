import { betterAuth } from "better-auth/minimal"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/server/db"
import { passkey } from "@better-auth/passkey"
import { genericOAuth } from "better-auth/plugins"
import * as schema from "@/server/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    passkey(),
    genericOAuth({
      config: [
        {
          providerId: "hackclub",
          clientId: process.env.HACKCLUB_CLIENTID as string,
          clientSecret: process.env.HACKCLUB_SECRET as string,
          discoveryUrl:
            "https://auth.hackclub.com/.well-known/openid-configuration",
          scopes: ["openid", "profile", "email"],
        },
      ],
    }),
  ],
})
