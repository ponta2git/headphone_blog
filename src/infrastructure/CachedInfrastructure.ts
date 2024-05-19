import { cache } from "react"

import { getAllPostDates } from "./PostDatesRepository"

export const getAllPostDatesWithCache = cache(getAllPostDates)
