import { createFileRoute } from "@tanstack/react-router";
import { IsisApp } from "@/components/isis/App";

const title = "ISIS — Understand. Protect. Restore.";
const description =
  "ISIS turns health information into personalized action: it understands your documents, adapts to how you prefer to understand, and helps you follow through.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IsisApp,
});
