import { Metadata } from "next";
import Bottom from "../components/Bottom";
import Navigator from "../components/Navigator";

export const metadata: Metadata = {
  title: {
    default: "Hello Pet",
    template: "%s | wesome Site",
  },
  description: "동물 관련 사이트",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigator />
      <main className="flex-grow">{children}</main>
      <Bottom />
    </div>
  );
}
