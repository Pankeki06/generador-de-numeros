export function getZ(confianza) {

            let alpha = 1 - confianza / 100
            let p = 1 - alpha / 2

            const c = [2.515517, 0.802853, 0.010328]
            const d = [1.432788, 0.189269, 0.001308]

            let t = Math.sqrt(-2 * Math.log(1 - p))

            return t - ((c[0] + c[1]*t + c[2]*t*t) /
                (1 + d[0]*t + d[1]*t*t + d[2]*t*t*t))
        }

export function getChi2Critical(alpha, df){ 
    const z = getZ(alpha) 
    const a = 2 / (9 * df) 
    const base = 1 - a + z * Math.sqrt(a) 
    return df * Math.pow(base, 3) 
}