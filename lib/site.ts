import { site } from "@/content/site";
import {
  formatIssues,
  siteSettingsSchema,
  type SiteSettings,
} from "@/lib/schema";

/**
 * Validated site content. `content/site.ts` is authored by hand and typed with
 * `satisfies`, but runtime validation catches the cases types can't — an
 * empty string, an over-long value statement, a malformed email.
 */
function loadSite(): SiteSettings {
  const parsed = siteSettingsSchema.safeParse(site);

  if (!parsed.success) {
    throw new Error(
      formatIssues(parsed.error, "Invalid content in content/site.ts"),
    );
  }

  return parsed.data;
}

export const siteSettings = loadSite();
