define("mailapi/errbackoff", [ "./date", "rdcommon/log", "module", "exports" ], function(e, t, n, s) {
    function o(e, t, n) {
        this.state = "healthy", this._iNextBackoff = 0, this._LOG = a.BackoffEndpoint(this, n, e), 
        this._LOG.state(this.state), this._badResources = {}, this.listener = t;
    }
    var i = s.BACKOFF_DURATIONS = [ {
        fixedMS: 0,
        randomMS: 0
    }, {
        fixedMS: 800,
        randomMS: 400
    }, {
        fixedMS: 4500,
        randomMS: 1e3
    } ], r = window.setTimeout.bind(window);
    s.TEST_useTimeoutFunc = function(e) {
        r = e;
        for (var t = 0; t < i.length; t++) i[t].randomMS = 0;
    }, o.prototype = {
        _setState: function(e) {
            this.state !== e && (this.state = e, this._LOG.state(e), this.listener && this.listener.onEndpointStateChange(e));
        },
        noteConnectSuccess: function() {
            this._setState("healthy"), this._iNextBackoff = 0;
        },
        noteConnectFailureMaybeRetry: function(e) {
            return this._LOG.connectFailure(e), "shutdown" === this.state ? !1 : e ? (this._setState("broken"), 
            !1) : (this._iNextBackoff > 0 && this._setState(e ? "broken" : "unreachable"), this._iNextBackoff >= i.length ? !1 : !0);
        },
        noteBrokenConnection: function() {
            this._LOG.connectFailure(!0), this._setState("broken"), this._iNextBackoff = i.length;
        },
        scheduleConnectAttempt: function(e) {
            if ("shutdown" !== this.state) {
                if (this._iNextBackoff >= i.length) return e(), void 0;
                var t = i[this._iNextBackoff++], n = t.fixedMS + Math.floor(Math.random() * t.randomMS);
                r(e, n);
            }
        },
        noteBadResource: function(t) {
            var n = e.NOW();
            if (this._badResources.hasOwnProperty(t)) {
                var s = this._badResources[t];
                s.count++, s.last = n;
            } else this._badResources[t] = {
                count: 1,
                last: n
            };
        },
        resourceIsOkayToUse: function(t) {
            return this._badResources.hasOwnProperty(t) ? (this._badResources[t], e.NOW(), void 0) : !0;
        },
        shutdown: function() {
            this._setState("shutdown");
        }
    }, s.createEndpoint = function(e, t, n) {
        return new o(e, t, n);
    };
    var a = s.LOGFAB = t.register(n, {
        BackoffEndpoint: {
            type: t.TASK,
            subtype: t.CLIENT,
            stateVars: {
                state: !1
            },
            events: {
                connectFailure: {
                    reachable: !0
                }
            },
            errors: {}
        }
    });
}), define("mailapi/composite/incoming", [ "rdcommon/log", "../a64", "../accountmixins", "../mailslice", "../searchfilter", "../util", "require", "exports" ], function(e, t, n, s, o, i, r, a) {
    function c(e, t) {
        return e.path.localeCompare(t.path);
    }
    function l(e, t, n, o, i, r, a, c) {
        this.universe = t, this.compositeAccount = n, this.id = o, this.accountDef = n.accountDef, 
        this.enabled = !0, this._alive = !0, this._credentials = i, this._connInfo = r, 
        this._db = c;
        var l = this._folderStorages = {}, d = this.folders = [];
        this.FolderSyncer = e, this._deadFolderIds = null, this._folderInfos = a, this.meta = this._folderInfos.$meta, 
        this.mutations = this._folderInfos.$mutations;
        for (var u in a) if ("$" !== u[0]) {
            var h = a[u];
            l[u] = new s.FolderStorage(this, u, h, this._db, e, this._LOG), d.push(h.$meta);
        }
        this.folders.sort(function(e, t) {
            return e.path.localeCompare(t.path);
        });
        var m = this.getFirstFolderWithType("inbox");
        m || this._learnAboutFolder("INBOX", "INBOX", null, "inbox", "/", 0, !0);
    }
    var d = i.bsearchForInsert;
    a.CompositeIncomingAccount = l, l.prototype = {
        runOp: n.runOp,
        getFirstFolderWithType: n.getFirstFolderWithType,
        getFolderByPath: n.getFolderByPath,
        saveAccountState: n.saveAccountState,
        runAfterSaves: n.runAfterSaves,
        _learnAboutFolder: function(e, n, o, i, r, a, l) {
            var u = this.id + "/" + t.encodeInt(this.meta.nextFolderNum++), h = this._folderInfos[u] = {
                $meta: {
                    id: u,
                    name: e,
                    type: i,
                    path: n,
                    parentId: o,
                    delim: r,
                    depth: a,
                    lastSyncedAt: 0
                },
                $impl: {
                    nextId: 0,
                    nextHeaderBlock: 0,
                    nextBodyBlock: 0
                },
                accuracy: [],
                headerBlocks: [],
                bodyBlocks: [],
                serverIdHeaderBlockMapping: null
            };
            this._folderStorages[u] = new s.FolderStorage(this, u, h, this._db, this.FolderSyncer, this._LOG);
            var m = h.$meta, p = d(this.folders, m, c);
            return this.folders.splice(p, 0, m), l || this.universe.__notifyAddedFolder(this, m), 
            m;
        },
        _forgetFolder: function(e, t) {
            var n = this._folderInfos[e], s = n.$meta;
            delete this._folderInfos[e];
            var o = this._folderStorages[e];
            delete this._folderStorages[e];
            var i = this.folders.indexOf(s);
            this.folders.splice(i, 1), null === this._deadFolderIds && (this._deadFolderIds = []), 
            this._deadFolderIds.push(e), o.youAreDeadCleanupAfterYourself(), t || this.universe.__notifyRemovedFolder(this, s);
        },
        _recreateFolder: function(e, t) {
            this._LOG.recreateFolder(e);
            var n = this._folderInfos[e];
            n.$impl = {
                nextId: 0,
                nextHeaderBlock: 0,
                nextBodyBlock: 0
            }, n.accuracy = [], n.headerBlocks = [], n.bodyBlocks = [], null === this._deadFolderIds && (this._deadFolderIds = []), 
            this._deadFolderIds.push(e);
            var o = this;
            this.saveAccountState(null, function() {
                var i = new s.FolderStorage(o, e, n, o._db, o.FolderSyncer, o._LOG);
                for (var r in Iterator(o._folderStorages[e]._slices)) {
                    var a = r[1];
                    a._storage = i, a.reset(), i.sliceOpenMostRecent(a);
                }
                o._folderStorages[e]._slices = [], o._folderStorages[e] = i, t(i);
            }, "recreateFolder");
        },
        __checkpointSyncCompleted: function(e) {
            this.saveAccountState(null, e, "checkpointSync");
        },
        deleteFolder: function(e, t) {
            function n(e) {
                r = e, r.delBox(i.path, s);
            }
            function s(e) {
                e ? o("unknown") : o(null);
            }
            function o(n) {
                r && (a.__folderDoneWithConnection(r, !1, !1), r = null), n || (a._LOG.deleteFolder(i.path), 
                a._forgetFolder(e)), t && t(n, i);
            }
            if (!this._folderInfos.hasOwnProperty(e)) throw new Error("No such folder: " + e);
            if (!this.universe.online) return t && t("offline"), void 0;
            var i = this._folderInfos[e].$meta, r = null, a = this;
            this.__folderDemandsConnection(null, "deleteFolder", n);
        },
        getFolderStorageForFolderId: function(e) {
            if (this._folderStorages.hasOwnProperty(e)) return this._folderStorages[e];
            throw new Error("No folder with id: " + e);
        },
        getFolderStorageForMessageSuid: function(e) {
            var t = e.substring(0, e.lastIndexOf("/"));
            if (this._folderStorages.hasOwnProperty(t)) return this._folderStorages[t];
            throw new Error("No folder with id: " + t);
        },
        getFolderMetaForFolderId: function(e) {
            return this._folderInfos.hasOwnProperty(e) ? this._folderInfos[e].$meta : null;
        },
        sliceFolderMessages: function(e, t) {
            var n = this._folderStorages[e], o = new s.MailSlice(t, n, this._LOG);
            n.sliceOpenMostRecent(o);
        },
        searchFolderMessages: function(e, t, n, s) {
            var i = this._folderStorages[e], r = new o.SearchSlice(t, i, n, s, this._LOG);
            return i.sliceOpenSearch(r), r;
        },
        shutdownFolders: function() {
            for (var e = 0; e < this.folders.length; e++) {
                var t = this.folders[e], n = this._folderStorages[t.id];
                n.shutdown();
            }
        },
        scheduleMessagePurge: function(e, t) {
            this.universe.purgeExcessMessages(this.compositeAccount, e, t);
        },
        ensureEssentialFolders: function(e) {
            function t() {
                --s || e && e(null);
            }
            var n = {
                trash: "Trash",
                sent: "Sent"
            }, s = 1;
            for (var o in n) this.getFirstFolderWithType(o) || (s++, this.universe.createFolder(this.id, null, n[o], !1, t));
            t();
        },
        onEndpointStateChange: function(e) {
            switch (e) {
              case "healthy":
                this.universe.__removeAccountProblem(this.compositeAccount, "connection", "incoming");
                break;

              case "unreachable":
              case "broken":
                this.universe.__reportAccountProblem(this.compositeAccount, "connection", "incoming");
            }
        }
    }, a.LOGFAB_DEFINITION = {
        CompositeIncomingAccount: {
            type: e.ACCOUNT,
            events: {
                createFolder: {},
                deleteFolder: {},
                recreateFolder: {
                    id: !1
                },
                createConnection: {},
                reuseConnection: {},
                releaseConnection: {},
                deadConnection: {},
                unknownDeadConnection: {},
                connectionMismatch: {},
                saveAccountState: {
                    reason: !1
                },
                accountDeleted: {
                    where: !1
                },
                maximumConnsNoNew: {}
            },
            TEST_ONLY_events: {
                deleteFolder: {
                    path: !1
                },
                createConnection: {
                    label: !1
                },
                reuseConnection: {
                    label: !1
                },
                releaseConnection: {
                    label: !1
                },
                deadConnection: {},
                connectionMismatch: {}
            },
            errors: {
                connectionError: {},
                folderAlreadyHasConn: {
                    folderId: !1
                },
                opError: {
                    mode: !1,
                    type: !1,
                    ex: e.EXCEPTION
                }
            },
            asyncJobs: {
                checkAccount: {
                    err: null
                },
                runOp: {
                    mode: !0,
                    type: !0,
                    error: !1,
                    op: !1
                }
            },
            TEST_ONLY_asyncJobs: {}
        }
    };
}), define("mailapi/imap/folder", [ "rdcommon/log", "../a64", "../allback", "../date", "../syncbase", "../util", "module", "require", "exports" ], function(e, t, n, s, o, i, r, a, c) {
    function l(e) {
        for (var t = 0, n = e.length, s = 0; n > s; s++) {
            var o = e[s];
            null !== o ? t && (e[s - t] = o) : t++;
        }
        return t && e.splice(n - t, t), e;
    }
    function d(e, t, n) {
        this._account = e, this._storage = t, this._LOG = D.ImapFolderConn(this, n, t.folderId), 
        this._conn = null, this.box = null, this._deathback = null;
    }
    function u(e, t, n) {
        this._account = e, this.folderStorage = t, this._LOG = D.ImapFolderSyncer(this, n, t.folderId), 
        this._syncSlice = null, this._curSyncAccuracyStamp = null, this._curSyncDir = 1, 
        this._curSyncIsGrow = null, this._nextSyncAnchorTS = null, this._fallbackOriginTS = null, 
        this._syncThroughTS = null, this._curSyncDayStep = null, this._curSyncDoNotGrowBoundary = null, 
        this._curSyncDoneCallback = null, this.folderConn = new d(e, t, this._LOG);
    }
    function h() {}
    var m = null, p = null, f = null, g = null, y = null, _ = n.allbackMaker, v = (i.bsearchForInsert, 
    i.bsearchMaybeExists, i.cmpHeaderYoungToOld, s.DAY_MILLIS), b = s.NOW, S = (s.BEFORE, 
    s.ON_OR_BEFORE, s.SINCE), C = s.TIME_DIR_AT_OR_BEYOND, w = (s.TIME_DIR_ADD, s.TIME_DIR_DELTA, 
    s.makeDaysAgo), E = s.makeDaysBefore, T = s.quantizeDate, I = 1, A = -1, N = [ "!DELETED" ], x = 256, k = Math.pow(2, 32) - 1;
    d.prototype = {
        acquireConn: function(e, t, n, s) {
            var o = this;
            this._deathback = t, this._account.__folderDemandsConnection(this._storage.folderId, n, function(t) {
                o._conn = t, o._conn.openBox(o._storage.folderMeta.path, function(t, n) {
                    if (t) {
                        if (console.error("Problem entering folder", o._storage.folderMeta.path), o._conn = null, 
                        o._account.__folderDoneWithConnection(o._conn, !1, !0), o._deathback) {
                            var s = o._deathback;
                            o.clearErrorHandler(), s();
                        }
                    } else o.box = n, e(o, o._storage);
                });
            }, function() {
                if (o._conn = null, o._deathback) {
                    var e = o._deathback;
                    o.clearErrorHandler(), e();
                }
            }, s);
        },
        relinquishConn: function() {
            this._conn && (this.clearErrorHandler(), this._account.__folderDoneWithConnection(this._conn, !0, !1), 
            this._conn = null);
        },
        withConnection: function(e, t, n, s) {
            return this._conn ? (this._deathback = t, e(this), void 0) : (this.acquireConn(function() {
                this.withConnection(e, t, n);
            }.bind(this), t, n, s), void 0);
        },
        clearErrorHandler: function() {
            this._deathback = null;
        },
        reselectBox: function(e) {
            this._conn.openBox(this._storage.folderMeta.path, e);
        },
        _timelySyncSearch: function(e, t, n, s) {
            return this._conn ? (this._deathback = n, s && s(.1), this._account.isGmail && this._conn.noop(), 
            this._conn.search(e, function(s, o) {
                return s ? (console.error("Search error on", e, "err:", s), n(), void 0) : (t(o), 
                void 0);
            }), void 0) : (this.acquireConn(this._timelySyncSearch.bind(this, e, t, n, s), n, "sync", !0), 
            void 0);
        },
        syncDateRange: function() {
            var e = Array.slice(arguments), t = this;
            a([ "./protocol/sync" ], function(n) {
                y = n, (t.syncDateRange = t._lazySyncDateRange).apply(t, e);
            });
        },
        _lazySyncDateRange: function(e, t, n, s, i) {
            if (e && t && S(e, t)) return this._LOG.illegalSync(e, t), s("invariant"), void 0;
            console.log("syncDateRange:", e, t);
            var r = N.concat(), a = this, c = a._storage, d = o.BISECT_DATE_AT_N_MESSAGES;
            e && r.push([ "SINCE", e ]), t && r.push([ "BEFORE", t ]);
            var u = _([ "search", "db" ], function(o) {
                var r = o.search, u = o.db, f = [], g = 0, _ = a._conn._state.box.highestModSeq || "";
                if (console.log("SERVER UIDS", r.length, d), r.length > d) {
                    var S = t || T(b() + v + a._account.tzOffset), C = Math.round((S - e) / v);
                    if (console.log("BISECT CASE", r.length, "curDaysDelta", C), C > 1) {
                        a._LOG.syncDateRange_end(null, null, null, e, t, null, null);
                        var w = {
                            oldStartTS: e,
                            oldEndTS: t,
                            numHeaders: r.length,
                            curDaysDelta: C,
                            newStartTS: e,
                            newEndTS: t
                        };
                        return "abort" === s("bisect", w, null) ? (a.clearErrorHandler(), s("bisect-aborted", null), 
                        null) : a.syncDateRange(w.newStartTS, w.newEndTS, n, s, i);
                    }
                }
                i && i(.25);
                for (var E = 0; E < u.length; E++) {
                    var I = u[E], A = r.indexOf(I.srvid);
                    -1 !== A ? (r[A] = null, f.push(I.srvid)) : (c.deleteMessageHeaderAndBodyUsingHeader(I), 
                    g++, u[E] = null);
                }
                var N = l(r);
                g && l(u);
                var x = new y.Sync({
                    connection: a._conn,
                    storage: a._storage,
                    newUIDs: N,
                    knownUIDs: f,
                    knownHeaders: u
                });
                x.onprogress = i, x.oncomplete = function(o, i) {
                    a._LOG.syncDateRange_end(o, i, g, e, t, null, null), a._storage.markSyncRange(e, t, _, n), 
                    p || (p = !0, a.clearErrorHandler(), s(null, null, o + i, h, m));
                };
            }), h = e - this._account.tzOffset, m = t ? t - this._account.tzOffset : null, p = !1;
            console.log("Skewed DB lookup. Start: ", h, new Date(h).toUTCString(), "End: ", m, m ? new Date(m).toUTCString() : null), 
            this._LOG.syncDateRange_begin(null, null, null, e, t, h, m), this._timelySyncSearch(r, u.search, function() {
                p || (p = !0, this._LOG.syncDateRange_end(0, 0, 0, e, t, null, null), s("aborted"));
            }.bind(this), i), this._storage.getAllMessagesInImapDateRange(h, m, u.db);
        },
        searchDateRange: function(e, t, n) {
            var s = N.concat(n);
            t && s.push([ "SINCE", t ]), e && s.push([ "BEFORE", e ]);
        },
        downloadBodyReps: function() {
            var e = Array.slice(arguments), t = this;
            a([ "./imapchew", "./protocol/bodyfetcher", "./protocol/textparser", "./protocol/snippetparser" ], function(n, s, o, i) {
                g = n, f = s, m = o, p = i, (t.downloadBodyReps = t._lazyDownloadBodyReps).apply(t, e);
            });
        },
        _lazyDownloadBodyReps: function(e, t, n) {
            "function" == typeof t && (n = t, t = null), t = t || {};
            var s = this, o = function(o) {
                var i = g.selectSnippetBodyRep(e, o), r = t.maximumBytesToFetch, a = m.TextParser, c = [];
                if (o.bodyReps.forEach(function(t, n) {
                    if (!t.isDownloaded) {
                        var s = {
                            uid: e.srvid,
                            partInfo: t._partInfo,
                            bodyRepIndex: n,
                            createSnippet: n === i
                        }, o = Math.min(5 * t.sizeEstimate, k);
                        if (void 0 !== r) {
                            if (a = p.SnippetParser, 0 >= r) return;
                            t.sizeEstimate > r && (o = r), r -= t.sizeEstimate;
                        }
                        0 >= o && (o = 64), (void 0 !== r || t.amountDownloaded) && (s.bytes = [ t.amountDownloaded, o ]), 
                        c.push(s);
                    }
                }), !c.length) return n(null, o), void 0;
                var l = new f.BodyFetcher(s._conn, a, c);
                s._handleBodyFetcher(l, e, o, function(e) {
                    n(e, o);
                });
            };
            this._storage.getMessageBody(e.suid, e.date, o);
        },
        _downloadSnippet: function(e, t) {
            var n = this;
            this._storage.getMessageBody(e.suid, e.date, function(s) {
                var o = g.selectSnippetBodyRep(e, s);
                if (-1 === o) return t();
                var i = s.bodyReps[o], r = [ {
                    uid: e.srvid,
                    bodyRepIndex: o,
                    partInfo: i._partInfo,
                    bytes: [ 0, x ],
                    createSnippet: !0
                } ], a = new f.BodyFetcher(n._conn, p.SnippetParser, r);
                n._handleBodyFetcher(a, e, s, t);
            });
        },
        _handleBodyFetcher: function(e, t, n, s) {
            var o = {
                changeDetails: {
                    bodyReps: []
                }
            }, i = this;
            e.onparsed = function(e, s) {
                g.updateMessageWithFetch(t, n, e, s, i._LOG), t.bytesToDownloadForBodyDisplay = g.calculateBytesToDownloadForImapBodyDisplay(n), 
                i._storage.updateMessageHeader(t.date, t.id, !1, t, n), o.changeDetails.bodyReps.push(e.bodyRepIndex);
            }, e.onerror = function(e) {
                s(e);
            }, e.onend = function() {
                i._storage.updateMessageBody(t, n, {}, o), i._storage.runAfterDeferredCalls(s);
            };
        },
        _lazyDownloadBodies: function(e, t, n) {
            function s(e) {
                e && !o && (o = e), --i || a._storage.runAfterDeferredCalls(function() {
                    n(o, r - i);
                });
            }
            for (var o, i = 1, r = 0, a = this, c = 0; c < e.length; c++) e[c] && null === e[c].snippet && (i++, 
            r++, this.downloadBodyReps(e[c], t, s));
            window.setZeroTimeout(s);
        },
        downloadBodies: function() {
            var e = Array.slice(arguments), t = this;
            a([ "./imapchew", "./protocol/bodyfetcher", "./protocol/snippetparser" ], function(n, s, o) {
                g = n, f = s, p = o, (t.downloadBodies = t._lazyDownloadBodies).apply(t, e);
            });
        },
        downloadMessageAttachments: function(e, t, n) {
            a([ "mailparser/mailparser", "mailparser/streams" ], function(s, o) {
                function i(e) {
                    l._state = 2, l._remainder = "";
                    var t = l._currentNode = l._createMimeNode(null);
                    t.attachment = !0, t.checksum = d, t.content = void 0, t.meta.contentType = e.type, 
                    t.meta.transferEncoding = e.encoding, t.meta.charset = null, t.meta.textFormat = null, 
                    t.stream = "base64" === t.meta.transferEncoding ? new o.Base64Stream() : "quoted-printable" == t.meta.transferEncoding ? new o.QPStream("binary") : new o.BinaryStream(), 
                    t.stream.checksum = d, t.stream.on("data", function(e) {
                        h.push(e);
                    });
                }
                function r(e) {
                    process.immediate = !0, u += e.length, l.write(e), l._process(!1), process.immediate = !1;
                }
                var a = this._conn, c = this, l = new s.MailParser({
                    streamAttachments: !0
                }), d = {
                    update: function() {},
                    digest: function() {
                        return null;
                    }
                }, u = 0, h = [], m = null, p = 0, f = [];
                t.forEach(function(t) {
                    var s = {
                        request: {
                            struct: !1,
                            headers: !1,
                            body: t.part
                        }
                    };
                    p++;
                    var o = a.fetch(e, s);
                    i(t), o.on("error", function(e) {
                        if (m || (m = e), 0 === --p) try {
                            n(m, f);
                        } catch (t) {
                            c._LOG.callbackErr(t);
                        }
                    }), o.on("message", function(e) {
                        i(t), e.on("data", r), e.on("end", function() {
                            if (process.immediate = !0, l._process(!0), process.immediate = !1, console.log("Downloaded", u, "bytes of attachment data."), 
                            f.push(new Blob(h, {
                                type: t.type
                            })), 0 === --p) try {
                                n(m, f);
                            } catch (e) {
                                c._LOG.callbackErr(e);
                            }
                        });
                    });
                });
            }.bind(this));
        },
        shutdown: function() {
            this._LOG.__die();
        }
    }, c.ImapFolderSyncer = u, u.prototype = {
        syncable: !0,
        get canGrowSync() {
            return "localdrafts" !== this.folderStorage.folderMeta.type;
        },
        initialSync: function(e, t, n, s, i) {
            n("sync", !1), this.folderConn.withConnection(function(n) {
                var r = !1;
                n && n.box && n.box.messages.total < o.SYNC_WHOLE_FOLDER_AT_N_MESSAGES && (r = !0), 
                this._startSync(e, I, "grow", null, o.OLDEST_SYNC_DATE, null, r ? null : t, s, i);
            }.bind(this), function() {
                s("aborted");
            }, "initialSync", !0);
        },
        refreshSync: function(e, t, n, s, o, i, r) {
            this._startSync(e, t, "refresh", t === I ? s : n, t === I ? n : s, o, null, i, r);
        },
        growSync: function(e, t, n, s, i, r) {
            var a;
            a = t === I ? o.OLDEST_SYNC_DATE : null, this._startSync(e, t, "grow", n, a, null, s, i, r);
        },
        _startSync: function(e, t, n, s, o, i, r, a, c) {
            var l, d;
            this._syncSlice = e, this._curSyncAccuracyStamp = b(), this._curSyncDir = t, this._curSyncIsGrow = "grow" === n, 
            this._fallbackOriginTS = i, t === I ? (d = s, r ? this._nextSyncAnchorTS = l = d ? d - r * v : w(r, this._account.tzOffset) : (l = o, 
            this._nextSyncAnchorTS = null)) : (l = s, r ? this._nextSyncAnchorTS = d = l + r * v : (d = o, 
            this._nextSyncAnchorTS = null)), this._syncThroughTS = o, this._curSyncDayStep = r, 
            this._curSyncDoNotGrowBoundary = null, this._curSyncDoneCallback = a, this.folderConn.syncDateRange(l, d, this._curSyncAccuracyStamp, this.onSyncCompleted.bind(this), c);
        },
        _doneSync: function(e) {
            this._syncSlice.desiredHeaders = this._syncSlice.headers.length, this._curSyncDoneCallback && this._curSyncDoneCallback(e), 
            this._account.__checkpointSyncCompleted(), this._syncSlice = null, this._curSyncAccuracyStamp = null, 
            this._curSyncDir = null, this._nextSyncAnchorTS = null, this._syncThroughTS = null, 
            this._curSyncDayStep = null, this._curSyncDoNotGrowBoundary = null, this._curSyncDoneCallback = null;
        },
        onSyncCompleted: function(e, t, n, s, i) {
            if ("bisect" === e) {
                var r = t.curDaysDelta, a = t.numHeaders;
                if (this._curSyncDir === A && this._fallbackOriginTS) {
                    this.folderStorage.clearSyncedToDawnOfTime(this._fallbackOriginTS), t.oldStartTS = this._fallbackOriginTS, 
                    this._fallbackOriginTS = null;
                    var c = t.oldEndTS || T(b() + v + this._account.tzOffset);
                    r = Math.round((c - t.oldStartTS) / v), a = 1.5 * o.BISECT_DATE_AT_N_MESSAGES;
                } else r > 1e3 && (r = 30);
                var l = o.BISECT_DATE_AT_N_MESSAGES / (2 * a), d = Math.max(1, Math.min(r - 2, Math.ceil(l * r)));
                return this._curSyncDayStep = d, this._curSyncDir === I ? (t.newEndTS = t.oldEndTS, 
                this._nextSyncAnchorTS = t.newStartTS = E(t.newEndTS, d, this._account.tzOffset), 
                this._curSyncDoNotGrowBoundary = t.oldStartTS) : (t.newStartTS = t.oldStartTS, this._nextSyncAnchorTS = t.newEndTS = E(t.newStartTS, -d, this._account.tzOffset), 
                this._curSyncDoNotGrowBoundary = t.oldEndTS), void 0;
            }
            if (e) return this._doneSync(e), void 0;
            if (console.log("Sync Completed!", this._curSyncDayStep, "days", n, "messages synced"), 
            this._syncSlice.isDead) return this._doneSync(), void 0;
            var u = this.folderConn && this.folderConn.box && this.folderConn.box.messages.total, h = this.folderStorage.getKnownMessageCount(), m = this._curSyncDir === I ? s : i;
            if (console.log("folder message count", u, "dbCount", h, "syncedThrough", m, "oldest known", this.folderStorage.getOldestMessageTimestamp()), 
            this._curSyncDir === I && u === h && (!u || C(this._curSyncDir, m, this.folderStorage.getOldestMessageTimestamp()))) return this.folderStorage.markSyncedToDawnOfTime(), 
            this._doneSync(), void 0;
            if (!this._nextSyncAnchorTS || C(this._curSyncDir, this._nextSyncAnchorTS, this._syncThroughTS)) return this._doneSync(), 
            void 0;
            if (this._curSyncIsGrow && this._syncSlice.headers.length >= this._syncSlice.desiredHeaders) return console.log("SYNCDONE Enough headers retrieved.", "have", this._syncSlice.headers.length, "want", this._syncSlice.desiredHeaders, "conn knows about", this.folderConn.box.messages.total, "sync date", this._curSyncStartTS, "[oldest defined as", o.OLDEST_SYNC_DATE, "]"), 
            this._doneSync(), void 0;
            var p, f;
            n || null !== this._curSyncDoNotGrowBoundary && !C(this._curSyncDir, this._nextSyncAnchorTS, this._curSyncDoNotGrowBoundary) ? p = this._curSyncDayStep : (this._curSyncDoNotGrowBoundary = null, 
            f = (T(b() + this._account.tzOffset) - this._nextSyncAnchorTS) / v, p = Math.ceil(this._curSyncDayStep * o.TIME_SCALE_FACTOR_ON_NO_MESSAGES), 
            180 > f ? p > 45 && (p = 45) : 365 > f ? p > 90 && (p = 90) : 730 > f ? p > 120 && (p = 120) : 1825 > f ? p > 180 && (p = 180) : 3650 > f ? p > 365 && (p = 365) : p > 730 && (p = 730), 
            this._curSyncDayStep = p);
            var g, y;
            this._curSyncDir === I ? (y = this._nextSyncAnchorTS, this._nextSyncAnchorTS = g = E(y, p, this._account.tzOffset)) : (g = this._nextSyncAnchorTS, 
            this._nextSyncAnchorTS = y = E(g, -p, this._account.tzOffset)), this.folderConn.syncDateRange(g, y, this._curSyncAccuracyStamp, this.onSyncCompleted.bind(this));
        },
        allConsumersDead: function() {
            this.folderConn.relinquishConn();
        },
        shutdown: function() {
            this.folderConn.shutdown(), this._LOG.__die();
        }
    }, h.prototype = {};
    var D = c.LOGFAB = e.register(r, {
        ImapFolderConn: {
            type: e.CONNECTION,
            subtype: e.CLIENT,
            events: {},
            TEST_ONLY_events: {},
            errors: {
                callbackErr: {
                    ex: e.EXCEPTION
                },
                htmlParseError: {
                    ex: e.EXCEPTION
                },
                htmlSnippetError: {
                    ex: e.EXCEPTION
                },
                textChewError: {
                    ex: e.EXCEPTION
                },
                textSnippetError: {
                    ex: e.EXCEPTION
                },
                illegalSync: {
                    startTS: !1,
                    endTS: !1
                }
            },
            asyncJobs: {
                syncDateRange: {
                    newMessages: !0,
                    existingMessages: !0,
                    deletedMessages: !0,
                    start: !1,
                    end: !1,
                    skewedStart: !1,
                    skewedEnd: !1
                }
            }
        },
        ImapFolderSyncer: {
            type: e.DATABASE,
            events: {}
        }
    });
}), define("mailapi/imap/jobs", [ "rdcommon/log", "mix", "../jobmixins", "mailapi/drafts/jobs", "module", "exports" ], function(e, t, n, s, o, i) {
    function r(e, t, n) {
        this.account = e, this.resilientServerIds = !1, this._heldMutexReleasers = [], this._LOG = l.ImapJobDriver(this, n, this.account.id), 
        this._state = t, t.hasOwnProperty("suidToServerId") || (t.suidToServerId = {}, t.moveMap = {}), 
        this._stateDelta = {
            serverIdMap: null,
            moveMap: null
        };
    }
    function a() {}
    var c = "idempotent";
    i.ImapJobDriver = r, r.prototype = {
        _accessFolderForMutation: function(e, t, n, s, o) {
            var i = this.account.getFolderStorageForFolderId(e), r = this;
            i.runMutexed(o, function(e) {
                var a = i.folderSyncer, c = function() {
                    r._heldMutexReleasers.push(e);
                    try {
                        n(a.folderConn, i);
                    } catch (t) {
                        r._LOG.callbackErr(t);
                    }
                };
                t && "localdrafts" !== i.folderMeta.type ? a.folderConn.withConnection(function() {
                    r._heldMutexReleasers.push(function() {
                        a.folderConn.clearErrorHandler();
                    }), c();
                }, s, o, !0) : c();
            });
        },
        _partitionAndAccessFoldersSequentially: n._partitionAndAccessFoldersSequentially,
        _acquireConnWithoutFolder: function(e, t, n) {
            this._LOG.acquireConnWithoutFolder_begin(e);
            var s = this;
            this.account.__folderDemandsConnection(null, e, function(n) {
                s._LOG.acquireConnWithoutFolder_end(e), s._heldMutexReleasers.push(function() {
                    s.account.__folderDoneWithConnection(n, !1, !1);
                });
                try {
                    t(n);
                } catch (o) {
                    s._LOG.callbackErr(o);
                }
            }, n);
        },
        postJobCleanup: n.postJobCleanup,
        allJobsDone: n.allJobsDone,
        local_do_downloadBodies: n.local_do_downloadBodies,
        do_downloadBodies: n.do_downloadBodies,
        check_downloadBodies: n.check_downloadBodies,
        local_do_downloadBodyReps: n.local_do_downloadBodyReps,
        do_downloadBodyReps: n.do_downloadBodyReps,
        check_downloadBodyReps: n.check_downloadBodyReps,
        local_do_download: n.local_do_download,
        do_download: n.do_download,
        check_download: n.check_download,
        local_undo_download: n.local_undo_download,
        undo_download: n.undo_download,
        local_do_modtags: n.local_do_modtags,
        do_modtags: function(e, t, n) {
            var s = n ? e.removeTags : e.addTags, o = n ? e.addTags : e.removeTags, i = null;
            this._partitionAndAccessFoldersSequentially(e.messages, !0, function(t, r, a, c, l) {
                function d(t) {
                    return t ? (console.error("failure modifying tags", t), i = "unknown", void 0) : (e.progress += n ? -a.length : a.length, 
                    0 === --u && l(), void 0);
                }
                for (var u = 0, h = [], m = 0; m < a.length; m++) {
                    var p = a[m];
                    p && h.push(p);
                }
                return h.length ? (s && (u++, t._conn.addFlags(h, s, d)), o && (u++, t._conn.delFlags(h, o, d)), 
                void 0) : (l(), void 0);
            }, function() {
                t(i);
            }, function() {
                i = "aborted-retry";
            }, n, "modtags");
        },
        check_modtags: function(e, t) {
            t(null, c);
        },
        local_undo_modtags: n.local_undo_modtags,
        undo_modtags: function(e, t) {
            return this.do_modtags(e, t, !0);
        },
        local_do_delete: n.local_do_delete,
        do_delete: function(e, t) {
            var n = this.account.getFirstFolderWithType("trash");
            this.do_move(e, t, n.id);
        },
        check_delete: function(e, t) {
            var n = this.account.getFirstFolderWithType("trash");
            this.check_move(e, t, n.id);
        },
        local_undo_delete: n.local_undo_delete,
        undo_delete: function() {},
        local_do_move: n.local_do_move,
        do_move: function(e, t, n) {
            var s = this._state, o = this._stateDelta, i = null;
            o.serverIdMap || (o.serverIdMap = {}), n || (n = e.targetFolder), this._partitionAndAccessFoldersSequentially(e.messages, !0, function(t, r, a, c, l) {
                function d(e, n) {
                    function r() {
                        e.reselectBox(d);
                    }
                    function d() {
                        var t = e._conn.fetch(y + ":*", {
                            request: {
                                headers: [ "MESSAGE-ID" ],
                                struct: !1,
                                body: !1
                            }
                        });
                        t.on("message", function(e) {
                            e.on("end", h);
                        }), t.on("error", function(e) {
                            i = e, l();
                        }), t.on("end", function() {
                            if (f < c.length) {
                                if (0 === --g) return i = "aborted-retry", l(), void 0;
                                window.setTimeout(d, 500);
                            }
                        });
                    }
                    function h(e) {
                        var t = e.msg.meta.messageId;
                        if (m.hasOwnProperty(t)) {
                            f++;
                            var i = m[t];
                            o.serverIdMap[i.suid] = e.id, y = e.id + 1;
                            var r = s.moveMap[i.suid], a = parseInt(r.substring(r.lastIndexOf("/") + 1));
                            n.updateMessageHeader(i.date, a, !1, function(t) {
                                return t ? t.srvid = e.id : console.warn("did not find header for", i.suid, r, i.date, a), 
                                0 === --p && u(), !0;
                            }, null);
                        }
                    }
                    var y = e.box._uidnext;
                    t._conn.copy(a, n.folderMeta.path, r);
                }
                function u() {
                    t._conn.addFlags(a, [ "\\Deleted" ], h);
                }
                function h(e) {
                    e && (i = !0), l();
                }
                for (var m = {}, p = c.length, f = 0, g = 3, y = c.length - 1; y >= 0; y--) {
                    var _ = a[y];
                    if (_) {
                        var v = c[y];
                        m[v.guid] = v;
                    } else a.splice(y, 1), c.splice(y, 1);
                }
                return 0 === a.length ? (l(), void 0) : ("localdrafts" === r.folderMeta.type ? l() : r.folderId === n ? "move" === e.type ? l() : u() : this._accessFolderForMutation(n, !0, d, function() {}, "move target"), 
                void 0);
            }.bind(this), function() {
                t(i);
            }, null, !1, "local move source");
        },
        check_move: function(e, t) {
            t(null, "moot");
        },
        local_undo_move: n.local_undo_move,
        undo_move: function(e, t) {
            t("moot");
        },
        local_do_append: function(e, t) {
            t(null);
        },
        do_append: function(e, t) {
            var n, s = this.account.getFolderStorageForFolderId(e.folderId), o = (s.folderMeta, 
            0), i = function(e) {
                return e ? (n = e, n._conn.hasCapability("MULTIAPPEND") ? a() : c(), void 0) : (d("unknown"), 
                void 0);
            }, r = function() {
                t("aborted-retry");
            }, a = function() {
                o = e.messages.length, n._conn.multiappend(e.messages, l);
            }, c = function() {
                var t = e.messages[o++];
                n._conn.append(t.messageText, t, l);
            }, l = function(t) {
                return t ? (console.error("failure appending message", t), d("unknown"), void 0) : (o < e.messages.length ? c() : d(null), 
                void 0);
            }, d = function(e) {
                n && (n = null), t(e);
            };
            this._accessFolderForMutation(e.folderId, !0, i, r, "append");
        },
        check_append: function(e, t) {
            t(null, "moot");
        },
        local_undo_append: function(e, t) {
            t(null);
        },
        undo_append: function(e, t) {
            t("moot");
        },
        local_do_syncFolderList: function(e, t) {
            t(null);
        },
        do_syncFolderList: function(e, t) {
            var n = this.account, s = !1;
            this._acquireConnWithoutFolder("syncFolderList", function(e) {
                n._syncFolderList(e, function(e) {
                    e || (n.meta.lastFolderSyncAt = Date.now()), s || t(e ? "aborted-retry" : null, null, !e), 
                    s = !0;
                });
            }, function() {
                s || t("aborted-retry"), s = !0;
            });
        },
        check_syncFolderList: function(e, t) {
            t("idempotent");
        },
        local_undo_syncFolderList: function(e, t) {
            t("moot");
        },
        undo_syncFolderList: function(e, t) {
            t("moot");
        },
        local_do_createFolder: function(e, t) {
            t(null);
        },
        do_createFolder: function(e, t) {
            function n(e) {
                u = e, u.addBox(a, s);
            }
            function s(e) {
                return e ? e.serverResponse && /\[ALREADYEXISTS\]/.test(e.serverResponse) ? (i(null), 
                void 0) : (console.error("Error creating box:", e), i("unknown"), void 0) : (u.getBoxes("", a, o), 
                void 0);
            }
            function o(e, t) {
                function n(e, t, o) {
                    for (var i in e) {
                        var r = e[i], a = t ? t + i : i;
                        if (r.children) n(r.children, a + r.delim, o + 1); else {
                            var c = h.account._determineFolderType(r, a, u);
                            s = h.account._learnAboutFolder(i, a, l, c, r.delim, o);
                        }
                    }
                }
                if (e) return console.error("Error looking up box:", e), i("unknown"), void 0;
                var s = null;
                n(t, "", 0), s ? i(null, s) : i("unknown");
            }
            function i(e, n) {
                u && (u = null), t && t(e, n);
            }
            function r() {
                t("aborted-retry");
            }
            var a, c, l = null;
            if (e.parentFolderId) {
                if (!this.account._folderInfos.hasOwnProperty(e.parentFolderId)) throw new Error("No such folder: " + e.parentFolderId);
                var d = this.account._folderInfos[e.parentFolderId];
                c = d.$meta.delim, a = d.$meta.path + c, l = d.$meta.id;
            } else a = "", c = this.account.meta.rootDelim;
            a += "string" == typeof e.folderName ? e.folderName : e.folderName.join(c), e.containOnlyOtherFolders && (a += c);
            var u = null, h = this;
            this._acquireConnWithoutFolder("createFolder", n, r);
        },
        check_createFolder: function() {},
        local_undo_createFolder: function(e, t) {
            t(null);
        },
        undo_createFolder: function(e, t) {
            t("moot");
        },
        local_do_purgeExcessMessages: function(e, t) {
            this._accessFolderForMutation(e.folderId, !1, function(e, n) {
                n.purgeExcessMessages(function(e) {
                    t(null, null, e > 0);
                });
            }, null, "purgeExcessMessages");
        },
        do_purgeExcessMessages: function(e, t) {
            t(null);
        },
        check_purgeExcessMessages: function() {
            return c;
        },
        local_undo_purgeExcessMessages: function(e, t) {
            t(null);
        },
        undo_purgeExcessMessages: function(e, t) {
            t(null);
        }
    }, a.prototype = {
        do_xmove: function() {},
        check_xmove: function() {},
        undo_xmove: function() {},
        do_xcopy: function() {},
        check_xcopy: function() {},
        undo_xcopy: function() {}
    }, t(r.prototype, s.draftsMixins);
    var l = i.LOGFAB = e.register(o, {
        ImapJobDriver: {
            type: e.DAEMON,
            events: {
                savedAttachment: {
                    storage: !0,
                    mimeType: !0,
                    size: !0
                },
                saveFailure: {
                    storage: !1,
                    mimeType: !1,
                    error: !1
                }
            },
            TEST_ONLY_events: {
                saveFailure: {
                    filename: !1
                }
            },
            asyncJobs: {
                acquireConnWithoutFolder: {
                    label: !1
                }
            },
            errors: {
                callbackErr: {
                    ex: e.EXCEPTION
                }
            }
        }
    });
}), define("mailapi/imap/account", [ "rdcommon/log", "../a64", "../allback", "../errbackoff", "../mailslice", "../searchfilter", "../util", "../composite/incoming", "./folder", "./jobs", "module", "require", "exports" ], function(e, t, n, s, o, i, r, a, c, l, d, u, h) {
    function m(e, t, n, o, i, r, a, d, u) {
        this._LOG = y.ImapAccount(this, d, n), p.apply(this, [ c.ImapFolderSyncer ].concat(Array.slice(arguments))), 
        this._maxConnsAllowed = 3, this._pendingConn = null, this._ownedConns = [], this._demandedConns = [], 
        this._backoffEndpoint = s.createEndpoint("imap:" + this.id, this, this._LOG), u && this._reuseConnection(u), 
        this.tzOffset = t.accountDef.tzOffset, this._jobDriver = new l.ImapJobDriver(this, this._folderInfos.$mutationState, this._LOG), 
        this._TEST_doNotCloseFolder = !1;
    }
    r.bsearchForInsert, n.allbackMaker;
    var p = a.CompositeIncomingAccount;
    h.Account = h.ImapAccount = m, m.prototype = Object.create(p.prototype);
    var f = {
        type: "imap",
        supportsServerFolders: !0,
        toString: function() {
            return "[ImapAccount: " + this.id + "]";
        },
        get isGmail() {
            return -1 !== this.meta.capability.indexOf("X-GM-EXT-1");
        },
        get numActiveConns() {
            return this._ownedConns.length;
        },
        __folderDemandsConnection: function(e, t, n, s, o) {
            if (o && !this.universe.online) return window.setZeroTimeout(s), void 0;
            var i = {
                folderId: e,
                label: t,
                callback: n,
                deathback: s,
                dieOnConnectFailure: Boolean(o)
            };
            this._demandedConns.push(i), this._demandedConns.length > 1 || this._allocateExistingConnection() || this._makeConnectionIfPossible();
        },
        _killDieOnConnectFailureDemands: function() {
            for (var e = 0; e < this._demandedConns.length; e++) {
                var t = this._demandedConns[e];
                t.dieOnConnectFailure && (t.deathback.call(null), this._demandedConns.splice(e--, 1));
            }
        },
        _allocateExistingConnection: function() {
            if (!this._demandedConns.length) return !1;
            for (var e = this._demandedConns[0], t = 0; t < this._ownedConns.length; t++) {
                var n = this._ownedConns[t];
                if (e.folderId && n.folderId === e.folderId && this._LOG.folderAlreadyHasConn(e.folderId), 
                !n.inUseBy) return n.inUseBy = e, this._demandedConns.shift(), this._LOG.reuseConnection(e.folderId, e.label), 
                e.callback(n.conn), !0;
            }
            return !1;
        },
        closeUnusedConnections: function() {
            for (var e = this._ownedConns.length - 1; e >= 0; e--) {
                var t = this._ownedConns[e];
                t.inUseBy || (t.conn.die(), this._ownedConns.splice(e, 1), this._LOG.deadConnection());
            }
        },
        _makeConnectionIfPossible: function() {
            if (this._ownedConns.length >= this._maxConnsAllowed) return this._LOG.maximumConnsNoNew(), 
            void 0;
            if (!this._pendingConn) {
                this._pendingConn = !0;
                var e = this._makeConnection.bind(this);
                this._backoffEndpoint.scheduleConnectAttempt(e);
            }
        },
        _makeConnection: function(e, t, n) {
            this._pendingConn = !0, u([ "imap", "./probe" ], function(s, o) {
                this._LOG.createConnection(t, n);
                var i = {
                    host: this._connInfo.hostname,
                    port: this._connInfo.port,
                    crypto: this._connInfo.crypto,
                    username: this._credentials.username,
                    password: this._credentials.password,
                    blacklistedCapabilities: this._connInfo.blacklistedCapabilities
                };
                this._LOG && (i._logParent = this._LOG);
                var r = this._pendingConn = new s.ImapConnection(i), a = !1;
                r.on("error", function(e) {
                    a || c(e);
                });
                var c;
                r.connect(c = function(t) {
                    if (a = !0, this._pendingConn = null, t) {
                        var n = o.normalizeError(t);
                        console.error("Connect error:", n.name, "formal:", t, "on", this._connInfo.hostname, this._connInfo.port), 
                        n.reportProblem && this.universe.__reportAccountProblem(this.compositeAccount, n.name, "incoming"), 
                        e && e(n.name), r.die(), n.retry ? this._backoffEndpoint.noteConnectFailureMaybeRetry(n.reachable) ? this._makeConnectionIfPossible() : this._killDieOnConnectFailureDemands() : (this._backoffEndpoint.noteBrokenConnection(), 
                        this._killDieOnConnectFailureDemands());
                    } else this._bindConnectionDeathHandlers(r), this._backoffEndpoint.noteConnectSuccess(), 
                    this._ownedConns.push({
                        conn: r,
                        inUseBy: null
                    }), this._allocateExistingConnection(), e && e(null), this._demandedConns.length && this._makeConnectionIfPossible();
                }.bind(this));
            }.bind(this));
        },
        _reuseConnection: function(e) {
            e.removeAllListeners(), this._ownedConns.push({
                conn: e,
                inUseBy: null
            }), this._bindConnectionDeathHandlers(e);
        },
        _bindConnectionDeathHandlers: function(e) {
            e.on("close", function() {
                for (var t = 0; t < this._ownedConns.length; t++) {
                    var n = this._ownedConns[t];
                    if (n.conn === e) return this._LOG.deadConnection(n.inUseBy && n.inUseBy.folderId), 
                    n.inUseBy && n.inUseBy.deathback && n.inUseBy.deathback(e), n.inUseBy = null, this._ownedConns.splice(t, 1), 
                    void 0;
                }
                this._LOG.unknownDeadConnection();
            }.bind(this)), e.on("error", function(e) {
                this._LOG.connectionError(e), console.warn("Conn steady error:", e, "on", this._connInfo.hostname, this._connInfo.port);
            }.bind(this));
        },
        __folderDoneWithConnection: function(e, t, n) {
            for (var s = 0; s < this._ownedConns.length; s++) {
                var o = this._ownedConns[s];
                if (o.conn === e) return n && this._backoffEndpoint(o.inUseBy.folderId), this._LOG.releaseConnection(o.inUseBy.folderId, o.inUseBy.label), 
                o.inUseBy = null, !t || n || this._TEST_doNotCloseFolder || e.closeBox(function() {}), 
                void 0;
            }
            this._LOG.connectionMismatch();
        },
        _syncFolderList: function(e, t) {
            e.getBoxes(this._syncFolderComputeDeltas.bind(this, e, t));
        },
        _determineFolderType: function(e, t, n) {
            var s = null;
            if (-1 !== e.attribs.indexOf("NOSELECT")) s = "nomail"; else {
                for (var o = 0; o < e.attribs.length; o++) switch (e.attribs[o]) {
                  case "ALL":
                  case "ALLMAIL":
                  case "ARCHIVE":
                    s = "archive";
                    break;

                  case "DRAFTS":
                    s = "drafts";
                    break;

                  case "FLAGGED":
                    s = "starred";
                    break;

                  case "IMPORTANT":
                    s = "important";
                    break;

                  case "INBOX":
                    s = "inbox";
                    break;

                  case "JUNK":
                    s = "junk";
                    break;

                  case "SENT":
                    s = "sent";
                    break;

                  case "SPAM":
                    s = "junk";
                    break;

                  case "STARRED":
                    s = "starred";
                    break;

                  case "TRASH":
                    s = "trash";
                    break;

                  case "HASCHILDREN":
                  case "HASNOCHILDREN":
                  case "MARKED":
                  case "UNMARKED":
                  case "NOINFERIORS":                }
                if (!s) {
                    var i = n.namespaces.personal, r = i.length ? i[0].prefix : "", a = t === r + e.displayName;
                    if (a || t === e.displayName) switch (e.displayName.toUpperCase()) {
                      case "DRAFT":
                      case "DRAFTS":
                        s = "drafts";
                        break;

                      case "INBOX":
                        "INBOX" === t.toUpperCase() && (s = "inbox");
                        break;

                      case "BULK MAIL":
                      case "JUNK":
                      case "SPAM":
                        s = "junk";
                        break;

                      case "SENT":
                        s = "sent";
                        break;

                      case "TRASH":
                        s = "trash";
                        break;

                      case "UNSENT MESSAGES":
                        s = "queue";
                    }
                }
                s || (s = "normal");
            }
            return s;
        },
        _syncFolderComputeDeltas: function(e, t, n, s) {
            function o(t, n, s, r) {
                for (var c in t) {
                    var l, d = t[c], u = n ? n + c : c, h = i._determineFolderType(d, u, e);
                    "inbox" === h && (u = "INBOX"), a.hasOwnProperty(u) ? (l = a[u], l.name = d.displayName, 
                    l.delim = d.delim, a[u] = !0) : l = i._learnAboutFolder(d.displayName, u, r, h, d.delim, s), 
                    d.children && o(d.children, n + c + d.delim, s + 1, l.id);
                }
            }
            var i = this;
            if (n) return t(n), void 0;
            for (var r, a = {}, c = 0; c < this.folders.length; c++) r = this.folders[c], a[r.path] = r;
            o(s, "", 0, null);
            for (var l in a) r = a[l], r !== !0 && "localdrafts" !== r.type && this._forgetFolder(r.id);
            var d = this.getFirstFolderWithType("localdrafts");
            if (!d) {
                var u, h = this.getFirstFolderWithType("drafts") || this.getFirstFolderWithType("sent"), m = h ? h.parentId : this.getFirstFolderWithType("inbox").id;
                u = m ? this._folderInfos[m].$meta : {
                    path: "",
                    delim: "",
                    depth: -1
                };
                var p = u.path + u.delim + "localdrafts";
                this._learnAboutFolder("localdrafts", p, m, "localdrafts", u.delim, u.depth + 1);
            }
            t(null);
        },
        saveSentMessage: function(e) {
            this.isGmail || e.withMessageBlob({
                includeBcc: !0
            }, function(e) {
                var t = {
                    messageText: e,
                    flags: [ "Seen" ]
                }, n = this.getFirstFolderWithType("sent");
                n && this.universe.appendMessages(n.id, [ t ]);
            }.bind(this));
        },
        shutdown: function(e) {
            function t() {
                0 === --n && e();
            }
            p.prototype.shutdownFolders.call(this), this._backoffEndpoint.shutdown();
            for (var n = this._ownedConns.length, s = 0; s < this._ownedConns.length; s++) {
                var o = this._ownedConns[s];
                if (e) {
                    o.inUseBy = {
                        deathback: t
                    };
                    try {
                        o.conn.logout();
                    } catch (i) {
                        n--;
                    }
                } else o.conn.die();
            }
            this._LOG.__die(), !n && e && e();
        },
        checkAccount: function(e) {
            this._LOG.checkAccount_begin(null), this._makeConnection(function(t) {
                this._LOG.checkAccount_end(t), e(t);
            }.bind(this), null, "check");
        },
        accountDeleted: function() {
            this._alive = !1, this.shutdown();
        }
    };
    for (var g in f) Object.defineProperty(m.prototype, g, Object.getOwnPropertyDescriptor(f, g));
    var y = h.LOGFAB = e.register(d, {
        ImapAccount: a.LOGFAB_DEFINITION.CompositeIncomingAccount
    });
}), define("net", [ "require", "exports", "module", "util", "events", "mailapi/worker-router" ], function(e, t) {
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
}), define("mailparser/datetime", [ "require", "exports", "module" ], function() {
    this.strtotime = function(e, t) {
        var n, s, o, i = "", r = "";
        if (i = e, i = i.replace(/\s{2,}|^\s|\s$/g, " "), i = i.replace(/[\t\r\n]/g, ""), 
        "now" == i) return new Date().getTime() / 1e3;
        if (!isNaN(r = Date.parse(i))) return r / 1e3;
        t = t ? new Date(1e3 * t) : new Date(), i = i.toLowerCase();
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
                    var o;
                    if ("undefined" != typeof (o = a.day[e[1].substring(0, 3)])) {
                        var i = o - t.getDay();
                        0 == i ? i = 7 * s : i > 0 ? "last" == e[0] && (i -= 7) : "next" == e[0] && (i += 7), 
                        t.setDate(t.getDate() + i);
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
        if (s = i.match(/^(\d{2,4}-\d{2}-\d{2})(?:\s(\d{1,2}:\d{2}(:\d{2})?)?(?:\.(\d+))?)?$/), 
        null != s) {
            s[2] ? s[3] || (s[2] += ":00") : s[2] = "00:00:00", o = s[1].split(/-/g);
            for (n in a.mon) a.mon[n] == o[1] - 1 && (o[1] = n);
            return o[0] = parseInt(o[0], 10), o[0] = o[0] >= 0 && o[0] <= 69 ? "20" + (o[0] < 10 ? "0" + o[0] : o[0] + "") : o[0] >= 70 && o[0] <= 99 ? "19" + o[0] : o[0] + "", 
            parseInt(this.strtotime(o[2] + " " + o[1] + " " + o[0] + " " + s[2]) + (s[4] ? s[4] / 1e3 : ""), 10);
        }
        var l = "([+-]?\\d+\\s(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday)|(last|next)\\s(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday))(\\sago)?";
        if (s = i.match(new RegExp(l, "gi")), null == s) return !1;
        for (n = 0; n < s.length; n++) if (!c(s[n].split(" "))) return !1;
        return t.getTime() / 1e3;
    };
}), define("mailparser/streams", [ "require", "exports", "module", "stream", "util", "mimelib", "encoding", "crypto" ], function(e, t, n) {
    function s() {
        r.call(this), this.writable = !0, this.checksum = d.createHash("md5"), this.length = 0, 
        this.current = "";
    }
    function o(e) {
        r.call(this), this.writable = !0, this.checksum = d.createHash("md5"), this.length = 0, 
        this.charset = e || "UTF-8", this.current = void 0;
    }
    function i(e) {
        r.call(this), this.writable = !0, this.checksum = d.createHash("md5"), this.length = 0, 
        this.charset = e || "UTF-8", this.current = "";
    }
    var r = e("stream").Stream, a = e("util"), c = e("mimelib"), l = e("encoding"), d = e("crypto");
    n.exports.Base64Stream = s, n.exports.QPStream = o, n.exports.BinaryStream = i, 
    a.inherits(s, r), s.prototype.write = function(e) {
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
    }, a.inherits(o, r), o.prototype.write = function(e) {
        return this.handleInput(e), !0;
    }, o.prototype.end = function(e) {
        return this.handleInput(e), this.flush(), this.emit("end"), {
            length: this.length,
            checksum: this.checksum.digest("hex")
        };
    }, o.prototype.handleInput = function(e) {
        e && e.length && (e = (e || "").toString("utf-8"), e.match(/^\r\n/) && (e = e.substr(2)), 
        "string" != typeof this.current ? this.current = e : this.current += "\r\n" + e);
    }, o.prototype.flush = function() {
        var e = c.decodeQuotedPrintable(this.current, !1, this.charset);
        "binary" == this.charset.toLowerCase() || (e = "utf-8" != this.charset.toLowerCase() ? l.convert(e, "utf-8", this.charset) : new Buffer(e, "utf-8")), 
        this.length += e.length, this.checksum.update(e), this.emit("data", e);
    }, a.inherits(i, r), i.prototype.write = function(e) {
        return e && e.length && (this.length += e.length, this.checksum.update(e), this.emit("data", e)), 
        !0;
    }, i.prototype.end = function(e) {
        return e && e.length && this.emit("data", e), this.emit("end"), {
            length: this.length,
            checksum: this.checksum.digest("hex")
        };
    };
}), define("mailparser/mailparser", [ "require", "exports", "module", "stream", "util", "mimelib", "./datetime", "encoding", "./streams", "crypto" ], function(e, t, n) {
    function s(e) {
        o.call(this), this.writable = !0, this.options = e || {}, this._state = u.header, 
        this._remainder = "", this.mimeTree = this._createMimeNode(), this._currentNode = this.mimeTree, 
        this._currentNode.priority = "normal", this._fileNames = {}, this._multipartTree = [], 
        this.mailData = {}, this._lineCounter = 0, this._lineFeed = !1, this._headersSent = !1;
    }
    var o = e("stream").Stream, i = e("util"), r = e("mimelib"), a = e("./datetime"), c = e("encoding"), l = e("./streams"), d = e("crypto");
    n.exports.MailParser = s;
    var u = {
        header: 1,
        body: 2,
        finished: 3
    };
    i.inherits(s, o), s.prototype.write = function(e, t) {
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
        var t, n, s, o = this._remainder.split(/\r?\n|\r/);
        for (e || (this._remainder = o.pop(), this._remainder.length > 1048576 && (this._remainder = this._remainder.replace(/(.{1048576}(?!\r?\n|\r))/g, "$&\n"))), 
        n = 0, s = o.length; s > n; n++) t = o[n], this.options.unescapeSMTP && ".." == t.substr(0, 2) && (t = t.substr(1)), 
        this.options.debug && console.log("LINE " + ++this._lineCounter + " (" + this._state + "): " + t), 
        !(this._state == u.header && this._processStateHeader(t) === !0 || this._state == u.body && this._processStateBody(t) === !0);
        e && (this._state == u.header && this._remainder && (this._processStateHeader(this._remainder), 
        this._headersSent || (this.emit("headers", this._currentNode.parsedHeaders), this._headersSent = !0)), 
        (this._currentNode.content || this._currentNode.stream) && this._finalizeContents(), 
        this._state = u.finished, process.nextTick(this._processMimeTree.bind(this)));
    }, s.prototype._processStateHeader = function(e) {
        var t, n, s = this._currentNode.headers.length - 1, o = !1;
        return e.length ? (e.match(/^\s+/) && s >= 0 ? this._currentNode.headers[s] += " " + e.trim() : (this._currentNode.headers.push(e.trim()), 
        s >= 0 && this._processHeaderLine(s)), !1) : (s >= 0 && this._processHeaderLine(s), 
        this._headersSent || (this.emit("headers", this._currentNode.parsedHeaders), this._headersSent = !0), 
        this._state = u.body, s >= 0 && this._processHeaderLine(s), this._currentNode.parentNode || this._currentNode.meta.contentType || (this._currentNode.meta.contentType = "text/plain"), 
        o = [ "text/plain", "text/html" ].indexOf(this._currentNode.meta.contentType || "") >= 0, 
        !o || this._currentNode.meta.contentDisposition && "inline" != this._currentNode.meta.contentDisposition ? o && !([ "attachment", "inline" ].indexOf(this._currentNode.meta.contentDisposition) >= 0) || this._currentNode.meta.mimeMultipart || (this._currentNode.attachment = !0) : this._currentNode.attachment = !1, 
        this._currentNode.attachment && (this._currentNode.checksum = d.createHash("md5"), 
        this._currentNode.meta.generatedFileName = this._generateFileName(this._currentNode.meta.fileName, this._currentNode.meta.contentType), 
        n = this._currentNode.meta.generatedFileName.split(".").pop().toLowerCase(), "application/octet-stream" == this._currentNode.meta.contentType && r.contentTypes[n] && (this._currentNode.meta.contentType = r.contentTypes[n]), 
        t = this._currentNode.meta, this.options.streamAttachments ? (this._currentNode.stream = "base64" == this._currentNode.meta.transferEncoding ? new l.Base64Stream() : "quoted-printable" == this._currentNode.meta.transferEncoding ? new l.QPStream("binary") : new l.BinaryStream(), 
        t.stream = this._currentNode.stream, this.emit("attachment", t)) : this._currentNode.content = void 0), 
        !0);
    }, s.prototype._processStateBody = function(e) {
        var t, n, s, o = !1;
        if ("--" == e.substr(0, 2)) for (t = 0, n = this._multipartTree.length; n > t; t++) {
            if (e == "--" + this._multipartTree[t].boundary) {
                (this._currentNode.content || this._currentNode.stream) && this._finalizeContents(), 
                s = this._createMimeNode(this._multipartTree[t].node), this._multipartTree[t].node.childNodes.push(s), 
                this._currentNode = s, this._state = u.header, o = !0;
                break;
            }
            if (e == "--" + this._multipartTree[t].boundary + "--") {
                (this._currentNode.content || this._currentNode.stream) && this._finalizeContents(), 
                this._currentNode = this._multipartTree[t].node.parentNode ? this._multipartTree[t].node.parentNode : this._multipartTree[t].node, 
                this._state = u.body, o = !0;
                break;
            }
        }
        return o ? !0 : ([ "text/plain", "text/html" ].indexOf(this._currentNode.meta.contentType || "") >= 0 && !this._currentNode.attachment ? this._handleTextLine(e) : this._currentNode.attachment && this._handleAttachmentLine(e), 
        !1);
    }, s.prototype._processHeaderLine = function(e) {
        var t, n, s, o;
        if (e = e || 0, (o = this._currentNode.headers[e]) && "string" == typeof o) {
            switch (s = o.split(":"), t = s.shift().toLowerCase().trim(), n = s.join(":").trim(), 
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
                this._currentNode.to = this._currentNode.to && this._currentNode.to.length ? this._currentNode.to.concat(r.parseAddresses(n)) : r.parseAddresses(n);
                break;

              case "from":
                this._currentNode.from = this._currentNode.from && this._currentNode.from.length ? this._currentNode.from.concat(r.parseAddresses(n)) : r.parseAddresses(n);
                break;

              case "cc":
                this._currentNode.cc = this._currentNode.cc && this._currentNode.cc.length ? this._currentNode.cc.concat(r.parseAddresses(n)) : r.parseAddresses(n);
                break;

              case "bcc":
                this._currentNode.bcc = this._currentNode.bcc && this._currentNode.bcc.length ? this._currentNode.bcc.concat(r.parseAddresses(n)) : r.parseAddresses(n);
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
        for (var o = 0, i = n.length; i > o; o++) e = n[o].split("="), t = e.shift().trim().toLowerCase(), 
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
        var t, n, s, o = "", i = 0;
        if (e.name) return this._replaceMimeWords(e.name);
        if (e.filename) return this._replaceMimeWords(e.filename);
        if (e["name*"]) o = e["name*"]; else if (e["filename*"]) o = e["filename*"]; else if (e["name*0*"]) for (;e["name*" + i + "*"]; ) o += e["name*" + i++ + "*"]; else if (e["filename*0*"]) for (;e["filename*" + i + "*"]; ) o += e["filename*" + i++ + "*"];
        return o && (t = o.split("'"), n = t.shift(), s = t.pop()) ? this._replaceMimeWords(this._replaceMimeWords("=?" + (n || "us-ascii") + "?Q?" + s.replace(/%/g, "=") + "?=")) : "";
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
        this._currentNode.content && (this._currentNode.attachment ? (this._currentNode.content = "quoted-printable" == this._currentNode.meta.transferEncoding ? r.decodeQuotedPrintable(this._currentNode.content, !1, "binary") : "base64" == this._currentNode.meta.transferEncoding ? new Buffer(this._currentNode.content.replace(/[^\w\+\/=]/g, ""), "base64") : new Buffer(this._currentNode.content, "binary"), 
        this._currentNode.checksum.update(this._currentNode.content), this._currentNode.meta.checksum = this._currentNode.checksum.digest("hex"), 
        this._currentNode.meta.length = this._currentNode.content.length) : ("text/html" == this._currentNode.meta.contentType && (this._currentNode.meta.charset = this._detectHTMLCharset(this._currentNode.content) || this._currentNode.meta.charset || this.options.defaultCharset || "iso-8859-1"), 
        "quoted-printable" == this._currentNode.meta.transferEncoding ? (this._currentNode.content = r.decodeQuotedPrintable(this._currentNode.content, !1, this._currentNode.meta.charset || this.options.defaultCharset || "iso-8859-1"), 
        "flowed" === this._currentNode.meta.textFormat && (this._currentNode.content = "yes" === this._currentNode.meta.textDelSp ? this._currentNode.content.replace(/ \n/g, "") : this._currentNode.content.replace(/ \n/g, " "))) : this._currentNode.content = "base64" == this._currentNode.meta.transferEncoding ? r.decodeBase64(this._currentNode.content, this._currentNode.meta.charset || this.options.defaultCharset || "iso-8859-1") : this._convertStringToUTF8(this._currentNode.content))), 
        this._currentNode.stream && (e = this._currentNode.stream.end() || {}, e.checksum && (this._currentNode.meta.checksum = e.checksum), 
        e.length && (this._currentNode.meta.length = e.length));
    }, s.prototype._processMimeTree = function() {
        var e, t, n, s, o = {};
        if (this.mailData = {
            html: [],
            text: [],
            alternatives: [],
            attachments: []
        }, this.mimeTree.meta.mimeMultipart ? this._walkMimeTree(this.mimeTree) : this._processMimeNode(this.mimeTree, 0), 
        this.mailData.html.length) for (n = 0, s = this.mailData.html.length; s > n; n++) !o.html || this.mailData.html[n].level < e ? (o.html && (o.alternatives || (o.alternatives = []), 
        o.alternatives.push({
            contentType: "text/html",
            content: o.html
        })), e = this.mailData.html[n].level, o.html = this.mailData.html[n].content) : (o.alternatives || (o.alternatives = []), 
        o.alternatives.push({
            contentType: "text/html",
            content: this.mailData.html[n].content
        }));
        if (this.mailData.text.length) for (n = 0, s = this.mailData.text.length; s > n; n++) !o.text || this.mailData.text[n].level < t ? (o.text && (o.alternatives || (o.alternatives = []), 
        o.alternatives.push({
            contentType: "text/plain",
            content: o.text
        })), t = this.mailData.text[n].level, o.text = this.mailData.text[n].content) : (o.alternatives || (o.alternatives = []), 
        o.alternatives.push({
            contentType: "text/plain",
            content: this.mailData.text[n].content
        }));
        if (o.headers = this.mimeTree.parsedHeaders, this.mimeTree.subject && (o.subject = this.mimeTree.subject), 
        this.mimeTree.references && (o.references = this.mimeTree.references), this.mimeTree.inReplyTo && (o.inReplyTo = this.mimeTree.inReplyTo), 
        this.mimeTree.priority && (o.priority = this.mimeTree.priority), this.mimeTree.from && (o.from = this.mimeTree.from), 
        this.mimeTree.to && (o.to = this.mimeTree.to), this.mimeTree.cc && (o.cc = this.mimeTree.cc), 
        this.mimeTree.bcc && (o.bcc = this.mimeTree.bcc), this.mailData.attachments.length) for (o.attachments = [], 
        n = 0, s = this.mailData.attachments.length; s > n; n++) o.attachments.push(this.mailData.attachments[n].content);
        process.nextTick(this.emit.bind(this, "end", o));
    }, s.prototype._walkMimeTree = function(e, t) {
        t = t || 1;
        for (var n = 0, s = e.childNodes.length; s > n; n++) this._processMimeNode(e.childNodes[n], t, e.meta.mimeMultipart), 
        this._walkMimeTree(e.childNodes[n], t + 1);
    }, s.prototype._processMimeNode = function(e, t, n) {
        var s, o;
        if (t = t || 0, e.attachment) {
            if (e.meta = e.meta || {}, e.content && (e.meta.content = e.content), this.mailData.attachments.push({
                content: e.meta || {},
                level: t
            }), this.options.showAttachmentLinks && "mixed" == n && this.mailData.html.length) for (s = 0, 
            o = this.mailData.html.length; o > s; s++) if (this.mailData.html[s].level == t) return this._joinHTMLAttachment(this.mailData.html[s], e.meta), 
            void 0;
        } else switch (e.meta.contentType) {
          case "text/html":
            if ("mixed" == n && this.mailData.html.length) for (s = 0, o = this.mailData.html.length; o > s; s++) if (this.mailData.html[s].level == t) return this._joinHTMLNodes(this.mailData.html[s], e.content), 
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
        var n, s, o = !1, i = t.generatedFileName.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        n = t.cid || (t.cid = t.generatedFileName + "@node"), s = '\n<div class="mailparser-attachment"><a href="cid:' + n + '">&lt;' + i + "&gt;</a></div>", 
        e.content = (e.content || "").toString("utf-8").trim(), e.content = e.content.replace(/<\/body( [^>]*)?>/i, function(e) {
            return o = !0, "<br/>\n" + s + e;
        }), o || (e.content += "<br/>\n" + s);
    }, s.prototype._convertString = function(e, t, n) {
        return n = (n || "utf-8").toUpperCase(), t = (t || "utf-8").toUpperCase(), e = "string" == typeof e ? new Buffer(e, "binary") : e, 
        n == t ? e : e = c.convert(e, n, t);
    }, s.prototype._convertStringToUTF8 = function(e) {
        return e = this._convertString(e, this._currentNode.meta.charset || this.options.defaultCharset || "iso-8859-1").toString("utf-8");
    }, s.prototype._encodeString = function(e) {
        return e = this._replaceMimeWords(this._convertStringToUTF8(e));
    }, s.prototype._replaceMimeWords = function(e) {
        return e.replace(/(=\?[^?]+\?[QqBb]\?[^?]+\?=)\s+(?==\?[^?]+\?[QqBb]\?[^?]+\?=)/g, "$1").replace(/\=\?[^?]+\?[QqBb]\?[^?]+\?=/g, function(e) {
            return r.decodeMimeWord(e.replace(/\s/g, ""));
        }.bind(this));
    }, s.prototype._trimQuotes = function(e) {
        return e = (e || "").trim(), ('"' == e.charAt(0) && '"' == e.charAt(e.length - 1) || "'" == e.charAt(0) && "'" == e.charAt(e.length - 1) || "<" == e.charAt(0) && ">" == e.charAt(e.length - 1)) && (e = e.substr(1, e.length - 2)), 
        e;
    }, s.prototype._generateFileName = function(e, t) {
        var n, s = "";
        return t && (s = r.contentTypesReversed[t], s = s ? "." + s : ""), e = e || "attachment" + s, 
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
            var h, m, p = n[0];
            if (h = p.params && p.params.name ? e.parseMimeWords(p.params.name) : p.params && p.params["name*"] ? o(p.params["name*"]) : p.disposition && p.disposition.params && p.disposition.params.filename ? e.parseMimeWords(p.disposition.params.filename) : p.disposition && p.disposition.params && p.disposition.params["filename*"] ? o(p.disposition.params["filename*"]) : null, 
            m = p.disposition ? p.disposition.type.toLowerCase() : p.id ? "inline" : h || "text" !== p.type ? "attachment" : "inline", 
            "text" !== p.type && "image" !== p.type && (m = "attachment"), "application" === p.type && ("pgp-signature" === p.subtype || "pkcs7-signature" === p.subtype)) return !0;
            if ("attachment" === m) return a.push(r(p, h)), !0;
            switch (p.type) {
              case "image":
                return d.push(r(p, h)), !0;

              case "text":
                if ("plain" === p.subtype || "html" === p.subtype) return c.push(u(p)), !0;
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
    function m(e) {
        var t = "";
        if (Array.isArray(e)) return e.forEach(function(e) {
            t += m(e) + "\n";
        }), t;
        for (var n = 0; n < e.length; n++) {
            var s = String.fromCharCode(e[n]);
            t += "\r" === s ? "\\r" : "\n" === s ? "\\n" : s;
        }
        return t;
    }
    var p = window.setTimeout.bind(window), f = window.clearTimeout.bind(window);
    t.setTimeoutFuncs = function(e, t) {
        p = e, f = t;
    };
    var g = t.Pop3Client = function(e, t) {
        if (this.options = e = e || {}, e.host = e.host || null, e.username = e.username || null, 
        e.password = e.password || null, e.port = e.port || null, e.crypto = e.crypto || !1, 
        e.connTimeout = e.connTimeout || 3e4, e.debug = e.debug || !1, e.authMethods = [ "apop", "sasl", "user-pass" ], 
        this._LOG = e._logParent ? y.Pop3Client(this, e._logParent, Date.now() % 1e3) : null, 
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
        var o = p(function() {
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
            var t = m(e), n = -1 === t.indexOf("-ERR") ? "[32m" : "[31m";
            dump("<-- " + n + t + "[0;37m\n");
        });
        var e = this.socket.write;
        this.socket.write = function(t) {
            var n = m(t);
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
            for (var l = 0, u = 0, h = [], m = 0, p = 0; p < c.length; p++) {
                var f = c[p];
                !n || n(f.uidl) ? h.length < i ? (l += f.size, h.push(f)) : a.push(f) : m++;
            }
            console.log("POP3: listMessages found " + h.length + " new, " + a.length + " overflow, and " + m + " seen messages. New UIDLs:"), 
            h.forEach(function(e) {
                console.log("POP3: " + e.size + " bytes: " + e.uidl);
            });
            var g = h.length;
            o || (o = g);
            var y = function() {
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
                    console.log("POP3: Checkpoint."), r ? r(y) : y();
                });
            }.bind(this);
            y();
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
        var o, i = s.mimeTree, d = t ? s._currentNode : null, u = n && this.idToSize[n] || e.length, m = {}, p = {
            id: n && this.idToUidl[n],
            msg: i,
            date: i.meta.date && i.meta.date.valueOf(),
            flags: [],
            structure: h(i, "1", m, d)
        }, f = a.chewHeaderAndBodyStructure(p, null, null), g = a.selectSnippetBodyRep(f.header, f.bodyInfo), y = {}, _ = 0, v = m.partial;
        for (var b in m) "partial" !== b && b !== v && (_ += m[b].length, y[b] = m[b].length);
        v && (y[v] = u - _);
        for (var S = 0; S < f.bodyInfo.bodyReps.length; S++) {
            var C = f.bodyInfo.bodyReps[S];
            if (o = m[C.part], null != o) {
                var w = {
                    bytes: v === C.part ? [ -1, -1 ] : null,
                    bodyRepIndex: S,
                    createSnippet: S === g
                };
                C.size = y[C.part];
                var E = {
                    bytesFetched: o.length,
                    text: o
                };
                a.updateMessageWithFetch(f.header, f.bodyInfo, w, E, this._LOG);
            }
        }
        for (var S = 0; S < f.bodyInfo.relatedParts.length; S++) {
            var T = f.bodyInfo.relatedParts[S];
            T.sizeEstimate = y[T.part], o = m[T.part], null != o && v !== T.part && (T.file = new Blob([ o ], {
                type: T.type
            }));
        }
        for (var S = 0; S < f.bodyInfo.attachments.length; S++) {
            var I = f.bodyInfo.attachments[S];
            o = m[I.part], I.sizeEstimate = y[I.part], null != o && v !== I.part && l.isSupportedType(I.type) && (I.file = new Blob([ o ], {
                type: I.type
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
    var y = t.LOGFAB = n.register(e, {
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
    g._LOG = y.Pop3Client();
}), define("mailapi/pop3/sync", [ "rdcommon/log", "../util", "module", "require", "exports", "../mailchew", "../syncbase", "../date", "../jobmixins", "../allback", "pop3/pop3" ], function(e, t, n, s, o, i, r, a, c, l) {
    function d(e, t, n) {
        this._LOG = p.Pop3FolderSyncer(this, n, t.folderId), this.account = e, this.storage = t, 
        this.isInbox = "inbox" === t.folderMeta.type;
    }
    function u(e, t, n, o) {
        return function() {
            var i = Array.slice(arguments);
            s([], function() {
                var s = function() {
                    return this.isInbox ? (this.account.withConnection(function(e, n, s) {
                        var r = i[t];
                        e ? r && r(e) : (i[t] = function() {
                            s(), r && r();
                        }, o.apply(this, [ n ].concat(i)));
                    }.bind(this), n), void 0) : (o.apply(this, [ null ].concat(i)), void 0);
                }.bind(this);
                e && this.account._conn && "disconnected" !== this.account._conn.state ? this.account._conn.quit(s) : s();
            }.bind(this));
        };
    }
    function h(e) {
        for (var t = [], n = 0; e > n; n++) t.push(n);
        return t;
    }
    var m = 1;
    o.Pop3FolderSyncer = d, d.prototype = {
        syncable: !0,
        get canGrowSync() {
            return this.isInbox;
        },
        downloadBodies: u(!1, 2, "downloadBodies", function(e, t, n, s) {
            for (var o = l.latch(), i = this.storage, r = 0; r < t.length; r++) t[r] && null == t[r].snippet && this.downloadBodyReps(t[r], n, o.defer(r));
            o.then(function(e) {
                var n = null;
                for (var o in e) n = e[o][0];
                i.runAfterDeferredCalls(function() {
                    s(n, t.length);
                });
            });
        }),
        downloadBodyReps: u(!1, 2, "downloadBodyReps", function(e, t, n, s) {
            n instanceof Function && (s = n, n = {}), console.log("POP3: Downloading bodyReps for UIDL " + t.srvid), 
            e.downloadMessageByUidl(t.srvid, function(e, n) {
                if (e) return s(e), void 0;
                t.bytesToDownloadForBodyDisplay = n.header.bytesToDownloadForBodyDisplay, console.log("POP3: Storing message " + t.srvid + " with " + t.bytesToDownloadForBodyDisplay + " bytesToDownload.");
                var o = n.bodyInfo.attachments.length > 0;
                this.storeMessage(t, n.bodyInfo, {
                    flush: o
                }, function() {
                    s && s(null, n.bodyInfo, o);
                });
            }.bind(this));
        }),
        downloadMessageAttachments: function(e, t, n) {
            console.log("POP3: ERROR: downloadMessageAttachments called and POP3 shouldn't do that."), 
            n(null, null);
        },
        storeMessage: function(e, t, n, s) {
            s = s || function() {};
            var o = {
                changeDetails: {}
            }, i = this.getMessageIdForUidl(e.srvid);
            null == e.id && (e.id = null == i ? this.storage._issueNewHeaderId() : i, e.suid = this.storage.folderId + "/" + e.id, 
            e.guid = e.guid || e.srvid);
            for (var r = l.latch(), a = this, d = 0; d < t.attachments.length; d++) {
                var u = t.attachments[d];
                u.file instanceof Blob && (console.log("Saving attachment", u.file), c.saveToDeviceStorage(this._LOG, u.file, "sdcard", u.name, u, r.defer()));
            }
            r.then(function() {
                if (r = l.latch(), null == i) a.storeMessageUidlForMessageId(e.srvid, e.id), a.storage.addMessageHeader(e, t, r.defer()), 
                a.storage.addMessageBody(e, t, r.defer()); else {
                    a.storage.updateMessageHeader(e.date, e.id, !0, e, t, r.defer()), o.changeDetails.attachments = h(t.attachments.length), 
                    o.changeDetails.bodyReps = h(t.bodyReps.length);
                    var c = {};
                    n.flush && (c.flushBecause = "blobs"), a.storage.updateMessageBody(e, t, c, o, r.defer());
                }
                r.then(function() {
                    s(null, t);
                });
            });
        },
        get inboxMeta() {
            return this.inboxMeta = this.account.getFolderMetaForFolderId(this.account.getFirstFolderWithType("inbox").id);
        },
        getMessageIdForUidl: function(e) {
            return null == e ? null : (this.inboxMeta.uidlMap = this.inboxMeta.uidlMap || {}, 
            this.inboxMeta.uidlMap[e]);
        },
        storeMessageUidlForMessageId: function(e, t) {
            this.inboxMeta.uidlMap = this.inboxMeta.uidlMap || {}, this.inboxMeta.uidlMap[e] = t, 
            this.inboxMeta.overflowMap && delete this.inboxMeta.overflowMap[e];
        },
        storeOverflowMessageUidl: function(e, t) {
            this.inboxMeta.overflowMap = this.inboxMeta.overflowMap || {}, this.inboxMeta.overflowMap[e] = {
                size: t
            };
        },
        hasOverflowMessages: function() {
            if (!this.inboxMeta.overflowMap) return !1;
            for (var e in this.inboxMeta.overflowMap) return !0;
            return !1;
        },
        isUidlInOverflowMap: function(e) {
            return this.inboxMeta.overflowMap ? !!this.inboxMeta.overflowMap[e] : !1;
        },
        initialSync: function(e, t, n, s, o) {
            n("sync", !0), this.sync("initial", e, s, o);
        },
        refreshSync: function(e, t, n, s, o, i, r) {
            this.sync("refresh", e, i, r);
        },
        _performTestDeletions: function(e) {
            var t = this.storage.folderMeta, n = 1, s = l.latch();
            t._TEST_pendingHeaderDeletes && (t._TEST_pendingHeaderDeletes.forEach(function(e) {
                n++, this.storage.deleteMessageHeaderUsingHeader(e, s.defer());
            }, this), t._TEST_pendingHeaderDeletes = null), t._TEST_pendingAdds && (t._TEST_pendingAdds.forEach(function(e) {
                n++, this.storeMessage(e.header, e.bodyInfo, {}, s.defer());
            }, this), t._TEST_pendingAdds = null), s.then(function() {
                e();
            });
        },
        growSync: function(e, t, n, s, o, i) {
            return t === m && this.hasOverflowMessages() ? (this.sync("grow", e, o, i), !0) : !1;
        },
        allConsumersDead: function() {},
        shutdown: function() {
            this._LOG.__die();
        },
        sync: u(!0, 2, "sync", function(e, t, n, s, o) {
            var i = this;
            this._LOG.sync_begin();
            var c;
            c = "grow" !== t ? function(e) {
                return null == i.getMessageIdForUidl(e) && !i.isUidlInOverflowMap(e);
            } : this.isUidlInOverflowMap.bind(this);
            var d = 0, u = 0, h = l.latch();
            if (this.isInbox) {
                var m = h.defer();
                e.listMessages({
                    filter: c,
                    checkpointInterval: r.POP3_SAVE_STATE_EVERY_N_MESSAGES,
                    maxMessages: r.POP3_MAX_MESSAGES_PER_SYNC,
                    checkpoint: function(e) {
                        this.storage.runAfterDeferredCalls(function() {
                            this.account.__checkpointSyncCompleted(e);
                        }.bind(this));
                    }.bind(this),
                    progress: function(e) {
                        var t = e.totalBytes, n = e.message, s = h.defer();
                        this.storeMessage(n.header, n.bodyInfo, {}, function() {
                            d += e.size, u++, o(.1 + .7 * d / t), s();
                        });
                    }.bind(this)
                }, function(t, n, o) {
                    return e.quit(), t ? (s(t), void 0) : (o.length && (o.forEach(function(e) {
                        this.storeOverflowMessageUidl(e.uidl, e.size);
                    }, this), this._LOG.overflowMessages(o.length)), this.storage.runAfterDeferredCalls(m), 
                    void 0);
                }.bind(this));
            } else n.desiredHeaders = this._TEST_pendingAdds && this._TEST_pendingAdds.length, 
            this._performTestDeletions(h.defer());
            h.then(function() {
                this._LOG.sync_end(), this.storage.markSyncRange(r.OLDEST_SYNC_DATE + a.DAY_MILLIS + 1, a.NOW(), "XXX", a.NOW()), 
                this.hasOverflowMessages() || this.storage.markSyncedToDawnOfTime(), this.account.__checkpointSyncCompleted(), 
                "initial" === t ? (this.storage._curSyncSlice.ignoreHeaders = !1, this.storage._curSyncSlice.waitingOnData = "db", 
                this.storage.getMessagesInImapDateRange(r.OLDEST_SYNC_DATE, null, r.INITIAL_FILL_SIZE, r.INITIAL_FILL_SIZE, this.storage.onFetchDBHeaders.bind(this.storage, this.storage._curSyncSlice, !1, s, null))) : s(null, null);
            }.bind(this));
        })
    };
    var p = o.LOGFAB = e.register(n, {
        Pop3FolderSyncer: {
            type: e.CONNECTION,
            subtype: e.CLIENT,
            events: {
                savedAttachment: {
                    storage: !0,
                    mimeType: !0,
                    size: !0
                },
                saveFailure: {
                    storage: !1,
                    mimeType: !1,
                    error: !1
                },
                overflowMessages: {
                    count: !0
                }
            },
            TEST_ONLY_events: {},
            errors: {
                callbackErr: {
                    ex: e.EXCEPTION
                },
                htmlParseError: {
                    ex: e.EXCEPTION
                },
                htmlSnippetError: {
                    ex: e.EXCEPTION
                },
                textChewError: {
                    ex: e.EXCEPTION
                },
                textSnippetError: {
                    ex: e.EXCEPTION
                },
                illegalSync: {
                    startTS: !1,
                    endTS: !1
                }
            },
            asyncJobs: {
                sync: {},
                syncDateRange: {
                    newMessages: !0,
                    existingMessages: !0,
                    deletedMessages: !0,
                    start: !1,
                    end: !1,
                    skewedStart: !1,
                    skewedEnd: !1
                }
            }
        }
    });
}), define("mailapi/pop3/jobs", [ "module", "exports", "rdcommon/log", "../allback", "mix", "../jobmixins", "../drafts/jobs", "pop3/pop3" ], function(e, t, n, s, o, i, r) {
    function a(e, t, n) {
        this._LOG = c.Pop3JobDriver(this, n, e.id), this.account = e, this.resilientServerIds = !0, 
        this._heldMutexReleasers = [], this._stateDelta = {}, this._state = t, t.hasOwnProperty("suidToServerId") || (t.suidToServerId = {}, 
        t.moveMap = {});
    }
    t.Pop3JobDriver = a, a.prototype = {
        _accessFolderForMutation: function(e, t, n, s, o) {
            var i = this.account.getFolderStorageForFolderId(e);
            i.runMutexed(o, function(e) {
                this._heldMutexReleasers.push(e);
                try {
                    n(i.folderSyncer, i);
                } catch (t) {
                    this._LOG.callbackErr(t);
                }
            }.bind(this));
        },
        local_do_createFolder: function(e, t) {
            var n, s, o = null, i = 0;
            if (e.parentFolderId) {
                if (!this.account._folderInfos.hasOwnProperty(e.parentFolderId)) throw new Error("No such folder: " + e.parentFolderId);
                var r = this.account._folderInfos[e.parentFolderId];
                s = r.$meta.delim, n = r.$meta.path + s, o = r.$meta.id, i = r.depth + 1;
            } else n = "", s = this.account.meta.rootDelim;
            if (n += "string" == typeof e.folderName ? e.folderName : e.folderName.join(s), 
            e.containOnlyOtherFolders && (n += s), this.account.getFolderByPath(n)) t(null); else {
                var a = self.account._learnAboutFolder(e.folderName, n, o, "normal", s, i);
                t(null, a);
            }
        },
        local_do_purgeExcessMessages: function(e, t) {
            this._accessFolderForMutation(e.folderId, !1, function(e, n) {
                n.purgeExcessMessages(function(e) {
                    t(null, null, e > 0);
                });
            }, null, "purgeExcessMessages");
        },
        local_do_saveSentDraft: function(e, t) {
            this._accessFolderForMutation(e.folderId, !1, function(n, o) {
                var i = s.latch();
                o.addMessageHeader(e.headerInfo, e.bodyInfo, i.defer()), o.addMessageBody(e.headerInfo, e.bodyInfo, i.defer()), 
                i.then(function() {
                    t(null, null, !0);
                });
            }, null, "saveSentDraft");
        },
        do_syncFolderList: function(e, t) {
            this.account.meta.lastFolderSyncAt = Date.now(), t(null);
        },
        do_modtags: function(e, t) {
            t(null);
        },
        undo_modtags: function(e, t) {
            t(null);
        },
        local_do_modtags: i.local_do_modtags,
        local_undo_modtags: i.local_undo_modtags,
        local_do_move: i.local_do_move,
        local_undo_move: i.local_undo_move,
        local_do_delete: i.local_do_delete,
        local_undo_delete: i.local_undo_delete,
        local_do_downloadBodies: i.local_do_downloadBodies,
        do_downloadBodies: i.do_downloadBodies,
        check_downloadBodies: i.check_downloadBodies,
        check_downloadBodyReps: i.check_downloadBodyReps,
        do_downloadBodyReps: i.do_downloadBodyReps,
        local_do_downloadBodyReps: i.local_do_downloadBodyReps,
        postJobCleanup: i.postJobCleanup,
        allJobsDone: i.allJobsDone,
        _partitionAndAccessFoldersSequentially: i._partitionAndAccessFoldersSequentially
    }, o(a.prototype, r.draftsMixins);
    var c = t.LOGFAB = n.register(e, {
        Pop3JobDriver: {
            type: n.DAEMON,
            events: {
                savedAttachment: {
                    storage: !0,
                    mimeType: !0,
                    size: !0
                },
                saveFailure: {
                    storage: !1,
                    mimeType: !1,
                    error: !1
                }
            },
            TEST_ONLY_events: {
                saveFailure: {
                    filename: !1
                }
            },
            asyncJobs: {
                acquireConnWithoutFolder: {
                    label: !1
                }
            },
            errors: {
                callbackErr: {
                    ex: n.EXCEPTION
                }
            }
        }
    });
}), define("mailapi/pop3/account", [ "rdcommon/log", "../errbackoff", "../composite/incoming", "./sync", "./jobs", "../drafts/draft_rep", "module", "require", "exports" ], function(e, t, n, s, o, i, r, a, c) {
    function l(e, n, i, r, a, c, l, u, h) {
        this._LOG = m.Pop3Account(this, u, i), d.apply(this, [ s.Pop3FolderSyncer ].concat(Array.slice(arguments))), 
        this._conn = null, this._pendingConnectionRequests = [], this._backoffEndpoint = t.createEndpoint("pop3:" + this.id, this, this._LOG), 
        this.tzOffset = 0, h && (this._conn = h), [ "sent", "localdrafts", "trash" ].forEach(function(e) {
            var t = this.getFirstFolderWithType(e);
            t || this._learnAboutFolder(e, e, null, e, "/", 0, !0);
        }.bind(this)), this._jobDriver = new o.Pop3JobDriver(this, this._folderInfos.$mutationState, this._LOG);
    }
    var d = n.CompositeIncomingAccount;
    c.Account = c.Pop3Account = l, l.prototype = Object.create(d.prototype);
    var u = {
        type: "pop3",
        supportsServerFolders: !1,
        toString: function() {
            return "[Pop3Account: " + this.id + "]";
        },
        withConnection: function(e, t) {
            this._pendingConnectionRequests.push(e);
            var n = function() {
                var e = this._pendingConnectionRequests.shift();
                if (e) {
                    var s = function(t) {
                        t ? (e(t), n()) : e(null, this._conn, n);
                    }.bind(this);
                    this._conn && "disconnected" !== this._conn.state ? s() : this._makeConnection(s, t);
                }
            }.bind(this);
            1 === this._pendingConnectionRequests.length && n();
        },
        __folderDoneWithConnection: function() {},
        _makeConnection: function(e, t) {
            this._conn = !0, a([ "pop3/pop3", "./probe" ], function(n, s) {
                this._LOG.createConnection(t);
                var o = {
                    host: this._connInfo.hostname,
                    port: this._connInfo.port,
                    crypto: this._connInfo.crypto,
                    preferredAuthMethod: this._connInfo.preferredAuthMethod,
                    username: this._credentials.username,
                    password: this._credentials.password
                };
                this._LOG && (o._logParent = this._LOG);
                var i = this._conn = new n.Pop3Client(o, function(t) {
                    return t ? (console.error("Connect error:", t.name, "formal:", t, "on", this._connInfo.hostname, this._connInfo.port), 
                    t = s.analyzeError(t), t.reportProblem && this.universe.__reportAccountProblem(this.compositeAccount, t.name, "incoming"), 
                    e && e(t.name, null), i.die(), t.retry && this._backoffEndpoint.noteConnectFailureMaybeRetry(t.reachable) ? this._backoffEndpoint.scheduleConnectAttempt(this._makeConnection.bind(this)) : this._backoffEndpoint.noteBrokenConnection(), 
                    void 0) : (this._backoffEndpoint.noteConnectSuccess(), e && e(null, i), void 0);
                }.bind(this));
            }.bind(this));
        },
        saveSentMessage: function(e) {
            var t = this.getFirstFolderWithType("sent");
            if (t) {
                var n = this.getFolderStorageForFolderId(t.id), s = n._issueNewHeaderId(), o = n.folderId + "/" + s, r = i.cloneDraftMessageForSentFolderWithoutAttachments(e.header, e.body, {
                    id: s,
                    suid: o
                });
                this.universe.saveSentDraft(t.id, r.header, r.body);
            }
        },
        deleteFolder: function(e, t) {
            if (!this._folderInfos.hasOwnProperty(e)) throw new Error("No such folder: " + e);
            var n = this._folderInfos[e].$meta;
            self._LOG.deleteFolder(n.path), self._forgetFolder(e), t && t(null, n);
        },
        shutdown: function(e) {
            d.prototype.shutdownFolders.call(this), this._backoffEndpoint.shutdown(), this._conn && this._conn.die && this._conn.die(), 
            this._LOG.__die(), e && e();
        },
        checkAccount: function(e) {
            null != this._conn && ("disconnected" !== this._conn.state && this._conn.disconnect(), 
            this._conn = null), this._LOG.checkAccount_begin(null), this.withConnection(function(t) {
                this._LOG.checkAccount_end(t), e(t);
            }.bind(this), "checkAccount");
        },
        accountDeleted: function() {
            this._alive = !1, this.shutdown();
        }
    };
    for (var h in u) Object.defineProperty(l.prototype, h, Object.getOwnPropertyDescriptor(u, h));
    var m = c.LOGFAB = e.register(r, {
        Pop3Account: n.LOGFAB_DEFINITION.CompositeIncomingAccount
    });
}), define("mailapi/smtp/account", [ "rdcommon/log", "module", "require", "exports" ], function(e, t, n, s) {
    function o(e, t, n, s, o, r) {
        this.universe = e, this.compositeAccount = t, this.accountId = n, this.credentials = s, 
        this.connInfo = o, this._LOG = i.SmtpAccount(this, r, n), this._activeConnections = [];
    }
    s.ENABLE_SMTP_LOGGING = !1, s.Account = s.SmtpAccount = o, o.prototype = {
        type: "smtp",
        toString: function() {
            return "[SmtpAccount: " + this.id + "]";
        },
        get numActiveConns() {
            return this._activeConnections.length;
        },
        shutdown: function() {
            this._LOG.__die();
        },
        accountDeleted: function() {
            this.shutdown();
        },
        sendMessage: function(e, t) {
            this.establishConnection({
                sendEnvelope: function(t) {
                    console.log("smtp: idle reached, sending envelope"), t.useEnvelope(e.getEnvelope());
                },
                sendMessage: function(t) {
                    console.log("smtp: message reached, building message blob"), e.withMessageBlob({
                        includeBcc: !1
                    }, function(e) {
                        console.log("smtp: blob composed, writing blob"), t.socket.write(e), t._lastDataBytes[0] = 13, 
                        t._lastDataBytes[1] = 10, t.options.debug && console.log("CLIENT (DATA) blob of size:", e.size), 
                        t.end();
                    });
                },
                onSendComplete: function() {
                    console.log("smtp: send completed, closing connection"), t(null);
                },
                onError: function(e, n) {
                    t(e, n);
                }
            });
        },
        checkAccount: function(e) {
            this.establishConnection({
                sendEnvelope: function(t, n) {
                    n(), e();
                },
                sendMessage: function() {},
                onSendComplete: function() {},
                onError: function(t) {
                    "bad-user-or-pass" === t && this.universe.__reportAccountProblem(this.compositeAccount, t, "outgoing"), 
                    e(t);
                }.bind(this)
            });
        },
        establishConnection: function(e) {
            console.log("smtp: requiring code"), n([ "simplesmtp/lib/client" ], function(t) {
                function n() {
                    i = !0, o.close();
                }
                var o, i = !1, r = !1;
                console.log("smtp: code loaded"), o = t(this.connInfo.port, this.connInfo.hostname, {
                    crypto: this.connInfo.crypto,
                    auth: {
                        user: void 0 !== this.credentials.outgoingUsername ? this.credentials.outgoingUsername : this.credentials.username,
                        pass: void 0 !== this.credentials.outgoingPassword ? this.credentials.outgoingPassword : this.credentials.password
                    },
                    debug: s.ENABLE_SMTP_LOGGING
                }), this._activeConnections.push(o), o.once("idle", function() {
                    e.sendEnvelope(o, n);
                }), o.on("message", function() {
                    i || (r = !0, e.sendMessage(o));
                }), o.on("ready", function() {
                    i = !0, o.close(), e.onSendComplete(o);
                }), o.on("rcptFailed", function(t) {
                    t.length && (console.warn("smtp: nonzero bad recipients"), i = !0, o.close(), e.onError("bad-recipient", t));
                }), o.on("error", function(t) {
                    if (!i) {
                        var n = null;
                        switch (console.error("smtp: error:", t.name), t.name) {
                          case "Error":
                            n = r ? "bad-message" : "server-maybe-offline";
                            break;

                          case "AuthError":
                            n = "bad-user-or-pass";
                            break;

                          case "UnknownAuthError":
                            n = "server-maybe-offline";
                            break;

                          case "TLSError":
                            n = "insecure";
                            break;

                          case "SenderError":
                            n = "bad-sender";
                            break;

                          case "RecipientError":
                            n = "bad-recipient";
                            break;

                          default:
                            n = "unknown";
                        }
                        i = !0, e.onError(n, null);
                    }
                }), o.on("end", function() {
                    console.log("smtp: connection ended");
                    var t = this._activeConnections.indexOf(o);
                    -1 !== t ? this._activeConnections.splice(t, 1) : console.error("Dead unknown connection?"), 
                    i || (e.onError("connection-lost", null), i = !0);
                }.bind(this));
            }.bind(this));
        }
    };
    var i = s.LOGFAB = e.register(t, {
        SmtpAccount: {
            type: e.ACCOUNT,
            events: {},
            TEST_ONLY_events: {},
            errors: {
                folderAlreadyHasConn: {
                    folderId: !1
                }
            }
        }
    });
}), define("mailapi/composite/account", [ "rdcommon/log", "../accountcommon", "../a64", "../accountmixins", "../imap/account", "../pop3/account", "../smtp/account", "../allback", "exports" ], function(e, t, n, s, o, i, r, a, c) {
    function l(e, t, n, s, o, i) {
        this.universe = e, this.id = t.id, this.accountDef = t, this._enabled = !0, this.problems = [], 
        this._LOG = i, this.identities = t.identities, d.hasOwnProperty(t.receiveType) || this._LOG.badAccountType(t.receiveType), 
        d.hasOwnProperty(t.sendType) || this._LOG.badAccountType(t.sendType), this._receivePiece = new d[t.receiveType](e, this, t.id, t.credentials, t.receiveConnInfo, n, s, this._LOG, o), 
        this._sendPiece = new d[t.sendType](e, this, t.id, t.credentials, t.sendConnInfo, s, this._LOG), 
        this.folders = this._receivePiece.folders, this.meta = this._receivePiece.meta, 
        this.mutations = this._receivePiece.mutations, this.tzOffset = t.tzOffset;
    }
    var d = {
        imap: o.ImapAccount,
        pop3: i.Pop3Account,
        smtp: r.SmtpAccount
    };
    c.Account = c.CompositeAccount = l, l.prototype = {
        toString: function() {
            return "[CompositeAccount: " + this.id + "]";
        },
        get supportsServerFolders() {
            return this._receivePiece.supportsServerFolders;
        },
        toBridgeWire: function() {
            return {
                id: this.accountDef.id,
                name: this.accountDef.name,
                type: this.accountDef.type,
                defaultPriority: this.accountDef.defaultPriority,
                enabled: this.enabled,
                problems: this.problems,
                syncRange: this.accountDef.syncRange,
                syncInterval: this.accountDef.syncInterval,
                notifyOnNew: this.accountDef.notifyOnNew,
                identities: this.identities,
                credentials: {
                    username: this.accountDef.credentials.username
                },
                servers: [ {
                    type: this.accountDef.receiveType,
                    connInfo: this.accountDef.receiveConnInfo,
                    activeConns: this._receivePiece.numActiveConns || 0
                }, {
                    type: this.accountDef.sendType,
                    connInfo: this.accountDef.sendConnInfo,
                    activeConns: this._sendPiece.numActiveConns || 0
                } ]
            };
        },
        toBridgeFolder: function() {
            return {
                id: this.accountDef.id,
                name: this.accountDef.name,
                path: this.accountDef.name,
                type: "account"
            };
        },
        get enabled() {
            return this._enabled;
        },
        set enabled(e) {
            this._enabled = this._receivePiece.enabled = e;
        },
        saveAccountState: function(e, t, n) {
            return this._receivePiece.saveAccountState(e, t, n);
        },
        get _saveAccountIsImminent() {
            return this.__saveAccountIsImminent;
        },
        set _saveAccountIsImminent(e) {
            this.___saveAccountIsImminent = this._receivePiece._saveAccountIsImminent = e;
        },
        runAfterSaves: function(e) {
            return this._receivePiece.runAfterSaves(e);
        },
        checkAccount: function(e) {
            var t = a.latch();
            this._receivePiece.checkAccount(t.defer("incoming")), this._sendPiece.checkAccount(t.defer("outgoing")), 
            t.then(function(t) {
                e(t.incoming[0], t.outgoing[0]);
            });
        },
        shutdown: function(e) {
            this._sendPiece.shutdown(), this._receivePiece.shutdown(e);
        },
        accountDeleted: function() {
            this._sendPiece.accountDeleted(), this._receivePiece.accountDeleted();
        },
        deleteFolder: function(e, t) {
            return this._receivePiece.deleteFolder(e, t);
        },
        sliceFolderMessages: function(e, t) {
            return this._receivePiece.sliceFolderMessages(e, t);
        },
        searchFolderMessages: function(e, t, n, s) {
            return this._receivePiece.searchFolderMessages(e, t, n, s);
        },
        syncFolderList: function(e) {
            return this._receivePiece.syncFolderList(e);
        },
        sendMessage: function(e, t) {
            return this._sendPiece.sendMessage(e, function(n, s) {
                n || this._receivePiece.saveSentMessage(e), t(n, s, null);
            }.bind(this));
        },
        getFolderStorageForFolderId: function(e) {
            return this._receivePiece.getFolderStorageForFolderId(e);
        },
        getFolderMetaForFolderId: function(e) {
            return this._receivePiece.getFolderMetaForFolderId(e);
        },
        runOp: function(e, t, n) {
            return this._receivePiece.runOp(e, t, n);
        },
        ensureEssentialFolders: function(e) {
            return this._receivePiece.ensureEssentialFolders(e);
        },
        getFirstFolderWithType: s.getFirstFolderWithType
    };
}), define("mailapi/composite/configurator", [ "rdcommon/log", "../accountcommon", "../a64", "../allback", "./account", "../date", "require", "exports" ], function(e, t, n, s, o, i, r, a) {
    var c = s.allbackMaker;
    a.account = o, a.configurator = {
        tryToCreateAccount: function(e, t, n, s, o) {
            var i, a, l, d;
            if (n) {
                d = "imap+smtp" === n.type ? "imap" : "pop3";
                var u = null;
                u = void 0 !== t.outgoingPassword ? t.outgoingPassword : t.password, i = {
                    username: n.incoming.username,
                    password: t.password,
                    outgoingUsername: n.outgoing.username,
                    outgoingPassword: u
                }, a = {
                    hostname: n.incoming.hostname,
                    port: n.incoming.port,
                    crypto: "string" == typeof n.incoming.socketType ? n.incoming.socketType.toLowerCase() : n.incoming.socketType
                }, "imap" === d ? a.blacklistedCapabilities = null : "pop3" === d && (a.preferredAuthMethod = null), 
                l = {
                    emailAddress: t.emailAddress,
                    hostname: n.outgoing.hostname,
                    port: n.outgoing.port,
                    crypto: "string" == typeof n.outgoing.socketType ? n.outgoing.socketType.toLowerCase() : n.outgoing.socketType
                };
            }
            var h = this, m = c([ "incoming", "smtp" ], function(n) {
                if (null === n.incoming[0] && null === n.smtp[0]) {
                    var o = n.incoming[1];
                    if ("imap" === d) {
                        var r = n.incoming[2], c = n.incoming[3];
                        a.blacklistedCapabilities = c, h._defineImapAccount(e, t, i, a, l, o, r, s);
                    } else a.preferredAuthMethod = o.authMethod, h._definePop3Account(e, t, i, a, l, o, s);
                } else ("imap" === d || "pop3" === d) && (null === n.incoming[0] ? (n.incoming[1].die(), 
                s(n.smtp[0], null, n.smtp[1])) : s(n.incoming[0], null, n.incoming[2]));
            });
            r([ "../smtp/probe" ], function(e) {
                var t = new e.SmtpProber(i, l, o);
                t.onresult = m.smtp;
            }), "imap" === d ? r([ "../imap/probe" ], function(e) {
                var t = new e.ImapProber(i, a, o);
                t.onresult = m.incoming;
            }) : r([ "../pop3/probe" ], function(e) {
                var t = new e.Pop3Prober(i, a, o);
                t.onresult = m.incoming;
            });
        },
        recreateAccount: function(e, s, o, i) {
            var r = o.def, a = {
                username: r.credentials.username,
                password: r.credentials.password,
                outgoingUsername: r.credentials.outgoingUsername,
                outgoingPassword: r.credentials.outgoingPassword
            }, c = n.encodeInt(e.config.nextAccountNum++), l = r.type || "imap+smtp", d = {
                id: c,
                name: r.name,
                type: l,
                receiveType: l.split("+")[0],
                sendType: "smtp",
                syncRange: r.syncRange,
                syncInterval: r.syncInterval || 0,
                notifyOnNew: r.hasOwnProperty("notifyOnNew") ? r.notifyOnNew : !0,
                credentials: a,
                receiveConnInfo: {
                    hostname: r.receiveConnInfo.hostname,
                    port: r.receiveConnInfo.port,
                    crypto: r.receiveConnInfo.crypto,
                    blacklistedCapabilities: r.receiveConnInfo.blacklistedCapabilities || null,
                    preferredAuthMethod: r.receiveConnInfo.preferredAuthMethod || null
                },
                sendConnInfo: {
                    hostname: r.sendConnInfo.hostname,
                    port: r.sendConnInfo.port,
                    crypto: r.sendConnInfo.crypto
                },
                identities: t.recreateIdentities(e, c, r.identities),
                tzOffset: void 0 !== o.tzOffset ? o.tzOffset : -252e5
            };
            this._loadAccount(e, d, o.folderInfo, null, function(e) {
                i(null, e, null);
            });
        },
        _defineImapAccount: function(e, t, s, o, r, a, c, l) {
            var d = n.encodeInt(e.config.nextAccountNum++), u = {
                id: d,
                name: t.accountName || t.emailAddress,
                defaultPriority: i.NOW(),
                type: "imap+smtp",
                receiveType: "imap",
                sendType: "smtp",
                syncRange: "auto",
                syncInterval: t.syncInterval || 0,
                notifyOnNew: t.hasOwnProperty("notifyOnNew") ? t.notifyOnNew : !0,
                credentials: s,
                receiveConnInfo: o,
                sendConnInfo: r,
                identities: [ {
                    id: d + "/" + n.encodeInt(e.config.nextIdentityNum++),
                    name: t.displayName,
                    address: t.emailAddress,
                    replyTo: null,
                    signature: null
                } ],
                tzOffset: c
            };
            this._loadAccount(e, u, null, a, function(e) {
                l(null, e, null);
            });
        },
        _definePop3Account: function(e, t, s, o, r, a, c) {
            var l = n.encodeInt(e.config.nextAccountNum++), d = {
                id: l,
                name: t.accountName || t.emailAddress,
                defaultPriority: i.NOW(),
                type: "pop3+smtp",
                receiveType: "pop3",
                sendType: "smtp",
                syncRange: "auto",
                syncInterval: t.syncInterval || 0,
                notifyOnNew: t.hasOwnProperty("notifyOnNew") ? t.notifyOnNew : !0,
                credentials: s,
                receiveConnInfo: o,
                sendConnInfo: r,
                identities: [ {
                    id: l + "/" + n.encodeInt(e.config.nextIdentityNum++),
                    name: t.displayName,
                    address: t.emailAddress,
                    replyTo: null,
                    signature: null
                } ]
            };
            this._loadAccount(e, d, null, a, function(e) {
                c(null, e, null);
            });
        },
        _loadAccount: function(e, t, n, s, o) {
            var i;
            i = "imap" === t.receiveType ? {
                $meta: {
                    nextFolderNum: 0,
                    nextMutationNum: 0,
                    lastFolderSyncAt: 0,
                    capability: n && n.$meta.capability || s.capabilities,
                    rootDelim: n && n.$meta.rootDelim || s.delim
                },
                $mutations: [],
                $mutationState: {}
            } : {
                $meta: {
                    nextFolderNum: 0,
                    nextMutationNum: 0,
                    lastFolderSyncAt: 0
                },
                $mutations: [],
                $mutationState: {}
            }, e.saveAccountDef(t, i), e._loadAccount(t, i, s, o);
        }
    };
});