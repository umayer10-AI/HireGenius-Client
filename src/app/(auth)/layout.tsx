import Link from "next/link";
import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-mesh">
      <div className="container-app flex min-h-screen flex-col items-center justify-center py-10">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-primary text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold">{APP_NAME}</span>
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
