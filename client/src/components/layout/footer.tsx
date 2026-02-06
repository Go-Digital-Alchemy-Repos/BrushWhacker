import { Link } from "wouter";
import { TreePine, Phone, Mail, MapPin } from "lucide-react";

const serviceLinks = [
  { label: "Land Clearing", href: "/services/land-clearing" },
  { label: "Brush Removal", href: "/services/brush-removal" },
  { label: "Forestry Mulching", href: "/services/forestry-mulching" },
  { label: "Lot Clearing", href: "/services/lot-clearing" },
  { label: "Stump Grinding", href: "/services/stump-grinding" },
  { label: "Driveway & Trail Cutting", href: "/services/driveway-trail-cutting" },
  { label: "Storm Cleanup", href: "/services/storm-cleanup" },
];

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Get a Quote", href: "/quote" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2" data-testid="footer-logo">
              <TreePine className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold tracking-tight">
                Brush<span className="text-primary">Whackers</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional land clearing and brush removal services serving the greater Charlotte, North Carolina area.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    data-testid={`footer-link-${link.href.split("/").pop()}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>(704) 555-0123</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>info@brushwhackers.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>Charlotte, NC & Surrounding Areas</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BrushWhackers. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Serving Charlotte, NC & surrounding areas
          </p>
        </div>
      </div>
    </footer>
  );
}
