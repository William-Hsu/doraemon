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
}), define("tls", [ "net", "exports" ], function(e, t) {
    t.connect = function(t, n, s, o) {
        var i = new e.NetSocket(t, n, !0);
        return o && i.on("connect", o), i;
    };
}), define("imap", [ "require", "exports", "module", "util", "rdcommon/log", "net", "tls", "events", "mailparser/mailparser" ], function(e, t, n) {
    function s(e) {
        return parseInt(e, 10);
    }
    function o(e) {
        return e.replace(V, function(e, t) {
            if (!t.length) return "&";
            t = t.replace(J, "/");
            var n = new Buffer(t, "base64");
            return n.toString("utf-16be");
        });
    }
    function i(e) {
        var t = H.exec(e);
        if (!t) throw new Error("Not a good IMAP date-time: " + e);
        var n = parseInt(t[1], 10), s = R.indexOf(t[2]), o = parseInt(t[3], 10), i = parseInt(t[4], 10), r = parseInt(t[5], 10), a = parseInt(t[6], 10), c = Date.UTC(o, s, n, i, r, a), l = parseInt(t[7], 10), d = Math.floor(l / 100), u = l % 100;
        return c -= d * W + u * z;
    }
    function r(e) {
        var t;
        return t = (e.getDate() < 10 ? " " : "") + e.getDate() + "-" + R[e.getMonth()] + "-" + e.getFullYear() + " " + ("0" + e.getHours()).slice(-2) + ":" + ("0" + e.getMinutes()).slice(-2) + ":" + ("0" + e.getSeconds()).slice(-2) + (e.getTimezoneOffset() > 0 ? " -" : " +") + ("0" + Math.abs(e.getTimezoneOffset()) / 60).slice(-2) + ("0" + Math.abs(e.getTimezoneOffset()) % 60).slice(-2);
    }
    function a(e) {
        return this instanceof a ? (M.call(this), this._options = {
            username: "",
            password: "",
            host: "localhost",
            port: 143,
            secure: !1,
            connTimeout: 1e4,
            _logParent: null
        }, this._state = {
            status: F.NOCONNECT,
            conn: null,
            curId: 0,
            requests: [],
            unsentRequests: [],
            activeRequests: 0,
            postGreetingCallback: null,
            numCapRecvs: 0,
            isIdle: !0,
            tmrConn: null,
            curData: null,
            curDataMinLength: 0,
            curExpected: null,
            curXferred: 0,
            box: {
                _uidnext: 0,
                _flags: [],
                _newKeywords: !1,
                validity: 0,
                highestModSeq: void 0,
                keywords: [],
                permFlags: [],
                name: null,
                messages: {
                    total: 0,
                    "new": 0
                }
            },
            ext: {
                idle: {
                    MAX_WAIT: 174e4,
                    state: Q,
                    timeWaited: 0
                }
            }
        }, this._unprocessed = [], this._options = E(this._options, e), this._LOG = this._options._logParent ? st.ImapProtoConn(this, this._options._logParent, Date.now() % 1e3) : null, 
        this._LOG && this._LOG.created(), this.delim = null, this.namespaces = {
            personal: [],
            other: [],
            shared: []
        }, this.capabilities = [], this.enabledCapabilities = [], this.blacklistedCapabilities = this._options.blacklistedCapabilities || [], 
        void 0) : new a(e);
    }
    function c() {}
    function l() {}
    function d(e, t, n) {
        for (var s = "", o = 0, i = e.length; i > o; o++) {
            var r = n ? e : e[o], a = null, c = n ? "" : " ";
            if ("string" == typeof r) r = r.toUpperCase(); else {
                if (!Array.isArray(r)) throw new Error("Unexpected search option data type. Expected string or array. Got: " + typeof r);
                r.length > 1 && (a = r.slice(1)), r.length > 0 && (r = r[0].toUpperCase());
            }
            if ("OR" === r) {
                if (2 !== a.length) throw new Error("OR must have exactly two arguments");
                s += " OR (" + d(a[0], t, !0) + ") (" + d(a[1], t, !0) + ")";
            } else switch ("!" === r[0] && (c += "NOT ", r = r.substr(1)), r) {
              case "ALL":
              case "ANSWERED":
              case "DELETED":
              case "DRAFT":
              case "FLAGGED":
              case "NEW":
              case "SEEN":
              case "RECENT":
              case "OLD":
              case "UNANSWERED":
              case "UNDELETED":
              case "UNDRAFT":
              case "UNFLAGGED":
              case "UNSEEN":
                s += c + r;
                break;

              case "BCC":
              case "BODY":
              case "CC":
              case "FROM":
              case "SUBJECT":
              case "TEXT":
              case "TO":
                if (!a || 1 !== a.length) throw new Error("Incorrect number of arguments for search option: " + r);
                s += c + r + ' "' + b("" + a[0]) + '"';
                break;

              case "BEFORE":
              case "ON":
              case "SENTBEFORE":
              case "SENTON":
              case "SENTSINCE":
              case "SINCE":
                if (!a || 1 !== a.length) throw new Error("Incorrect number of arguments for search option: " + r);
                if (!(a[0] instanceof Date) && "Invalid Date" === (a[0] = new Date(a[0])).toString()) throw new Error("Search option argument must be a Date object or a parseable date string");
                s += c + r + " " + a[0].getUTCDate() + "-" + R[a[0].getUTCMonth()] + "-" + a[0].getUTCFullYear();
                break;

              case "KEYWORD":
              case "UNKEYWORD":
                if (!a || 1 !== a.length) throw new Error("Incorrect number of arguments for search option: " + r);
                s += c + r + " " + a[0];
                break;

              case "LARGER":
              case "SMALLER":
                if (!a || 1 !== a.length) throw new Error("Incorrect number of arguments for search option: " + r);
                var l = parseInt(a[0]);
                if (isNaN(l)) throw new Error("Search option argument must be a number");
                s += c + r + " " + a[0];
                break;

              case "HEADER":
                if (!a || 2 !== a.length) throw new Error("Incorrect number of arguments for search option: " + r);
                s += c + r + ' "' + b("" + a[0]) + '" "' + b("" + a[1]) + '"';
                break;

              case "UID":
                if (!a) throw new Error("Incorrect number of arguments for search option: " + r);
                u(a), s += c + r + " " + a.join(",");
                break;

              case "X-GM-MSGID":
              case "X-GM-THRID":
                if (-1 === t.indexOf("X-GM-EXT-1")) throw new Error("IMAP extension not available: " + r);
                var h;
                if (!a || 1 !== a.length) throw new Error("Incorrect number of arguments for search option: " + r);
                if (h = "" + a[0], !/^\d+$/.test(a[0])) throw new Error("Invalid value");
                s += c + r + " " + h;
                break;

              case "X-GM-RAW":
                if (-1 === t.indexOf("X-GM-EXT-1")) throw new Error("IMAP extension not available: " + r);
                if (!a || 1 !== a.length) throw new Error("Incorrect number of arguments for search option: " + r);
                s += c + r + ' "' + b("" + a[0]) + '"';
                break;

              case "X-GM-LABELS":
                if (-1 === t.indexOf("X-GM-EXT-1")) throw new Error("IMAP extension not available: " + r);
                if (!a || 1 !== a.length) throw new Error("Incorrect number of arguments for search option: " + r);
                s += c + r + " " + a[0];
                break;

              default:
                throw new Error("Unexpected search option: " + r);
            }
            if (n) break;
        }
        return console.log("searchargs:", s), s;
    }
    function u(e) {
        for (var t, n = 0, s = e.length; s > n; n++) {
            if ("string" == typeof e[n]) {
                if ("*" === e[n] || "*:*" === e[n]) {
                    s > 1 && (e = [ "*" ]);
                    break;
                }
                if (/^(?:[\d]+|\*):(?:[\d]+|\*)$/.test(e[n])) continue;
            }
            if (t = parseInt("" + e[n]), isNaN(t)) throw new Error('Message ID/number must be an integer, "*", or a range: ' + e[n]);
            "number" != typeof e[n] && (e[n] = t);
        }
    }
    function h(e) {
        var t = [];
        if (!e.length) return t;
        for (var n, s, o = 0, i = -1, r = 1; r < e.length; r++) {
            var a = e.charCodeAt(r);
            if (48 === a) i = parseInt(e.substring(o, r)), o = ++r; else if ("44" === a) {
                if (-1 === i) t.push(parseInt(e.substring(o, r))); else for (n = parseInt(e.substring(o, r)), 
                s = i; n >= s; s++) t.push(s);
                i = -1, start = ++r;
            }
        }
        if (-1 === i) t.push(parseInt(e.substring(o, r))); else for (n = parseInt(e.substring(o, r)), 
        s = i; n >= s; s++) t.push(s);
        return t;
    }
    function m(e, t) {
        for (var n = S(e), s = 0; 3 > s; ++s) if (Array.isArray(n[s])) {
            for (var o = [], i = 0, r = n[s].length; r > i; ++i) {
                var a = {
                    prefix: n[s][i][0],
                    delim: n[s][i][1]
                };
                if (n[s][i].length > 2) {
                    a.extensions = [];
                    for (var c = 2, l = n[s][i].length; l > c; c += 2) a.extensions.push({
                        name: n[s][i][c],
                        flags: n[s][i][c + 1]
                    });
                }
                o.push(a);
            }
            0 === s ? t.personal = o : 1 === s ? t.other = o : 2 === s && (t.shared = o);
        }
    }
    function p(e, t, n) {
        for (var s = S(e), o = 0, r = s.length; r > o; o += 2) if ("UID" === s[o]) n.id = parseInt(s[o + 1], 10); else if ("INTERNALDATE" === s[o]) n.rawDate = s[o + 1], 
        n.date = i(s[o + 1]); else if ("FLAGS" === s[o]) n.flags = s[o + 1].filter(v), n.flags.sort(); else if ("MODSEQ" === s[o]) n.modseq = s[o + 1].slice(1, -1); else if ("BODYSTRUCTURE" === s[o]) n.structure = f(s[o + 1]); else if ("string" == typeof s[o]) n[s[o].toLowerCase()] = s[o + 1]; else if (Array.isArray(s[o]) && "string" == typeof s[o][0] && 0 === s[o][0].indexOf("HEADER") && t) {
            var a = new k.MailParser();
            a._remainder = t, process.immediate = !0, a._process(!0), process.immediate = !1, 
            n.msg = a._currentNode;
        }
    }
    function f(e, t, n) {
        var s = [];
        if (void 0 === t) {
            var o = Array.isArray(e) ? e : S(e);
            o.length && (s = f(o, "", 1));
        } else {
            var i, r, a = e.length;
            if (Array.isArray(e[0])) {
                for (r = -1; Array.isArray(e[++r]); ) s.push(f(e[r], t + ("" !== t ? "." : "") + (n++).toString(), 1));
                if (i = {
                    type: "multipart",
                    subtype: e[r++].toLowerCase()
                }, a > r) {
                    if (Array.isArray(e[r])) {
                        i.params = {};
                        for (var c = 0, l = e[r].length; l > c; c += 2) i.params[e[r][c].toLowerCase()] = e[r][c + 1];
                    } else i.params = e[r];
                    ++r;
                }
            } else {
                if (r = 7, "string" == typeof e[1] ? i = {
                    partID: "" !== t ? t : "1",
                    type: e[0].toLowerCase(),
                    subtype: e[1].toLowerCase(),
                    params: null,
                    id: e[3],
                    description: e[4],
                    encoding: e[5],
                    size: e[6]
                } : (i = {
                    type: e[0].toLowerCase(),
                    params: null
                }, e.splice(1, 0, null), ++a, r = 2), Array.isArray(e[2])) {
                    i.params = {};
                    for (var c = 0, l = e[2].length; l > c; c += 2) i.params[e[2][c].toLowerCase()] = e[2][c + 1];
                    null === e[1] && ++r;
                }
                if ("message" === i.type && "rfc822" === i.subtype) {
                    if (a > r && Array.isArray(e[r])) {
                        i.envelope = {};
                        for (var c = 0, l = e[r].length; l > c; ++c) if (0 === c) i.envelope.date = e[r][c]; else if (1 === c) i.envelope.subject = e[r][c]; else if (c >= 2 && 7 >= c) {
                            var d = e[r][c];
                            if (Array.isArray(d)) {
                                for (var u, h = [], m = !1, p = 0, _ = d.length; _ > p; ++p) if (null === d[p][3]) m = !0, 
                                u = {
                                    group: d[p][2],
                                    addresses: []
                                }; else if (null === d[p][2]) m = !1, h.push(u); else {
                                    var y = {
                                        name: d[p][0],
                                        mailbox: d[p][2],
                                        host: d[p][3]
                                    };
                                    m ? u.addresses.push(y) : h.push(y);
                                }
                                d = h;
                            }
                            2 === c ? i.envelope.from = d : 3 === c ? i.envelope.sender = d : 4 === c ? i.envelope["reply-to"] = d : 5 === c ? i.envelope.to = d : 6 === c ? i.envelope.cc = d : 7 === c && (i.envelope.bcc = d);
                        } else if (8 === c) i.envelope["in-reply-to"] = e[r][c]; else {
                            if (9 !== c) break;
                            i.envelope["message-id"] = e[r][c];
                        }
                    } else i.envelope = null;
                    ++r, i.body = a > r && Array.isArray(e[r]) ? f(e[r], t + ("" !== t ? "." : "") + (n++).toString(), 1) : null, 
                    ++r;
                }
                ("text" === i.type || "message" === i.type && "rfc822" === i.subtype) && a > r && (i.lines = e[r++]), 
                "string" == typeof e[1] && a > r && (i.md5 = e[r++]);
            }
            g(i, a, e, r), s.unshift(i);
        }
        return s;
    }
    function g(e, t, n, s) {
        if (t > s) {
            var o = {
                type: null,
                params: null
            };
            if (Array.isArray(n[s])) {
                if (o.type = n[s][0], Array.isArray(n[s][1])) {
                    o.params = {};
                    for (var i = 0, r = n[s][1].length; r > i; i += 2) o.params[n[s][1][i].toLowerCase()] = n[s][1][i + 1];
                }
            } else null !== n[s] && (o.type = n[s]);
            e.disposition = null === o.type ? null : o, ++s;
        }
        t > s && (e.language = null !== n[s] ? Array.isArray(n[s]) ? n[s] : [ n[s] ] : null, 
        ++s), t > s && (e.location = n[s++]), t > s && (e.extensions = n[s]);
    }
    function _(e, t, n) {
        if (arguments.length < 3 || void 0 === arguments[1] || void 0 === arguments[2] || !t || "" === t || "function" == typeof t || "object" == typeof t) return !1;
        if (t = t === !0 ? "1" : t.toString(), !n || 0 === n) return e.split(t);
        if (0 > n) return !1;
        if (n > 0) {
            var s = e.split(t), o = s.splice(0, n - 1), i = s.join(t);
            return o.push(i), o;
        }
        return !1;
    }
    function y(e) {
        return e.trim().length > 0;
    }
    function v(e) {
        var t = e.trim();
        return t.length > 0 && !nt.test(t);
    }
    function b(e) {
        return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    }
    function C(e) {
        return e.toUpperCase();
    }
    function S(e, t, n) {
        n = n || 0;
        var s = !1, o = n - 1, i = !1;
        if (t || (t = new Array()), "string" == typeof e) {
            var r = new Object();
            r.str = e, e = r, i = !0;
        }
        for (var a = n, c = e.str.length; c > a; ++a) {
            if (s) '"' === e.str[a] && e.str[a - 1] && ("\\" !== e.str[a - 1] || e.str[a - 2] && "\\" === e.str[a - 2]) && (s = !1); else if ('"' === e.str[a]) s = !0; else if (" " === e.str[a] || ")" === e.str[a] || "]" === e.str[a]) {
                if (a - (o + 1) > 0 && t.push(w(e.str.substring(o + 1, a))), ")" === e.str[a] || "]" === e.str[a]) return a;
                o = a;
            } else if ("(" === e.str[a] || "[" === e.str[a]) {
                var l = [];
                a = S(e, l, a + 1), o = a, t.push(l);
            } else if ("{" === e.str[a]) {
                var d = e.str.indexOf("\r\n", a);
                if (-1 != d) {
                    var u = /\{(\d+)\}\r\n/.exec(e.str.substring(a, d + 2));
                    if (u) {
                        var h = parseInt(u[1], 10);
                        isNaN(h) || (t.push(w(e.str.substr(d + 2, h))), a = d + 2 + h - 1, o = a);
                    }
                }
            }
            a + 1 === c && c - (o + 1) > 0 && t.push(w(e.str.substring(o + 1)));
        }
        return i ? t : n;
    }
    function w(e) {
        if ('"' === e[0]) return e.substring(1, e.length - 1);
        if ("NIL" === e) return null;
        if (/^\d+$/.test(e)) {
            var t = parseInt(e, 10);
            return t.toString() === e ? t : e;
        }
        return e;
    }
    function E(e, t, n) {
        for (var s in t) n && s === n ? E(e[s], t[s]) : e[s] = t[s];
        return e;
    }
    function T(e, t) {
        var n = new Buffer(e.length + t.length);
        if (e.copy(n, 0, 0), Buffer.isBuffer(t)) t.copy(n, e.length, 0); else if (Array.isArray(t)) for (var s = e.length, o = t.length; o > s; s++) n[s] = t[s];
        return n;
    }
    function A(e, t) {
        for (var n = e.length - 1, s = t || 0; n > s; s++) if (13 === e[s] && 10 === e[s + 1]) return s;
        return -1;
    }
    var I = e("util"), N = e("rdcommon/log"), x = e("net"), D = e("tls"), M = e("events").EventEmitter, k = e("mailparser/mailparser"), L = function() {}, O = "\r\n", B = Buffer(O), F = {
        NOCONNECT: 0,
        NOGREET: 1,
        NOAUTH: 2,
        AUTH: 3,
        BOXSELECTING: 4,
        BOXSELECTED: 5
    }, R = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ], P = /^\* (\d+) FETCH/, q = / \{(\d+)}$/, U = /BODY\[(.*)\](?:\<\d+\>)?/, G = /UID (\d+)/, H = /^( ?\d|\d{2})-(.{3})-(\d{4}) (\d{2}):(\d{2}):(\d{2}) ([+-]\d{4})$/, W = 36e5, z = 6e4;
    const j = ("}".charCodeAt(0), "*".charCodeAt(0)), X = ")".charCodeAt(0);
    var K = window.setTimeout.bind(window), Y = window.clearTimeout.bind(window);
    t.TEST_useTimeoutFuncs = function(e, t) {
        K = e, Y = t;
    };
    var $ = new Uint8Array(2e3);
    const V = /&([^-]*)-/g, J = /,/g;
    t.decodeModifiedUtf7 = o, t.parseImapDateTime = i;
    var Q = 1, Z = 2, et = 3, tt = 4;
    I.inherits(a, M), t.ImapConnection = a, a.prototype.hasCapability = function(e) {
        return -1 !== this.capabilities.indexOf(e);
    }, a.prototype.blacklistCapability = function(e) {
        var t = this.blacklistedCapabilities;
        if (e = C(e), -1 === t.indexOf(e)) {
            t.push(e);
            var n = this.capabilities.indexOf(e);
            -1 !== n && this.capabilities.splice(n, 1);
        }
    }, a.prototype._findAndShiftRequestByPrefix = function(e) {
        var t = this._state.requests.length;
        e = e.trim();
        var n, s;
        for (s = 0; t > s; s++) if (n = this._state.requests[s], n && n.prefix && 0 === n.prefix.lastIndexOf(e, 0)) return this._state.requests.splice(s, 1)[0];
        if (this._state.requests.length > 1) {
            var o = [];
            for (s = 0; t > s; s++) n = this._state.requests[s], o.push(n.prefix);
        }
        return this._state.requests.shift();
    }, a.prototype._findFetchRequest = function(e, t) {
        for (var n, s = this._state.requests, o = s.length, i = 0; o > i; i++) if (n = s[i].fetchParams, 
        n && n.uids[e] && n.bodyPart === t) return s[i];
    }, a.prototype.connect = function(e) {
        function t(e) {
            var t = null;
            if ("*" === e[0]) {
                if (a._state.status === F.NOGREET) {
                    if ("PREAUTH" === e[1]) return a._state.status = F.AUTH, 0 === a._state.numCapRecvs && (a._state.numCapRecvs = 1), 
                    void 0;
                    if ("NO" === e[1] || "BAD" === e[1] || "BYE" === e[1]) return a._LOG && "BAD" === e[1] && a._LOG.bad(e[2]), 
                    a._state.conn.end(), void 0;
                    if (e[2].startsWith("[CAPABILITY ") && (a._state.numCapRecvs = 1, a.capabilities = e[2].substring(12, e[2].lastIndexOf("]")).split(" ").map(C)), 
                    a._state.status = F.NOAUTH, a._state.postGreetingCallback) {
                        var n = a._state.postGreetingCallback;
                        a._state.postGreetingCallback = null, n();
                    }
                    return;
                }
                if (a._state.status === F.NOAUTH && "CAPABILITY" !== e[1] && "ALERT" !== e[1]) return;
                switch (e[1]) {
                  case "CAPABILITY":
                    a._state.numCapRecvs < 2 && a._state.numCapRecvs++, a.capabilities = e[2].split(" ").map(C);
                    break;

                  case "ENABLED":
                    a.enabledCapabilities = a.enabledCapabilities.concat(e[2].split(" ")), a.enabledCapabilities.sort();
                    break;

                  case "FLAGS":
                    a._state.status === F.BOXSELECTING && (a._state.box._flags = e[2].substr(1, e[2].length - 2).split(" ").map(function(e) {
                        return e.substr(1);
                    }));
                    break;

                  case "OK":
                    if (i = /^\[ALERT\] (.*)$/i.exec(e[2])) a.emit("alert", i[1]); else if (a._state.status === F.BOXSELECTING) {
                        var i;
                        if (i = /^\[UIDVALIDITY (\d+)\]/i.exec(e[2])) a._state.box.validity = i[1]; else if (i = /^\[UIDNEXT (\d+)\]/i.exec(e[2])) a._state.box._uidnext = parseInt(i[1]); else if (i = /^\[PERMANENTFLAGS \((.*)\)\]/i.exec(e[2])) {
                            a._state.box.permFlags = i[1].split(" ");
                            var r;
                            (r = a._state.box.permFlags.indexOf("\\*")) > -1 && (a._state.box._newKeywords = !0, 
                            a._state.box.permFlags.splice(r, 1)), a._state.box.keywords = a._state.box.permFlags.filter(function(e) {
                                return "\\" !== e[0];
                            });
                            for (var l = 0; l < a._state.box.keywords.length; l++) a._state.box.permFlags.splice(a._state.box.permFlags.indexOf(a._state.box.keywords[l]), 1);
                            a._state.box.permFlags = a._state.box.permFlags.map(function(e) {
                                return e.substr(1);
                            });
                        } else (i = /^\[HIGHESTMODSEQ (\d+)\]/i.exec(e[2])) ? a._state.box.highestModSeq = i[1] : (i = /^\[NOMODSEQ\]/i.exec(e[2])) && (a._state.box.highestModSeq = null);
                    }
                    break;

                  case "NAMESPACE":
                    m(e[2], a.namespaces);
                    break;

                  case "SEARCH":
                    a._state.requests[0].args.push(void 0 === e[2] || 0 === e[2].length ? [] : e[2].trim().split(" ").map(s));
                    break;

                  case "LIST":
                  case "XLIST":
                    var i;
                    if (null === a.delim && (i = /^\(\\No[sS]elect(?:[^)]*)\) (.+?) .*$/.exec(e[2]))) a.delim = "NIL" === i[1] ? !1 : i[1].substring(1, i[1].length - 1); else if (null !== a.delim) {
                        0 === a._state.requests[0].args.length && a._state.requests[0].args.push({}), i = /^\((.*)\) (.+?) "?([^"]+)"?$/.exec(e[2]);
                        var d = {
                            displayName: null,
                            attribs: i[1].split(" ").map(function(e) {
                                return e.substr(1).toUpperCase();
                            }),
                            delim: "NIL" === i[2] ? !1 : i[2].substring(1, i[2].length - 1),
                            children: null,
                            parent: null
                        }, u = i[3], f = a._state.requests[0].args[0];
                        if ('"' === u[0] && '"' === u[u.length - 1] && (u = u.substring(1, u.length - 1)), 
                        d.delim) {
                            var g = u.split(d.delim).filter(y), _ = null;
                            u = g.pop();
                            for (var l = 0, v = g.length; v > l; l++) f[g[l]] || (f[g[l]] = {
                                delim: d.delim
                            }), f[g[l]].children || (f[g[l]].children = {}), _ = f[g[l]], f = f[g[l]].children;
                            d.parent = _;
                        }
                        d.displayName = o(u), f[u] && (d.children = f[u].children), f[u] = d;
                    }
                    break;

                  case "VANISHED":
                    var b = !1;
                    0 === e[2].lastIndexOf("(EARLIER) ", 0) && (b = !0, e[2] = e[2].substring(10)), 
                    a.emit("vanished", h(e[2]), b);
                    break;

                  default:
                    if (/^\d+$/.test(e[1])) {
                        var S = a._state.requests[0] && a._state.requests[0].command.indexOf("NOOP") > -1 || a._state.isIdle && a._state.ext.idle.state === et;
                        switch (e[2]) {
                          case "EXISTS":
                            var w = a._state.box.messages.total, E = parseInt(e[1]);
                            a._state.box.messages.total = E, a._state.status !== F.BOXSELECTING && E > w && (a._state.box.messages.new = E - w, 
                            a.emit("mail", a._state.box.messages.new));
                            break;

                          case "RECENT":
                            a._state.box.messages.new = parseInt(e[1]);
                            break;

                          case "EXPUNGE":
                            a._state.box.messages.total > 0 && a._state.box.messages.total--, S && a.emit("deleted", parseInt(e[1], 10));
                            break;

                          default:
                            if (/^FETCH/.test(e[2])) {
                                var T = new c();
                                p(e[2].substring(e[2].indexOf("(") + 1, e[2].lastIndexOf(")")), "", T), T.seqno = parseInt(e[1], 10), 
                                a._state.requests.length && a._state.requests[0].command.indexOf("FETCH") > -1 ? (t = a._state.requests[0], 
                                t._fetcher.emit("message", T), T.emit("end")) : S && a.emit("msgupdate", T);
                            }
                        }
                    }
                }
            } else if ("A" === e[0][0] || "+" === e[0]) {
                if ("+" === e[0] && a._state.ext.idle.state === Z) return a._state.ext.idle.state = et, 
                process.nextTick(function() {
                    a._send();
                }), void 0;
                var A = !1;
                if (a._state.status === F.BOXSELECTING && ("OK" === e[1] ? (A = !0, a._state.status = F.BOXSELECTED) : (a._state.status = F.AUTH, 
                a._resetBox())), 0 === a._state.requests.length) return;
                var I = "+" !== e[0] ? a._findAndShiftRequestByPrefix(e[0]) : a._state.requests.shift();
                if (I.command.indexOf("RENAME") > -1 && (a._state.box.name = a._state.box._newName, 
                delete a._state.box._newName, A = !0), "function" == typeof I.callback) {
                    var N = null, x = I.args, D = I.command;
                    if ("+" === e[0]) {
                        if (a._state.requests.unshift(I), 0 === D.indexOf("APPEND")) return I.callback();
                        N = new Error("Unexpected continuation"), N.type = "continuation", N.serverResponse = "", 
                        N.request = D;
                    } else "OK" !== e[1] ? (N = new Error("Error while executing request: " + e[2]), 
                    N.type = e[1], N.serverResponse = e[2], N.request = D) : a._state.status === F.BOXSELECTED && (A ? x.unshift(a._state.box) : 0 !== D.indexOf("UID FETCH") && 0 !== D.indexOf("UID SEARCH") || 0 !== x.length || x.unshift([]));
                    x.unshift(N), I.callback.apply(I, x);
                }
                if (!I) {
                    if (a._state.status === F.NOCONNECT) return;
                    return console.error("IMAP: Somehow no recentReq for data:", e), void 0;
                }
                I.active && a._state.activeRequests--;
                var M = I.command;
                a._LOG && a._LOG.cmd_end(I.prefix, M, /^LOGIN$/.test(M) ? "***BLEEPING OUT LOGON***" : I.cmddata), 
                (0 !== a._state.requests.length || "LOGOUT" === M) && process.nextTick(function() {
                    a._send();
                }), a._state.isIdle = !0;
            } else "IDLE" === e[0] ? (a._state.requests.length && process.nextTick(function() {
                a._send();
            }), a._state.isIdle = !1, a._state.ext.idle.state = Q, a._state.ext.idle.timeWaited = 0) : a._LOG && a._LOG.unknownResponse(e[0], e[1], e[2]);
        }
        function n(e) {
            return a._state.curData = a._state.curData ? T(a._state.curData, e) : e, a._state.curData;
        }
        function i(e) {
            a._state.curData = e ? new Buffer(e) : null, a._state.curDataMinLength = 0;
        }
        function r(e) {
            if (0 !== e.length) {
                var s, o, r = null;
                if (null === a._state.curExpected) {
                    var l = 0;
                    if (a._state.curDataMinLength) {
                        if (a._state.curData.length + e.length < a._state.curDataMinLength) return n(e), 
                        void 0;
                        l = a._state.curDataMinLength - a._state.curData.length, a._state.curDataMinLength = 0;
                    }
                    if (-1 === (r = A(e, l))) return n(e), void 0;
                    e.length >= r + 2 && a._unprocessed.unshift(e.slice(r + 2)), e = e.slice(0, r), 
                    e = n(e);
                }
                if (o = o || a._state.requests[0], o && null !== a._state.curExpected) {
                    var d = e;
                    if (a._state.curXferred += e.length, a._state.curXferred > a._state.curExpected) {
                        var u = e.length - (a._state.curXferred - a._state.curExpected), h = e.slice(u);
                        d = u > 0 ? e.slice(0, u) : void 0, h.length && a._unprocessed.unshift(h), o._done = 1, 
                        a._state.curExpected = null;
                    }
                    return d && d.length && (a._LOG && a._LOG.data(d.length, d), "headers" === o._msgtype ? (d.copy(a._state.curData, o.curPos, 0), 
                    o.curPos += d.length) : o._msg.emit("data", d)), o._done && ("headers" === o._msgtype && (o._headers = a._state.curData.toString("ascii")), 
                    i()), void 0;
                }
                if (o && 1 === o._done) {
                    var m;
                    return e[e.length - 1] === X && (m = e.toString("ascii", 0, e.length - 1).trim(), 
                    m.length && (o._desc += " " + m), p(o._desc, o._headers, o._msg), o._done = !1, 
                    a._state.curXferred = 0, a._state.curExpected = null, i(), o._msg.emit("end", o._msg)), 
                    void 0;
                }
                if (e[0] === j && (f = e.toString("ascii")) && P.test(f) && (s = q.exec(f))) {
                    var f, g = parseInt(s[1], 10), y = U.exec(e);
                    if (!y) return e = n(B), a._state.curDataMinLength = e.length + g, void 0;
                    a._state.curExpected = g;
                    var v = f.substring(f.indexOf("(") + 1).trim(), b = y[1], C = G.exec(v)[1];
                    o = a._findFetchRequest(C, b) || a._state.requests[0];
                    var S = new c();
                    return a._state.requests[0] !== o && (a._state.requests.splice(a._state.requests.indexOf(o), 1), 
                    a._state.requests.unshift(o)), S.seqno = parseInt(s[1], 10), o._desc = v, o._msg = S, 
                    S.size = a._state.curExpected, o._fetcher.emit("message", S), o._msgtype = 0 === b.indexOf("HEADER") ? "headers" : "body", 
                    "headers" === o._msgtype && (i(a._state.curExpected), o.curPos = 0), a._LOG && a._LOG.data(f.length, f), 
                    void 0;
                }
                if (i(), e.length) {
                    var w = e.toString("ascii");
                    a._LOG && a._LOG.data(w.length, w), t(_(w, " ", 3));
                }
            }
        }
        var a = this, l = function() {
            var t = function() {
                var t = !1, n = function(s) {
                    return s ? (e(s), void 0) : !t && a.capabilities.indexOf("NAMESPACE") > -1 ? (t = !0, 
                    a._send("NAMESPACE", null, n), void 0) : (a._send('LIST "" ""', null, e), void 0);
                };
                a._login(n);
            };
            0 === a._state.numCapRecvs ? a._send("CAPABILITY", null, t) : t();
        };
        e = e || L, this._reset(), this._LOG && this._LOG.connect(this._options.host, this._options.port), 
        this._state.conn = ("ssl" === this._options.crypto || this._options.crypto === !0 ? D : x).connect(this._options.port, this._options.host), 
        this._state.tmrConn = K(this._fnTmrConn.bind(this, e), this._options.connTimeout), 
        this._state.conn.on("connect", function() {
            a._LOG && a._LOG.connected(), a._state.tmrConn && (Y(a._state.tmrConn), a._state.tmrConn = null), 
            a._state.status === F.NOCONNECT && (a._state.status = F.NOGREET);
        }), this._state.postGreetingCallback = function() {
            return "starttls" === a._options.crypto ? (a._state.numCapRecvs = 0, a._send("STARTTLS", null, function(t) {
                if (t) {
                    var n = new Error("Server does not support STARTTLS");
                    n.type = "bad-security", e(n);
                } else a._state.conn.upgradeToSecure(), l();
            }), void 0) : (l(), void 0);
        }, this._state.conn.on("data", function(e) {
            try {
                for (a._unprocessed.push(e); a._unprocessed.length; ) r(a._unprocessed.shift());
            } catch (t) {
                throw console.error("Explosion while processing data", t), "stack" in t && console.error("Stack:", t.stack), 
                t;
            }
        }), this._state.conn.on("close", function() {
            a._reset(), this._LOG && this._LOG.closed(), a.emit("close");
        }), this._state.conn.on("error", function(t) {
            try {
                var n;
                if (t && "object" == typeof t && /^Security/.test(t.name) && (t = new Error("SSL error"), 
                n = t.type = "bad-security"), a._state.tmrConn && (Y(a._state.tmrConn), a._state.tmrConn = null), 
                a._state.status === F.NOCONNECT) {
                    var s = new Error("Unable to connect. Reason: " + t);
                    s.type = n || "unresponsive-server", s.serverResponse = "", e(s);
                }
                a.emit("error", t), this._LOG && this._LOG.connError(t);
            } catch (o) {
                throw console.error("Error in imap onerror:", o), o;
            }
        });
    }, a.prototype.die = function() {
        this._state.conn && (this._state.conn.removeAllListeners(), this._state.conn.end()), 
        this._reset(), this._LOG && this._LOG.__die();
    }, a.prototype.isAuthenticated = function() {
        return this._state.status >= F.AUTH;
    }, a.prototype.logout = function(e) {
        if (!(this._state.status >= F.NOAUTH)) throw new Error("Not connected");
        this._send("LOGOUT", null, e);
    }, a.prototype.enable = function(e, t) {
        if (this._state.status < F.AUTH) throw new Error("Not connected or authenticated");
        this._send("ENABLE " + e.join(" "), t || L);
    }, a.prototype.openBox = function(e, t, n) {
        function s() {
            o._state.status = F.BOXSELECTING, o._state.box.name = e;
        }
        if (this._state.status < F.AUTH) throw new Error("Not connected or authenticated");
        this._state.status === F.BOXSELECTED && this._resetBox(), void 0 === n && (n = void 0 === t ? L : t, 
        t = !1);
        var o = this;
        this._send(t ? "EXAMINE" : "SELECT", ' "' + b(e) + '"', n, s);
    }, a.prototype.qresyncBox = function(e, t, n, s, o, i) {
        function r() {
            a._state.status = F.BOXSELECTING, a._state.box.name = e;
        }
        if (this._state.status < F.AUTH) throw new Error("Not connected or authenticated");
        if (-1 === this.enabledCapabilities.indexOf("QRESYNC")) throw new Error("QRESYNC is not enabled");
        this._state.status === F.BOXSELECTED && this._resetBox(), void 0 === i && (i = void 0 === t ? L : t, 
        t = !1);
        var a = this;
        this._send((t ? "EXAMINE" : "SELECT") + ' "' + b(e) + '"' + " (QRESYNC (" + n + " " + s + (o ? " " + o : "") + "))", i, r);
    }, a.prototype.closeBox = function(e) {
        var t = this;
        if (this._state.status !== F.BOXSELECTED) throw new Error("No mailbox is currently selected");
        this._send("CLOSE", null, function(n) {
            n || (t._state.status = F.AUTH, t._resetBox()), e(n);
        });
    }, a.prototype.removeDeleted = function(e) {
        if (this._state.status !== F.BOXSELECTED) throw new Error("No mailbox is currently selected");
        e = arguments[arguments.length - 1], this._send("EXPUNGE", null, e);
    }, a.prototype.getBoxes = function(e, t, n) {
        n = arguments[arguments.length - 1], arguments.length < 2 && (e = ""), arguments.length < 3 && (t = "*");
        var s, o = ' "' + b(e) + '" "' + b(t) + '"';
        -1 !== this.capabilities.indexOf("SPECIAL-USE") ? (s = "LIST", o += " RETURN (SPECIAL-USE)") : s = -1 !== this.capabilities.indexOf("XLIST") ? "XLIST" : "LIST", 
        this._send(s, o, n);
    }, a.prototype.addBox = function(e, t) {
        if (t = arguments[arguments.length - 1], "string" != typeof e || 0 === e.length) throw new Error("Mailbox name must be a string describing the full path of a new mailbox to be created");
        this._send("CREATE", ' "' + b(e) + '"', t);
    }, a.prototype.delBox = function(e, t) {
        if (t = arguments[arguments.length - 1], "string" != typeof e || 0 === e.length) throw new Error("Mailbox name must be a string describing the full path of an existing mailbox to be deleted");
        this._send("DELETE", ' "' + b(e) + '"', t);
    }, a.prototype.noop = function(e) {
        this._send("NOOP", "", e);
    }, a.prototype.renameBox = function(e, t, n) {
        if (n = arguments[arguments.length - 1], "string" != typeof e || 0 === e.length) throw new Error("Old mailbox name must be a string describing the full path of an existing mailbox to be renamed");
        if ("string" != typeof t || 0 === t.length) throw new Error("New mailbox name must be a string describing the full path of a new mailbox to be renamed to");
        this._state.status === F.BOXSELECTED && e === this._state.box.name && "INBOX" !== e && (this._state.box._newName = e), 
        this._send("RENAME", ' "' + b(e) + '" "' + b(t) + '"', n);
    }, a.prototype.search = function(e, t) {
        this._search("UID ", e, t);
    }, a.prototype._search = function(e, t, n) {
        if (this._state.status !== F.BOXSELECTED) throw new Error("No mailbox is currently selected");
        if (!Array.isArray(t)) throw new Error("Expected array for search options");
        this._send(e + "SEARCH", d(t, this.capabilities), n);
    }, a.prototype.append = function(e, t, n) {
        if ("function" == typeof t && (n = t, t = {}), t = t || {}, !("mailbox" in t)) {
            if (this._state.status !== F.BOXSELECTED) throw new Error("No mailbox specified or currently selected");
            t.mailbox = this._state.box.name;
        }
        var s = ' "' + b(t.mailbox) + '"';
        if ("flags" in t && (Array.isArray(t.flags) || (t.flags = Array(t.flags)), t.flags.length && (s += " (\\" + t.flags.join(" \\") + ")")), 
        "date" in t) {
            if (!(t.date instanceof Date)) throw new Error("Expected null or Date object for date");
            s += ' "' + r(t.date) + '"';
        }
        s += " {", s += e instanceof Blob ? e.size : Buffer.isBuffer(e) ? e.length : Buffer.byteLength(e), 
        s += "}";
        var o = this, i = 1;
        this._send("APPEND", s, function(t) {
            return t || 2 === i++ ? n(t) : ("string" == typeof e ? o._state.conn.write(Buffer(e + O)) : (o._state.conn.write(e), 
            o._state.conn.write(B)), this._LOG && this._LOG.sendData(e.length, e), void 0);
        });
    }, a.prototype.multiappend = function(e, t) {
        function n(e) {
            if ("flags" in e && (Array.isArray(e.flags) || (e.flags = Array(e.flags)), e.flags.length && (s += " (\\" + e.flags.join(" \\") + ")")), 
            "date" in e) {
                if (!(e.date instanceof Date)) throw new Error("Expected null or Date object for date");
                s += ' "' + r(e.date) + '"';
            }
            s += " {", s += l instanceof Blob ? l.size : Buffer.isBuffer(l) ? l.length : Buffer.byteLength(l), 
            s += "}";
        }
        if (this._state.status !== F.BOXSELECTED) throw new Error("No mailbox specified or currently selected");
        var s = ' "' + b(this._state.box.name) + '"', o = this, i = 1, a = !1, c = e[0], l = c.messageText;
        n(c), this._send("APPEND", s, function(r) {
            return r || a ? t(r, i - 1) : (o._state.conn.write("string" == typeof l ? Buffer(l) : l), 
            o._LOG && o._LOG.sendData(l.length, l), i < e.length ? (s = "", c = e[i++], l = c.messageText, 
            n(c), s += O, o._state.conn.write(Buffer(s)), o._LOG && o._LOG.sendData(s.length, s)) : (o._state.conn.write(B), 
            o._LOG && o._LOG.sendData(2, O), a = !0), void 0);
        });
    }, a.prototype.fetch = function(e, t) {
        return this._fetch("UID ", e, t);
    }, a.prototype._fetch = function(e, t, n) {
        if (this._state.status !== F.BOXSELECTED) throw new Error("No mailbox is currently selected");
        if (void 0 === t || null === t || Array.isArray(t) && 0 === t.length) throw new Error("Nothing to fetch");
        Array.isArray(t) || (t = [ t ]), u(t);
        var s, o = {
            markSeen: !1,
            request: {
                struct: !0,
                headers: !0,
                body: !1
            }
        }, i = "", r = this;
        if ("object" != typeof n && (n = {}), E(o, n, "request"), Array.isArray(o.request.headers)) s = "HEADER.FIELDS (" + o.request.headers.join(" ").toUpperCase() + ")"; else {
            if (Array.isArray(o.request.body)) {
                var a;
                if (2 !== o.request.body.length) throw new Error("Expected Array of length 2 for body byte range");
                if ("string" != typeof o.request.body[1] || !(a = /^([\d]+)\-([\d]+)$/.exec(o.request.body[1])) || parseInt(a[1]) >= parseInt(a[2])) throw new Error("Invalid body byte range format");
                i = "<" + parseInt(a[1]) + "." + parseInt(a[2]) + ">", o.request.body = o.request.body[0];
            }
            if ("boolean" == typeof o.request.headers && o.request.headers === !0) s = "HEADER"; else if ("boolean" == typeof o.request.body && o.request.body === !0) s = "TEXT"; else if ("string" == typeof o.request.body) if ("FULL" === o.request.body.toUpperCase()) s = ""; else {
                if (!/^([\d]+[\.]{0,1})*[\d]+$/.test(o.request.body)) throw new Error("Invalid body partID format");
                s = o.request.body;
            }
        }
        var c;
        if (1 === t.length && o.request.body) {
            var d = {};
            t.forEach(function(e) {
                d[e] = s;
            }), c = {
                uids: d,
                bodyPart: o.request.body
            };
        }
        var h = "";
        this.capabilities.indexOf("X-GM-EXT-1") > -1 ? h = "X-GM-THRID X-GM-MSGID X-GM-LABELS " : this.enabledCapabilities.indexOf("QRESYNC") > -1 && (h = "MODSEQ ");
        var m = " " + t.join(",") + " (" + h + "UID FLAGS INTERNALDATE" + (o.request.struct ? " BODYSTRUCTURE" : "") + ("string" == typeof s ? " BODY" + (o.markSeen ? "" : ".PEEK") + "[" + s + "]" + i : "") + ")", p = function(e) {
            var t = this._fetcher;
            e && t ? t.emit("error", e) : e && !t ? r.emit("error", e) : t && t.emit("end");
        };
        this._send(e + "FETCH", m, p, null, null, c);
        var f = new l();
        return this._state.requests[this._state.requests.length - 1]._fetcher = f, f;
    }, a.prototype.addFlags = function(e, t, n) {
        this._store("UID ", e, t, !0, n);
    }, a.prototype.delFlags = function(e, t, n) {
        this._store("UID ", e, t, !1, n);
    }, a.prototype.addKeywords = function(e, t, n) {
        return this._addKeywords("UID ", e, t, n);
    }, a.prototype._addKeywords = function(e, t, n, s) {
        if (!this._state.box._newKeywords) throw new Error("This mailbox does not allow new keywords to be added");
        this._store(e, t, n, !0, s);
    }, a.prototype.delKeywords = function(e, t, n) {
        this._store("UID ", e, t, !1, n);
    }, a.prototype.copy = function(e, t, n) {
        return this._copy("UID ", e, t, n);
    }, a.prototype._copy = function(e, t, n, s) {
        if (this._state.status !== F.BOXSELECTED) throw new Error("No mailbox is currently selected");
        Array.isArray(t) || (t = [ t ]), u(t), this._send(e + "COPY", " " + t.join(",") + ' "' + b(n) + '"', s);
    }, a.prototype.__defineGetter__("seq", function() {
        var e = this;
        return {
            move: function(t, n, s) {
                return e._move("", t, n, s);
            },
            copy: function(t, n, s) {
                return e._copy("", t, n, s);
            },
            delKeywords: function(t, n, s) {
                e._store("", t, n, !1, s);
            },
            addKeywords: function(t, n, s) {
                return e._addKeywords("", t, n, s);
            },
            delFlags: function(t, n, s) {
                e._store("", t, n, !1, s);
            },
            addFlags: function(t, n, s) {
                e._store("", t, n, !0, s);
            },
            fetch: function(t, n) {
                return e._fetch("", t, n);
            },
            search: function(t, n) {
                e._search("", t, n);
            }
        };
    }), a.prototype._fnTmrConn = function(e) {
        var t = new Error("Connection timed out");
        t.type = "timeout", e(t), this._state.conn.end();
    }, a.prototype._store = function(e, t, n, s, o) {
        if (this._state.status !== F.BOXSELECTED) throw new Error("No mailbox is currently selected");
        if (void 0 === t) throw new Error("The message ID(s) must be specified");
        if (Array.isArray(t) || (t = [ t ]), u(t), !Array.isArray(n) && "string" != typeof n || Array.isArray(n) && 0 === n.length) throw new Error((isKeywords ? "Keywords" : "Flags") + " argument must be a string or a non-empty Array");
        Array.isArray(n) || (n = [ n ]), n = n.join(" "), o = arguments[arguments.length - 1], 
        this._send(e + "STORE", " " + t.join(",") + " " + (s ? "+" : "-") + "FLAGS.SILENT (" + n + ")", o);
    }, a.prototype._login = function(e) {
        var t = this, n = function(n) {
            return n || (t._state.status = F.AUTH, 2 === t._state.numCapRecvs) ? (e(n), void 0) : (t._send("CAPABILITY", null, e), 
            void 0);
        };
        if (this._state.status === F.NOAUTH) {
            var s;
            if (this.capabilities.indexOf("LOGINDISABLED") > -1) return s = new Error("Logging in is disabled on this server"), 
            s.type = "server-maintenance", s.serverResponse = "LOGINDISABLED", e(s), void 0;
            if (-1 !== this.capabilities.indexOf("AUTH=XOAUTH") && "xoauth" in this._options) this._send("AUTHENTICATE XOAUTH " + b(this._options.xoauth), n); else if (this.capabilities.indexOf("AUTH=XOAUTH2") && "xoauth2" in this._options) this._send("AUTHENTICATE XOAUTH2 " + b(this._options.xoauth2), n); else {
                if (void 0 === this._options.username || void 0 === this._options.password) return s = new Error("Unsupported authentication mechanism(s) detected. Unable to login."), 
                s.type = "sucky-imap-server", s.serverResponse = "CAPABILITIES: " + this.capabilities.join(" "), 
                e(s), void 0;
                this._send("LOGIN", ' "' + b(this._options.username) + '" "' + b(this._options.password) + '"', n);
            }
        }
    }, a.prototype._reset = function() {
        this._state.tmrConn && Y(this._state.tmrConn), this._state.status = F.NOCONNECT, 
        this._state.numCapRecvs = 0, this._state.requests = [], this._state.unsentRequests = [], 
        this._state.postGreetingCallback = null, this._state.isIdle = !0, this._state.ext.idle.state = Q, 
        this._state.ext.idle.timeWaited = 0, this.namespaces = {
            personal: [],
            other: [],
            shared: []
        }, this.delim = null, this.capabilities = [], this._resetBox();
    }, a.prototype._resetBox = function() {
        this._state.box._uidnext = 0, this._state.box.validity = 0, this._state.box.highestModSeq = null, 
        this._state.box._flags = [], this._state.box._newKeywords = !1, this._state.box.permFlags = [], 
        this._state.box.keywords = [], this._state.box.name = null, this._state.box.messages.total = 0, 
        this._state.box.messages.new = 0;
    }, a.prototype._send = function(e, t, n, s, o, i) {
        var r;
        if (void 0 !== e && (r = {
            prefix: null,
            command: e,
            cmddata: t,
            callback: n,
            dispatch: s,
            args: [],
            fetchParams: i,
            active: !1
        }, o || (this._state.requests.push(r), this._state.unsentRequests.push(r))), this._state.ext.idle.state === Z || this._state.ext.idle.state === tt) return r;
        if (o) return this._writeRequest(r), r;
        var a = this._state.unsentRequests;
        if (0 === a.length) return null;
        if (0 === this._state.activeRequests && this._writeRequest(a.shift(), !0), this._state.lastRequest && this._state.lastRequest.fetchParams) for (;a.length && a[0].fetchParams; ) this._writeRequest(a.shift(), !0);
        return r;
    }, a.prototype._writeRequest = function(e, t) {
        var n = "", s = e.command, o = e.cmddata, i = e.dispatch;
        this._state.ext.idle.state === et && "DONE" !== s ? this._send("DONE", null, void 0, void 0, !0) : "IDLE" === s ? (n = "IDLE ", 
        this._state.ext.idle.state = Z) : "DONE" === s && (this._state.ext.idle.state = tt), 
        "IDLE" !== s && "DONE" !== s && (n = "A" + ++this._state.curId + " ", e.prefix = n, 
        this._state.lastRequest = e), i && i();
        var r, a = 0;
        for (r = 0; r < n.length; r++) $[a++] = n.charCodeAt(r);
        for (r = 0; r < s.length; r++) $[a++] = s.charCodeAt(r);
        if (o) if (o.length < $.length - 2) if ("string" == typeof o) for (r = 0; r < o.length; r++) $[a++] = o.charCodeAt(r); else $.set(o, a), 
        a += o.length; else this._state.conn.write($.subarray(0, a)), "string" == typeof o ? this._state.conn.write(Buffer(o)) : this._state.conn.write(o), 
        this._state.conn.write(B), a = 0;
        a && ($[a++] = 13, $[a++] = 10, this._state.conn.write($.subarray(0, a))), t && (e.active = !0, 
        this._state.activeRequests++), this._LOG && this._LOG.cmd_begin(n, s, /^LOGIN$/.test(s) ? "***BLEEPING OUT LOGON***" : o);
    }, I.inherits(c, M), I.inherits(l, M);
    const nt = /^\\Recent$/i;
    t.parseExpr = S;
    var st = t.LOGFAB = N.register(n, {
        ImapProtoConn: {
            type: N.CONNECTION,
            subtype: N.CLIENNT,
            events: {
                created: {},
                connect: {},
                connected: {},
                closed: {},
                sendData: {
                    length: !1
                },
                bypassCmd: {
                    prefix: !1,
                    cmd: !1
                },
                data: {
                    length: !1
                }
            },
            TEST_ONLY_events: {
                connect: {
                    host: !1,
                    port: !1
                },
                sendData: {
                    data: !1
                },
                data: {
                    data: N.TOSTRING
                }
            },
            errors: {
                connError: {
                    err: N.EXCEPTION
                },
                bad: {
                    msg: !1
                },
                unknownResponse: {
                    d0: !1,
                    d1: !1,
                    d2: !1
                }
            },
            asyncJobs: {
                cmd: {
                    prefix: !1,
                    cmd: !1
                }
            },
            TEST_ONLY_asyncJobs: {
                cmd: {
                    data: !1
                }
            }
        }
    });
}), define("mailapi/imap/probe", [ "imap", "exports" ], function(e, t) {
    function n(n, s, o) {
        var i = {
            host: s.hostname,
            port: s.port,
            crypto: s.crypto,
            username: n.username,
            password: n.password,
            connTimeout: t.CONNECT_TIMEOUT_MS
        };
        o && (i._logParent = o), console.log("PROBE:IMAP attempting to connect to", s.hostname), 
        this._conn = new e.ImapConnection(i), this._conn.connect(this.onLoggedIn.bind(this)), 
        this._conn.on("error", this.onError.bind(this)), this.tzOffset = null, this.blacklistedCapabilities = null, 
        this.onresult = null, this.error = null, this.errorDetails = {
            server: s.hostname
        };
    }
    t.CONNECT_TIMEOUT_MS = 3e4, t.ImapProber = n, n.prototype = {
        onLoggedIn: function(e) {
            return e ? (this.onError(e), void 0) : (r(this._conn, this.onGotTZOffset.bind(this)), 
            void 0);
        },
        onGotTZOffset: function(e, n) {
            return e ? (this.onError(e), void 0) : (console.log("PROBE:IMAP happy, TZ offset:", n / 36e5), 
            this.tzOffset = n, t.checkServerProblems(this._conn, this.onServerProblemsChecked.bind(this)), 
            void 0);
        },
        onServerProblemsChecked: function(e, t) {
            if (e) return this.onError(e), void 0;
            this.blacklistedCapabilities = t;
            var n = this._conn;
            this._conn = null, this.onresult && (this.onresult(this.error, n, this.tzOffset, t), 
            this.onresult = !1);
        },
        onError: function(e) {
            if (this.onresult) {
                console.warn("PROBE:IMAP sad.", e && e.name, "|", e && e.type, "|", e && e.message, "|", e && e.serverResponse);
                var t = s(e);
                this.error = t.name;
                try {
                    this._conn.die();
                } catch (n) {}
                this._conn = null, this.onresult(this.error, null, this.errorDetails), this.onresult = !1;
            }
        }
    };
    var s = t.normalizeError = function(e) {
        var t, n = !1, s = !0, o = !1;
        switch (e.type) {
          case "NO":
          case "no":
            n = !0, e.serverResponse ? (o = !0, s = !1, t = -1 !== e.serverResponse.indexOf("[ALERT] Application-specific password required") ? "needs-app-pass" : -1 !== e.serverResponse.indexOf("[ALERT] Your account is not enabled for IMAP use.") || -1 !== e.serverResponse.indexOf("[ALERT] IMAP access is disabled for your domain.") ? "imap-disabled" : "bad-user-or-pass") : (t = "unknown", 
            o = !1);
            break;

          case "BAD":
          case "bad":
            t = "bad-user-or-pass", o = !0, s = !1;
            break;

          case "server-maintenance":
            t = e.type, n = !0;
            break;

          case "bad-security":
            t = e.type, n = !0, s = !1;
            break;

          case "unresponsive-server":
          case "timeout":
            t = "unresponsive-server";
            break;

          default:
            t = "unknown";
        }
        return {
            name: t,
            reachable: n,
            retry: s,
            reportProblem: o
        };
    }, o = -252e5, i = t._extractTZFromHeaders = function(e) {
        for (var t = 0; t < e.length; t++) {
            var n = e[t];
            if ("received" === n.key) {
                var s = / ([+-]\d{4})/.exec(n.value);
                if (s) {
                    var o = 1e3 * 60 * 60 * parseInt(s[1].substring(1, 3), 10) + 1e3 * 60 * parseInt(s[1].substring(3, 5), 10);
                    return "-" === s[1].substring(0, 1) && (o *= -1), o;
                }
            }
        }
        return null;
    }, r = t.getTZOffset = function(e, t) {
        function n(e, n) {
            return e ? (t(e), void 0) : n.messages.total ? (s(n._uidnext - 1), void 0) : (t(null, o), 
            void 0);
        }
        function s(t) {
            e.search([ [ "UID", Math.max(1, t - 49) + ":" + t ] ], r.bind(null, t - 50));
        }
        function r(e, n, i) {
            if (!i.length) {
                if (0 > e) return t(null, o), void 0;
                s(e);
            }
            c = i, a(c.pop());
        }
        function a(n) {
            var s = e.fetch([ n ], {
                request: {
                    headers: [ "RECEIVED" ],
                    struct: !1,
                    body: !1
                }
            });
            s.on("message", function(e) {
                e.on("end", function() {
                    var n = i(e.msg.headers);
                    return null !== n ? (t(null, n), void 0) : (c.length ? a(c.pop()) : t(null, o), 
                    void 0);
                });
            }), s.on("error", function(e) {
                t(e);
            });
        }
        var c = null;
        e.openBox("INBOX", !0, n);
    };
    t.checkServerProblems = function(e, t) {
        function n(e) {
            for (var t in e) if ("inbox" === t.toLowerCase()) return !0;
            return !1;
        }
        e.hasCapability("SPECIAL-USE") || t(null, null), e.getBoxes(function(s, o) {
            return n(o) ? (t(null, null), void 0) : (e.blacklistCapability("SPECIAL-USE"), e.getBoxes(function(e, s) {
                n(s) ? t(null, [ "SPECIAL-USE" ]) : t("server-problem", null);
            }), void 0);
        });
    };
});