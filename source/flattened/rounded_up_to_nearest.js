export const roundedUpToNearest = ({value, factor}) => {
    factor = Math.abs(factor)
    const remainder = (value % factor)
    if (value > 0) {
        return remainder ? value + (factor - remainder) : value
    } else {
        return remainder ? value - remainder : value
    }
}