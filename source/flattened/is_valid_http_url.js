/**
 * chek for valid http url
 * @example
 * ```js
 * console.log('false, was:', isValidHttpURL("www.google.com"),"www.google.com")
 * console.log('false, was:', isValidHttpURL("file:///Users/jeffhykin/repos/good-js/source/flattened/is_valid_url.js"),"file:///Users/jeffhykin/repos/good-js/source/flattened/is_valid_url.js")
 * console.log('true, was:', isValidHttpURL("http://www.google.com"),"http://www.google.com")
 * console.log('true, was:', isValidHttpURL("https://正妹.香港/正妹"),"https://正妹.香港/正妹")
 * console.log('true, was:', isValidHttpURL("http://正妹.香港/"),"http://正妹.香港/")
 * console.log('true, was:', isValidHttpURL("http://localhost:8000/"),"http://localhost:8000/")
 * console.log('true, was:', isValidHttpURL("http://res.cloudinary.com/hrscywv4p/image/upload/c_fill,g_faces:center,h_128,w_128/yflwk7vffgwyyenftkr7.png"),"http://res.cloudinary.com/hrscywv4p/image/upload/c_fill,g_faces:center,h_128,w_128/yflwk7vffgwyyenftkr7.png")
 * console.log('true, was:', isValidHttpURL("http://12.23.12.23:8080/example"),"http://12.23.12.23:8080/example")
 * console.log('true, was:', isValidHttpURL("http://12.23.12.23:8080/"),"http://12.23.12.23:8080/")
 * console.log('true, was:', isValidHttpURL("http://12.23.12.23"),"http://12.23.12.23")
 * console.log('false, was:', isValidHttpURL("http://12.23.12.23:"),"http://12.23.12.23:")
 * console.log('false, was:', isValidHttpURL("...and"),"...and")
 * // note: below arguably not a valid url since some browsers will truncate the url to 2083 chars, and this method intentionally doesn't check for that
 * console.log('true, was:', isValidHttpURL("http://www.google.com/too_long"+("_").repeat(3000)),"http://www.google.com/too_long[3000 chars]")
 * console.log('false, was:', isValidHttpURL("mailto:somebody@google.com"),"mailto:somebody@google.com")
 * console.log('false, was:', isValidHttpURL("somebody@google.com"),"somebody@google.com")
 * console.log('false, was:', isValidHttpURL("www.url-with-querystring.com/?url=has-querystring"),"www.url-with-querystring.com/?url=has-querystring")
 * ```
 */
export function isValidHttpURL(string) {
    // based on: https://github.com/validatorjs/validator.js
    // NOTE: 
    if (!string.startsWith("http")) {
        return false
    }
    return pattern.test(string)
}
const pattern = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i') 