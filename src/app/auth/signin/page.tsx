"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Chrome } from "lucide-react";
import { useEffect, useState } from "react";
import type { Session, User } from "better-auth";

type CurrentSession = {
    user: User;
    session: Session;
};

type AuthState = {
  state: "loading";
} | {
  state: "authenticated";
  session: CurrentSession;
} | {
  state: "unauthenticated";
};

export default function SignInPage() {
  const [authState, setAuthState] = useState<AuthState>({ state: "loading" });

  useEffect(() => {
    if (authState.state !== "loading") return;

    const checkSession = async () => {
      try {
        const { data: currentSession } = await authClient.getSession();
        if (currentSession) {
          setAuthState({
            state: "authenticated",
            session: currentSession,
          });
        } else {
          setAuthState({ state: "unauthenticated" });
        }
      } catch (error) {
        console.error("セッションの取得に失敗しました:", error);
        setAuthState({ state: "unauthenticated" });
      }
    };
    checkSession();
  }, [authState]);

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    setAuthState({ state: "unauthenticated" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>サインイン</CardTitle>
          <CardDescription>
            iniad.orgのアカウントでサインインしてください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authState.state === "loading" ? (
            <div className="text-center text-sm text-muted-foreground">
              読み込み中...
            </div>
          ) : authState.state === "authenticated" ? (
            <div className="space-y-4">
              <div className="text-sm">
                <p>ログイン中: {authState.session.user.email}</p>
                <p>名前: {authState.session.user.name}</p>
                {authState.session.user.image && (
                  <img
                    src={authState.session.user.image}
                    alt="プロフィール画像"
                    className="w-10 h-10 rounded-full mt-2"
                  />
                )}
              </div>
              <Button
                className="w-full"
                onClick={handleSignOut}
              >
                サインアウト
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Googleでサインイン
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
