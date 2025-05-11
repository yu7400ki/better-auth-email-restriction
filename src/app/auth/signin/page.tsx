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

export default function SignInPage() {
  const [session, setSession] = useState<CurrentSession | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {data: currentSession} = await authClient.getSession();
      setSession(currentSession);
    };
    checkSession();
  }, []);

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    setSession(null);
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
          {session?.user ? (
            <div className="space-y-4">
              <div className="text-sm">
                <p>ログイン中: {session.user.email}</p>
                <p>名前: {session.user.name}</p>
                {session.user.image && (
                  <img
                    src={session.user.image}
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
