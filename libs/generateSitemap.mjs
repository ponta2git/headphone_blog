import { basename, join } from "path";
import { readdirSync, writeFileSync } from "fs";

function* getAllPosts(path) {
  const cur = readdirSync(path, { withFileTypes: true });

  for (const dirent of cur) {
    const res = join(path, dirent.name);
    if (dirent.isDirectory()) yield* getAllPosts(res);
    else yield res;
  }
}

const addIndex = () => {
  const jpDateString = new Date().toLocaleDateString({timezone: "Asia/Tokyo"});
  const date = new Date(jpDateString);

  return (
    "<url>" +
    `<loc>https://ponta-headphone.net/</loc>` +
    `<lastmod>${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}</lastmod>` +
    "</url>"
  );
}

const addPost = (fileName) => {
  const date = basename(fileName, ".mdx");
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);

  return (
    "<url>" +
    `<loc>https://ponta-headphone.net/posts/${date}</loc>` +
    `<lastmod>${year}-${month}-${day}</lastmod>` +
    "</url>"
  );
};

export const generateSitemap = () => {
  const posts = [];

  for (const postPath of getAllPosts('posts')) {
    posts.push(postPath);
  }

  const sitemap =
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    addIndex() +
    `\n` +
    posts.map(addPost).join("\n") +
    "\n</urlset>\n";

  writeFileSync("public/sitemap.xml", sitemap);
};
