import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/layout/site-layout";
import { STOCK_IMAGES } from "@/lib/stock-images";
import { Calendar, ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "when-to-clear-your-land",
    title: "When Is the Best Time to Clear Your Land?",
    excerpt: "Timing matters when it comes to land clearing. Learn about the best seasons and conditions for clearing your property in the Charlotte area.",
    date: "Jan 15, 2026",
    category: "Tips",
    image: STOCK_IMAGES.landClearing,
  },
  {
    slug: "forestry-mulching-vs-traditional-clearing",
    title: "Forestry Mulching vs Traditional Clearing: Which is Right for You?",
    excerpt: "Compare the pros and cons of forestry mulching versus traditional clearing methods to decide which approach works best for your property.",
    date: "Jan 8, 2026",
    category: "Education",
    image: STOCK_IMAGES.forestryMulching,
  },
  {
    slug: "preparing-lot-for-construction",
    title: "How to Prepare Your Lot for New Construction",
    excerpt: "A comprehensive guide to getting your lot ready for building, from clearing to grading and everything in between.",
    date: "Dec 20, 2025",
    category: "Guides",
    image: STOCK_IMAGES.lotClearing,
  },
  {
    slug: "storm-damage-cleanup-tips",
    title: "Storm Damage Cleanup: What Homeowners Need to Know",
    excerpt: "After a severe storm hits Charlotte, here's what you should do to safely clean up your property and file insurance claims.",
    date: "Dec 10, 2025",
    category: "Tips",
    image: STOCK_IMAGES.stormCleanup,
  },
];

export default function Blog() {
  return (
    <SiteLayout>
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" data-testid="text-blog-title">
              Blog & Resources
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg">
              Expert tips, guides, and insights about land clearing and property management.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-blog-${post.slug}`}>
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /> {post.date}
                      </span>
                    </div>
                    <h2 className="font-semibold text-lg leading-snug">{post.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                    <span className="text-sm text-primary font-medium flex items-center gap-1">
                      Read more <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
