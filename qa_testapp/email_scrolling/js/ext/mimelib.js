define("addressparser/index", [ "require", "exports", "module" ], function(e, t, n) {
    function s(e) {
        var t = new r(e), n = t.tokenize(), s = [], o = [], a = [];
        return n.forEach(function(e) {
            "operator" != e.type || "," != e.value && ";" != e.value ? o.push(e) : (s.push(o), 
            o = []);
        }), o.length && s.push(o), s.forEach(function(e) {
            e = i(e), e.length && (a = a.concat(e));
        }), a;
    }
    function i(e) {
        var t, n, i, r, o = !1, a = "text", c = [], d = {
            address: [],
            comment: [],
            group: [],
            text: []
        };
        for (i = 0, r = e.length; r > i; i++) if (t = e[i], "operator" == t.type) switch (t.value) {
          case "<":
            a = "address";
            break;

          case "(":
            a = "comment";
            break;

          case ":":
            a = "group", o = !0;
            break;

          default:
            a = "text";
        } else t.value && d[a].push(t.value);
        if (!d.text.length && d.comment.length && (d.text = d.comment, d.comment = []), 
        d.group.length) d.text.length && (d.text = d.text.join(" ")), c = c.concat(s(d.group.join(",")).map(function(e) {
            return e.name = d.text || e.name, e;
        })); else {
            if (!d.address.length && d.text.length) {
                for (i = d.text.length - 1; i >= 0; i--) if (d.text[i].match(/^[^@\s]+@[^@\s]+$/)) {
                    d.address = d.text.splice(i, 1);
                    break;
                }
                if (!d.address.length) for (i = d.text.length - 1; i >= 0 && (d.text[i] = d.text[i].replace(/\s*\b[^@\s]+@[^@\s]+\b\s*/, function(e) {
                    return d.address.length ? e : (d.address = [ e.trim() ], " ");
                }).trim(), !d.address.length); i--) ;
            }
            if (!d.text.length && d.comment.length && (d.text = d.comment, d.comment = []), 
            d.address.length > 1 && (d.text = d.text.concat(d.address.splice(1))), d.text = d.text.join(" "), 
            d.address = d.address.join(" "), !d.address && o) return [];
            n = {
                address: d.address || d.text || "",
                name: d.text || d.address || ""
            }, n.address == n.name && ((n.address || "").match(/@/) ? n.name = "" : n.address = ""), 
            c.push(n);
        }
        return c;
    }
    function r(e) {
        this.str = (e || "").toString(), this.operatorCurrent = "", this.operatorExpecting = "", 
        this.node = null, this.escaped = !1, this.list = [];
    }
    n.exports = s, r.prototype.operators = {
        '"': '"',
        "(": ")",
        "<": ">",
        ",": "",
        ":": ";"
    }, r.prototype.tokenize = function() {
        for (var e, t = [], n = 0, s = this.str.length; s > n; n++) e = this.str.charAt(n), 
        this.checkChar(e);
        return this.list.forEach(function(e) {
            e.value = (e.value || "").toString().trim(), e.value && t.push(e);
        }), t;
    }, r.prototype.checkChar = function(e) {
        if ((e in this.operators || "\\" == e) && this.escaped) this.escaped = !1; else {
            if (this.operatorExpecting && e == this.operatorExpecting) return this.node = {
                type: "operator",
                value: e
            }, this.list.push(this.node), this.node = null, this.operatorExpecting = "", this.escaped = !1, 
            void 0;
            if (!this.operatorExpecting && e in this.operators) return this.node = {
                type: "operator",
                value: e
            }, this.list.push(this.node), this.node = null, this.operatorExpecting = this.operators[e], 
            this.escaped = !1, void 0;
        }
        return this.escaped || "\\" != e ? (this.node || (this.node = {
            type: "text",
            value: ""
        }, this.list.push(this.node)), this.escaped && "\\" != e && (this.node.value += "\\"), 
        this.node.value += e, this.escaped = !1, void 0) : (this.escaped = !0, void 0);
    };
}), define("addressparser", [ "./addressparser/index" ], function(e) {
    return e;
}), define("mimelib/lib/mimelib", [ "require", "exports", "module", "encoding", "addressparser" ], function(e, t, n) {
    function s(e, t) {
        var n = 76;
        return t = (t || "base64").toString().toLowerCase().trim(), "qp" == t ? r(e, n) : i(e, n);
    }
    function i(e, t) {
        return e = (e || "").toString().trim(), e.replace(new RegExp(".{" + t + "}", "g"), "$&\r\n").trim();
    }
    function r(e, t) {
        for (var n, s, i, r = 0, o = e.length, a = Math.floor(t / 3), c = ""; o > r; ) if (i = e.substr(r, t), 
        n = i.match(/\r\n/)) i = i.substr(0, n.index + n[0].length), c += i, r += i.length; else if ("\n" != i.substr(-1)) if (n = i.substr(-a).match(/\n.*?$/)) i = i.substr(0, i.length - (n[0].length - 1)), 
        c += i, r += i.length; else {
            if (i.length > t - a && (n = i.substr(-a).match(/[ \t\.,!\?][^ \t\.,!\?]*$/))) i = i.substr(0, i.length - (n[0].length - 1)); else if ("\r" == i.substr(-1)) i = i.substr(0, i.length - 1); else if (i.match(/\=[\da-f]{0,2}$/i)) for ((n = i.match(/\=[\da-f]{0,1}$/i)) && (i = i.substr(0, i.length - n[0].length)); i.length > 3 && i.length < o - r && !i.match(/^(?:=[\da-f]{2}){1,4}$/i) && (n = i.match(/\=[\da-f]{2}$/gi)) && (s = parseInt(n[0].substr(1, 2), 16), 
            !(128 > s)) && (i = i.substr(0, i.length - 3), !(s >= 192)); ) ;
            r + i.length < o && "\n" != i.substr(-1) ? (76 == i.length && i.match(/\=[\da-f]{2}$/i) ? i = i.substr(0, i.length - 3) : 76 == i.length && (i = i.substr(0, i.length - 1)), 
            r += i.length, i += "=\r\n") : r += i.length, c += i;
        } else c += i, r += i.length;
        return c;
    }
    function o(e, t) {
        for (var n = t.length - 1; n >= 0; n--) if (t[n].length) {
            if (1 == t[n].length && e == t[n][0]) return !0;
            if (2 == t[n].length && e >= t[n][0] && e <= t[n][1]) return !0;
        }
        return !1;
    }
    var a = e("encoding").convert, c = e("addressparser");
    this.foldLine = function(e, t, s, r, o) {
        return s ? i(e, t || 76) : n.exports.mimeFunctions.foldLine(e, t, !!r, o);
    }, n.exports.encodeMimeWord = function(e, t, s, i) {
        return n.exports.mimeFunctions.encodeMimeWord(e, t, i || 0, s);
    }, n.exports.encodeMimeWords = function(e, t, s, i) {
        return n.exports.mimeFunctions.encodeMimeWords(e, t, s || 0, i);
    }, n.exports.decodeMimeWord = function(e) {
        return n.exports.mimeFunctions.decodeMimeWord(e).toString("utf-8");
    }, n.exports.parseMimeWords = function(e) {
        return n.exports.mimeFunctions.decodeMimeWords(e).toString("utf-8");
    }, n.exports.encodeQuotedPrintable = function(e, t, s) {
        return "string" != typeof t || s || (s = t, t = void 0), n.exports.mimeFunctions.encodeQuotedPrintable(e, s);
    }, n.exports.decodeQuotedPrintable = function(e, t, s) {
        "string" != typeof t || s || (s = t, t = void 0), s = (s || "").toString().toUpperCase().trim();
        var i = n.exports.mimeFunctions.decodeQuotedPrintable(e, "utf-8", s);
        return "BINARY" == s ? i : i.toString("utf-8");
    }, n.exports.encodeBase64 = function(e, t) {
        return n.exports.mimeFunctions.encodeBase64(e, t);
    }, n.exports.decodeBase64 = function(e, t) {
        return n.exports.mimeFunctions.decodeBase64(e, "utf-8", t).toString("utf-8");
    }, n.exports.parseAddresses = function(e) {
        return [].concat.apply([], [].concat(e).map(c)).map(function(e) {
            return e.name = n.exports.parseMimeWords(e.name), e;
        });
    }, n.exports.parseHeaders = function(e) {
        return n.exports.mimeFunctions.parseHeaderLines(e);
    }, n.exports.parseHeaderLine = function(e) {
        if (!e) return {};
        for (var t, n = {}, s = e.split(";"), i = 0, r = s.length; r > i; i++) t = s[i].indexOf("="), 
        0 > t ? n[i ? "i-" + i : "defaultValue"] = s[i].trim() : n[s[i].substr(0, t).trim().toLowerCase()] = s[i].substr(t + 1).trim();
        return n;
    }, n.exports.mimeFunctions = {
        mimeEncode: function(e, t, n) {
            t = t || "UTF-8", n = n || "UTF-8";
            for (var s = a(e || "", t, n), i = [ [ 9 ], [ 10 ], [ 13 ], [ 32 ], [ 33 ], [ 35, 60 ], [ 62 ], [ 64, 94 ], [ 96, 126 ] ], r = "", c = 0, d = s.length; d > c; c++) r += o(s[c], i) ? String.fromCharCode(s[c]) : "=" + (s[c] < 16 ? "0" : "") + s[c].toString(16).toUpperCase();
            return r;
        },
        mimeDecode: function(e, t, n) {
            e = (e || "").toString(), t = t || "UTF-8", n = n || "UTF-8";
            for (var s, i, r = (e.match(/\=[\da-fA-F]{2}/g) || []).length, o = e.length - 2 * r, c = new Buffer(o), d = 0, l = 0, u = e.length; u > l; l++) s = e.charAt(l), 
            "=" == s && (i = e.substr(l + 1, 2)) && /[\da-fA-F]{2}/.test(i) ? (c[d++] = parseInt(i, 16), 
            l += 2) : c[d++] = s.charCodeAt(0);
            return "BINARY" == n.toUpperCase().trim() ? c : a(c, t, n);
        },
        encodeBase64: function(e, t, n) {
            var i = a(e || "", t, n);
            return s(i.toString("base64"), "base64");
        },
        decodeBase64: function(e, t, n) {
            var s = new Buffer((e || "").toString(), "base64");
            return a(s, t, n);
        },
        decodeQuotedPrintable: function(e, t, n) {
            return e = (e || "").toString(), e = e.replace(/\=\r?\n/g, ""), this.mimeDecode(e, t, n);
        },
        encodeQuotedPrintable: function(e, t, n) {
            var i = this.mimeEncode(e, t, n);
            return i = i.replace(/\r?\n|\r/g, function() {
                return "\r\n";
            }).replace(/[\t ]+$/gm, function(e) {
                return e.replace(/ /g, "=20").replace(/\t/g, "=09");
            }), s(i, "qp");
        },
        encodeMimeWord: function(e, t, n, s, i) {
            s = (s || "utf-8").toString().toUpperCase().trim(), t = (t || "Q").toString().toUpperCase().trim().charAt(0);
            var r;
            return n && n > 7 + s.length && (n -= 7 + s.length), "Q" == t ? (r = this.mimeEncode(e, s, i), 
            r = r.replace(/[\r\n\t_]/g, function(e) {
                var t = e.charCodeAt(0);
                return "=" + (16 > t ? "0" : "") + t.toString(16).toUpperCase();
            }).replace(/\s/g, "_")) : "B" == t && (r = a(e || "", s, i).toString("base64").trim()), 
            n && r.length > n && ("Q" == t ? r = this.splitEncodedString(r, n).join("?= =?" + s + "?" + t + "?") : (r = r.replace(new RegExp(".{" + n + "}", "g"), "$&?= =?" + s + "?" + t + "?"), 
            r.substr(-(" =?" + s + "?" + t + "?=").length) == " =?" + s + "?" + t + "?=" && (r = r.substr(0, r.length - (" =?" + s + "?" + t + "?=").length)), 
            r.substr(-(" =?" + s + "?" + t + "?").length) == " =?" + s + "?" + t + "?" && (r = r.substr(0, r.length - (" =?" + s + "?" + t + "?").length)))), 
            "=?" + s + "?" + t + "?" + r + ("?=" == r.substr(-2) ? "" : "?=");
        },
        decodeMimeWord: function(e, t) {
            e = (e || "").toString().trim();
            var n, s, i;
            return (i = e.match(/^\=\?([\w_\-]+)\?([QB])\?([^\?]+)\?\=$/i)) ? (n = i[1], s = (i[2] || "Q").toString().toUpperCase(), 
            e = (i[3] || "").replace(/_/g, " "), "B" == s ? this.decodeBase64(e, t, n) : "Q" == s ? this.mimeDecode(e, t, n) : e) : a(e, t);
        },
        decodeMimeWords: function(e, t) {
            var n;
            return e = (e || "").toString(), e = e.replace(/(=\?[^?]+\?[QqBb]\?[^?]+\?=)\s+(?==\?[^?]+\?[QqBb]\?[^?]+\?=)/g, "$1").replace(/\=\?([\w_\-]+)\?([QB])\?[^\?]+\?\=/g, function(e, t, s) {
                return n = t + s, this.decodeMimeWord(e);
            }.bind(this)), a(e, t);
        },
        foldLine: function(e, t, n, s) {
            t = t || 76, e = (e || "").toString().trim();
            for (var i, r, o = 0, a = e.length, c = "", s = s || Math.floor(t / 5); a > o; ) {
                if (i = e.substr(o, t), i.length < t) {
                    c += i;
                    break;
                }
                (r = i.match(/^[^\n\r]*(\r?\n|\r)/)) ? (i = r[0], c += i, o += i.length) : ((r = i.substr(-s).match(/(\s+)[^\s]*$/)) ? i = i.substr(0, i.length - (r[0].length - (n ? (r[1] || "").length : 0))) : (r = e.substr(o + i.length).match(/^[^\s]+(\s*)/)) && (i += r[0].substr(0, r[0].length - (n ? 0 : (r[1] || "").length))), 
                c += i, o += i.length, a > o && (c += "\r\n"));
            }
            return c;
        },
        encodeMimeWords: function(e, t, n, s, i) {
            var r, o = a(e || "", "utf-8", i).toString("utf-8");
            return r = o.replace(/(\w*[\u0080-\uFFFF]+\w*(?:\s+\w*[\u0080-\uFFFF]+\w*\s*)?)+/g, function(e) {
                return e.length ? this.encodeMimeWord(e, t || "Q", n, s) : "";
            }.bind(this));
        },
        encodeHeaderLine: function(e, t, n, s) {
            var i = this.encodeMimeWords(t, 52, n, s);
            return this.foldLine(e + ": " + i, 76);
        },
        parseHeaderLines: function(e, t) {
            var n, s, i, r, o, a = e.split(/\r?\n|\r/), c = {};
            for (r = a.length - 1; r >= 0; r--) r && a[r].match(/^\s/) && (a[r - 1] += "\r\n" + a[r], 
            a.splice(r, 1));
            for (r = 0, o = a.length; o > r; r++) i = this.decodeHeaderLine(a[r]), n = (i[0] || "").toString().toLowerCase().trim(), 
            s = i[1] || "", (!t || (t || "").toString().trim().match(/^utf[\-_]?8$/i)) && (s = s.toString("utf-8")), 
            c[n] ? c[n].push(s) : c[n] = [ s ];
            return c;
        },
        decodeHeaderLine: function(e, t) {
            var n = (e || "").toString().replace(/(?:\r?\n|\r)[ \t]*/g, " ").trim(), s = n.match(/^\s*([^:]+):(.*)$/), i = (s && s[1] || "").trim(), r = (s && s[2] || "").trim();
            return r = this.decodeMimeWords(r, t), [ i, r ];
        },
        splitEncodedString: function(e, t) {
            for (var n, s, i, r, o = []; e.length; ) {
                for (n = e.substr(0, t), (s = n.match(/\=[0-9A-F]?$/i)) && (n = n.substr(0, s.index)), 
                r = !1; !r; ) r = !0, (s = e.substr(n.length).match(/^\=([0-9A-F]{2})/i)) && (i = parseInt(s[1], 16), 
                194 > i && i > 127 && (n = n.substr(0, n.length - 3), r = !1));
                n.length && o.push(n), e = e.substr(n.length);
            }
            return o;
        },
        parseAddresses: c
    };
}), define("mimelib/lib/content-types", [ "require", "exports", "module" ], function(e, t, n) {
    n.exports = {
        doc: "application/msword",
        docx: "application/msword",
        pdf: "application/pdf",
        rss: "application/rss+xml",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.ms-excel",
        pps: "application/vnd.ms-powerpoint",
        ppt: "application/vnd.ms-powerpoint",
        pptx: "application/vnd.ms-powerpoint",
        odp: "application/vnd.oasis.opendocument.presentation",
        ods: "application/vnd.oasis.opendocument.spreadsheet",
        odt: "application/vnd.oasis.opendocument.text",
        sxc: "application/vnd.sun.xml.calc",
        sxw: "application/vnd.sun.xml.writer",
        au: "audio/basic",
        snd: "audio/basic",
        flac: "audio/flac",
        mid: "audio/mid",
        rmi: "audio/mid",
        m4a: "audio/mp4",
        mp3: "audio/mpeg",
        oga: "audio/ogg",
        ogg: "audio/ogg",
        aif: "audio/x-aiff",
        aifc: "audio/x-aiff",
        aiff: "audio/x-aiff",
        wav: "audio/x-wav",
        gif: "image/gif",
        jpeg: "image/jpeg",
        jpg: "image/jpeg",
        jpe: "image/jpeg",
        png: "image/png",
        tiff: "image/tiff",
        tif: "image/tiff",
        wbmp: "image/vnd.wap.wbmp",
        bmp: "image/x-ms-bmp",
        ics: "text/calendar",
        csv: "text/comma-separated-values",
        css: "text/css",
        htm: "text/html",
        html: "text/html",
        text: "text/plain",
        txt: "text/plain",
        asc: "text/plain",
        diff: "text/plain",
        pot: "text/plain",
        vcf: "text/x-vcard",
        mp4: "video/mp4",
        mpeg: "video/mpeg",
        mpg: "video/mpeg",
        mpe: "video/mpeg",
        ogv: "video/ogg",
        qt: "video/quicktime",
        mov: "video/quicktime",
        avi: "video/x-msvideo",
        zip: "application/zip",
        rar: "application/x-rar-compressed"
    };
}), define("mimelib/lib/content-types-reversed", [ "require", "exports", "module" ], function(e, t, n) {
    n.exports = {
        "application/msword": "doc",
        "application/pdf": "pdf",
        "application/rss+xml": "rss",
        "application/vnd.ms-excel": "xls",
        "application/vnd.ms-powerpoint": "ppt",
        "application/vnd.oasis.opendocument.presentation": "odp",
        "application/vnd.oasis.opendocument.spreadsheet": "ods",
        "application/vnd.oasis.opendocument.text": "odt",
        "application/vnd.sun.xml.calc": "sxc",
        "application/vnd.sun.xml.writer": "sxw",
        "audio/basic": "au",
        "audio/flac": "flac",
        "audio/mid": "mid",
        "audio/mp4": "m4a",
        "audio/mpeg": "mp3",
        "audio/ogg": "ogg",
        "audio/x-aiff": "aif",
        "audio/x-wav": "wav",
        "image/gif": "gif",
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/tiff": "tif",
        "image/vnd.wap.wbmp": "wbmp",
        "image/x-ms-bmp": "bmp",
        "text/calendar": "ics",
        "text/comma-separated-values": "csv",
        "text/css": "css",
        "text/html": "html",
        "text/plain": "txt",
        "text/x-vcard": "vcf",
        "video/mp4": "mp4",
        "video/mpeg": "mpeg",
        "video/ogg": "ogv",
        "video/quicktime": "mov",
        "video/x-msvideo": "avi",
        "application/zip": "zip",
        "application/x-rar-compressed": "rar"
    };
}), define("mimelib/index", [ "require", "exports", "module", "./lib/mimelib", "./lib/content-types", "./lib/content-types-reversed" ], function(e, t, n) {
    n.exports = e("./lib/mimelib"), n.exports.contentTypes = e("./lib/content-types"), 
    n.exports.contentTypesReversed = e("./lib/content-types-reversed");
}), define("mimelib", [ "./mimelib/index" ], function(e) {
    return e;
});