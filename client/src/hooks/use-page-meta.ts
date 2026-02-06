import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  jsonLd?: string;
}

function setMetaTag(property: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (content) {
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, property);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  } else if (el) {
    el.remove();
  }
}

function setLinkTag(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (href) {
    if (!el) {
      el = document.createElement("link");
      el.rel = rel;
      document.head.appendChild(el);
    }
    el.href = href;
  } else if (el) {
    el.remove();
  }
}

export function usePageMeta({ title, description, canonicalUrl, ogImage, ogTitle, ogDescription, jsonLd }: PageMeta) {
  useEffect(() => {
    document.title = title;
    setMetaTag("description", description);
    setLinkTag("canonical", canonicalUrl || "");
    setMetaTag("og:title", ogTitle || title, true);
    setMetaTag("og:description", ogDescription || description, true);
    setMetaTag("og:image", ogImage || "", true);
    setMetaTag("og:type", "website", true);

    let scriptEl = document.querySelector('script[data-seo-jsonld]') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.type = "application/ld+json";
        scriptEl.setAttribute("data-seo-jsonld", "true");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = jsonLd;
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      const ldScript = document.querySelector('script[data-seo-jsonld]');
      if (ldScript) ldScript.remove();
    };
  }, [title, description, canonicalUrl, ogImage, ogTitle, ogDescription, jsonLd]);
}
