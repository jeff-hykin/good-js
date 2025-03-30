/**
 * Check if string is an IP address
 * @example
 * ```js
 * console.log('true', isIpAddress("127.0.0.1"))
 * console.log('true', isIpAddress("192.168.1.1"))
 * console.log('true', isIpAddress("192.168.1.255"))
 * console.log('true', isIpAddress("255.255.255.255"))
 * console.log('true', isIpAddress("0.0.0.0"))
 * console.log('false', isIpAddress("1.1.1.01"))
 * ```
 */
export function isIpAddress(url) {
    // based on: https://stackoverflow.com/questions/5284147/validating-ipv4-addresses-with-regexp
    // NOTE: this solution is intenionally not the same as the one marked "Best for Now" 
    // because I manually reviewed the regex and don't think their "Best for Now" is the best for speed and transparency
    return !!url.match(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.){3}(25[0-5]|(2[0-4]|1\d|[1-9]|)\d)$/)
}