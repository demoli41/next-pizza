import type { Metadata } from "next";
import { Header } from "@/shared/components/shared/header";
import { Suspense } from "react";




export const metadata: Metadata = {
  title: "Pizza House | Головна",
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen">
      <Suspense>
        <Header className="pl-4 xl:pl-0" />
      </Suspense>
      {children}
      {modal}
    </main>
  );
}
