import { zipTemplateArgs } from "./zip_template_args.js"

export function identityTemplateString(...args) {
    return zipTemplateArgs(...args).map(each=>`${each}`).join("")
}