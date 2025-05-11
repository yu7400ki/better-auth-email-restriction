# Better Auth でログイン可能なメールアドレスを制限する

## はじめに

[Better Auth](https://github.com/better-auth/better-auth)は、TypeScript のための包括的な認証フレームワークです。フレームワークに依存せず、豊富な機能を提供し、プラグインエコシステムを通じて高度な機能を簡単に追加できることが特徴です。

ここでは、Better Auth を使ってログイン可能なメールアドレスを制限する方法を紹介します。

## 実装方法

Better Auth では、ログイン可能なメールアドレスを制限する方法として、次のようなものがあります。

- Before Hooks を使った実装
- Database Hooks を使った実装（OAuth の場合）

### Before Hooks を使った実装

メールアドレスとパスワードによる認証の場合、Before Hooks を使ってログイン可能なメールアドレスを制限できます。以下の実装例は、[Hooks | Better Auth](https://www.better-auth.com/docs/concepts/hooks)から引用しています。

```typescript
import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";

export const auth = betterAuth({
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // サインアップエンドポイントの場合のみチェック
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      // メールアドレスのドメインをチェック
      if (!ctx.body?.email.endsWith("@example.com")) {
        throw new APIError("BAD_REQUEST", {
          message: "Email must end with @example.com",
        });
      }
    }),
  },
});
```

### Database Hooks を使った実装（OAuth）

OAuth プロバイダーを使う場合、Database Hooks を使ってログイン可能なメールアドレスを制限できます。以下の例では、Google ログインの場合の実装を示しています。

```typescript
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";

export const auth = betterAuth({
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // メールアドレスのドメインと検証状態をチェック
          if (!(user.emailVerified && user.email?.endsWith("@example.com"))) {
            throw new APIError("BAD_REQUEST", {
              message: "Email must end with @example.com",
            });
          }
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: "YOUR_GOOGLE_CLIENT_ID",
      clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
      hd: "example.com", // このドメインのユーザーのみ選択肢として表示される
    },
  },
});
```

<details>
<summary>hdパラメーターについて</summary>

Google OAuth の`hd`パラメーターは、ホストドメインを指定するためのものです。このパラメーターを設定すると、指定したドメインのアカウントがログイン画面に表示されます。ただし、クライアントサイドのリクエストは変更可能なため、これだけではユーザー制限を実現できません。IDトークンに含まれる`hd`クレームの値を検証する必要があります。
</details>

なお、`mapProfileToUser`でメールアドレスを制限する方法も試しましたが、この方法ではエラーを throw した際にエラーページへのリダイレクトが行われませんでした。

## 注意点

この制限はサインアップ時のみに適用され、既存のユーザーには影響しません。

## 参考

- [Better Auth GitHub Repository](https://github.com/better-auth/better-auth)
- [Better Auth Hooks Documentation](https://www.better-auth.com/docs/concepts/hooks)
- [Better Auth Database Documentation](https://www.better-auth.com/docs/concepts/database)
