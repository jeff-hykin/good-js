// 
// any code that NEEDS to run before other imports should go inside of patch()
// 
function patch() {
    function fromFileUrl(url) {
        url = url instanceof URL ? url : new URL(url);
        if (Deno.build.os == "windows") {
            if (url.protocol != "file:") {
                throw new TypeError("Must be a file URL.");
            }
            let path7 = decodeURIComponent(
                url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
            ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
            if (url.hostname != "") {
                path7 = `\\\\${url.hostname}${path7}`;
            }
            return path7;
        } else {
            if (url.protocol != "file:") {
                throw new TypeError("Must be a file URL.");
            }
            return decodeURIComponent(
                url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
            );
        }
    }
    Object.defineProperty(Deno, "mainModule", {
        get() {
            const err = new Error()
            const filePaths = [...err.stack.matchAll(/^.+?(file:\/\/\/[\w\W]*?):/gm)].map(each=>each[1])
            const lastPath = filePaths.slice(-1)[0];
                if (lastPath) {
                    try {
                        if (Deno.statSync(fromFileUrl(lastPath)).isFile) {
                            return lastPath;
                        }
                    } catch (error) {
                }
            }
        }
    })
}
var codeContent = patch.toString().slice("function patch() {\n".length, -2)
console.log(`import "data:text/javascript;base64,${btoa(codeContent)}"`)