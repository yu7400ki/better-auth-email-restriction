# Better Auth でログイン可能なドメインを制限する

## はじめに

[Better Auth](https://github.com/better-auth/better-auth)は、TypeScript のための包括的な認証フレームワークです。フレームワークに依存せず、豊富な機能を提供し、プラグインエコシステムを通じて高度な機能を簡単に追加できることが特徴です。

ここでは、Better Auth を使って特定のドメインのメールアドレスでのみログインを許可する方法を説明します。

## 実装方法

Better Auth では、ドメイン制限を実装する方法として、次のようなものがあります。

- Before Hook を使った実装
- Database Hooks を使った実装（OAuth の場合）

### Before Hook を使った実装

メールアドレスとパスワードによる認証の場合、Before Hook を使ってドメイン制限を実装できます。以下の実装例は、[Better Auth の Hooks 機能のドキュメント](https://www.better-auth.com/docs/concepts/hooks)から引用しています。

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
          message: "このドメインのメールアドレスは使用できません",
        });
      }
    }),
  },
});
```

### Database Hooks を使った実装（OAuth）

OAuth プロバイダーを使う場合、Database Hooks を使ってドメイン制限を実装できます。以下の例では、Google ログインの場合の実装を示しています。

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
              message: "このドメインのメールアドレスは使用できません",
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

なお、`mapProfileToUser`でドメイン制限を実装する方法も試しましたが、この方法ではエラーを throw した際にエラーページへのリダイレクトが行われませんでした。

## 注意点

この制限はサインアップ時のみに適用され、既存のユーザーには影響しません。また、OAuth プロバイダーによっては、メールアドレスの取得に追加のスコープ設定が必要になることもあります。

## 参考文献

- [Better Auth GitHub Repository](https://github.com/better-auth/better-auth)
- [Better Auth Hooks Documentation](https://www.better-auth.com/docs/concepts/hooks)
- [Better Auth Database Documentation](https://www.better-auth.com/docs/concepts/database)
