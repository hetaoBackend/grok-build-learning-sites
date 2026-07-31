import type { Metadata } from "next";
import { headers } from "next/headers";
import { LearningShell } from "../components/LearningShell";
import { ProgressProvider } from "../components/ProgressProvider";
import "./globals.css";

const baseMetadata: Metadata = {
  title: { default: "grok-build 源码学习驾驶舱", template: "%s · grok-build 源码学习" },
  description: "把 grok-build 的 77 个 crate，转化成六个可操作、可追溯到源码的中文学习专题。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = new URL("/og.png", `${protocol}://${host}`).toString();

  return {
    ...baseMetadata,
    openGraph: {
      title: "grok-build 源码学习驾驶舱",
      description: "把一次 Turn 拆开来看。",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "grok-build 源码学习驾驶舱执行路径" }],
    },
    twitter: { card: "summary_large_image", title: "grok-build 源码学习驾驶舱", description: "把一次 Turn 拆开来看。", images: [imageUrl] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <ProgressProvider><LearningShell>{children}</LearningShell></ProgressProvider>
      </body>
    </html>
  );
}
