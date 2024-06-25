var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// https://deno.land/std@0.128.0/_util/os.ts
var osType = (() => {
  const { Deno } = globalThis;
  if (typeof Deno?.build?.os === "string") {
    return Deno.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win") ?? false) {
    return "windows";
  }
  return "linux";
})();
var isWindows = osType === "windows";

// https://deno.land/std@0.128.0/path/win32.ts
var win32_exports = {};
__export(win32_exports, {
  basename: () => basename,
  delimiter: () => delimiter,
  dirname: () => dirname,
  extname: () => extname,
  format: () => format,
  fromFileUrl: () => fromFileUrl,
  isAbsolute: () => isAbsolute,
  join: () => join,
  normalize: () => normalize,
  parse: () => parse,
  relative: () => relative,
  resolve: () => resolve,
  sep: () => sep,
  toFileUrl: () => toFileUrl,
  toNamespacedPath: () => toNamespacedPath
});

// https://deno.land/std@0.128.0/path/_constants.ts
var CHAR_UPPERCASE_A = 65;
var CHAR_LOWERCASE_A = 97;
var CHAR_UPPERCASE_Z = 90;
var CHAR_LOWERCASE_Z = 122;
var CHAR_DOT = 46;
var CHAR_FORWARD_SLASH = 47;
var CHAR_BACKWARD_SLASH = 92;
var CHAR_COLON = 58;
var CHAR_QUESTION_MARK = 63;

// https://deno.land/std@0.128.0/path/_util.ts
function assertPath(path3) {
  if (typeof path3 !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path3)}`
    );
  }
}
function isPosixPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
}
function isPathSeparator(code) {
  return isPosixPathSeparator(code) || code === CHAR_BACKWARD_SLASH;
}
function isWindowsDeviceRoot(code) {
  return code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z || code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z;
}
function normalizeString(path3, allowAboveRoot, separator, isPathSeparator2) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i = 0, len = path3.length; i <= len; ++i) {
    if (i < len)
      code = path3.charCodeAt(i);
    else if (isPathSeparator2(code))
      break;
    else
      code = CHAR_FORWARD_SLASH;
    if (isPathSeparator2(code)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += `${separator}..`;
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += separator + path3.slice(lastSlash + 1, i);
        else
          res = path3.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === CHAR_DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep4, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir)
    return base;
  if (dir === pathObject.root)
    return dir + base;
  return dir + sep4 + base;
}
var WHITESPACE_ENCODINGS = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace(string) {
  return string.replaceAll(/[\s]/g, (c) => {
    return WHITESPACE_ENCODINGS[c] ?? c;
  });
}

// https://deno.land/std@0.128.0/_util/assert.ts
var DenoStdInternalError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError(msg);
  }
}

// https://deno.land/std@0.128.0/path/win32.ts
var sep = "\\";
var delimiter = ";";
function resolve(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1; i--) {
    let path3;
    const { Deno } = globalThis;
    if (i >= 0) {
      path3 = pathSegments[i];
    } else if (!resolvedDevice) {
      if (typeof Deno?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path3 = Deno.cwd();
    } else {
      if (typeof Deno?.env?.get !== "function" || typeof Deno?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path3 = Deno.cwd();
      if (path3 === void 0 || path3.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path3 = `${resolvedDevice}\\`;
      }
    }
    assertPath(path3);
    const len = path3.length;
    if (len === 0)
      continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute4 = false;
    const code = path3.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator(code)) {
        isAbsolute4 = true;
        if (isPathSeparator(path3.charCodeAt(1))) {
          let j = 2;
          let last = j;
          for (; j < len; ++j) {
            if (isPathSeparator(path3.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            const firstPart = path3.slice(last, j);
            last = j;
            for (; j < len; ++j) {
              if (!isPathSeparator(path3.charCodeAt(j)))
                break;
            }
            if (j < len && j !== last) {
              last = j;
              for (; j < len; ++j) {
                if (isPathSeparator(path3.charCodeAt(j)))
                  break;
              }
              if (j === len) {
                device = `\\\\${firstPart}\\${path3.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                device = `\\\\${firstPart}\\${path3.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot(code)) {
        if (path3.charCodeAt(1) === CHAR_COLON) {
          device = path3.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator(path3.charCodeAt(2))) {
              isAbsolute4 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator(code)) {
      rootEnd = 1;
      isAbsolute4 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path3.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute4;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0)
      break;
  }
  resolvedTail = normalizeString(
    resolvedTail,
    !resolvedAbsolute,
    "\\",
    isPathSeparator
  );
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize(path3) {
  assertPath(path3);
  const len = path3.length;
  if (len === 0)
    return ".";
  let rootEnd = 0;
  let device;
  let isAbsolute4 = false;
  const code = path3.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      isAbsolute4 = true;
      if (isPathSeparator(path3.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path3.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          const firstPart = path3.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path3.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path3.charCodeAt(j)))
                break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path3.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path3.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path3.charCodeAt(1) === CHAR_COLON) {
        device = path3.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path3.charCodeAt(2))) {
            isAbsolute4 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator(code)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString(
      path3.slice(rootEnd),
      !isAbsolute4,
      "\\",
      isPathSeparator
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute4)
    tail = ".";
  if (tail.length > 0 && isPathSeparator(path3.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute4) {
      if (tail.length > 0)
        return `\\${tail}`;
      else
        return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute4) {
    if (tail.length > 0)
      return `${device}\\${tail}`;
    else
      return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}
function isAbsolute(path3) {
  assertPath(path3);
  const len = path3.length;
  if (len === 0)
    return false;
  const code = path3.charCodeAt(0);
  if (isPathSeparator(code)) {
    return true;
  } else if (isWindowsDeviceRoot(code)) {
    if (len > 2 && path3.charCodeAt(1) === CHAR_COLON) {
      if (isPathSeparator(path3.charCodeAt(2)))
        return true;
    }
  }
  return false;
}
function join(...paths) {
  const pathsCount = paths.length;
  if (pathsCount === 0)
    return ".";
  let joined;
  let firstPart = null;
  for (let i = 0; i < pathsCount; ++i) {
    const path3 = paths[i];
    assertPath(path3);
    if (path3.length > 0) {
      if (joined === void 0)
        joined = firstPart = path3;
      else
        joined += `\\${path3}`;
    }
  }
  if (joined === void 0)
    return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert(firstPart != null);
  if (isPathSeparator(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator(firstPart.charCodeAt(2)))
            ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator(joined.charCodeAt(slashCount)))
        break;
    }
    if (slashCount >= 2)
      joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize(joined);
}
function relative(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to)
    return "";
  const fromOrig = resolve(from);
  const toOrig = resolve(to);
  if (fromOrig === toOrig)
    return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to)
    return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH)
      break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH)
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH)
      break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH)
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH) {
          return toOrig.slice(toStart + i + 1);
        } else if (i === 2) {
          return toOrig.slice(toStart + i);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === CHAR_BACKWARD_SLASH)
      lastCommonSep = i;
  }
  if (i !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1)
    lastCommonSep = 0;
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH) {
      if (out.length === 0)
        out += "..";
      else
        out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH)
      ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
function toNamespacedPath(path3) {
  if (typeof path3 !== "string")
    return path3;
  if (path3.length === 0)
    return "";
  const resolvedPath = resolve(path3);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
        const code = resolvedPath.charCodeAt(2);
        if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
      if (resolvedPath.charCodeAt(1) === CHAR_COLON && resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH) {
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path3;
}
function dirname(path3) {
  assertPath(path3);
  const len = path3.length;
  if (len === 0)
    return ".";
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code = path3.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      rootEnd = offset = 1;
      if (isPathSeparator(path3.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path3.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path3.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path3.charCodeAt(j)))
                break;
            }
            if (j === len) {
              return path3;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path3.charCodeAt(1) === CHAR_COLON) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator(path3.charCodeAt(2)))
            rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator(code)) {
    return path3;
  }
  for (let i = len - 1; i >= offset; --i) {
    if (isPathSeparator(path3.charCodeAt(i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1)
      return ".";
    else
      end = rootEnd;
  }
  return path3.slice(0, end);
}
function basename(path3, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path3);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (path3.length >= 2) {
    const drive = path3.charCodeAt(0);
    if (isWindowsDeviceRoot(drive)) {
      if (path3.charCodeAt(1) === CHAR_COLON)
        start = 2;
    }
  }
  if (ext !== void 0 && ext.length > 0 && ext.length <= path3.length) {
    if (ext.length === path3.length && ext === path3)
      return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path3.length - 1; i >= start; --i) {
      const code = path3.charCodeAt(i);
      if (isPathSeparator(code)) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path3.length;
    return path3.slice(start, end);
  } else {
    for (i = path3.length - 1; i >= start; --i) {
      if (isPathSeparator(path3.charCodeAt(i))) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1)
      return "";
    return path3.slice(start, end);
  }
}
function extname(path3) {
  assertPath(path3);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path3.length >= 2 && path3.charCodeAt(1) === CHAR_COLON && isWindowsDeviceRoot(path3.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i = path3.length - 1; i >= start; --i) {
    const code = path3.charCodeAt(i);
    if (isPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path3.slice(startDot, end);
}
function format(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format("\\", pathObject);
}
function parse(path3) {
  assertPath(path3);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  const len = path3.length;
  if (len === 0)
    return ret;
  let rootEnd = 0;
  let code = path3.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      rootEnd = 1;
      if (isPathSeparator(path3.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path3.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path3.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path3.charCodeAt(j)))
                break;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path3.charCodeAt(1) === CHAR_COLON) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path3.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path3;
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path3;
          return ret;
        }
      }
    }
  } else if (isPathSeparator(code)) {
    ret.root = ret.dir = path3;
    return ret;
  }
  if (rootEnd > 0)
    ret.root = path3.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i = path3.length - 1;
  let preDotState = 0;
  for (; i >= rootEnd; --i) {
    code = path3.charCodeAt(i);
    if (isPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path3.slice(startPart, end);
    }
  } else {
    ret.name = path3.slice(startPart, startDot);
    ret.base = path3.slice(startPart, end);
    ret.ext = path3.slice(startDot, end);
  }
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path3.slice(0, startPart - 1);
  } else
    ret.dir = ret.root;
  return ret;
}
function fromFileUrl(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  let path3 = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname != "") {
    path3 = `\\\\${url.hostname}${path3}`;
  }
  return path3;
}
function toFileUrl(path3) {
  if (!isAbsolute(path3)) {
    throw new TypeError("Must be an absolute path.");
  }
  const [, hostname, pathname] = path3.match(
    /^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/
  );
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
  if (hostname != null && hostname != "localhost") {
    url.hostname = hostname;
    if (!url.hostname) {
      throw new TypeError("Invalid hostname.");
    }
  }
  return url;
}

// https://deno.land/std@0.128.0/path/posix.ts
var posix_exports = {};
__export(posix_exports, {
  basename: () => basename2,
  delimiter: () => delimiter2,
  dirname: () => dirname2,
  extname: () => extname2,
  format: () => format2,
  fromFileUrl: () => fromFileUrl2,
  isAbsolute: () => isAbsolute2,
  join: () => join2,
  normalize: () => normalize2,
  parse: () => parse2,
  relative: () => relative2,
  resolve: () => resolve2,
  sep: () => sep2,
  toFileUrl: () => toFileUrl2,
  toNamespacedPath: () => toNamespacedPath2
});
var sep2 = "/";
var delimiter2 = ":";
function resolve2(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path3;
    if (i >= 0)
      path3 = pathSegments[i];
    else {
      const { Deno } = globalThis;
      if (typeof Deno?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path3 = Deno.cwd();
    }
    assertPath(path3);
    if (path3.length === 0) {
      continue;
    }
    resolvedPath = `${path3}/${resolvedPath}`;
    resolvedAbsolute = path3.charCodeAt(0) === CHAR_FORWARD_SLASH;
  }
  resolvedPath = normalizeString(
    resolvedPath,
    !resolvedAbsolute,
    "/",
    isPosixPathSeparator
  );
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0)
      return `/${resolvedPath}`;
    else
      return "/";
  } else if (resolvedPath.length > 0)
    return resolvedPath;
  else
    return ".";
}
function normalize2(path3) {
  assertPath(path3);
  if (path3.length === 0)
    return ".";
  const isAbsolute4 = path3.charCodeAt(0) === CHAR_FORWARD_SLASH;
  const trailingSeparator = path3.charCodeAt(path3.length - 1) === CHAR_FORWARD_SLASH;
  path3 = normalizeString(path3, !isAbsolute4, "/", isPosixPathSeparator);
  if (path3.length === 0 && !isAbsolute4)
    path3 = ".";
  if (path3.length > 0 && trailingSeparator)
    path3 += "/";
  if (isAbsolute4)
    return `/${path3}`;
  return path3;
}
function isAbsolute2(path3) {
  assertPath(path3);
  return path3.length > 0 && path3.charCodeAt(0) === CHAR_FORWARD_SLASH;
}
function join2(...paths) {
  if (paths.length === 0)
    return ".";
  let joined;
  for (let i = 0, len = paths.length; i < len; ++i) {
    const path3 = paths[i];
    assertPath(path3);
    if (path3.length > 0) {
      if (!joined)
        joined = path3;
      else
        joined += `/${path3}`;
    }
  }
  if (!joined)
    return ".";
  return normalize2(joined);
}
function relative2(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to)
    return "";
  from = resolve2(from);
  to = resolve2(to);
  if (from === to)
    return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH)
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH)
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
          return to.slice(toStart + i + 1);
        } else if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === CHAR_FORWARD_SLASH)
      lastCommonSep = i;
  }
  let out = "";
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
      if (out.length === 0)
        out += "..";
      else
        out += "/..";
    }
  }
  if (out.length > 0)
    return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH)
      ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath2(path3) {
  return path3;
}
function dirname2(path3) {
  assertPath(path3);
  if (path3.length === 0)
    return ".";
  const hasRoot = path3.charCodeAt(0) === CHAR_FORWARD_SLASH;
  let end = -1;
  let matchedSlash = true;
  for (let i = path3.length - 1; i >= 1; --i) {
    if (path3.charCodeAt(i) === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1)
    return hasRoot ? "/" : ".";
  if (hasRoot && end === 1)
    return "//";
  return path3.slice(0, end);
}
function basename2(path3, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path3);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (ext !== void 0 && ext.length > 0 && ext.length <= path3.length) {
    if (ext.length === path3.length && ext === path3)
      return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path3.length - 1; i >= 0; --i) {
      const code = path3.charCodeAt(i);
      if (code === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path3.length;
    return path3.slice(start, end);
  } else {
    for (i = path3.length - 1; i >= 0; --i) {
      if (path3.charCodeAt(i) === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1)
      return "";
    return path3.slice(start, end);
  }
}
function extname2(path3) {
  assertPath(path3);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path3.length - 1; i >= 0; --i) {
    const code = path3.charCodeAt(i);
    if (code === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path3.slice(startDot, end);
}
function format2(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(
      `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`
    );
  }
  return _format("/", pathObject);
}
function parse2(path3) {
  assertPath(path3);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path3.length === 0)
    return ret;
  const isAbsolute4 = path3.charCodeAt(0) === CHAR_FORWARD_SLASH;
  let start;
  if (isAbsolute4) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i = path3.length - 1;
  let preDotState = 0;
  for (; i >= start; --i) {
    const code = path3.charCodeAt(i);
    if (code === CHAR_FORWARD_SLASH) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute4) {
        ret.base = ret.name = path3.slice(1, end);
      } else {
        ret.base = ret.name = path3.slice(startPart, end);
      }
    }
  } else {
    if (startPart === 0 && isAbsolute4) {
      ret.name = path3.slice(1, startDot);
      ret.base = path3.slice(1, end);
    } else {
      ret.name = path3.slice(startPart, startDot);
      ret.base = path3.slice(startPart, end);
    }
    ret.ext = path3.slice(startDot, end);
  }
  if (startPart > 0)
    ret.dir = path3.slice(0, startPart - 1);
  else if (isAbsolute4)
    ret.dir = "/";
  return ret;
}
function fromFileUrl2(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}
function toFileUrl2(path3) {
  if (!isAbsolute2(path3)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(
    path3.replace(/%/g, "%25").replace(/\\/g, "%5C")
  );
  return url;
}

// https://deno.land/std@0.128.0/path/glob.ts
var path = isWindows ? win32_exports : posix_exports;
var { join: join3, normalize: normalize3 } = path;

// https://deno.land/std@0.128.0/path/mod.ts
var path2 = isWindows ? win32_exports : posix_exports;
var {
  basename: basename3,
  delimiter: delimiter3,
  dirname: dirname3,
  extname: extname3,
  format: format3,
  fromFileUrl: fromFileUrl3,
  isAbsolute: isAbsolute3,
  join: join4,
  normalize: normalize4,
  parse: parse3,
  relative: relative3,
  resolve: resolve3,
  sep: sep3,
  toFileUrl: toFileUrl3,
  toNamespacedPath: toNamespacedPath3
} = path2;

// source/flattened/path_peices.js
function pathPieces(path3) {
  path3 = path3.path || path3;
  const result = parse3(path3);
  const folderList = [];
  let dirname4 = result.dir;
  while (true) {
    folderList.push(basename3(dirname4));
    if (dirname4 == dirname3(dirname4)) {
      break;
    }
    dirname4 = dirname3(dirname4);
  }
  folderList.reverse();
  return [folderList, result.name, result.ext];
}
export {
  pathPieces
};
