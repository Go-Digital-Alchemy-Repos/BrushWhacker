import { TopNav } from "./top-nav";
import { Footer } from "./footer";
import { StickyQuoteButton } from "@/components/sticky-quote-button";

interface SiteLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  hideStickyQuote?: boolean;
}

export function SiteLayout({ children, hideNav, hideFooter, hideStickyQuote }: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <TopNav />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
      {!hideStickyQuote && <StickyQuoteButton />}
    </div>
  );
}
