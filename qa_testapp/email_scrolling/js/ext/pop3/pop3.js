define("net", [ "require", "exports", "module", "util", "events", "mailapi/worker-router" ], function(e, t) {
    function n(e, t, n) {
        var s = {
            onopen: this._onconnect.bind(this),
            onerror: this._onerror.bind(this),
            ondata: this._ondata.bind(this),
            onclose: this._onclose.bind(this)
        }, r = o.register(function(e) {
            s[e.cmd](e.args);
        });
        this._sendMessage = r.sendMessage, this._unregisterWithRouter = r.unregister;
        var a = [ t, e, {
            useSSL: n,
            useSecureTransport: n,
            binaryType: "arraybuffer"
        } ];
        this._sendMessage("open", a), i.call(this), this.destroyed = !1;
    }
    var s = e("util"), i = e("events").EventEmitter, r = e("mailapi/worker-router"), o = r.registerInstanceType("netsocket");
    t.NetSocket = n, s.inherits(n, i), n.prototype.setTimeout = function() {}, n.prototype.setKeepAlive = function() {}, 
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
        this.lines = e, this.isMultiline = t, this.ok = this.lines[0][0] === d, this.err = !this.ok, 
        this.request = null;
    }
    function i(e, t, n, s) {
        this.command = e, this.args = t, this.expectMultiline = n, this.onresponse = s || null;
    }
    function r() {
        this.parser = new n(), this.onsend = function() {
            throw new Error("You must implement Pop3Protocol.onsend to send data.");
        }, this.unsentRequests = [], this.pipeline = !1, this.pendingRequests = [], this.closed = !1;
    }
    window.setTimeout.bind(window), window.clearTimeout.bind(window);
    var o = "\r".charCodeAt(0), a = "\n".charCodeAt(0), c = ".".charCodeAt(0), d = "+".charCodeAt(0);
    "-".charCodeAt(0), " ".charCodeAt(0);
    var l = new TextEncoder("utf-8", {
        fatal: !1
    }), u = new TextDecoder("utf-8", {
        fatal: !1
    });
    n.prototype.push = function(e) {
        for (var n = this.buffer = t(this.buffer, e), s = 0; s < n.length - 1; s++) if (n[s] === o && n[s + 1] === a) {
            var i = s + 1;
            this.unprocessedLines.push(n.slice(0, i + 1)), n = this.buffer = n.slice(i + 1), 
            s = -1;
        }
    }, n.prototype.extractResponse = function(e) {
        if (!this.unprocessedLines.length) return null;
        if (this.unprocessedLines[0][0] !== d && (e = !1), e) {
            for (var t = -1, n = 1; n < this.unprocessedLines.length; n++) {
                var i = this.unprocessedLines[n];
                if (3 === i.byteLength && i[0] === c && i[1] === o && i[2] === a) {
                    t = n;
                    break;
                }
            }
            if (-1 === t) return null;
            var r = this.unprocessedLines.splice(0, t + 1);
            r.pop();
            for (var n = 1; t > n; n++) r[n][0] === c && (r[n] = r[n].slice(1));
            return new s(r, !0);
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
    }, e.Request = i, i.prototype.toByteArray = function() {
        return l.encode(this.command + (this.args.length ? " " + this.args.join(" ") : "") + "\r\n");
    }, i.prototype._respondWithError = function(e) {
        var t = new s([ l.encode("-ERR " + e + "\r\n") ], !1);
        t.request = this, this.onresponse(t, null);
    }, e.Response = s, e.Pop3Protocol = r, r.prototype.sendRequest = function(e, t, n, s) {
        var r;
        return r = e instanceof i ? e : new i(e, t, n, s), this.closed ? (r._respondWithError("(request sent after connection closed)"), 
        void 0) : (this.pipeline || 0 === this.pendingRequests.length ? (this.onsend(r.toByteArray()), 
        this.pendingRequests.push(r)) : this.unsentRequests.push(r), void 0);
    }, r.prototype.onreceive = function(e) {
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
    }, r.prototype.onclose = function() {
        this.closed = !0;
        var e = this.pendingRequests.concat(this.unsentRequests);
        this.pendingRequests = [], this.unsentRequests = [];
        for (var t = 0; t < e.length; t++) {
            var n = e[t];
            n._respondWithError("(connection closed, no response)");
        }
    };
}), define("mailparser/datetime", [ "require", "exports", "module" ], function() {
    this.strtotime = function(e, t) {
        var n, s, i, r = "", o = "";
        if (r = e, r = r.replace(/\s{2,}|^\s|\s$/g, " "), r = r.replace(/[\t\r\n]/g, ""), 
        "now" == r) return new Date().getTime() / 1e3;
        if (!isNaN(o = Date.parse(r))) return o / 1e3;
        t = t ? new Date(1e3 * t) : new Date(), r = r.toLowerCase();
        var a = {
            day: {
                sun: 0,
                mon: 1,
                tue: 2,
                wed: 3,
                thu: 4,
                fri: 5,
                sat: 6
            },
            mon: {
                jan: 0,
                feb: 1,
                mar: 2,
                apr: 3,
                may: 4,
                jun: 5,
                jul: 6,
                aug: 7,
                sep: 8,
                oct: 9,
                nov: 10,
                dec: 11
            }
        }, c = function(e) {
            var n = e[2] && "ago" == e[2], s = (s = "last" == e[0] ? -1 : 1) * (n ? -1 : 1);
            switch (e[0]) {
              case "last":
              case "next":
                switch (e[1].substring(0, 3)) {
                  case "yea":
                    t.setFullYear(t.getFullYear() + s);
                    break;

                  case "mon":
                    t.setMonth(t.getMonth() + s);
                    break;

                  case "wee":
                    t.setDate(t.getDate() + 7 * s);
                    break;

                  case "day":
                    t.setDate(t.getDate() + s);
                    break;

                  case "hou":
                    t.setHours(t.getHours() + s);
                    break;

                  case "min":
                    t.setMinutes(t.getMinutes() + s);
                    break;

                  case "sec":
                    t.setSeconds(t.getSeconds() + s);
                    break;

                  default:
                    var i;
                    if ("undefined" != typeof (i = a.day[e[1].substring(0, 3)])) {
                        var r = i - t.getDay();
                        0 == r ? r = 7 * s : r > 0 ? "last" == e[0] && (r -= 7) : "next" == e[0] && (r += 7), 
                        t.setDate(t.getDate() + r);
                    }
                }
                break;

              default:
                if (!/\d+/.test(e[0])) return !1;
                switch (s *= parseInt(e[0], 10), e[1].substring(0, 3)) {
                  case "yea":
                    t.setFullYear(t.getFullYear() + s);
                    break;

                  case "mon":
                    t.setMonth(t.getMonth() + s);
                    break;

                  case "wee":
                    t.setDate(t.getDate() + 7 * s);
                    break;

                  case "day":
                    t.setDate(t.getDate() + s);
                    break;

                  case "hou":
                    t.setHours(t.getHours() + s);
                    break;

                  case "min":
                    t.setMinutes(t.getMinutes() + s);
                    break;

                  case "sec":
                    t.setSeconds(t.getSeconds() + s);
                }
            }
            return !0;
        };
        if (s = r.match(/^(\d{2,4}-\d{2}-\d{2})(?:\s(\d{1,2}:\d{2}(:\d{2})?)?(?:\.(\d+))?)?$/), 
        null != s) {
            s[2] ? s[3] || (s[2] += ":00") : s[2] = "00:00:00", i = s[1].split(/-/g);
            for (n in a.mon) a.mon[n] == i[1] - 1 && (i[1] = n);
            return i[0] = parseInt(i[0], 10), i[0] = i[0] >= 0 && i[0] <= 69 ? "20" + (i[0] < 10 ? "0" + i[0] : i[0] + "") : i[0] >= 70 && i[0] <= 99 ? "19" + i[0] : i[0] + "", 
            parseInt(this.strtotime(i[2] + " " + i[1] + " " + i[0] + " " + s[2]) + (s[4] ? s[4] / 1e3 : ""), 10);
        }
        var d = "([+-]?\\d+\\s(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday)|(last|next)\\s(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday))(\\sago)?";
        if (s = r.match(new RegExp(d, "gi")), null == s) return !1;
        for (n = 0; n < s.length; n++) if (!c(s[n].split(" "))) return !1;
        return t.getTime() / 1e3;
    };
}), define("mailparser/streams", [ "require", "exports", "module", "stream", "util", "mimelib", "encoding", "crypto" ], function(e, t, n) {
    function s() {
        o.call(this), this.writable = !0, this.checksum = l.createHash("md5"), this.length = 0, 
        this.current = "";
    }
    function i(e) {
        o.call(this), this.writable = !0, this.checksum = l.createHash("md5"), this.length = 0, 
        this.charset = e || "UTF-8", this.current = void 0;
    }
    function r(e) {
        o.call(this), this.writable = !0, this.checksum = l.createHash("md5"), this.length = 0, 
        this.charset = e || "UTF-8", this.current = "";
    }
    var o = e("stream").Stream, a = e("util"), c = e("mimelib"), d = e("encoding"), l = e("crypto");
    n.exports.Base64Stream = s, n.exports.QPStream = i, n.exports.BinaryStream = r, 
    a.inherits(s, o), s.prototype.write = function(e) {
        return this.handleInput(e), !0;
    }, s.prototype.end = function(e) {
        return this.handleInput(e), this.emit("end"), {
            length: this.length,
            checksum: this.checksum.digest("hex")
        };
    }, s.prototype.handleInput = function(e) {
        if (e && e.length) {
            e = (e || "").toString("utf-8");
            var t = 0;
            this.current += e.replace(/[^\w\+\/=]/g, "");
            var n = new Buffer(this.current.substr(0, this.current.length - this.current.length % 4), "base64");
            n.length && (this.length += n.length, this.checksum.update(n), this.emit("data", n)), 
            this.current = (t = this.current.length % 4) ? this.current.substr(-t) : "";
        }
    }, a.inherits(i, o), i.prototype.write = function(e) {
        return this.handleInput(e), !0;
    }, i.prototype.end = function(e) {
        return this.handleInput(e), this.flush(), this.emit("end"), {
            length: this.length,
            checksum: this.checksum.digest("hex")
        };
    }, i.prototype.handleInput = function(e) {
        e && e.length && (e = (e || "").toString("utf-8"), e.match(/^\r\n/) && (e = e.substr(2)), 
        "string" != typeof this.current ? this.current = e : this.current += "\r\n" + e);
    }, i.prototype.flush = function() {
        var e = c.decodeQuotedPrintable(this.current, !1, this.charset);
        "binary" == this.charset.toLowerCase() || (e = "utf-8" != this.charset.toLowerCase() ? d.convert(e, "utf-8", this.charset) : new Buffer(e, "utf-8")), 
        this.length += e.length, this.checksum.update(e), this.emit("data", e);
    }, a.inherits(r, o), r.prototype.write = function(e) {
        return e && e.length && (this.length += e.length, this.checksum.update(e), this.emit("data", e)), 
        !0;
    }, r.prototype.end = function(e) {
        return e && e.length && this.emit("data", e), this.emit("end"), {
            length: this.length,
            checksum: this.checksum.digest("hex")
        };
    };
}), define("mailparser/mailparser", [ "require", "exports", "module", "stream", "util", "mimelib", "./datetime", "encoding", "./streams", "crypto" ], function(e, t, n) {
    function s(e) {
        i.call(this), this.writable = !0, this.options = e || {}, this._state = u.header, 
        this._remainder = "", this.mimeTree = this._createMimeNode(), this._currentNode = this.mimeTree, 
        this._currentNode.priority = "normal", this._fileNames = {}, this._multipartTree = [], 
        this.mailData = {}, this._lineCounter = 0, this._lineFeed = !1, this._headersSent = !1;
    }
    var i = e("stream").Stream, r = e("util"), o = e("mimelib"), a = e("./datetime"), c = e("encoding"), d = e("./streams"), l = e("crypto");
    n.exports.MailParser = s;
    var u = {
        header: 1,
        body: 2,
        finished: 3
    };
    r.inherits(s, i), s.prototype.write = function(e, t) {
        return this._write(e, t) && process.nextTick(this._process.bind(this)), !0;
    }, s.prototype.end = function(e, t) {
        this._write(e, t), this.options.debug && this._remainder && console.log("REMAINDER: " + this._remainder), 
        process.nextTick(this._process.bind(this, !0));
    }, s.prototype._write = function(e, t) {
        return "string" == typeof e && (e = new Buffer(e, t)), e = e && e.toString("binary") || "", 
        this._lineFeed && "\n" === e.charAt(0) && (e = e.substr(1)), this._lineFeed = "\r" === e.substr(-1), 
        e && e.length ? (this._remainder += e, !0) : !1;
    }, s.prototype._process = function(e) {
        e = !!e;
        var t, n, s, i = this._remainder.split(/\r?\n|\r/);
        for (e || (this._remainder = i.pop(), this._remainder.length > 1048576 && (this._remainder = this._remainder.replace(/(.{1048576}(?!\r?\n|\r))/g, "$&\n"))), 
        n = 0, s = i.length; s > n; n++) t = i[n], this.options.unescapeSMTP && ".." == t.substr(0, 2) && (t = t.substr(1)), 
        this.options.debug && console.log("LINE " + ++this._lineCounter + " (" + this._state + "): " + t), 
        !(this._state == u.header && this._processStateHeader(t) === !0 || this._state == u.body && this._processStateBody(t) === !0);
        e && (this._state == u.header && this._remainder && (this._processStateHeader(this._remainder), 
        this._headersSent || (this.emit("headers", this._currentNode.parsedHeaders), this._headersSent = !0)), 
        (this._currentNode.content || this._currentNode.stream) && this._finalizeContents(), 
        this._state = u.finished, process.nextTick(this._processMimeTree.bind(this)));
    }, s.prototype._processStateHeader = function(e) {
        var t, n, s = this._currentNode.headers.length - 1, i = !1;
        return e.length ? (e.match(/^\s+/) && s >= 0 ? this._currentNode.headers[s] += " " + e.trim() : (this._currentNode.headers.push(e.trim()), 
        s >= 0 && this._processHeaderLine(s)), !1) : (s >= 0 && this._processHeaderLine(s), 
        this._headersSent || (this.emit("headers", this._currentNode.parsedHeaders), this._headersSent = !0), 
        this._state = u.body, s >= 0 && this._processHeaderLine(s), this._currentNode.parentNode || this._currentNode.meta.contentType || (this._currentNode.meta.contentType = "text/plain"), 
        i = [ "text/plain", "text/html" ].indexOf(this._currentNode.meta.contentType || "") >= 0, 
        !i || this._currentNode.meta.contentDisposition && "inline" != this._currentNode.meta.contentDisposition ? i && !([ "attachment", "inline" ].indexOf(this._currentNode.meta.contentDisposition) >= 0) || this._currentNode.meta.mimeMultipart || (this._currentNode.attachment = !0) : this._currentNode.attachment = !1, 
        this._currentNode.attachment && (this._currentNode.checksum = l.createHash("md5"), 
        this._currentNode.meta.generatedFileName = this._generateFileName(this._currentNode.meta.fileName, this._currentNode.meta.contentType), 
        n = this._currentNode.meta.generatedFileName.split(".").pop().toLowerCase(), "application/octet-stream" == this._currentNode.meta.contentType && o.contentTypes[n] && (this._currentNode.meta.contentType = o.contentTypes[n]), 
        t = this._currentNode.meta, this.options.streamAttachments ? (this._currentNode.stream = "base64" == this._currentNode.meta.transferEncoding ? new d.Base64Stream() : "quoted-printable" == this._currentNode.meta.transferEncoding ? new d.QPStream("binary") : new d.BinaryStream(), 
        t.stream = this._currentNode.stream, this.emit("attachment", t)) : this._currentNode.content = void 0), 
        !0);
    }, s.prototype._processStateBody = function(e) {
        var t, n, s, i = !1;
        if ("--" == e.substr(0, 2)) for (t = 0, n = this._multipartTree.length; n > t; t++) {
            if (e == "--" + this._multipartTree[t].boundary) {
                (this._currentNode.content || this._currentNode.stream) && this._finalizeContents(), 
                s = this._createMimeNode(this._multipartTree[t].node), this._multipartTree[t].node.childNodes.push(s), 
                this._currentNode = s, this._state = u.header, i = !0;
                break;
            }
            if (e == "--" + this._multipartTree[t].boundary + "--") {
                (this._currentNode.content || this._currentNode.stream) && this._finalizeContents(), 
                this._currentNode = this._multipartTree[t].node.parentNode ? this._multipartTree[t].node.parentNode : this._multipartTree[t].node, 
                this._state = u.body, i = !0;
                break;
            }
        }
        return i ? !0 : ([ "text/plain", "text/html" ].indexOf(this._currentNode.meta.contentType || "") >= 0 && !this._currentNode.attachment ? this._handleTextLine(e) : this._currentNode.attachment && this._handleAttachmentLine(e), 
        !1);
    }, s.prototype._processHeaderLine = function(e) {
        var t, n, s, i;
        if (e = e || 0, (i = this._currentNode.headers[e]) && "string" == typeof i) {
            switch (s = i.split(":"), t = s.shift().toLowerCase().trim(), n = s.join(":").trim(), 
            t) {
              case "content-type":
                this._parseContentType(n);
                break;

              case "mime-version":
                this._currentNode.useMIME = !0;
                break;

              case "date":
                this._currentNode.meta.date = new Date(1e3 * a.strtotime(n) || Date.now());
                break;

              case "to":
                this._currentNode.to = this._currentNode.to && this._currentNode.to.length ? this._currentNode.to.concat(o.parseAddresses(n)) : o.parseAddresses(n);
                break;

              case "from":
                this._currentNode.from = this._currentNode.from && this._currentNode.from.length ? this._currentNode.from.concat(o.parseAddresses(n)) : o.parseAddresses(n);
                break;

              case "cc":
                this._currentNode.cc = this._currentNode.cc && this._currentNode.cc.length ? this._currentNode.cc.concat(o.parseAddresses(n)) : o.parseAddresses(n);
                break;

              case "bcc":
                this._currentNode.bcc = this._currentNode.bcc && this._currentNode.bcc.length ? this._currentNode.bcc.concat(o.parseAddresses(n)) : o.parseAddresses(n);
                break;

              case "x-priority":
              case "x-msmail-priority":
              case "importance":
                n = this._parsePriority(n), this._currentNode.priority = n;
                break;

              case "message-id":
                this._currentNode.meta.messageId = this._trimQuotes(n);
                break;

              case "references":
                this._parseReferences(n);
                break;

              case "in-reply-to":
                this._parseInReplyTo(n);
                break;

              case "thread-index":
                this._currentNode.meta.threadIndex = n;
                break;

              case "content-transfer-encoding":
                this._currentNode.meta.transferEncoding = n.toLowerCase();
                break;

              case "subject":
                this._currentNode.subject = this._encodeString(n);
                break;

              case "content-disposition":
                this._parseContentDisposition(n);
                break;

              case "content-id":
                this._currentNode.meta.contentId = this._trimQuotes(n);
            }
            this._currentNode.parsedHeaders[t] ? (Array.isArray(this._currentNode.parsedHeaders[t]) || (this._currentNode.parsedHeaders[t] = [ this._currentNode.parsedHeaders[t] ]), 
            this._currentNode.parsedHeaders[t].push(this._replaceMimeWords(n))) : this._currentNode.parsedHeaders[t] = this._replaceMimeWords(n), 
            this._currentNode.headers[e] = {
                key: t,
                value: n
            };
        }
    }, s.prototype._createMimeNode = function(e) {
        var t = {
            parentNode: e || this._currentNode || null,
            headers: [],
            parsedHeaders: {},
            meta: {},
            childNodes: []
        };
        return t;
    }, s.prototype._parseHeaderLineWithParams = function(e) {
        var t, n, s = {};
        n = e.split(";"), s.defaultValue = n.shift().toLowerCase();
        for (var i = 0, r = n.length; r > i; i++) e = n[i].split("="), t = e.shift().trim().toLowerCase(), 
        e = e.join("=").trim(), e = this._trimQuotes(e), s[t] = e;
        return s;
    }, s.prototype._parseContentType = function(e) {
        var t;
        return e = this._parseHeaderLineWithParams(e), e && (e.defaultValue ? (e.defaultValue = e.defaultValue.toLowerCase(), 
        this._currentNode.meta.contentType = e.defaultValue, "multipart/" == e.defaultValue.substr(0, "multipart/".length) && (this._currentNode.meta.mimeMultipart = e.defaultValue.substr("multipart/".length))) : this._currentNode.meta.contentType = "application/octet-stream", 
        e.charset && (e.charset = e.charset.toLowerCase(), "win-" == e.charset.substr(0, 4) ? e.charset = "windows-" + e.charset.substr(4) : "ks_c_5601-1987" == e.charset ? e.charset = "cp949" : e.charset.match(/^utf\d/) ? e.charset = "utf-" + e.charset.substr(3) : e.charset.match(/^latin[\-_]?\d/) ? e.charset = "iso-8859-" + e.charset.replace(/\D/g, "") : e.charset.match(/^(us\-)?ascii$/) && (e.charset = "utf-8"), 
        this._currentNode.meta.charset = e.charset), e.format && (this._currentNode.meta.textFormat = e.format.toLowerCase()), 
        e.delsp && (this._currentNode.meta.textDelSp = e.delsp.toLowerCase()), e.boundary && (this._currentNode.meta.mimeBoundary = e.boundary), 
        !this._currentNode.meta.fileName && (t = this._detectFilename(e)) && (this._currentNode.meta.fileName = t), 
        e.boundary && (this._currentNode.meta.mimeBoundary = e.boundary, this._multipartTree.push({
            boundary: e.boundary,
            node: this._currentNode
        }))), e;
    }, s.prototype._detectFilename = function(e) {
        var t, n, s, i = "", r = 0;
        if (e.name) return this._replaceMimeWords(e.name);
        if (e.filename) return this._replaceMimeWords(e.filename);
        if (e["name*"]) i = e["name*"]; else if (e["filename*"]) i = e["filename*"]; else if (e["name*0*"]) for (;e["name*" + r + "*"]; ) i += e["name*" + r++ + "*"]; else if (e["filename*0*"]) for (;e["filename*" + r + "*"]; ) i += e["filename*" + r++ + "*"];
        return i && (t = i.split("'"), n = t.shift(), s = t.pop()) ? this._replaceMimeWords(this._replaceMimeWords("=?" + (n || "us-ascii") + "?Q?" + s.replace(/%/g, "=") + "?=")) : "";
    }, s.prototype._parseContentDisposition = function(e) {
        var t;
        e = this._parseHeaderLineWithParams(e), e && (e.defaultValue && (this._currentNode.meta.contentDisposition = e.defaultValue.trim().toLowerCase()), 
        (t = this._detectFilename(e)) && (this._currentNode.meta.fileName = t));
    }, s.prototype._parseReferences = function(e) {
        this._currentNode.references = (this._currentNode.references || []).concat((e || "").toString().trim().split(/\s+/).map(this._trimQuotes.bind(this)));
    }, s.prototype._parseInReplyTo = function(e) {
        this._currentNode.inReplyTo = (this._currentNode.inReplyTo || []).concat((e || "").toString().trim().split(/\s+/).map(this._trimQuotes.bind(this)));
    }, s.prototype._parsePriority = function(e) {
        if (e = e.toLowerCase().trim(), !isNaN(parseInt(e, 10))) return e = parseInt(e, 10) || 0, 
        3 == e ? "normal" : e > 3 ? "low" : "high";
        switch (e) {
          case "non-urgent":
          case "low":
            return "low";

          case "urgent":
          case "hight":
            return "high";
        }
        return "normal";
    }, s.prototype._handleTextLine = function(e) {
        var t = this._currentNode.meta.transferEncoding;
        "base64" === t ? "string" != typeof this._currentNode.content ? this._currentNode.content = e.trim() : this._currentNode.content += e.trim() : "quoted-printable" === t || "flowed" != this._currentNode.meta.textFormat ? "string" != typeof this._currentNode.content ? this._currentNode.content = e : this._currentNode.content += "\n" + e : "string" != typeof this._currentNode.content ? this._currentNode.content = e : this._currentNode.content.match(/[ ]{1,}$/) ? ("yes" == this._currentNode.meta.textDelSp && (this._currentNode.content = this._currentNode.content.replace(/\s+$/, "")), 
        this._currentNode.content += e) : this._currentNode.content += "\n" + e;
    }, s.prototype._handleAttachmentLine = function(e) {
        this._currentNode.attachment && (this._currentNode.stream ? this._currentNode.streamStarted ? this._currentNode.stream.write(new Buffer("\r\n" + e, "binary")) : (this._currentNode.streamStarted = !0, 
        this._currentNode.stream.write(new Buffer(e, "binary"))) : "content" in this._currentNode && ("string" != typeof this._currentNode.content ? this._currentNode.content = e : this._currentNode.content += "\r\n" + e));
    }, s.prototype._finalizeContents = function() {
        var e;
        this._currentNode.content && (this._currentNode.attachment ? (this._currentNode.content = "quoted-printable" == this._currentNode.meta.transferEncoding ? o.decodeQuotedPrintable(this._currentNode.content, !1, "binary") : "base64" == this._currentNode.meta.transferEncoding ? new Buffer(this._currentNode.content.replace(/[^\w\+\/=]/g, ""), "base64") : new Buffer(this._currentNode.content, "binary"), 
        this._currentNode.checksum.update(this._currentNode.content), this._currentNode.meta.checksum = this._currentNode.checksum.digest("hex"), 
        this._currentNode.meta.length = this._currentNode.content.length) : ("text/html" == this._currentNode.meta.contentType && (this._currentNode.meta.charset = this._detectHTMLCharset(this._currentNode.content) || this._currentNode.meta.charset || this.options.defaultCharset || "iso-8859-1"), 
        "quoted-printable" == this._currentNode.meta.transferEncoding ? (this._currentNode.content = o.decodeQuotedPrintable(this._currentNode.content, !1, this._currentNode.meta.charset || this.options.defaultCharset || "iso-8859-1"), 
        "flowed" === this._currentNode.meta.textFormat && (this._currentNode.content = "yes" === this._currentNode.meta.textDelSp ? this._currentNode.content.replace(/ \n/g, "") : this._currentNode.content.replace(/ \n/g, " "))) : this._currentNode.content = "base64" == this._currentNode.meta.transferEncoding ? o.decodeBase64(this._currentNode.content, this._currentNode.meta.charset || this.options.defaultCharset || "iso-8859-1") : this._convertStringToUTF8(this._currentNode.content))), 
        this._currentNode.stream && (e = this._currentNode.stream.end() || {}, e.checksum && (this._currentNode.meta.checksum = e.checksum), 
        e.length && (this._currentNode.meta.length = e.length));
    }, s.prototype._processMimeTree = function() {
        var e, t, n, s, i = {};
        if (this.mailData = {
            html: [],
            text: [],
            alternatives: [],
            attachments: []
        }, this.mimeTree.meta.mimeMultipart ? this._walkMimeTree(this.mimeTree) : this._processMimeNode(this.mimeTree, 0), 
        this.mailData.html.length) for (n = 0, s = this.mailData.html.length; s > n; n++) !i.html || this.mailData.html[n].level < e ? (i.html && (i.alternatives || (i.alternatives = []), 
        i.alternatives.push({
            contentType: "text/html",
            content: i.html
        })), e = this.mailData.html[n].level, i.html = this.mailData.html[n].content) : (i.alternatives || (i.alternatives = []), 
        i.alternatives.push({
            contentType: "text/html",
            content: this.mailData.html[n].content
        }));
        if (this.mailData.text.length) for (n = 0, s = this.mailData.text.length; s > n; n++) !i.text || this.mailData.text[n].level < t ? (i.text && (i.alternatives || (i.alternatives = []), 
        i.alternatives.push({
            contentType: "text/plain",
            content: i.text
        })), t = this.mailData.text[n].level, i.text = this.mailData.text[n].content) : (i.alternatives || (i.alternatives = []), 
        i.alternatives.push({
            contentType: "text/plain",
            content: this.mailData.text[n].content
        }));
        if (i.headers = this.mimeTree.parsedHeaders, this.mimeTree.subject && (i.subject = this.mimeTree.subject), 
        this.mimeTree.references && (i.references = this.mimeTree.references), this.mimeTree.inReplyTo && (i.inReplyTo = this.mimeTree.inReplyTo), 
        this.mimeTree.priority && (i.priority = this.mimeTree.priority), this.mimeTree.from && (i.from = this.mimeTree.from), 
        this.mimeTree.to && (i.to = this.mimeTree.to), this.mimeTree.cc && (i.cc = this.mimeTree.cc), 
        this.mimeTree.bcc && (i.bcc = this.mimeTree.bcc), this.mailData.attachments.length) for (i.attachments = [], 
        n = 0, s = this.mailData.attachments.length; s > n; n++) i.attachments.push(this.mailData.attachments[n].content);
        process.nextTick(this.emit.bind(this, "end", i));
    }, s.prototype._walkMimeTree = function(e, t) {
        t = t || 1;
        for (var n = 0, s = e.childNodes.length; s > n; n++) this._processMimeNode(e.childNodes[n], t, e.meta.mimeMultipart), 
        this._walkMimeTree(e.childNodes[n], t + 1);
    }, s.prototype._processMimeNode = function(e, t, n) {
        var s, i;
        if (t = t || 0, e.attachment) {
            if (e.meta = e.meta || {}, e.content && (e.meta.content = e.content), this.mailData.attachments.push({
                content: e.meta || {},
                level: t
            }), this.options.showAttachmentLinks && "mixed" == n && this.mailData.html.length) for (s = 0, 
            i = this.mailData.html.length; i > s; s++) if (this.mailData.html[s].level == t) return this._joinHTMLAttachment(this.mailData.html[s], e.meta), 
            void 0;
        } else switch (e.meta.contentType) {
          case "text/html":
            if ("mixed" == n && this.mailData.html.length) for (s = 0, i = this.mailData.html.length; i > s; s++) if (this.mailData.html[s].level == t) return this._joinHTMLNodes(this.mailData.html[s], e.content), 
            void 0;
            return this.mailData.html.push({
                content: this._updateHTMLCharset(e.content || ""),
                level: t
            }), void 0;

          case "text/plain":
            return this.mailData.text.push({
                content: e.content || "",
                level: t
            }), void 0;
        }
    }, s.prototype._joinHTMLNodes = function(e, t) {
        var n = !1;
        t = (t || "").toString("utf-8").trim(), t = t.replace(/^\s*<\!doctype( [^>]*)?>/gi, ""), 
        t = t.replace(/<head( [^>]*)?>(.*)<\/head( [^>]*)?>/gi, "").replace(/<\/?html( [^>]*)?>/gi, "").trim(), 
        t.replace(/<body(?: [^>]*)?>(.*)<\/body( [^>]*)?>/gi, function(e, n) {
            t = n.trim();
        }), e.content = (e.content || "").toString("utf-8").trim(), e.content = e.content.replace(/<\/body( [^>]*)?>/i, function(e) {
            return n = !0, "<br/>\n" + t + e;
        }), n || (e.content += "<br/>\n" + t);
    }, s.prototype._joinHTMLAttachment = function(e, t) {
        var n, s, i = !1, r = t.generatedFileName.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        n = t.cid || (t.cid = t.generatedFileName + "@node"), s = '\n<div class="mailparser-attachment"><a href="cid:' + n + '">&lt;' + r + "&gt;</a></div>", 
        e.content = (e.content || "").toString("utf-8").trim(), e.content = e.content.replace(/<\/body( [^>]*)?>/i, function(e) {
            return i = !0, "<br/>\n" + s + e;
        }), i || (e.content += "<br/>\n" + s);
    }, s.prototype._convertString = function(e, t, n) {
        return n = (n || "utf-8").toUpperCase(), t = (t || "utf-8").toUpperCase(), e = "string" == typeof e ? new Buffer(e, "binary") : e, 
        n == t ? e : e = c.convert(e, n, t);
    }, s.prototype._convertStringToUTF8 = function(e) {
        return e = this._convertString(e, this._currentNode.meta.charset || this.options.defaultCharset || "iso-8859-1").toString("utf-8");
    }, s.prototype._encodeString = function(e) {
        return e = this._replaceMimeWords(this._convertStringToUTF8(e));
    }, s.prototype._replaceMimeWords = function(e) {
        return e.replace(/(=\?[^?]+\?[QqBb]\?[^?]+\?=)\s+(?==\?[^?]+\?[QqBb]\?[^?]+\?=)/g, "$1").replace(/\=\?[^?]+\?[QqBb]\?[^?]+\?=/g, function(e) {
            return o.decodeMimeWord(e.replace(/\s/g, ""));
        }.bind(this));
    }, s.prototype._trimQuotes = function(e) {
        return e = (e || "").trim(), ('"' == e.charAt(0) && '"' == e.charAt(e.length - 1) || "'" == e.charAt(0) && "'" == e.charAt(e.length - 1) || "<" == e.charAt(0) && ">" == e.charAt(e.length - 1)) && (e = e.substr(1, e.length - 2)), 
        e;
    }, s.prototype._generateFileName = function(e, t) {
        var n, s = "";
        return t && (s = o.contentTypesReversed[t], s = s ? "." + s : ""), e = e || "attachment" + s, 
        e = e.toString().split(/[\/\\]+/).pop().replace(/^\.+/, "") || "attachment", e in this._fileNames ? (this._fileNames[e]++, 
        n = e.substr((e.lastIndexOf(".") || 0) + 1), n == e ? e += "-" + this._fileNames[e] : e = e.substr(0, e.length - n.length - 1) + "-" + this._fileNames[e] + "." + n) : this._fileNames[e] = 0, 
        e;
    }, s.prototype._updateHTMLCharset = function(e) {
        return e = e.replace(/\n/g, "\0").replace(/<meta[^>]*>/gi, function(e) {
            return e.match(/http\-equiv\s*=\s*"?content\-type/i) ? '<meta http-equiv="content-type" content="text/html; charset=utf-8" />' : e.match(/\scharset\s*=\s*['"]?[\w\-]+["'\s>\/]/i) ? '<meta charset="utf-8"/>' : e;
        }).replace(/\u0000/g, "\n");
    }, s.prototype._detectHTMLCharset = function(e) {
        var t, n, s;
        return " string" != typeof e && (e = e.toString("ascii")), (s = e.match(/<meta\s+http-equiv=["']content-type["'][^>]*?>/i)) && (n = s[0]), 
        n && (t = n.match(/charset\s?=\s?([a-zA-Z\-_:0-9]*);?/), t && (t = (t[1] || "").trim().toLowerCase())), 
        !t && (s = e.match(/<meta\s+charset=["']([^'"<\/]*?)["']/i)) && (t = (s[1] || "").trim().toLowerCase()), 
        t;
    };
}), define("mailapi/imap/imapchew", [ "mimelib", "mailapi/db/mail_rep", "../mailchew", "exports" ], function(e, t, n, s) {
    function i(t) {
        var n = /^([^']*)'([^']*)'(.+)$/.exec(t);
        return n ? e.parseMimeWords("=?" + (n[1] || "us-ascii") + "?Q?" + n[3].replace(/%/g, "=") + "?=") : null;
    }
    function r(n) {
        function s(e) {
            var t = e.encoding.toLowerCase();
            return "base64" === t ? Math.floor(57 * e.size / 78) : "quoted-printable" === t ? e.size : e.size;
        }
        function r(n) {
            function r(e) {
                return "<" === e[0] ? e.slice(1, -1) : e;
            }
            function o(e, n) {
                return t.makeAttachmentPart({
                    name: n || "unnamed-" + ++d,
                    contentId: e.id ? r(e.id) : null,
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
            var h, p, f = n[0];
            if (h = f.params && f.params.name ? e.parseMimeWords(f.params.name) : f.params && f.params["name*"] ? i(f.params["name*"]) : f.disposition && f.disposition.params && f.disposition.params.filename ? e.parseMimeWords(f.disposition.params.filename) : f.disposition && f.disposition.params && f.disposition.params["filename*"] ? i(f.disposition.params["filename*"]) : null, 
            p = f.disposition ? f.disposition.type.toLowerCase() : f.id ? "inline" : h || "text" !== f.type ? "attachment" : "inline", 
            "text" !== f.type && "image" !== f.type && (p = "attachment"), "application" === f.type && ("pgp-signature" === f.subtype || "pkcs7-signature" === f.subtype)) return !0;
            if ("attachment" === p) return a.push(o(f, h)), !0;
            switch (f.type) {
              case "image":
                return l.push(o(f, h)), !0;

              case "text":
                if ("plain" === f.subtype || "html" === f.subtype) return c.push(u(f)), !0;
            }
            return !1;
        }
        function o(e) {
            var t, n = e[0];
            switch (n.subtype) {
              case "alternative":
                for (t = e.length - 1; t >= 1; t--) {
                    var s = e[t][0];
                    switch (s.type) {
                      case "text":
                        break;

                      case "multipart":
                        if (o(e[t])) return !0;
                        break;

                      default:
                        continue;
                    }
                    switch (s.subtype) {
                      case "html":
                      case "plain":
                        if (r(e[t])) return !0;
                    }
                }
                return !1;

              case "mixed":
              case "signed":
              case "related":
                for (t = 1; t < e.length; t++) e[t].length > 1 ? o(e[t]) : r(e[t]);
                return !0;

              default:
                return console.warn("Ignoring multipart type:", n.subtype), !1;
            }
        }
        var a = [], c = [], d = 0, l = [];
        return n.structure.length > 1 ? o(n.structure) : r(n.structure), {
            bodyReps: c,
            attachments: a,
            relatedParts: l
        };
    }
    s.chewHeaderAndBodyStructure = function(e, n, s) {
        var i = r(e), o = {};
        return o.header = t.makeHeaderInfo({
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
            hasAttachments: i.attachments.length > 0,
            subject: e.msg.subject || null,
            snippet: null
        }), o.bodyInfo = t.makeBodyInfo({
            date: e.date,
            size: 0,
            attachments: i.attachments,
            relatedParts: i.relatedParts,
            references: e.msg.references,
            bodyReps: i.bodyReps
        }), o;
    }, s.updateMessageWithFetch = function(e, t, s, i, r) {
        var o = t.bodyReps[s.bodyRepIndex];
        (!s.bytes || i.bytesFetched < s.bytes[1]) && (o.isDownloaded = !0, o._partInfo = null), 
        !o.isDownloaded && i.buffer && (o._partInfo.pendingBuffer = i.buffer), o.amountDownloaded += i.bytesFetched;
        var a = n.processMessageContent(i.text, o.type, o.isDownloaded, s.createSnippet, r);
        s.createSnippet && (e.snippet = a.snippet), o.isDownloaded && (o.content = a.content);
    }, s.selectSnippetBodyRep = function(e, t) {
        if (e.snippet) return -1;
        for (var n = t.bodyReps, i = n.length, r = 0; i > r; r++) if (s.canBodyRepFillSnippet(n[r])) return r;
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
}), define("pop3/pop3", [ "module", "exports", "rdcommon/log", "net", "crypto", "./transport", "mailparser/mailparser", "../mailapi/imap/imapchew", "../mailapi/syncbase", "./mime_mapper", "../mailapi/allback" ], function(e, t, n, s, i, r, o, a, c, d, l) {
    function u(e) {
        return i.createHash("md5").update(e).digest("hex").toLowerCase();
    }
    function h(e, t, n, s) {
        var i = [], r = e.meta.contentType.split("/"), o = {};
        if (o.type = r[0], o.subtype = r[1], o.params = {}, o.params.boundary = e.meta.mimeBoundary || null, 
        o.params.format = e.meta.textFormat || null, o.params.charset = e.meta.charset || null, 
        o.params.name = e.meta.fileName || null, e.meta.contentDisposition && (o.disposition = {
            type: e.meta.contentDisposition,
            params: {}
        }, e.meta.fileName && (o.disposition.params.filename = e.meta.fileName)), o.partID = t || "1", 
        o.id = e.meta.contentId, o.encoding = "binary", o.size = e.content && e.content.length || 0, 
        o.description = null, o.lines = null, o.md5 = null, null != e.content && ("text" === o.type && e.content.length && "\n" === e.content[e.content.length - 1] && (e.content = e.content.slice(0, -1), 
        o.size--), n[o.partID] = e.content, s === e && (n.partial = o.partID)), i.push(o), 
        e.childNodes.length) for (var a = 0; a < e.childNodes.length; a++) {
            var c = e.childNodes[a];
            i.push(h(c, o.partID + "." + (a + 1), n, s));
        }
        return i;
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
    var f = window.setTimeout.bind(window), m = window.clearTimeout.bind(window);
    t.setTimeoutFuncs = function(e, t) {
        f = e, m = t;
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
        this.idToSize = {}, this._messageList = null, this._greetingLine = null, this.protocol = new r.Pop3Protocol(), 
        this.socket = s.connect(e.port, e.host, "ssl" === e.crypto);
        var i = f(function() {
            this.state = "disconnected", i && (m(i), i = null), t && t({
                scope: "connection",
                request: null,
                name: "unresponsive-server",
                message: "Could not connect to " + e.host + ":" + e.port + " with " + e.crypto + " encryption."
            });
        }.bind(this), e.connTimeout);
        e.debug && this.attachDebugLogging(), this.socket.on("data", this.protocol.onreceive.bind(this.protocol)), 
        this.protocol.onsend = this.socket.write.bind(this.socket), this.socket.on("connect", function() {
            i && (m(i), i = null), this.state = "greeting";
        }.bind(this)), this.socket.on("error", function(e) {
            i && (m(i), i = null), t && t({
                scope: "connection",
                request: null,
                name: "unresponsive-server",
                message: "Socket exception: " + JSON.stringify(e),
                exception: e
            });
        }.bind(this)), this.socket.on("close", function() {
            this.protocol.onclose(), this.die();
        }.bind(this)), this.protocol.pendingRequests.push(new r.Request(null, [], !1, function(e, n) {
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
                var i = n[s].split(" ");
                this.capabilities[i[0]] = i.slice(1);
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
            var i = /<.*?>/.exec(this._greetingLine || ""), r = i && i[0];
            r ? (t = u(r + s), this.protocol.sendRequest("APOP", [ n, t ], !1, function(t) {
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
            for (var s = n.getDataLines(), i = 0; i < s.length; i++) {
                var r = s[i].split(" "), o = r[0], a = r[1];
                this.idToUidl[o] = a, this.uidlToId[a] = o;
            }
        }.bind(this)), this.protocol.sendRequest("LIST", [], !0, function(t, n) {
            if (t) return e && e({
                scope: "mailbox",
                request: t.request,
                name: "server-problem",
                message: t.getStatusLine(),
                response: t
            }), void 0;
            for (var s = n.getDataLines(), i = [], r = 0; r < s.length; r++) {
                var o = s[r].split(" "), a = o[0], c = parseInt(o[1], 10);
                this.idToSize[a] = c, i.unshift({
                    uidl: this.idToUidl[a],
                    size: c,
                    number: a
                });
            }
            this._messageList = i, e && e(null, i);
        }.bind(this)), void 0);
    }, g.prototype.listMessages = function(e, t) {
        var n = e.filter, s = e.progress, i = e.checkpointInterval || null, r = e.maxMessages || 1/0, o = e.checkpoint, a = [];
        this._loadMessageList(function(e, c) {
            if (e) return t && t(e), void 0;
            for (var d = 0, u = 0, h = [], p = 0, f = 0; f < c.length; f++) {
                var m = c[f];
                !n || n(m.uidl) ? h.length < r ? (d += m.size, h.push(m)) : a.push(m) : p++;
            }
            console.log("POP3: listMessages found " + h.length + " new, " + a.length + " overflow, and " + p + " seen messages. New UIDLs:"), 
            h.forEach(function(e) {
                console.log("POP3: " + e.size + " bytes: " + e.uidl);
            });
            var g = h.length;
            i || (i = g);
            var _ = function() {
                if (console.log("POP3: Next batch. Messages left: " + h.length), !h.length) return console.log("POP3: Sync complete. " + g + " messages synced, " + a.length + " overflow messages."), 
                t && t(null, g, a), void 0;
                var e = h.splice(0, i), n = l.latch();
                e.forEach(function(e) {
                    var t = n.defer();
                    this.downloadPartialMessageByNumber(e.number, function(n, i) {
                        u += e.size, s && s({
                            totalBytes: d,
                            bytesFetched: u,
                            size: e.size,
                            message: i
                        }), t(n);
                    });
                }.bind(this)), n.then(function() {
                    console.log("POP3: Checkpoint."), o ? o(_) : _();
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
            var i = this.idToSize[e], r = s.getDataAsString(), o = !i || r.length < i;
            t(null, this.parseMime(r, o, e));
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
        var s = new o.MailParser();
        s._write(e), s._process(!0);
        var i, r = s.mimeTree, l = t ? s._currentNode : null, u = n && this.idToSize[n] || e.length, p = {}, f = {
            id: n && this.idToUidl[n],
            msg: r,
            date: r.meta.date && r.meta.date.valueOf(),
            flags: [],
            structure: h(r, "1", p, l)
        }, m = a.chewHeaderAndBodyStructure(f, null, null), g = a.selectSnippetBodyRep(m.header, m.bodyInfo), _ = {}, y = 0, v = p.partial;
        for (var b in p) "partial" !== b && b !== v && (y += p[b].length, _[b] = p[b].length);
        v && (_[v] = u - y);
        for (var S = 0; S < m.bodyInfo.bodyReps.length; S++) {
            var w = m.bodyInfo.bodyReps[S];
            if (i = p[w.part], null != i) {
                var T = {
                    bytes: v === w.part ? [ -1, -1 ] : null,
                    bodyRepIndex: S,
                    createSnippet: S === g
                };
                w.size = _[w.part];
                var E = {
                    bytesFetched: i.length,
                    text: i
                };
                a.updateMessageWithFetch(m.header, m.bodyInfo, T, E, this._LOG);
            }
        }
        for (var S = 0; S < m.bodyInfo.relatedParts.length; S++) {
            var A = m.bodyInfo.relatedParts[S];
            A.sizeEstimate = _[A.part], i = p[A.part], null != i && v !== A.part && (A.file = new Blob([ i ], {
                type: A.type
            }));
        }
        for (var S = 0; S < m.bodyInfo.attachments.length; S++) {
            var C = m.bodyInfo.attachments[S];
            i = p[C.part], C.sizeEstimate = _[C.part], null != i && v !== C.part && d.isSupportedType(C.type) && (C.file = new Blob([ i ], {
                type: C.type
            }));
        }
        return t && !m.header.hasAttachments && (r.parsedHeaders["x-ms-has-attach"] || "mixed" === r.meta.mimeMultipart || u > c.POP3_INFER_ATTACHMENTS_SIZE) && (m.header.hasAttachments = !0), 
        m.bodyInfo.bodyReps.push({
            type: "fake",
            part: "fake",
            sizeEstimate: 0,
            amountDownloaded: 0,
            isDownloaded: !t,
            content: null,
            size: 0
        }), m.header.bytesToDownloadForBodyDisplay = t ? u : 0, m;
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
});