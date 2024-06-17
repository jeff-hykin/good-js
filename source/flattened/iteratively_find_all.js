export function* iterativelyFindAll(regexPattern, sourceString) {
    var match
    // auto-add global flag while keeping others as-is
    const regexPatternWithGlobal = regexPattern.global ? regexPattern : RegExp(regexPattern, regexPattern.flags+"g")
    while (match = regexPatternWithGlobal.exec(sourceString)) {
        // store the match data
        yield match
        // zero-length matches will end up in an infinite loop, so increment by one char after a zero-length match is found
        if (match[0].length == 0) {
            regexPatternWithGlobal.lastIndex += 1
        }
    }
}