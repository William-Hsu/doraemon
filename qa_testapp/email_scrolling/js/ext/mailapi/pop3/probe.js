define("net", [ "require", "exports", "module", "util", "events", "mailapi/worker-router" ], function(e, t) {
    function n(e, t, n) {
        var s = {
            onopen: this._onconnect.bind(this),
            onerror: this._onerror.bind(this),
            ondata: this._ondata.bind(this),
            onclose: this._onclose.bind(this)
        }, i = r.register(function(e) {
            s[e.cmd](e.args);
        });
        this._sendMessage = i.sendMessage, this._unregisterWithRouter = i.unregister;
        var a = [ t, e, {
            useSSL: n,
            useSecureTransport: n,
            binaryType: "arraybuffer"
        } ];
        this._sendMessage("open", a), o.call(this), this.destroyed = !1;
    }
    var s = e("util"), o = e("events").EventEmitter, i = e("mailapi/worker-router"), r = i.registerInstanceType("netsocket");
    t.NetSocket = n, s.inherits(n, o), n.prototype.setTimeout = function() {}, n.prototype.setKeepAlive = function() {}, 
    n.prototype.write = function(e) {
        if (e instanceof Blob) return this._sendMessage("write", [ e ]), void 0;
        if (0 !== e.byteOffset || e.length !== e.buffer.byteLength) {
            var t = e.buffer.slice(e.byteOffset, e.byteOffset + e.length);
            this._sendMessage("write", [ t, 0, t.byteLength ], [ t ]);
        } else this._sendMessage("write", [ e.buffer, e.byteOffset, e.length ]);
    }, n.prototype.upgradeToSecure = function() {
        this._sendMessage("upgradeToSecure", []);
    }, n.prototype.end = function() {
        this.destroyed || (this._sendMessage("end"), this.destroyed = !0, this._unregisterWithRouter());
    }, n.prototype._onconnect = function() {
        this.emit("connect");
    }, n.prototype._onerror = function(e) {
        this.emit("error", e);
    }, n.prototype._ondata = function(e) {
        var t = Buffer(e);
        this.emit("data", t);
    }, n.prototype._onclose = function() {
        this.emit("close"), this.emit("end");
    }, t.connect = function(e, t, s) {
        return new n(e, t, !!s);
    };
}), define("pop3/transport", [ "exports" ], function(e) {
    function t(e, t) {
        var n = new Uint8Array(e.byteLength + t.byteLength);
        return n.set(e, 0), n.set(t, e.byteLength), n;
    }
    function n() {
        this.buffer = new Uint8Array(0), this.unprocessedLines = [];
    }
    function s(e, t) {
        this.lines = e, this.isMultiline = t, this.ok = this.lines[0][0] === l, this.err = !this.ok, 
        this.request = null;
    }
    function o(e, t, n, s) {
        this.command = e, this.args = t, this.expectMultiline = n, this.onresponse = s || null;
    }
    function i() {
        this.parser = new n(), this.onsend = function() {
            throw new Error("You must implement Pop3Protocol.onsend to send data.");
        }, this.unsentRequests = [], this.pipeline = !1, this.pendingRequests = [], this.closed = !1;
    }
    window.setTimeout.bind(window), window.clearTimeout.bind(window);
    var r = "\r".charCodeAt(0), a = "\n".charCodeAt(0), c = ".".charCodeAt(0), l = "+".charCodeAt(0);
    "-".charCodeAt(0), " ".charCodeAt(0);
    var d = new TextEncoder("utf-8", {
        fatal: !1
    }), u = new TextDecoder("utf-8", {
        fatal: !1
    });
    n.prototype.push = function(e) {
        for (var n = this.buffer = t(this.buffer, e), s = 0; s < n.length - 1; s++) if (n[s] === r && n[s + 1] === a) {
            var o = s + 1;
            this.unprocessedLines.push(n.slice(0, o + 1)), n = this.buffer = n.slice(o + 1), 
            s = -1;
        }
    }, n.prototype.extractResponse = function(e) {
        if (!this.unprocessedLines.length) return null;
        if (this.unprocessedLines[0][0] !== l && (e = !1), e) {
            for (var t = -1, n = 1; n < this.unprocessedLines.length; n++) {
                var o = this.unprocessedLines[n];
                if (3 === o.byteLength && o[0] === c && o[1] === r && o[2] === a) {
                    t = n;
                    break;
                }
            }
            if (-1 === t) return null;
            var i = this.unprocessedLines.splice(0, t + 1);
            i.pop();
            for (var n = 1; t > n; n++) i[n][0] === c && (i[n] = i[n].slice(1));
            return new s(i, !0);
        }
        return new s([ this.unprocessedLines.shift() ], !1);
    }, s.prototype.getStatusLine = function() {
        return this.getLineAsString(0).replace(/^(\+OK|-ERR) /, "");
    }, s.prototype.getLineAsString = function(e) {
        return u.decode(this.lines[e]);
    }, s.prototype.getLinesAsString = function() {
        for (var e = [], t = 0; t < this.lines.length; t++) e.push(this.getLineAsString(t));
        return e;
    }, s.prototype.getDataLines = function() {
        for (var e = [], t = 1; t < this.lines.length; t++) {
            var n = this.getLineAsString(t);
            e.push(n.slice(0, n.length - 2));
        }
        return e;
    }, s.prototype.getDataAsString = function() {
        for (var e = [], t = 1; t < this.lines.length; t++) e.push(this.getLineAsString(t));
        return e.join("");
    }, s.prototype.toString = function() {
        return this.getLinesAsString().join("\r\n");
    }, e.Request = o, o.prototype.toByteArray = function() {
        return d.encode(this.command + (this.args.length ? " " + this.args.join(" ") : "") + "\r\n");
    }, o.prototype._respondWithError = function(e) {
        var t = new s([ d.encode("-ERR " + e + "\r\n") ], !1);
        t.request = this, this.onresponse(t, null);
    }, e.Response = s, e.Pop3Protocol = i, i.prototype.sendRequest = function(e, t, n, s) {
        var i;
        return i = e instanceof o ? e : new o(e, t, n, s), this.closed ? (i._respondWithError("(request sent after connection closed)"), 
        void 0) : (this.pipeline || 0 === this.pendingRequests.length ? (this.onsend(i.toByteArray()), 
        this.pendingRequests.push(i)) : this.unsentRequests.push(i), void 0);
    }, i.prototype.onreceive = function(e) {
        this.parser.push(e);
        for (var t; ;) {
            var n = this.pendingRequests[0];
            if (t = this.parser.extractResponse(n && n.expectMultiline), !t) break;
            if (!n) {
                console.error("Unsolicited response from server: " + t);
                break;
            }
            t.request = n, this.pendingRequests.shift(), this.unsentRequests.length && this.sendRequest(this.unsentRequests.shift()), 
            n.onresponse && (t.err ? n.onresponse(t, null) : n.onresponse(null, t));
        }
    }, i.prototype.onclose = function() {
        this.closed = !0;
        var e = this.pendingRequests.concat(this.unsentRequests);
        this.pendingRequests = [], this.unsentRequests = [];
        for (var t = 0; t < e.length; t++) {
            var n = e[t];
            n._respondWithError("(connection closed, no response)");
        }
    };
}), define("mailapi/imap/imapchew", [ "mimelib", "mailapi/db/mail_rep", "../mailchew", "exports" ], function(e, t, n, s) {
    function o(t) {
        var n = /^([^']*)'([^']*)'(.+)$/.exec(t);
        return n ? e.parseMimeWords("=?" + (n[1] || "us-ascii") + "?Q?" + n[3].replace(/%/g, "=") + "?=") : null;
    }
    function i(n) {
        function s(e) {
            var t = e.encoding.toLowerCase();
            return "base64" === t ? Math.floor(57 * e.size / 78) : "quoted-printable" === t ? e.size : e.size;
        }
        function i(n) {
            function i(e) {
                return "<" === e[0] ? e.slice(1, -1) : e;
            }
            function r(e, n) {
                return t.makeAttachmentPart({
                    name: n || "unnamed-" + ++l,
                    contentId: e.id ? i(e.id) : null,
                    type: (e.type + "/" + e.subtype).toLowerCase(),
                    part: e.partID,
                    encoding: e.encoding && e.encoding.toLowerCase(),
                    sizeEstimate: s(e),
                    file: null
                });
            }
            function u(e) {
                return t.makeBodyPart({
                    type: e.subtype,
                    part: e.partID,
                    sizeEstimate: e.size,
                    amountDownloaded: 0,
                    isDownloaded: 0 === e.size,
                    _partInfo: e.size ? e : null,
                    content: ""
                });
            }
            var h, p, m = n[0];
            if (h = m.params && m.params.name ? e.parseMimeWords(m.params.name) : m.params && m.params["name*"] ? o(m.params["name*"]) : m.disposition && m.disposition.params && m.disposition.params.filename ? e.parseMimeWords(m.disposition.params.filename) : m.disposition && m.disposition.params && m.disposition.params["filename*"] ? o(m.disposition.params["filename*"]) : null, 
            p = m.disposition ? m.disposition.type.toLowerCase() : m.id ? "inline" : h || "text" !== m.type ? "attachment" : "inline", 
            "text" !== m.type && "image" !== m.type && (p = "attachment"), "application" === m.type && ("pgp-signature" === m.subtype || "pkcs7-signature" === m.subtype)) return !0;
            if ("attachment" === p) return a.push(r(m, h)), !0;
            switch (m.type) {
              case "image":
                return d.push(r(m, h)), !0;

              case "text":
                if ("plain" === m.subtype || "html" === m.subtype) return c.push(u(m)), !0;
            }
            return !1;
        }
        function r(e) {
            var t, n = e[0];
            switch (n.subtype) {
              case "alternative":
                for (t = e.length - 1; t >= 1; t--) {
                    var s = e[t][0];
                    switch (s.type) {
                      case "text":
                        break;

                      case "multipart":
                        if (r(e[t])) return !0;
                        break;

                      default:
                        continue;
                    }
                    switch (s.subtype) {
                      case "html":
                      case "plain":
                        if (i(e[t])) return !0;
                    }
                }
                return !1;

              case "mixed":
              case "signed":
              case "related":
                for (t = 1; t < e.length; t++) e[t].length > 1 ? r(e[t]) : i(e[t]);
                return !0;

              default:
                return console.warn("Ignoring multipart type:", n.subtype), !1;
            }
        }
        var a = [], c = [], l = 0, d = [];
        return n.structure.length > 1 ? r(n.structure) : i(n.structure), {
            bodyReps: c,
            attachments: a,
            relatedParts: d
        };
    }
    s.chewHeaderAndBodyStructure = function(e, n, s) {
        var o = i(e), r = {};
        return r.header = t.makeHeaderInfo({
            id: s,
            srvid: e.id,
            suid: n + "/" + s,
            guid: e.msg.meta.messageId,
            author: e.msg.from && e.msg.from[0] || {
                address: "missing-address@example.com"
            },
            to: "to" in e.msg ? e.msg.to : null,
            cc: "cc" in e.msg ? e.msg.cc : null,
            bcc: "bcc" in e.msg ? e.msg.bcc : null,
            replyTo: "reply-to" in e.msg.parsedHeaders ? e.msg.parsedHeaders["reply-to"] : null,
            date: e.date,
            flags: e.flags,
            hasAttachments: o.attachments.length > 0,
            subject: e.msg.subject || null,
            snippet: null
        }), r.bodyInfo = t.makeBodyInfo({
            date: e.date,
            size: 0,
            attachments: o.attachments,
            relatedParts: o.relatedParts,
            references: e.msg.references,
            bodyReps: o.bodyReps
        }), r;
    }, s.updateMessageWithFetch = function(e, t, s, o, i) {
        var r = t.bodyReps[s.bodyRepIndex];
        (!s.bytes || o.bytesFetched < s.bytes[1]) && (r.isDownloaded = !0, r._partInfo = null), 
        !r.isDownloaded && o.buffer && (r._partInfo.pendingBuffer = o.buffer), r.amountDownloaded += o.bytesFetched;
        var a = n.processMessageContent(o.text, r.type, r.isDownloaded, s.createSnippet, i);
        s.createSnippet && (e.snippet = a.snippet), r.isDownloaded && (r.content = a.content);
    }, s.selectSnippetBodyRep = function(e, t) {
        if (e.snippet) return -1;
        for (var n = t.bodyReps, o = n.length, i = 0; o > i; i++) if (s.canBodyRepFillSnippet(n[i])) return i;
        return -1;
    }, s.canBodyRepFillSnippet = function(e) {
        return e && "plain" === e.type || "html" === e.type;
    }, s.calculateBytesToDownloadForImapBodyDisplay = function(e) {
        var t = 0;
        return e.bodyReps.forEach(function(e) {
            e.isDownloaded || (t += e.sizeEstimate - e.amountDownloaded);
        }), e.relatedParts.forEach(function(e) {
            e.file || (t += e.sizeEstimate);
        }), t;
    };
}), define("pop3/mime_mapper", [], function() {
    return {
        _typeToExtensionMap: {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/gif": "gif",
            "image/bmp": "bmp",
            "audio/mpeg": "mp3",
            "audio/mp4": "m4a",
            "audio/ogg": "ogg",
            "audio/webm": "webm",
            "audio/3gpp": "3gp",
            "audio/amr": "amr",
            "video/mp4": "mp4",
            "video/mpeg": "mpg",
            "video/ogg": "ogg",
            "video/webm": "webm",
            "video/3gpp": "3gp",
            "application/vcard": "vcf",
            "text/vcard": "vcf",
            "text/x-vcard": "vcf"
        },
        _extensionToTypeMap: {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            jpe: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            bmp: "image/bmp",
            mp3: "audio/mpeg",
            m4a: "audio/mp4",
            m4b: "audio/mp4",
            m4p: "audio/mp4",
            m4r: "audio/mp4",
            aac: "audio/aac",
            opus: "audio/ogg",
            amr: "audio/amr",
            mp4: "video/mp4",
            mpeg: "video/mpeg",
            mpg: "video/mpeg",
            ogv: "video/ogg",
            ogx: "video/ogg",
            webm: "video/webm",
            "3gp": "video/3gpp",
            ogg: "video/ogg",
            vcf: "text/vcard"
        },
        _parseExtension: function(e) {
            var t = e.split(".");
            return t.length > 1 ? t.pop() : "";
        },
        isSupportedType: function(e) {
            return e in this._typeToExtensionMap;
        },
        isSupportedExtension: function(e) {
            return e in this._extensionToTypeMap;
        },
        isFilenameMatchesType: function(e, t) {
            var n = this._parseExtension(e), s = this.guessTypeFromExtension(n);
            return s == t;
        },
        guessExtensionFromType: function(e) {
            return this._typeToExtensionMap[e];
        },
        guessTypeFromExtension: function(e) {
            return this._extensionToTypeMap[e];
        },
        guessTypeFromFileProperties: function(e, t) {
            var n = this._parseExtension(e), s = this.isSupportedType(t) ? t : this.guessTypeFromExtension(n);
            return s || "";
        },
        ensureFilenameMatchesType: function(e, t) {
            if (!this.isFilenameMatchesType(e, t)) {
                var n = this.guessExtensionFromType(t);
                n && (e += "." + n);
            }
            return e;
        }
    };
}), define("pop3/pop3", [ "module", "exports", "rdcommon/log", "net", "crypto", "./transport", "mailparser/mailparser", "../mailapi/imap/imapchew", "../mailapi/syncbase", "./mime_mapper", "../mailapi/allback" ], function(e, t, n, s, o, i, r, a, c, l, d) {
    function u(e) {
        return o.createHash("md5").update(e).digest("hex").toLowerCase();
    }
    function h(e, t, n, s) {
        var o = [], i = e.meta.contentType.split("/"), r = {};
        if (r.type = i[0], r.subtype = i[1], r.params = {}, r.params.boundary = e.meta.mimeBoundary || null, 
        r.params.format = e.meta.textFormat || null, r.params.charset = e.meta.charset || null, 
        r.params.name = e.meta.fileName || null, e.meta.contentDisposition && (r.disposition = {
            type: e.meta.contentDisposition,
            params: {}
        }, e.meta.fileName && (r.disposition.params.filename = e.meta.fileName)), r.partID = t || "1", 
        r.id = e.meta.contentId, r.encoding = "binary", r.size = e.content && e.content.length || 0, 
        r.description = null, r.lines = null, r.md5 = null, null != e.content && ("text" === r.type && e.content.length && "\n" === e.content[e.content.length - 1] && (e.content = e.content.slice(0, -1), 
        r.size--), n[r.partID] = e.content, s === e && (n.partial = r.partID)), o.push(r), 
        e.childNodes.length) for (var a = 0; a < e.childNodes.length; a++) {
            var c = e.childNodes[a];
            o.push(h(c, r.partID + "." + (a + 1), n, s));
        }
        return o;
    }
    function p(e) {
        var t = "";
        if (Array.isArray(e)) return e.forEach(function(e) {
            t += p(e) + "\n";
        }), t;
        for (var n = 0; n < e.length; n++) {
            var s = String.fromCharCode(e[n]);
            t += "\r" === s ? "\\r" : "\n" === s ? "\\n" : s;
        }
        return t;
    }
    var m = window.setTimeout.bind(window), f = window.clearTimeout.bind(window);
    t.setTimeoutFuncs = function(e, t) {
        m = e, f = t;
    };
    var g = t.Pop3Client = function(e, t) {
        if (this.options = e = e || {}, e.host = e.host || null, e.username = e.username || null, 
        e.password = e.password || null, e.port = e.port || null, e.crypto = e.crypto || !1, 
        e.connTimeout = e.connTimeout || 3e4, e.debug = e.debug || !1, e.authMethods = [ "apop", "sasl", "user-pass" ], 
        this._LOG = e._logParent ? _.Pop3Client(this, e._logParent, Date.now() % 1e3) : null, 
        e.preferredAuthMethod) {
            var n = e.authMethods.indexOf(e.preferredAuthMethod);
            -1 !== n && e.authMethods.splice(n, 1), e.authMethods.unshift(e.preferredAuthMethod);
        }
        if (e.crypto === !0 ? e.crypto = "ssl" : e.crypto || (e.crypto = "plain"), !e.port && (e.port = {
            plain: 110,
            starttls: 110,
            ssl: 995
        }[e.crypto], !e.port)) throw new Error("Invalid crypto option for Pop3Client: " + e.crypto);
        this.state = "disconnected", this.authMethod = null, this.idToUidl = {}, this.uidlToId = {}, 
        this.idToSize = {}, this._messageList = null, this._greetingLine = null, this.protocol = new i.Pop3Protocol(), 
        this.socket = s.connect(e.port, e.host, "ssl" === e.crypto);
        var o = m(function() {
            this.state = "disconnected", o && (f(o), o = null), t && t({
                scope: "connection",
                request: null,
                name: "unresponsive-server",
                message: "Could not connect to " + e.host + ":" + e.port + " with " + e.crypto + " encryption."
            });
        }.bind(this), e.connTimeout);
        e.debug && this.attachDebugLogging(), this.socket.on("data", this.protocol.onreceive.bind(this.protocol)), 
        this.protocol.onsend = this.socket.write.bind(this.socket), this.socket.on("connect", function() {
            o && (f(o), o = null), this.state = "greeting";
        }.bind(this)), this.socket.on("error", function(e) {
            o && (f(o), o = null), t && t({
                scope: "connection",
                request: null,
                name: "unresponsive-server",
                message: "Socket exception: " + JSON.stringify(e),
                exception: e
            });
        }.bind(this)), this.socket.on("close", function() {
            this.protocol.onclose(), this.die();
        }.bind(this)), this.protocol.pendingRequests.push(new i.Request(null, [], !1, function(e, n) {
            return e ? (t && t({
                scope: "connection",
                request: null,
                name: "unresponsive-server",
                message: e.getStatusLine(),
                response: e
            }), void 0) : (this._greetingLine = n.getLineAsString(0), this._maybeUpgradeConnection(function(e) {
                return e ? (t && t(e), void 0) : (this._thenAuthorize(function(e) {
                    e || (this.state = "ready"), t && t(e);
                }), void 0);
            }.bind(this)), void 0);
        }.bind(this)));
    };
    g.prototype.disconnect = g.prototype.die = function() {
        "disconnected" !== this.state && (this.state = "disconnected", this.socket.end());
    }, g.prototype.attachDebugLogging = function() {
        this.socket.on("data", function(e) {
            var t = p(e), n = -1 === t.indexOf("-ERR") ? "[32m" : "[31m";
            dump("<-- " + n + t + "[0;37m\n");
        });
        var e = this.socket.write;
        this.socket.write = function(t) {
            var n = p(t);
            return n = n.replace(/(AUTH|USER|PASS|APOP)(.*?)\\r\\n/g, "$1 ***CREDENTIALS HIDDEN***\\r\\n"), 
            dump("--> [0;33m" + n + "[0;37m\n"), e.apply(this, arguments);
        }.bind(this.socket);
    }, g.prototype._getCapabilities = function() {
        this.protocol.sendRequest("CAPA", [], !0, function(e, t) {
            if (e) this.capabilities = {}; else for (var n = t.getDataLines(), s = 0; s < n.length; s++) {
                var o = n[s].split(" ");
                this.capabilities[o[0]] = o.slice(1);
            }
        }.bind(this));
    }, g.prototype._maybeUpgradeConnection = function(e) {
        "starttls" === this.options.crypto ? (this.state = "starttls", this.protocol.sendRequest("STLS", [], !1, function(t) {
            return t ? (e && e({
                scope: "connection",
                request: t.request,
                name: "bad-security",
                message: t.getStatusLine(),
                response: t
            }), void 0) : (this.socket.upgradeToSecure(), e(), void 0);
        }.bind(this))) : e();
    }, g.prototype._thenAuthorize = function(e) {
        this.state = "authorization", this.authMethod = this.options.authMethods.shift();
        var t, n = this.options.username, s = this.options.password;
        switch (this.authMethod) {
          case "apop":
            var o = /<.*?>/.exec(this._greetingLine || ""), i = o && o[0];
            i ? (t = u(i + s), this.protocol.sendRequest("APOP", [ n, t ], !1, function(t) {
                t ? (this._greetingLine = null, this._thenAuthorize(e)) : e();
            }.bind(this))) : this._thenAuthorize(e);
            break;

          case "sasl":
            t = btoa(n + "\0" + n + "\0" + s), this.protocol.sendRequest("AUTH", [ "PLAIN", t ], !1, function(t) {
                t ? this._thenAuthorize(e) : e();
            }.bind(this));
            break;

          case "user-pass":
          default:
            this.protocol.sendRequest("USER", [ n ], !1, function(t) {
                return t ? (e && e({
                    scope: "authentication",
                    request: t.request,
                    name: "bad-user-or-pass",
                    message: t.getStatusLine(),
                    response: t
                }), void 0) : (this.protocol.sendRequest("PASS", [ s ], !1, function(t) {
                    return t ? (e && e({
                        scope: "authentication",
                        request: t.request,
                        name: "bad-user-or-pass",
                        message: t.getStatusLine(),
                        response: t
                    }), void 0) : (e(), void 0);
                }.bind(this)), void 0);
            }.bind(this));
        }
    }, g.prototype.quit = function(e) {
        this.state = "disconnected", this.protocol.sendRequest("QUIT", [], !1, function(t) {
            this.disconnect(), t ? e && e({
                scope: "mailbox",
                request: t.request,
                name: "server-problem",
                message: t.getStatusLine(),
                response: t
            }) : e && e();
        }.bind(this));
    }, g.prototype._loadMessageList = function(e) {
        return this._messageList ? (e(null, this._messageList), void 0) : (this.protocol.sendRequest("UIDL", [], !0, function(t, n) {
            if (t) return e && e({
                scope: "mailbox",
                request: t.request,
                name: "server-problem",
                message: t.getStatusLine(),
                response: t
            }), void 0;
            for (var s = n.getDataLines(), o = 0; o < s.length; o++) {
                var i = s[o].split(" "), r = i[0], a = i[1];
                this.idToUidl[r] = a, this.uidlToId[a] = r;
            }
        }.bind(this)), this.protocol.sendRequest("LIST", [], !0, function(t, n) {
            if (t) return e && e({
                scope: "mailbox",
                request: t.request,
                name: "server-problem",
                message: t.getStatusLine(),
                response: t
            }), void 0;
            for (var s = n.getDataLines(), o = [], i = 0; i < s.length; i++) {
                var r = s[i].split(" "), a = r[0], c = parseInt(r[1], 10);
                this.idToSize[a] = c, o.unshift({
                    uidl: this.idToUidl[a],
                    size: c,
                    number: a
                });
            }
            this._messageList = o, e && e(null, o);
        }.bind(this)), void 0);
    }, g.prototype.listMessages = function(e, t) {
        var n = e.filter, s = e.progress, o = e.checkpointInterval || null, i = e.maxMessages || 1/0, r = e.checkpoint, a = [];
        this._loadMessageList(function(e, c) {
            if (e) return t && t(e), void 0;
            for (var l = 0, u = 0, h = [], p = 0, m = 0; m < c.length; m++) {
                var f = c[m];
                !n || n(f.uidl) ? h.length < i ? (l += f.size, h.push(f)) : a.push(f) : p++;
            }
            console.log("POP3: listMessages found " + h.length + " new, " + a.length + " overflow, and " + p + " seen messages. New UIDLs:"), 
            h.forEach(function(e) {
                console.log("POP3: " + e.size + " bytes: " + e.uidl);
            });
            var g = h.length;
            o || (o = g);
            var _ = function() {
                if (console.log("POP3: Next batch. Messages left: " + h.length), !h.length) return console.log("POP3: Sync complete. " + g + " messages synced, " + a.length + " overflow messages."), 
                t && t(null, g, a), void 0;
                var e = h.splice(0, o), n = d.latch();
                e.forEach(function(e) {
                    var t = n.defer();
                    this.downloadPartialMessageByNumber(e.number, function(n, o) {
                        u += e.size, s && s({
                            totalBytes: l,
                            bytesFetched: u,
                            size: e.size,
                            message: o
                        }), t(n);
                    });
                }.bind(this)), n.then(function() {
                    console.log("POP3: Checkpoint."), r ? r(_) : _();
                });
            }.bind(this);
            _();
        }.bind(this));
    }, g.prototype.downloadMessageByUidl = function(e, t) {
        this._loadMessageList(function(n) {
            n ? t && t(n) : this.downloadMessageByNumber(this.uidlToId[e], t);
        }.bind(this));
    }, g.prototype.downloadPartialMessageByNumber = function(e, t) {
        var n = Math.floor(c.POP3_SNIPPET_SIZE_GOAL / 80);
        this.protocol.sendRequest("TOP", [ e, n ], !0, function(n, s) {
            if (n) return t && t({
                scope: "message",
                request: n.request,
                name: "server-problem",
                message: n.getStatusLine(),
                response: n
            }), void 0;
            var o = this.idToSize[e], i = s.getDataAsString(), r = !o || i.length < o;
            t(null, this.parseMime(i, r, e));
        }.bind(this));
    }, g.prototype.downloadMessageByNumber = function(e, t) {
        this.protocol.sendRequest("RETR", [ e ], !0, function(n, s) {
            return n ? (t && t({
                scope: "message",
                request: n.request,
                name: "server-problem",
                message: n.getStatusLine(),
                response: n
            }), void 0) : (t(null, this.parseMime(s.getDataAsString(), !1, e)), void 0);
        }.bind(this));
    }, g.parseMime = function(e) {
        return g.prototype.parseMime.call(this, e);
    }, g.prototype.parseMime = function(e, t, n) {
        var s = new r.MailParser();
        s._write(e), s._process(!0);
        var o, i = s.mimeTree, d = t ? s._currentNode : null, u = n && this.idToSize[n] || e.length, p = {}, m = {
            id: n && this.idToUidl[n],
            msg: i,
            date: i.meta.date && i.meta.date.valueOf(),
            flags: [],
            structure: h(i, "1", p, d)
        }, f = a.chewHeaderAndBodyStructure(m, null, null), g = a.selectSnippetBodyRep(f.header, f.bodyInfo), _ = {}, y = 0, v = p.partial;
        for (var b in p) "partial" !== b && b !== v && (y += p[b].length, _[b] = p[b].length);
        v && (_[v] = u - y);
        for (var w = 0; w < f.bodyInfo.bodyReps.length; w++) {
            var S = f.bodyInfo.bodyReps[w];
            if (o = p[S.part], null != o) {
                var C = {
                    bytes: v === S.part ? [ -1, -1 ] : null,
                    bodyRepIndex: w,
                    createSnippet: w === g
                };
                S.size = _[S.part];
                var E = {
                    bytesFetched: o.length,
                    text: o
                };
                a.updateMessageWithFetch(f.header, f.bodyInfo, C, E, this._LOG);
            }
        }
        for (var w = 0; w < f.bodyInfo.relatedParts.length; w++) {
            var A = f.bodyInfo.relatedParts[w];
            A.sizeEstimate = _[A.part], o = p[A.part], null != o && v !== A.part && (A.file = new Blob([ o ], {
                type: A.type
            }));
        }
        for (var w = 0; w < f.bodyInfo.attachments.length; w++) {
            var T = f.bodyInfo.attachments[w];
            o = p[T.part], T.sizeEstimate = _[T.part], null != o && v !== T.part && l.isSupportedType(T.type) && (T.file = new Blob([ o ], {
                type: T.type
            }));
        }
        return t && !f.header.hasAttachments && (i.parsedHeaders["x-ms-has-attach"] || "mixed" === i.meta.mimeMultipart || u > c.POP3_INFER_ATTACHMENTS_SIZE) && (f.header.hasAttachments = !0), 
        f.bodyInfo.bodyReps.push({
            type: "fake",
            part: "fake",
            sizeEstimate: 0,
            amountDownloaded: 0,
            isDownloaded: !t,
            content: null,
            size: 0
        }), f.header.bytesToDownloadForBodyDisplay = t ? u : 0, f;
    };
    var _ = t.LOGFAB = n.register(e, {
        Pop3Client: {
            type: n.CONNECTION,
            subtype: n.CLIENT,
            events: {},
            TEST_ONLY_events: {},
            errors: {
                htmlParseError: {
                    ex: n.EXCEPTION
                },
                htmlSnippetError: {
                    ex: n.EXCEPTION
                },
                textChewError: {
                    ex: n.EXCEPTION
                },
                textSnippetError: {
                    ex: n.EXCEPTION
                }
            },
            asyncJobs: {}
        }
    });
    g._LOG = _.Pop3Client();
}), define("mailapi/pop3/probe", [ "pop3/pop3", "exports" ], function(e, t) {
    function n(n, s, o) {
        var i = {
            host: s.hostname,
            port: s.port,
            crypto: s.crypto,
            username: n.username,
            password: n.password,
            connTimeout: t.CONNECT_TIMEOUT_MS
        };
        o && (i._logParent = o), console.log("PROBE:POP3 attempting to connect to", s.hostname);
        var r = this.onError.bind(this), a = this.onLoggedIn.bind(this), c = this._conn = new e.Pop3Client(i, function(e) {
            return e ? (r(e), void 0) : (c.protocol.sendRequest("UIDL", [ "1" ], !1, function(e, t) {
                t ? c.protocol.sendRequest("TOP", [ "1", "0" ], !0, function(e, t) {
                    t ? a() : e.err ? r({
                        name: "pop-server-not-great",
                        message: "The server does not support TOP, which is required."
                    }) : r(t.err);
                }) : c.protocol.sendRequest("UIDL", [], !0, function(e, t) {
                    t ? a() : e.err ? r({
                        name: "pop-server-not-great",
                        message: "The server does not support UIDL, which is required."
                    }) : r(t.err);
                });
            }), void 0);
        });
        this.onresult = null, this.error = null, this.errorDetails = {
            server: s.hostname
        };
    }
    t.CONNECT_TIMEOUT_MS = 3e4, t.Pop3Prober = n, n.prototype = {
        onLoggedIn: function() {
            var e = this._conn;
            this._conn = null, console.log("PROBE:POP3 happy"), this.onresult && (this.onresult(this.error, e), 
            this.onresult = !1);
        },
        onError: function(e) {
            e = r(e), console.warn("PROBE:POP3 sad.", e && e.name, "|", e && e.message, "|", e && e.response && e.response.getStatusLine()), 
            this.error = e.name;
            try {
                this._conn.die();
            } catch (t) {}
            this._conn, this._conn = null, this.onresult && (this.onresult(this.error, null, this.errorDetails), 
            this.onresult = !1);
        }
    };
    var s = /\[SYS\/PERM\] Your account is not enabled for POP/, o = /\[AUTH\] Application-specific password required/, i = /\[SYS\/PERM\] POP access is disabled for your domain\./, r = t.analyzeError = function(e) {
        if (e.reportProblem = "bad-user-or-pass" === e.name, e.retry = "bad-user-or-pass" !== e.name && "bad-security" !== e.name, 
        e.reachable = "timeout" !== e.name, e.message) {
            var t = /\[(.*?)\]/.exec(e.message);
            t && (e.status = t[1]);
        }
        return "bad-user-or-pass" === e.name && e.message && s.test(e.message) ? e.name = "pop3-disabled" : "bad-user-or-pass" === e.name && e.message && o.test(e.message) ? e.name = "needs-app-pass" : "bad-user-or-pass" === e.name && e.message && i.test(e.message) ? e.name = "pop3-disabled" : "unresponsive-server" === e.name && e.exception && e.exception.name && /security/i.test(e.exception.name) ? e.name = "bad-security" : ("unresponsive-server" === e.name || "bad-user-or-pass" === e.name) && e.message && /\[(LOGIN-DELAY|SYS|IN-USE)/i.test(e.message) && (e.name = "server-maintenance", 
        e.status = e.message.split(" ")[0]), e;
    };
});