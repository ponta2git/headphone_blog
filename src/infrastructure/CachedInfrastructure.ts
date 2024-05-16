import { cache } from "react"

import { getAllPostDates } from "./PostDatesRepository"
import { findPostBy } from "./PostRepository"
import { getPostsByTags } from "./PostRepository"

export const findPostByWithCache = cache(findPostBy)
export const getPostsByTagsWithCache = cache(getPostsByTags)
export const getAllPostDatesWithCache = cache(getAllPostDates)
