import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold">Better Auth Demo</h1>
          <nav>
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {session.user.email}
                </span>
                <Button variant="outline" asChild>
                  <Link href="/auth/signin">ダッシュボード</Link>
                </Button>
              </div>
            ) : (
              <Button asChild>
                <Link href="/auth/signin">サインイン</Link>
              </Button>
            )}
          </nav>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              INIADのアカウントで
              <br />
              簡単にサインイン
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Better Authを使用した安全な認証システム
            </p>
            {!session && (
              <Button size="lg" asChild>
                <Link href="/auth/signin" className="flex items-center gap-2">
                  <Chrome className="h-5 w-5" />
                  Googleでサインイン
                </Link>
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">セキュア</h3>
              <p className="text-muted-foreground">
                最新のセキュリティベストプラクティスを採用
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">シンプル</h3>
              <p className="text-muted-foreground">
                直感的なUIで簡単にサインイン
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-2">高速</h3>
              <p className="text-muted-foreground">
                最適化された認証フロー
              </p>
            </div>
          </div>
        </main>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>© 2024 Better Auth Demo. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
