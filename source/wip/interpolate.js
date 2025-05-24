export function splineInterpolation(points) {
    if (points.length < 2) {
        throw new Error("At least two points are required")
    }
    points = points.slice().sort((a, b) => a[0] - b[0])
    const n = points.length
    const xs = points.map((p) => p[0])
    const ys = points.map((p) => p[1])
    const h = new Array(n - 1)
    for (let i = 0; i < n - 1; i++) {
        h[i] = xs[i + 1] - xs[i]
        if (h[i] === 0) throw new Error("Two points have the same x value")
    }
    const alphas = new Array(n - 1).fill(0)
    for (let i = 1; i < n - 1; i++) {
        alphas[i] = (3 / h[i]) * (ys[i + 1] - ys[i]) - (3 / h[i - 1]) * (ys[i] - ys[i - 1])
    }
    const l = new Array(n).fill(0)
    const mu = new Array(n).fill(0)
    const z = new Array(n).fill(0)
    l[0] = 1
    mu[0] = 0
    z[0] = 0
    for (let i = 1; i < n - 1; i++) {
        l[i] = 2 * (xs[i + 1] - xs[i - 1]) - h[i - 1] * mu[i - 1]
        mu[i] = h[i] / l[i]
        z[i] = (alphas[i] - h[i - 1] * z[i - 1]) / l[i]
    }
    l[n - 1] = 1
    z[n - 1] = 0
    const c = new Array(n).fill(0)
    const b = new Array(n - 1).fill(0)
    const d = new Array(n - 1).fill(0)
    for (let j = n - 2; j >= 0; j--) {
        c[j] = z[j] - mu[j] * c[j + 1]
        b[j] = (ys[j + 1] - ys[j]) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3
        d[j] = (c[j + 1] - c[j]) / (3 * h[j])
    }
    return function (x) {
        let i
        let low = 0
        let high = n - 1
        if (x <= xs[0]) {
            i = 0
            const slope = b[0]
            return ys[0] + slope * (x - xs[0])
        } else if (x >= xs[n - 1]) {
            i = n - 2
            const hVal = xs[i + 1] - xs[i]
            const slope = b[i] + 2 * c[i] * hVal + 3 * d[i] * hVal * hVal
            return ys[n - 1] + slope * (x - xs[n - 1])
        } else {
            while (low <= high) {
                const mid = Math.floor((low + high) / 2)
                if (xs[mid] <= x && x <= xs[mid + 1]) {
                    i = mid
                    break
                }
                if (xs[mid] < x) low = mid + 1
                else high = mid - 1
            }
            const dx = x - xs[i]
            return ys[i] + b[i] * dx + c[i] * dx * dx + d[i] * dx * dx * dx
        }
    }
}

/**
 * @example
 * ```js
 * const points = [
 *     { x: 1000000, y: 0.1 },
 *     { x: 100000, y: 0.62 },
 *     { x: 10000, y: 2.63 },
 *     { x: 1000, y: 2.73 },
 *     { x: 100, y: 2 },
 *     { x: 10, y: 1.4 },
 *     { x: 1, y: 1 },
 * ]
 * const splineCurve = logSpline(points, { xLogBase: 10 })
 * splineCurve(100_000)
 * ```
 */
export function logSpline(points, { xLogBase = null, yLogBase = null } = {}) {
    let xTransform = (x) => x
    let yTransform = (y) => y
    if (Number.isFinite(xLogBase) && xLogBase > 1) {
        xTransform = (x) => Math.log(x) / Math.log(xLogBase)
        points = points.map((each) => ({ x: Math.log(each.x) / Math.log(xLogBase), y: each.y }))
    }
    if (Number.isFinite(yLogBase) && yLogBase > 1) {
        yTransform = (y) => Math.pow(y, yLogBase)
        points = points.map((each) => ({ x: each.x, y: Math.log(each.y) / Math.log(yLogBase) }))
    }
    const func = splineInterpolation(points.map((each) => [each.x, each.y]))
    return (x) => yTransform(func(xTransform(x)))
}