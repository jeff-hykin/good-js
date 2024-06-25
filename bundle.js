var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// https://deno.land/std@0.128.0/path/mod.ts
var mod_exports = {};
__export(mod_exports, {
  SEP: () => SEP,
  SEP_PATTERN: () => SEP_PATTERN,
  basename: () => basename3,
  common: () => common,
  delimiter: () => delimiter3,
  dirname: () => dirname3,
  extname: () => extname3,
  format: () => format3,
  fromFileUrl: () => fromFileUrl3,
  globToRegExp: () => globToRegExp,
  isAbsolute: () => isAbsolute3,
  isGlob: () => isGlob,
  join: () => join4,
  joinGlobs: () => joinGlobs,
  normalize: () => normalize4,
  normalizeGlob: () => normalizeGlob,
  parse: () => parse3,
  posix: () => posix,
  relative: () => relative3,
  resolve: () => resolve3,
  sep: () => sep3,
  toFileUrl: () => toFileUrl3,
  toNamespacedPath: () => toNamespacedPath3,
  win32: () => win32
});

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
  return string.replaceAll(/[\s]/g, (c3) => {
    return WHITESPACE_ENCODINGS[c3] ?? c3;
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

// https://deno.land/std@0.128.0/path/separator.ts
var SEP = isWindows ? "\\" : "/";
var SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/;

// https://deno.land/std@0.128.0/path/common.ts
function common(paths, sep4 = SEP) {
  const [first = "", ...remaining] = paths;
  if (first === "" || remaining.length === 0) {
    return first.substring(0, first.lastIndexOf(sep4) + 1);
  }
  const parts = first.split(sep4);
  let endOfPrefix = parts.length;
  for (const path3 of remaining) {
    const compare = path3.split(sep4);
    for (let i = 0; i < endOfPrefix; i++) {
      if (compare[i] !== parts[i]) {
        endOfPrefix = i;
      }
    }
    if (endOfPrefix === 0) {
      return "";
    }
  }
  const prefix = parts.slice(0, endOfPrefix).join(sep4);
  return prefix.endsWith(sep4) ? prefix : `${prefix}${sep4}`;
}

// https://deno.land/std@0.128.0/path/glob.ts
var path = isWindows ? win32_exports : posix_exports;
var { join: join3, normalize: normalize3 } = path;
var regExpEscapeChars = [
  "!",
  "$",
  "(",
  ")",
  "*",
  "+",
  ".",
  "=",
  "?",
  "[",
  "\\",
  "^",
  "{",
  "|"
];
var rangeEscapeChars = ["-", "\\", "]"];
function globToRegExp(glob, {
  extended = true,
  globstar: globstarOption = true,
  os = osType,
  caseInsensitive = false
} = {}) {
  if (glob == "") {
    return /(?!)/;
  }
  const sep4 = os == "windows" ? "(?:\\\\|/)+" : "/+";
  const sepMaybe = os == "windows" ? "(?:\\\\|/)*" : "/*";
  const seps = os == "windows" ? ["\\", "/"] : ["/"];
  const globstar = os == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*";
  const wildcard = os == "windows" ? "[^\\\\/]*" : "[^/]*";
  const escapePrefix = os == "windows" ? "`" : "\\";
  let newLength = glob.length;
  for (; newLength > 1 && seps.includes(glob[newLength - 1]); newLength--)
    ;
  glob = glob.slice(0, newLength);
  let regExpString = "";
  for (let j = 0; j < glob.length; ) {
    let segment = "";
    const groupStack = [];
    let inRange = false;
    let inEscape = false;
    let endsWithSep = false;
    let i = j;
    for (; i < glob.length && !seps.includes(glob[i]); i++) {
      if (inEscape) {
        inEscape = false;
        const escapeChars = inRange ? rangeEscapeChars : regExpEscapeChars;
        segment += escapeChars.includes(glob[i]) ? `\\${glob[i]}` : glob[i];
        continue;
      }
      if (glob[i] == escapePrefix) {
        inEscape = true;
        continue;
      }
      if (glob[i] == "[") {
        if (!inRange) {
          inRange = true;
          segment += "[";
          if (glob[i + 1] == "!") {
            i++;
            segment += "^";
          } else if (glob[i + 1] == "^") {
            i++;
            segment += "\\^";
          }
          continue;
        } else if (glob[i + 1] == ":") {
          let k = i + 1;
          let value = "";
          while (glob[k + 1] != null && glob[k + 1] != ":") {
            value += glob[k + 1];
            k++;
          }
          if (glob[k + 1] == ":" && glob[k + 2] == "]") {
            i = k + 2;
            if (value == "alnum")
              segment += "\\dA-Za-z";
            else if (value == "alpha")
              segment += "A-Za-z";
            else if (value == "ascii")
              segment += "\0-\x7F";
            else if (value == "blank")
              segment += "	 ";
            else if (value == "cntrl")
              segment += "\0-\x7F";
            else if (value == "digit")
              segment += "\\d";
            else if (value == "graph")
              segment += "!-~";
            else if (value == "lower")
              segment += "a-z";
            else if (value == "print")
              segment += " -~";
            else if (value == "punct") {
              segment += `!"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_\u2018{|}~`;
            } else if (value == "space")
              segment += "\\s\v";
            else if (value == "upper")
              segment += "A-Z";
            else if (value == "word")
              segment += "\\w";
            else if (value == "xdigit")
              segment += "\\dA-Fa-f";
            continue;
          }
        }
      }
      if (glob[i] == "]" && inRange) {
        inRange = false;
        segment += "]";
        continue;
      }
      if (inRange) {
        if (glob[i] == "\\") {
          segment += `\\\\`;
        } else {
          segment += glob[i];
        }
        continue;
      }
      if (glob[i] == ")" && groupStack.length > 0 && groupStack[groupStack.length - 1] != "BRACE") {
        segment += ")";
        const type = groupStack.pop();
        if (type == "!") {
          segment += wildcard;
        } else if (type != "@") {
          segment += type;
        }
        continue;
      }
      if (glob[i] == "|" && groupStack.length > 0 && groupStack[groupStack.length - 1] != "BRACE") {
        segment += "|";
        continue;
      }
      if (glob[i] == "+" && extended && glob[i + 1] == "(") {
        i++;
        groupStack.push("+");
        segment += "(?:";
        continue;
      }
      if (glob[i] == "@" && extended && glob[i + 1] == "(") {
        i++;
        groupStack.push("@");
        segment += "(?:";
        continue;
      }
      if (glob[i] == "?") {
        if (extended && glob[i + 1] == "(") {
          i++;
          groupStack.push("?");
          segment += "(?:";
        } else {
          segment += ".";
        }
        continue;
      }
      if (glob[i] == "!" && extended && glob[i + 1] == "(") {
        i++;
        groupStack.push("!");
        segment += "(?!";
        continue;
      }
      if (glob[i] == "{") {
        groupStack.push("BRACE");
        segment += "(?:";
        continue;
      }
      if (glob[i] == "}" && groupStack[groupStack.length - 1] == "BRACE") {
        groupStack.pop();
        segment += ")";
        continue;
      }
      if (glob[i] == "," && groupStack[groupStack.length - 1] == "BRACE") {
        segment += "|";
        continue;
      }
      if (glob[i] == "*") {
        if (extended && glob[i + 1] == "(") {
          i++;
          groupStack.push("*");
          segment += "(?:";
        } else {
          const prevChar = glob[i - 1];
          let numStars = 1;
          while (glob[i + 1] == "*") {
            i++;
            numStars++;
          }
          const nextChar = glob[i + 1];
          if (globstarOption && numStars == 2 && [...seps, void 0].includes(prevChar) && [...seps, void 0].includes(nextChar)) {
            segment += globstar;
            endsWithSep = true;
          } else {
            segment += wildcard;
          }
        }
        continue;
      }
      segment += regExpEscapeChars.includes(glob[i]) ? `\\${glob[i]}` : glob[i];
    }
    if (groupStack.length > 0 || inRange || inEscape) {
      segment = "";
      for (const c3 of glob.slice(j, i)) {
        segment += regExpEscapeChars.includes(c3) ? `\\${c3}` : c3;
        endsWithSep = false;
      }
    }
    regExpString += segment;
    if (!endsWithSep) {
      regExpString += i < glob.length ? sep4 : sepMaybe;
      endsWithSep = true;
    }
    while (seps.includes(glob[i]))
      i++;
    if (!(i > j)) {
      throw new Error("Assertion failure: i > j (potential infinite loop)");
    }
    j = i;
  }
  regExpString = `^${regExpString}$`;
  return new RegExp(regExpString, caseInsensitive ? "i" : "");
}
function isGlob(str) {
  const chars = { "{": "}", "(": ")", "[": "]" };
  const regex2 = /\\(.)|(^!|\*|\?|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
  if (str === "") {
    return false;
  }
  let match;
  while (match = regex2.exec(str)) {
    if (match[2])
      return true;
    let idx = match.index + match[0].length;
    const open = match[1];
    const close = open ? chars[open] : null;
    if (open && close) {
      const n2 = str.indexOf(close, idx);
      if (n2 !== -1) {
        idx = n2 + 1;
      }
    }
    str = str.slice(idx);
  }
  return false;
}
function normalizeGlob(glob, { globstar = false } = {}) {
  if (glob.match(/\0/g)) {
    throw new Error(`Glob contains invalid characters: "${glob}"`);
  }
  if (!globstar) {
    return normalize3(glob);
  }
  const s2 = SEP_PATTERN.source;
  const badParentPattern = new RegExp(
    `(?<=(${s2}|^)\\*\\*${s2})\\.\\.(?=${s2}|$)`,
    "g"
  );
  return normalize3(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
}
function joinGlobs(globs, { extended = true, globstar = false } = {}) {
  if (!globstar || globs.length == 0) {
    return join3(...globs);
  }
  if (globs.length === 0)
    return ".";
  let joined;
  for (const glob of globs) {
    const path3 = glob;
    if (path3.length > 0) {
      if (!joined)
        joined = path3;
      else
        joined += `${SEP}${path3}`;
    }
  }
  if (!joined)
    return ".";
  return normalizeGlob(joined, { extended, globstar });
}

// https://deno.land/std@0.128.0/path/mod.ts
var path2 = isWindows ? win32_exports : posix_exports;
var win32 = win32_exports;
var posix = posix_exports;
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

// source/flattened/is_async_iterable.js
var isAsyncIterable = function(value) {
  return value && typeof value[Symbol.asyncIterator] === "function";
};

// source/flattened/empty_iterator.js
var emptyIterator = /* @__PURE__ */ function* () {
}();

// source/flattened/make_iterable.js
var makeIterable = (object) => {
  if (object == null) {
    return emptyIterator;
  }
  if (object[Symbol.iterator] instanceof Function || object[Symbol.asyncIterator] instanceof Function) {
    return object;
  }
  if (Object.getPrototypeOf(object).constructor == Object) {
    return Object.entries(object);
  }
  return emptyIterator;
};

// source/flattened/iter.js
var iter = (object) => {
  const iterable = makeIterable(object);
  if (iterable[Symbol.asyncIterator]) {
    return iterable[Symbol.asyncIterator]();
  } else {
    return iterable[Symbol.iterator]();
  }
};

// source/flattened/deferred_promise.js
function deferredPromise() {
  let methods;
  let state = "pending";
  const promise = new Promise((resolve4, reject) => {
    methods = {
      resolve(value) {
        if (value?.catch instanceof Function) {
          value.catch(reject);
        }
        if (value?.then instanceof Function) {
          value.then(methods.resolve);
        } else {
          state = "fulfilled";
          resolve4(value);
        }
      },
      reject(reason) {
        state = "rejected";
        reject(reason);
      }
    };
  });
  Object.defineProperty(promise, "state", { get: () => state });
  return Object.assign(promise, methods);
}

// source/flattened/after_iterable.js
function afterIterable(iterable, options = { _prevPromise: null }) {
  const { _prevPromise } = options;
  iterable = makeIterable(iterable);
  const hooks = { then: null, catch: null, finally: null };
  let output = deferredPromise();
  if (isAsyncIterable(iterable)) {
    output[Symbol.asyncIterator] = () => {
      const iterator = iter(iterable);
      let index = -1;
      let hitError = false;
      let outputResolvedAlready = false;
      const handleFinally = async (returnValue, hitError2, index2) => {
        if (!outputResolvedAlready) {
          outputResolvedAlready = true;
          if (hooks.finally) {
            await hooks.finally();
          }
          let wasRejected = false;
          try {
            await _prevPromise;
          } catch (error) {
            wasRejected = true;
            output.reject(error);
          }
          if (!wasRejected) {
            if (hitError2) {
              output.reject(hitError2);
            } else {
              output.resolve(returnValue);
            }
          }
        }
      };
      return {
        async next() {
          let output2 = { value: null, done: true };
          index++;
          try {
            output2 = await iterator.next();
          } catch (error) {
            hitError = error;
            if (!hooks.catch) {
              output2.reject(error);
            } else {
              try {
                await hooks.catch(error, index);
                hitError = void 0;
                output2.done = true;
              } catch (error2) {
                output2.reject(error2);
              }
            }
          } finally {
            if (output2.done) {
              if (!hitError) {
                let maybeValue;
                try {
                  maybeValue = await (hooks.then && hooks.then(index));
                } catch (error) {
                  hitError = error;
                  throw error;
                } finally {
                  handleFinally(maybeValue, hitError, index);
                }
              }
              handleFinally(void 0, hitError, index);
            }
          }
          return output2;
        }
      };
    };
  } else {
    output[Symbol.iterator] = () => {
      const iterator = iter(iterable);
      let index = -1;
      let hitError = false;
      let outputResolvedAlready = false;
      const handleFinally = async (returnValue, hitError2, index2) => {
        if (!outputResolvedAlready) {
          outputResolvedAlready = true;
          if (hooks.finally) {
            await hooks.finally();
          }
          let wasRejected = false;
          try {
            await _prevPromise;
          } catch (error) {
            wasRejected = true;
            output.reject(error);
          }
          if (!wasRejected) {
            if (hitError2) {
              output.reject(returnValue);
            } else {
              output.resolve(returnValue);
            }
          }
        }
      };
      return {
        next() {
          let output2 = { value: null, done: true };
          index++;
          try {
            output2 = iterator.next();
          } catch (error) {
            hitError = true;
            let isRejected = false;
            try {
              hooks.catch && hooks.catch(error, index);
              return { done: true };
            } catch (error2) {
              isRejected = true;
              output2.reject(error2);
            }
            isRejected || output2.reject(error);
            throw error;
          } finally {
            if (output2.done) {
              if (!hitError) {
                let maybePromise;
                try {
                  maybePromise = hooks.then && hooks.then(index);
                } finally {
                  handleFinally(maybePromise, hitError, index);
                }
              }
              handleFinally(void 0, hitError, index);
            }
          }
          return output2;
        }
      };
    };
  }
  Object.assign(output, {
    then(callback) {
      hooks.then = callback;
      return afterIterable(output, { _prevPromise: output });
    },
    catch(callback) {
      hooks.catch = callback;
      return afterIterable(output, { _prevPromise: output });
    },
    finally(callback) {
      hooks.finally = callback;
      return afterIterable(output, { _prevPromise: output });
    }
  });
  if (typeof iterable.length == "number" && iterable.length === iterable.length) {
    output.length = iterable.length;
  }
  return output;
}

// source/flattened/all_equal.js
function allEqual(anIterable) {
  for (let prev of anIterable) {
    for (const each of anIterable) {
      if (each != prev) {
        return false;
      }
      prev = each;
    }
    break;
  }
  return true;
}

// source/flattened/all_key_descriptions.js
var allKeyDescriptions = function(value, options = { includingBuiltin: false }) {
  var { includingBuiltin } = { ...options };
  let descriptions = [];
  if (value == null) {
    return {};
  }
  if (!(value instanceof Object)) {
    value = Object.getPrototypeOf(value);
  }
  const rootPrototype = Object.getPrototypeOf({});
  let prevObj;
  while (value && value != prevObj) {
    if (!includingBuiltin && value == rootPrototype) {
      break;
    }
    descriptions = descriptions.concat(Object.entries(Object.getOwnPropertyDescriptors(value)));
    prevObj = value;
    value = Object.getPrototypeOf(value);
  }
  descriptions.reverse();
  return Object.fromEntries(descriptions);
};

// source/flattened/all_keys.js
var allKeys = function(obj) {
  let keys = [];
  if (obj == null) {
    return [];
  }
  if (!(obj instanceof Object)) {
    obj = Object.getPrototypeOf(obj);
  }
  while (obj) {
    keys = keys.concat(Reflect.ownKeys(obj));
    obj = Object.getPrototypeOf(obj);
  }
  return keys;
};

// source/flattened/array_iterator__class.js
var ArrayIterator = Object.getPrototypeOf([][Symbol.iterator]);

// source/flattened/array_of_keys_to_object.js
var arrayOfKeysToObject = (array, defaultValue) => array.reduce((acc, curr) => (acc[curr] = defaultValue, acc), {});

// source/flattened/async_function__class.js
var AsyncFunction = class {
};
try {
  AsyncFunction = eval("(async function(){}).constructor");
} catch (err) {
}

// source/flattened/async_generator__class.js
var AsyncGenerator2 = class {
};
try {
  AsyncGenerator2 = eval("((async function*(){})()).constructor");
} catch (err) {
}

// source/flattened/async_generator_function__class.js
var AsyncGeneratorFunction = class {
};
try {
  AsyncGeneratorFunction = eval("(async function*(){}).constructor");
} catch (err) {
}

// source/flattened/async_iterator_to_list.js
async function asyncIteratorToList(asyncIterator) {
  const results = [];
  for await (const each of asyncIterator) {
    results.push(each);
  }
  return results;
}

// source/flattened/binary_search.js
function binarySearch(params) {
  const { in: list, find: target, toValue } = params;
  let low = 0;
  let high = list.length - 1;
  let mid;
  if (!toValue) {
    while (low <= high) {
      mid = Math.floor((low + high) / 2);
      const guess = list[mid];
      if (guess === target) {
        return [mid - 1, mid, mid + 1];
      } else if (guess < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  } else {
    while (low <= high) {
      mid = Math.floor((low + high) / 2);
      const guess = toValue(list[mid]);
      if (guess === target) {
        return [mid - 1, mid, mid + 1];
      } else if (guess < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }
  return [high, null, low];
}

// source/flattened/typed_array_classes.js
var typedArrayClasses = [
  Uint16Array,
  Uint32Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Int32Array,
  Int8Array,
  Float32Array,
  Float64Array
];
if (globalThis.BigInt64Array) {
  typedArrayClasses.push(globalThis.BigInt64Array);
}
if (globalThis.BigUint64Array) {
  typedArrayClasses.push(globalThis.BigUint64Array);
}

// source/flattened/builtin_copyable_primitive_classes.js
var builtinCopyablePrimitiveClasses = /* @__PURE__ */ new Set([RegExp, Date, URL, ...typedArrayClasses, globalThis.ArrayBuffer, globalThis.DataView]);

// source/flattened/capitalize.js
var capitalize = (string) => string.replace(/\b\w/g, (chr) => chr.toUpperCase());

// source/flattened/combinations.js
var combinations = function* (elements, maxLength, minLength) {
  if (maxLength === minLength && minLength === void 0) {
    minLength = 1;
    maxLength = elements.length;
  } else {
    maxLength = maxLength || elements.length;
    minLength = minLength === void 0 ? maxLength : minLength;
  }
  if (minLength !== maxLength) {
    for (let i = minLength; i <= maxLength; i++) {
      yield* combinations(elements, i, i);
    }
  } else {
    if (maxLength === 1) {
      yield* elements.map((each) => [each]);
    } else {
      for (let i = 0; i < elements.length; i++) {
        for (const next2 of combinations(elements.slice(i + 1, elements.length), maxLength - 1, maxLength - 1)) {
          yield [elements[i], ...next2];
        }
      }
    }
  }
};

// source/flattened/common_prefix.js
function commonPrefix(listOfStrings) {
  let high = Math.max(...listOfStrings.map((each) => each.length));
  if (high === 0 || listOfStrings.length == 0) {
    return "";
  }
  let low = 0;
  let mid;
  let lastValid = 0;
  while (low <= high) {
    mid = Math.floor((low + high) / 2);
    let isValid = allEqual(listOfStrings.map((each) => each.slice(0, mid)));
    if (isValid) {
      lastValid = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return listOfStrings[0].slice(0, lastValid);
}

// source/flattened/remove_common_prefix.js
function removeCommonPrefix(listOfStrings) {
  if (listOfStrings.length < 2) {
    return;
  }
  const sliceOff = commonPrefix(listOfStrings).length;
  if (sliceOff != 0) {
    let index = 0;
    for (const each of listOfStrings) {
      listOfStrings[index] = each.slice(sliceOff);
      index += 1;
    }
  }
}

// source/flattened/common_prefix_removed.js
function commonPrefixRemoved(listOfStrings) {
  listOfStrings = [...listOfStrings];
  removeCommonPrefix(listOfStrings);
  return listOfStrings;
}

// source/flattened/common_suffix.js
function commonSuffix(listOfStrings) {
  let high = Math.max(...listOfStrings.map((each) => each.length));
  if (high === 0 || listOfStrings.length == 0) {
    return "";
  }
  if (!allEqual(listOfStrings.map((each) => each.slice(-1)[0]))) {
    return "";
  }
  let low = 1;
  let mid;
  let lastValid = 0;
  while (low <= high) {
    mid = Math.floor((low + high) / 2);
    let isValid = allEqual(listOfStrings.map((each) => each.slice(-mid)));
    if (isValid) {
      lastValid = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return listOfStrings[0].slice(-lastValid);
}

// source/flattened/remove_common_suffix.js
function removeCommonSuffix(listOfStrings) {
  if (listOfStrings.length < 2) {
    return;
  }
  const sliceOff = commonSuffix(listOfStrings).length;
  if (sliceOff != 0) {
    let index = 0;
    for (const each of listOfStrings) {
      listOfStrings[index] = each.slice(0, -sliceOff);
      index += 1;
    }
  }
}

// source/flattened/common_suffix_removed.js
function commonSuffixRemoved(listOfStrings) {
  listOfStrings = [...listOfStrings];
  removeCommonSuffix(listOfStrings);
  return listOfStrings;
}

// source/flattened/get.js
var get = ({ keyList, from, failValue }) => {
  const lastKey = keyList.slice(-1)[0];
  for (const each of keyList.slice(0, -1)) {
    if (from == null) {
      return failValue;
    } else {
      try {
        from = from[each];
      } catch (error) {
        return failValue;
      }
    }
  }
  if (from == null) {
    return failValue;
  }
  let lastValue;
  try {
    lastValue = from[lastKey];
    if (lastValue !== void 0) {
      return lastValue;
    }
  } catch (error) {
    return failValue;
  }
  const isAKey = allKeys(from).includes(lastKey);
  if (isAKey) {
    return lastValue;
  } else {
    return failValue;
  }
};

// source/flattened/compare_property.js
var compareProperty = ({ keyList, largestFirst = false }) => {
  let comparison = (a2, b) => {
    const aValue = get({ keyList, from: a2, failValue: -Infinity });
    const bValue = get({ keyList, from: b, failValue: -Infinity });
    if (typeof aValue == "number") {
      return aValue - bValue;
    } else {
      return aValue.localeCompare(bValue);
    }
  };
  if (largestFirst) {
    let oldComparison = comparison;
    comparison = (b, a2) => oldComparison(a2, b);
  }
  return comparison;
};

// source/flattened/concat_uint8_arrays.js
function concatUint8Arrays(arrays) {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

// source/flattened/concurrently_transform.js
var ERROR_WHILE_MAPPING_MESSAGE = "Threw while mapping";
function concurrentlyTransform({ iterator, transformFunction, poolLimit = null, awaitAll = false }) {
  poolLimit = poolLimit || concurrentlyTransform.defaultPoolLimit;
  const res = new TransformStream({
    async transform(p2, controller) {
      try {
        const s2 = await p2;
        controller.enqueue(s2);
      } catch (e2) {
        if (e2 instanceof AggregateError && e2.message == ERROR_WHILE_MAPPING_MESSAGE) {
          controller.error(e2);
        }
      }
    }
  });
  const mainPromise = (async () => {
    const writer = res.writable.getWriter();
    const executing = [];
    try {
      let index = 0;
      for await (const item of iterator) {
        const p2 = Promise.resolve().then(() => transformFunction(item, index));
        index++;
        writer.write(p2);
        const e2 = p2.then(() => executing.splice(executing.indexOf(e2), 1));
        executing.push(e2);
        if (executing.length >= poolLimit) {
          await Promise.race(executing);
        }
      }
      await Promise.all(executing);
      writer.close();
    } catch {
      const errors = [];
      for (const result of await Promise.allSettled(executing)) {
        if (result.status == "rejected") {
          errors.push(result.reason);
        }
      }
      writer.write(Promise.reject(new AggregateError(errors, ERROR_WHILE_MAPPING_MESSAGE))).catch(() => {
      });
    }
  })();
  const asyncIterator = res.readable[Symbol.asyncIterator]();
  if (!awaitAll) {
    return asyncIterator;
  } else {
    return mainPromise.then(() => asyncIteratorToList(asyncIterator));
  }
}
concurrentlyTransform.defaultPoolLimit = 40;

// source/flattened/count.js
var count = function* ({ start = 0, end = Infinity, step = 1 }) {
  let count2 = start;
  while (count2 <= end) {
    yield count2;
    count2 += step;
  }
};

// source/flattened/create_linear_mapper.js
var createLinearMapper = (from = { min: 0, max: 1 }, to = { min: 0, max: 100 }) => {
  const fromRange = from.max - from.min;
  const toRange = to.max - to.min;
  return (value) => {
    const normalized = (value - from.min) / fromRange;
    const newMapping = normalized * toRange + to.min;
    return newMapping;
  };
};

// source/flattened/deep_copy_symbol.js
var deepCopySymbol = Symbol.for("deepCopy");

// source/flattened/iterator_prototype__class.js
var IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));

// source/flattened/is_built_in_iterator.js
var isBuiltInIterator = (value) => IteratorPrototype.isPrototypeOf(value);

// source/flattened/is_generator_type.js
var isGeneratorType = (value) => {
  if (value instanceof Object) {
    if (isBuiltInIterator(value)) {
      return true;
    }
    const constructor = value.constructor;
    return constructor == SyncGenerator || constructor == AsyncGenerator;
  }
  return false;
};

// source/flattened/deep_copy.js
var clonedFromSymbol = Symbol();
var getThis = Symbol();
Object.getPrototypeOf(function() {
})[getThis] = function() {
  return this;
};
function deepCopyInner(value, valueChain = [], originalToCopyMap = /* @__PURE__ */ new Map()) {
  valueChain.push(value);
  if (value == null) {
    return value;
  }
  if (!(value instanceof Object)) {
    return value;
  }
  if (originalToCopyMap.has(value)) {
    return originalToCopyMap.get(value);
  }
  if (value[deepCopySymbol] instanceof Function) {
    const clonedValue = value[deepCopySymbol](originalToCopyMap);
    originalToCopyMap.set(value, clonedValue);
    return clonedValue;
  }
  if (isGeneratorType(value)) {
    throw Error(`Sadly built-in generators cannot be deep copied.
And I found a generator along this path:
${valueChain.reverse().map((each) => `${each},
`)}`);
  }
  let object, theThis, thisCopy;
  if (value instanceof Date) {
    object = new Date(value.getTime());
  } else if (value instanceof RegExp) {
    object = new RegExp(value);
  } else if (value instanceof URL) {
    object = new URL(value);
  } else if (value instanceof Function) {
    theThis = value[getThis]();
    object = value.bind(theThis);
  } else if (builtinCopyablePrimitiveClasses.has(value.constructor)) {
    object = new value.constructor(value);
  } else if (value instanceof Array) {
    object = [];
  } else if (value instanceof Set) {
    object = /* @__PURE__ */ new Set();
  } else if (value instanceof Map) {
    object = /* @__PURE__ */ new Map();
  }
  originalToCopyMap.set(value, object);
  if (object instanceof Function) {
    thisCopy = deepCopyInner(theThis, valueChain, originalToCopyMap);
    object = object.bind(thisCopy);
  }
  const output = object;
  try {
    output.constructor = value.constructor;
  } catch (error) {
  }
  Object.setPrototypeOf(output, Object.getPrototypeOf(value));
  const propertyDefinitions = {};
  for (const [key, description] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
    const { value: value2, get: get2, set: set2, ...options } = description;
    const getIsFunc = get2 instanceof Function;
    const setIsFunc = set2 instanceof Function;
    if (getIsFunc || setIsFunc) {
      propertyDefinitions[key] = {
        ...options,
        get: get2 ? function(...args) {
          return get2.apply(output, args);
        } : void 0,
        set: set2 ? function(...args) {
          return set2.apply(output, args);
        } : void 0
      };
    } else {
      if (key == "length" && output instanceof Array) {
        continue;
      }
      propertyDefinitions[key] = {
        ...options,
        value: deepCopyInner(value2, valueChain, originalToCopyMap)
      };
    }
  }
  Object.defineProperties(output, propertyDefinitions);
  return output;
}
var deepCopy = (value) => deepCopyInner(value);

// source/flattened/deep_sort_object.js
var deepSortObject2 = (obj, seen = /* @__PURE__ */ new Map()) => {
  if (!(obj instanceof Object)) {
    return obj;
  } else if (seen.has(obj)) {
    return seen.get(obj);
  } else {
    if (obj instanceof Array) {
      const sortedChildren = [];
      seen.set(obj, sortedChildren);
      for (const each of obj) {
        sortedChildren.push(deepSortObject2(each, seen));
      }
      return sortedChildren;
    } else {
      const sorted = {};
      seen.set(obj, sorted);
      for (const eachKey of Object.keys(obj).sort()) {
        sorted[eachKey] = deepSortObject2(obj[eachKey], seen);
      }
      return sorted;
    }
  }
};

// source/flattened/levenshtein_distance_between.js
function levenshteinDistanceBetween(str1, str2) {
  if (str1.length > str2.length) {
    ;
    [str1, str2] = [str2, str1];
  }
  let distances = Array.from({ length: str1.length + 1 }, (_, i) => +i);
  for (let str2Index = 0; str2Index < str2.length; str2Index++) {
    const tempDistances = [str2Index + 1];
    for (let str1Index = 0; str1Index < str1.length; str1Index++) {
      let char1 = str1[str1Index];
      let char2 = str2[str2Index];
      if (char1 === char2) {
        tempDistances.push(distances[str1Index]);
      } else {
        tempDistances.push(1 + Math.min(distances[str1Index], distances[str1Index + 1], tempDistances[tempDistances.length - 1]));
      }
    }
    distances = tempDistances;
  }
  return distances[distances.length - 1];
}

// source/flattened/did_you_mean.js
function didYouMean(arg) {
  var { givenWord, givenWords, possibleWords, caseSensitive, autoThrow, suggestionLimit } = { suggestionLimit: Infinity, ...arg };
  if (givenWords instanceof Array) {
    let output = {};
    for (const givenWord2 of givenWords) {
      output[givenWord2] = didYouMean({ ...arg, givenWord: givenWord2, givenWords: void 0 });
    }
    return output;
  }
  if (!caseSensitive) {
    possibleWords = possibleWords.map((each) => each.toLowerCase());
    givenWord = givenWord.toLowerCase();
  }
  if (!possibleWords.includes(givenWord) && autoThrow) {
    let suggestions = didYouMean({
      givenWord,
      possibleWords,
      caseSensitive,
      suggestionLimit
    });
    if (suggestionLimit == 1 && suggestions.length > 0) {
      throw new Error(`For ${JSON.stringify(givenWord)}, did you mean ${JSON.stringify(suggestions[0])}?`);
    } else {
      throw new Error(`For ${JSON.stringify(givenWord)}, did you mean one of ${JSON.stringify(suggestions)}?`);
    }
  }
  return [...possibleWords].sort((a2, b) => levenshteinDistanceBetween(givenWord, a2) - levenshteinDistanceBetween(givenWord, b)).slice(0, suggestionLimit);
}

// source/flattened/indent.js
var indent = ({ string, by = "    ", noLead = false }) => (noLead ? "" : by) + string.replace(/\n/g, "\n" + by);

// source/flattened/to_representation.js
var reprSymbol = Symbol.for("representation");
var denoInspectSymbol = Symbol.for("Deno.customInspect");
var toRepresentation = (item, { alreadySeen = /* @__PURE__ */ new Set() } = {}) => {
  const recursionWrapper = (item2) => {
    if (item2 instanceof Object) {
      if (alreadySeen.has(item2)) {
        return `[Self Reference]`;
      } else {
        alreadySeen.add(item2);
      }
    }
    let output;
    if (item2 === void 0) {
      output = "undefined";
    } else if (item2 === null) {
      output = "null";
    } else if (typeof item2 == "string") {
      output = JSON.stringify(item2);
    } else if (typeof item2 == "symbol") {
      if (!item2.description) {
        output = "Symbol()";
      } else {
        const globalVersion = Symbol.for(item2.description);
        if (globalVersion == item2) {
          output = `Symbol.for(${JSON.stringify(item2.description)})`;
        } else {
          output = `Symbol(${JSON.stringify(item2.description)})`;
        }
      }
    } else if (item2 instanceof Date) {
      output = `new Date(${item2.getTime()})`;
    } else if (item2 instanceof Array) {
      output = `[${item2.map((each) => recursionWrapper(each)).join(",")}]`;
    } else if (item2 instanceof Set) {
      output = `new Set(${[...item2].map((each) => recursionWrapper(each)).join(",")})`;
    } else if (item2 instanceof Object && item2.constructor == Object) {
      output = pureObjectRepr(item2);
    } else if (item2 instanceof Map) {
      let string = "new Map(";
      for (const [key, value] of item2.entries()) {
        const stringKey = recursionWrapper(key);
        const stringValue = recursionWrapper(value);
        if (!stringKey.match(/\n/g)) {
          string += `
  [${stringKey}, ${indent({ string: stringValue, by: "  ", noLead: true })}],`;
        } else {
          string += `
  [${indent({ string: stringKey, by: "  ", noLead: true })},
  ${indent({ string: stringValue, by: "    ", noLead: true })}],`;
        }
      }
      string += "\n)";
      output = string;
    } else {
      if (item2[reprSymbol] instanceof Function) {
        try {
          output = item2[reprSymbol]();
          return output;
        } catch (error) {
        }
      }
      if (item2[denoInspectSymbol] instanceof Function) {
        try {
          output = item2[denoInspectSymbol]();
          return output;
        } catch (error) {
        }
      }
      try {
        output = item2.toString();
        if (output !== "[object Object]") {
          return output;
        }
      } catch (error) {
      }
      try {
        if (item2.constructor instanceof Function && item2.prototype && typeof item2.name == "string") {
          output = `class ${item2.name} { /*...*/ }`;
          return output;
        }
      } catch (error) {
      }
      try {
        if (item2.constructor instanceof Function && typeof item2.constructor.name == "string") {
          output = `new ${item2.constructor.name}(${pureObjectRepr(item2)})`;
          return output;
        }
      } catch (error) {
      }
      return pureObjectRepr(item2);
    }
    return output;
  };
  const pureObjectRepr = (item2) => {
    let string = "{";
    for (const [key, value] of Object.entries(item2)) {
      const stringKey = recursionWrapper(key);
      const stringValue = recursionWrapper(value);
      string += `
  ${stringKey}: ${indent({ string: stringValue, by: "  ", noLead: true })},`;
    }
    string += "\n}";
    return string;
  };
  return recursionWrapper(item);
};

// source/flattened/to_string.js
var toString = (value) => {
  if (typeof value == "symbol") {
    return toRepresentation(value);
  } else if (!(value instanceof Object)) {
    return value != null ? value.toString() : `${value}`;
  } else {
    return toRepresentation(value);
  }
};

// source/flattened/digits_to_english_array.js
var digitsToEnglishArray = (value) => {
  value = toString(value);
  if (value.length > 1) {
    return [].concat(...[...value].map((each) => digitsToEnglishArray(each)));
  }
  if (value === "-") {
    return ["negative"];
  } else if (value === ".") {
    return ["point"];
  } else if (value === "0") {
    return ["zero"];
  } else if (value === "1") {
    return ["one"];
  } else if (value === "2") {
    return ["two"];
  } else if (value === "3") {
    return ["three"];
  } else if (value === "4") {
    return ["four"];
  } else if (value === "5") {
    return ["five"];
  } else if (value === "6") {
    return ["six"];
  } else if (value === "7") {
    return ["seven"];
  } else if (value === "8") {
    return ["eight"];
  } else if (value === "9") {
    return ["nine"];
  } else {
    return "";
  }
};

// source/flattened/zip.js
var zip = function* (...iterables) {
  iterables = iterables.map((each) => iter(each));
  while (true) {
    const nexts = iterables.map((each) => each.next());
    if (nexts.every((each) => each.done)) {
      break;
    }
    yield nexts.map((each) => each.value);
  }
};

// source/flattened/enumerate.js
var enumerate = function* (...iterables) {
  let index = 0;
  for (const each of zip(...iterables)) {
    yield [index++, ...each];
  }
};

// source/flattened/escape_html.js
var { replace: c } = "";
var s = /[&<>'"]/g;
var a = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" };
var e = (t) => a[t];
var l = (t) => c.call(t, s, e);

// source/flattened/escape_regex_match.js
var reservedCharMap = {
  "&": "\\x26",
  "!": "\\x21",
  "#": "\\x23",
  "$": "\\$",
  "%": "\\x25",
  "*": "\\*",
  "+": "\\+",
  ",": "\\x2c",
  ".": "\\.",
  ":": "\\x3a",
  ";": "\\x3b",
  "<": "\\x3c",
  "=": "\\x3d",
  ">": "\\x3e",
  "?": "\\?",
  "@": "\\x40",
  "^": "\\^",
  "`": "\\x60",
  "~": "\\x7e",
  "(": "\\(",
  ")": "\\)",
  "[": "\\[",
  "]": "\\]",
  "{": "\\{",
  "}": "\\}",
  "/": "\\/",
  "-": "\\x2d",
  "\\": "\\\\",
  "|": "\\|"
};
var RX_REGEXP_ESCAPE = new RegExp(
  `[${Object.values(reservedCharMap).join("")}]`,
  "gu"
);
function escapeRegexMatch(str) {
  return str.replaceAll(
    RX_REGEXP_ESCAPE,
    (m) => reservedCharMap[m]
  );
}

// source/flattened/escape_regex_replace.js
function escapeRegexReplace(string) {
  return string.replace(/\$/g, "$$$$");
}

// source/flattened/extract_first.js
function extractFirst({ pattern, from }) {
  pattern = !pattern.global ? pattern : new RegExp(pattern, pattern.flags.replace("g", ""));
  const match = from.match(pattern);
  return {
    get preText() {
      return !match ? "" : from.slice(0, match.index);
    },
    match,
    extraction: match && match[0],
    get postText() {
      return !match ? from : from.slice(match.index + match[0].length);
    },
    get remaining() {
      return !match ? from : from.slice(0, match.index) + from.slice(match.index + match[0].length);
    }
  };
}

// source/flattened/find_all.js
var findAll = (regexPattern, sourceString) => {
  var output = [];
  var match;
  var regexPatternWithGlobal = regexPattern.global ? regexPattern : RegExp(regexPattern, regexPattern.flags + "g");
  while (match = regexPatternWithGlobal.exec(sourceString)) {
    output.push(match);
    if (match[0].length == 0) {
      regexPatternWithGlobal.lastIndex += 1;
    }
  }
  return output;
};

// source/flattened/is_sync_iterable_object_or_container.js
var isSyncIterableObjectOrContainer = function(value) {
  return value instanceof Object && typeof value[Symbol.iterator] == "function";
};

// source/flattened/lazy_flatten.js
function lazyFlatten({ iterable, depth = Infinity, asyncsInsideSyncIterable = false }) {
  if (depth <= 0) {
    return iterable;
  }
  iterable = makeIterable(iterable);
  if (isAsyncIterable(iterable) || asyncsInsideSyncIterable) {
    return async function* () {
      for await (const each of iterable) {
        if (isAsyncIterable(each) || isSyncIterableObjectOrContainer(each)) {
          for await (const eachChild of lazyFlatten({ iterable: each, depth: depth - 1, asyncsInsideSyncIterable })) {
            yield eachChild;
          }
        } else {
          yield each;
        }
      }
    }();
  } else {
    return function* () {
      for (const each of iterable) {
        if (isSyncIterableObjectOrContainer(each)) {
          for (const eachChild of lazyFlatten({ iterable: each, depth: depth - 1 })) {
            yield eachChild;
          }
        } else {
          yield each;
        }
      }
    }();
  }
}

// source/flattened/stop_symbol.js
var stop = Symbol.for("iterationStop");

// source/flattened/next.js
var handleResult = ({ value, done }) => done ? stop : value;
var next = (object) => {
  if (object.next instanceof Function) {
    const result = object.next();
    if (result instanceof Promise) {
      return result.then(handleResult);
    } else {
      return handleResult(result);
    }
  } else {
    throw Error(`can't call next(object) on the following object as there is no object.next() method`, object);
  }
};

// source/flattened/iterable__class.js
function forkBy({ data, filters, outputArrays = false }) {
  let isAsync = isAsyncIterable(data);
  const conditionHandlers = {};
  const iterator = iter(data);
  for (const [key, check] of Object.entries(filters)) {
    const que = [];
    let index = 0;
    if (isAsync || check instanceof AsyncFunction) {
      conditionHandlers[key] = new Iterable(async function* () {
        while (1) {
          if (conditionHandlers[key].hitError) {
            throw conditionHandlers[key].hitError;
          }
          if (que.length == 0) {
            const nextValue = await next(iterator);
            if (nextValue == stop) {
              break;
            }
            for (const [key2, generator] of Object.entries(conditionHandlers)) {
              let shouldPush = false;
              try {
                shouldPush = await generator.check(nextValue, index++);
              } catch (error) {
                generator.hitError = error;
              }
              if (shouldPush) {
                generator.que.push(nextValue);
              }
            }
          }
          if (que.length != 0) {
            yield que.shift();
          }
        }
      }());
    } else {
      conditionHandlers[key] = new Iterable(function* () {
        while (1) {
          if (conditionHandlers[key].hitError) {
            throw conditionHandlers[key].hitError;
          }
          if (que.length == 0) {
            const nextValue = next(iterator);
            if (nextValue == stop) {
              break;
            }
            for (const [key2, generator] of Object.entries(conditionHandlers)) {
              let shouldPush = false;
              try {
                shouldPush = generator.check(nextValue, index++);
              } catch (error) {
                generator.hitError = error;
              }
              if (shouldPush) {
                generator.que.push(nextValue);
              }
            }
          }
          if (que.length != 0) {
            yield que.shift();
          }
        }
      }());
    }
    conditionHandlers[key].check = check;
    conditionHandlers[key].hitError = false;
    conditionHandlers[key].que = que;
  }
  if (outputArrays) {
    for (const [key, value] of Object.entries(conditionHandlers)) {
      if (isAsyncIterable(value)) {
        conditionHandlers[key] = asyncIteratorToList(value);
      } else {
        conditionHandlers[key] = [...value];
      }
    }
  }
  return conditionHandlers;
}
function Iterable(value, options = { length: null, _createEmpty: false }) {
  const { length, _createEmpty } = { length: null, _createEmpty: false, ...options };
  if (_createEmpty) {
    return this;
  }
  const self = this === void 0 || this === globalThis ? new Iterable(null, { _createEmpty: true }) : this;
  if (value instanceof Array) {
    self.length = value.length;
  } else if (value instanceof Set) {
    self.length = value.size;
  } else if (typeof length == "number") {
    self.length = length;
  }
  self._source = makeIterable(value);
  if (self._source[Symbol.iterator]) {
    self[Symbol.iterator] = self._source[Symbol.iterator].bind(self._source);
  }
  if (self._source[Symbol.asyncIterator]) {
    self[Symbol.asyncIterator] = self._source[Symbol.asyncIterator].bind(self._source);
  }
  self[Symbol.isConcatSpreadable] = true;
  self.lengthIs = function(length2) {
    self.length = length2;
    return self;
  };
  self.map = function(func) {
    const output = {
      ...self._source,
      [Symbol.iterator]: () => {
        const iterator = iter(self._source);
        let index = 0;
        return {
          next() {
            const { value: value2, done } = iterator.next();
            return {
              value: done || func(value2, index++),
              done
            };
          }
        };
      }
    };
    const includeAsyncIterator = isAsyncIterable(self._source) || func instanceof AsyncFunction;
    if (includeAsyncIterator) {
      output[Symbol.asyncIterator] = () => {
        const iterator = iter(self._source);
        let index = 0;
        return {
          async next() {
            const { value: value2, done } = await iterator.next();
            return {
              value: done || await func(value2, index++),
              done
            };
          }
        };
      };
    }
    return new Iterable(output);
  };
  self.filter = function(func) {
    const output = {
      ...self._source,
      [Symbol.iterator]: () => {
        const iterator = iter(self._source);
        let index = 0;
        return {
          next() {
            while (1) {
              const result = iterator.next();
              if (result.done || func(result.value, index++)) {
                return result;
              }
            }
          }
        };
      }
    };
    const includeAsyncIterator = isAsyncIterable(self._source) || func instanceof AsyncFunction;
    if (includeAsyncIterator) {
      output[Symbol.asyncIterator] = () => {
        const iterator = iter(self._source);
        let index = 0;
        return {
          async next() {
            while (1) {
              const result = await iterator.next();
              if (result.done || await func(result.value, index++)) {
                return result;
              }
            }
          }
        };
      };
    }
    return new Iterable(output);
  };
  self.forkBy = ({ ...args }, ...other) => forkBy({ ...args, data: self }, ...other);
  self.flat = (depth = 1, asyncsInsideSyncIterable = false) => {
    return new Iterable(
      lazyFlatten({ iterable: self, depth, asyncsInsideSyncIterable })
    );
  };
  self.then = (func) => {
    const output = {
      ...self._source,
      [Symbol.iterator]: () => {
        const iterator = iter(self._source);
        let index = -1;
        return {
          next() {
            const output2 = iterator.next();
            index++;
            if (output2.done) {
              func(self, index);
            }
            return output2;
          }
        };
      }
    };
    const includeAsyncIterator = isAsyncIterable(self._source);
    if (includeAsyncIterator) {
      output[Symbol.asyncIterator] = () => {
        const iterator = iter(self._source);
        let index = -1;
        return {
          async next() {
            const output2 = await iterator.next();
            index++;
            if (output2.done) {
              await func(self, index);
            }
            return output2;
          }
        };
      };
    }
    return new Iterable(output);
  };
  self.finally = (func) => {
    const output = {
      ...self._source,
      [Symbol.iterator]: () => {
        const iterator = iter(self._source);
        let index = -1;
        return {
          next() {
            let output2 = { value: null, done: true };
            try {
              output2 = iterator.next();
              index++;
            } finally {
              if (output2.done) {
                func(self, index);
              }
            }
          }
        };
      }
    };
    const includeAsyncIterator = isAsyncIterable(self._source);
    if (includeAsyncIterator) {
      output[Symbol.asyncIterator] = () => {
        const iterator = iter(self._source);
        let index = 0;
        return {
          async next() {
            let output2 = { value: null, done: true };
            try {
              output2 = await iterator.next();
              index++;
            } finally {
              if (output2.done) {
                await func(self, index);
              }
            }
          }
        };
      };
    }
    return new Iterable(output);
  };
  Object.defineProperties(self, {
    toArray: {
      // TODO: make this a method
      get() {
        if (self[Symbol.asyncIterator]) {
          return (async () => {
            const iterator = self[Symbol.asyncIterator]();
            const output = [];
            while (1) {
              const { value: value2, done } = await iterator.next();
              if (done) {
                break;
              }
              output.push(value2);
            }
            return output;
          })();
        } else {
          return [...self];
        }
      }
    },
    flattened: {
      get() {
        return self.flat(Infinity);
      }
    }
  });
  return self;
}

// source/flattened/frequency_count.js
function frequencyCount(iterable) {
  iterable = makeIterable(iterable);
  if (isAsyncIterable(iterable)) {
    return async function() {
      const counts = /* @__PURE__ */ new Map();
      for await (const element of iterable) {
        counts.set(element, (counts.get(element) || 0) + 1);
      }
      return counts;
    }();
  } else {
    const counts = /* @__PURE__ */ new Map();
    for (const element of iterable) {
      counts.set(element, (counts.get(element) || 0) + 1);
    }
    return counts;
  }
}

// source/flattened/generator_function__class.js
var GeneratorFunction = class {
};
try {
  GeneratorFunction = eval("(function*(){}).constructor");
} catch (err) {
}

// source/flattened/get_int_bit.js
function getIntBit(number, bitIndex) {
  return number >> bitIndex & 1;
}

// source/flattened/has_direct_key_list.js
var hasDirectKeyList = (object, keyList) => {
  const lastKey = keyList.pop();
  for (const each of keyList) {
    if (object == null) {
      return false;
    } else {
      try {
        object = object[each];
      } catch (error) {
        return false;
      }
    }
  }
  if (object == null) {
    return false;
  }
  try {
    const lastValue = object[lastKey];
    if (lastValue !== void 0) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return Object.keys(object).includes(lastKey);
};

// source/flattened/has_key_list.js
var hasKeyList = (object, keyList) => {
  const lastKey = keyList.pop();
  for (const each of keyList) {
    if (object == null) {
      return false;
    } else {
      try {
        object = object[each];
      } catch (error) {
        return false;
      }
    }
  }
  if (object == null) {
    return false;
  }
  try {
    const lastValue = object[lastKey];
    if (lastValue !== void 0) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return allKeys(object).includes(lastKey);
};

// source/flattened/intersection.js
function intersection(...sets) {
  const sortedSets = sets.sort((a2, b) => (a2.size || a2.length) - (b.size || b.length));
  const smallestCopy = new Set(sortedSets.shift());
  for (const eachSet of sortedSets) {
    if (smallestCopy.size == 0) {
      break;
    } else {
      for (const eachCommonElement of smallestCopy) {
        if (!eachSet.has(eachCommonElement)) {
          smallestCopy.delete(eachCommonElement);
        }
      }
    }
  }
  return smallestCopy;
}

// source/flattened/is_empty_object.js
var isEmptyObject = (object) => {
  if (object == null) {
    return true;
  }
  for (const _ in object) {
    return false;
  }
  return true;
};

// source/flattened/is_iterable_object_or_container.js
var isIterableObjectOrContainer = function(value) {
  return value instanceof Object && (typeof value[Symbol.iterator] == "function" || typeof value[Symbol.asyncIterator] === "function");
};

// source/flattened/is_primitive.js
var isPrimitive = (value) => !(value instanceof Object);

// source/flattened/is_practically_primitive.js
var isPracticallyPrimitive = (value) => isPrimitive(value) || value instanceof Date || value instanceof RegExp || value instanceof URL;

// source/flattened/is_pure_object.js
var isPureObject = (value) => value instanceof Object && Object.getPrototypeOf(value).constructor == Object;

// source/flattened/is_sync_iterable.js
var isSyncIterable = function(value) {
  return value && typeof value[Symbol.iterator] === "function";
};

// source/flattened/is_technically_iterable.js
var isTechnicallyIterable = function(value) {
  return value instanceof Object || typeof value == "string";
};

// source/flattened/is_valid_identifier.js
var regexIdentifier = /^(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D])(?:[\$0-9A-Z_a-z\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF])*$/;
var regexIdentifierES5 = /^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)(?:[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])(?:[\$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])*$/;
var regexES6ReservedWord = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|await|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/;
function isValidIdentifier(value) {
  const tmp = value.replace(/\\u([a-fA-F0-9]{4})|\\u\{([0-9a-fA-F]{1,})\}/g, function($0, $1, $2) {
    var codePoint = parseInt($2 || $1, 16);
    if (codePoint >= 55296 && codePoint <= 57343) {
      return "\0";
    }
    return String.fromCodePoint(codePoint);
  });
  const es5Warning = !regexIdentifierES5.test(
    // Only Unicode escapes are allowed in ES5 identifiers.
    value.replace(/\\u([a-fA-F0-9]{4})/g, function($0, $1) {
      return String.fromCodePoint(parseInt($1, 16));
    })
  );
  var isReserved;
  if ((isReserved = regexES6ReservedWord.test(tmp)) || !regexIdentifier.test(tmp)) {
    return false;
  } else {
    return true;
  }
}

// source/flattened/iterate_reversed.js
function iterateReversed(data) {
  const isArrayOrString = data instanceof Array || typeof data == "string";
  const isSet = data instanceof Set;
  if (isArrayOrString || isSet) {
    const length = isArrayOrString ? data.length : data.size;
    let lastIndex = length;
    const iterator = function* () {
      while (lastIndex > 0) {
        yield data[--lastIndex];
      }
    }();
    iterator.length = length;
    return iterator;
  }
  if (!isAsyncIterable(data)) {
    return [...data].reverse();
  } else {
    return asyncIteratorToList(data).then((data2) => reversed(data2));
  }
}

// source/flattened/iteratively_find_all.js
function* iterativelyFindAll(regexPattern, sourceString) {
  var match;
  const regexPatternWithGlobal = regexPattern.global ? regexPattern : RegExp(regexPattern, regexPattern.flags + "g");
  while (match = regexPatternWithGlobal.exec(sourceString)) {
    yield match;
    if (match[0].length == 0) {
      regexPatternWithGlobal.lastIndex += 1;
    }
  }
}

// source/flattened/lazy_concat.js
function lazyConcat(...iterables) {
  iterables = iterables.map(makeIterable);
  let iterator;
  if (iterables.some(isAsyncIterable)) {
    iterator = async function* () {
      for (const each of iterables) {
        for await (const eachItem of each) {
          yield eachItem;
        }
      }
    }();
  } else {
    iterator = function* () {
      for (const each of iterables) {
        yield* each;
      }
    }();
  }
  if (iterables.every((each) => typeof each.length == "number" && each.length === each.length)) {
    let totalLength = 0;
    for (const each of iterables) {
      totalLength += each.length;
    }
    iterator.length = totalLength;
  }
  return iterator;
}

// source/flattened/lazy_filter.js
function lazyFilter(data, func) {
  data = makeIterable(data);
  let iterator;
  if (isAsyncIterable(data) || func instanceof AsyncFunction) {
    iterator = async function* () {
      let index = -1;
      for await (const each of data) {
        if (await func(each, ++index)) {
          yield each;
        }
      }
    }();
  } else {
    iterator = function* () {
      let index = -1;
      for (const each of data) {
        if (func(each, ++index)) {
          yield each;
        }
      }
    }();
  }
  return iterator;
}

// source/flattened/lazy_map.js
function lazyMap(data, func) {
  data = makeIterable(data);
  let iterator;
  if (isAsyncIterable(data)) {
    iterator = async function* () {
      let index = -1;
      for await (const each of data) {
        yield await func(each, ++index);
      }
    }();
  } else {
    iterator = function* () {
      let index = -1;
      for (const each of data) {
        yield func(each, ++index);
      }
    }();
  }
  if (typeof data.size == "number") {
    iterator.length = data.size;
  }
  if (typeof data.length == "number") {
    iterator.length = data.length;
  }
  return iterator;
}

// source/flattened/levenshtein_distance_ordering.js
function levenshteinDistanceOrdering({ word, otherWords }) {
  word = word.toLowerCase();
  let prioritized = [...otherWords].sort((a2, b) => levenshteinDistanceBetween(word, a2) - levenshteinDistanceBetween(word, b));
  return prioritized;
}

// source/flattened/map_iterator__class.js
var MapIterator = Object.getPrototypeOf((/* @__PURE__ */ new Map())[Symbol.iterator]);

// source/flattened/merge.js
var merge = ({ oldData, newData }) => {
  if (!(newData instanceof Object) || !(oldData instanceof Object)) {
    return newData;
  }
  let output = {};
  if (newData instanceof Array) {
    output = [];
  }
  Object.assign(output, oldData);
  for (const key in newData) {
    if (!(key in oldData)) {
      output[key] = newData[key];
    } else {
      output[key] = merge({ oldData: oldData[key], newData: newData[key] });
    }
  }
  return output;
};

// source/flattened/vector_summary_stats.js
var vectorSummaryStats = (listOfNumbers) => {
  const median = listOfNumbers[Math.floor(listOfNumbers.length / 2)];
  let min = Infinity, max = -Infinity, sum2 = 0;
  for (const each of listOfNumbers) {
    sum2 += each;
    if (each > max) {
      max = each;
    }
    if (each < min) {
      min = each;
    }
  }
  return {
    min,
    max,
    range: max - min,
    average: sum2 / listOfNumbers.length,
    median,
    sum: sum2,
    count: listOfNumbers.length
  };
};

// source/flattened/normalize_zero_to_one.js
var normalizeZeroToOne = (values) => {
  const { min, range } = vectorSummaryStats(values);
  if (range == 0) {
    return values.map((each) => 0);
  }
  return values.map((each) => (each - min) / range);
};

// source/flattened/object_compare.js
var objectCompare = ({ elementToNumber, largestFirst = false }) => {
  let comparison = (a2, b) => {
    const aValue = elementToNumber(a2);
    const bValue = elementToNumber(b);
    if (typeof aValue == "number") {
      return aValue - bValue;
    } else {
      return aValue.localeCompare(bValue);
    }
  };
  if (largestFirst) {
    let oldComparison = comparison;
    comparison = (b, a2) => oldComparison(a2, b);
  }
  return comparison;
};

// source/flattened/own_key_descriptions.js
var ownKeyDescriptions = Object.getOwnPropertyDescriptors;

// source/flattened/word_list.js
var wordList = (str) => {
  const addedSeperator = str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/[^a-zA-Z0-9 _.-]/, "_").toLowerCase();
  const words = addedSeperator.split(/[ _.-]+/g).filter((each) => each);
  return words;
};

// source/flattened/to_camel_case.js
var toCamelCase = (str) => {
  const words = wordList(str);
  const capatalizedWords = words.map((each) => each.replace(/^\w/, (group0) => group0.toUpperCase()));
  capatalizedWords[0] = capatalizedWords[0].toLowerCase();
  return capatalizedWords.join("");
};

// source/flattened/parse_args.js
var flag = Symbol("flagArg");
var required = Symbol("requiredArg");
var unset = Symbol("unset");
var Default = class {
  constructor(val) {
    this.val = val;
  }
};
var coerseValue = (value, transformer) => {
  if (value instanceof Array) {
    try {
      return transformer(value);
    } catch (error) {
      const newValues = [];
      for (const each of value) {
        try {
          newValues.push(transformer(each));
        } catch (error2) {
          newValues.push(each);
        }
      }
      return newValues;
    }
  } else if (value !== void 0 && value !== unset) {
    try {
      return transformer(value);
    } catch (error) {
    }
  }
  return value;
};
function parseArgs({
  rawArgs,
  fields,
  namedArgsStopper = "--",
  allowNameRepeats = true,
  nameTransformer = toCamelCase,
  valueTransformer = JSON.parse,
  isolateArgsAfterStopper = false,
  argsByNameSatisfiesNumberedArg = true,
  implicitNamePattern = /^(--|-)[a-zA-Z0-9\-_]+$/,
  implictFlagPattern = null
}) {
  const explicitNamesList = [];
  const explicitFlagList = [];
  const keyToField = /* @__PURE__ */ new Map();
  for (const [keys, ...kind] of fields) {
    const isFlag = kind.includes(flag);
    const isRequired = kind.includes(required);
    const hasDefaultValue = kind.some((each) => each instanceof Default);
    const hasTransformer = kind.some((each) => each instanceof Function);
    const entry = {
      isRequired,
      isFlag,
      isExplicit: true,
      hasTransformer,
      wasNamed: false,
      keys,
      kind,
      realIndices: [],
      value: unset,
      hasDefaultValue,
      default: hasDefaultValue ? kind.filter((each) => each instanceof Default)[0].val : void 0
    };
    for (const each of keys) {
      if (keyToField.has(each)) {
        throw Error(`When calling parseArgs(), there's at least two arguments that are both trying to use this name ${JSON.stringify(each)}. A name can only belong to one argument.`);
      }
      keyToField.set(each, entry);
      if (typeof each == "string") {
        explicitNamesList.push(each);
      }
    }
    if (isFlag) {
      for (const each of keys) {
        if (typeof each == "string") {
          explicitFlagList.push(each);
        }
      }
    }
  }
  const argsAfterStopper = [];
  const numberWasImplicit = [];
  const nameWasImplicit = [];
  let directArgList = [];
  const argsByNumber = {};
  let stopParsingArgsByName = false;
  let argName = null;
  let runningArgNumberIndex = -1;
  let index = -1;
  let nameStopIndex = null;
  const numberedArgBuffer = [];
  const handleNumberedArg = (index2, each) => {
    directArgList.push(each);
    parse_next_numbered_arg:
      while (1) {
        runningArgNumberIndex += 1;
        if (!keyToField.has(runningArgNumberIndex)) {
          numberWasImplicit.push(runningArgNumberIndex);
          keyToField.set(runningArgNumberIndex, {
            kind: [],
            keys: [runningArgNumberIndex],
            realIndices: [index2],
            value: each
          });
        } else {
          const entry = keyToField.get(runningArgNumberIndex);
          if (entry.value != void 0) {
            if (argsByNameSatisfiesNumberedArg) {
              continue parse_next_numbered_arg;
            } else if (allowNameRepeats) {
              entry.value = [entry.value, each];
            } else {
              throw Error(`When calling parseArgs(), two values were given for the same entry (ex: "count $thisVal 5 --min $thisVal" instead of "count --min $thisVal --max 5" or "count $thisVal 5"). The second occurance was ${argName}, and the field was ${JSON.stringify(entry.names)}`);
            }
          } else {
            argsByNumber[runningArgNumberIndex] = each;
            entry.value = each;
          }
          entry.realIndices.push(index2);
        }
        break;
      }
  };
  for (const eachArg of rawArgs) {
    index += 1;
    if (argName != null) {
      const name = argName;
      argName = null;
      if (!keyToField.has(name)) {
        nameWasImplicit.push(name);
        keyToField.set(name, {
          wasNamed: true,
          kind: [],
          keys: [name],
          realIndices: [index],
          value: eachArg
        });
      } else {
        const entry = keyToField.get(name);
        entry.wasNamed = true;
        if (entry.value !== unset) {
          if (allowNameRepeats) {
            entry.value = [entry.value, eachArg];
          } else {
            throw Error(`When calling parseArgs(), two values (ex: "--min 5 --minimum 5" or "--m 5 --m 5") were given to the same field. The second occurance was ${name}, and the field was ${JSON.stringify(entry.keys)} `);
          }
        } else {
          entry.value = eachArg;
        }
        entry.realIndices.push(index - 1);
        entry.realIndices.push(index);
      }
      continue;
    }
    if (eachArg == namedArgsStopper) {
      stopParsingArgsByName = true;
      nameStopIndex = index;
      continue;
    }
    if (stopParsingArgsByName) {
      argsAfterStopper.push(eachArg);
      if (!isolateArgsAfterStopper) {
        numberedArgBuffer.push([index, eachArg]);
      }
      continue;
    }
    let match;
    if (explicitFlagList.includes(eachArg)) {
      const entry = keyToField.get(eachArg);
      if (entry.value != unset) {
        if (!allowNameRepeats) {
          throw Error(`When calling parseArgs(), two values (ex: "--min 5 --minimum 5" or "--m 5 --m 5") were given to the same field. The second occurance was ${eachArg}, and the field was ${JSON.stringify(entry.keys)} `);
        }
      } else {
        entry.value = true;
      }
      entry.realIndices.push(index);
    } else if (explicitNamesList.includes(eachArg)) {
      argName = eachArg;
    } else if (implicitNamePattern && (match = eachArg.match(implicitNamePattern))) {
      argName = eachArg;
    } else if (implictFlagPattern && (match = eachArg.match(implictFlagPattern))) {
      if (!keyToField.has(eachArg)) {
        keyToField.set(runningArgNumberIndex, {
          isFlag: true,
          kind: [],
          keys: [eachArg],
          realIndices: [index],
          value: true
        });
      } else {
        keyToField.get(eachArg).realIndices.push(index);
      }
    } else {
      numberedArgBuffer.push([index, eachArg]);
    }
  }
  for (const [index2, each] of numberedArgBuffer) {
    handleNumberedArg(index2, each);
  }
  const simplifiedNames = {};
  const argsByName = {};
  const fieldSet = new Set(keyToField.values());
  for (const eachEntry of fieldSet) {
    const names = eachEntry.keys.filter((each) => typeof each == "string");
    if (names.length > 0) {
      if (!nameTransformer) {
        simplifiedNames[names[0]] = null;
      } else {
        const transformedNames = names.map(nameTransformer).flat(1);
        simplifiedNames[transformedNames[0]] = null;
        const newNames = transformedNames.filter((each) => !names.includes(each));
        eachEntry.keys = eachEntry.keys.concat(newNames);
        for (const newName of newNames) {
          keyToField.set(newName, eachEntry);
        }
      }
    }
  }
  for (const eachEntry of fieldSet) {
    if (eachEntry.isRequired && eachEntry.value == unset) {
      throw Error(`

The ${eachEntry.keys.map((each) => typeof each == "number" ? `[Arg #${each}]` : each).join(" ")} field is required but it was not provided
`);
    }
    const usingDefaultValue = eachEntry.hasDefaultValue && eachEntry.value == unset;
    if (usingDefaultValue) {
      eachEntry.value = eachEntry.default;
    } else {
      if (eachEntry.hasTransformer) {
        for (const eachTransformer of eachEntry.kind) {
          if (eachTransformer instanceof Function) {
            eachEntry.value = eachTransformer(eachEntry.value);
          }
        }
      } else if (valueTransformer && !eachEntry.isFlag) {
        eachEntry.value = coerseValue(eachEntry.value, valueTransformer);
      }
    }
    if (eachEntry.isFlag) {
      eachEntry.value = !!eachEntry.value;
    }
    for (const eachName of eachEntry.keys) {
      if (typeof eachName == "number") {
        argsByNumber[eachName] = eachEntry.value;
      } else if (typeof eachName == "string") {
        argsByName[eachName] = eachEntry.value;
      }
    }
  }
  const implicitArgsByName = {};
  const implicitArgsByNumber = [];
  for (const { isExplicit, value, keys } of fieldSet) {
    if (!isExplicit) {
      if (typeof keys[0] == "number") {
        implicitArgsByNumber.push(value);
      } else {
        implicitArgsByName[keys[0]] = value;
        implicitArgsByName[nameTransformer(keys[0])] = value;
      }
    }
  }
  const explicitArgsByName = {};
  const explicitArgsByNumber = [];
  for (const { isExplicit, kind, value, keys } of fieldSet) {
    if (isExplicit) {
      for (const eachKey of keys) {
        if (typeof eachKey == "number") {
          explicitArgsByNumber[eachKey] = value;
        } else {
          explicitArgsByName[eachKey] = value;
        }
      }
    }
  }
  for (const each of Object.keys(simplifiedNames)) {
    simplifiedNames[each] = argsByName[each];
  }
  if (valueTransformer) {
    directArgList = directArgList.map((each) => coerseValue(each, valueTransformer));
  }
  return {
    simplifiedNames,
    argList: explicitArgsByNumber.concat(implicitArgsByNumber),
    explicitArgsByNumber,
    implicitArgsByNumber,
    directArgList,
    argsAfterStopper,
    arg: (nameOrIndex) => {
      if (typeof nameOrIndex == "number") {
        return argsByNumber[nameOrIndex];
      } else {
        return argsByName[nameOrIndex];
      }
    },
    fields: [...fieldSet],
    field: keyToField.get,
    explicitArgsByName,
    implicitArgsByName,
    nameStopIndex
  };
}

// source/flattened/permute.js
var permute = function* (elements) {
  yield elements.slice();
  const length = elements.length;
  const c3 = new Array(length).fill(0);
  let i = 1, k, p2;
  while (i < length) {
    if (c3[i] < i) {
      k = i % 2 && c3[i];
      p2 = elements[i];
      elements[i] = elements[k];
      elements[k] = p2;
      ++c3[i];
      i = 1;
      yield elements.slice();
    } else {
      c3[i] = 0;
      ++i;
    }
  }
};

// source/flattened/product.js
var product = (list) => list.reduce((a2, b) => (a2 - 0) * (b - 0), 1);

// source/flattened/recursive_promise_all.js
var objectPrototype = Object.getPrototypeOf({});
var recursivePromiseAll = (object, alreadySeen = /* @__PURE__ */ new Map()) => {
  if (alreadySeen.has(object)) {
    return alreadySeen.get(object);
  }
  if (object instanceof Promise) {
    return object;
  } else if (object instanceof Array) {
    const resolveLink = deferredPromise();
    alreadySeen.set(object, resolveLink);
    Promise.all(
      object.map((each) => recursivePromiseAll(each, alreadySeen))
    ).catch(
      resolveLink.reject
    ).then(
      resolveLink.resolve
    );
    return resolveLink;
  } else if (Object.getPrototypeOf(object) == objectPrototype) {
    const resolveLink = deferredPromise();
    alreadySeen.set(object, resolveLink);
    (async () => {
      try {
        const keysAndValues = await Promise.all(
          Object.entries(object).map(
            (keyAndValue) => recursivePromiseAll(keyAndValue, alreadySeen)
          )
        );
        resolveLink.resolve(Object.fromEntries(keysAndValues));
      } catch (error) {
        resolveLink.reject(error);
      }
    })();
    return resolveLink;
  } else {
    return object;
  }
};

// source/flattened/recursively_iterate_own_keys_of.js
function* recursivelyIterateOwnKeysOf(obj, recursionProtecion = /* @__PURE__ */ new Set()) {
  if (!(obj instanceof Object)) {
    return [];
  }
  recursionProtecion.add(obj);
  for (const eachKey of Object.keys(obj)) {
    yield [eachKey];
    let value;
    try {
      value = obj[eachKey];
    } catch (error) {
      continue;
    }
    if (recursionProtecion.has(value)) {
      continue;
    }
    for (const eachNewAttributeList of recursivelyIterateOwnKeysOf(value, recursionProtecion)) {
      eachNewAttributeList.unshift(eachKey);
      yield eachNewAttributeList;
    }
  }
}

// source/flattened/recursively_own_keys_of.js
var recursivelyOwnKeysOf = (obj, recursionProtecion = /* @__PURE__ */ new Set()) => [...recursivelyIterateOwnKeysOf(obj, recursionProtecion)];

// source/flattened/reduce.js
function reduce(data, func) {
  data = makeIterable(data);
  let iterator;
  if (isAsyncIterable(data) || func instanceof AsyncFunction) {
    return async function() {
      let index = -1;
      let value;
      for await (const each of data) {
        index++;
        if (index == -1) {
          value = await func(each, index);
        } else {
          value = await func(each, index, value);
        }
      }
      return value;
    }();
  } else {
    let index = -1;
    let value;
    for (const each of data) {
      index++;
      if (index == -1) {
        value = func(each, index);
      } else {
        value = func(each, index, value);
      }
    }
    return value;
  }
}

// source/flattened/regex.js
var regexpProxy = Symbol("regexpProxy");
var realExec = RegExp.prototype.exec;
RegExp.prototype.exec = function(...args) {
  if (this[regexpProxy]) {
    return realExec.apply(this[regexpProxy], args);
  }
  return realExec.apply(this, args);
};
var proxyRegExp;
var regexProxyOptions = Object.freeze({
  get(original, key) {
    if (typeof key == "string" && key.match(/^[igmusyv]+$/)) {
      return proxyRegExp(original, key);
    }
    if (key == regexpProxy) {
      return original;
    }
    return original[key];
  },
  set(original, key, value) {
    original[key] = value;
    return true;
  }
});
proxyRegExp = (parent, flags) => {
  const regex2 = new RegExp(parent, flags);
  const output = new Proxy(regex2, regexProxyOptions);
  Object.setPrototypeOf(output, Object.getPrototypeOf(regex2));
  return output;
};
function regexWithStripWarning(shouldStrip) {
  return (strings, ...values) => {
    let newRegexString = "";
    for (const [string, value] of zip(strings, values)) {
      newRegexString += string;
      if (value instanceof RegExp) {
        if (!shouldStrip && value.flags.replace(/g/, "").length > 0) {
          console.warn(`Warning: flags inside of regex:
    The RegExp trigging this warning is: ${value}
    When calling the regex interpolater (e.g. regex\`something\${stuff}\`)
    one of the \${} values (the one above) was a RegExp with a flag enabled
    e.g. /stuff/i  <- i = ignoreCase flag enabled
    When the /stuff/i gets interpolated, its going to loose its flags
    (thats what I'm warning you about)
    
    To disable/ignore this warning do:
        regex.stripFlags\`something\${/stuff/i}\`
    If you want to add flags to the output of regex\`something\${stuff}\` do:
        regex\`something\${stuff}\`.i   // ignoreCase
        regex\`something\${stuff}\`.ig  // ignoreCase and global
        regex\`something\${stuff}\`.gi  // functionally equivlent
`);
        }
        newRegexString += `(?:${value.source})`;
      } else if (value != null) {
        newRegexString += escapeRegexMatch(toString(value));
      }
    }
    return proxyRegExp(newRegexString, "");
  };
}
var regex = regexWithStripWarning(false);
regex.stripFlags = regexWithStripWarning(true);

// source/flattened/remove.js
var remove = ({ keyList, from }) => {
  if (keyList.length == 1) {
    try {
      delete from[keyList[0]];
    } catch (error) {
      return false;
    }
  } else if (keyList.length > 1) {
    keyList = [...keyList];
    let last = keyList.pop();
    let parentObj = get({ keyList, from });
    return remove({ keyList: [last], from: parentObj });
  }
};

// source/flattened/rounded_up_to_nearest.js
var roundedUpToNearest = ({ value, factor }) => {
  factor = Math.abs(factor);
  const remainder = value % factor;
  if (value > 0) {
    return remainder ? value + (factor - remainder) : value;
  } else {
    return remainder ? value - remainder : value;
  }
};

// source/flattened/rounded_down_to_nearest.js
var roundedDownToNearest = ({ value, factor }) => {
  factor = Math.abs(factor);
  const remainder = value % factor;
  if (remainder == 0) {
    return value;
  }
  return roundedUpToNearest({ value: value - factor, factor });
};

// source/flattened/set_if_missing_direct_key.js
var setIfMissingDirectKey = ({ keyList, to, on }) => {
  let originalKeyList = keyList;
  try {
    keyList = [...keyList];
    let lastAttribute = keyList.pop();
    let neededToCreateParent = false;
    for (var key of keyList) {
      neededToCreateParent = !(on[key] instanceof Object);
      if (neededToCreateParent) {
        on[key] = {};
      }
      on = on[key];
    }
    if (neededToCreateParent || !Object.keys(on).includes(lastAttribute)) {
      on[lastAttribute] = to;
    }
    return on[lastAttribute];
  } catch (error) {
    throw new Error(`
the set function was unable to set the value for some reason
    the set obj was: ${JSON.stringify(on)}
    the keyList was: ${JSON.stringify(originalKeyList)}
    the value was: ${JSON.stringify(to)}
the original error message was:

`, error);
  }
};

// source/flattened/set_int_bit_false.js
function setIntBitFalse(number, bitIndex) {
  return ~(~number | 1 << bitIndex);
}

// source/flattened/set_int_bit_true.js
function setIntBitTrue(number, bitIndex) {
  return number | 1 << bitIndex;
}

// source/flattened/set_int_bit.js
function setIntBit(number, bitIndex, value = 1) {
  if (value) {
    return number | 1 << bitIndex;
  } else {
    return ~(~number | 1 << bitIndex);
  }
}

// source/flattened/set_iterator__class.js
var SetIterator = Object.getPrototypeOf((/* @__PURE__ */ new Set())[Symbol.iterator]);

// source/flattened/set.js
var set = ({ keyList, to, on }) => {
  let originalKeyList = keyList;
  try {
    keyList = [...keyList];
    let lastAttribute = keyList.pop();
    for (var key of keyList) {
      if (!(on[key] instanceof Object)) {
        on[key] = {};
      }
      on = on[key];
    }
    on[lastAttribute] = to;
  } catch (error) {
    throw new Error(`
the set function was unable to set the value for some reason
    the set obj was: ${JSON.stringify(on)}
    the keyList was: ${JSON.stringify(originalKeyList)}
    the value was: ${JSON.stringify(to)}
the original error message was:

`, error);
  }
  return on;
};

// source/flattened/shallow_sort_object.js
var shallowSortObject = (obj) => {
  return Object.keys(obj).sort().reduce(
    (newObj, key) => {
      newObj[key] = obj[key];
      return newObj;
    },
    {}
  );
};

// source/flattened/simple_parse_args.js
function simpleParseArgs(args) {
  const flags = {};
  const namedArgs = {};
  const numberedArgs = [];
  let doubleDashWasPassed = false;
  let argName = null;
  for (const each of args) {
    if (argName != null) {
      const name = argName;
      argName = null;
      if (Object.keys(namedArgs).includes(name)) {
        namedArgs[name] = [namedArgs[name], each];
      } else {
        namedArgs[name] = each;
      }
    }
    if (each == "--") {
      doubleDashWasPassed = true;
    }
    if (doubleDashWasPassed) {
      numberedArgs.push(each);
      continue;
    }
    if (each.startsWith("--")) {
      argName = each.slice(2);
      continue;
    } else if (each.startsWith("-")) {
      flags[each.slice(1)] = true;
    } else {
      numberedArgs.push(each);
    }
  }
  return { flags, namedArgs, numberedArgs };
}

// source/flattened/slices.js
var slices = function* (elements) {
  const slicePoints = count({ start: 1, end: numberOfPartitions.length - 1 });
  for (const combination of combinations(slicePoints)) {
    combination.sort();
    let prev = 0;
    const slices2 = [];
    for (const eachEndPoint of [...combination, elements.length]) {
      slices2.push(elements.slice(prev, eachEndPoint));
      prev = eachEndPoint;
    }
    yield slices2;
  }
};

// source/flattened/spread.js
var spread = ({ quantity, min, max, decimals = 5 }) => {
  const range = max - min;
  const increment = range / quantity;
  const values = [min.toFixed(decimals) - 0];
  let index = 0;
  const valueAt = (index2) => min + increment * index2;
  while (valueAt(index) < max) {
    values.push(valueAt(index++).toFixed(decimals) - 0);
  }
  values.push(max.toFixed(decimals) - 0);
  return values;
};

// source/flattened/stable_stringify.js
var stableStringify = (value, ...args) => {
  return JSON.stringify(deepSortObject(value), ...args);
};

// source/flattened/string_to_utf8_bytes.js
var textEncoder = new TextEncoder("utf-8");
var stringToUtf8Bytes = textEncoder.encode.bind(textEncoder);

// source/flattened/subtract.js
function subtract({ value, from }) {
  let source = from;
  let detractor = value;
  let sourceSize = source.size || source.length;
  if (!sourceSize) {
    source = new Set(source);
    sourceSize = source.size;
  }
  let detractorSize = detractor.size || detractor.length;
  if (!detractorSize) {
    detractor = new Set(detractor);
    detractorSize = detractor.size;
  }
  if (sourceSize < detractorSize) {
    const outputSet = /* @__PURE__ */ new Set();
    !(detractor instanceof Set) && (detractor = new Set(detractor));
    for (const each of source) {
      if (!detractor.has(each)) {
        outputSet.add(each);
      }
    }
    return outputSet;
  } else {
    !(source != from) && (source = new Set(source));
    for (const eachValueBeingRemoved of detractor) {
      source.delete(eachValueBeingRemoved);
    }
    return source;
  }
}

// source/flattened/sum.js
var sum = (list) => list.reduce((a2, b) => a2 - 0 + (b - 0), 0);

// source/flattened/sync_generator__class.js
var SyncGenerator2 = class {
};
try {
  SyncGenerator2 = eval("((function*(){})()).constructor");
} catch (err) {
}

// source/flattened/test_call_jsonify.js
function testCallJsonify(func, ...args) {
  console.log();
  const argsBefore = JSON.stringify(args);
  console.log(`args before: ${argsBefore}`);
  let err;
  let result;
  try {
    result = func(...args);
  } catch (error) {
    err = error;
  }
  if (result instanceof Promise) {
    return result.then((each) => {
      result = each;
    }).catch((error) => {
      err = error;
    }).finally(() => {
      if (err) {
        console.log(`error: ${err}`);
      }
      const argsAfter = JSON.stringify(args);
      if (argsBefore !== argsAfter) {
        console.log(`args after: ${argsAfter}`);
      } else {
        console.log(`[args were not changed]`);
      }
      console.log(`result: ${JSON.stringify(result)}`);
    });
  } else {
    if (err) {
      console.log(`error: ${err}`);
    }
    const argsAfter = JSON.stringify(args);
    if (argsBefore !== argsAfter) {
      console.log(`args after: ${argsAfter}`);
    } else {
      console.log(`[args were not changed]`);
    }
    console.log(`result: ${JSON.stringify(result)}`);
  }
}

// source/flattened/to_kebab_case.js
var toKebabCase = (str) => {
  const words = wordList(str);
  return words.map((each) => each.toLowerCase()).join("-");
};

// source/flattened/to_pascal_case.js
var toPascalCase = (str) => {
  const words = wordList(str);
  const capatalizedWords = words.map((each) => each.replace(/^\w/, (group0) => group0.toUpperCase()));
  return capatalizedWords.join("");
};

// source/flattened/to_screaming_kebab_case.js
var toScreamingKebabCase = (str) => {
  const words = wordList(str);
  return words.map((each) => each.toUpperCase()).join("-");
};

// source/flattened/to_screaming_snake_case.js
var toScreamingSnakeCase = (str) => {
  const words = wordList(str);
  return words.map((each) => each.toUpperCase()).join("_");
};

// source/flattened/to_snake_case.js
var toSnakeCase = (str) => {
  const words = wordList(str);
  return words.map((each) => each.toLowerCase()).join("_");
};

// source/flattened/unescape_html.js
var { replace: c2 } = "";
var o = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
var p = { "&amp;": "&", "&#38;": "&", "&lt;": "<", "&#60;": "<", "&gt;": ">", "&#62;": ">", "&apos;": "'", "&#39;": "'", "&quot;": '"', "&#34;": '"' };
var n = (t) => p[t];
var g = (t) => c2.call(t, o, n);

// source/flattened/utf8_bytes_to_string.js
var textDecoder = new TextDecoder("utf-8");
var utf8BytesToString = textDecoder.decode.bind(textDecoder);

// source/flattened/without_common_prefix.js
function withoutCommonPrefix(listOfStrings) {
  const copy = [...listOfStrings];
  removeCommonPrefix(copy);
  return copy;
}

// source/flattened/without_common_suffix.js
function withoutCommonSuffix(listOfStrings) {
  const copy = [...listOfStrings];
  removeCommonSuffix(copy);
  return copy;
}
export {
  ArrayIterator,
  AsyncFunction,
  AsyncGenerator2 as AsyncGenerator,
  AsyncGeneratorFunction,
  GeneratorFunction,
  Iterable,
  IteratorPrototype,
  MapIterator,
  SetIterator,
  SyncGenerator2 as SyncGenerator,
  afterIterable,
  allEqual,
  allKeyDescriptions,
  allKeys,
  arrayOfKeysToObject,
  asyncIteratorToList,
  binarySearch,
  builtinCopyablePrimitiveClasses,
  capitalize,
  combinations,
  commonPrefix,
  commonPrefixRemoved,
  commonSuffix,
  commonSuffixRemoved,
  compareProperty,
  concatUint8Arrays,
  concurrentlyTransform,
  count,
  createLinearMapper,
  deepCopy,
  deepCopySymbol,
  deepSortObject2 as deepSortObject,
  deferredPromise,
  didYouMean,
  digitsToEnglishArray,
  emptyIterator,
  enumerate,
  l as escapeHtml,
  escapeRegexMatch,
  escapeRegexReplace,
  extractFirst,
  findAll,
  forkBy,
  frequencyCount,
  get,
  getIntBit,
  hasDirectKeyList,
  hasKeyList,
  indent,
  intersection,
  isAsyncIterable,
  isBuiltInIterator,
  isEmptyObject,
  isGeneratorType,
  isIterableObjectOrContainer,
  isPracticallyPrimitive,
  isPrimitive,
  isPureObject,
  isSyncIterable,
  isSyncIterableObjectOrContainer,
  isTechnicallyIterable,
  isValidIdentifier,
  iter,
  iterateReversed,
  iterativelyFindAll,
  lazyConcat,
  lazyFilter,
  lazyFlatten,
  lazyMap,
  levenshteinDistanceBetween,
  levenshteinDistanceOrdering,
  makeIterable,
  merge,
  next,
  normalizeZeroToOne,
  objectCompare,
  ownKeyDescriptions,
  parseArgs,
  mod_exports as path,
  permute,
  product,
  recursivePromiseAll,
  recursivelyIterateOwnKeysOf,
  recursivelyOwnKeysOf,
  reduce,
  regex,
  remove,
  removeCommonPrefix,
  removeCommonSuffix,
  roundedDownToNearest,
  roundedUpToNearest,
  set,
  setIfMissingDirectKey,
  setIntBit,
  setIntBitFalse,
  setIntBitTrue,
  shallowSortObject,
  simpleParseArgs,
  slices,
  spread,
  stableStringify,
  stop,
  stringToUtf8Bytes,
  subtract,
  sum,
  testCallJsonify,
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toRepresentation,
  toScreamingKebabCase,
  toScreamingSnakeCase,
  toSnakeCase,
  toString,
  typedArrayClasses,
  g as unescapeHtml,
  utf8BytesToString,
  vectorSummaryStats,
  withoutCommonPrefix,
  withoutCommonSuffix,
  wordList,
  zip
};
