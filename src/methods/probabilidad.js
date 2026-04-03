export function getZ(confianza) {

    let alpha = 1 - confianza / 100
    let p = 1 - alpha / 2

    const c = [2.515517, 0.802853, 0.010328]
    const d = [1.432788, 0.189269, 0.001308]

    let t = Math.sqrt(-2 * Math.log(1 - p))

    return t - ((c[0] + c[1]*t + c[2]*t*t) /
        (1 + d[0]*t + d[1]*t*t + d[2]*t*t*t))
}

function gammaLn(z) {
    const g = 7
    const c = [
        0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ]
    if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - gammaLn(1 - z)
    z -= 1
    let x = c[0]
    for (let i = 1; i < g + 2; i++) x += c[i] / (z + i)
    const t = z + g + 0.5
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x)
}

function gammainc(a, x) {
    if (x < 0) return 0
    if (x === 0) return 0
    if (x < a + 1) return gammaincSeries(a, x)
    return 1 - gammaincCF(a, x)
}

function gammaincSeries(a, x) {
    const MAX_ITER = 200
    const EPS = 1e-12
    let ap = a, sum = 1 / a, del = sum
    for (let i = 0; i < MAX_ITER; i++) {
        ap++
        del *= x / ap
        sum += del
        if (Math.abs(del) < Math.abs(sum) * EPS) break
    }
    return sum * Math.exp(-x + a * Math.log(x) - gammaLn(a))
}

function gammaincCF(a, x) {
    const MAX_ITER = 200
    const EPS = 1e-12
    const FPMIN = 1e-300
    let b = x + 1 - a, c = 1 / FPMIN, d = 1 / b, h = d
    for (let i = 1; i <= MAX_ITER; i++) {
        const an = -i * (i - a)
        b += 2
        d = an * d + b
        if (Math.abs(d) < FPMIN) d = FPMIN
        c = b + an / c
        if (Math.abs(c) < FPMIN) c = FPMIN
        d = 1 / d
        const del = d * c
        h *= del
        if (Math.abs(del - 1) < EPS) break
    }
    return Math.exp(-x + a * Math.log(x) - gammaLn(a)) * h
}

function chi2CDF(x, df) {
    return gammainc(df / 2, x / 2)
}

export function getChi2Critical(alpha, df) {
    const p = 1 - alpha 

    const z = getZ((1 - alpha) * 100)
    const a = 2 / (9 * df)
    let x = Math.max(df * Math.pow(1 - a + z * Math.sqrt(a), 3), 1e-6)

    // Newton-Raphson: x_{n+1} = x_n - (CDF(x_n) - p) / PDF(x_n)
    for (let i = 0; i < 100; i++) {
        const cdf = chi2CDF(x, df)
        // PDF de chi²: (x^(df/2-1) * e^(-x/2)) / (2^(df/2) * Gamma(df/2))
        const logPdf = (df / 2 - 1) * Math.log(x) - x / 2
            - (df / 2) * Math.log(2) - gammaLn(df / 2)
        const pdf = Math.exp(logPdf)
        const dx = (cdf - p) / pdf
        x -= dx
        if (x <= 0) x = 1e-10
        if (Math.abs(dx) < 1e-10) break
    }

    return x
}