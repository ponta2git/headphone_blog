import { readdirSync } from "fs";
import { join } from "path";

export function* getAllPosts(path: string = "posts"): Generator<string> {
  const cur = readdirSync(path, { withFileTypes: true });

  for (const dirent of cur) {
    const res = join(path, dirent.name);
    if (dirent.isDirectory()) yield* getAllPosts(res);
    else {
      if (dirent.name === ".DS_Store") continue;
      yield res;
    }
  }
}
