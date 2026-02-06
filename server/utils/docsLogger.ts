import { storage } from "../storage";

interface FeatureDocInput {
  category: string;
  title: string;
  summary: string;
  endpoints?: string[];
  tables?: string[];
  frontendFiles?: string[];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function logFeatureDocumentation(input: FeatureDocInput): Promise<void> {
  const slug = slugify(input.title);
  const existing = await storage.getDocsEntryBySlug(slug);
  if (existing) {
    console.log(`[docsLogger] Doc "${input.title}" already exists (slug: ${slug}), skipping.`);
    return;
  }

  let body = `# ${input.title}\n\n## Overview\n${input.summary}\n`;

  if (input.endpoints && input.endpoints.length > 0) {
    body += `\n## APIs\n`;
    for (const ep of input.endpoints) {
      body += `- \`${ep}\`\n`;
    }
  }

  if (input.tables && input.tables.length > 0) {
    body += `\n## Database\nTables involved:\n`;
    for (const t of input.tables) {
      body += `- \`${t}\`\n`;
    }
  }

  if (input.frontendFiles && input.frontendFiles.length > 0) {
    body += `\n## Frontend Integration\nFiles:\n`;
    for (const f of input.frontendFiles) {
      body += `- \`${f}\`\n`;
    }
  }

  await storage.createDocsEntry({
    category: input.category,
    title: input.title,
    slug,
    bodyMarkdown: body,
    tags: [],
    related: [],
    version: "1.0",
    author: "system",
  });

  console.log(`[docsLogger] Created doc: "${input.title}" in category "${input.category}"`);
}
