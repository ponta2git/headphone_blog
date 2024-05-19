import { cache } from "react"

import { getAllPostDates } from "./PostDatesRepository"
import { findPostByDate } from "./PostRepository"

export const getAllPostDatesWithCache = cache(getAllPostDates)
export const findPostByDateWithCache = cache(findPostByDate)
