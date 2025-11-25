import React from "react";

type JsonLdProps = {
  data: unknown;
};

/**
 * Renders a JSON-LD script tag with the provided schema object.
 * Safe to use in Server Components.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export default JsonLd;
