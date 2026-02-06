import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/layout/site-layout";
import { ArrowLeft, Calendar } from "lucide-react";

const posts: Record<string, { title: string; date: string; category: string; content: string }> = {
  "when-to-clear-your-land": {
    title: "When Is the Best Time to Clear Your Land?",
    date: "Jan 15, 2026",
    category: "Tips",
    content:
      "Land clearing timing depends on several factors including weather, soil conditions, and local regulations. In the Charlotte, NC area, late fall through early spring is often ideal. The ground is firmer, vegetation is dormant, and wildlife nesting seasons are avoided.\n\nDry periods are preferred because heavy equipment works better on firm ground. Wet conditions can cause rutting and soil compaction. However, for forestry mulching, a light freeze can actually make the work easier.\n\nAlways check with your local county for any burn bans or clearing restrictions before starting your project. Our team at BrushWhackers can help you navigate permitting and timing for the best results.",
  },
  "forestry-mulching-vs-traditional-clearing": {
    title: "Forestry Mulching vs Traditional Clearing: Which is Right for You?",
    date: "Jan 8, 2026",
    category: "Education",
    content:
      "When it comes to clearing land, there are two primary methods: forestry mulching and traditional clearing. Each has its advantages depending on your goals.\n\nForestry mulching uses a single machine to cut, grind, and clear vegetation in one pass. The mulched material stays on-site, providing natural erosion control and returning nutrients to the soil. It's faster, more eco-friendly, and often more cost-effective for moderate vegetation.\n\nTraditional clearing involves multiple machines and steps: cutting, pushing, burning or hauling, and sometimes grinding stumps separately. It's better for heavy timber and when you need a completely clean surface for construction.\n\nAt BrushWhackers, we assess each property individually and recommend the method that best fits your needs, budget, and timeline.",
  },
  "preparing-lot-for-construction": {
    title: "How to Prepare Your Lot for New Construction",
    date: "Dec 20, 2025",
    category: "Guides",
    content:
      "Preparing a lot for construction involves more than just removing trees. Here's a step-by-step overview.\n\nFirst, get a survey done to know your exact property boundaries and setback requirements. Next, check with your county for any tree ordinances or clearing permits required.\n\nThe clearing process typically includes removing all vegetation, grinding stumps, and initial rough grading. If the lot has significant slope, you may need additional earthwork.\n\nDrainage is critical - plan for how water will flow during and after construction. Finally, make sure access roads are established for construction equipment.\n\nBrushWhackers handles all aspects of lot preparation and works closely with builders and developers throughout the Charlotte area.",
  },
  "storm-damage-cleanup-tips": {
    title: "Storm Damage Cleanup: What Homeowners Need to Know",
    date: "Dec 10, 2025",
    category: "Tips",
    content:
      "Charlotte and the surrounding areas are no stranger to severe storms. When a storm damages your property, safety comes first.\n\nStay away from downed power lines and unstable trees. Document all damage with photos and videos for your insurance company. Contact your insurance provider as soon as possible to start a claim.\n\nFor tree removal, always hire a professional. Chainsaws and heavy branches are extremely dangerous without proper training and equipment. Our team at BrushWhackers provides emergency storm cleanup services with rapid response times.\n\nWe also help with insurance documentation, providing detailed reports and photos of the damage and cleanup process to support your claim.",
  },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts[slug || ""];

  if (!post) {
    return (
      <SiteLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold" data-testid="text-post-not-found">Post Not Found</h1>
          <p className="mt-3 text-muted-foreground">This blog post doesn't exist yet.</p>
          <Link href="/blog">
            <Button variant="outline" className="mt-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" /> {post.date}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight" data-testid="text-post-title">
            {post.title}
          </h1>
          <div className="mt-8 prose prose-slate dark:prose-invert max-w-none" data-testid="text-post-content">
            {post.content.split("\n\n").map((p, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t">
            <h3 className="font-semibold">Need help with your property?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Get a free quote from BrushWhackers today.
            </p>
            <Link href="/quote">
              <Button className="mt-4" data-testid="blog-cta-quote">Get a Free Quote</Button>
            </Link>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
