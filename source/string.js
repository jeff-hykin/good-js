module.exports = {
    capitalize: (string) => string.replace(/\b\w/g, chr=>chr.toUpperCase()),
    indent: ({string, by="    "}) => by + string.replace(/\n/g,"\n"+by),
    snakeToCamelCase: (baseName) => (baseName.toLowerCase().replace(/_/," ")).replace(/.\b\w/g, aChar=>aChar.toUpperCase()).replace(" ",""),
    varnameToTitle: (string) => string.replace(/_/," ").replace(/\b\w/g, chr=>chr.toUpperCase()),
    findAll(regexPattern, sourceString) {
        let output = []
        let match
        // make sure the pattern has the global flag
        let regexPatternWithGlobal = RegExp(regexPattern, [...new Set("g"+regexPattern.flags)].join(""))
        while (match = regexPatternWithGlobal.exec(sourceString)) {
            // get rid of the string copy
            delete match.input
            // store the match data
            output.push(match)
        } 
        return output
    },
}