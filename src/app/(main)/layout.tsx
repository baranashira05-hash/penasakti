import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ServiceWorkerRegister from "@/components/shared/ServiceWorkerRegister";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 pb-16 lg:pb-0 min-w-0 overflow-x-hidden">{children}</main>
      <Footer />
      <MobileBottomNav />
      <ServiceWorkerRegister />
    </div>
  );
}
