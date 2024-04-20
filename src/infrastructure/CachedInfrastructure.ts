import { cache } from "react"

import { getAllPostDates } from "./PostDatesRepository"
import { findPostBy } from "./PostRepository"

export const findPostByWithCache = cache(findPostBy)
export const getAllPostDatesWithCache = cache(getAllPostDates)
