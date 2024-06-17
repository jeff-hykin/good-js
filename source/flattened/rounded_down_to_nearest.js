import { roundedUpToNearest } from "./rounded_up_to_nearest.js"

export const roundedDownToNearest = ({value, factor}) => {
    factor = Math.abs(factor)
    const remainder = (value % factor)
    if (remainder == 0) {
        return value
    }
    return roundedUpToNearest({ value: (value - factor), factor })
}