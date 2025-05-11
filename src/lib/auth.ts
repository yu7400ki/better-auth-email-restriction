import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "../db";
import { APIError } from "better-auth/api";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            hd: "iniad.org", // iniad.orgドメインのユーザーのみ選択肢として表示
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // メールアドレスのドメインと検証状態をチェック
                    if (!(user.emailVerified && user.email?.endsWith("@iniad.org"))) {
                        throw new APIError("BAD_REQUEST", {
                            message: "このドメインのメールアドレスは使用できません",
                        });
                    }
                },
            },
        },
    },
});
