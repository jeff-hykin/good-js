import { getTraceInfo } from "./get_trace_info.js"

export function getTracePaths() {
    return getTraceInfo().slice(1).map(frame => frame.path)
}