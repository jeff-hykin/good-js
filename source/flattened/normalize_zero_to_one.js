import { vectorSummaryStats as stats } from "./vector_summary_stats.js"

export const normalizeZeroToOne = (values) => {
    const { min, range } = stats(values)
    // edgecase
    if (range == 0) {
        return values.map(each=>0)
    }
    return values.map(each=>(each-min)/range)
}