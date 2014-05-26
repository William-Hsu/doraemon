(function() {
    function e(e) {
        setTimeout(e);
    }
    window.setZeroTimeout = e;
})(), define("mailapi/worker-support/shim-sham", [], function() {}), define("addressparser/index", [ "require", "exports", "module" ], function(e, t, n) {
    function s(e) {
        var t = new i(e), n = t.tokenize(), s = [], r = [], a = [];
        return n.forEach(function(e) {
            "operator" != e.type || "," != e.value && ";" != e.value ? r.push(e) : (s.push(r), 
            r = []);
        }), r.length && s.push(r), s.forEach(function(e) {
            e = o(e), e.length && (a = a.concat(e));
        }), a;
    }
    function o(e) {
        var t, n, o, i, r = !1, a = "text", c = [], l = {
            address: [],
            comment: [],
            group: [],
            text: []
        };
        for (o = 0, i = e.length; i > o; o++) if (t = e[o], "operator" == t.type) switch (t.value) {
          case "<":
            a = "address";
            break;

          case "(":
            a = "comment";
            break;

          case ":":
            a = "group", r = !0;
            break;

          default:
            a = "text";
        } else t.value && l[a].push(t.value);
        if (!l.text.length && l.comment.length && (l.text = l.comment, l.comment = []), 
        l.group.length) l.text.length && (l.text = l.text.join(" ")), c = c.concat(s(l.group.join(",")).map(function(e) {
            return e.name = l.text || e.name, e;
        })); else {
            if (!l.address.length && l.text.length) {
                for (o = l.text.length - 1; o >= 0; o--) if (l.text[o].match(/^[^@\s]+@[^@\s]+$/)) {
                    l.address = l.text.splice(o, 1);
                    break;
                }
                if (!l.address.length) for (o = l.text.length - 1; o >= 0 && (l.text[o] = l.text[o].replace(/\s*\b[^@\s]+@[^@\s]+\b\s*/, function(e) {
                    return l.address.length ? e : (l.address = [ e.trim() ], " ");
                }).trim(), !l.address.length); o--) ;
            }
            if (!l.text.length && l.comment.length && (l.text = l.comment, l.comment = []), 
            l.address.length > 1 && (l.text = l.text.concat(l.address.splice(1))), l.text = l.text.join(" "), 
            l.address = l.address.join(" "), !l.address && r) return [];
            n = {
                address: l.address || l.text || "",
                name: l.text || l.address || ""
            }, n.address == n.name && ((n.address || "").match(/@/) ? n.name = "" : n.address = ""), 
            c.push(n);
        }
        return c;
    }
    function i(e) {
        this.str = (e || "").toString(), this.operatorCurrent = "", this.operatorExpecting = "", 
        this.node = null, this.escaped = !1, this.list = [];
    }
    n.exports = s, i.prototype.operators = {
        '"': '"',
        "(": ")",
        "<": ">",
        ",": "",
        ":": ";"
    }, i.prototype.tokenize = function() {
        for (var e, t = [], n = 0, s = this.str.length; s > n; n++) e = this.str.charAt(n), 
        this.checkChar(e);
        return this.list.forEach(function(e) {
            e.value = (e.value || "").toString().trim(), e.value && t.push(e);
        }), t;
    }, i.prototype.checkChar = function(e) {
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
}), define("mailapi/mailapi", [ "exports", "addressparser" ], function(e, t) {
    function n(e, t, n) {
        this._api = e, this.id = t.id, this._wireRep = t, this.acctsSlice = n, this.type = t.type, 
        this.name = t.name, this.syncRange = t.syncRange, this.syncInterval = t.syncInterval, 
        this.notifyOnNew = t.notifyOnNew, this.enabled = t.enabled, this.problems = t.problems, 
        this.identities = [];
        for (var o = 0; o < t.identities.length; o++) this.identities.push(new s(this._api, t.identities[o]));
        this.username = t.credentials.username, this.servers = t.servers, this.element = null, 
        this.data = null;
    }
    function s(e, t) {
        this._api = e, this.id = t.id, this.name = t.name, this.address = t.address, this.replyTo = t.replyTo, 
        this.signature = t.signature;
    }
    function o(e, t) {
        this._api = e, this.id = t.id, this._wireRep = t, this.name = t.name, this.path = t.path, 
        this.depth = t.depth, this.type = t.type, this.name = this._api.l10n_folder_name(this.name, this.type), 
        this.__update(t), this.selectable = "account" !== t.type && "nomail" !== t.type, 
        this.onchange = null, this.onremove = null, this.element = null, this.data = null;
    }
    function i(e) {
        for (var t = [], n = e.length - 1; n >= 0; n--) "\\" !== e[n][0] && t.push(e[n]);
        return t;
    }
    function r(e) {
        return {
            date: e.date.valueOf(),
            suid: e.id,
            guid: e.guid
        };
    }
    function a() {
        var e = this.ownerDocument.defaultView || window;
        e.URL.revokeObjectURL(this.src);
    }
    function c(e, t) {
        var n = e.ownerDocument.defaultView || window;
        e.src = n.URL.createObjectURL(t), e.addEventListener("load", a);
    }
    function l(e, t, n, s) {
        this.name = e, this.address = t, this.contactId = n, this._thumbnailBlob = s, this.element = null, 
        this.data = null, this.type = null, this.onchange = null;
    }
    function d(e, t) {
        this._slice = e, this._wireRep = t, this.id = t.suid, this.guid = t.guid, this.author = w.resolvePeep(t.author), 
        this.to = w.resolvePeeps(t.to), this.cc = w.resolvePeeps(t.cc), this.bcc = w.resolvePeeps(t.bcc), 
        this.replyTo = t.replyTo, this.date = new Date(t.date), this.__update(t), this.hasAttachments = t.hasAttachments, 
        this.subject = t.subject, this.snippet = t.snippet, this.onchange = null, this.onremove = null, 
        this.element = null, this.data = null;
    }
    function u(e, t) {
        this.header = new d(e, t.header), this.matches = t.matches, this.element = null, 
        this.data = null;
    }
    function h(e, t, n, s) {
        if (this._api = e, this.id = t, this._date = n.date, this._handle = s, this.attachments = null, 
        n.attachments) {
            this.attachments = [];
            for (var o = 0; o < n.attachments.length; o++) this.attachments.push(new p(this, n.attachments[o]));
        }
        this._relatedParts = n.relatedParts, this.bodyReps = n.bodyReps, this._references = n.references, 
        this.onchange = null, this.ondead = null;
    }
    function p(e, t) {
        this._body = e, this.partId = t.part, this.filename = t.name, this.mimetype = t.type, 
        this.sizeEstimateInBytes = t.sizeEstimate, this._file = t.file, this.element = null, 
        this.data = null;
    }
    function m(e, t, n, s) {
        this._api = e, this.operation = t, this.affectedCount = n, this._tempHandle = s, 
        this._longtermIds = null, this._undoRequested = !1;
    }
    function f(e, t, n) {
        this._api = e, this._ns = t, this._handle = n, this.items = [], this.status = "new", 
        this.syncProgress = 0, this.atTop = !1, this.atBottom = !1, this.userCanGrowUpwards = !1, 
        this.userCanGrowDownwards = !1, this.pendingRequestCount = 0, this._growing = 0, 
        this.onadd = null, this.onchange = null, this.onsplice = null, this.onremove = null, 
        this.onstatus = null, this.oncomplete = null, this.ondead = null;
    }
    function g(e, t) {
        f.call(this, e, "accounts", t);
    }
    function _(e, t) {
        f.call(this, e, "folders", t);
    }
    function y(e, t, n) {
        f.call(this, e, n || "headers", t), this._bodiesRequestId = 1, this._bodiesRequest = {};
    }
    function v(e, t) {
        this._api = e, this._handle = t, this.senderIdentity = null, this.to = null, this.cc = null, 
        this.bcc = null, this.subject = null, this.body = null, this._references = null, 
        this.attachments = null, this.hasDraft = !1;
    }
    function b() {
        console.error.apply(console, arguments);
        for (var e = null, t = 0; t < arguments.length; t++) e ? e += " " + arguments[t] : e = "" + arguments[t];
        throw new Error(e);
    }
    function S() {
        this._nextHandle = 1, this._slices = {}, this._pendingRequests = {}, this._liveBodies = {}, 
        this._spliceFireFuncs = [], this._storedSends = [], this._processingMessage = null, 
        this._deferredMessages = [], this.config = {}, this.onbadlogin = null, w.init();
    }
    n.prototype = {
        toString: function() {
            return "[MailAccount: " + this.type + " " + this.id + "]";
        },
        toJSON: function() {
            return {
                type: "MailAccount",
                accountType: this.type,
                id: this.id
            };
        },
        __update: function(e) {
            this.enabled = e.enabled, this.problems = e.problems, this.syncInterval = e.syncInterval, 
            this.notifyOnNew = e.notifyOnNew, this._wireRep.defaultPriority = e.defaultPriority;
        },
        __die: function() {},
        clearProblems: function(e) {
            this._api._clearAccountProblems(this, e);
        },
        modifyAccount: function(e, t) {
            this._api._modifyAccount(this, e, t);
        },
        deleteAccount: function() {
            this._api._deleteAccount(this);
        },
        get isDefault() {
            if (!this.acctsSlice) throw new Error("No account slice available");
            return this.acctsSlice.defaultAccount === this;
        }
    }, s.prototype = {
        toString: function() {
            return "[MailSenderIdentity: " + this.type + " " + this.id + "]";
        },
        toJSON: function() {
            return {
                type: "MailSenderIdentity"
            };
        },
        __die: function() {}
    }, o.prototype = {
        toString: function() {
            return "[MailFolder: " + this.path + "]";
        },
        toJSON: function() {
            return {
                type: this.type,
                path: this.path
            };
        },
        __update: function(e) {
            this.lastSyncedAt = e.lastSyncedAt ? new Date(e.lastSyncedAt) : null;
        },
        __die: function() {}
    };
    var w = e.ContactCache = {
        _contactCache: Object.create(null),
        _cacheHitEntries: 0,
        _cacheEmptyEntries: 0,
        MAX_CACHE_HITS: 256,
        MAX_CACHE_EMPTY: 1024,
        _livePeepsById: Object.create(null),
        _livePeepsByEmail: Object.create(null),
        pendingLookupCount: 0,
        callbacks: [],
        init: function() {
            var e = navigator.mozContacts;
            e && (e.oncontactchange = this._onContactChange.bind(this));
        },
        _resetCache: function() {
            this._contactCache = Object.create(null), this._cacheHitEntries = 0, this._cacheEmptyEntries = 0;
        },
        shutdown: function() {
            var e = navigator.mozContacts;
            e && (e.oncontactchange = null);
        },
        _onContactChange: function(e) {
            function t(e) {
                for (var t = 0; t < e.length; t++) {
                    var n = e[t];
                    if (n.contactId = null, n.onchange) try {
                        n.onchange(n);
                    } catch (s) {
                        I("peep.onchange error", s, "\n", s.stack);
                    }
                }
            }
            var n = navigator.mozContacts, s = this._livePeepsById, o = this._livePeepsByEmail;
            if ((this._cacheHitEntries || this._cacheEmptyEntries) && this._resetCache(), "remove" === e.reason) {
                var i;
                if (e.contactID) i = s[e.contactID], i && (t(i), delete s[e.contactID]); else for (var r in s) i = s[r], 
                t(i), this._livePeepsById = Object.create(null);
            } else {
                var a = n.find({
                    filterBy: [ "id" ],
                    filterOp: "equals",
                    filterValue: e.contactID
                });
                a.onsuccess = function() {
                    if (a.result.length) {
                        var t, n, i, r = a.result[0];
                        if ("update" === e.reason && (t = s[r.id])) {
                            var c = r.email ? r.email.map(function(e) {
                                return e.value;
                            }) : [];
                            for (n = 0; n < t.length; n++) if (i = t[n], -1 === c.indexOf(i.address) && (t.splice(n--, 1), 
                            i.contactId = null, i.onchange)) try {
                                i.onchange(i);
                            } catch (l) {
                                I("peep.onchange error", l, "\n", l.stack);
                            }
                            0 === t.length && delete s[r.id];
                        }
                        if (r.email) for (var d = 0; d < r.email.length; d++) {
                            var u = r.email[d].value;
                            if (t = o[u]) for (n = 0; n < t.length; n++) {
                                if (i = t[n], i.contactId) {
                                    if (i.contactId !== r.id) continue;
                                } else {
                                    i.contactId = r.id;
                                    var h = s[i.contactId];
                                    void 0 === h && (h = s[i.contactId] = []), h.push(i);
                                }
                                if (r.name && r.name.length && (i.name = r.name[0]), i.onchange) try {
                                    i.onchange(i);
                                } catch (l) {
                                    I("peep.onchange error", l, "\n", l.stack);
                                }
                            }
                        }
                    }
                };
            }
        },
        resolvePeeps: function(e) {
            if (null == e) return null;
            for (var t = [], n = 0; n < e.length; n++) t.push(this.resolvePeep(e[n]));
            return t;
        },
        resolvePeep: function(e) {
            var t, n = e.address, s = this._contactCache[n], o = navigator.mozContacts;
            if (null !== s && o) if (void 0 !== s) {
                var i = e.name || "";
                s.name && s.name.length && (i = s.name[0]), t = new l(i, n, s.id, s.photo && s.photo.length ? s.photo[0] : null);
            } else {
                t = new l(e.name || "", n, null, null), this._contactCache[n] = null, this.pendingLookupCount++;
                var r = o.find({
                    filterBy: [ "email" ],
                    filterOp: "equals",
                    filterValue: n
                }), a = this, c = function() {
                    if (r.result && r.result.length) {
                        var e = r.result[0];
                        w._contactCache[n] = e, ++w._cacheHitEntries > w.MAX_CACHE_HITS && a._resetCache();
                        var t = a._livePeepsByEmail[n];
                        if (!t) return;
                        for (var s = 0; s < t.length; s++) {
                            var o = t[s];
                            if (!o.contactId) {
                                o.contactId = e.id;
                                var i = a._livePeepsById[o.contactId];
                                void 0 === i && (i = a._livePeepsById[o.contactId] = []), i.push(o);
                            }
                            if (e.name && e.name.length && (o.name = e.name[0]), e.photo && e.photo.length && (o._thumbnailBlob = e.photo[0]), 
                            !a.callbacks.length && o.onchange) try {
                                o.onchange(o);
                            } catch (c) {
                                I("peep.onchange error", c, "\n", c.stack);
                            }
                        }
                    } else w._contactCache[n] = null, ++w._cacheEmptyEntries > w.MAX_CACHE_EMPTY && a._resetCache();
                    if (0 === --a.pendingLookupCount) {
                        for (s = 0; s < w.callbacks.length; s++) w.callbacks[s]();
                        w.callbacks.splice(0, w.callbacks.length);
                    }
                };
                r.onsuccess = c, r.onerror = c;
            } else if (t = new l(e.name || "", n, null, null), !o) return t;
            var d;
            return d = this._livePeepsByEmail[n], void 0 === d && (d = this._livePeepsByEmail[n] = []), 
            d.push(t), t.contactId && (d = this._livePeepsById[t.contactId], void 0 === d && (d = this._livePeepsById[t.contactId] = []), 
            d.push(t)), t;
        },
        forgetPeepInstances: function() {
            for (var e = this._livePeepsById, t = this._livePeepsByEmail, n = 0; n < arguments.length; n++) {
                var s = arguments[n];
                if (s) for (var o = 0; o < s.length; o++) {
                    var i, r, a = s[o];
                    a.contactId && (i = e[a.contactId], i && (r = i.indexOf(a), -1 !== r && (i.splice(r, 1), 
                    0 === i.length && delete e[a.contactId]))), i = t[a.address], i && (r = i.indexOf(a), 
                    -1 !== r && (i.splice(r, 1), 0 === i.length && delete t[a.address]));
                }
            }
        }
    };
    l.prototype = {
        get isContact() {
            return null !== this.contactId;
        },
        toString: function() {
            return "[MailPeep: " + this.address + "]";
        },
        toJSON: function() {
            return {
                name: this.name,
                address: this.address,
                contactId: this.contactId
            };
        },
        toWireRep: function() {
            return {
                name: this.name,
                address: this.address
            };
        },
        get hasPicture() {
            return null !== this._thumbnailBlob;
        },
        displayPictureInImageTag: function(e) {
            this._thumbnailBlob && c(e, this._thumbnailBlob);
        }
    }, d.prototype = {
        toString: function() {
            return "[MailHeader: " + this.id + "]";
        },
        toJSON: function() {
            return {
                type: "MailHeader",
                id: this.id
            };
        },
        makeCopy: function() {
            return new d(this._slice, this._wireRep);
        },
        __update: function(e) {
            this._wireRep = e, null !== e.snippet && (this.snippet = e.snippet), this.isRead = -1 !== e.flags.indexOf("\\Seen"), 
            this.isStarred = -1 !== e.flags.indexOf("\\Flagged"), this.isRepliedTo = -1 !== e.flags.indexOf("\\Answered"), 
            this.isForwarded = -1 !== e.flags.indexOf("$Forwarded"), this.isJunk = -1 !== e.flags.indexOf("$Junk"), 
            this.tags = i(e.flags);
        },
        __die: function() {
            w.forgetPeepInstances([ this.author ], this.to, this.cc, this.bcc);
        },
        deleteMessage: function() {
            return this._slice._api.deleteMessages([ this ]);
        },
        moveMessage: function(e) {
            return this._slice._api.moveMessages([ this ], e);
        },
        setRead: function(e) {
            return this._slice._api.markMessagesRead([ this ], e);
        },
        setStarred: function(e) {
            return this._slice._api.markMessagesStarred([ this ], e);
        },
        modifyTags: function(e, t) {
            return this._slice._api.modifyMessageTags([ this ], e, t);
        },
        getBody: function(e, t) {
            "function" == typeof e && (t = e, e = null), this._slice._api._getBodyForMessage(this, e, t);
        },
        get bytesToDownloadForBodyDisplay() {
            return this._wireRep.bytesToDownloadForBodyDisplay || 0;
        },
        editAsDraft: function(e) {
            var t = this._slice._api.resumeMessageComposition(this, e);
            return t.hasDraft = !0, t;
        },
        replyToMessage: function(e, t) {
            return this._slice._api.beginMessageComposition(this, null, {
                replyTo: this,
                replyMode: e
            }, t);
        },
        forwardMessage: function(e, t) {
            return this._slice._api.beginMessageComposition(this, null, {
                forwardOf: this,
                forwardMode: e
            }, t);
        }
    }, u.prototype = {
        toString: function() {
            return "[MailMatchedHeader: " + this.header.id + "]";
        },
        toJSON: function() {
            return {
                type: "MailMatchedHeader",
                id: this.header.id
            };
        },
        __update: function(e) {
            this.matches = e.matches, this.header.__update(e.header);
        },
        __die: function() {
            this.header.__die();
        }
    }, h.prototype = {
        toString: function() {
            return "[MailBody: " + this.id + "]";
        },
        toJSON: function() {
            return {
                type: "MailBody",
                id: this.id
            };
        },
        __update: function(e, t) {
            if (this._relatedParts = e.relatedParts, this.bodyReps = e.bodyReps, t && t.changeDetails && t.changeDetails.detachedAttachments) for (var n = t.changeDetails.detachedAttachments, s = 0; s < n.length; s++) this.attachments.splice(n[s], 1);
            if (e.attachments) {
                var o, i;
                for (o = 0; o < this.attachments.length; o++) i = this.attachments[o], i.__update(e.attachments[o]);
                for (o = this.attachments.length; o < e.attachments.length; o++) this.attachments.push(new p(this, e.attachments[o]));
            }
        },
        get embeddedImageCount() {
            return this._relatedParts ? this._relatedParts.length : 0;
        },
        get bodyRepsDownloaded() {
            for (var e = 0, t = this.bodyReps.length; t > e; e++) if (!this.bodyReps[e].isDownloaded) return !1;
            return !0;
        },
        get embeddedImagesDownloaded() {
            for (var e = 0; e < this._relatedParts.length; e++) {
                var t = this._relatedParts[e];
                if (!t.file) return !1;
            }
            return !0;
        },
        downloadEmbeddedImages: function(e, t) {
            for (var n = [], s = 0; s < this._relatedParts.length; s++) {
                var o = this._relatedParts[s];
                o.file || n.push(s);
            }
            return n.length ? (this._api._downloadAttachments(this, n, [], e, t), void 0) : (e && e(), 
            void 0);
        },
        showEmbeddedImages: function(e, t) {
            var n, s = {};
            for (n = 0; n < this._relatedParts.length; n++) {
                var o = this._relatedParts[n];
                o.file && !Array.isArray(o.file) && (s[o.contentId] = o.file);
            }
            var i = e.querySelectorAll(".moz-embedded-image");
            for (n = 0; n < i.length; n++) {
                var r = i[n], a = r.getAttribute("cid-src");
                s.hasOwnProperty(a) && (c(r, s[a]), t && r.addEventListener("load", t, !1), r.removeAttribute("cid-src"), 
                r.classList.remove("moz-embedded-image"));
            }
        },
        checkForExternalImages: function(e) {
            var t = e.querySelector(".moz-external-image");
            return null !== t;
        },
        showExternalImages: function(e, t) {
            for (var n = e.querySelectorAll(".moz-external-image"), s = 0; s < n.length; s++) {
                var o = n[s];
                t && o.addEventListener("load", t, !1), o.setAttribute("src", o.getAttribute("ext-src")), 
                o.removeAttribute("ext-src"), o.classList.remove("moz-external-image");
            }
        },
        die: function() {
            this.onchange = null, this._api.__bridgeSend({
                type: "killBody",
                id: this.id,
                handle: this._handle
            });
        }
    }, p.prototype = {
        toString: function() {
            return '[MailAttachment: "' + this.filename + '"]';
        },
        toJSON: function() {
            return {
                type: "MailAttachment",
                filename: this.filename
            };
        },
        __update: function(e) {
            this.mimetype = e.type, this.sizeEstimateInBytes = e.sizeEstimate, this._file = e.file;
        },
        get isDownloaded() {
            return !!this._file;
        },
        get isDownloadable() {
            return "application/x-gelam-no-download" !== this.mimetype;
        },
        download: function(e, t) {
            return this.isDownloaded ? (e(), void 0) : (this._body._api._downloadAttachments(this._body, [], [ this._body.attachments.indexOf(this) ], e, t), 
            void 0);
        }
    }, m.prototype = {
        toString: function() {
            return "[UndoableOperation]";
        },
        toJSON: function() {
            return {
                type: "UndoableOperation",
                handle: this._tempHandle,
                longtermIds: this._longtermIds
            };
        },
        undo: function() {
            return this._longtermIds ? (this._api.__undo(this), void 0) : (this._undoRequested = !0, 
            void 0);
        }
    }, f.prototype = {
        toString: function() {
            return "[BridgedViewSlice: " + this._ns + " " + this._handle + "]";
        },
        toJSON: function() {
            return {
                type: "BridgedViewSlice",
                namespace: this._ns,
                handle: this._handle
            };
        },
        requestShrinkage: function(e, t) {
            this.pendingRequestCount++, t >= this.items.length && (t = this.items.length - 1), 
            this._api.__bridgeSend({
                type: "shrinkSlice",
                handle: this._handle,
                firstIndex: e,
                firstSuid: this.items[e].id,
                lastIndex: t,
                lastSuid: this.items[t].id
            });
        },
        requestGrowth: function(e, t) {
            if (this._growing) throw new Error("Already growing in " + this._growing + " dir.");
            this._growing = e, this.pendingRequestCount++, this._api.__bridgeSend({
                type: "growSlice",
                dirMagnitude: e,
                userRequestsGrowth: t,
                handle: this._handle
            });
        },
        die: function() {
            this.onadd = null, this.onchange = null, this.onsplice = null, this.onremove = null, 
            this.onstatus = null, this.oncomplete = null, this._api.__bridgeSend({
                type: "killSlice",
                handle: this._handle
            });
            for (var e = 0; e < this.items.length; e++) {
                var t = this.items[e];
                t.__die();
            }
        }
    }, g.prototype = Object.create(f.prototype), g.prototype.getAccountById = function(e) {
        for (var t = 0; t < this.items.length; t++) if (this.items[t]._wireRep.id === e) return this.items[t];
        return null;
    }, Object.defineProperty(g.prototype, "defaultAccount", {
        get: function() {
            for (var e = this.items[0], t = 1; t < this.items.length; t++) (this.items[t]._wireRep.defaultPriority || 0) > (e._wireRep.defaultPriority || 0) && (e = this.items[t]);
            return e;
        }
    }), _.prototype = Object.create(f.prototype), _.prototype.getFirstFolderWithType = function(e, t) {
        t || (t = this.items);
        for (var n = 0; n < t.length; n++) {
            var s = t[n];
            if (s.type === e) return s;
        }
        return null;
    }, _.prototype.getFirstFolderWithName = function(e, t) {
        t || (t = this.items);
        for (var n = 0; n < t.length; n++) {
            var s = t[n];
            if (s.name === e) return s;
        }
        return null;
    }, y.prototype = Object.create(f.prototype), y.prototype.refresh = function() {
        this._api.__bridgeSend({
            type: "refreshHeaders",
            handle: this._handle
        });
    }, y.prototype._notifyRequestBodiesComplete = function(e) {
        var t = this._bodiesRequest[e];
        e && t && (t(!0), delete this._bodiesRequest[e]);
    }, y.prototype.maybeRequestBodies = function(e, t, n, s) {
        "function" == typeof n && (s = n, n = null);
        var o = [];
        for (t = Math.min(t, this.items.length - 1); t >= e; e++) {
            var i = this.items[e];
            "matchedHeaders" === this._ns && (i = i.header), i && null === i.snippet && o.push({
                suid: i.id,
                date: i.date.valueOf()
            });
        }
        if (!o.length) return s && window.setZeroTimeout(s, !1);
        var r = this._bodiesRequestId++;
        this._bodiesRequest[r] = s, this._api.__bridgeSend({
            type: "requestBodies",
            handle: this._handle,
            requestId: r,
            messages: o,
            options: n
        });
    }, v.prototype = {
        toString: function() {
            return "[MessageComposition: " + this._handle + "]";
        },
        toJSON: function() {
            return {
                type: "MessageComposition",
                handle: this._handle
            };
        },
        die: function() {
            this._handle && (this._api._composeDone(this._handle, "die", null, null), this._handle = null);
        },
        addAttachment: function(e, t) {
            this.hasDraft || this.saveDraft(), this._api._composeAttach(this._handle, e, t);
            var n = {
                name: e.name,
                blob: {
                    size: e.blob.size,
                    type: e.blob.type
                }
            };
            return this.attachments.push(n), n;
        },
        removeAttachment: function(e, t) {
            var n = this.attachments.indexOf(e);
            -1 !== n && (this.attachments.splice(n, 1), this._api._composeDetach(this._handle, n, t));
        },
        _buildWireRep: function() {
            return {
                senderId: this.senderIdentity.id,
                to: this.to,
                cc: this.cc,
                bcc: this.bcc,
                subject: this.subject,
                body: this.body,
                referencesStr: this._references,
                attachments: this.attachments
            };
        },
        finishCompositionSendMessage: function(e) {
            this._api._composeDone(this._handle, "send", this._buildWireRep(), e);
        },
        saveDraft: function(e) {
            this.hasDraft = !0, this._api._composeDone(this._handle, "save", this._buildWireRep(), e);
        },
        abortCompositionDeleteDraft: function(e) {
            this._api._composeDone(this._handle, "delete", null, e);
        }
    };
    var C = [], E = b, A = b, I = b, T = /(^|[\s(,;])((?:https?:\/\/|www\d{0,3}[.][a-z0-9.\-]{2,249}|[a-z0-9.\-]{2,250}[.][a-z]{2,4}\/)[-\w.!~*'();,\/?:@&=+$#%]*)/im, x = /(?:[),;.!?]|[.!?]\)|\)[.!?])$/, N = /^https?:/i, D = /(^|[\s(,;])([^(,;@\s]+@[a-z0-9.\-]{2,250}[.][a-z0-9\-]{2,32})/im, k = /^mailto:/i, M = {
        linkifyPlain: function(e, t) {
            for (var n, s = []; ;) {
                var o = T.exec(e), i = D.exec(e);
                if (o && (!i || o.index < i.index)) {
                    n = o.index + o[1].length, n > 0 && s.push(t.createTextNode(e.substring(0, n)));
                    var r = o[2], a = x.exec(r);
                    a && (r = r.substring(0, a.index));
                    var c = t.createElement("a");
                    c.className = "moz-external-link", N.test(o[2]) ? c.setAttribute("ext-href", r) : c.setAttribute("ext-href", "http://" + r);
                    var l = t.createTextNode(r);
                    c.appendChild(l), s.push(c), e = e.substring(o.index + o[1].length + r.length);
                } else {
                    if (!i) break;
                    n = i.index + i[1].length, n > 0 && s.push(t.createTextNode(e.substring(0, n))), 
                    c = t.createElement("a"), c.className = "moz-external-link", k.test(i[2]) ? c.setAttribute("ext-href", i[2]) : c.setAttribute("ext-href", "mailto:" + i[2]), 
                    l = t.createTextNode(i[2]), c.appendChild(l), s.push(c), e = e.substring(i.index + i[0].length);
                }
            }
            return e.length > 0 && s.push(t.createTextNode(e)), s;
        },
        linkifyHTML: function(e) {
            function t(n) {
                var s = n.childNodes;
                for (var o in s) {
                    var i = s[o];
                    if ("#text" == i.nodeName) {
                        var r = M.linkifyPlain(i.nodeValue, e);
                        n.replaceChild(r[r.length - 1], i);
                        for (var a = r.length - 2; a >= 0; --a) n.insertBefore(r[a], r[a + 1]);
                    } else "A" != i.nodeName && t(i);
                }
            }
            t(e.body);
        }
    };
    e.MailAPI = S, S.prototype = {
        toString: function() {
            return "[MailAPI]";
        },
        toJSON: function() {
            return {
                type: "MailAPI"
            };
        },
        utils: M,
        __bridgeSend: function(e) {
            this._storedSends.push(e);
        },
        __bridgeReceive: function(e) {
            this._processingMessage && "pong" !== e.type ? this._deferredMessages.push(e) : this._processMessage(e);
        },
        _processMessage: function(e) {
            var t = "_recv_" + e.type;
            if (!(t in this)) return E("Unsupported message type:", e.type), void 0;
            try {
                var n = this[t](e);
                n || (this._processingMessage = e);
            } catch (s) {
                return A("Problem handling message type:", e.type, s, "\n", s.stack), void 0;
            }
        },
        _doneProcessingMessage: function(e) {
            if (this._processingMessage && this._processingMessage !== e) throw new Error("Mismatched message completion!");
            for (this._processingMessage = null; null === this._processingMessage && this._deferredMessages.length; ) this._processMessage(this._deferredMessages.shift());
        },
        _recv_badLogin: function(e) {
            return this.onbadlogin && this.onbadlogin(new n(this, e.account, null), e.problem, e.whichSide), 
            !0;
        },
        _fireAllSplices: function() {
            for (var e = 0; e < this._spliceFireFuncs.length; e++) {
                var t = this._spliceFireFuncs[e];
                t();
            }
            this._spliceFireFuncs.length = 0;
        },
        _recv_batchSlice: function(e) {
            var t = this._slices[e.handle];
            if (!t) return E("Received message about nonexistent slice:", e.handle), !0;
            for (var n = this._updateSliceStatus(e, t), s = 0; s < e.sliceUpdates.length; s++) {
                var o = e.sliceUpdates[s];
                "update" === o.type ? this._spliceFireFuncs.push(this._processSliceUpdate.bind(this, e, o.updates, t)) : this._transformAndEnqueueSingleSplice(e, o, t);
            }
            return w.pendingLookupCount ? (w.callbacks.push(function() {
                this._fireAllSplices(), this._fireStatusNotifications(n, t), this._doneProcessingMessage(e);
            }.bind(this)), !1) : (this._fireAllSplices(), this._fireStatusNotifications(n, t), 
            !0);
        },
        _fireStatusNotifications: function(e, t) {
            e && t.onstatus && t.onstatus(t.status);
        },
        _updateSliceStatus: function(e, t) {
            t.atTop = e.atTop, t.atBottom = e.atBottom, t.userCanGrowUpwards = e.userCanGrowUpwards, 
            t.userCanGrowDownwards = e.userCanGrowDownwards;
            var n = e.status && (t.status !== e.status || t.syncProgress !== e.progress);
            return e.status && (t.status = e.status, t.syncProgress = e.syncProgress), n;
        },
        _processSliceUpdate: function(e, t, n) {
            try {
                for (var s = 0; s < t.length; s += 2) {
                    var o = t[s], i = t[s + 1], r = n.items[o];
                    r.__update(i), n.onchange && n.onchange(r, o), r.onchange && r.onchange(r, o);
                }
            } catch (a) {
                I("onchange notification error", a, "\n", a.stack);
            }
        },
        _transformAndEnqueueSingleSplice: function(e, t, n) {
            var s = this._transform_sliceSplice(t, n), o = !1;
            this._spliceFireFuncs.push(function() {
                this._fireSplice(t, n, s, o);
            }.bind(this));
        },
        _fireSplice: function(e, t, n, s) {
            var o, i;
            if (void 0 !== e.headerCount && (t.headerCount = e.headerCount), t.onsplice) try {
                t.onsplice(e.index, e.howMany, n, e.requested, e.moreExpected, s);
            } catch (r) {
                I("onsplice notification error", r, "\n", r.stack);
            }
            if (e.howMany) try {
                for (i = e.index + e.howMany, o = e.index; i > o; o++) {
                    var a = t.items[o];
                    t.onremove && t.onremove(a, o), a.onremove && a.onremove(a, o), a.__die();
                }
            } catch (r) {
                I("onremove notification error", r, "\n", r.stack);
            }
            if (t.items.splice.apply(t.items, [ e.index, e.howMany ].concat(n)), t.onadd) try {
                for (i = e.index + n.length, o = e.index; i > o; o++) t.onadd(t.items[o], o);
            } catch (r) {
                I("onadd notification error", r, "\n", r.stack);
            }
            if (e.requested && !e.moreExpected && (t._growing = 0, t.pendingRequestCount && t.pendingRequestCount--, 
            t.oncomplete)) {
                var c = t.oncomplete;
                t.oncomplete = null;
                try {
                    c(e.newEmailCount);
                } catch (r) {
                    I("oncomplete notification error", r, "\n", r.stack);
                }
            }
        },
        _transform_sliceSplice: function(e, t) {
            var i, r = e.addItems, a = [];
            switch (t._ns) {
              case "accounts":
                for (i = 0; i < r.length; i++) a.push(new n(this, r[i], t));
                break;

              case "identities":
                for (i = 0; i < r.length; i++) a.push(new s(this, r[i]));
                break;

              case "folders":
                for (i = 0; i < r.length; i++) a.push(new o(this, r[i]));
                break;

              case "headers":
                for (i = 0; i < r.length; i++) a.push(new d(t, r[i]));
                break;

              case "matchedHeaders":
                for (i = 0; i < r.length; i++) a.push(new u(t, r[i]));
                break;

              default:
                console.error("Slice notification for unknown type:", t._ns);
            }
            return a;
        },
        _recv_sliceDead: function(e) {
            var t = this._slices[e.handle];
            return delete this._slices[e.handle], t.ondead && t.ondead(t), t.ondead = null, 
            !0;
        },
        _getBodyForMessage: function(e, t, n) {
            var s = !1, o = !1;
            t && t.downloadBodyReps && (s = t.downloadBodyReps), t && t.withBodyReps && (o = t.withBodyReps);
            var i = this._nextHandle++;
            this._pendingRequests[i] = {
                type: "getBody",
                suid: e.id,
                callback: n
            }, this.__bridgeSend({
                type: "getBody",
                handle: i,
                suid: e.id,
                date: e.date.valueOf(),
                downloadBodyReps: s,
                withBodyReps: o
            });
        },
        _recv_gotBody: function(e) {
            var t = this._pendingRequests[e.handle];
            if (!t) return E("Bad handle for got body:", e.handle), !0;
            delete this._pendingRequests[e.handle];
            var n = e.bodyInfo ? new h(this, t.suid, e.bodyInfo, e.handle) : null;
            return n && (this._liveBodies[e.handle] = n), t.callback.call(null, n), !0;
        },
        _recv_requestBodiesComplete: function(e) {
            var t = this._slices[e.handle];
            return t && t._notifyRequestBodiesComplete(e.requestId), !0;
        },
        _recv_bodyModified: function(e) {
            var t = this._liveBodies[e.handle];
            if (!t) return E("body modified for dead handle", e.handle), !0;
            var n = e.bodyInfo;
            return t.__update(n, e.detail), t.onchange && t.onchange(e.detail, t), !0;
        },
        _recv_bodyDead: function(e) {
            var t = this._liveBodies[e.handle];
            return t && t.ondead && t.ondead(), delete this._liveBodies[e.handle], !0;
        },
        _downloadAttachments: function(e, t, n, s, o) {
            var i = this._nextHandle++;
            this._pendingRequests[i] = {
                type: "downloadAttachments",
                body: e,
                relParts: t.length > 0,
                attachments: n.length > 0,
                callback: s,
                progress: o
            }, this.__bridgeSend({
                type: "downloadAttachments",
                handle: i,
                suid: e.id,
                date: e._date,
                relPartIndices: t,
                attachmentIndices: n
            });
        },
        _recv_downloadedAttachments: function(e) {
            var t = this._pendingRequests[e.handle];
            return t ? (delete this._pendingRequests[e.handle], t.callback && t.callback.call(null, t.body), 
            !0) : (E("Bad handle for got body:", e.handle), !0);
        },
        tryToCreateAccount: function(e, t, n) {
            var s = this._nextHandle++;
            this._pendingRequests[s] = {
                type: "tryToCreateAccount",
                details: e,
                domainInfo: t,
                callback: n
            }, this.__bridgeSend({
                type: "tryToCreateAccount",
                handle: s,
                details: e,
                domainInfo: t
            });
        },
        _recv_tryToCreateAccountResults: function(e) {
            var t = this._pendingRequests[e.handle];
            return t ? (delete this._pendingRequests[e.handle], t.callback.call(null, e.error, e.errorDetails, e.account), 
            !0) : (E("Bad handle for create account:", e.handle), !0);
        },
        _clearAccountProblems: function(e, t) {
            var n = this._nextHandle++;
            this._pendingRequests[n] = {
                type: "clearAccountProblems",
                callback: t
            }, this.__bridgeSend({
                type: "clearAccountProblems",
                accountId: e.id,
                handle: n
            });
        },
        _recv_clearAccountProblems: function(e) {
            var t = this._pendingRequests[e.handle];
            return delete this._pendingRequests[e.handle], t.callback && t.callback(), !0;
        },
        _modifyAccount: function(e, t, n) {
            var s = this._nextHandle++;
            this._pendingRequests[s] = {
                type: "modifyAccount",
                callback: n
            }, this.__bridgeSend({
                type: "modifyAccount",
                accountId: e.id,
                mods: t,
                handle: s
            });
        },
        _recv_modifyAccount: function(e) {
            var t = this._pendingRequests[e.handle];
            return delete this._pendingRequests[e.handle], t.callback && t.callback(), !0;
        },
        _deleteAccount: function(e) {
            this.__bridgeSend({
                type: "deleteAccount",
                accountId: e.id
            });
        },
        viewAccounts: function() {
            var e = this._nextHandle++, t = new g(this, e);
            return this._slices[e] = t, this.__bridgeSend({
                type: "viewAccounts",
                handle: e
            }), t;
        },
        viewSenderIdentities: function() {
            var e = this._nextHandle++, t = new f(this, "identities", e);
            return this._slices[e] = t, this.__bridgeSend({
                type: "viewSenderIdentities",
                handle: e
            }), t;
        },
        viewFolders: function(e, t) {
            var n = this._nextHandle++, s = new _(this, n);
            return this._slices[n] = s, this.__bridgeSend({
                type: "viewFolders",
                mode: e,
                handle: n,
                argument: t ? t.id : null
            }), s;
        },
        viewFolderMessages: function(e) {
            var t = this._nextHandle++, n = new y(this, t);
            return n.folderId = e.id, n.pendingRequestCount++, this._slices[t] = n, this.__bridgeSend({
                type: "viewFolderMessages",
                folderId: e.id,
                handle: t
            }), n;
        },
        searchFolderMessages: function(e, t, n) {
            var s = this._nextHandle++, o = new y(this, s, "matchedHeaders");
            return o.pendingRequestCount++, this._slices[s] = o, this.__bridgeSend({
                type: "searchFolderMessages",
                folderId: e.id,
                handle: s,
                phrase: t,
                whatToSearch: n
            }), o;
        },
        deleteMessages: function(e) {
            var t = this._nextHandle++, n = new m(this, "delete", e.length, t), s = e.map(r);
            return this._pendingRequests[t] = {
                type: "mutation",
                handle: t,
                undoableOp: n
            }, this.__bridgeSend({
                type: "deleteMessages",
                handle: t,
                messages: s
            }), n;
        },
        moveMessages: function(e, t) {
            var n = this._nextHandle++, s = new m(this, "move", e.length, n), o = e.map(r);
            return this._pendingRequests[n] = {
                type: "mutation",
                handle: n,
                undoableOp: s
            }, this.__bridgeSend({
                type: "moveMessages",
                handle: n,
                messages: o,
                targetFolder: t.id
            }), s;
        },
        markMessagesRead: function(e, t) {
            return this.modifyMessageTags(e, t ? [ "\\Seen" ] : null, t ? null : [ "\\Seen" ], t ? "read" : "unread");
        },
        markMessagesStarred: function(e, t) {
            return this.modifyMessageTags(e, t ? [ "\\Flagged" ] : null, t ? null : [ "\\Flagged" ], t ? "star" : "unstar");
        },
        modifyMessageTags: function(e, t, n, s) {
            var o = this._nextHandle++;
            s || (t && t.length ? s = "addtag" : n && n.length && (s = "removetag"));
            var i = new m(this, s, e.length, o), a = e.map(r);
            return this._pendingRequests[o] = {
                type: "mutation",
                handle: o,
                undoableOp: i
            }, this.__bridgeSend({
                type: "modifyMessageTags",
                handle: o,
                opcode: s,
                addTags: t,
                removeTags: n,
                messages: a
            }), i;
        },
        createFolder: function(e, t, n) {
            this.__bridgeSend({
                type: "createFolder",
                accountId: e.id,
                parentFolderId: t ? t.id : null,
                containOnlyOtherFolders: n
            });
        },
        parseMailbox: function(e) {
            try {
                var n = t(e);
                return n.length >= 1 ? n[0] : null;
            } catch (s) {
                return I("parse mailbox error", s, "\n", s.stack), null;
            }
        },
        _recv_mutationConfirmed: function(e) {
            var t = this._pendingRequests[e.handle];
            return t ? (t.undoableOp._tempHandle = null, t.undoableOp._longtermIds = e.longtermIds, 
            t.undoableOp._undoRequested && t.undoableOp.undo(), !0) : (E("Bad handle for mutation:", e.handle), 
            !0);
        },
        __undo: function(e) {
            this.__bridgeSend({
                type: "undo",
                longtermIds: e._longtermIds
            });
        },
        resolveEmailAddressToPeep: function(e, t) {
            var n = w.resolvePeep({
                name: null,
                address: e
            });
            w.pendingLookupCount ? w.callbacks.push(t.bind(null, n)) : t(n);
        },
        beginMessageComposition: function(e, t, n, s) {
            if (!s) throw new Error("A callback must be provided; you are using the API wrong if you do not.");
            n || (n = {});
            var o = this._nextHandle++, i = new v(this, o);
            this._pendingRequests[o] = {
                type: "compose",
                composer: i,
                callback: s
            };
            var r = {
                type: "beginCompose",
                handle: o,
                mode: null,
                submode: null,
                refSuid: null,
                refDate: null,
                refGuid: null,
                refAuthor: null,
                refSubject: null
            };
            return n.hasOwnProperty("replyTo") && n.replyTo ? (r.mode = "reply", r.submode = n.replyMode, 
            r.refSuid = n.replyTo.id, r.refDate = n.replyTo.date.valueOf(), r.refGuid = n.replyTo.guid, 
            r.refAuthor = n.replyTo.author.toWireRep(), r.refSubject = n.replyTo.subject) : n.hasOwnProperty("forwardOf") && n.forwardOf ? (r.mode = "forward", 
            r.submode = n.forwardMode, r.refSuid = n.forwardOf.id, r.refDate = n.forwardOf.date.valueOf(), 
            r.refGuid = n.forwardOf.guid, r.refAuthor = n.forwardOf.author.toWireRep(), r.refSubject = n.forwardOf.subject) : (r.mode = "new", 
            e ? (r.submode = "message", r.refSuid = e.id) : t && (r.submode = "folder", r.refSuid = t.id)), 
            this.__bridgeSend(r), i;
        },
        resumeMessageComposition: function(e, t) {
            if (!t) throw new Error("A callback must be provided; you are using the API wrong if you do not.");
            var n = this._nextHandle++, s = new v(this, n);
            return this._pendingRequests[n] = {
                type: "compose",
                composer: s,
                callback: t
            }, this.__bridgeSend({
                type: "resumeCompose",
                handle: n,
                messageNamer: r(e)
            }), s;
        },
        _recv_composeBegun: function(e) {
            var t = this._pendingRequests[e.handle];
            if (!t) return E("Bad handle for compose begun:", e.handle), !0;
            if (t.composer.senderIdentity = new s(this, e.identity), t.composer.subject = e.subject, 
            t.composer.body = e.body, t.composer.to = e.to, t.composer.cc = e.cc, t.composer.bcc = e.bcc, 
            t.composer._references = e.referencesStr, t.composer.attachments = e.attachments, 
            t.callback) {
                var n = t.callback;
                t.callback = null, n.call(null, t.composer);
            }
            return !0;
        },
        _composeAttach: function(e, t, n) {
            if (e) {
                var s = this._pendingRequests[e];
                if (s) {
                    var o = this._nextHandle++;
                    this._pendingRequests[o] = {
                        type: "attachBlobToDraft",
                        callback: n
                    }, this.__bridgeSend({
                        type: "attachBlobToDraft",
                        handle: o,
                        draftHandle: e,
                        attachmentDef: t
                    });
                }
            }
        },
        _recv_attachedBlobToDraft: function(e) {
            var t = this._pendingRequests[e.handle], n = this._pendingRequests[e.draftHandle];
            return t ? (delete this._pendingRequests[e.handle], t.callback && n && n.composer && t.callback(e.err, n.composer), 
            !0) : !0;
        },
        _composeDetach: function(e, t, n) {
            if (e) {
                var s = this._pendingRequests[e];
                if (s) {
                    var o = this._nextHandle++;
                    this._pendingRequests[o] = {
                        type: "detachAttachmentFromDraft",
                        callback: n
                    }, this.__bridgeSend({
                        type: "detachAttachmentFromDraft",
                        handle: o,
                        draftHandle: e,
                        attachmentIndex: t
                    });
                }
            }
        },
        _recv_detachedAttachmentFromDraft: function(e) {
            var t = this._pendingRequests[e.handle], n = this._pendingRequests[e.draftHandle];
            return t ? (delete this._pendingRequests[e.handle], t.callback && n && n.composer && t.callback(e.err, n.composer), 
            !0) : !0;
        },
        _composeDone: function(e, t, n, s) {
            if (e) {
                var o = this._pendingRequests[e];
                o && (o.type = t, s && (o.callback = s), this.__bridgeSend({
                    type: "doneCompose",
                    handle: e,
                    command: t,
                    state: n
                }));
            }
        },
        _recv_doneCompose: function(e) {
            var t = this._pendingRequests[e.handle];
            return t ? (t.active = null, ("die" === t.type || !e.err && "save" !== t.type) && delete this._pendingRequests[e.handle], 
            t.callback && (t.callback.call(null, e.err, e.badAddresses, {
                sentDate: e.sentDate,
                messageId: e.messageId
            }), t.callback = null), !0) : (E("Bad handle for doneCompose:", e.handle), !0);
        },
        setInteractive: function() {
            this.__bridgeSend({
                type: "setInteractive"
            });
        },
        _recv_cronSyncStart: function(e) {
            return this.oncronsyncstart && this.oncronsyncstart(e.accountIds), !0;
        },
        _recv_cronSyncStop: function(e) {
            return this.oncronsyncstop && this.oncronsyncstop(e.accountsResults), !0;
        },
        useLocalizedStrings: function(e) {
            this.__bridgeSend({
                type: "localizedStrings",
                strings: e
            }), e.folderNames && (this.l10n_folder_names = e.folderNames);
        },
        l10n_folder_names: {},
        l10n_folder_name: function(e, t) {
            if (this.l10n_folder_names.hasOwnProperty(t)) {
                var n = e.toLowerCase();
                if (t === n || "drafts" === t && "draft" === n || "junk" === t && "bulk mail" === n || "junk" === t && "spam" === n || "queue" === t && "unsent messages" === n) return this.l10n_folder_names[t];
            }
            return e;
        },
        modifyConfig: function(e) {
            for (var t in e) if (-1 === C.indexOf(t)) throw new Error(t + " is not a legal config key!");
            this.__bridgeSend({
                type: "modifyConfig",
                mods: e
            });
        },
        _recv_config: function(e) {
            return this.config = e.config, !0;
        },
        ping: function(e) {
            var t = this._nextHandle++;
            this._pendingRequests[t] = {
                type: "ping",
                callback: e
            }, window.setZeroTimeout(function() {
                this.__bridgeSend({
                    type: "ping",
                    handle: t
                });
            }.bind(this));
        },
        _recv_pong: function(e) {
            var t = this._pendingRequests[e.handle];
            return delete this._pendingRequests[e.handle], t.callback(), !0;
        },
        debugSupport: function(e, t) {
            "setLogging" === e && (this.config.debugLogging = t), this.__bridgeSend({
                type: "debugSupport",
                cmd: e,
                arg: t
            });
        }
    };
}), define("mailapi/worker-support/main-router", [], function() {
    function e(e) {
        var t, n = e.name;
        i.push(e), e.process ? t = function(t) {
            e.process(t.uid, t.cmd, t.args);
        } : e.dispatch && (t = function(t) {
            e.dispatch[t.cmd] && e.dispatch[t.cmd].apply(e.dispatch, t.args);
        }), o[n] = t, e.sendMessage = function(e, t, s, o) {
            r.postMessage({
                type: n,
                uid: e,
                cmd: t,
                args: s
            }, o);
        };
    }
    function t(e) {
        delete o["on" + e.name];
    }
    function n() {
        i.forEach(function(e) {
            e.shutdown && e.shutdown();
        });
    }
    function s(e) {
        r = e, r.onmessage = function(e) {
            var t = e.data, n = o[t.type];
            n && n(t);
        };
    }
    var o = {}, i = [], r = null;
    return {
        register: e,
        unregister: t,
        useWorker: s,
        shutdown: n
    };
}), define("mailapi/worker-support/configparser-main", [], function() {
    function e() {}
    function t(e) {
        var t = "http://schemas.microsoft.com/exchange/autodiscover/", n = {
            rq: t + "mobilesync/requestschema/2006",
            ad: t + "responseschema/2006",
            ms: t + "mobilesync/responseschema/2006"
        };
        return n[e] || null;
    }
    function n(e, t, n) {
        var s = new DOMParser().parseFromString(n, "text/xml"), i = function(e, t) {
            return s.evaluate(e, t || s, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }, r = i("/clientConfig/emailProvider"), a = i('incomingServer[@type="imap"] | incomingServer[@type="activesync"] | incomingServer[@type="pop3"]', r), c = i('outgoingServer[@type="smtp"]', r), l = null, d = null;
        if (a) {
            l = {
                type: null,
                incoming: {},
                outgoing: {}
            };
            for (var u in Iterator(a.children)) {
                var h = u[1];
                l.incoming[h.tagName] = h.textContent;
            }
            if ("activesync" === a.getAttribute("type")) l.type = "activesync"; else if (c) {
                var p = "imap" === a.getAttribute("type");
                l.type = p ? "imap+smtp" : "pop3+smtp";
                for (var u in Iterator(c.children)) {
                    var h = u[1];
                    l.outgoing[h.tagName] = h.textContent;
                }
                var m = [ "SSL", "STARTTLS" ];
                (-1 === m.indexOf(l.incoming.socketType) || -1 === m.indexOf(l.outgoing.socketType)) && (l = null, 
                d = "unsafe");
            } else l = null, d = "no-outgoing";
        } else d = "no-incoming";
        o.sendMessage(e, t, [ l, d ]);
    }
    function s(e, n, s) {
        var i = new DOMParser().parseFromString(s, "text/xml"), r = function(e, n) {
            return i.evaluate(e, n, t, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }, a = function(e, n) {
            return i.evaluate(e, n, t, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        }, c = function(e, n) {
            return i.evaluate(e, n, t, XPathResult.STRING_TYPE, null).stringValue;
        }, l = function(t, s, i) {
            o.sendMessage(e, n, [ s, t, i ]);
        }, d = null;
        if ("parsererror" === i.documentElement.tagName) return d = "Error parsing autodiscover response", 
        l(d);
        var u = r("/ad:Autodiscover/ms:Response", i);
        if (!u) return d = "Missing Autodiscover Response node", l(d);
        var d = r("ms:Error", u) || r("ms:Action/ms:Error", u);
        if (d) return d = c("ms:Message/text()", d), l(d);
        var h = r("ms:Action/ms:Redirect", u);
        if (h) {
            if (aNoRedirect) return d = "Multiple redirects occurred during autodiscovery", 
            l(d);
            var p = c("text()", h);
            return l(null, null, p);
        }
        for (var m, f = r("ms:User", u), g = {
            culture: c("ms:Culture/text()", u),
            user: {
                name: c("ms:DisplayName/text()", f),
                email: c("ms:EMailAddress/text()", f)
            },
            servers: []
        }, _ = a("ms:Action/ms:Settings/ms:Server", u); m = _.iterateNext(); ) g.servers.push({
            type: c("ms:Type/text()", m),
            url: c("ms:Url/text()", m),
            name: c("ms:Name/text()", m),
            serverData: c("ms:ServerData/text()", m)
        });
        for (var y in Iterator(g.servers)) {
            var m = y[1];
            if ("MobileSync" === m.type) {
                g.mobileSyncServer = m;
                break;
            }
        }
        return g.mobileSyncServer ? (l(null, g), void 0) : (d = "No MobileSync server found", 
        l(d, g));
    }
    var o = {
        name: "configparser",
        sendMessage: null,
        process: function(t, o, i) {
            switch (e("process " + o), o) {
              case "accountcommon":
                n(t, o, i[0]);
                break;

              case "accountactivesync":
                s(t, o, i[0]);
            }
        }
    };
    return o;
}), define("mailapi/worker-support/cronsync-main", [ "require", "evt" ], function(e) {
    function t(e) {
        console.log("cronsync-main: " + e);
    }
    function n(e, t, n) {
        return {
            type: "sync",
            accountIds: e,
            interval: t,
            timestamp: n.getTime()
        };
    }
    function s(e) {
        return "id" + e.join(" ");
    }
    function o(e) {
        return parseInt(e.substring(a), 10);
    }
    function i(e, t) {
        if (e.length !== t.length) return !1;
        var n = e.some(function(e, n) {
            return e !== t[n];
        });
        return !n;
    }
    var r = e("evt"), a = "interval".length;
    navigator.mozSetMessageHandler && navigator.mozSetMessageHandler("alarm", function(e) {
        var n = e.data;
        if (n && "sync" === n.type) {
            if (navigator.requestWakeLock) {
                var o = [ navigator.requestWakeLock("cpu") ];
                t("wake locks acquired: " + o + " for account IDs: " + n.accountIds), r.emitWhenListener("cronSyncWakeLocks", s(n.accountIds), o);
            }
            c._sendMessage("alarm", [ n.accountIds, n.interval ]);
        }
    });
    var c = {
        _routeReady: !1,
        _routeQueue: [],
        _sendMessage: function(e, t) {
            this._routeReady ? l.sendMessage(null, e, t) : this._routeQueue.push([ e, t ]);
        },
        hello: function() {
            if (this._routeReady = !0, this._routeQueue.length) {
                var e = this._routeQueue;
                this._routeQueue = [], e.forEach(function(e) {
                    this._sendMessage(e[0], e[1]);
                }.bind(this));
            }
        },
        clearAll: function() {
            var e = navigator.mozAlarms;
            if (e) {
                var t = e.getAll();
                t.onsuccess = function(t) {
                    var n = t.target.result;
                    n && n.forEach(function(t) {
                        t.data && "sync" === t.data.type && e.remove(t.id);
                    });
                }.bind(this), t.onerror = function(e) {
                    console.error("cronsync-main clearAll mozAlarms.getAll: error: " + e);
                }.bind(this);
            }
        },
        ensureSync: function(e) {
            var r = navigator.mozAlarms;
            if (r) {
                t("ensureSync called");
                var a = r.getAll();
                a.onsuccess = function(a) {
                    function c() {
                        m += 1, p > m || f._sendMessage("syncEnsured");
                    }
                    var l = a.target.result;
                    if (l) {
                        var d = [], u = {}, h = {};
                        l.forEach(function(n) {
                            if (n.data && n.data.type && "sync" === n.data.type) {
                                var r = "interval" + n.data.interval, a = e[r];
                                if (a && i(a, n.data.accountIds)) {
                                    var c = o(r), l = Date.now(), p = n.data.timestamp, m = s(a);
                                    c && !h.hasOwnProperty(m) && p > l && l + c > p ? (t("existing alarm is OK"), h[m] = !0, 
                                    u[r] = !0) : (t("existing alarm is out of interval range, canceling"), d.push(n.id));
                                } else t("account array mismatch, canceling existing alarm"), d.push(n.id);
                            }
                        }), d.forEach(function(e) {
                            r.remove(e);
                        });
                        var p = 0, m = 0, f = this;
                        Object.keys(e).forEach(function(s) {
                            if (!u.hasOwnProperty(s)) {
                                var i = o(s), a = e[s], l = new Date(Date.now() + i);
                                if (i) {
                                    p += 1;
                                    var d = r.add(l, "ignoreTimezone", n(a, i, l));
                                    d.onsuccess = function() {
                                        t("success: mozAlarms.add for IDs: " + a + " at " + i + "ms"), c();
                                    }, d.onerror = function(e) {
                                        console.error("cronsync-main mozAlarms.add for IDs: " + a + " failed: " + e);
                                    };
                                }
                            }
                        }), p || c();
                    }
                }.bind(this), a.onerror = function(e) {
                    console.error("cronsync-main ensureSync mozAlarms.getAll: error: " + e);
                };
            }
        }
    }, l = {
        name: "cronsync",
        sendMessage: null,
        dispatch: c
    };
    return l;
}), define("mailapi/worker-support/devicestorage-main", [], function() {
    function e(e) {
        dump("DeviceStorage: " + e + "\n");
    }
    function t(e, t, s, o, i) {
        var r = navigator.getDeviceStorage(s), a = r.addNamed(o, i);
        a.onerror = function() {
            n.sendMessage(e, t, [ !1, a.error.name ]);
        }, a.onsuccess = function(s) {
            var o = "";
            "undefined" != typeof window.IS_GELAM_TEST && (o = "TEST_PREFIX/"), n.sendMessage(e, t, [ !0, null, o + s.target.result ]);
        };
    }
    var n = {
        name: "devicestorage",
        sendMessage: null,
        process: function(n, s, o) {
            switch (e("process " + s), s) {
              case "save":
                t(n, s, o[0], o[1], o[2]);
            }
        }
    };
    return n;
}), define("mailapi/worker-support/maildb-main", [], function() {
    function e(e, t, s) {
        o = i._debugDB = new n(s[0], function() {
            i.sendMessage(e, t, Array.prototype.slice.call(arguments));
        });
    }
    function t(e, t, n) {
        Array.isArray(n) || (n = []), n.push(function() {
            i.sendMessage(e, t, Array.prototype.slice.call(arguments));
        }), o._db ? o[t].apply(o, n) : console.warn("trying to call", t, "on apparently dead db. skipping.");
    }
    function n(e, t) {
        this._db = null, this._lazyConfigCarryover = null, this._fatalError = function(e) {
            function t(e) {
                return e ? e instanceof IDBObjectStore ? 'object store "' + e.name + '"' : e instanceof IDBIndex ? 'index "' + e.name + '" on object store "' + e.objectStore.name + '"' : e instanceof IDBCursor ? "cursor on " + t(e.source) : "unexpected source" : "unknown source";
            }
            var n, s = e.target;
            n = s instanceof IDBTransaction ? "transaction (" + s.mode + ")" : s instanceof IDBRequest ? "request as part of " + (s.transaction ? s.transaction.mode : "NO") + " transaction on " + t(s.source) : s.toString(), 
            console.error("indexedDB error:", s.error.name, "from", n);
        };
        var n = r;
        e && e.dbDelta && (n += e.dbDelta), e && e.dbVersion && (n = e.dbVersion);
        var o = s.open("b2g-email", n), i = this;
        o.onsuccess = function() {
            i._db = o.result, t();
        }, o.onupgradeneeded = function(t) {
            console.log("MailDB in onupgradeneeded");
            var n = o.result;
            if (t.oldVersion < a || e && e.nukeDb) i._nukeDB(n); else {
                var s = o.transaction;
                i.getConfig(function(e, s) {
                    e && (i._lazyConfigCarryover = {
                        oldVersion: t.oldVersion,
                        config: e,
                        accountInfos: s
                    }), i._nukeDB(n);
                }, s);
            }
        }, o.onerror = this._fatalError;
    }
    var s, o = null, i = {
        name: "maildb",
        sendMessage: null,
        process: function(n, s, o) {
            switch (s) {
              case "open":
                e(n, s, o);
                break;

              default:
                t(n, s, o);
            }
        },
        _debugDB: null
    };
    if ("indexedDB" in window && window.indexedDB) s = window.indexedDB; else if ("mozIndexedDB" in window && window.mozIndexedDB) s = window.mozIndexedDB; else {
        if (!("webkitIndexedDB" in window && window.webkitIndexedDB)) throw console.error("No IndexedDB!"), 
        new Error("I need IndexedDB; load me in a content page universe!");
        s = window.webkitIndexedDB;
    }
    var r = 22, a = 5, c = "config", l = "accountDef:", d = "folderInfo", u = "headerBlocks", h = "bodyBlocks";
    return n.prototype = {
        _nukeDB: function(e) {
            for (var t = e.objectStoreNames, n = 0; n < t.length; n++) e.deleteObjectStore(t[n]);
            e.createObjectStore(c), e.createObjectStore(d), e.createObjectStore(u), e.createObjectStore(h);
        },
        close: function() {
            this._db && (this._db.close(), this._db = null);
        },
        getConfig: function(e, t) {
            var n = t || this._db.transaction([ c, d ], "readonly"), s = n.objectStore(c), o = n.objectStore(d), i = s.mozGetAll(), r = o.mozGetAll();
            i.onerror = this._fatalError, r.onerror = this._fatalError;
            var a = this;
            r.onsuccess = function() {
                var t, n, s = null, o = [];
                if (a._lazyConfigCarryover) {
                    var c = a._lazyConfigCarryover;
                    return a._lazyConfigCarryover = null, e(s, o, c), void 0;
                }
                for (t = 0; t < i.result.length; t++) n = i.result[t], "config" === n.id ? s = n : o.push({
                    def: n,
                    folderInfo: null
                });
                for (t = 0; t < r.result.length; t++) o[t].folderInfo = r.result[t];
                try {
                    e(s, o);
                } catch (l) {
                    console.error("Problem in configCallback", l, "\n", l.stack);
                }
            };
        },
        saveConfig: function(e) {
            var t = this._db.transaction(c, "readwrite").objectStore(c).put(e, "config");
            t.onerror = this._fatalError;
        },
        saveAccountDef: function(e, t, n) {
            var s = this._db.transaction([ c, d ], "readwrite"), o = s.objectStore(c);
            o.put(e, "config"), o.put(t, l + t.id), n && s.objectStore(d).put(n, t.id), s.onerror = this._fatalError;
        },
        loadHeaderBlock: function(e, t, n) {
            var s = this._db.transaction(u, "readonly").objectStore(u).get(e + ":" + t);
            s.onerror = this._fatalError, s.onsuccess = function() {
                n(s.result);
            };
        },
        loadBodyBlock: function(e, t, n) {
            var s = this._db.transaction(h, "readonly").objectStore(h).get(e + ":" + t);
            s.onerror = this._fatalError, s.onsuccess = function() {
                n(s.result);
            };
        },
        saveAccountFolderStates: function(e, t, n, s, o) {
            function i() {
                var e = Array.slice(arguments), t = e.shift(), n = e.shift();
                m.push({
                    store: t,
                    type: n,
                    args: e
                });
            }
            function r() {
                var e = m.shift();
                if (e) {
                    var t = e.store, n = e.type, s = t[n].apply(t, e.args);
                    s.onsuccess = s.onerror = r;
                }
            }
            var a = this._db.transaction([ d, u, h ], "readwrite");
            a.onerror = this._fatalError, a.objectStore(d).put(t, e);
            var c, l = a.objectStore(u), p = a.objectStore(h), m = [];
            for (c = 0; c < n.length; c++) {
                var f, g = n[c];
                for (var _ in g.headerBlocks) f = g.headerBlocks[_], f ? i(l, "put", f, g.id + ":" + _) : i(l, "delete", g.id + ":" + _);
                for (var y in g.bodyBlocks) f = g.bodyBlocks[y], f ? i(p, "put", f, g.id + ":" + y) : i(p, "delete", g.id + ":" + y);
            }
            if (s) for (c = 0; c < s.length; c++) {
                var v = s[c], b = IDBKeyRange.bound(v + ":", v + ":￰", !1, !1);
                i(l, "delete", b), i(p, "delete", b);
            }
            return o && a.addEventListener("complete", function() {
                o();
            }), r(), a;
        },
        deleteAccount: function(e) {
            var t = this._db.transaction([ c, d, u, h ], "readwrite");
            t.onerror = this._fatalError, t.objectStore(c).delete("accountDef:" + e), t.objectStore(d).delete(e);
            var n = IDBKeyRange.bound(e + "/", e + "/￰", !1, !1);
            t.objectStore(u).delete(n), t.objectStore(h).delete(n);
        }
    }, i;
}), define("mailapi/async_blob_fetcher", [ "exports" ], function() {
    function e(e, t) {
        var n = URL.createObjectURL(e), s = new XMLHttpRequest();
        s.open("GET", n, !0), s.responseType = "arraybuffer", s.onload = function() {
            return 0 !== s.status && (s.status < 200 || s.status >= 300) ? (t(s.status), void 0) : (t(null, new Uint8Array(s.response)), 
            void 0);
        }, s.onerror = function() {
            t("error");
        };
        try {
            s.send();
        } catch (o) {
            console.error("XHR send() failure on blob"), t("error");
        }
        URL.revokeObjectURL(n);
    }
    return {
        asyncFetchBlobAsUint8Array: e
    };
}), define("mailapi/worker-support/net-main", [ "require", "mailapi/async_blob_fetcher" ], function(e) {
    function t(e, t, n, o) {
        var i = navigator.mozTCPSocket, r = i.open(t, n, o), a = c[e] = {
            uid: e,
            sock: r,
            activeBlob: null,
            blobOffset: 0,
            queuedData: null,
            backlog: []
        };
        r.onopen = function() {
            l.sendMessage(e, "onopen");
        }, r.onerror = function(t) {
            var n, s = t.data;
            n = s && "object" == typeof s ? {
                name: s.name,
                type: s.type,
                message: s.message
            } : s, l.sendMessage(e, "onerror", n);
        }, r.ondata = function(t) {
            var n = t.data;
            l.sendMessage(e, "ondata", n, [ n ]);
        }, r.ondrain = function() {
            a.activeBlob && a.queuedData && (console.log("net-main(" + a.uid + "): Socket drained, sending."), 
            r.send(a.queuedData.buffer, 0, a.queuedData.byteLength), a.queuedData = null, s(a));
        }, r.onclose = function() {
            l.sendMessage(e, "onclose");
        };
    }
    function n(e, t) {
        console.log("net-main(" + e.uid + "): Blob send of", t.size, "bytes"), e.activeBlob = t, 
        e.blobOffset = 0, e.queuedData = null, s(e);
    }
    function s(e) {
        function t(t, n) {
            return console.log("net-main(" + e.uid + "): Retrieved chunk"), t ? (e.sock.close(), 
            void 0) : 0 === e.sock.bufferedAmount ? (console.log("net-main(" + e.uid + "): Sending chunk immediately."), 
            e.sock.send(n.buffer, 0, n.byteLength), s(e), void 0) : (e.queuedData = n, void 0);
        }
        if (e.blobOffset >= e.activeBlob.size) {
            console.log("net-main(" + e.uid + "): Blob send completed.", "backlog length:", e.backlog.length), 
            e.activeBlob = null;
            for (var o = e.backlog; o.length; ) {
                var i = o.shift(), r = i[0];
                if (r instanceof Blob) return n(e, r), void 0;
                e.sock.send(r, i[1], i[2]);
            }
        } else {
            var c = Math.min(e.blobOffset + l.BLOB_BLOCK_READ_SIZE, e.activeBlob.size);
            console.log("net-main(" + e.uid + "): Fetching bytes", e.blobOffset, "through", c, "of", e.activeBlob.size);
            var d = e.activeBlob.slice(e.blobOffset, c);
            e.blobOffset = c, a(d, t);
        }
    }
    function o(e) {
        var t = c[e];
        if (t) {
            var n = t.sock;
            n.close(), n.onopen = null, n.onerror = null, n.ondata = null, n.ondrain = null, 
            n.onclose = null, delete c[e];
        }
    }
    function i(e, t, s, o) {
        var i = c[e];
        return i.activeBlob ? (i.backlog.push([ t, s, o ]), void 0) : (t instanceof Blob ? n(i, t) : i.sock.send(t, s, o), 
        void 0);
    }
    function r(e) {
        var t = c[e];
        t && t.sock.upgradeToSecure();
    }
    var a = e("mailapi/async_blob_fetcher").asyncFetchBlobAsUint8Array, c = {}, l = {
        name: "netsocket",
        sendMessage: null,
        BLOB_BLOCK_READ_SIZE: 98304,
        process: function(e, n, s) {
            switch (n) {
              case "open":
                t(e, s[0], s[1], s[2]);
                break;

              case "close":
                o(e);
                break;

              case "write":
                i(e, s[0], s[1], s[2]);
                break;

              case "upgradeToSecure":
                r(e);
            }
        }
    };
    return l;
}), define("mailapi/main-frame-setup", [ "./worker-support/shim-sham", "./mailapi", "./worker-support/main-router", "./worker-support/configparser-main", "./worker-support/cronsync-main", "./worker-support/devicestorage-main", "./worker-support/maildb-main", "./worker-support/net-main" ], function(e, t, n, s, o, i, r, a) {
    var c = {
        name: "control",
        sendMessage: null,
        process: function(e) {
            var t = navigator.onLine;
            c.sendMessage(e, "hello", [ t ]), window.addEventListener("online", function(t) {
                c.sendMessage(e, t.type, [ !0 ]);
            }), window.addEventListener("offline", function(t) {
                c.sendMessage(e, t.type, [ !1 ]);
            }), n.unregister(c);
        }
    }, l = new t.MailAPI(), d = {
        name: "bridge",
        sendMessage: null,
        process: function(e, t, n) {
            var s = n;
            "hello" === s.type ? (delete l._fake, l.__bridgeSend = function(t) {
                u.postMessage({
                    uid: e,
                    type: "bridge",
                    msg: t
                });
            }, l.config = s.config, l._storedSends.forEach(function(e) {
                l.__bridgeSend(e);
            }), l._storedSends = []) : l.__bridgeReceive(s);
        }
    }, u = new Worker("js/ext/mailapi/worker-bootstrap.js");
    return n.useWorker(u), n.register(c), n.register(d), n.register(s), n.register(o), 
    n.register(i), n.register(r), n.register(a), l;
});