import { Link } from "wouter";
import { TreePine, Phone, Mail, MapPin } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

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
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-card border-t" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2" data-testid="footer-logo">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.companyName} className="h-7 w-7 object-contain" />
              ) : (
                <TreePine className="h-7 w-7 text-primary" />
              )}
              <span className="text-lg font-bold tracking-tight">
                {settings.companyName === "BrushWhackers" ? (
                  <>Brush<span className="text-primary">Whackers</span></>
                ) : (
                  settings.companyName
                )}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional land clearing and brush removal services serving the greater {settings.serviceArea}.
            </p>
            {(settings.socialFacebook || settings.socialInstagram || settings.socialYoutube || settings.socialGoogle) && (
              <div className="flex items-center gap-3 pt-1">
                {settings.socialFacebook && (
                  <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm" data-testid="link-social-facebook">Facebook</a>
                )}
                {settings.socialInstagram && (
                  <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm" data-testid="link-social-instagram">Instagram</a>
                )}
                {settings.socialYoutube && (
                  <a href={settings.socialYoutube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm" data-testid="link-social-youtube">YouTube</a>
                )}
                {settings.socialGoogle && (
                  <a href={settings.socialGoogle} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm" data-testid="link-social-google">Google</a>
                )}
              </div>
            )}
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
                <span data-testid="text-footer-phone">{settings.phone}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span data-testid="text-footer-email">{settings.email}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span data-testid="text-footer-service-area">{settings.serviceArea}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Serving {settings.serviceArea}
          </p>
        </div>
      </div>
    </footer>
  );
}
