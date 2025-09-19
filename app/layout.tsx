import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Hello Pet",
    template: "%s | Awesome Site",
  },
  description: "동물 관련 사이트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className="flex flex-col min-h-screen">
                <main className="flex-grow">{children}</main>
            </body>
        </html>
    );
}
