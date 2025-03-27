import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Static Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Header />

          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1400px] mx-auto py-4">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
