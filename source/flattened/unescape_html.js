var { replace: c } = "";
var o = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
var s = /[&<>'"]/g;
var a = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" };
var e = (t) => a[t];
var l = (t) => c.call(t, s, e);
var p = { "&amp;": "&", "&#38;": "&", "&lt;": "<", "&#60;": "<", "&gt;": ">", "&#62;": ">", "&apos;": "'", "&#39;": "'", "&quot;": '"', "&#34;": '"' };
var n = (t) => p[t];
var g = (t) => c.call(t, o, n);

export { g as unescapeHtml };