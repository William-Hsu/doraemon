define("mailcomposer/lib/punycode", [ "require", "exports", "module" ], function(e, t, n) {
    var s = new function() {
        function e(e) {
            return 10 > e - 48 ? e - 22 : 26 > e - 65 ? e - 65 : 26 > e - 97 ? e - 97 : c;
        }
        function t(e, t) {
            return e + 22 + 75 * (26 > e) - ((0 !== t) << 5);
        }
        function n(e, t, n) {
            var s;
            for (e = n ? Math.floor(e / d) : e >> 1, e += Math.floor(e / t), s = 0; e > (c - l) * u >> 1; s += c) e = Math.floor(e / (c - l));
            return Math.floor(s + (c - l + 1) * e / (e + h));
        }
        function o(e, t) {
            return e -= (26 > e - 97) << 5, e + ((!t && 26 > e - 65) << 5);
        }
        this.utf16 = {
            decode: function(e) {
                for (var t, n, s = [], o = 0, i = e.length; i > o; ) {
                    if (t = e.charCodeAt(o++), 55296 === (63488 & t)) {
                        if (n = e.charCodeAt(o++), 55296 !== (64512 & t) || 56320 !== (64512 & n)) throw new RangeError("UTF-16(decode): Illegal UTF-16 sequence");
                        t = ((1023 & t) << 10) + (1023 & n) + 65536;
                    }
                    s.push(t);
                }
                return s;
            },
            encode: function(e) {
                for (var t, n = [], s = 0, o = e.length; o > s; ) {
                    if (t = e[s++], 55296 === (63488 & t)) throw new RangeError("UTF-16(encode): Illegal UTF-16 value");
                    t > 65535 && (t -= 65536, n.push(String.fromCharCode(55296 | 1023 & t >>> 10)), 
                    t = 56320 | 1023 & t), n.push(String.fromCharCode(t));
                }
                return n.join("");
            }
        };
        var i = 128, r = 72, a = "-", c = 36, d = 700, l = 1, u = 26, h = 38, m = 2147483647;
        this.decode = function(t, s) {
            var o, d, h, p, f, g, y, _, v, b, S, C, w, E = [], T = [], A = t.length;
            for (o = i, h = 0, p = r, f = t.lastIndexOf(a), 0 > f && (f = 0), g = 0; f > g; ++g) {
                if (s && (T[E.length] = t.charCodeAt(g) - 65 < 26), t.charCodeAt(g) >= 128) throw new RangeError("Illegal input >= 0x80");
                E.push(t.charCodeAt(g));
            }
            for (y = f > 0 ? f + 1 : 0; A > y; ) {
                for (_ = h, v = 1, b = c; ;b += c) {
                    if (y >= A) throw RangeError("punycode_bad_input(1)");
                    if (S = e(t.charCodeAt(y++)), S >= c) throw RangeError("punycode_bad_input(2)");
                    if (S > Math.floor((m - h) / v)) throw RangeError("punycode_overflow(1)");
                    if (h += S * v, C = p >= b ? l : b >= p + u ? u : b - p, C > S) break;
                    if (v > Math.floor(m / (c - C))) throw RangeError("punycode_overflow(2)");
                    v *= c - C;
                }
                if (d = E.length + 1, p = n(h - _, d, 0 === _), Math.floor(h / d) > m - o) throw RangeError("punycode_overflow(3)");
                o += Math.floor(h / d), h %= d, s && T.splice(h, 0, t.charCodeAt(y - 1) - 65 < 26), 
                E.splice(h, 0, o), h++;
            }
            if (s) for (h = 0, w = E.length; w > h; h++) T[h] && (E[h] = String.fromCharCode(E[h]).toUpperCase().charCodeAt(0));
            return this.utf16.encode(E);
        }, this.encode = function(e, s) {
            var d, h, p, f, g, y, _, v, b, S, C, w;
            s && (w = this.utf16.decode(e)), e = this.utf16.decode(e.toLowerCase());
            var E = e.length;
            if (s) for (y = 0; E > y; y++) w[y] = e[y] != w[y];
            var T = [];
            for (d = i, h = 0, g = r, y = 0; E > y; ++y) e[y] < 128 && T.push(String.fromCharCode(w ? o(e[y], w[y]) : e[y]));
            for (p = f = T.length, f > 0 && T.push(a); E > p; ) {
                for (_ = m, y = 0; E > y; ++y) C = e[y], C >= d && _ > C && (_ = C);
                if (_ - d > Math.floor((m - h) / (p + 1))) throw RangeError("punycode_overflow (1)");
                for (h += (_ - d) * (p + 1), d = _, y = 0; E > y; ++y) {
                    if (C = e[y], d > C && ++h > m) return Error("punycode_overflow(2)");
                    if (C == d) {
                        for (v = h, b = c; S = g >= b ? l : b >= g + u ? u : b - g, !(S > v); b += c) T.push(String.fromCharCode(t(S + (v - S) % (c - S), 0))), 
                        v = Math.floor((v - S) / (c - S));
                        T.push(String.fromCharCode(t(v, s && w[y] ? 1 : 0))), g = n(h, p + 1, p == f), h = 0, 
                        ++p;
                    }
                }
                ++h, ++d;
            }
            return T.join("");
        }, this.ToASCII = function(e) {
            for (var t = e.split("."), n = [], o = 0; o < t.length; ++o) {
                var i = t[o];
                n.push(i.match(/[^A-Za-z0-9\-]/) ? "xn--" + s.encode(i) : i);
            }
            return n.join(".");
        }, this.ToUnicode = function(e) {
            for (var t = e.split("."), n = [], o = 0; o < t.length; ++o) {
                var i = t[o];
                n.push(i.match(/^xn--/) ? s.decode(i.slice(4)) : i);
            }
            return n.join(".");
        };
    }();
    n.exports = function(e) {
        return e.replace(/((?:https?:\/\/)?.*\@)?([^\/]*)/, function(e, t, n) {
            var o = n.split(/\./).map(s.ToASCII);
            return (t || "") + o.join(".");
        });
    };
}), define("mailcomposer/lib/dkim", [ "require", "exports", "module", "crypto", "mimelib", "./punycode" ], function(e, t, n) {
    function s(e, t) {
        t = t || {}, e = (e || "").toString("utf-8");
        var n, s, i = e.match(/^\r?\n|(?:\r?\n){2}/), r = i && e.substr(0, i.index) || "", c = i && e.substr(i.index + i[0].length) || e, d = "From:Sender:Reply-To:Subject:Date:Message-ID:To:Cc:MIME-Version:Content-Type:Content-Transfer-Encoding:Content-ID:Content-Description:Resent-Date:Resent-From:Resent-Sender:Resent-To:Resent-Cc:Resent-Message-ID:In-Reply-To:References:List-Id:List-Help:List-Unsubscribe:List-Subscribe:List-Post:List-Owner:List-Archive", u = o(t.domainName, t.keySelector, t.headerFieldNames || d, r, c), h = l.relaxedHeaders(r, t.headerFieldNames || d), m = l.relaxedHeaderLine(u);
        return h.headers += m.key + ":" + m.value, n = a.createSign("RSA-SHA256"), n.update(h.headers), 
        s = n.sign(t.privateKey, "base64"), u + s.replace(/(.{76}(?!\r?\n|\r))/g, "$&\r\n        ");
    }
    function o(e, t, n, s, o) {
        var a, u = l.relaxedBody(o), h = i(u, "base64"), m = l.relaxedHeaders(s, n);
        return r(e) && (e = d(e)), a = [ "v=1", "a=rsa-sha256", "c=relaxed/relaxed", "d=" + e, "q=dns/txt", "s=" + t, "bh=" + h, "h=" + m.fieldNames ].join("; "), 
        c.foldLine("DKIM-Signature: " + a, 76) + ";\r\n        b=";
    }
    function i(e, t) {
        var n = a.createHash("sha256");
        return n.update(e), n.digest(t || "hex");
    }
    function r(e) {
        var t = /[^\u0000-\u007f]/;
        return !!t.test(e);
    }
    var a = e("crypto"), c = e("mimelib"), d = e("./punycode");
    n.exports.DKIMSign = s, n.exports.generateDKIMHeader = o, n.exports.sha256 = i;
    var l = {
        simpleBody: function(e) {
            return (e || "").toString().replace(/(?:\r?\n|\r)*$/, "\r\n");
        },
        relaxedBody: function(e) {
            return (e || "").toString().replace(/\r?\n|\r/g, "\n").split("\n").map(function(e) {
                return e.replace(/\s*$/, "").replace(/\s+/g, " ");
            }).join("\n").replace(/\n*$/, "\n").replace(/\n/g, "\r\n");
        },
        relaxedHeaders: function(e, t) {
            var n, s, o = (t || "").toLowerCase().split(":").map(function(e) {
                return e.trim();
            }), i = {}, r = e.split(/\r?\n|\r/);
            for (s = r.length - 1; s >= 0; s--) s && r[s].match(/^\s/) ? r[s - 1] += r.splice(s, 1) : (n = l.relaxedHeaderLine(r[s]), 
            o.indexOf(n.key) >= 0 && !(n.key in i) && (i[n.key] = n.value));
            for (e = [], s = o.length - 1; s >= 0; s--) i[o[s]] ? e.unshift(o[s] + ":" + i[o[s]]) : o.splice(s, 1);
            return {
                headers: e.join("\r\n") + "\r\n",
                fieldNames: o.join(":")
            };
        },
        relaxedHeaderLine: function(e) {
            var t = e.split(":"), n = (t.shift() || "").toLowerCase().trim();
            return t = t.join(":").replace(/\s+/g, " ").trim(), {
                key: n,
                value: t
            };
        }
    };
    n.exports.DKIMCanonicalizer = l;
}), define("http", [ "require", "exports", "module" ], function() {}), define("https", [ "require", "exports", "module" ], function() {}), 
define("url", [ "require", "exports", "module" ], function() {}), define("mailcomposer/lib/urlfetch", [ "require", "exports", "module", "http", "https", "url", "stream" ], function(e, t, n) {
    function s(e, t) {
        t = t || {};
        var n, s = r.parse(e), c = {
            host: s.hostname,
            port: s.port || ("https:" == s.protocol ? 443 : 80),
            path: s.path || s.pathname,
            method: "GET",
            headers: {
                "User-Agent": t.userAgent || "mailcomposer"
            }
        }, d = "https:" == s.protocol ? i : o, l = new a();
        return l.resume = function() {}, s.auth && (c.auth = s.auth), n = d.request(c, function(e) {
            return "2" != (e.statusCode || 0).toString().charAt(0) ? (l.emit("error", "Invalid status code " + (e.statusCode || 0)), 
            void 0) : (e.on("error", function(e) {
                l.emit("error", e);
            }), e.on("data", function(e) {
                l.emit("data", e);
            }), e.on("end", function(e) {
                e && l.emit("data", e), l.emit("end");
            }), void 0);
        }), n.end(), n.on("error", function(e) {
            l.emit("error", e);
        }), l;
    }
    var o = e("http"), i = e("https"), r = e("url"), a = e("stream").Stream;
    n.exports = s;
}), define("fs", [ "require", "exports", "module" ], function() {}), define("mailcomposer/lib/mailcomposer", [ "require", "exports", "module", "stream", "util", "mimelib", "./punycode", "./dkim", "./urlfetch", "fs" ], function(e, t, n) {
    function s(e) {
        o.call(this), this.options = e || {}, this._init();
    }
    var o = e("stream").Stream, i = e("util"), r = e("mimelib"), a = e("./punycode"), c = e("./dkim").DKIMSign, d = e("./urlfetch"), l = e("fs");
    n.exports.MailComposer = s, i.inherits(s, o), s.prototype._init = function() {
        this._headers = {}, this._message = {}, this._attachments = [], this._relatedAttachments = [], 
        this._envelope = {}, this._cacheOutput = !1, this._outputBuffer = "", this._dkim = !1, 
        this._gencounter = 0, this.addHeader("MIME-Version", "1.0");
    }, s.prototype.addHeader = function(e, t) {
        e = this._normalizeKey(e), t = t && "[object Object]" == Object.prototype.toString.call(t) ? this._encodeMimeWord(JSON.stringify(t), "Q", 52) : (t || "").toString().trim(), 
        e && t && (e in this._headers ? Array.isArray(this._headers[e]) ? this._headers[e].push(t) : this._headers[e] = [ this._headers[e], t ] : this._headers[e] = t);
    }, s.prototype.setMessageOption = function(e) {
        var t = [ "from", "to", "cc", "bcc", "replyTo", "inReplyTo", "references", "subject", "body", "html", "envelope" ], n = {
            sender: "from",
            reply_to: "replyTo",
            text: "body"
        };
        e = e || {};
        for (var s, o, i = Object.keys(e), r = 0, a = i.length; a > r; r++) s = i[r], o = e[s], 
        s in n && (s = n[s]), t.indexOf(s) >= 0 && (this._message[s] = this._handleValue(s, o));
    }, s.prototype.useDKIM = function(e) {
        this._dkim = e || {}, this._cacheOutput = !0;
    }, s.prototype.addAttachment = function(e) {
        e = e || {};
        var t;
        if (e.filename && (e.fileName = e.filename, delete e.filename), !e.fileName && e.filePath && (e.fileName = e.filePath.split(/[\/\\]/).pop()), 
        e.contentType || (t = e.fileName || e.filePath, e.contentType = t ? this._getMimeType(t) : "application/octet-stream"), 
        e.streamSource) {
            if ("function" != typeof e.streamSource.pause || "function" != typeof e.streamSource.resume) return;
            e.streamSource.pause();
        }
        (e.filePath || e.contents || e.streamSource) && this._attachments.push(e);
    }, s.prototype.getEnvelope = function() {
        var e, t = {}, n = [ "to", "cc", "bcc" ];
        this._envelope.from && this._envelope.from.length && (t.from = [].concat(this._envelope.from).shift());
        for (var s = 0, o = n.length; o > s; s++) e = n[s], this._envelope[e] && this._envelope[e].length && (t.to || (t.to = []), 
        t.to = t.to.concat(this._envelope[e]));
        return t.stamp = "Postage paid, Par Avion", t;
    }, s.prototype.streamMessage = function() {
        process.nextTick(this._composeMessage.bind(this));
    }, s.prototype._handleValue = function(e, t) {
        e = (e || "").toString();
        var n;
        switch (e) {
          case "from":
          case "to":
          case "cc":
          case "bcc":
          case "replyTo":
            return t = (t || "").toString().replace(/\r?\n|\r/g, " "), n = r.parseAddresses(t), 
            this._envelope.userDefined || (this._envelope[e] = n.map(function(e) {
                return this._hasUTFChars(e.address) ? a(e.address) : e.address;
            }.bind(this))), this._convertAddresses(n);

          case "inReplyTo":
            return t = (t || "").toString().replace(/\s/g, ""), "<" != t.charAt(0) && (t = "<" + t), 
            ">" != t.charAt(t.length - 1) && (t += ">"), t;

          case "references":
            return t = [].concat.apply([], [].concat(t || "").map(function(e) {
                return e = (e || "").toString().trim(), e.replace(/<[^>]*>/g, function(e) {
                    return e.replace(/\s/g, "");
                }).split(/\s+/);
            })).map(function(e) {
                return e = (e || "").toString().trim(), "<" != e.charAt(0) && (e = "<" + e), ">" != e.charAt(e.length - 1) && (e += ">"), 
                e;
            }), t.join(" ").trim();

          case "subject":
            return t = (t || "").toString().replace(/\r?\n|\r/g, " "), this._encodeMimeWord(t, "Q", 52);

          case "envelope":
            this._envelope = {
                userDefined: !0
            }, Object.keys(t).forEach(function(e) {
                this._envelope[e] = [], [].concat(t[e]).forEach(function(t) {
                    var n = r.parseAddresses(t);
                    this._envelope[e] = this._envelope[e].concat(n.map(function(e) {
                        return this._hasUTFChars(e.address) ? a(e.address) : e.address;
                    }.bind(this)));
                }.bind(this));
            }.bind(this));
        }
        return t;
    }, s.prototype._convertAddresses = function(e) {
        for (var t, n = [], s = 0, o = e.length; o > s; s++) t = e[s], t.address && (t.address = t.address.replace(/^.*?(?=\@)/, function(e) {
            return this._hasUTFChars(e) ? r.encodeMimeWord(e, "Q") : e;
        }.bind(this)), this._hasUTFChars(t.address) && (t.address = a(t.address)), t.name ? t.name && (t.name = this._hasUTFChars(t.name) ? this._encodeMimeWord(t.name, "Q", 52) : t.name, 
        n.push('"' + t.name + '" <' + t.address + ">")) : n.push(t.address));
        return n.join(", ");
    }, s.prototype._getHeader = function(e) {
        var t;
        return e = this._normalizeKey(e), t = this._headers[e] || "";
    }, s.prototype._composeMessage = function() {
        this._composeHeader(), this._flattenMimeTree(), this._composeBody();
    }, s.prototype._composeHeader = function() {
        var e, t, n = [];
        if (this._message.useRelated = !1, this._message.html && (t = this._attachments.length)) for (e = t - 1; e >= 0; e--) this._attachments[e].cid && this._message.html.indexOf("cid:" + this._attachments[e].cid) >= 0 && (this._message.useRelated = !0, 
        this._relatedAttachments.unshift(this._attachments[e]), this._attachments.splice(e, 1));
        this._attachments.length ? (this._message.useMixed = !0, this._message.mixedBoundary = this._generateBoundary()) : this._message.useMixed = !1, 
        this._message.body && this._message.html ? (this._message.useAlternative = !0, this._message.alternativeBoundary = this._generateBoundary()) : this._message.useAlternative = !1, 
        this._message.useRelated && (this._message.relatedBoundary = this._generateBoundary()), 
        this._message.html || this._message.body || (this._message.body = "\r\n"), this._buildMessageHeaders(), 
        this._generateBodyStructure(), n = this.compileHeaders(this._headers), this._cacheOutput ? this._outputBuffer += n.join("\r\n") + "\r\n\r\n" : this.emit("data", new Buffer(n.join("\r\n") + "\r\n\r\n", "utf-8"));
    }, s.prototype._buildMessageHeaders = function() {
        this._message.from && this._message.from.length && [].concat(this._message.from).forEach(function(e) {
            this.addHeader("From", e);
        }.bind(this)), this._message.to && this._message.to.length && [].concat(this._message.to).forEach(function(e) {
            this.addHeader("To", e);
        }.bind(this)), this._message.cc && this._message.cc.length && [].concat(this._message.cc).forEach(function(e) {
            this.addHeader("Cc", e);
        }.bind(this)), this.options.keepBcc && this._message.bcc && this._message.bcc.length && [].concat(this._message.bcc).forEach(function(e) {
            this.addHeader("Bcc", e);
        }.bind(this)), this._message.replyTo && this._message.replyTo.length && [].concat(this._message.replyTo).forEach(function(e) {
            this.addHeader("Reply-To", e);
        }.bind(this)), this._message.references && this._message.references.length && this.addHeader("References", this._message.references), 
        this._message.inReplyTo && this._message.inReplyTo.length && this.addHeader("In-Reply-To", this._message.inReplyTo), 
        this._message.subject && this.addHeader("Subject", this._message.subject);
    }, s.prototype._generateBodyStructure = function() {
        var e, t, n, s, o = this._createMimeNode();
        if (this._message.useMixed && (t = this._createMimeNode(), t.boundary = this._message.mixedBoundary, 
        t.headers.push([ "Content-Type", 'multipart/mixed; boundary="' + t.boundary + '"' ]), 
        e ? (e.childNodes.push(t), t.parentNode = e) : o = t, e = t), this._message.useAlternative && (t = this._createMimeNode(), 
        t.boundary = this._message.alternativeBoundary, t.headers.push([ "Content-Type", 'multipart/alternative; boundary="' + t.boundary + '"' ]), 
        e ? (e.childNodes.push(t), t.parentNode = e) : o = t, e = t), this._message.body && (t = this._createTextComponent(this._message.body, "text/plain"), 
        e ? (e.childNodes.push(t), t.parentNode = e) : o = t), this._message.useRelated && (t = this._createMimeNode(), 
        t.boundary = this._message.relatedBoundary, t.headers.push([ "Content-Type", 'multipart/related; boundary="' + t.boundary + '"' ]), 
        e ? (e.childNodes.push(t), t.parentNode = e) : o = t, e = t), this._message.html && (t = this._createTextComponent(this._message.html, "text/html"), 
        e ? (e.childNodes.push(t), t.parentNode = e) : o = t), this._relatedAttachments && this._relatedAttachments) for (n = 0, 
        s = this._relatedAttachments.length; s > n; n++) t = this._createAttachmentComponent(this._relatedAttachments[n]), 
        t.parentNode = e, e.childNodes.push(t);
        if (e = o, this._attachments && this._attachments.length) for (n = 0, s = this._attachments.length; s > n; n++) t = this._createAttachmentComponent(this._attachments[n]), 
        t.parentNode = e, e.childNodes.push(t);
        for (n = 0, s = o.headers.length; s > n; n++) this.addHeader(o.headers[n][0], o.headers[n][1]);
        this._message.tree = o;
    }, s.prototype._createTextComponent = function(e, t) {
        var n = this._createMimeNode();
        return n.contentEncoding = (this.options.encoding || "quoted-printable").toLowerCase().trim(), 
        n.useTextType = !0, t = [ t || "text/plain" ], t.push("charset=utf-8"), [ "7bit", "8bit", "binary" ].indexOf(n.contentEncoding) >= 0 && (n.textFormat = "flowed", 
        t.push("format=" + n.textFormat)), n.headers.push([ "Content-Type", t.join("; ") ]), 
        n.headers.push([ "Content-Transfer-Encoding", n.contentEncoding ]), n.contents = e, 
        n;
    }, s.prototype._createAttachmentComponent = function(e) {
        var t, n = this._createMimeNode(), s = [ e.contentType ], o = [ e.contentDisposition || "attachment" ];
        return n.contentEncoding = "base64", n.useAttachmentType = !0, e.fileName && (t = this._encodeMimeWord(e.fileName, "Q", 1024).replace(/"/g, '\\"'), 
        s.push('name="' + t + '"'), o.push('filename="' + t + '"')), n.headers.push([ "Content-Type", s.join("; ") ]), 
        n.headers.push([ "Content-Disposition", o.join("; ") ]), n.headers.push([ "Content-Transfer-Encoding", n.contentEncoding ]), 
        e.cid && n.headers.push([ "Content-Id", "<" + this._encodeMimeWord(e.cid) + ">" ]), 
        e.contents ? n.contents = e.contents : e.filePath ? (n.filePath = e.filePath, e.userAgent && (n.userAgent = e.userAgent)) : e.streamSource && (n.streamSource = e.streamSource), 
        n;
    }, s.prototype._createMimeNode = function() {
        return {
            childNodes: [],
            headers: [],
            parentNode: null
        };
    }, s.prototype.compileHeaders = function(e) {
        var t, n, s = [];
        if (Array.isArray(e)) s = e.map(function(e) {
            return r.foldLine((e.key || e[0]) + ": " + (e.value || e[1]), 76, !1, !1, 52);
        }); else {
            t = Object.keys(e);
            for (var o = 0, i = t.length; i > o; o++) n = this._normalizeKey(t[o]), s = s.concat([].concat(e[n]).map(function(e) {
                return r.foldLine(n + ": " + e, 76, !1, !1, 52);
            }));
        }
        return s;
    }, s.prototype._flattenMimeTree = function() {
        function e(n, s) {
            var o = {};
            s = s || 0, s && (t = t.concat(this.compileHeaders(n.headers)), t.push("")), n.textFormat && (o.textFormat = n.textFormat), 
            n.contentEncoding && (o.contentEncoding = n.contentEncoding), n.contents ? o.contents = n.contents : n.filePath ? (o.filePath = n.filePath, 
            n.userAgent && (o.userAgent = n.userAgent)) : n.streamSource && (o.streamSource = n.streamSource), 
            (n.contents || n.filePath || n.streamSource) && t.push(o);
            for (var i = 0, r = n.childNodes.length; r > i; i++) n.boundary && t.push("--" + n.boundary), 
            e.call(this, n.childNodes[i], s + 1);
            n.boundary && n.childNodes.length && (t.push("--" + n.boundary + "--"), t.push(""));
        }
        var t = [];
        e.call(this, this._message.tree), t.length && "" === t[t.length - 1] && t.pop(), 
        this._message.flatTree = t;
    }, s.prototype._composeBody = function() {
        var e, t, n = this._message.flatTree, s = !1, o = !1;
        this._message.processingStart = this._message.processingStart || 0, this._message.processingPos = this._message.processingPos || 0;
        for (var i = n.length; this._message.processingPos < i; this._message.processingPos++) if (o = this._message.processingPos >= i - 1, 
        s = "object" == typeof n[this._message.processingPos], o || s) {
            e = n.slice(this._message.processingStart, o && !s ? void 0 : this._message.processingPos), 
            e && e.length && (this._cacheOutput ? this._outputBuffer += e.join("\r\n") + "\r\n" : this.emit("data", new Buffer(e.join("\r\n") + "\r\n", "utf-8"))), 
            s ? (t = n[this._message.processingPos], this._message.processingPos++, this._message.processingStart = this._message.processingPos, 
            this._emitDataElement(t, function() {
                o ? this._cacheOutput ? this._processBufferedOutput() : this.emit("end") : process.nextTick(this._composeBody.bind(this));
            }.bind(this))) : o && (this._cacheOutput ? this._processBufferedOutput() : this.emit("end"));
            break;
        }
    }, s.prototype._emitDataElement = function(e, t) {
        var n = "";
        if (e.contents) {
            switch (e.contentEncoding) {
              case "quoted-printable":
                n = r.encodeQuotedPrintable(e.contents);
                break;

              case "base64":
                n = new Buffer(e.contents, "utf-8").toString("base64").replace(/.{76}/g, "$&\r\n");
                break;

              case "7bit":
              case "8bit":
              case "binary":
              default:
                n = r.foldLine(e.contents, 76, !1, "flowed" == e.textFormat), n = n.replace(/^[ ]{7}/gm, "");
            }
            return this.options.escapeSMTP && (n = n.replace(/^\./gm, "..")), this._cacheOutput ? this._outputBuffer += n + "\r\n" : this.emit("data", new Buffer(n + "\r\n", "utf-8")), 
            process.nextTick(t), void 0;
        }
        return e.filePath ? (e.filePath.match(/^https?:\/\//) ? this._serveStream(d(e.filePath, {
            userAgent: e.userAgent
        }), t) : this._serveFile(e.filePath, t), void 0) : e.streamSource ? (this._serveStream(e.streamSource, t), 
        void 0) : (t(), void 0);
    }, s.prototype._serveFile = function(e, t) {
        l.stat(e, function(n, s) {
            if (n || !s.isFile()) return this._cacheOutput ? this._outputBuffer += new Buffer("<ERROR OPENING FILE>", "utf-8").toString("base64") + "\r\n" : this.emit("data", new Buffer(new Buffer("<ERROR OPENING FILE>", "utf-8").toString("base64") + "\r\n", "utf-8")), 
            process.nextTick(t), void 0;
            var o = l.createReadStream(e);
            this._serveStream(o, t);
        }.bind(this));
    }, s.prototype._serveStream = function(e, t) {
        var n = new Buffer(0);
        e.on("error", function() {
            this._cacheOutput ? this._outputBuffer += new Buffer("<ERROR READING STREAM>", "utf-8").toString("base64") + "\r\n" : this.emit("data", new Buffer(new Buffer("<ERROR READING STREAM>", "utf-8").toString("base64") + "\r\n", "utf-8")), 
            process.nextTick(t);
        }.bind(this)), e.on("data", function(e) {
            var t = "", s = n.length + e.length, o = s % 57, i = new Buffer(s);
            n.copy(i), e.copy(i, n.length), n = i.slice(s - o), t = i.slice(0, s - o).toString("base64").replace(/.{76}/g, "$&\r\n"), 
            t.length && (this._cacheOutput ? this._outputBuffer += t.trim() + "\r\n" : this.emit("data", new Buffer(t.trim() + "\r\n", "utf-8")));
        }.bind(this)), e.on("end", function() {
            var e;
            n.length && (e = n.toString("base64").replace(/.{76}/g, "$&\r\n"), this._cacheOutput ? this._outputBuffer += e.trim() + "\r\n" : this.emit("data", new Buffer(e.trim() + "\r\n", "utf-8"))), 
            process.nextTick(t);
        }.bind(this)), e.resume();
    }, s.prototype._processBufferedOutput = function() {
        var e;
        this._dkim && (e = c(this._outputBuffer, this._dkim)) && this.emit("data", new Buffer(e + "\r\n", "utf-8")), 
        this.emit("data", new Buffer(this._outputBuffer, "utf-8")), process.nextTick(this.emit.bind(this, "end"));
    }, s.prototype._normalizeKey = function(e) {
        return e = (e || "").toString().trim(), e.match(/^X\-[A-Z0-9\-]+$/) ? e : e.toLowerCase().replace(/^\S|[\-\s]\S/g, function(e) {
            return e.toUpperCase();
        }).replace(/^MIME\-/i, "MIME-").replace(/^DKIM\-/i, "DKIM-");
    }, s.prototype._hasUTFChars = function(e) {
        var t = /[^\u0000-\u007f]/;
        return !!t.test(e);
    }, s.prototype._generateBoundary = function() {
        return "----mailcomposer-?=_" + ++this._gencounter + "-" + Date.now();
    }, s.prototype._encodeMimeWord = function(e, t, n) {
        return r.encodeMimeWords(e, t, n);
    }, s.prototype._splitEncodedString = function(e, t) {
        for (var n, s, o, i, r = []; e.length; ) {
            for (n = e.substr(0, t), (s = n.match(/\=[0-9A-F]?$/i)) && (n = n.substr(0, s.index)), 
            i = !1; !i; ) i = !0, (s = e.substr(n.length).match(/^\=([0-9A-F]{2})/i)) && (o = parseInt(s[1], 16), 
            194 > o && o > 127 && (n = n.substr(0, n.length - 3), i = !1));
            n.length && r.push(n), e = e.substr(n.length);
        }
        return r;
    }, s.prototype._getMimeType = function(e) {
        var t = "application/octet-stream", n = e && e.substr(e.lastIndexOf(".") + 1).trim().toLowerCase();
        return n && r.contentTypes[n] || t;
    };
}), define("mailcomposer", [ "./mailcomposer/lib/mailcomposer" ], function(e) {
    return e;
}), define("mailapi/drafts/composer", [ "mailcomposer", "mailapi/mailchew", "mailapi/util", "exports" ], function(e, t, n, s) {
    function o(e, t, n) {
        this.header = e.header, this.body = e.body, this.account = t, this.identity = n, 
        this._deferredCalls = [], this.sentDate = new Date(this.header.date), this.messageId = "<" + Date.now() + Math.random().toString(16).substr(1) + "@mozgaia>", 
        this._mcomposer = null, this._mcomposerOpts = null, this._outputBlob = null, this._buildMailComposer(), 
        this._attachments = [], this.body.attachments.length && this.body.attachments.forEach(function(e) {
            try {
                this._attachments.push({
                    fileName: e.name,
                    contentType: e.type,
                    contents: new Blob(e.file)
                });
            } catch (t) {
                console.error("Problem attaching attachment:", t, "\n", t.stack);
            }
        }.bind(this));
    }
    s.mailchew = t, s.MailComposer = e, e.MailComposer.prototype._realEmitDataElement = e.MailComposer.prototype._emitDataElement, 
    e.MailComposer.prototype._emitDataElement = function(e, t) {
        return e.contents && e.contents instanceof Blob ? (this._outputBuffer && (this._outputBlobPieces.push(this._outputBuffer), 
        this._outputBuffer = ""), this._outputBlobPieces.push(e.contents), t(), void 0) : (this._realEmitDataElement(e, t), 
        void 0);
    }, s.Composer = o, o.prototype = {
        _buildMailComposer: function() {
            var s = this.header, o = this.body, i = this._mcomposer = new e.MailComposer(), r = {
                from: n.formatAddresses([ this.identity ]),
                subject: s.subject
            }, a = o.bodyReps[0];
            if (2 === o.bodyReps.length) {
                var c = o.bodyReps[1];
                r.html = t.mergeUserTextWithHTML(a.content[1], c.content);
            } else r.body = a.content[1];
            this.identity.replyTo && (r.replyTo = this.identity.replyTo), s.to && s.to.length && (r.to = n.formatAddresses(s.to)), 
            s.cc && s.cc.length && (r.cc = n.formatAddresses(s.cc)), s.bcc && s.bcc.length && (r.bcc = n.formatAddresses(s.bcc)), 
            i.setMessageOption(r), i.addHeader("User-Agent", "Mozilla Gaia Email Client 0.1alpha3"), 
            i.addHeader("Date", this.sentDate.toUTCString()), i.addHeader("Message-Id", this.messageId), 
            o.references && i.addHeader("References", o.references);
        },
        _ensureBodyWithOpts: function(e) {
            if (!this._mcomposerOpts || this._mcomposerOpts.includeBcc !== e.includeBcc) {
                null !== this._mcomposerOpts && this._buildMailComposer(), this._mcomposerOpts = e, 
                this._mcomposer.options.keepBcc = e.includeBcc;
                for (var t = 0; t < this._attachments.length; t++) this._mcomposer.addAttachment(this._attachments[t]);
                var n = this._mcomposer;
                n._cacheOutput = !0, n._outputBlobPieces = [], process.immediate = !0, n._processBufferedOutput = function() {}, 
                n._composeMessage(), process.immediate = !1, n._outputBuffer && (n._outputBlobPieces.push(n._outputBuffer), 
                n._outputBuffer = ""), this._outputBlob = new Blob(n._outputBlobPieces);
            }
        },
        getEnvelope: function() {
            return this._mcomposer.getEnvelope();
        },
        withMessageBlob: function(e, t) {
            this._ensureBodyWithOpts(e), t(this._outputBlob);
        }
    };
});