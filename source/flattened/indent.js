/**
 * indent
 *
 * @param arg1.string - the string to indent
 * @param arg1.by - the string to use as a form of indentation (e.g. spaces or tabs)
 * @param arg1.noLead - when true only newlines will be indented, not the first line
 * @returns {String} output
 *
 * @example
 * ```js
 *     indentedString = indent({string: "blah\n    blah\nblah", by: "\t", noLead: false })
 * ```
 */
export const indent = ({ string, by="    ", noLead=false }) => (noLead?"":by) + string.replace(/\n/g, "\n" + by)