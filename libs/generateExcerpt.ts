const TRUNC_CHAR_COUNT = 100

export function generateExcerpt(body: string) {
  return (
    body
      //    .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
      //    .replace(/\r\n|\n|\r/g, "")
      .trim()
      .substring(0, TRUNC_CHAR_COUNT)
      .concat("……")
  )
}
