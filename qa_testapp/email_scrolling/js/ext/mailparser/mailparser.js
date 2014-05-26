define("mailparser/datetime", [ "require", "exports", "module" ], function() {
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
});