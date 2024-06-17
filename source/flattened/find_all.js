export const findAll = (regexPattern, sourceString) => {
    var output = []
    var match
    // auto-add global flag while keeping others as-is
    var regexPatternWithGlobal = regexPattern.global ? regexPattern : RegExp(regexPattern, regexPattern.flags+"g")
    while (match = regexPatternWithGlobal.exec(sourceString)) {
        // store the match data
        output.push(match)
        // zero-length matches will end up in an infinite loop, so increment by one char after a zero-length match is found
        if (match[0].length == 0) {
            regexPatternWithGlobal.lastIndex += 1
        }
    }
    return output
}