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
}), define("os", [ "exports" ], function(e) {
    e.hostname = function() {
        return "localhost";
    }, e.getHostname = e.hostname;
}), define("xoauth2", [ "require", "exports", "module" ], function() {}), define("simplesmtp/lib/client", [ "require", "exports", "module", "stream", "util", "net", "tls", "os", "xoauth2", "crypto" ], function(e, t, n) {
    function s(e, t, n) {
        if (o.call(this), this.writable = !0, this.readable = !0, this.options = n || {}, 
        this.options.crypto === !0 ? this.options.crypto = "ssl" : this.options.crypto === !1 && (this.options.crypto = "plain"), 
        this.port = e || ("ssl" === this.options.crypto ? 465 : 25), this.host = t || "localhost", 
        this.options.auth = this.options.auth || !1, this.options.maxConnections = this.options.maxConnections || 5, 
        !this.options.name) {
            var s = c.hostname && c.hostname() || c.getHostname && c.getHostname() || "";
            s.indexOf(".") < 0 && (s = "[127.0.0.1]"), s.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) && (s = "[" + s + "]"), 
            this.options.name = s;
        }
        this._init();
    }
    var o = e("stream").Stream, i = e("util"), r = e("net"), a = e("tls"), c = e("os"), l = e("xoauth2"), d = e("crypto");
    !r.connect && r.createConnection && (r.connect = r.createConnection), !a.connect && a.createConnection && (a.connect = a.createConnection), 
    n.exports = function(e, t, n) {
        var o = new s(e, t, n);
        return process.nextTick(o.connect.bind(o)), o;
    }, i.inherits(s, o), s.prototype._init = function() {
        this._secureMode = !1, this._ignoreData = !1, this._remainder = "", this.destroyed = !1, 
        this.socket = !1, this._supportedAuth = [], this._dataMode = !1, this._lastDataBytes = new Buffer(2), 
        this._currentAction = !1, ("plain" === this.options.crypto || "ssl" === this.options.crypto) && (this._secureMode = !0), 
        this._xoauth2 = !1, "object" == typeof this.options.auth.XOAuth2 && "function" == typeof this.options.auth.XOAuth2.getToken ? this._xoauth2 = this.options.auth.XOAuth2 : "object" == typeof this.options.auth.XOAuth2 && (!this.options.auth.XOAuth2.user && this.options.auth.user && (this.options.auth.XOAuth2.user = this.options.auth.user), 
        this._xoauth2 = l.createXOAuth2Generator(this.options.auth.XOAuth2));
    }, s.prototype.connect = function() {
        "ssl" === this.options.crypto ? this.socket = a.connect(this.port, this.host, {}, this._onConnect.bind(this)) : (this.socket = r.connect(this.port, this.host), 
        this.socket.on("connect", this._onConnect.bind(this))), this.socket.on("error", this._onError.bind(this));
    }, s.prototype._upgradeConnection = function(e) {
        this._secureMode = !0, this.socket.upgradeToSecure(), e(null, !0);
    }, s.prototype._onConnect = function() {
        "setKeepAlive" in this.socket ? this.socket.setKeepAlive(!0) : this.socket.encrypted && "setKeepAlive" in this.socket.encrypted && this.socket.encrypted.setKeepAlive(!0), 
        this.socket.on("data", this._onData.bind(this)), this.socket.on("close", this._onClose.bind(this)), 
        this.socket.on("end", this._onEnd.bind(this)), this.socket.setTimeout(108e5), this.socket.on("timeout", this._onTimeout.bind(this)), 
        this._currentAction = this._actionGreeting;
    }, s.prototype._destroy = function() {
        this._destroyed || (this._destroyed = !0, this.emit("end"), this.removeAllListeners());
    }, s.prototype._onData = function(e) {
        var t;
        if (!this._ignoreData && e && e.length) {
            if (10 != e[e.length - 1]) return this._remainder += e.toString(), void 0;
            t = (this._remainder + e.toString()).trim(), this._remainder = "", this.options.debug && console.log("SERVER" + (this.options.instanceId ? " " + this.options.instanceId : "") + ":\n└──" + t.replace(/\r?\n/g, "\n   ")), 
            "function" == typeof this._currentAction && this._currentAction.call(this, t);
        }
    }, s.prototype._onError = function(e, t, n) {
        t && "Error" != t && (e.name = t), n && (e.data = n), this.emit("error", e), this.close();
    }, s.prototype._onClose = function() {
        this._destroy();
    }, s.prototype._onEnd = function() {
        this._destroy();
    }, s.prototype._onTimeout = function() {
        this.close();
    }, s.prototype.write = function(e) {
        return this._dataMode ? ("string" == typeof e && (e = new Buffer(e, "utf-8")), e.length > 2 ? (this._lastDataBytes[0] = e[e.length - 2], 
        this._lastDataBytes[1] = e[e.length - 1]) : 1 == e.length && (this._lastDataBytes[0] = this._lastDataBytes[1], 
        this._lastDataBytes[1] = e[0]), this.options.debug && console.log("CLIENT (DATA)" + (this.options.instanceId ? " " + this.options.instanceId : "") + ":\n└──" + e.toString().trim().replace(/\n/g, "\n   ")), 
        this.socket.write(e)) : !0;
    }, s.prototype.end = function(e) {
        return this._dataMode ? (e && e.length && this.write(e), this._currentAction = this._actionStream, 
        13 == this._lastDataBytes[0] && 10 == this._lastDataBytes[1] ? this.socket.write(new Buffer(".\r\n", "utf-8")) : 13 == this._lastDataBytes[1] ? this.socket.write(new Buffer("\n.\r\n")) : this.socket.write(new Buffer("\r\n.\r\n")), 
        this._dataMode = !1, void 0) : !0;
    }, s.prototype.sendCommand = function(e) {
        this.options.debug && console.log("CLIENT" + (this.options.instanceId ? " " + this.options.instanceId : "") + ":\n└──" + (e || "").toString().trim().replace(/\n/g, "\n   ")), 
        this.socket.write(new Buffer(e + "\r\n", "utf-8"));
    }, s.prototype.quit = function() {
        this.sendCommand("QUIT"), this._currentAction = this.close;
    }, s.prototype.close = function() {
        this.options.debug && console.log("Closing connection to the server"), this.socket && this.socket.socket && this.socket.socket.end && !this.socket.socket.destroyed && this.socket.socket.end(), 
        this.socket && this.socket.end && !this.socket.destroyed && this.socket.end(), this._destroy();
    }, s.prototype.useEnvelope = function(e) {
        this._envelope = e || {}, this._envelope.from = this._envelope.from || "anonymous@" + this.options.name, 
        this._envelope.rcptQueue = JSON.parse(JSON.stringify(this._envelope.to || [])), 
        this._envelope.rcptFailed = [], this._currentAction = this._actionMAIL, this.sendCommand("MAIL FROM:<" + this._envelope.from + ">");
    }, s.prototype._authenticateUser = function() {
        if (!this.options.auth) return this._currentAction = this._actionIdle, this.emit("idle"), 
        void 0;
        var e;
        switch (e = this.options.auth.XOAuthToken && this._supportedAuth.indexOf("XOAUTH") >= 0 ? "XOAUTH" : this._xoauth2 && this._supportedAuth.indexOf("XOAUTH2") >= 0 ? "XOAUTH2" : this.options.authMethod ? this.options.authMethod.toUpperCase().trim() : (this._supportedAuth[0] || "PLAIN").toUpperCase().trim()) {
          case "XOAUTH":
            return this._currentAction = this._actionAUTHComplete, "object" == typeof this.options.auth.XOAuthToken && "function" == typeof this.options.auth.XOAuthToken.generate ? this.options.auth.XOAuthToken.generate(function(e, t) {
                return e ? this._onError(e, "XOAuthTokenError") : (this.sendCommand("AUTH XOAUTH " + t), 
                void 0);
            }.bind(this)) : this.sendCommand("AUTH XOAUTH " + this.options.auth.XOAuthToken.toString()), 
            void 0;

          case "XOAUTH2":
            return this._currentAction = this._actionAUTHComplete, this._xoauth2.getToken(function(e, t) {
                return e ? (this._onError(e, "XOAUTH2Error"), void 0) : (this.sendCommand("AUTH XOAUTH2 " + t), 
                void 0);
            }.bind(this)), void 0;

          case "LOGIN":
            return this._currentAction = this._actionAUTH_LOGIN_USER, this.sendCommand("AUTH LOGIN"), 
            void 0;

          case "PLAIN":
            return this._currentAction = this._actionAUTHComplete, this.sendCommand("AUTH PLAIN " + new Buffer(this.options.auth.user + "\0" + this.options.auth.user + "\0" + this.options.auth.pass, "utf-8").toString("base64")), 
            void 0;

          case "CRAM-MD5":
            return this._currentAction = this._actionAUTH_CRAM_MD5, this.sendCommand("AUTH CRAM-MD5"), 
            void 0;
        }
        this._onError(new Error("Unknown authentication method - " + e), "UnknowAuthError");
    }, s.prototype._actionGreeting = function(e) {
        return "220" != e.substr(0, 3) ? (this._onError(new Error("Invalid greeting from server - " + e), !1, e), 
        void 0) : (this._currentAction = this._actionEHLO, this.sendCommand("EHLO " + this.options.name), 
        void 0);
    }, s.prototype._actionEHLO = function(e) {
        return "2" != e.charAt(0) ? this._secureMode || "starttls" !== this.options.crypto ? (this._currentAction = this._actionHELO, 
        this.sendCommand("HELO " + this.options.name), void 0) : (this._onError(new Error("No EHLO support means no STARTTLS"), "SecurityError"), 
        void 0) : this._secureMode || "starttls" !== this.options.crypto ? (e.match(/AUTH(?:\s+[^\n]*\s+|\s+)PLAIN/i) && this._supportedAuth.push("PLAIN"), 
        e.match(/AUTH(?:\s+[^\n]*\s+|\s+)LOGIN/i) && this._supportedAuth.push("LOGIN"), 
        e.match(/AUTH(?:\s+[^\n]*\s+|\s+)CRAM-MD5/i) && this._supportedAuth.push("CRAM-MD5"), 
        e.match(/AUTH(?:\s+[^\n]*\s+|\s+)XOAUTH/i) && this._supportedAuth.push("XOAUTH"), 
        e.match(/AUTH(?:\s+[^\n]*\s+|\s+)XOAUTH2/i) && this._supportedAuth.push("XOAUTH2"), 
        this._authenticateUser.call(this), void 0) : (this.sendCommand("STARTTLS"), this._currentAction = this._actionSTARTTLS, 
        void 0);
    }, s.prototype._actionHELO = function(e) {
        return "2" != e.charAt(0) ? (this._onError(new Error("Invalid response for EHLO/HELO - " + e), !1, e), 
        void 0) : (this._authenticateUser.call(this), void 0);
    }, s.prototype._actionSTARTTLS = function(e) {
        return "2" != e.charAt(0) ? (this._onError(new Error("Error initiating TLS - " + e), "SecurityError"), 
        void 0) : (this._upgradeConnection(function(e, t) {
            return e ? (this._onError(new Error("Error initiating TLS - " + (e.message || e)), "TLSError"), 
            void 0) : (this.options.debug && console.log("Connection secured"), t ? (this._currentAction = this._actionEHLO, 
            this.sendCommand("EHLO " + this.options.name)) : this._authenticateUser.call(this), 
            void 0);
        }.bind(this)), void 0);
    }, s.prototype._actionAUTH_LOGIN_USER = function(e) {
        return "334 VXNlcm5hbWU6" != e ? (this._onError(new Error("Invalid login sequence while waiting for '334 VXNlcm5hbWU6' - " + e), !1, e), 
        void 0) : (this._currentAction = this._actionAUTH_LOGIN_PASS, this.sendCommand(new Buffer(this.options.auth.user, "utf-8").toString("base64")), 
        void 0);
    }, s.prototype._actionAUTH_CRAM_MD5 = function(e) {
        var t = e.match(/^334\s+(.+)$/), n = "";
        if (!t) return this._onError(new Error("Invalid login sequence while waiting for server challenge string - " + e), !1, e), 
        void 0;
        n = t[1];
        var s = new Buffer(n, "base64").toString("ascii"), o = d.createHmac("md5", this.options.auth.pass);
        o.update(s);
        var i = o.digest("hex"), r = this.options.auth.user + " " + i;
        this._currentAction = this._actionAUTH_CRAM_MD5_PASS, this.sendCommand(new Buffer(r).toString("base64"));
    }, s.prototype._actionAUTH_CRAM_MD5_PASS = function(e) {
        return e.match(/^235\s+/) ? (this._currentAction = this._actionIdle, this.emit("idle"), 
        void 0) : (this._onError(new Error("Invalid login sequence while waiting for '235 go ahead' - " + e), !1, e), 
        void 0);
    }, s.prototype._actionAUTH_LOGIN_PASS = function(e) {
        return "334 UGFzc3dvcmQ6" != e ? (this._onError(new Error("Invalid login sequence while waiting for '334 UGFzc3dvcmQ6' - " + e), !1, e), 
        void 0) : (this._currentAction = this._actionAUTHComplete, this.sendCommand(new Buffer(this.options.auth.pass, "utf-8").toString("base64")), 
        void 0);
    }, s.prototype._actionAUTHComplete = function(e) {
        var t;
        if (this._xoauth2 && "334" == e.substr(0, 3)) try {
            return t = e.split(" "), t.shift(), t = JSON.parse(new Buffer(t.join(" "), "base64").toString("utf-8")), 
            (!this._xoauth2.reconnectCount || this._xoauth2.reconnectCount < 2) && [ "400", "401" ].indexOf(t.status) >= 0 ? (this._xoauth2.reconnectCount = (this._xoauth2.reconnectCount || 0) + 1, 
            this._currentAction = this._actionXOAUTHRetry) : (this._xoauth2.reconnectCount = 0, 
            this._currentAction = this._actionAUTHComplete), this.sendCommand(new Buffer(0)), 
            void 0;
        } catch (n) {}
        return this._xoauth2.reconnectCount = 0, "2" != e.charAt(0) ? (this._onError(new Error("Invalid login - " + e), "AuthError", e), 
        void 0) : (this._currentAction = this._actionIdle, this.emit("idle"), void 0);
    }, s.prototype._actionXOAUTHRetry = function() {
        this._xoauth2.generateToken(function(e, t) {
            return e ? (this._onError(e, "XOAUTH2Error"), void 0) : (this._currentAction = this._actionAUTHComplete, 
            this.sendCommand("AUTH XOAUTH2 " + t), void 0);
        }.bind(this));
    }, s.prototype._actionIdle = function(e) {
        return Number(e.charAt(0)) > 3 ? (this._onError(new Error(e), !1, e), void 0) : void 0;
    }, s.prototype._actionMAIL = function(e) {
        return "2" != Number(e.charAt(0)) ? (this._onError(new Error("Mail from command failed - " + e), "SenderError", e), 
        void 0) : (this._envelope.rcptQueue.length ? (this._envelope.curRecipient = this._envelope.rcptQueue.shift(), 
        this._currentAction = this._actionRCPT, this.sendCommand("RCPT TO:<" + this._envelope.curRecipient + ">")) : this._onError(new Error("Can't send mail - no recipients defined"), "RecipientError"), 
        void 0);
    }, s.prototype._actionRCPT = function(e) {
        if ("2" != Number(e.charAt(0)) && this._envelope.rcptFailed.push(this._envelope.curRecipient), 
        this._envelope.rcptQueue.length) this._envelope.curRecipient = this._envelope.rcptQueue.shift(), 
        this._currentAction = this._actionRCPT, this.sendCommand("RCPT TO:<" + this._envelope.curRecipient + ">"); else {
            if (!(this._envelope.rcptFailed.length < this._envelope.to.length)) return this._onError(new Error("Can't send mail - all recipients were rejected"), "RecipientError"), 
            void 0;
            this.emit("rcptFailed", this._envelope.rcptFailed), this._currentAction = this._actionDATA, 
            this.sendCommand("DATA");
        }
    }, s.prototype._actionDATA = function(e) {
        return [ 2, 3 ].indexOf(Number(e.charAt(0))) < 0 ? (this._onError(new Error("Data command failed - " + e), !1, e), 
        void 0) : (this._dataMode = !0, this._currentAction = this._actionIdle, this.emit("message"), 
        void 0);
    }, s.prototype._actionStream = function(e) {
        "2" != Number(e.charAt(0)) ? this.emit("ready", !1, e) : this.emit("ready", !0, e), 
        this._currentAction = this._actionIdle, process.nextTick(this.emit.bind(this, "idle"));
    };
}), define("mailapi/smtp/probe", [ "simplesmtp/lib/client", "exports" ], function(e, t) {
    function n(n, o) {
        console.log("PROBE:SMTP attempting to connect to", o.hostname), this._conn = e(o.port, o.hostname, {
            crypto: o.crypto,
            auth: {
                user: void 0 !== n.outgoingUsername ? n.outgoingUsername : n.username,
                pass: void 0 !== n.outgoingPassword ? n.outgoingPassword : n.password
            },
            debug: t.TEST_USE_DEBUG_MODE
        }), this.setConnectionListenerCallback(this.onConnectionResult), this.timeoutId = s(function() {
            this._conn.emit("error", "unresponsive-server");
        }.bind(this), t.CONNECT_TIMEOUT_MS), this.emailAddress = o.emailAddress, this.onresult = null, 
        this.error = null, this.errorDetails = {
            server: o.hostname
        };
    }
    var s = window.setTimeout.bind(window), o = window.clearTimeout.bind(window);
    t.TEST_useTimeoutFuncs = function(e, t) {
        s = e, o = t;
    }, t.TEST_USE_DEBUG_MODE = !1, t.CONNECT_TIMEOUT_MS = 3e4, t.SmtpProber = n, n.prototype = {
        setConnectionListenerCallback: function(e) {
            this._conn.removeAllListeners(), this._conn.on("idle", e.bind(this, null)), this._conn.on("error", e.bind(this)), 
            this._conn.on("end", e.bind(this, "unknown"));
        },
        onConnectionResult: function(e) {
            if (this.onresult) {
                if (e && "object" == typeof e) if (e.name && /^Security/.test(e.name)) e = "bad-security"; else switch (e.name) {
                  case "AuthError":
                    e = "bad-user-or-pass";
                    break;

                  case "UnknownAuthError":
                  default:
                    e = "server-problem";
                }
                e ? this.cleanup(e) : (console.log("PROBE:SMTP connected, checking address validity"), 
                this.setConnectionListenerCallback(this.onAddressValidityResult), this._conn.useEnvelope({
                    from: this.emailAddress,
                    to: [ this.emailAddress ]
                }), this._conn.on("message", function() {
                    this.onAddressValidityResult(null);
                }.bind(this)));
            }
        },
        onAddressValidityResult: function(e) {
            this.onresult && (!e || "SenderError" !== e.name && "RecipientError" !== e.name ? e && e.name && (e = "server-problem") : e = "bad-address", 
            this.cleanup(e));
        },
        cleanup: function(e) {
            o(this.timeoutId), e ? console.warn("PROBE:SMTP sad. error: | " + (e && e.name || e) + " | " + (e && e.message || "") + " |") : console.log("PROBE:SMTP happy"), 
            this.error = e, this.onresult(this.error, this.errorDetails), this.onresult = null, 
            this._conn.close();
        }
    };
});