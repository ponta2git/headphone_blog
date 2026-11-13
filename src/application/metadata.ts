import { site } from "../config/site";
import { postPath, publishedAt } from "../domain/posts";
import type { Post } from "../domain/posts";

export interface PageImage {
  src: string;
  width: number;
  height: number;
}

export interface PageMetadataInput {
  path: string;
  noindex?: boolean;
  title?: string;
  description?: string;
  published?: string;
  image?: PageImage;
  schema?: Record<string, unknown>;
}

const defaultImage: PageImage = {
  src: "/images/logo.webp",
  width: 512,
  height: 286,
};

/** One metadata policy for HTML, social previews and structured data. */
export function buildPageMetadata(input: PageMetadataInput) {
  const { title, published } = input;
  const description = input.description ?? site.description;
  const image = input.image ?? defaultImage;
  const canonical = new URL(input.path, site.url).href;
  const structuredData = {
    "@context": "https://schema.org",
    ...(input.schema ?? {
      "@type": title ? "CollectionPage" : "WebSite",
      name: title ?? site.name,
      description,
      url: canonical,
    }),
  };
  return {
    pageTitle: title ? `${title} | ${site.name}` : site.name,
    description,
    canonical,
    image,
    imageUrl: new URL(image.src, site.url).href,
    published,
    // JSON is embedded in a script raw-text element; a title must not close it.
    structuredData: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
  };
}

/** Publication URLs and dates are shared by article metadata and sharing links. */
export function buildArticleMetadata(
  post: Post & { excerpt: string },
  image?: PageImage,
) {
  const path = postPath(post.date);
  const url = new URL(path, site.url).href;
  const published = publishedAt(post.date);
  const page: PageMetadataInput = {
    path,
    title: post.title,
    description: post.excerpt,
    published,
    image,
    schema: {
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url,
      mainEntityOfPage: url,
      datePublished: published,
      author: { "@type": "Person", name: site.author, url: `${site.url}/` },
      image: new URL(image?.src ?? defaultImage.src, site.url).href,
    },
  };
  return {
    page,
    url,
    shareUrl: `https://twitter.com/intent/tweet?${new URLSearchParams({ text: `${post.title}: ${site.name}`, url })}`,
  };
}
