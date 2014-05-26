(function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/FolderHierarchy", [], t) : e.ASCPHierarchy = t();
})(this, function() {
    return {
        Tags: {
            Folders: 1797,
            Folder: 1798,
            DisplayName: 1799,
            ServerId: 1800,
            ParentId: 1801,
            Type: 1802,
            Response: 1803,
            Status: 1804,
            ContentClass: 1805,
            Changes: 1806,
            Add: 1807,
            Delete: 1808,
            Update: 1809,
            SyncKey: 1810,
            FolderCreate: 1811,
            FolderDelete: 1812,
            FolderUpdate: 1813,
            FolderSync: 1814,
            Count: 1815
        },
        Enums: {
            Type: {
                Generic: "1",
                DefaultInbox: "2",
                DefaultDrafts: "3",
                DefaultDeleted: "4",
                DefaultSent: "5",
                DefaultOutbox: "6",
                DefaultTasks: "7",
                DefaultCalendar: "8",
                DefaultContacts: "9",
                DefaultNotes: "10",
                DefaultJournal: "11",
                Mail: "12",
                Calendar: "13",
                Contacts: "14",
                Tasks: "15",
                Journal: "16",
                Notes: "17",
                Unknown: "18",
                RecipientCache: "19"
            },
            Status: {
                Success: "1",
                FolderExists: "2",
                SystemFolder: "3",
                FolderNotFound: "4",
                ParentFolderNotFound: "5",
                ServerError: "6",
                InvalidSyncKey: "9",
                MalformedRequest: "10",
                UnknownError: "11",
                CodeUnknown: "12"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/AirSync", [], t) : e.ASCPAirSync = t();
}(this, function() {
    return {
        Tags: {
            Sync: 5,
            Responses: 6,
            Add: 7,
            Change: 8,
            Delete: 9,
            Fetch: 10,
            SyncKey: 11,
            ClientId: 12,
            ServerId: 13,
            Status: 14,
            Collection: 15,
            Class: 16,
            Version: 17,
            CollectionId: 18,
            GetChanges: 19,
            MoreAvailable: 20,
            WindowSize: 21,
            Commands: 22,
            Options: 23,
            FilterType: 24,
            Truncation: 25,
            RtfTruncation: 26,
            Conflict: 27,
            Collections: 28,
            ApplicationData: 29,
            DeletesAsMoves: 30,
            NotifyGUID: 31,
            Supported: 32,
            SoftDelete: 33,
            MIMESupport: 34,
            MIMETruncation: 35,
            Wait: 36,
            Limit: 37,
            Partial: 38,
            ConversationMode: 39,
            MaxItems: 40,
            HeartbeatInterval: 41
        },
        Enums: {
            Status: {
                Success: "1",
                InvalidSyncKey: "3",
                ProtocolError: "4",
                ServerError: "5",
                ConversionError: "6",
                MatchingConflict: "7",
                ObjectNotFound: "8",
                OutOfSpace: "9",
                HierarchyChanged: "12",
                IncompleteRequest: "13",
                InvalidInterval: "14",
                InvalidRequest: "15",
                Retry: "16"
            },
            FilterType: {
                NoFilter: "0",
                OneDayBack: "1",
                ThreeDaysBack: "2",
                OneWeekBack: "3",
                TwoWeeksBack: "4",
                OneMonthBack: "5",
                ThreeMonthsBack: "6",
                SixMonthsBack: "7",
                IncompleteTasks: "8"
            },
            Conflict: {
                ClientReplacesServer: "0",
                ServerReplacesClient: "1"
            },
            MIMESupport: {
                Never: "0",
                SMIMEOnly: "1",
                Always: "2"
            },
            MIMETruncation: {
                TruncateAll: "0",
                Truncate4K: "1",
                Truncate5K: "2",
                Truncate7K: "3",
                Truncate10K: "4",
                Truncate20K: "5",
                Truncate50K: "6",
                Truncate100K: "7",
                NoTruncate: "8"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/AirSyncBase", [], t) : e.ASCPAirSyncBase = t();
}(this, function() {
    return {
        Tags: {
            BodyPreference: 4357,
            Type: 4358,
            TruncationSize: 4359,
            AllOrNone: 4360,
            Reserved: 4361,
            Body: 4362,
            Data: 4363,
            EstimatedDataSize: 4364,
            Truncated: 4365,
            Attachments: 4366,
            Attachment: 4367,
            DisplayName: 4368,
            FileReference: 4369,
            Method: 4370,
            ContentId: 4371,
            ContentLocation: 4372,
            IsInline: 4373,
            NativeBodyType: 4374,
            ContentType: 4375,
            Preview: 4376,
            BodyPartPreference: 4377,
            BodyPart: 4378,
            Status: 4379
        },
        Enums: {
            Type: {
                PlainText: "1",
                HTML: "2",
                RTF: "3",
                MIME: "4"
            },
            Method: {
                Normal: "1",
                EmbeddedMessage: "5",
                AttachOLE: "6"
            },
            NativeBodyType: {
                PlainText: "1",
                HTML: "2",
                RTF: "3"
            },
            Status: {
                Success: "1"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/ItemEstimate", [], t) : e.ASCPItemEstimate = t();
}(this, function() {
    return {
        Tags: {
            GetItemEstimate: 1541,
            Version: 1542,
            Collections: 1543,
            Collection: 1544,
            Class: 1545,
            CollectionId: 1546,
            DateTime: 1547,
            Estimate: 1548,
            Response: 1549,
            Status: 1550
        },
        Enums: {
            Status: {
                Success: "1",
                InvalidCollection: "2",
                NoSyncState: "3",
                InvalidSyncKey: "4"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Email", [], t) : e.ASCPEmail = t();
}(this, function() {
    return {
        Tags: {
            Attachment: 517,
            Attachments: 518,
            AttName: 519,
            AttSize: 520,
            Att0Id: 521,
            AttMethod: 522,
            AttRemoved: 523,
            Body: 524,
            BodySize: 525,
            BodyTruncated: 526,
            DateReceived: 527,
            DisplayName: 528,
            DisplayTo: 529,
            Importance: 530,
            MessageClass: 531,
            Subject: 532,
            Read: 533,
            To: 534,
            Cc: 535,
            From: 536,
            ReplyTo: 537,
            AllDayEvent: 538,
            Categories: 539,
            Category: 540,
            DTStamp: 541,
            EndTime: 542,
            InstanceType: 543,
            BusyStatus: 544,
            Location: 545,
            MeetingRequest: 546,
            Organizer: 547,
            RecurrenceId: 548,
            Reminder: 549,
            ResponseRequested: 550,
            Recurrences: 551,
            Recurrence: 552,
            Recurrence_Type: 553,
            Recurrence_Until: 554,
            Recurrence_Occurrences: 555,
            Recurrence_Interval: 556,
            Recurrence_DayOfWeek: 557,
            Recurrence_DayOfMonth: 558,
            Recurrence_WeekOfMonth: 559,
            Recurrence_MonthOfYear: 560,
            StartTime: 561,
            Sensitivity: 562,
            TimeZone: 563,
            GlobalObjId: 564,
            ThreadTopic: 565,
            MIMEData: 566,
            MIMETruncated: 567,
            MIMESize: 568,
            InternetCPID: 569,
            Flag: 570,
            Status: 571,
            ContentClass: 572,
            FlagType: 573,
            CompleteTime: 574,
            DisallowNewTimeProposal: 575
        },
        Enums: {
            Importance: {
                Low: "0",
                Normal: "1",
                High: "2"
            },
            InstanceType: {
                Single: "0",
                RecurringMaster: "1",
                RecurringInstance: "2",
                RecurringException: "3"
            },
            BusyStatus: {
                Free: "0",
                Tentative: "1",
                Busy: "2",
                Oof: "3"
            },
            Recurrence_Type: {
                Daily: "0",
                Weekly: "1",
                MonthlyNthDay: "2",
                Monthly: "3",
                YearlyNthDay: "5",
                YearlyNthDayOfWeek: "6"
            },
            Sensitivity: {
                Normal: "0",
                Personal: "1",
                Private: "2",
                Confidential: "3"
            },
            Status: {
                Cleared: "0",
                Complete: "1",
                Active: "2"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/ItemOperations", [], t) : e.ASCPItemOperations = t();
}(this, function() {
    return {
        Tags: {
            ItemOperations: 5125,
            Fetch: 5126,
            Store: 5127,
            Options: 5128,
            Range: 5129,
            Total: 5130,
            Properties: 5131,
            Data: 5132,
            Status: 5133,
            Response: 5134,
            Version: 5135,
            Schema: 5136,
            Part: 5137,
            EmptyFolderContents: 5138,
            DeleteSubFolders: 5139,
            UserName: 5140,
            Password: 5141,
            Move: 5142,
            DstFldId: 5143,
            ConversationId: 5144,
            MoveAlways: 5145
        },
        Enums: {
            Status: {
                Success: "1",
                ProtocolError: "2",
                ServerError: "3",
                BadURI: "4",
                AccessDenied: "5",
                ObjectNotFound: "6",
                ConnectionFailure: "7",
                InvalidByteRange: "8",
                UnknownStore: "9",
                EmptyFile: "10",
                DataTooLarge: "11",
                IOFailure: "12",
                ConversionFailure: "14",
                InvalidAttachment: "15",
                ResourceAccessDenied: "16"
            }
        }
    };
}), define("mailapi/activesync/folder", [ "rdcommon/log", "../date", "../syncbase", "../util", "mailapi/db/mail_rep", "activesync/codepages/AirSync", "activesync/codepages/AirSyncBase", "activesync/codepages/ItemEstimate", "activesync/codepages/Email", "activesync/codepages/ItemOperations", "module", "require", "exports" ], function(e, t, n, s, o, a, i, r, c, l, d, m, u) {
    function h() {
        v = a.Enums.FilterType, y = {
            auto: null,
            "1d": v.OneDayBack,
            "3d": v.ThreeDaysBack,
            "1w": v.OneWeekBack,
            "2w": v.TwoWeeksBack,
            "1m": v.OneMonthBack,
            all: v.NoFilter
        }, b = {
            0: "all messages",
            1: "one day",
            2: "three days",
            3: "one week",
            4: "two weeks",
            5: "one month"
        };
    }
    function p(e, t, n) {
        return function() {
            var s = Array.slice(arguments), o = s[e], a = this;
            m([ "wbxml", "mimelib", "../mailchew" ], function(e, i, r) {
                C || (C = e, _ = i, E = r, h()), a._account.withConnection(o, function() {
                    t.apply(a, s);
                }, n);
            });
        };
    }
    function g(e, t, n) {
        this._account = e, this._storage = t, this._LOG = I.ActiveSyncFolderConn(this, n, t.folderId), 
        this.folderMeta = t.folderMeta, this.syncKey || (this.syncKey = "0");
    }
    function f(e, t, n) {
        this._account = e, this.folderStorage = t, this._LOG = I.ActiveSyncFolderSyncer(this, n, t.folderId), 
        this.folderConn = new g(e, t, this._LOG);
    }
    var v, y, b, C, _, E, S = 512, N = 50;
    g.prototype = {
        get syncKey() {
            return this.folderMeta.syncKey;
        },
        set syncKey(e) {
            return this.folderMeta.syncKey = e;
        },
        get serverId() {
            return this.folderMeta.serverId;
        },
        get filterType() {
            var e = this._account.accountDef.syncRange;
            if (y.hasOwnProperty(e)) {
                var t = y[e];
                return t ? t : this.folderMeta.filterType;
            }
            return console.warn("Got an invalid syncRange (" + e + ") using three days back instead"), 
            a.Enums.FilterType.ThreeDaysBack;
        },
        _getSyncKey: p(1, function(e, t) {
            var n = this, s = this._account, o = a.Tags, i = new C.Writer("1.3", 1, "UTF-8");
            i.stag(o.Sync).stag(o.Collections).stag(o.Collection), s.conn.currentVersion.lt("12.1") && i.tag(o.Class, "Email"), 
            i.tag(o.SyncKey, "0").tag(o.CollectionId, this.serverId).stag(o.Options).tag(o.FilterType, e).etag().etag().etag().etag(), 
            s.conn.postCommand(i, function(e, a) {
                if (e) return console.error(e), s._reportErrorIfNecessary(e), t("unknown"), void 0;
                n.syncKey = "0";
                var i = new C.EventParser();
                i.addEventListener([ o.Sync, o.Collections, o.Collection, o.SyncKey ], function(e) {
                    n.syncKey = e.children[0].textContent;
                }), i.onerror = function() {}, i.run(a), "0" === n.syncKey ? (console.error("Unable to get sync key for folder"), 
                t("unknown")) : t();
            });
        }),
        _getItemEstimate: p(1, function(e, t) {
            var n = r.Tags, s = a.Tags, o = this._account, i = new C.Writer("1.3", 1, "UTF-8");
            i.stag(n.GetItemEstimate).stag(n.Collections).stag(n.Collection), this._account.conn.currentVersion.gte("14.0") ? i.tag(s.SyncKey, this.syncKey).tag(n.CollectionId, this.serverId).stag(s.Options).tag(s.FilterType, e).etag() : this._account.conn.currentVersion.gte("12.0") ? i.tag(n.CollectionId, this.serverId).tag(s.FilterType, e).tag(s.SyncKey, this.syncKey) : i.tag(n.Class, "Email").tag(s.SyncKey, this.syncKey).tag(n.CollectionId, this.serverId).tag(s.FilterType, e), 
            i.etag(n.Collection).etag(n.Collections).etag(n.GetItemEstimate), o.conn.postCommand(i, function(e, s) {
                if (e) return console.error(e), o._reportErrorIfNecessary(e), t("unknown"), void 0;
                var a, i, c = new C.EventParser(), l = [ n.GetItemEstimate, n.Response ];
                c.addEventListener(l.concat(n.Status), function(e) {
                    a = e.children[0].textContent;
                }), c.addEventListener(l.concat(n.Collection, n.Estimate), function(e) {
                    i = parseInt(e.children[0].textContent, 10);
                });
                try {
                    c.run(s);
                } catch (d) {
                    return console.error("Error parsing GetItemEstimate response", d, "\n", d.stack), 
                    t("unknown"), void 0;
                }
                a !== r.Enums.Status.Success ? (console.error("Error getting item estimate:", a), 
                t("unknown")) : t(null, i);
            });
        }),
        _inferFilterType: p(0, function(e) {
            var t = this, n = a.Enums.FilterType, s = function(s, o) {
                t._getSyncKey(s, function(a) {
                    return a ? (e("unknown"), void 0) : (t._getItemEstimate(s, function(t, s) {
                        return t ? (e(null, n.ThreeDaysBack), void 0) : (o(s), void 0);
                    }), void 0);
                });
            };
            s(n.TwoWeeksBack, function(o) {
                var a, i = o / 14;
                if (0 > o) a = n.ThreeDaysBack; else if (i >= N) a = n.OneDayBack; else if (3 * i >= N) a = n.ThreeDaysBack; else if (7 * i >= N) a = n.OneWeekBack; else if (14 * i >= N) a = n.TwoWeeksBack; else {
                    if (!(30 * i >= N)) return s(n.NoFilter, function(s) {
                        var o;
                        s > N ? (o = n.OneMonthBack, t.syncKey = "0") : o = n.NoFilter, t._LOG.inferFilterType(o), 
                        e(null, o);
                    }), void 0;
                    a = n.OneMonthBack;
                }
                a !== n.TwoWeeksBack && (t.syncKey = "0"), t._LOG.inferFilterType(a), e(null, a);
            });
        }),
        _enumerateFolderChanges: p(0, function(e, t) {
            var n = this, s = this._storage;
            if (!this.filterType) return this._inferFilterType(function(s, o) {
                return s ? (e("unknown"), void 0) : (console.log("We want a filter of", b[o]), n.folderMeta.filterType = o, 
                n._enumerateFolderChanges(e, t), void 0);
            }), void 0;
            if ("0" === this.syncKey) return this._getSyncKey(this.filterType, function(s) {
                return s ? (e("aborted"), void 0) : (n._enumerateFolderChanges(e, t), void 0);
            }), void 0;
            var o = a.Tags, r = a.Enums;
            i.Tags, i.Enums;
            var c;
            0 === this._account._syncsInProgress++ && this._account._lastSyncKey === this.syncKey && this._account._lastSyncFilterType === this.filterType && this._account._lastSyncResponseWasEmpty ? c = o.Sync : (c = new C.Writer("1.3", 1, "UTF-8"), 
            c.stag(o.Sync).stag(o.Collections).stag(o.Collection), this._account.conn.currentVersion.lt("12.1") && c.tag(o.Class, "Email"), 
            c.tag(o.SyncKey, this.syncKey).tag(o.CollectionId, this.serverId).tag(o.GetChanges).stag(o.Options).tag(o.FilterType, this.filterType), 
            this._account.conn.currentVersion.lte("12.0") && c.tag(o.MIMESupport, r.MIMESupport.Never).tag(o.Truncation, r.MIMETruncation.TruncateAll), 
            c.etag().etag().etag().etag()), this._account.conn.postCommand(c, function(a, i) {
                var c, l = [], d = [], m = [], u = !1;
                if (n._account._syncsInProgress--, a) return console.error("Error syncing folder:", a), 
                n._account._reportErrorIfNecessary(a), e("aborted"), void 0;
                if (n._account._lastSyncKey = n.syncKey, n._account._lastSyncFilterType = n.filterType, 
                !i) return console.log("Sync completed with empty response"), n._account._lastSyncResponseWasEmpty = !0, 
                e(null, l, d, m), void 0;
                n._account._lastSyncResponseWasEmpty = !1;
                var h = new C.EventParser(), p = [ o.Sync, o.Collections, o.Collection ];
                h.addEventListener(p.concat(o.SyncKey), function(e) {
                    n.syncKey = e.children[0].textContent;
                }), h.addEventListener(p.concat(o.Status), function(e) {
                    c = e.children[0].textContent;
                }), h.addEventListener(p.concat(o.MoreAvailable), function() {
                    u = !0;
                }), h.addEventListener(p.concat(o.Commands, [ [ o.Add, o.Change ] ]), function(e) {
                    var t, a;
                    for (var i in Iterator(e.children)) {
                        var r = i[1];
                        switch (r.tag) {
                          case o.ServerId:
                            t = r.children[0].textContent;
                            break;

                          case o.ApplicationData:
                            try {
                                a = n._parseMessage(r, e.tag === o.Add, s);
                            } catch (c) {
                                return console.error("Failed to parse a message:", c, "\n", c.stack), void 0;
                            }
                        }
                    }
                    a.header.srvid = t;
                    var m = e.tag === o.Add ? l : d;
                    m.push(a);
                }), h.addEventListener(p.concat(o.Commands, [ [ o.Delete, o.SoftDelete ] ]), function(e) {
                    var t;
                    for (var n in Iterator(e.children)) {
                        var s = n[1];
                        switch (s.tag) {
                          case o.ServerId:
                            t = s.children[0].textContent;
                        }
                    }
                    m.push(t);
                });
                try {
                    h.run(i);
                } catch (g) {
                    return console.error("Error parsing Sync response:", g, "\n", g.stack), e("unknown"), 
                    void 0;
                }
                c === r.Status.Success ? (console.log("Sync completed: added " + l.length + ", changed " + d.length + ", deleted " + m.length), 
                e(null, l, d, m, u), u && n._enumerateFolderChanges(e, t)) : c === r.Status.InvalidSyncKey ? (console.warn("ActiveSync had a bad sync key"), 
                e("badkey")) : (console.error("Something went wrong during ActiveSync syncing and we got a status of " + c), 
                e("unknown"));
            }, null, null, function(e, n) {
                n || (n = Math.max(1e6, e)), t(.1 + .7 * e / n);
            });
        }, "aborted"),
        _parseMessage: function(e, t, n) {
            var s, a, r, l = c.Tags, d = i.Tags, m = i.Enums;
            if (t) {
                var u = n._issueNewHeaderId();
                s = {
                    id: u,
                    srvid: null,
                    suid: n.folderId + "/" + u,
                    guid: "",
                    author: null,
                    to: null,
                    cc: null,
                    bcc: null,
                    replyTo: null,
                    date: null,
                    flags: [],
                    hasAttachments: !1,
                    subject: null,
                    snippet: null
                }, a = {
                    date: null,
                    size: 0,
                    attachments: [],
                    relatedParts: [],
                    references: null,
                    bodyReps: null
                }, r = function(e, t) {
                    t && s.flags.push(e);
                };
            } else s = {
                flags: [],
                mergeInto: function(e) {
                    for (var t in Iterator(this.flags)) {
                        var n = t[1];
                        if (n[1]) e.flags.push(n[0]); else {
                            var s = e.flags.indexOf(n[0]);
                            -1 !== s && e.flags.splice(s, 1);
                        }
                    }
                    var o = [ "mergeInto", "suid", "srvid", "guid", "id", "flags" ];
                    for (var t in Iterator(this)) {
                        var a = t[0], i = t[1];
                        -1 === o.indexOf(a) && (e[a] = i);
                    }
                }
            }, a = {
                mergeInto: function(e) {
                    for (var t in Iterator(this)) {
                        var n = t[0], s = t[1];
                        "mergeInto" !== n && (e[n] = s);
                    }
                }
            }, r = function(e, t) {
                s.flags.push([ e, t ]);
            };
            var h, p;
            for (var g in Iterator(e.children)) {
                var f = g[1], v = f.children.length ? f.children[0].textContent : null;
                switch (f.tag) {
                  case l.Subject:
                    s.subject = v;
                    break;

                  case l.From:
                    s.author = _.parseAddresses(v)[0] || null;
                    break;

                  case l.To:
                    s.to = _.parseAddresses(v);
                    break;

                  case l.Cc:
                    s.cc = _.parseAddresses(v);
                    break;

                  case l.ReplyTo:
                    s.replyTo = _.parseAddresses(v);
                    break;

                  case l.DateReceived:
                    a.date = s.date = new Date(v).valueOf();
                    break;

                  case l.Read:
                    r("\\Seen", "1" === v);
                    break;

                  case l.Flag:
                    for (var y in Iterator(f.children)) {
                        var b = y[1];
                        b.tag === l.Status && r("\\Flagged", "0" !== b.children[0].textContent);
                    }
                    break;

                  case d.Body:
                    for (var y in Iterator(f.children)) {
                        var b = y[1];
                        switch (b.tag) {
                          case d.Type:
                            var C = b.children[0].textContent;
                            C === m.Type.HTML ? h = "html" : (C !== m.Type.PlainText && console.warn("A message had a strange body type:", C), 
                            h = "plain");
                            break;

                          case d.EstimatedDataSize:
                            p = b.children[0].textContent;
                        }
                    }
                    break;

                  case l.BodySize:
                    h = "plain", p = v;
                    break;

                  case d.Attachments:
                  case l.Attachments:
                    for (var y in Iterator(f.children)) {
                        var E = y[1];
                        if (E.tag === d.Attachment || E.tag === l.Attachment) {
                            var S = {
                                name: null,
                                contentId: null,
                                type: null,
                                part: null,
                                encoding: null,
                                sizeEstimate: null,
                                file: null
                            }, N = !1;
                            for (var I in Iterator(E.children)) {
                                var w, k, A = I[1], B = A.children.length ? A.children[0].textContent : null;
                                switch (A.tag) {
                                  case d.DisplayName:
                                  case l.DisplayName:
                                    S.name = B, w = S.name.lastIndexOf("."), k = w > 0 ? S.name.substring(w + 1).toLowerCase() : "", 
                                    S.type = _.contentTypes[k] || "application/octet-stream";
                                    break;

                                  case d.FileReference:
                                  case l.AttName:
                                    S.part = B;
                                    break;

                                  case d.EstimatedDataSize:
                                  case l.AttSize:
                                    S.sizeEstimate = parseInt(B, 10);
                                    break;

                                  case d.ContentId:
                                    S.contentId = B;
                                    break;

                                  case d.IsInline:
                                    N = "1" === B;
                                    break;

                                  case d.FileReference:
                                  case l.Att0Id:
                                    S.part = A.children[0].textContent;
                                }
                            }
                            N ? a.relatedParts.push(o.makeAttachmentPart(S)) : a.attachments.push(o.makeAttachmentPart(S));
                        }
                    }
                    s.hasAttachments = a.attachments.length > 0;
                }
            }
            return t ? (a.bodyReps = [ o.makeBodyPart({
                type: h,
                sizeEstimate: p,
                amountDownloaded: 0,
                isDownloaded: !1
            }) ], {
                header: o.makeHeaderInfo(s),
                body: o.makeBodyInfo(a)
            }) : {
                header: s,
                body: a
            };
        },
        downloadBodies: function(e, t, n) {
            function s(e) {
                e && !o && (o = e), --a || r._storage.runAfterDeferredCalls(function() {
                    n(o, i - a);
                });
            }
            if (this._account.conn.currentVersion.lt("12.0")) return this._syncBodies(e, n);
            for (var o, a = 1, i = 0, r = this, c = 0; c < e.length; c++) e[c] && null === e[c].snippet && (a++, 
            i++, this.downloadBodyReps(e[c], t, s));
            window.setZeroTimeout(s);
        },
        downloadBodyReps: p(1, function(e, t, n) {
            var s = this, o = this._account;
            if (o.conn.currentVersion.lt("12.0")) return this._syncBodies([ e ], n);
            "function" == typeof t && (n = t, t = null), t = t || {};
            var r = l.Tags, c = l.Enums, d = a.Tags;
            a.Enums;
            var m = i.Tags, u = i.Enums.Type, h = function(a) {
                var i, l = a.bodyReps[0], h = "html" === l.type ? u.HTML : u.PlainText;
                t.maximumBytesToFetch < l.sizeEstimate && (h = u.PlainText, i = S);
                var p = new C.Writer("1.3", 1, "UTF-8");
                p.stag(r.ItemOperations).stag(r.Fetch).tag(r.Store, "Mailbox").tag(d.CollectionId, s.serverId).tag(d.ServerId, e.srvid).stag(r.Options).stag(r.Schema).tag(m.Body).etag().stag(m.BodyPreference).tag(m.Type, h), 
                i && p.tag(m.TruncationSize, i), p.etag().etag().etag().etag(), o.conn.postCommand(p, function(t, l) {
                    if (t) return console.error(t), o._reportErrorIfNecessary(t), n("unknown"), void 0;
                    var d, u, h = new C.EventParser();
                    return h.addEventListener([ r.ItemOperations, r.Status ], function(e) {
                        d = e.children[0].textContent;
                    }), h.addEventListener([ r.ItemOperations, r.Response, r.Fetch, r.Properties, m.Body, m.Data ], function(e) {
                        u = e.children[0].textContent;
                    }), h.run(l), d !== c.Status.Success ? n("unknown") : (s._updateBody(e, a, u, !!i, n), 
                    void 0);
                });
            };
            this._storage.getMessageBody(e.suid, e.date, h);
        }),
        _syncBodies: function(e, t) {
            var n = a.Tags, s = a.Enums, o = c.Tags, i = this, r = this._account, l = new C.Writer("1.3", 1, "UTF-8");
            l.stag(n.Sync).stag(n.Collections).stag(n.Collection).tag(n.Class, "Email").tag(n.SyncKey, this.syncKey).tag(n.CollectionId, this.serverId).stag(n.Options).tag(n.MIMESupport, s.MIMESupport.Never).etag().stag(n.Commands);
            for (var d = 0; d < e.length; d++) l.stag(n.Fetch).tag(n.ServerId, e[d].srvid).etag();
            l.etag().etag().etag().etag(), r.conn.postCommand(l, function(a, c) {
                function l(e) {
                    e && !m && (m = e), --h || i._storage.runAfterDeferredCalls(function() {
                        t(m);
                    });
                }
                if (a) return console.error(a), r._reportErrorIfNecessary(a), t("unknown"), void 0;
                var d, m, u = 0, h = 1, p = new C.EventParser(), g = [ n.Sync, n.Collections, n.Collection ];
                return p.addEventListener(g.concat(n.SyncKey), function(e) {
                    i.syncKey = e.children[0].textContent;
                }), p.addEventListener(g.concat(n.Status), function(e) {
                    d = e.children[0].textContent;
                }), p.addEventListener(g.concat(n.Responses, n.Fetch, n.ApplicationData, o.Body), function(t) {
                    var n = e[u++], s = t.children[0].textContent;
                    h++, i._storage.getMessageBody(n.suid, n.date, function(e) {
                        i._updateBody(n, e, s, !1, l);
                    });
                }), p.run(c), d !== s.Status.Success ? l("unknown") : (l(null), void 0);
            });
        },
        _updateBody: function(e, t, n, s, o) {
            var a = t.bodyReps[0];
            n.length && "\n" === n[n.length - 1] && (n = n.slice(0, -1)), n = n.replace(/\r/g, "");
            var i = s ? "plain" : a.type, r = E.processMessageContent(n, i, !s, !0, this._LOG);
            e.snippet = r.snippet, a.isDownloaded = !s, a.amountDownloaded = n.length, s || (a.content = r.content);
            var c = {
                changeDetails: {
                    bodyReps: [ 0 ]
                }
            };
            this._storage.updateMessageHeader(e.date, e.id, !1, e, t), this._storage.updateMessageBody(e, t, {}, c), 
            this._storage.runAfterDeferredCalls(o.bind(null, null, t));
        },
        sync: p(1, function(e, t, s) {
            var o = this, a = 0, i = 0, r = 0;
            this._LOG.sync_begin(null, null, null), this._enumerateFolderChanges(function(s, c, l, d, m) {
                var u = o._storage;
                if ("badkey" === s) return o._account._recreateFolder(u.folderId, function() {
                    o._storage = null, o._LOG.sync_end(null, null, null);
                }), void 0;
                if (s) return o._LOG.sync_end(null, null, null), t(s), void 0;
                for (var h in Iterator(c)) {
                    var p = h[1];
                    u.hasMessageWithServerId(p.header.srvid) || (u.addMessageHeader(p.header, p.body), 
                    u.addMessageBody(p.header, p.body), a++);
                }
                for (var h in Iterator(l)) {
                    var p = h[1];
                    u.hasMessageWithServerId(p.header.srvid) && (u.updateMessageHeaderByServerId(p.header.srvid, !0, function(e) {
                        return p.header.mergeInto(e), !0;
                    }, null), i++);
                }
                for (var h in Iterator(d)) {
                    var g = h[1];
                    u.hasMessageWithServerId(g) && (u.deleteMessageByServerId(g), r++);
                }
                if (!m) {
                    var f = a + i + r;
                    u.runAfterDeferredCalls(function() {
                        o._LOG.sync_end(a, i, r), u.markSyncRange(n.OLDEST_SYNC_DATE, e, "XXX", e), t(null, null, f);
                    });
                }
            }, s);
        }),
        performMutation: p(1, function(e, t) {
            var n = this, s = a.Tags, o = this._account, i = new C.Writer("1.3", 1, "UTF-8");
            i.stag(s.Sync).stag(s.Collections).stag(s.Collection), o.conn.currentVersion.lt("12.1") && i.tag(s.Class, "Email"), 
            i.tag(s.SyncKey, this.syncKey).tag(s.CollectionId, this.serverId).tag(s.DeletesAsMoves, "trash" === this.folderMeta.type ? "0" : "1").tag(s.GetChanges, "0").stag(s.Commands);
            try {
                e(i);
            } catch (r) {
                return console.error("Exception in performMutation callee:", r, "\n", r.stack), 
                t("unknown"), void 0;
            }
            i.etag(s.Commands).etag(s.Collection).etag(s.Collections).etag(s.Sync), o.conn.postCommand(i, function(e, i) {
                if (e) return console.error("postCommand error:", e), o._reportErrorIfNecessary(e), 
                t("unknown"), void 0;
                var r, c, l = new C.EventParser(), d = [ s.Sync, s.Collections, s.Collection ];
                l.addEventListener(d.concat(s.SyncKey), function(e) {
                    r = e.children[0].textContent;
                }), l.addEventListener(d.concat(s.Status), function(e) {
                    c = e.children[0].textContent;
                });
                try {
                    l.run(i);
                } catch (m) {
                    return console.error("Error parsing Sync response:", m, "\n", m.stack), t("unknown"), 
                    void 0;
                }
                c === a.Enums.Status.Success ? (n.syncKey = r, t && t(null)) : (console.error("Something went wrong during ActiveSync syncing and we got a status of " + c), 
                t("status:" + c));
            });
        }),
        downloadMessageAttachments: p(2, function(e, t, n) {
            var s = this, o = l.Tags, a = l.Enums.Status, r = i.Tags, c = new C.Writer("1.3", 1, "UTF-8");
            c.stag(o.ItemOperations);
            for (var d in Iterator(t)) {
                var m = d[1];
                c.stag(o.Fetch).tag(o.Store, "Mailbox").tag(r.FileReference, m.part).etag();
            }
            c.etag(), this._account.conn.postCommand(c, function(e, i) {
                if (e) return console.error("postCommand error:", e), s._account._reportErrorIfNecessary(e), 
                n("unknown"), void 0;
                var c, l = {}, d = new C.EventParser();
                d.addEventListener([ o.ItemOperations, o.Status ], function(e) {
                    c = e.children[0].textContent;
                }), d.addEventListener([ o.ItemOperations, o.Response, o.Fetch ], function(e) {
                    var t = null, n = {};
                    for (var s in Iterator(e.children)) {
                        var a = s[1];
                        switch (a.tag) {
                          case o.Status:
                            n.status = a.children[0].textContent;
                            break;

                          case r.FileReference:
                            t = a.children[0].textContent;
                            break;

                          case o.Properties:
                            var i = null, c = null;
                            for (var d in Iterator(a.children)) {
                                var m = d[1], u = m.children[0].textContent;
                                switch (m.tag) {
                                  case r.ContentType:
                                    i = u;
                                    break;

                                  case o.Data:
                                    c = new Buffer(u, "base64");
                                }
                            }
                            i && c && (n.data = new Blob([ c ], {
                                type: i
                            }));
                        }
                        t && (l[t] = n);
                    }
                }), d.run(i);
                var m = c !== a.Success ? "unknown" : null, u = [];
                for (var h in Iterator(t)) {
                    var p = h[1];
                    l.hasOwnProperty(p.part) && l[p.part].status === a.Success ? u.push(l[p.part].data) : (m = "unknown", 
                    u.push(null));
                }
                n(m, u);
            });
        })
    }, u.ActiveSyncFolderSyncer = f, f.prototype = {
        get syncable() {
            return null !== this.folderConn.serverId;
        },
        get canGrowSync() {
            return !1;
        },
        initialSync: function(e, n, s, o, a) {
            s("sync", !0), this.folderConn.sync(t.NOW(), this.onSyncCompleted.bind(this, o, !0), a);
        },
        refreshSync: function(e, n, s, o, a, i, r) {
            this.folderConn.sync(t.NOW(), this.onSyncCompleted.bind(this, i, !1), r);
        },
        growSync: function() {
            return !1;
        },
        onSyncCompleted: function(e, t, s, o, a) {
            var i = this.folderStorage;
            return console.log("Sync Completed!", a, "messages synced"), s || i.markSyncedToDawnOfTime(), 
            this._account.__checkpointSyncCompleted(), s ? (e(s), void 0) : (t ? (i._curSyncSlice.ignoreHeaders = !1, 
            i._curSyncSlice.waitingOnData = "db", i.getMessagesInImapDateRange(0, null, n.INITIAL_FILL_SIZE, n.INITIAL_FILL_SIZE, i.onFetchDBHeaders.bind(i, i._curSyncSlice, !1, e, null))) : e(s), 
            void 0);
        },
        allConsumersDead: function() {},
        shutdown: function() {
            this.folderConn.shutdown(), this._LOG.__die();
        }
    };
    var I = u.LOGFAB = e.register(d, {
        ActiveSyncFolderConn: {
            type: e.CONNECTION,
            subtype: e.CLIENT,
            events: {
                inferFilterType: {
                    filterType: !1
                }
            },
            asyncJobs: {
                sync: {
                    newMessages: !0,
                    changedMessages: !0,
                    deletedMessages: !0
                }
            },
            errors: {
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
                }
            }
        },
        ActiveSyncFolderSyncer: {
            type: e.DATABASE,
            events: {}
        }
    });
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Move", [], t) : e.ASCPMove = t();
}(this, function() {
    return {
        Tags: {
            MoveItems: 1285,
            Move: 1286,
            SrcMsgId: 1287,
            SrcFldId: 1288,
            DstFldId: 1289,
            Response: 1290,
            Status: 1291,
            DstMsgId: 1292
        },
        Enums: {
            Status: {
                InvalidSourceID: "1",
                InvalidDestID: "2",
                Success: "3",
                SourceIsDest: "4",
                MoveFailure: "5",
                ItemLocked: "7"
            }
        }
    };
}), define("mailapi/activesync/jobs", [ "rdcommon/log", "mix", "../jobmixins", "mailapi/drafts/jobs", "activesync/codepages/AirSync", "activesync/codepages/Email", "activesync/codepages/Move", "module", "require", "exports" ], function(e, t, n, s, o, a, i, r, c, l) {
    function d(e, t, n) {
        return function() {
            var s = Array.slice(arguments), o = s[e], a = this;
            c([ "wbxml" ], function(e) {
                u || (u = e), a.account.withConnection(o, function() {
                    t.apply(a, s);
                }, n);
            });
        };
    }
    function m(e, t, n) {
        this.account = e, this.resilientServerIds = !0, this._heldMutexReleasers = [], this._LOG = h.ActiveSyncJobDriver(this, n, this.account.id), 
        this._state = t, t.hasOwnProperty("suidToServerId") || (t.suidToServerId = {}, t.moveMap = {}), 
        this._stateDelta = {
            serverIdMap: null,
            moveMap: null
        };
    }
    var u;
    l.ActiveSyncJobDriver = m, m.prototype = {
        postJobCleanup: n.postJobCleanup,
        allJobsDone: n.allJobsDone,
        _accessFolderForMutation: function(e, t, n, s, o) {
            var a = this.account.getFolderStorageForFolderId(e), i = this;
            a.runMutexed(o, function(e) {
                i._heldMutexReleasers.push(e);
                var s = a.folderSyncer;
                if (t) i.account.withConnection(n, function() {
                    try {
                        n(s.folderConn, a);
                    } catch (e) {
                        i._LOG.callbackErr(e);
                    }
                }); else try {
                    n(s.folderConn, a);
                } catch (o) {
                    i._LOG.callbackErr(o);
                }
            });
        },
        _partitionAndAccessFoldersSequentially: n._partitionAndAccessFoldersSequentially,
        local_do_modtags: n.local_do_modtags,
        do_modtags: d(1, function(e, t, n) {
            function s(e) {
                return i && -1 !== i.indexOf(e) ? !0 : r && -1 !== r.indexOf(e) ? !1 : void 0;
            }
            var i = n ? e.removeTags : e.addTags, r = n ? e.addTags : e.removeTags, c = s("\\Seen"), l = s("\\Flagged"), d = o.Tags, m = a.Tags, u = null;
            this._partitionAndAccessFoldersSequentially(e.messages, !0, function(e, t, n, s, o) {
                return n = n.filter(function(e) {
                    return !!e;
                }), n.length ? (e.performMutation(function(e) {
                    for (var t = 0; t < n.length; t++) e.stag(d.Change).tag(d.ServerId, n[t]).stag(d.ApplicationData), 
                    void 0 !== c && e.tag(m.Read, c ? "1" : "0"), void 0 !== l && e.stag(m.Flag).tag(m.Status, l ? "2" : "0").etag(), 
                    e.etag(d.ApplicationData).etag(d.Change);
                }, function(e) {
                    e && (u = e), o();
                }), void 0) : (o(), void 0);
            }, function() {
                t(u);
            }, function() {
                u = "aborted-retry";
            }, n, "modtags");
        }),
        check_modtags: function(e, t) {
            t(null, "idempotent");
        },
        local_undo_modtags: n.local_undo_modtags,
        undo_modtags: function(e, t) {
            this.do_modtags(e, t, !0);
        },
        local_do_move: n.local_do_move,
        do_move: d(1, function(e, t) {
            var n = null, s = this.account, o = this.account.getFolderStorageForFolderId(e.targetFolder), a = i.Tags;
            this._partitionAndAccessFoldersSequentially(e.messages, !0, function(e, t, i, r, c) {
                if (i = i.filter(function(e) {
                    return !!e;
                }), !i.length) return c(), void 0;
                if (i = i.filter(function(e) {
                    return !!e;
                }), !i.length) return c(), void 0;
                var l = new u.Writer("1.3", 1, "UTF-8");
                l.stag(a.MoveItems);
                for (var d = 0; d < i.length; d++) l.stag(a.Move).tag(a.SrcMsgId, i[d]).tag(a.SrcFldId, t.folderMeta.serverId).tag(a.DstFldId, o.folderMeta.serverId).etag(a.Move);
                l.etag(a.MoveItems), s.conn.postCommand(l, function(e) {
                    e && (n = e, console.error("failure moving messages:", e)), c();
                });
            }, function() {
                t(n, null, !0);
            }, function() {
                n = "aborted-retry";
            }, !1, "move");
        }),
        check_move: function() {},
        local_undo_move: n.local_undo_move,
        undo_move: function() {},
        local_do_delete: n.local_do_delete,
        do_delete: d(1, function(e, t) {
            var n = null, s = o.Tags;
            a.Tags, this._partitionAndAccessFoldersSequentially(e.messages, !0, function(e, t, o, a, i) {
                return o = o.filter(function(e) {
                    return !!e;
                }), o.length ? (e.performMutation(function(e) {
                    for (var t = 0; t < o.length; t++) e.stag(s.Delete).tag(s.ServerId, o[t]).etag(s.Delete);
                }, function(e) {
                    e && (n = e, console.error("failure deleting messages:", e)), i();
                }), void 0) : (i(), void 0);
            }, function() {
                t(n, null, !0);
            }, function() {
                n = "aborted-retry";
            }, !1, "delete");
        }),
        check_delete: function(e, t) {
            t(null, "idempotent");
        },
        local_undo_delete: n.local_undo_delete,
        undo_delete: function(e, t) {
            t("moot");
        },
        local_do_syncFolderList: function(e, t) {
            t(null);
        },
        do_syncFolderList: d(1, function(e, t) {
            var n, s = this.account, o = s.getFirstFolderWithType("inbox");
            o && null === o.serverId && (n = s.getFolderStorageForFolderId(o.id)), s.syncFolderList(function(e) {
                e || (s.meta.lastFolderSyncAt = Date.now()), t(e ? "aborted-retry" : null, null, !e), 
                n && n.hasActiveSlices && (e || (console.log("Refreshing fake inbox"), n.resetAndRefreshActiveSlices()));
            });
        }, "aborted-retry"),
        check_syncFolderList: function(e, t) {
            t("idempotent");
        },
        local_undo_syncFolderList: function(e, t) {
            t("moot");
        },
        undo_syncFolderList: function(e, t) {
            t("moot");
        },
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
        local_do_purgeExcessMessages: function(e, t) {
            t(null);
        },
        do_purgeExcessMessages: function(e, t) {
            t(null);
        },
        check_purgeExcessMessages: function() {
            return "idempotent";
        },
        local_undo_purgeExcessMessages: function(e, t) {
            t(null);
        },
        undo_purgeExcessMessages: function(e, t) {
            t(null);
        }
    }, t(m.prototype, s.draftsMixins);
    var h = l.LOGFAB = e.register(r, {
        ActiveSyncJobDriver: {
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
            errors: {
                callbackErr: {
                    ex: e.EXCEPTION
                }
            }
        }
    });
}), define("mailapi/activesync/account", [ "rdcommon/log", "../a64", "../accountmixins", "../mailslice", "../searchfilter", "activesync/codepages/FolderHierarchy", "./folder", "./jobs", "../util", "module", "require", "exports" ], function(e, t, n, s, o, a, i, r, c, l, d, m) {
    function u(e, t, n) {
        return function() {
            var s = Array.slice(arguments), o = s[e], a = this;
            this.withConnection(o, function() {
                t.apply(a, s);
            }, n);
        };
    }
    function h(e, t, n, o, c, l) {
        this.universe = e, this.id = t.id, this.accountDef = t, this._db = o, this._LOG = b.ActiveSyncAccount(this, l, this.id), 
        c ? (this.conn = c, this._attachLoggerToConnection(this.conn)) : this.conn = null, 
        this.enabled = !0, this.problems = [], this._alive = !0, this.identities = t.identities, 
        this.folders = [], this._folderStorages = {}, this._folderInfos = n, this._serverIdToFolderId = {}, 
        this._deadFolderIds = null, this._syncsInProgress = 0, this._lastSyncKey = null, 
        this._lastSyncResponseWasEmpty = !1, this.meta = n.$meta, this.mutations = n.$mutations, 
        this.tzOffset = 0;
        for (var d in n) if ("$" !== d[0]) {
            var m = n[d];
            this._folderStorages[d] = new s.FolderStorage(this, d, m, this._db, i.ActiveSyncFolderSyncer, this._LOG), 
            this._serverIdToFolderId[m.$meta.serverId] = d, this.folders.push(m.$meta);
        }
        this.folders.sort(function(e, t) {
            return e.path.localeCompare(t.path);
        }), this._jobDriver = new r.ActiveSyncJobDriver(this, this._folderInfos.$mutationState);
        var u = this.getFirstFolderWithType("inbox");
        u || this._addedFolder(null, "0", "Inbox", a.Enums.Type.DefaultInbox, null, !0);
    }
    var p, g, f, v = c.bsearchForInsert, y = m.DEFAULT_TIMEOUT_MS = 3e4;
    m.Account = m.ActiveSyncAccount = h, h.prototype = {
        type: "activesync",
        supportsServerFolders: !0,
        toString: function() {
            return "[ActiveSyncAccount: " + this.id + "]";
        },
        withConnection: function(e, t, n) {
            if (!p) return d([ "wbxml", "activesync/protocol", "activesync/codepages" ], function(s, o, a) {
                p = s, g = o, f = a, this.withConnection(e, t, n);
            }.bind(this)), void 0;
            if (!this.conn) {
                var s = this.accountDef;
                this.conn = new g.Connection(), this._attachLoggerToConnection(this.conn), this.conn.open(s.connInfo.server, s.credentials.username, s.credentials.password), 
                this.conn.timeout = y;
            }
            this.conn.connected ? t() : this.conn.connect(function(s) {
                return s ? (this._reportErrorIfNecessary(s), this._isBadUserOrPassError(s) && !n && (n = "bad-user-or-pass"), 
                e(n || "unknown"), void 0) : (t(), void 0);
            }.bind(this));
        },
        _isBadUserOrPassError: function(e) {
            return e && e instanceof g.HttpError && 401 === e.status;
        },
        _reportErrorIfNecessary: function(e) {
            e && this._isBadUserOrPassError(e) && this.universe.__reportAccountProblem(this, "bad-user-or-pass", "incoming");
        },
        _attachLoggerToConnection: function(e) {
            var t = b.ActiveSyncConnection(e, this._LOG, Date.now() % 1e3);
            "safe" === t.logLevel ? e.onmessage = this._onmessage_safe.bind(this, t) : "dangerous" === t.logLevel && (e.onmessage = this._onmessage_dangerous.bind(this, t));
        },
        _onmessage_safe: function(e, t, n, s, o, a, i, r) {
            "options" === t ? e.options(n, s.status, r) : e.command(t, n, s.status);
        },
        _onmessage_dangerous: function(e, t, n, s, o, a, i, r) {
            if ("options" === t) e.options(n, s.status, r); else {
                var c, l;
                if (i) try {
                    var d = new p.Reader(new Uint8Array(i), f);
                    c = d.dump();
                } catch (m) {
                    c = "parse problem";
                }
                if (r) try {
                    l = r.dump(), r.rewind();
                } catch (m) {
                    l = "parse problem";
                }
                e.command(t, n, s.status, o, a, c, l);
            }
        },
        toBridgeWire: function() {
            return {
                id: this.accountDef.id,
                name: this.accountDef.name,
                path: this.accountDef.name,
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
                    type: this.accountDef.type,
                    connInfo: this.accountDef.connInfo
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
        get numActiveConns() {
            return 0;
        },
        checkAccount: function(e) {
            null != this.conn && (this.conn.connected && this.conn.disconnect(), this.conn = null), 
            this.withConnection(function(t) {
                e(t);
            }, function() {
                e();
            });
        },
        __checkpointSyncCompleted: function() {
            this.saveAccountState(null, null, "checkpointSync");
        },
        shutdown: function(e) {
            this._LOG.__die(), e && e();
        },
        accountDeleted: function() {
            this._alive = !1, this.shutdown();
        },
        sliceFolderMessages: function(e, t) {
            var n = this._folderStorages[e], o = new s.MailSlice(t, n, this._LOG);
            n.sliceOpenMostRecent(o);
        },
        searchFolderMessages: function(e, t, n, s) {
            var a = this._folderStorages[e], i = new o.SearchSlice(t, a, n, s, this._LOG);
            return a.sliceOpenSearch(i), i;
        },
        syncFolderList: u(0, function(e) {
            var t = this, n = f.FolderHierarchy.Tags, s = new p.Writer("1.3", 1, "UTF-8");
            s.stag(n.FolderSync).tag(n.SyncKey, this.meta.syncKey).etag(), this.conn.postCommand(s, function(s, o) {
                if (s) return t._reportErrorIfNecessary(s), e(s), void 0;
                var a = new p.EventParser(), i = [];
                a.addEventListener([ n.FolderSync, n.SyncKey ], function(e) {
                    t.meta.syncKey = e.children[0].textContent;
                }), a.addEventListener([ n.FolderSync, n.Changes, [ n.Add, n.Delete ] ], function(e) {
                    var s = {};
                    for (var o in Iterator(e.children)) {
                        var a = o[1];
                        s[a.localTagName] = a.children[0].textContent;
                    }
                    e.tag === n.Add ? t._addedFolder(s.ServerId, s.ParentId, s.DisplayName, s.Type) || i.push(s) : t._deletedFolder(s.ServerId);
                });
                try {
                    a.run(o);
                } catch (r) {
                    return console.error("Error parsing FolderSync response:", r, "\n", r.stack), e("unknown"), 
                    void 0;
                }
                for (;i.length; ) {
                    var c = [];
                    for (var l in Iterator(i)) {
                        var d = l[1];
                        t._addedFolder(d.ServerId, d.ParentId, d.DisplayName, d.Type) || c.push(d);
                    }
                    if (c.length === i.length) throw new Error("got some orphaned folders");
                    i = c;
                }
                var m = t.getFirstFolderWithType("localdrafts");
                if (!m) {
                    var u, h = t.getFirstFolderWithType("drafts") || t.getFirstFolderWithType("sent");
                    u = h ? h.parentId ? t._folderInfos[h.parentId].$meta.serverId : "0" : t.getFirstFolderWithType("inbox").serverId, 
                    t._addedFolder(null, u, "localdrafts", null, "localdrafts");
                }
                console.log("Synced folder list"), e && e(null);
            });
        }),
        _folderTypes: {
            1: "normal",
            2: "inbox",
            3: "drafts",
            4: "trash",
            5: "sent",
            6: "normal",
            12: "normal"
        },
        _addedFolder: function(e, n, o, r, c, l) {
            if (!(c || r in this._folderTypes)) return !0;
            var d = a.Enums.Type, m = o, u = null, h = 0;
            if ("0" !== n) {
                if (u = this._serverIdToFolderId[n], void 0 === u) return null;
                var p = this._folderInfos[u];
                m = p.$meta.path + "/" + m, h = p.$meta.depth + 1;
            }
            if (r === d.DefaultInbox) {
                var g = this.getFirstFolderWithType("inbox");
                if (g) return delete this._serverIdToFolderId[g.serverId], this._serverIdToFolderId[e] = g.id, 
                g.serverId = e, g.name = o, g.path = m, g.depth = h, g;
            }
            var f = this.id + "/" + t.encodeInt(this.meta.nextFolderNum++), y = this._folderInfos[f] = {
                $meta: {
                    id: f,
                    serverId: e,
                    name: o,
                    type: c || this._folderTypes[r],
                    path: m,
                    parentId: u,
                    depth: h,
                    lastSyncedAt: 0,
                    syncKey: "0"
                },
                $impl: {
                    nextId: 0,
                    nextHeaderBlock: 0,
                    nextBodyBlock: 0
                },
                accuracy: [],
                headerBlocks: [],
                bodyBlocks: [],
                serverIdHeaderBlockMapping: {}
            };
            console.log("Added folder " + o + " (" + f + ")"), this._folderStorages[f] = new s.FolderStorage(this, f, y, this._db, i.ActiveSyncFolderSyncer, this._LOG), 
            this._serverIdToFolderId[e] = f;
            var b = y.$meta, C = v(this.folders, b, function(e, t) {
                return e.path.localeCompare(t.path);
            });
            return this.folders.splice(C, 0, b), l || this.universe.__notifyAddedFolder(this, b), 
            b;
        },
        _deletedFolder: function(e, t) {
            var n = this._serverIdToFolderId[e], s = this._folderInfos[n], o = s.$meta;
            console.log("Deleted folder " + o.name + " (" + n + ")"), delete this._serverIdToFolderId[e], 
            delete this._folderInfos[n], delete this._folderStorages[n];
            var a = this.folders.indexOf(o);
            this.folders.splice(a, 1), null === this._deadFolderIds && (this._deadFolderIds = []), 
            this._deadFolderIds.push(n), t || this.universe.__notifyRemovedFolder(this, o);
        },
        _recreateFolder: function(e, t) {
            this._LOG.recreateFolder(e);
            var n = this._folderInfos[e];
            n.$impl = {
                nextId: 0,
                nextHeaderBlock: 0,
                nextBodyBlock: 0
            }, n.accuracy = [], n.headerBlocks = [], n.bodyBlocks = [], n.serverIdHeaderBlockMapping = {}, 
            null === this._deadFolderIds && (this._deadFolderIds = []), this._deadFolderIds.push(e);
            var o = this;
            this.saveAccountState(null, function() {
                var a = new s.FolderStorage(o, e, n, o._db, i.ActiveSyncFolderSyncer, o._LOG);
                for (var r in Iterator(o._folderStorages[e]._slices)) {
                    var c = r[1];
                    c._storage = a, c.reset(), a.sliceOpenMostRecent(c);
                }
                o._folderStorages[e]._slices = [], o._folderStorages[e] = a, t(a);
            }, "recreateFolder");
        },
        createFolder: u(3, function(e, t, n, s) {
            var o = this, a = e ? this._folderInfos[e] : "0", i = f.FolderHierarchy.Tags, r = f.FolderHierarchy.Enums.Status, c = f.FolderHierarchy.Enums.Type.Mail, l = new p.Writer("1.3", 1, "UTF-8");
            l.stag(i.FolderCreate).tag(i.SyncKey, this.meta.syncKey).tag(i.ParentId, a).tag(i.DisplayName, t).tag(i.Type, c).etag(), 
            this.conn.postCommand(l, function(e, n) {
                o._reportErrorIfNecessary(e);
                var l, d, m = new p.EventParser();
                m.addEventListener([ i.FolderCreate, i.Status ], function(e) {
                    l = e.children[0].textContent;
                }), m.addEventListener([ i.FolderCreate, i.SyncKey ], function(e) {
                    o.meta.syncKey = e.children[0].textContent;
                }), m.addEventListener([ i.FolderCreate, i.ServerId ], function(e) {
                    d = e.children[0].textContent;
                });
                try {
                    m.run(n);
                } catch (u) {
                    return console.error("Error parsing FolderCreate response:", u, "\n", u.stack), 
                    s("unknown"), void 0;
                }
                if (l === r.Success) {
                    var h = o._addedFolder(d, a, t, c);
                    s(null, h);
                } else l === r.FolderExists ? s("already-exists") : s("unknown");
            });
        }),
        deleteFolder: u(1, function(e, t) {
            var n = this, s = this._folderInfos[e].$meta, o = f.FolderHierarchy.Tags, a = f.FolderHierarchy.Enums.Status;
            f.FolderHierarchy.Enums.Type.Mail;
            var i = new p.Writer("1.3", 1, "UTF-8");
            i.stag(o.FolderDelete).tag(o.SyncKey, this.meta.syncKey).tag(o.ServerId, s.serverId).etag(), 
            this.conn.postCommand(i, function(e, i) {
                n._reportErrorIfNecessary(e);
                var r, c = new p.EventParser();
                c.addEventListener([ o.FolderDelete, o.Status ], function(e) {
                    r = e.children[0].textContent;
                }), c.addEventListener([ o.FolderDelete, o.SyncKey ], function(e) {
                    n.meta.syncKey = e.children[0].textContent;
                });
                try {
                    c.run(i);
                } catch (l) {
                    return console.error("Error parsing FolderDelete response:", l, "\n", l.stack), 
                    t("unknown"), void 0;
                }
                r === a.Success ? (n._deletedFolder(s.serverId), t(null, s)) : t("unknown");
            });
        }),
        sendMessage: u(1, function(e, t) {
            var n = this;
            e.withMessageBlob({
                includeBcc: !0
            }, function(e) {
                if (this.conn.currentVersion.gte("14.0")) {
                    var s = f.ComposeMail.Tags, o = new p.Writer("1.3", 1, "UTF-8", null, "blob");
                    o.stag(s.SendMail).tag(s.ClientId, Date.now().toString() + "@mozgaia").tag(s.SaveInSentItems).stag(s.Mime).opaque(e).etag().etag(), 
                    this.conn.postCommand(o, function(e, s) {
                        return e ? (n._reportErrorIfNecessary(e), console.error(e), t("unknown"), void 0) : (null === s ? (console.log("Sent message successfully!"), 
                        t(null)) : (console.error("Error sending message. XML dump follows:\n" + s.dump()), 
                        t("unknown")), void 0);
                    });
                } else this.conn.postData("SendMail", "message/rfc822", e, function(e) {
                    return e ? (n._reportErrorIfNecessary(e), console.error(e), t("unknown"), void 0) : (console.log("Sent message successfully!"), 
                    t(null), void 0);
                }, {
                    SaveInSent: "T"
                });
            }.bind(this));
        }),
        getFolderStorageForFolderId: function(e) {
            return this._folderStorages[e];
        },
        getFolderStorageForServerId: function(e) {
            return this._folderStorages[this._serverIdToFolderId[e]];
        },
        getFolderMetaForFolderId: function(e) {
            return this._folderInfos.hasOwnProperty(e) ? this._folderInfos[e].$meta : null;
        },
        ensureEssentialFolders: function(e) {
            e && e();
        },
        scheduleMessagePurge: function(e, t) {
            t && t();
        },
        runOp: n.runOp,
        getFirstFolderWithType: n.getFirstFolderWithType,
        getFolderByPath: n.getFolderByPath,
        saveAccountState: n.saveAccountState,
        runAfterSaves: n.runAfterSaves
    };
    var b = m.LOGFAB = e.register(l, {
        ActiveSyncAccount: {
            type: e.ACCOUNT,
            events: {
                createFolder: {},
                deleteFolder: {},
                recreateFolder: {
                    id: !1
                },
                saveAccountState: {
                    reason: !1
                },
                accountDeleted: {
                    where: !1
                }
            },
            asyncJobs: {
                runOp: {
                    mode: !0,
                    type: !0,
                    error: !1,
                    op: !1
                }
            },
            errors: {
                opError: {
                    mode: !1,
                    type: !1,
                    ex: e.EXCEPTION
                }
            }
        },
        ActiveSyncConnection: {
            type: e.CONNECTION,
            events: {
                options: {
                    special: !1,
                    status: !1,
                    result: !1
                },
                command: {
                    name: !1,
                    special: !1,
                    status: !1
                }
            },
            TEST_ONLY_events: {
                options: {},
                command: {
                    params: !1,
                    extraHeaders: !1,
                    sent: !1,
                    response: !1
                }
            }
        }
    });
}), define("mailapi/activesync/configurator", [ "rdcommon/log", "../accountcommon", "../a64", "./account", "../date", "require", "exports" ], function(e, t, n, s, o, a, i) {
    function r(e, t) {
        var n = /^https:\/\/([^:\/]+)(?::(\d+))?/.exec(e);
        if (!n) return t(null), void 0;
        var s = n[2] ? parseInt(n[2], 10) : 443, o = n[1];
        console.log("checking", o, s, "for security problem"), a([ "tls" ], function(e) {
            function n(e) {
                if (a) {
                    var n = a;
                    a = null;
                    try {
                        n.end();
                    } catch (s) {}
                    t(e);
                }
            }
            var a = e.connect(s, o);
            a.on("connect", function() {
                a.write(new Buffer("GET /images/logo.png HTTP/1.1\n\n"));
            }), a.on("error", function(e) {
                var t = null;
                e && "object" == typeof e && /^Security/.test(e.name) && (t = "bad-security"), n(t);
            }), a.on("data", function() {
                n(null);
            });
        });
    }
    i.account = s, i.configurator = {
        tryToCreateAccount: function(e, t, i, c) {
            a([ "activesync/protocol" ], function(a) {
                var l = {
                    username: i.incoming.username,
                    password: t.password
                }, d = this, m = new a.Connection();
                m.open(i.incoming.server, l.username, l.password), m.timeout = s.DEFAULT_TIMEOUT_MS, 
                m.connect(function(s) {
                    if (s) {
                        var u, h = {
                            server: i.incoming.server
                        };
                        return s instanceof a.HttpError ? (401 === s.status ? u = "bad-user-or-pass" : 403 === s.status ? u = "not-authorized" : (u = "server-problem", 
                        h.status = s.status), c(u, null, h), void 0) : (r(i.incoming.server, function(e) {
                            var t;
                            t = e ? "bad-security" : "unresponsive-server", c(t, null, h);
                        }), void 0);
                    }
                    var p = n.encodeInt(e.config.nextAccountNum++), g = {
                        id: p,
                        name: t.accountName || t.emailAddress,
                        defaultPriority: o.NOW(),
                        type: "activesync",
                        syncRange: "auto",
                        syncInterval: t.syncInterval || 0,
                        notifyOnNew: t.hasOwnProperty("notifyOnNew") ? t.notifyOnNew : !0,
                        credentials: l,
                        connInfo: {
                            server: i.incoming.server
                        },
                        identities: [ {
                            id: p + "/" + n.encodeInt(e.config.nextIdentityNum++),
                            name: t.displayName || i.displayName,
                            address: t.emailAddress,
                            replyTo: null,
                            signature: null
                        } ]
                    };
                    d._loadAccount(e, g, m, function(e) {
                        c(null, e, null);
                    });
                });
            }.bind(this));
        },
        recreateAccount: function(e, s, o, a) {
            var i = o.def, r = {
                username: i.credentials.username,
                password: i.credentials.password
            }, c = n.encodeInt(e.config.nextAccountNum++), l = {
                id: c,
                name: i.name,
                type: "activesync",
                syncRange: i.syncRange,
                syncInterval: i.syncInterval || 0,
                notifyOnNew: i.hasOwnProperty("notifyOnNew") ? i.notifyOnNew : !0,
                credentials: r,
                connInfo: {
                    server: i.connInfo.server
                },
                identities: t.recreateIdentities(e, c, i.identities)
            };
            this._loadAccount(e, l, null, function(e) {
                a(null, e, null);
            });
        },
        _loadAccount: function(e, t, n, s) {
            var o = {
                $meta: {
                    nextFolderNum: 0,
                    nextMutationNum: 0,
                    lastFolderSyncAt: 0,
                    syncKey: "0"
                },
                $mutations: [],
                $mutationState: {}
            };
            e.saveAccountDef(t, o), e._loadAccount(t, o, n, s);
        }
    };
});