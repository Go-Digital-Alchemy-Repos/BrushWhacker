import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function StickyQuoteButton() {
  return (
    <div className="hidden md:block fixed bottom-6 right-6 z-40" data-testid="sticky-quote-button">
      <Link href="/quote">
        <Button size="lg" className="gap-2 shadow-lg">
          Get a Quote
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
