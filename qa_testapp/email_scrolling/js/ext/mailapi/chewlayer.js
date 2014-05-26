define("mailapi/quotechew", [ "exports" ], function(e) {
    function t(e, t, n, s) {
        var o = e.indexOf(t, n);
        return -1 === o ? s : o;
    }
    function n(e, t, n) {
        for (var s = t - 1, o = 0; ;) {
            if (s = e.indexOf(A, s + 1), -1 === s || s >= n) return o;
            o++;
        }
        return null;
    }
    function s(e, t) {
        return e.charCodeAt(0) === v ? B[t] : k[t];
    }
    function o(e, t) {
        var n = D[t], s = M[t];
        return e.replace(I, function(t, o) {
            return e.charCodeAt(o + 1) === v ? s : n;
        });
    }
    var a = 1, i = 2, r = 3, c = 4, l = 20, d = 5, u = 6, m = 7, h = 8, p = ">".charCodeAt(0), f = " ".charCodeAt(0), g = " ".charCodeAt(0), v = "\n".charCodeAt(0), y = /^[_-]{6,}$/, b = /mailing list$/, _ = /wrote/, C = /^-- $/, S = 20, E = /^(?:Sent from (?:Mobile|my .+))$/, w = /^(?:This message|Este mensaje)/, A = "\n", I = /\n/g;
    e.quoteProcessTextBody = function(e) {
        function s() {
            for (var e = 1, t = 1, n = !0, s = 1; s < A.length; s++) {
                var o = A.charCodeAt(s);
                if (o === p) e++, t++, n = !0; else {
                    if (o !== f) break;
                    if (!n) break;
                    t++, n = !1;
                }
            }
            return t && (A = A.substring(t)), e;
        }
        function o(e) {
            function t(t, o) {
                for (var a = e.substring(s, r), i = s - 1; e.charCodeAt(i - 1) === v; ) i--;
                var d = e.substring(0, i), u = n(e, d.length, s - 1);
                e = d, r = e.length, o ? (N[_] = (255 & u) << 8 | 255 & N[_], N[_ + 1] = a + "\n" + N[_ + 1]) : N.splice(_, 0, (255 & u) << 8 | t, a), 
                l = !1, c = S, h = null, p = s;
            }
            var s, o, a, r = e.length, c = S, l = !1, h = null, p = null, f = !1, _ = N.length;
            for (s = e.lastIndexOf("\n") + 1, o = e.length; o > 0 && c; o = s - 1, s = e.lastIndexOf("\n", o - 1) + 1, 
            c--) if (a = e.substring(s, o), a.length && (1 !== a.length || a.charCodeAt(0) !== g)) if (C.test(a)) o + 1 === p ? t(null, !0) : t(i); else {
                if (y.test(a)) {
                    if (h) {
                        if (w.test(h)) {
                            t(d);
                            continue;
                        }
                        if (b.test(h)) {
                            t(u);
                            continue;
                        }
                    }
                    return e;
                }
                if (!l) {
                    if (!f && E.test(a)) {
                        t(m), f = !0;
                        continue;
                    }
                    l = !0;
                }
                h = a;
            }
            return e;
        }
        function c(t, s, i) {
            if (null === k) P && (N.length && P--, N.push((255 & P) << 8 | a), N.push("")); else {
                void 0 === s && (s = I);
                var r = e.substring(k, D), c = i ? 1 : 0;
                D + 1 !== s && (c += n(e, D + 1, s)), N.push((255 & P) << 8 | (255 & c) << 16 | a);
                var l = N.push(r) - 1;
                if (t) {
                    var d = o(r);
                    if (r.length !== d.length) {
                        if (c) {
                            var u = N.length - 2;
                            N[u] = (255 & c) << 16 | N[u], N[l - 1] = (255 & P) << 8 | a;
                        }
                        if (d.length) N[l] = d; else {
                            if (P) {
                                var m = 255 & N[l + 1] >> 8;
                                m += P, N[l + 1] = (255 & m) << 8 | 4294902015 & N[l + 1];
                            }
                            N.splice(l - 1, 2);
                        }
                    }
                }
            }
            P = 0, k = null, B = null, D = null, M = null;
        }
        function h(e) {
            for (var t = 0; F.length && !F[F.length - 1]; ) F.pop(), t++;
            N.push((255 & t) << 24 | (255 & O) << 16 | L - 1 << 8 | l), N.push(F.join("\n")), 
            L = e, F = L ? [] : null, O = 0, R = !0;
        }
        var A, I, T, N = [], x = e.length, k = null, B = null, D = null, M = null, L = 0, F = null, R = !1, P = 0, O = 0;
        for (I = 0, T = t(e, "\n", I, e.length); x > I; I = T + 1, T = t(e, "\n", I, e.length)) if (A = e.substring(I, T), 
        !A.length || 1 === A.length && A.charCodeAt(0) === g) L && h(0), null === k && P++; else if (A.charCodeAt(0) === p) {
            var W = s();
            if (L) W !== L && h(W); else {
                if (B && _.test(B)) {
                    var q = D;
                    D = M, null === D && (k = null);
                    var U = B;
                    c(!R, q);
                    var H = 0;
                    q + 1 !== I && (H = n(e, q + 1, I)), N.push(H << 8 | r), N.push(U);
                } else c(!R);
                F = [], L = W;
            }
            F.length || A.length ? F.push(A) : O++;
        } else L && (h(0), D = null), null === k && (k = I), B = A, M = D, D = T;
        return L ? h(0) : c(!0, e.length, e.charCodeAt(e.length - 1) === v), N;
    };
    var T = 8, N = /\s+/g;
    e.generateSnippet = function(e, t) {
        for (var n = 0; n < e.length; n += 2) {
            var s = 15 & e[n], o = e[n + 1];
            switch (s) {
              case a:
                if (!o.length) break;
                if (o.length < t) return o.trim().replace(N, " ");
                var i = o.lastIndexOf(" ", t);
                return T > t - i ? o.substring(0, i).trim().replace(N, " ") : o.substring(0, t).trim().replace(N, " ");
            }
        }
        return "";
    };
    var x = 5, k = [ "> ", ">> ", ">>> ", ">>>> ", ">>>>> ", ">>>>>> ", ">>>>>>> ", ">>>>>>>> ", ">>>>>>>>> " ], B = [ ">", ">>", ">>>", ">>>>", ">>>>>", ">>>>>>", ">>>>>>>", ">>>>>>>>", ">>>>>>>>>" ], D = [ "\n> ", "\n>> ", "\n>>> ", "\n>>>> ", "\n>>>>> ", "\n>>>>>> ", "\n>>>>>>> ", "\n>>>>>>>> " ], M = [ "\n>", "\n>>", "\n>>>", "\n>>>>", "\n>>>>>", "\n>>>>>>", "\n>>>>>>>", "\n>>>>>>>>" ];
    e.generateReplyText = function(e) {
        for (var t = [], n = 0; n < e.length; n += 2) {
            var l = 15 & e[n], p = e[n + 1];
            switch (l) {
              case a:
              case i:
              case r:
                t.push(s(p, 0)), t.push(o(p, 0));
                break;

              case c:
                var f = (255 & e[n] >> 8) + 1;
                x > f && (t.push(s(p, f)), t.push(o(p, f)));
                break;

              case d:
              case u:
              case m:
              case h:            }
        }
        return t.join("");
    }, e.generateForwardBodyText = function(e) {
        for (var t, n = [], l = 0; l < e.length; l += 2) {
            l && n.push(A);
            var p = 15 & e[l], f = e[l + 1];
            switch (p) {
              case a:
                for (t = 255 & e[l] >> 8; t; t--) n.push(A);
                for (n.push(f), t = 255 & e[l] >> 16; t; t--) n.push(A);
                break;

              case r:
                for (n.push(f), t = 255 & e[l] >> 8; t; t--) n.push(A);
                break;

              case i:
              case d:
              case u:
              case m:
              case h:
                for (t = 255 & e[l] >> 8; t; t--) n.push(A);
                for (n.push(f), t = 255 & e[l] >> 16; t; t--) n.push(A);
                break;

              case c:
                var g = Math.min(255 & e[l] >> 8, 8);
                for (t = 255 & e[l] >> 16; t; t--) n.push(B[g]), n.push(A);
                for (n.push(s(f, g)), n.push(o(f, g)), t = 255 & e[l] >> 24; t; t--) n.push(A), 
                n.push(B[g]);
            }
        }
        return n.join("");
    };
}), define("mailapi/mailchew", [ "exports", "./util", "./mailchew-strings", "./quotechew", "./htmlchew" ], function(e, t, n, s, o) {
    var a = 100, i = /^[Rr][Ee]:/;
    e.generateReplySubject = function(e) {
        var t = "Re: ";
        return e ? i.test(e) ? e : t + e : t;
    };
    var r = /^[Ff][Ww][Dd]:/;
    e.generateForwardSubject = function(e) {
        var t = "Fwd: ";
        return e ? r.test(e) ? e : t + e : t;
    };
    var c = "{name} wrote", l = "Original Message", d = {
        subject: "Subject",
        date: "Date",
        from: "From",
        replyTo: "Reply-To",
        to: "To",
        cc: "CC"
    };
    e.setLocalizedStrings = function(e) {
        c = e.wrote, l = e.originalMessage, d = e.forwardHeaderLabels;
    }, n.strings && e.setLocalizedStrings(n.strings), n.events.on("strings", function(t) {
        e.setLocalizedStrings(t);
    }), e.generateReplyBody = function(e, t, n, a, i) {
        for (var r = t.name ? t.name.trim() : t.address, l = "\n\n" + c.replace("{name}", r) + ":\n", d = null, u = 0; u < e.length; u++) {
            var m = e[u].type, h = e[u].content;
            if ("plain" === m) {
                var p = s.generateReplyText(h);
                d ? d += o.wrapTextIntoSafeHTMLString(p) + "\n" : l += p;
            } else "html" === m && (d || (d = "", l = l.slice(0, -1)), d += "<blockquote ", 
            i && (d += 'cite="mid:' + o.escapeAttrValue(i) + '" '), d += 'type="cite">' + h + "</blockquote>");
        }
        return a.signature && (d ? d += o.wrapTextIntoSafeHTMLString(a.signature, "pre", !1, [ "class", "moz-signature", "cols", "72" ]) : l += "\n\n-- \n" + a.signature + "\n"), 
        {
            text: l,
            html: d
        };
    }, e.generateForwardMessage = function(e, n, a, i, r, c) {
        var u = "\n\n", m = null;
        c.signature && (u += "-- \n" + c.signature + "\n\n"), u += "-------- " + l + " --------\n", 
        u += d.subject + ": " + a + "\n", u += d.date + ": " + new Date(n) + "\n", u += d.from + ": " + t.formatAddresses([ e ]) + "\n", 
        i.replyTo && (u += d.replyTo + ": " + t.formatAddresses([ i.replyTo ]) + "\n"), 
        i.to && (u += d.to + ": " + t.formatAddresses(i.to) + "\n"), i.cc && (u += d.cc + ": " + t.formatAddresses(i.cc) + "\n"), 
        u += "\n";
        for (var h = r.bodyReps, p = 0; p < h.length; p++) {
            var f = h[p].type, g = h[p].content;
            if ("plain" === f) {
                var v = s.generateForwardBodyText(g);
                m ? m += o.wrapTextIntoSafeHTMLString(v) + "\n" : u += v;
            } else "html" === f && (m || (m = ""), m += g);
        }
        return {
            text: u,
            html: m
        };
    };
    var u = '<html><body><body bgcolor="#FFFFFF" text="#000000">', m = "</body></html>";
    e.mergeUserTextWithHTML = function(e, t) {
        return u + o.wrapTextIntoSafeHTMLString(e, "div") + t + m;
    }, e.processMessageContent = function(e, t, n, i, r) {
        var c, l;
        switch (t) {
          case "plain":
            try {
                c = s.quoteProcessTextBody(e);
            } catch (d) {
                r.textChewError(d), c = [];
            }
            if (i) try {
                l = s.generateSnippet(c, a);
            } catch (d) {
                r.textSnippetError(d), l = "";
            }
            break;

          case "html":
            if (i) try {
                l = o.generateSnippet(e);
            } catch (d) {
                r.htmlSnippetError(d), l = "";
            }
            if (n) try {
                c = o.sanitizeAndNormalizeHtml(e);
            } catch (d) {
                r.htmlParseError(d), c = "";
            }
        }
        return {
            content: c,
            snippet: l
        };
    };
}), define("mailapi/imap/imapchew", [ "mimelib", "mailapi/db/mail_rep", "../mailchew", "exports" ], function(e, t, n, s) {
    function o(t) {
        var n = /^([^']*)'([^']*)'(.+)$/.exec(t);
        return n ? e.parseMimeWords("=?" + (n[1] || "us-ascii") + "?Q?" + n[3].replace(/%/g, "=") + "?=") : null;
    }
    function a(n) {
        function s(e) {
            var t = e.encoding.toLowerCase();
            return "base64" === t ? Math.floor(57 * e.size / 78) : "quoted-printable" === t ? e.size : e.size;
        }
        function a(n) {
            function a(e) {
                return "<" === e[0] ? e.slice(1, -1) : e;
            }
            function i(e, n) {
                return t.makeAttachmentPart({
                    name: n || "unnamed-" + ++l,
                    contentId: e.id ? a(e.id) : null,
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
            var m, h, p = n[0];
            if (m = p.params && p.params.name ? e.parseMimeWords(p.params.name) : p.params && p.params["name*"] ? o(p.params["name*"]) : p.disposition && p.disposition.params && p.disposition.params.filename ? e.parseMimeWords(p.disposition.params.filename) : p.disposition && p.disposition.params && p.disposition.params["filename*"] ? o(p.disposition.params["filename*"]) : null, 
            h = p.disposition ? p.disposition.type.toLowerCase() : p.id ? "inline" : m || "text" !== p.type ? "attachment" : "inline", 
            "text" !== p.type && "image" !== p.type && (h = "attachment"), "application" === p.type && ("pgp-signature" === p.subtype || "pkcs7-signature" === p.subtype)) return !0;
            if ("attachment" === h) return r.push(i(p, m)), !0;
            switch (p.type) {
              case "image":
                return d.push(i(p, m)), !0;

              case "text":
                if ("plain" === p.subtype || "html" === p.subtype) return c.push(u(p)), !0;
            }
            return !1;
        }
        function i(e) {
            var t, n = e[0];
            switch (n.subtype) {
              case "alternative":
                for (t = e.length - 1; t >= 1; t--) {
                    var s = e[t][0];
                    switch (s.type) {
                      case "text":
                        break;

                      case "multipart":
                        if (i(e[t])) return !0;
                        break;

                      default:
                        continue;
                    }
                    switch (s.subtype) {
                      case "html":
                      case "plain":
                        if (a(e[t])) return !0;
                    }
                }
                return !1;

              case "mixed":
              case "signed":
              case "related":
                for (t = 1; t < e.length; t++) e[t].length > 1 ? i(e[t]) : a(e[t]);
                return !0;

              default:
                return console.warn("Ignoring multipart type:", n.subtype), !1;
            }
        }
        var r = [], c = [], l = 0, d = [];
        return n.structure.length > 1 ? i(n.structure) : a(n.structure), {
            bodyReps: c,
            attachments: r,
            relatedParts: d
        };
    }
    s.chewHeaderAndBodyStructure = function(e, n, s) {
        var o = a(e), i = {};
        return i.header = t.makeHeaderInfo({
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
        }), i.bodyInfo = t.makeBodyInfo({
            date: e.date,
            size: 0,
            attachments: o.attachments,
            relatedParts: o.relatedParts,
            references: e.msg.references,
            bodyReps: o.bodyReps
        }), i;
    }, s.updateMessageWithFetch = function(e, t, s, o, a) {
        var i = t.bodyReps[s.bodyRepIndex];
        (!s.bytes || o.bytesFetched < s.bytes[1]) && (i.isDownloaded = !0, i._partInfo = null), 
        !i.isDownloaded && o.buffer && (i._partInfo.pendingBuffer = o.buffer), i.amountDownloaded += o.bytesFetched;
        var r = n.processMessageContent(o.text, i.type, i.isDownloaded, s.createSnippet, a);
        s.createSnippet && (e.snippet = r.snippet), i.isDownloaded && (i.content = r.content);
    }, s.selectSnippetBodyRep = function(e, t) {
        if (e.snippet) return -1;
        for (var n = t.bodyReps, o = n.length, a = 0; o > a; a++) if (s.canBodyRepFillSnippet(n[a])) return a;
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
});