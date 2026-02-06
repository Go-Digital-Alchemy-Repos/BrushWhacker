import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/site-layout";
import { STOCK_IMAGES } from "@/lib/stock-images";
import { Calendar, ArrowRight, Search, BookOpen } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import type { BlogPost } from "@shared/schema";

const CATEGORIES = [
  "All", "Forestry Mulching", "Land Clearing", "Brush Removal", "Lot Clearing",
  "Storm Cleanup", "Stump Grinding", "Driveway/Trail Cutting", "Pricing",
];

const categoryImages: Record<string, string> = {
  "Forestry Mulching": STOCK_IMAGES.forestryMulching,
  "Land Clearing": STOCK_IMAGES.clearedLand,
  "Brush Removal": STOCK_IMAGES.heavyEquipment,
  "Lot Clearing": STOCK_IMAGES.clearedLand,
  "Storm Cleanup": STOCK_IMAGES.forest,
  "Stump Grinding": STOCK_IMAGES.heavyEquipment,
  "Driveway/Trail Cutting": STOCK_IMAGES.trailCutting,
  "Pricing": STOCK_IMAGES.clearedLand,
};

export default function Blog() {
  usePageMeta({
    title: "Blog & Resources | BrushWhackers Charlotte, NC",
    description: "Expert tips, guides, and insights about land clearing, brush removal, forestry mulching, and property management in the Charlotte, NC area.",
    canonicalUrl: "/blog",
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "BrushWhackers Blog",
      "description": "Expert tips and guides about land clearing, forestry mulching, and property management in Charlotte, NC.",
      "url": `${window.location.origin}/blog`,
      "publisher": {
        "@type": "Organization",
        "name": "BrushWhackers",
        "url": window.location.origin
      }
    }),
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const queryParams = new URLSearchParams();
  if (selectedCategory !== "All") queryParams.set("category", selectedCategory);
  if (search) queryParams.set("search", search);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/public/blog", selectedCategory, search],
    queryFn: () => fetch(`/api/public/blog?${queryParams.toString()}`).then(r => r.json()),
  });

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${STOCK_IMAGES.forest})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.35) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <Badge variant="secondary" className="mb-4 no-default-active-elevate bg-white/10 text-white border-white/20">
            <BookOpen className="h-3 w-3 mr-1" /> Expert Insights
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight" data-testid="text-blog-title">
            Blog & Resources
          </h1>
          <p className="mt-4 text-gray-200 max-w-2xl mx-auto text-lg">
            Expert tips, guides, and insights about land clearing and property management in Charlotte, NC.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }} />
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-blog-search"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-8 flex-wrap">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                data-testid={`button-category-${cat.toLowerCase().replace(/[\s/]+/g, "-")}`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <Card key={i}><CardContent className="p-0 h-80 animate-pulse bg-muted/30" /></Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">No articles found</p>
              <p className="text-sm text-muted-foreground mt-1">Check back soon for new content.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="overflow-hidden cursor-pointer h-full" data-testid={`card-blog-${post.slug}`}>
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={post.featuredImageUrl || categoryImages[post.category] || STOCK_IMAGES.clearedLand}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)" }} />
                    </div>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary">{post.category}</Badge>
                        {post.publishedAt && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        )}
                      </div>
                      <h2 className="font-semibold text-lg leading-snug">{post.title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <span className="text-sm text-primary font-medium flex items-center gap-1">
                        Read more <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
