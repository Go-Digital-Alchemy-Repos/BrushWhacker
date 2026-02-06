import { TopNav } from "./top-nav";
import { Footer } from "./footer";

interface SiteLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
}

export function SiteLayout({ children, hideNav, hideFooter }: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <TopNav />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
