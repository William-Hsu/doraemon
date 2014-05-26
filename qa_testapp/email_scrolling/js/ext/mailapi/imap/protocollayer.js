define("mailapi/imap/protocol/sync", [ "mailparser/mailparser", "../imapchew", "exports" ], function(e, t, n) {
    function s(e) {
        this.storage = e.storage, this.connection = e.connection, this.knownHeaders = e.knownHeaders || [], 
        this.knownUIDs = e.knownUIDs || [], this.newUIDs = e.newUIDs || [], this._progress = e.initialProgress || .25, 
        this._progressCost = (this.knownUIDs.length ? i : 0) + a * this.knownUIDs.length + (this.newUIDs.length ? c : 0) + l * this.newUIDs.length, 
        this.onprogress = null, this.oncomplete = null, this._beginSync();
    }
    var o = {
        request: {
            headers: [ "FROM", "TO", "CC", "BCC", "SUBJECT", "REPLY-TO", "MESSAGE-ID", "REFERENCES" ],
            struct: !0,
            body: !1
        }
    }, r = {
        request: {
            struct: !1,
            headers: !1,
            body: !1
        }
    }, i = 20, a = 1, c = 20, l = 5;
    s.prototype = {
        _updateProgress: function(e) {
            this._progress += e, this.onprogress && this.onprogress(.25 + .75 * (this._progress / this._progressCost));
        },
        _beginSync: function() {
            function e() {
                --t || n.storage.runAfterDeferredCalls(function() {
                    n.oncomplete && window.setZeroTimeout(function() {
                        n.oncomplete(n.newUIDs.length, n.knownUIDs.length);
                    });
                });
            }
            var t = 1, n = this;
            this.newUIDs.length && (t++, this._handleNewUids(e)), this.knownUIDs.length && (t++, 
            this._handleKnownUids(e)), window.setZeroTimeout(e);
        },
        _handleNewUids: function(e) {
            var n = this.connection.fetch(this.newUIDs, o), s = [], r = this;
            n.on("message", function(e) {
                e.on("end", function() {
                    console.log("  new fetched, header processing, INTERNALDATE: ", e.rawDate);
                    try {
                        var n = t.chewHeaderAndBodyStructure(e, r.storage.folderId, r.storage._issueNewHeaderId());
                        n.header.bytesToDownloadForBodyDisplay = t.calculateBytesToDownloadForImapBodyDisplay(n.bodyInfo), 
                        s.push(n), r.storage.addMessageHeader(n.header, n.bodyInfo), r.storage.addMessageBody(n.header, n.bodyInfo);
                    } catch (o) {
                        console.warn("message problem, skipping message", o, "\n", o.stack);
                    }
                });
            }), n.on("error", function(e) {
                console.warn("New UIDs fetch error, ideally harmless:", e);
            }), n.on("end", e);
        },
        _handleKnownUids: function(e) {
            var t = this, n = this.connection.fetch(t.knownUIDs, r), s = 0;
            n.on("message", function(e) {
                e.on("end", function() {
                    var n = s++;
                    if (console.log("FETCHED", n, "known id", t.knownHeaders[n].id, "known srvid", t.knownHeaders[n].srvid, "actual id", e.id), 
                    t.knownHeaders[n].srvid !== e.id && (n = t.knownUIDs.indexOf(e.id), -1 === n)) return console.warn("Server fetch reports unexpected message:", e.id), 
                    void 0;
                    var o = t.knownHeaders[n];
                    o.flags.toString() !== e.flags.toString() ? (console.warn('  FLAGS: "' + o.flags.toString() + '" VS "' + e.flags.toString() + '"'), 
                    o.flags = e.flags, t.storage.updateMessageHeader(o.date, o.id, !0, o, null)) : t.storage.unchangedMessageHeader(o);
                });
            }), n.on("error", function(e) {
                console.warn("Known UIDs fetch error, ideally harmless:", e);
            }), n.on("end", function() {
                t._updateProgress(i + a * t.knownUIDs.length), e();
            });
        }
    }, n.Sync = s;
}), define("mailapi/imap/protocol/bodyfetcher", [ "exports" ], function(e) {
    function t(e, t) {
        var n;
        return n = t ? [ e.partID, String(t[0]) + "-" + String(t[1]) ] : e.partID, {
            request: {
                struct: !1,
                headers: !1,
                body: n
            }
        };
    }
    function n(e, t, n) {
        this.connection = e, this.parserClass = t, this.list = n, this.pending = n.length, 
        this.onerror = null, this.ondata = null, this.onend = null, n.forEach(this._fetch, this);
    }
    n.prototype = {
        _fetch: function(e) {
            var n = this.connection.fetch(e.uid, t(e.partInfo, e.bytes)), s = new this.parserClass(e.partInfo), o = this;
            n.on("error", function(t) {
                o._resolve(t, e);
            }), n.on("message", function(t) {
                t.on("error", function(t) {
                    o._resolve(t, e);
                }), t.on("data", function(e) {
                    s.parse(e);
                }), t.on("end", function() {
                    o._resolve(null, e, s.complete(t));
                });
            });
        },
        _resolve: function() {
            var e = Array.slice(arguments), t = e[0];
            t ? this.onerror && this.onerror.apply(this, e) : this.onparsed && (e.shift(), this.onparsed.apply(this, e)), 
            !--this.pending && this.onend && this.onend();
        }
    }, e.BodyFetcher = n;
}), define("mailapi/imap/protocol/textparser", [ "mailparser/mailparser", "exports" ], function(e, t) {
    function n(t) {
        var n = this._mparser = new e.MailParser();
        n._state = 2, n._remainder = "", n._currentNode = null, n._currentNode = n._createMimeNode(null), 
        n._currentNode.meta.contentType = t.type.toLowerCase() + "/" + t.subtype.toLowerCase(), 
        n._currentNode.meta.charset = t.params && t.params.charset && t.params.charset.toLowerCase(), 
        n._currentNode.meta.transferEncoding = t.encoding && t.encoding.toLowerCase(), n._currentNode.meta.textFormat = t.params && t.params.format && t.params.format.toLowerCase(), 
        t.pendingBuffer && this.parse(t.pendingBuffer);
    }
    n.prototype = {
        parse: function(e) {
            process.immediate = !0, this._mparser.write(e), process.immediate = !1;
        },
        complete: function(e) {
            process.immediate = !0, this._mparser._process(!0), process.immediate = !1;
            var t = this._mparser._currentNode.content;
            return 10 === t.charCodeAt(t.length - 1) && (t = t.substring(0, t.length - 1)), 
            {
                bytesFetched: e.size,
                text: t
            };
        }
    }, t.TextParser = n;
}), define("mailapi/imap/protocol/snippetparser", [ "./textparser", "exports" ], function(e, t) {
    function n(e, t) {
        var n = new Buffer(e.length + t.length);
        if (e.copy(n, 0, 0), Buffer.isBuffer(t)) t.copy(n, e.length, 0); else if (Array.isArray(t)) for (var s = e.length, o = t.length; o > s; s++) n[s] = t[s];
        return n;
    }
    function s() {
        e.TextParser.apply(this, arguments);
    }
    var o = e.TextParser;
    s.prototype = {
        parse: function(e) {
            this._buffer = this._buffer ? n(this._buffer, e) : e, o.prototype.parse.apply(this, arguments);
        },
        complete: function() {
            var e = o.prototype.complete.apply(this, arguments);
            return e.buffer = this._buffer, e;
        }
    }, t.SnippetParser = s;
});