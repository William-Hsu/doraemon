(function(e, t) {
    "object" == typeof exports && (define = function(e, t) {
        e = e.map.forEach(function(e) {
            return require(e);
        }), module.exports = t(e);
    }, define.amd = {}), "function" == typeof define && define.amd ? define("activesync/codepages", [ "wbxml", "./codepages/Common", "./codepages/AirSync", "./codepages/Contacts", "./codepages/Email", "./codepages/Calendar", "./codepages/Move", "./codepages/ItemEstimate", "./codepages/FolderHierarchy", "./codepages/MeetingResponse", "./codepages/Tasks", "./codepages/ResolveRecipients", "./codepages/ValidateCert", "./codepages/Contacts2", "./codepages/Ping", "./codepages/Provision", "./codepages/Search", "./codepages/GAL", "./codepages/AirSyncBase", "./codepages/Settings", "./codepages/DocumentLibrary", "./codepages/ItemOperations", "./codepages/ComposeMail", "./codepages/Email2", "./codepages/Notes", "./codepages/RightsManagement" ], t) : e.ActiveSyncCodepages = t(WBXML, ASCPCommon, ASCPAirSync, ASCPContacts, ASCPEmail, ASCPCalendar, ASCPMove, ASCPItemEstimate, ASCPHierarchy, ASCPMeetingResponse, ASCPTasks, ASCPResolveRecipients, ASCPValidateCert, ASCPContacts2, ASCPPing, ASCPProvision, ASCPSearch, ASCPGAL, ASCPAirSyncBase, ASCPSettings, ASCPDocumentLibrary, ASCPItemOperations, ASCPComposeMail, ASCPEmail2, ASCPNotes, ASCPRightsManagement);
})(this, function(e, t, n, s, o, a, i, r, c, d, l, u, m, h, p, f, g, v, y, _, b, C, S, E, w, A) {
    var I = {
        Common: t,
        AirSync: n,
        Contacts: s,
        Email: o,
        Calendar: a,
        Move: i,
        ItemEstimate: r,
        FolderHierarchy: c,
        MeetingResponse: d,
        Tasks: l,
        ResolveRecipients: u,
        ValidateCert: m,
        Contacts2: h,
        Ping: p,
        Provision: f,
        Search: g,
        GAL: v,
        AirSyncBase: y,
        Settings: _,
        DocumentLibrary: b,
        ItemOperations: C,
        ComposeMail: S,
        Email2: E,
        Notes: w,
        RightsManagement: A
    };
    return e.CompileCodepages(I), I;
}), function(e, t) {
    if ("object" == typeof exports) {
        module.exports = t(), this.Blob = require("./blob").Blob;
        var n = require("stringencoding");
        this.TextEncoder = n.TextEncoder, this.TextDecoder = n.TextDecoder;
    } else "function" == typeof define && define.amd ? define("wbxml", t) : e.WBXML = t();
}(this, function() {
    function e(e, t, n) {
        function s() {
            var e = this instanceof s ? this : Object.create(s.prototype), t = Error(), o = 1;
            if (e.stack = t.stack.substring(t.stack.indexOf("\n") + 1), e.message = arguments[0] || t.message, 
            n) {
                o += n.length;
                for (var a = 0; a < n.length; a++) e[n[a]] = arguments[a + 1];
            }
            var i = /@(.+):(.+)/.exec(e.stack);
            return e.fileName = arguments[o] || i && i[1] || "", e.lineNumber = arguments[o + 1] || i && i[2] || 0, 
            e;
        }
        return s.prototype = Object.create((t || Error).prototype), s.prototype.name = e, 
        s.prototype.constructor = s, s;
    }
    function t(e, t) {
        this.strings = [], this.offsets = {};
        for (var n = 0, s = 0; s < e.length; s++) 0 === e[s] && (this.offsets[n] = this.strings.length, 
        this.strings.push(t.decode(e.subarray(n, s))), n = s + 1);
    }
    function n(e) {
        e.__nsnames__ = {}, e.__tagnames__ = {}, e.__attrdata__ = {};
        for (var t in e) {
            var n = e[t];
            if (!t.match(/^__/)) {
                if (n.Tags) {
                    var s, o;
                    for (s in n.Tags) {
                        o = n.Tags[s], e.__nsnames__[o >> 8] = t;
                        break;
                    }
                    for (s in n.Tags) o = n.Tags[s], e.__tagnames__[o] = s;
                }
                if (n.Attrs) for (var a in n.Attrs) {
                    var i = n.Attrs[a];
                    "name" in i || (i.name = a), e.__attrdata__[i.value] = i, n.Attrs[a] = i.value;
                }
            }
        }
    }
    function s(e, t, n) {
        if (this.ownerDocument = e, this.type = t, this._attrs = {}, "string" == typeof n) {
            var s = n.split(":");
            1 === s.length ? this.localTagName = s[0] : (this.namespaceName = s[0], this.localTagName = s[1]);
        } else this.tag = n, Object.defineProperties(this, {
            namespace: {
                get: function() {
                    return this.tag >> 8;
                }
            },
            localTag: {
                get: function() {
                    return 255 & this.tag;
                }
            },
            namespaceName: {
                get: function() {
                    return this.ownerDocument._codepages.__nsnames__[this.namespace];
                }
            },
            localTagName: {
                get: function() {
                    return this.ownerDocument._codepages.__tagnames__[this.tag];
                }
            }
        });
    }
    function o(e) {
        this.ownerDocument = e;
    }
    function a(e, t) {
        this.ownerDocument = e, this.textContent = t;
    }
    function i(e, t, n, s) {
        this.ownerDocument = e, this.subtype = t, this.index = n, this.value = s;
    }
    function r(e) {
        this.ownerDocument = e;
    }
    function c(e, t) {
        this.ownerDocument = e, this.data = t;
    }
    function d(e, t) {
        this._data = e instanceof l ? e.bytes : e, this._codepages = t, this.rewind();
    }
    function l(e, t, n, s, o) {
        this._blobs = "blob" === o ? [] : null, this.dataType = o || "arraybuffer", this._rawbuf = new ArrayBuffer(1024), 
        this._buffer = new Uint8Array(this._rawbuf), this._pos = 0, this._codepage = 0, 
        this._tagStack = [], this._rootTagValue = null;
        var a = e.split(".").map(function(e) {
            return parseInt(e);
        }), i = a[0], r = a[1], c = (i - 1 << 4) + r, d = n;
        if ("string" == typeof n && (d = v[n], void 0 === d)) throw new Error("unknown charset " + n);
        var l = this._encoder = new TextEncoder(n);
        if (this._write(c), this._write(t), this._write(d), s) {
            var u = s.map(function(e) {
                return l.encode(e);
            }), m = u.reduce(function(e, t) {
                return e + t.length + 1;
            }, 0);
            this._write_mb_uint32(m);
            for (var h = 0; h < u.length; h++) {
                var p = u[h];
                this._write_bytes(p), this._write(0);
            }
        } else this._write(0);
    }
    function u() {
        this.listeners = [], this.onerror = function(e) {
            throw e;
        };
    }
    var m = {}, h = {
        SWITCH_PAGE: 0,
        END: 1,
        ENTITY: 2,
        STR_I: 3,
        LITERAL: 4,
        EXT_I_0: 64,
        EXT_I_1: 65,
        EXT_I_2: 66,
        PI: 67,
        LITERAL_C: 68,
        EXT_T_0: 128,
        EXT_T_1: 129,
        EXT_T_2: 130,
        STR_T: 131,
        LITERAL_A: 132,
        EXT_0: 192,
        EXT_1: 193,
        EXT_2: 194,
        OPAQUE: 195,
        LITERAL_AC: 196
    }, p = {
        message: "THIS IS AN INTERNAL CONTROL FLOW HACK THAT YOU SHOULD NOT SEE"
    }, f = e("WBXML.ParseError");
    m.ParseError = f, t.prototype = {
        get: function(e) {
            if (e in this.offsets) return this.strings[this.offsets[e]];
            if (0 > e) throw new f("offset must be >= 0");
            for (var t = 0, n = 0; n < this.strings.length; n++) {
                if (e < t + this.strings[n].length + 1) return this.strings[n].slice(e - t);
                t += this.strings[n].length + 1;
            }
            throw new f("invalid offset");
        }
    }, m.CompileCodepages = n;
    var g = {
        3: "US-ASCII",
        4: "ISO-8859-1",
        5: "ISO-8859-2",
        6: "ISO-8859-3",
        7: "ISO-8859-4",
        8: "ISO-8859-5",
        9: "ISO-8859-6",
        10: "ISO-8859-7",
        11: "ISO-8859-8",
        12: "ISO-8859-9",
        13: "ISO-8859-10",
        106: "UTF-8"
    }, v = {};
    for (var y in g) {
        var _ = g[y];
        v[_] = y;
    }
    return m.Element = s, s.prototype = {
        get tagName() {
            var e = this.namespaceName;
            return e = e ? e + ":" : "", e + this.localTagName;
        },
        getAttributes: function() {
            var e = [];
            for (var t in this._attrs) {
                var n = this._attrs[t], s = t.split(":");
                e.push({
                    name: t,
                    namespace: s[0],
                    localName: s[1],
                    value: this._getAttribute(n)
                });
            }
            return e;
        },
        getAttribute: function(e) {
            return "number" == typeof e ? e = this.ownerDocument._codepages.__attrdata__[e].name : e in this._attrs || null === this.namespace || -1 !== e.indexOf(":") || (e = this.namespaceName + ":" + e), 
            this._getAttribute(this._attrs[e]);
        },
        _getAttribute: function(e) {
            for (var t = "", n = [], s = 0; s < e.length; s++) {
                var o = e[s];
                o instanceof i ? (t && (n.push(t), t = ""), n.push(o)) : t += "number" == typeof o ? this.ownerDocument._codepages.__attrdata__[o].data || "" : o;
            }
            return t && n.push(t), 1 === n.length ? n[0] : n;
        },
        _addAttribute: function(e) {
            if ("string" == typeof e) {
                if (e in this._attrs) throw new f("attribute " + e + " is repeated");
                return this._attrs[e] = [];
            }
            var t = e >> 8, n = 255 & e, s = this.ownerDocument._codepages.__attrdata__[n].name, o = this.ownerDocument._codepages.__nsnames__[t], a = o + ":" + s;
            if (a in this._attrs) throw new f("attribute " + a + " is repeated");
            return this._attrs[a] = [ e ];
        }
    }, m.EndTag = o, o.prototype = {
        get type() {
            return "ETAG";
        }
    }, m.Text = a, a.prototype = {
        get type() {
            return "TEXT";
        }
    }, m.Extension = i, i.prototype = {
        get type() {
            return "EXT";
        }
    }, m.ProcessingInstruction = r, r.prototype = {
        get type() {
            return "PI";
        },
        get target() {
            return "string" == typeof this.targetID ? this.targetID : this.ownerDocument._codepages.__attrdata__[this.targetID].name;
        },
        _setTarget: function(e) {
            return this.targetID = e, this._data = "string" == typeof e ? [] : [ e ];
        },
        _getAttribute: s.prototype._getAttribute,
        get data() {
            return this._getAttribute(this._data);
        }
    }, m.Opaque = c, c.prototype = {
        get type() {
            return "OPAQUE";
        }
    }, m.Reader = d, d.prototype = {
        _get_uint8: function() {
            if (this._index === this._data.length) throw p;
            return this._data[this._index++];
        },
        _get_mb_uint32: function() {
            var e, t = 0;
            do e = this._get_uint8(), t = 128 * t + (127 & e); while (128 & e);
            return t;
        },
        _get_slice: function(e) {
            var t = this._index;
            return this._index += e, this._data.subarray(t, this._index);
        },
        _get_c_string: function() {
            for (var e = this._index; this._get_uint8(); ) ;
            return this._data.subarray(e, this._index - 1);
        },
        rewind: function() {
            this._index = 0;
            var e = this._get_uint8();
            this.version = ((240 & e) + 1).toString() + "." + (15 & e).toString(), this.pid = this._get_mb_uint32(), 
            this.charset = g[this._get_mb_uint32()] || "unknown", this._decoder = new TextDecoder(this.charset);
            var n = this._get_mb_uint32();
            this.strings = new t(this._get_slice(n), this._decoder), this.document = this._getDocument();
        },
        _getDocument: function() {
            var e, t, n = {
                BODY: 0,
                ATTRIBUTES: 1,
                ATTRIBUTE_PI: 2
            }, d = n.BODY, l = 0, u = 0, m = !1, g = [], v = function(s) {
                d === n.BODY ? e ? e.textContent += s : e = new a(this, s) : t.push(s);
            }.bind(this);
            try {
                for (;;) {
                    var y = this._get_uint8();
                    if (y === h.SWITCH_PAGE) {
                        if (l = this._get_uint8(), !(l in this._codepages.__nsnames__)) throw new f("unknown codepage " + l);
                    } else if (y === h.END) if (d === n.BODY && u-- > 0) e && (g.push(e), e = null), 
                    g.push(new o(this)); else {
                        if (d !== n.ATTRIBUTES && d !== n.ATTRIBUTE_PI) throw new f("unexpected END token");
                        d = n.BODY, g.push(e), e = null, t = null;
                    } else if (y === h.ENTITY) {
                        if (d === n.BODY && 0 === u) throw new f("unexpected ENTITY token");
                        var _ = this._get_mb_uint32();
                        v("&#" + _ + ";");
                    } else if (y === h.STR_I) {
                        if (d === n.BODY && 0 === u) throw new f("unexpected STR_I token");
                        v(this._decoder.decode(this._get_c_string()));
                    } else if (y === h.PI) {
                        if (d !== n.BODY) throw new f("unexpected PI token");
                        d = n.ATTRIBUTE_PI, e && g.push(e), e = new r(this);
                    } else if (y === h.STR_T) {
                        if (d === n.BODY && 0 === u) throw new f("unexpected STR_T token");
                        var b = this._get_mb_uint32();
                        v(this.strings.get(b));
                    } else if (y === h.OPAQUE) {
                        if (d !== n.BODY) throw new f("unexpected OPAQUE token");
                        var C = this._get_mb_uint32(), S = this._get_slice(C);
                        e && (g.push(e), e = null), g.push(new c(this, S));
                    } else if ((64 & y || 128 & y) && 3 > (63 & y)) {
                        var E, w, A = 192 & y, I = 63 & y;
                        A === h.EXT_I_0 ? (E = "string", w = this._decoder.decode(this._get_c_string())) : A === h.EXT_T_0 ? (E = "integer", 
                        w = this._get_mb_uint32()) : (E = "byte", w = null);
                        var T = new i(this, E, I, w);
                        d === n.BODY ? (e && (g.push(e), e = null), g.push(T)) : t.push(T);
                    } else if (d === n.BODY) {
                        if (0 === u) {
                            if (m) throw new f("multiple root nodes found");
                            m = !0;
                        }
                        var N = (l << 8) + (63 & y);
                        if ((63 & y) === h.LITERAL) {
                            var b = this._get_mb_uint32();
                            N = this.strings.get(b);
                        }
                        e && g.push(e), e = new s(this, 64 & y ? "STAG" : "TAG", N), 64 & y && u++, 128 & y ? d = n.ATTRIBUTES : (d = n.BODY, 
                        g.push(e), e = null);
                    } else {
                        var x = (l << 8) + y;
                        if (128 & y) t.push(x); else {
                            if (y === h.LITERAL) {
                                var b = this._get_mb_uint32();
                                x = this.strings.get(b);
                            }
                            if (d === n.ATTRIBUTE_PI) {
                                if (t) throw new f("unexpected attribute in PI");
                                t = e._setTarget(x);
                            } else t = e._addAttribute(x);
                        }
                    }
                }
            } catch (_) {
                if (_ !== p) throw _;
            }
            return g;
        },
        dump: function(e, t) {
            var n = "";
            void 0 === e && (e = 2);
            var s = function(t) {
                return new Array(t * e + 1).join(" ");
            }, o = [];
            t && (n += "Version: " + this.version + "\n", n += "Public ID: " + this.pid + "\n", 
            n += "Charset: " + this.charset + "\n", n += 'String table:\n  "' + this.strings.strings.join('"\n  "') + '"\n\n');
            for (var a = this.document, i = a.length, r = 0; i > r; r++) {
                var c = a[r];
                if ("TAG" === c.type || "STAG" === c.type) {
                    n += s(o.length) + "<" + c.tagName;
                    for (var d = c.getAttributes(), l = 0; l < d.length; l++) {
                        var u = d[l];
                        n += " " + u.name + '="' + u.value + '"';
                    }
                    "STAG" === c.type ? (o.push(c.tagName), n += ">\n") : n += "/>\n";
                } else if ("ETAG" === c.type) {
                    var m = o.pop();
                    n += s(o.length) + "</" + m + ">\n";
                } else if ("TEXT" === c.type) n += s(o.length) + c.textContent + "\n"; else if ("PI" === c.type) n += s(o.length) + "<?" + c.target, 
                c.data && (n += " " + c.data), n += "?>\n"; else {
                    if ("OPAQUE" !== c.type) throw new Error('Unknown node type "' + c.type + '"');
                    n += s(o.length) + "<![CDATA[" + c.data + "]]>\n";
                }
            }
            return n;
        }
    }, m.Writer = l, l.Attribute = function(e, t) {
        if (this.isValue = "number" == typeof e && 128 & e, this.isValue && void 0 !== t) throw new Error("Can't specify a value for attribute value constants");
        this.name = e, this.value = t;
    }, l.StringTableRef = function(e) {
        this.index = e;
    }, l.Entity = function(e) {
        this.code = e;
    }, l.Extension = function(e, t, n) {
        var s = {
            string: {
                value: h.EXT_I_0,
                validator: function(e) {
                    return "string" == typeof e;
                }
            },
            integer: {
                value: h.EXT_T_0,
                validator: function(e) {
                    return "number" == typeof e;
                }
            },
            "byte": {
                value: h.EXT_0,
                validator: function(e) {
                    return null === e || void 0 === e;
                }
            }
        }, o = s[e];
        if (!o) throw new Error("Invalid WBXML Extension type");
        if (!o.validator(n)) throw new Error("Data for WBXML Extension does not match type");
        if (0 !== t && 1 !== t && 2 !== t) throw new Error("Invalid WBXML Extension index");
        this.subtype = o.value, this.index = t, this.data = n;
    }, l.a = function(e, t) {
        return new l.Attribute(e, t);
    }, l.str_t = function(e) {
        return new l.StringTableRef(e);
    }, l.ent = function(e) {
        return new l.Entity(e);
    }, l.ext = function(e, t, n) {
        return new l.Extension(e, t, n);
    }, l.prototype = {
        _write: function(e) {
            if (this._pos === this._buffer.length - 1) {
                this._rawbuf = new ArrayBuffer(2 * this._rawbuf.byteLength);
                for (var t = new Uint8Array(this._rawbuf), n = 0; n < this._buffer.length; n++) t[n] = this._buffer[n];
                this._buffer = t;
            }
            this._buffer[this._pos++] = e;
        },
        _write_mb_uint32: function(e) {
            var t = [];
            for (t.push(e % 128); e >= 128; ) e >>= 7, t.push(128 + e % 128);
            for (var n = t.length - 1; n >= 0; n--) this._write(t[n]);
        },
        _write_bytes: function(e) {
            for (var t = 0; t < e.length; t++) this._write(e[t]);
        },
        _write_str: function(e) {
            this._write_bytes(this._encoder.encode(e));
        },
        _setCodepage: function(e) {
            this._codepage !== e && (this._write(h.SWITCH_PAGE), this._write(e), this._codepage = e);
        },
        _writeTag: function(e, t, n) {
            if (void 0 === e) throw new Error("unknown tag");
            var s = 0;
            if (t && (s += 64), n.length && (s += 128), e instanceof l.StringTableRef ? (this._write(h.LITERAL + s), 
            this._write_mb_uint32(e.index)) : (this._setCodepage(e >> 8), this._write((255 & e) + s), 
            this._rootTagValue || (this._rootTagValue = e)), n.length) {
                for (var o = 0; o < n.length; o++) {
                    var a = n[o];
                    this._writeAttr(a);
                }
                this._write(h.END);
            }
        },
        _writeAttr: function(e) {
            if (!(e instanceof l.Attribute)) throw new Error("Expected an Attribute object");
            if (e.isValue) throw new Error("Can't use attribute value constants here");
            e.name instanceof l.StringTableRef ? (this._write(h.LITERAL), this._write(e.name.index)) : (this._setCodepage(e.name >> 8), 
            this._write(255 & e.name)), this._writeText(e.value, !0);
        },
        _writeText: function(e, t) {
            if (Array.isArray(e)) for (var n = 0; n < e.length; n++) {
                var s = e[n];
                this._writeText(s, t);
            } else if (e instanceof l.StringTableRef) this._write(h.STR_T), this._write_mb_uint32(e.index); else if (e instanceof l.Entity) this._write(h.ENTITY), 
            this._write_mb_uint32(e.code); else if (e instanceof l.Extension) this._write(e.subtype + e.index), 
            e.subtype === h.EXT_I_0 ? (this._write_str(e.data), this._write(0)) : e.subtype === h.EXT_T_0 && this._write_mb_uint32(e.data); else if (e instanceof l.Attribute) {
                if (!e.isValue) throw new Error("Unexpected Attribute object");
                if (!t) throw new Error("Can't use attribute value constants outside of attributes");
                this._setCodepage(e.name >> 8), this._write(255 & e.name);
            } else null !== e && void 0 !== e && (this._write(h.STR_I), this._write_str(e.toString()), 
            this._write(0));
        },
        tag: function(e) {
            var t = arguments.length > 1 ? arguments[arguments.length - 1] : null;
            if (null === t || t instanceof l.Attribute) {
                var n = Array.prototype.slice.call(arguments, 1);
                return this._writeTag(e, !1, n), this;
            }
            var s = Array.prototype.slice.call(arguments, 0, -1);
            return this.stag.apply(this, s).text(t).etag();
        },
        stag: function(e) {
            var t = Array.prototype.slice.call(arguments, 1);
            return this._writeTag(e, !0, t), this._tagStack.push(e), this;
        },
        etag: function(e) {
            if (0 === this._tagStack.length) throw new Error("Spurious etag() call!");
            var t = this._tagStack.pop();
            if (void 0 !== e && e !== t) throw new Error("Closed the wrong tag");
            return this._write(h.END), this;
        },
        text: function(e) {
            return this._writeText(e), this;
        },
        pi: function(e, t) {
            return this._write(h.PI), this._writeAttr(l.a(e, t)), this._write(h.END), this;
        },
        ext: function(e, t, n) {
            return this.text(l.ext(e, t, n));
        },
        opaque: function(e) {
            if (this._write(h.OPAQUE), e instanceof Blob) {
                if (!this._blobs) throw new Error("Writer not opened in blob mode");
                this._write_mb_uint32(e.size), this._blobs.push(this.bytes), this._blobs.push(e), 
                this._rawbuf = new ArrayBuffer(1024), this._buffer = new Uint8Array(this._rawbuf), 
                this._pos = 0;
            } else if ("string" == typeof e) this._write_mb_uint32(e.length), this._write_str(e); else {
                this._write_mb_uint32(e.length);
                for (var t = 0; t < e.length; t++) this._write(e[t]);
            }
            return this;
        },
        get buffer() {
            return this._rawbuf.slice(0, this._pos);
        },
        get bytes() {
            return new Uint8Array(this._rawbuf, 0, this._pos);
        },
        get blob() {
            if (!this._blobs) throw new Error("No blobs!");
            var e = this._blobs;
            this._pos && (e = e.concat([ this.bytes ]));
            var t = new Blob(e);
            return t;
        },
        get rootTag() {
            return this._rootTagValue;
        }
    }, m.EventParser = u, u.prototype = {
        addEventListener: function(e, t) {
            this.listeners.push({
                path: e,
                callback: t
            });
        },
        _pathMatches: function(e, t) {
            return e.length === t.length && e.every(function(e, n) {
                return "*" === t[n] ? !0 : Array.isArray(t[n]) ? -1 !== t[n].indexOf(e) : e === t[n];
            });
        },
        run: function(e) {
            for (var t, n, s = [], o = [], a = 0, i = e.document, r = i.length, c = this.listeners, d = 0; r > d; d++) {
                var l = i[d];
                if ("TAG" === l.type) {
                    for (s.push(l.tag), t = 0; t < c.length; t++) if (n = c[t], this._pathMatches(s, n.path)) {
                        l.children = [];
                        try {
                            n.callback(l);
                        } catch (u) {
                            this.onerror && this.onerror(u);
                        }
                    }
                    s.pop();
                } else if ("STAG" === l.type) for (s.push(l.tag), t = 0; t < c.length; t++) n = c[t], 
                this._pathMatches(s, n.path) && a++; else if ("ETAG" === l.type) {
                    for (t = 0; t < c.length; t++) if (n = c[t], this._pathMatches(s, n.path)) {
                        a--;
                        try {
                            n.callback(o[o.length - 1]);
                        } catch (u) {
                            this.onerror && this.onerror(u);
                        }
                    }
                    s.pop();
                }
                a && ("STAG" === l.type ? (l.type = "TAG", l.children = [], o.length && o[o.length - 1].children.push(l), 
                o.push(l)) : "ETAG" === l.type ? o.pop() : (l.children = [], o[o.length - 1].children.push(l)));
            }
        }
    }, m;
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Common", [], t) : e.ASCPCommon = t();
}(this, function() {
    return {
        Enums: {
            Status: {
                InvalidContent: "101",
                InvalidWBXML: "102",
                InvalidXML: "103",
                InvalidDateTime: "104",
                InvalidCombinationOfIDs: "105",
                InvalidIDs: "106",
                InvalidMIME: "107",
                DeviceIdMissingOrInvalid: "108",
                DeviceTypeMissingOrInvalid: "109",
                ServerError: "110",
                ServerErrorRetryLater: "111",
                ActiveDirectoryAccessDenied: "112",
                MailboxQuotaExceeded: "113",
                MailboxServerOffline: "114",
                SendQuotaExceeded: "115",
                MessageRecipientUnresolved: "116",
                MessageReplyNotAllowed: "117",
                MessagePreviouslySent: "118",
                MessageHasNoRecipient: "119",
                MailSubmissionFailed: "120",
                MessageReplyFailed: "121",
                AttachmentIsTooLarge: "122",
                UserHasNoMailbox: "123",
                UserCannotBeAnonymous: "124",
                UserPrincipalCouldNotBeFound: "125",
                UserDisabledForSync: "126",
                UserOnNewMailboxCannotSync: "127",
                UserOnLegacyMailboxCannotSync: "128",
                DeviceIsBlockedForThisUser: "129",
                AccessDenied: "130",
                AccountDisabled: "131",
                SyncStateNotFound: "132",
                SyncStateLocked: "133",
                SyncStateCorrupt: "134",
                SyncStateAlreadyExists: "135",
                SyncStateVersionInvalid: "136",
                CommandNotSupported: "137",
                VersionNotSupported: "138",
                DeviceNotFullyProvisionable: "139",
                RemoteWipeRequested: "140",
                LegacyDeviceOnStrictPolicy: "141",
                DeviceNotProvisioned: "142",
                PolicyRefresh: "143",
                InvalidPolicyKey: "144",
                ExternallyManagedDevicesNotAllowed: "145",
                NoRecurrenceInCalendar: "146",
                UnexpectedItemClass: "147",
                RemoteServerHasNoSSL: "148",
                InvalidStoredRequest: "149",
                ItemNotFound: "150",
                TooManyFolders: "151",
                NoFoldersFounds: "152",
                ItemsLostAfterMove: "153",
                FailureInMoveOperation: "154",
                MoveCommandDisallowedForNonPersistentMoveAction: "155",
                MoveCommandInvalidDestinationFolder: "156",
                AvailabilityTooManyRecipients: "160",
                AvailabilityDLLimitReached: "161",
                AvailabilityTransientFailure: "162",
                AvailabilityFailure: "163",
                BodyPartPreferenceTypeNotSupported: "164",
                DeviceInformationRequired: "165",
                InvalidAccountId: "166",
                AccountSendDisabled: "167",
                IRM_FeatureDisabled: "168",
                IRM_TransientError: "169",
                IRM_PermanentError: "170",
                IRM_InvalidTemplateID: "171",
                IRM_OperationNotPermitted: "172",
                NoPicture: "173",
                PictureTooLarge: "174",
                PictureLimitReached: "175",
                BodyPart_ConversationTooLarge: "176",
                MaximumDevicesReached: "177"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Contacts", [], t) : e.ASCPContacts = t();
}(this, function() {
    return {
        Tags: {
            Anniversary: 261,
            AssistantName: 262,
            AssistantPhoneNumber: 263,
            Birthday: 264,
            Body: 265,
            BodySize: 266,
            BodyTruncated: 267,
            Business2PhoneNumber: 268,
            BusinessAddressCity: 269,
            BusinessAddressCountry: 270,
            BusinessAddressPostalCode: 271,
            BusinessAddressState: 272,
            BusinessAddressStreet: 273,
            BusinessFaxNumber: 274,
            BusinessPhoneNumber: 275,
            CarPhoneNumber: 276,
            Categories: 277,
            Category: 278,
            Children: 279,
            Child: 280,
            CompanyName: 281,
            Department: 282,
            Email1Address: 283,
            Email2Address: 284,
            Email3Address: 285,
            FileAs: 286,
            FirstName: 287,
            Home2PhoneNumber: 288,
            HomeAddressCity: 289,
            HomeAddressCountry: 290,
            HomeAddressPostalCode: 291,
            HomeAddressState: 292,
            HomeAddressStreet: 293,
            HomeFaxNumber: 294,
            HomePhoneNumber: 295,
            JobTitle: 296,
            LastName: 297,
            MiddleName: 298,
            MobilePhoneNumber: 299,
            OfficeLocation: 300,
            OtherAddressCity: 301,
            OtherAddressCountry: 302,
            OtherAddressPostalCode: 303,
            OtherAddressState: 304,
            OtherAddressStreet: 305,
            PagerNumber: 306,
            RadioPhoneNumber: 307,
            Spouse: 308,
            Suffix: 309,
            Title: 310,
            WebPage: 311,
            YomiCompanyName: 312,
            YomiFirstName: 313,
            YomiLastName: 314,
            CompressedRTF: 315,
            Picture: 316,
            Alias: 317,
            WeightedRank: 318
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Calendar", [], t) : e.ASCPCalendar = t();
}(this, function() {
    return {
        Tags: {
            TimeZone: 1029,
            AllDayEvent: 1030,
            Attendees: 1031,
            Attendee: 1032,
            Email: 1033,
            Name: 1034,
            Body: 1035,
            BodyTruncated: 1036,
            BusyStatus: 1037,
            Categories: 1038,
            Category: 1039,
            CompressedRTF: 1040,
            DtStamp: 1041,
            EndTime: 1042,
            Exception: 1043,
            Exceptions: 1044,
            Deleted: 1045,
            ExceptionStartTime: 1046,
            Location: 1047,
            MeetingStatus: 1048,
            OrganizerEmail: 1049,
            OrganizerName: 1050,
            Recurrence: 1051,
            Type: 1052,
            Until: 1053,
            Occurrences: 1054,
            Interval: 1055,
            DayOfWeek: 1056,
            DayOfMonth: 1057,
            WeekOfMonth: 1058,
            MonthOfYear: 1059,
            Reminder: 1060,
            Sensitivity: 1061,
            Subject: 1062,
            StartTime: 1063,
            UID: 1064,
            AttendeeStatus: 1065,
            AttendeeType: 1066,
            Attachment: 1067,
            Attachments: 1068,
            AttName: 1069,
            AttSize: 1070,
            AttOid: 1071,
            AttMethod: 1072,
            AttRemoved: 1073,
            DisplayName: 1074,
            DisallowNewTimeProposal: 1075,
            ResponseRequested: 1076,
            AppointmentReplyTime: 1077,
            ResponseType: 1078,
            CalendarType: 1079,
            IsLeapMonth: 1080,
            FirstDayOfWeek: 1081,
            OnlineMeetingConfLink: 1082,
            OnlineMeetingExternalLink: 1083
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/MeetingResponse", [], t) : e.ASCPMeetingResponse = t();
}(this, function() {
    return {
        Tags: {
            CalendarId: 2053,
            CollectionId: 2054,
            MeetingResponse: 2055,
            RequestId: 2056,
            Request: 2057,
            Result: 2058,
            Status: 2059,
            UserResponse: 2060,
            InstanceId: 2062
        },
        Enums: {
            Status: {
                Success: "1",
                InvalidRequest: "2",
                MailboxError: "3",
                ServerError: "4"
            },
            UserResponse: {
                Accepted: "1",
                Tentative: "2",
                Declined: "3"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Tasks", [], t) : e.ASCPTasks = t();
}(this, function() {
    return {
        Tags: {
            Body: 2309,
            BodySize: 2310,
            BodyTruncated: 2311,
            Categories: 2312,
            Category: 2313,
            Complete: 2314,
            DateCompleted: 2315,
            DueDate: 2316,
            UtcDueDate: 2317,
            Importance: 2318,
            Recurrence: 2319,
            Recurrence_Type: 2320,
            Recurrence_Start: 2321,
            Recurrence_Until: 2322,
            Recurrence_Occurrences: 2323,
            Recurrence_Interval: 2324,
            Recurrence_DayOfMonth: 2325,
            Recurrence_DayOfWeek: 2326,
            Recurrence_WeekOfMonth: 2327,
            Recurrence_MonthOfYear: 2328,
            Recurrence_Regenerate: 2329,
            Recurrence_DeadOccur: 2330,
            ReminderSet: 2331,
            ReminderTime: 2332,
            Sensitivity: 2333,
            StartDate: 2334,
            UtcStartDate: 2335,
            Subject: 2336,
            CompressedRTF: 2337,
            OrdinalDate: 2338,
            SubOrdinalDate: 2339,
            CalendarType: 2340,
            IsLeapMonth: 2341,
            FirstDayOfWeek: 2342
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/ResolveRecipients", [], t) : e.ASCPResolveRecipients = t();
}(this, function() {
    return {
        Tags: {
            ResolveRecipients: 2565,
            Response: 2566,
            Status: 2567,
            Type: 2568,
            Recipient: 2569,
            DisplayName: 2570,
            EmailAddress: 2571,
            Certificates: 2572,
            Certificate: 2573,
            MiniCertificate: 2574,
            Options: 2575,
            To: 2576,
            CertificateRetrieval: 2577,
            RecipientCount: 2578,
            MaxCertificates: 2579,
            MaxAmbiguousRecipients: 2580,
            CertificateCount: 2581,
            Availability: 2582,
            StartTime: 2583,
            EndTime: 2584,
            MergedFreeBusy: 2585,
            Picture: 2586,
            MaxSize: 2587,
            Data: 2588,
            MaxPictures: 2589
        },
        Enums: {
            Status: {
                Success: "1",
                AmbiguousRecipientFull: "2",
                AmbiguousRecipientPartial: "3",
                RecipientNotFound: "4",
                ProtocolError: "5",
                ServerError: "6",
                InvalidSMIMECert: "7",
                CertLimitReached: "8"
            },
            CertificateRetrieval: {
                None: "1",
                Full: "2",
                Mini: "3"
            },
            MergedFreeBusy: {
                Free: "0",
                Tentative: "1",
                Busy: "2",
                Oof: "3",
                NoData: "4"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/ValidateCert", [], t) : e.ASCPValidateCert = t();
}(this, function() {
    return {
        Tags: {
            ValidateCert: 2821,
            Certificates: 2822,
            Certificate: 2823,
            CertificateChain: 2824,
            CheckCRL: 2825,
            Status: 2826
        },
        Enums: {
            Status: {
                Success: "1",
                ProtocolError: "2",
                InvalidSignature: "3",
                UntrustedSource: "4",
                InvalidChain: "5",
                NotForEmail: "6",
                Expired: "7",
                InconsistentTimes: "8",
                IdMisused: "9",
                MissingInformation: "10",
                CAEndMismatch: "11",
                EmailAddressMismatch: "12",
                Revoked: "13",
                ServerOffline: "14",
                ChainRevoked: "15",
                RevocationUnknown: "16",
                UnknownError: "17"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Contacts2", [], t) : e.ASCPContacts2 = t();
}(this, function() {
    return {
        Tags: {
            CustomerId: 3077,
            GovernmentId: 3078,
            IMAddress: 3079,
            IMAddress2: 3080,
            IMAddress3: 3081,
            ManagerName: 3082,
            CompanyMainPhone: 3083,
            AccountName: 3084,
            NickName: 3085,
            MMS: 3086
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Ping", [], t) : e.ASCPPing = t();
}(this, function() {
    return {
        Tags: {
            Ping: 3333,
            AutdState: 3334,
            Status: 3335,
            HeartbeatInterval: 3336,
            Folders: 3337,
            Folder: 3338,
            Id: 3339,
            Class: 3340,
            MaxFolders: 3341
        },
        Enums: {
            Status: {
                Expired: "1",
                Changed: "2",
                MissingParameters: "3",
                SyntaxError: "4",
                InvalidInterval: "5",
                TooManyFolders: "6",
                SyncFolders: "7",
                ServerError: "8"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Provision", [], t) : e.ASCPProvision = t();
}(this, function() {
    return {
        Tags: {
            Provision: 3589,
            Policies: 3590,
            Policy: 3591,
            PolicyType: 3592,
            PolicyKey: 3593,
            Data: 3594,
            Status: 3595,
            RemoteWipe: 3596,
            EASProvisionDoc: 3597,
            DevicePasswordEnabled: 3598,
            AlphanumericDevicePasswordRequired: 3599,
            DeviceEncryptionEnabled: 3600,
            RequireStorageCardEncryption: 3600,
            PasswordRecoveryEnabled: 3601,
            AttachmentsEnabled: 3603,
            MinDevicePasswordLength: 3604,
            MaxInactivityTimeDeviceLock: 3605,
            MaxDevicePasswordFailedAttempts: 3606,
            MaxAttachmentSize: 3607,
            AllowSimpleDevicePassword: 3608,
            DevicePasswordExpiration: 3609,
            DevicePasswordHistory: 3610,
            AllowStorageCard: 3611,
            AllowCamera: 3612,
            RequireDeviceEncryption: 3613,
            AllowUnsignedApplications: 3614,
            AllowUnsignedInstallationPackages: 3615,
            MinDevicePasswordComplexCharacters: 3616,
            AllowWiFi: 3617,
            AllowTextMessaging: 3618,
            AllowPOPIMAPEmail: 3619,
            AllowBluetooth: 3620,
            AllowIrDA: 3621,
            RequireManualSyncWhenRoaming: 3622,
            AllowDesktopSync: 3623,
            MaxCalendarAgeFilter: 3624,
            AllowHTMLEmail: 3625,
            MaxEmailAgeFilter: 3626,
            MaxEmailBodyTruncationSize: 3627,
            MaxEmailHTMLBodyTruncationSize: 3628,
            RequireSignedSMIMEMessages: 3629,
            RequireEncryptedSMIMEMessages: 3630,
            RequireSignedSMIMEAlgorithm: 3631,
            RequireEncryptionSMIMEAlgorithm: 3632,
            AllowSMIMEEncryptionAlgorithmNegotiation: 3633,
            AllowSMIMESoftCerts: 3634,
            AllowBrowser: 3635,
            AllowConsumerEmail: 3636,
            AllowRemoteDesktop: 3637,
            AllowInternetSharing: 3638,
            UnapprovedInROMApplicationList: 3639,
            ApplicationName: 3640,
            ApprovedApplicationList: 3641,
            Hash: 3642
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Search", [], t) : e.ASCPSearch = t();
}(this, function() {
    return {
        Tags: {
            Search: 3845,
            Stores: 3846,
            Store: 3847,
            Name: 3848,
            Query: 3849,
            Options: 3850,
            Range: 3851,
            Status: 3852,
            Response: 3853,
            Result: 3854,
            Properties: 3855,
            Total: 3856,
            EqualTo: 3857,
            Value: 3858,
            And: 3859,
            Or: 3860,
            FreeText: 3861,
            DeepTraversal: 3863,
            LongId: 3864,
            RebuildResults: 3865,
            LessThan: 3866,
            GreaterThan: 3867,
            Schema: 3868,
            Supported: 3869,
            UserName: 3870,
            Password: 3871,
            ConversationId: 3872,
            Picture: 3873,
            MaxSize: 3874,
            MaxPictures: 3875
        },
        Enums: {
            Status: {
                Success: "1",
                InvalidRequest: "2",
                ServerError: "3",
                BadLink: "4",
                AccessDenied: "5",
                NotFound: "6",
                ConnectionFailure: "7",
                TooComplex: "8",
                Timeout: "10",
                SyncFolders: "11",
                EndOfRange: "12",
                AccessBlocked: "13",
                CredentialsRequired: "14"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/GAL", [], t) : e.ASCPGAL = t();
}(this, function() {
    return {
        Tags: {
            DisplayName: 4101,
            Phone: 4102,
            Office: 4103,
            Title: 4104,
            Company: 4105,
            Alias: 4106,
            FirstName: 4107,
            LastName: 4108,
            HomePhone: 4109,
            MobilePhone: 4110,
            EmailAddress: 4111,
            Picture: 4112,
            Status: 4113,
            Data: 4114
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Settings", [], t) : e.ASCPSettings = t();
}(this, function() {
    return {
        Tags: {
            Settings: 4613,
            Status: 4614,
            Get: 4615,
            Set: 4616,
            Oof: 4617,
            OofState: 4618,
            StartTime: 4619,
            EndTime: 4620,
            OofMessage: 4621,
            AppliesToInternal: 4622,
            AppliesToExternalKnown: 4623,
            AppliesToExternalUnknown: 4624,
            Enabled: 4625,
            ReplyMessage: 4626,
            BodyType: 4627,
            DevicePassword: 4628,
            Password: 4629,
            DeviceInformation: 4630,
            Model: 4631,
            IMEI: 4632,
            FriendlyName: 4633,
            OS: 4634,
            OSLanguage: 4635,
            PhoneNumber: 4636,
            UserInformation: 4637,
            EmailAddresses: 4638,
            SmtpAddress: 4639,
            UserAgent: 4640,
            EnableOutboundSMS: 4641,
            MobileOperator: 4642,
            PrimarySmtpAddress: 4643,
            Accounts: 4644,
            Account: 4645,
            AccountId: 4646,
            AccountName: 4647,
            UserDisplayName: 4648,
            SendDisabled: 4649,
            RightsManagementInformation: 4651
        },
        Enums: {
            Status: {
                Success: "1",
                ProtocolError: "2",
                AccessDenied: "3",
                ServerError: "4",
                InvalidArguments: "5",
                ConflictingArguments: "6",
                DeniedByPolicy: "7"
            },
            OofState: {
                Disabled: "0",
                Global: "1",
                TimeBased: "2"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/DocumentLibrary", [], t) : e.ASCPDocumentLibrary = t();
}(this, function() {
    return {
        Tags: {
            LinkId: 4869,
            DisplayName: 4870,
            IsFolder: 4871,
            CreationDate: 4872,
            LastModifiedDate: 4873,
            IsHidden: 4874,
            ContentLength: 4875,
            ContentType: 4876
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/ComposeMail", [], t) : e.ASCPComposeMail = t();
}(this, function() {
    return {
        Tags: {
            SendMail: 5381,
            SmartForward: 5382,
            SmartReply: 5383,
            SaveInSentItems: 5384,
            ReplaceMime: 5385,
            Source: 5387,
            FolderId: 5388,
            ItemId: 5389,
            LongId: 5390,
            InstanceId: 5391,
            Mime: 5392,
            ClientId: 5393,
            Status: 5394,
            AccountId: 5395
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Email2", [], t) : e.ASCPEmail2 = t();
}(this, function() {
    return {
        Tags: {
            UmCallerID: 5637,
            UmUserNotes: 5638,
            UmAttDuration: 5639,
            UmAttOrder: 5640,
            ConversationId: 5641,
            ConversationIndex: 5642,
            LastVerbExecuted: 5643,
            LastVerbExecutionTime: 5644,
            ReceivedAsBcc: 5645,
            Sender: 5646,
            CalendarType: 5647,
            IsLeapMonth: 5648,
            AccountId: 5649,
            FirstDayOfWeek: 5650,
            MeetingMessageType: 5651
        },
        Enums: {
            LastVerbExecuted: {
                Unknown: "0",
                ReplyToSender: "1",
                ReplyToAll: "2",
                Forward: "3"
            },
            CalendarType: {
                Default: "0",
                Gregorian: "1",
                GregorianUS: "2",
                Japan: "3",
                Taiwan: "4",
                Korea: "5",
                Hijri: "6",
                Thai: "7",
                Hebrew: "8",
                GregorianMeFrench: "9",
                GregorianArabic: "10",
                GregorianTranslatedEnglish: "11",
                GregorianTranslatedFrench: "12",
                JapaneseLunar: "14",
                ChineseLunar: "15",
                KoreanLunar: "20"
            },
            FirstDayOfWeek: {
                Sunday: "0",
                Monday: "1",
                Tuesday: "2",
                Wednesday: "3",
                Thursday: "4",
                Friday: "5",
                Saturday: "6"
            },
            MeetingMessageType: {
                Unspecified: "0",
                InitialRequest: "1",
                FullUpdate: "2",
                InformationalUpdate: "3",
                Outdated: "4",
                DelegatorsCopy: "5",
                Delegated: "6"
            }
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/Notes", [], t) : e.ASCPNotes = t();
}(this, function() {
    return {
        Tags: {
            Subject: 5893,
            MessageClass: 5894,
            LastModifiedDate: 5895,
            Categories: 5896,
            Category: 5897
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define("activesync/codepages/RightsManagement", [], t) : e.ASCPRightsManagement = t();
}(this, function() {
    return {
        Tags: {
            RightsManagementSupport: 6149,
            RightsManagementTemplates: 6150,
            RightsManagementTemplate: 6151,
            RightsManagementLicense: 6152,
            EditAllowed: 6153,
            ReplyAllowed: 6154,
            ReplyAllAllowed: 6155,
            ForwardAllowed: 6156,
            ModifyRecipientsAllowed: 6157,
            ExtractAllowed: 6158,
            PrintAllowed: 6159,
            ExportAllowed: 6160,
            ProgrammaticAccessAllowed: 6161,
            Owner: 6162,
            ContentExpiryDate: 6163,
            TemplateID: 6164,
            TemplateName: 6165,
            TemplateDescription: 6166,
            ContentOwner: 6167,
            RemoveRightsManagementDistribution: 6168
        }
    };
}), function(e, t) {
    "object" == typeof exports ? module.exports = t(require("wbxml"), require("activesync/codepages")) : "function" == typeof define && define.amd ? define("activesync/protocol", [ "wbxml", "activesync/codepages" ], t) : e.ActiveSyncProtocol = t(WBXML, ActiveSyncCodepages);
}(this, function(e, t) {
    function n() {}
    function s(e, t, n) {
        function s() {
            var e = this instanceof s ? this : Object.create(s.prototype), t = Error(), o = 1;
            if (e.stack = t.stack.substring(t.stack.indexOf("\n") + 1), e.message = arguments[0] || t.message, 
            n) {
                o += n.length;
                for (var a = 0; a < n.length; a++) e[n[a]] = arguments[a + 1];
            }
            var i = /@(.+):(.+)/.exec(e.stack);
            return e.fileName = arguments[o] || i && i[1] || "", e.lineNumber = arguments[o + 1] || i && i[2] || 0, 
            e;
        }
        return s.prototype = Object.create((t || Error).prototype), s.prototype.name = e, 
        s.prototype.constructor = s, s;
    }
    function o(e) {
        var t = "http://schemas.microsoft.com/exchange/autodiscover/", n = {
            rq: t + "mobilesync/requestschema/2006",
            ad: t + "responseschema/2006",
            ms: t + "mobilesync/responseschema/2006"
        };
        return n[e] || null;
    }
    function a(e) {
        var t = e.split(".").map(function(e) {
            return parseInt(e);
        });
        this.major = t[0], this.minor = t[1];
    }
    function i(e, t, n) {
        var s = "Basic " + btoa(t + ":" + n);
        e.setRequestHeader("Authorization", s);
    }
    function r(e, t, s, o, a) {
        o || (o = n);
        var i = e.substring(e.indexOf("@") + 1);
        c(i, e, t, s, a, function(n, r) {
            n instanceof m || n instanceof h ? c("autodiscover." + i, e, t, s, a, o) : o(n, r);
        });
    }
    function c(e, t, n, s, a, c) {
        var d = new XMLHttpRequest({
            mozSystem: !0,
            mozAnon: !0
        });
        d.open("POST", "https://" + e + "/autodiscover/autodiscover.xml", !0), i(d, t, n), 
        d.setRequestHeader("Content-Type", "text/xml"), d.timeout = s, d.upload.onprogress = d.upload.onload = function() {
            d.timeout = 0;
        }, d.onload = function() {
            if (d.status < 200 || d.status >= 300) return c(new h(d.statusText, d.status));
            var e = Math.random();
            self.postMessage({
                uid: e,
                type: "configparser",
                cmd: "accountactivesync",
                args: [ d.responseText ]
            }), self.addEventListener("message", function t(o) {
                var a = o.data;
                if ("configparser" == a.type && "accountactivesync" == a.cmd && a.uid == e) {
                    self.removeEventListener(o.type, t);
                    var i = a.args, d = i[0], l = i[1], u = i[2];
                    l ? c(new m(l), d) : u ? r(u, n, s, c, !0) : c(null, d);
                }
            });
        }, d.ontimeout = d.onerror = function() {
            c(new h("Error getting Autodiscover URL", null));
        };
        var l = '<?xml version="1.0" encoding="utf-8"?>\n<Autodiscover xmlns="' + o("rq") + '">\n' + "  <Request>\n" + "    <EMailAddress>" + t + "</EMailAddress>\n" + "    <AcceptableResponseSchema>" + o("ms") + "</AcceptableResponseSchema>\n" + "  </Request>\n" + "</Autodiscover>";
        d.send(l);
    }
    function d(e, t) {
        this._deviceId = e || "v140Device", this._deviceType = t || "SmartPhone", this.timeout = 0, 
        this._connected = !1, this._waitingForConnection = !1, this._connectionError = null, 
        this._connectionCallbacks = [], this.baseUrl = null, this._username = null, this._password = null, 
        this.versions = [], this.supportedCommands = [], this.currentVersion = null, this.onmessage = null;
    }
    var l = {}, u = s("ActiveSync.AutodiscoverError");
    l.AutodiscoverError = u;
    var m = s("ActiveSync.AutodiscoverDomainError", u);
    l.AutodiscoverDomainError = m;
    var h = s("ActiveSync.HttpError", null, [ "status" ]);
    return l.HttpError = h, l.Version = a, a.prototype = {
        eq: function(e) {
            return e instanceof a || (e = new a(e)), this.major === e.major && this.minor === e.minor;
        },
        ne: function(e) {
            return !this.eq(e);
        },
        gt: function(e) {
            return e instanceof a || (e = new a(e)), this.major > e.major || this.major === e.major && this.minor > e.minor;
        },
        gte: function(e) {
            return e instanceof a || (e = new a(e)), this.major >= e.major || this.major === e.major && this.minor >= e.minor;
        },
        lt: function(e) {
            return !this.gte(e);
        },
        lte: function(e) {
            return !this.gt(e);
        },
        toString: function() {
            return this.major + "." + this.minor;
        }
    }, l.autodiscover = r, l.Connection = d, d.prototype = {
        _notifyConnected: function(e) {
            e && this.disconnect();
            for (var t in Iterator(this._connectionCallbacks)) {
                var n = t[1];
                n.apply(n, arguments);
            }
            this._connectionCallbacks = [];
        },
        get connected() {
            return this._connected;
        },
        open: function(e, t, n) {
            var s = "/Microsoft-Server-ActiveSync";
            this.baseUrl = e, this.baseUrl.endsWith(s) || (this.baseUrl += s), this._username = t, 
            this._password = n;
        },
        connect: function(e) {
            return this.connected ? (e && e(null), void 0) : (e && this._connectionCallbacks.push(e), 
            this._waitingForConnection || (this._waitingForConnection = !0, this._connectionError = null, 
            this.getOptions(function(e, t) {
                return this._waitingForConnection = !1, this._connectionError = e, e ? (console.error("Error connecting to ActiveSync:", e), 
                this._notifyConnected(e, t)) : (this._connected = !0, this.versions = t.versions, 
                this.supportedCommands = t.commands, this.currentVersion = new a(t.versions.slice(-1)[0]), 
                this._notifyConnected(null, t));
            }.bind(this))), void 0);
        },
        disconnect: function() {
            if (this._waitingForConnection) throw new Error("Can't disconnect while waiting for server response");
            this._connected = !1, this.versions = [], this.supportedCommands = [], this.currentVersion = null;
        },
        provision: function(n) {
            var s = t.Provision.Tags, o = new e.Writer("1.3", 1, "UTF-8");
            o.stag(s.Provision).etag(), this.postCommand(o, n);
        },
        getOptions: function(e) {
            e || (e = n);
            var t = this, s = new XMLHttpRequest({
                mozSystem: !0,
                mozAnon: !0
            });
            s.open("OPTIONS", this.baseUrl, !0), i(s, this._username, this._password), s.timeout = this.timeout, 
            s.upload.onprogress = s.upload.onload = function() {
                s.timeout = 0;
            }, s.onload = function() {
                if (s.status < 200 || s.status >= 300) return console.error("ActiveSync options request failed with response " + s.status), 
                t.onmessage && t.onmessage("options", "error", s, null, null, null, null), e(new h(s.statusText, s.status)), 
                void 0;
                var n = {
                    versions: s.getResponseHeader("MS-ASProtocolVersions").split(/\s*,\s*/),
                    commands: s.getResponseHeader("MS-ASProtocolCommands").split(/\s*,\s*/)
                };
                t.onmessage && t.onmessage("options", "ok", s, null, null, null, n), e(null, n);
            }, s.ontimeout = s.onerror = function() {
                var n = new Error("Error getting OPTIONS URL");
                console.error(n), t.onmessage && t.onmessage("options", "timeout", s, null, null, null, null), 
                e(n);
            }, s.responseType = "text", s.send();
        },
        supportsCommand: function(e) {
            if (!this.connected) throw new Error("Connection required to get command");
            return "number" == typeof e && (e = t.__tagnames__[e]), -1 !== this.supportedCommands.indexOf(e);
        },
        doCommand: function() {
            console.warn("doCommand is deprecated. Use postCommand instead."), this.postCommand.apply(this, arguments);
        },
        postCommand: function(e, n, s, o, a) {
            var i = "application/vnd.ms-sync.wbxml";
            if ("string" == typeof e || "number" == typeof e) this.postData(e, i, null, n, s, o); else {
                var r = t.__tagnames__[e.rootTag];
                this.postData(r, i, "blob" === e.dataType ? e.blob : e.buffer, n, s, o, a);
            }
        },
        postData: function(n, s, o, a, r, c, d) {
            if ("number" == typeof n && (n = t.__tagnames__[n]), !this.supportsCommand(n)) {
                var l = new Error("This server doesn't support the command " + n);
                return console.error(l), a(l), void 0;
            }
            var u = [ [ "Cmd", n ], [ "User", this._username ], [ "DeviceId", this._deviceId ], [ "DeviceType", this._deviceType ] ];
            if (r) {
                for (var m in Iterator(u)) {
                    var p = m[1];
                    if (p[0] in r) throw new TypeError("reserved URL parameter found");
                }
                for (var f in Iterator(r)) u.push(f);
            }
            var g = u.map(function(e) {
                return encodeURIComponent(e[0]) + "=" + encodeURIComponent(e[1]);
            }).join("&"), v = new XMLHttpRequest({
                mozSystem: !0,
                mozAnon: !0
            });
            if (v.open("POST", this.baseUrl + "?" + g, !0), i(v, this._username, this._password), 
            v.setRequestHeader("MS-ASProtocolVersion", this.currentVersion), v.setRequestHeader("Content-Type", s), 
            c) for (var m in Iterator(c)) {
                var y = m[0], y = m[1];
                v.setRequestHeader(y, value);
            }
            v.timeout = this.timeout, v.upload.onprogress = v.upload.onload = function() {
                v.timeout = 0;
            }, v.onprogress = function(e) {
                d && d(e.loaded, e.total);
            };
            var _ = this, b = arguments;
            v.onload = function() {
                if (451 === v.status) return _.baseUrl = v.getResponseHeader("X-MS-Location"), _.onmessage && _.onmessage(n, "redirect", v, u, c, o, null), 
                _.postData.apply(_, b), void 0;
                if (v.status < 200 || v.status >= 300) return console.error("ActiveSync command " + n + " failed with " + "response " + v.status), 
                _.onmessage && _.onmessage(n, "error", v, u, c, o, null), a(new h(v.statusText, v.status)), 
                void 0;
                var s = null;
                v.response.byteLength > 0 && (s = new e.Reader(new Uint8Array(v.response), t)), 
                _.onmessage && _.onmessage(n, "ok", v, u, c, o, s), a(null, s);
            }, v.ontimeout = v.onerror = function() {
                var e = new Error("Error getting command URL");
                console.error(e), _.onmessage && _.onmessage(n, "timeout", v, u, c, o, null), a(e);
            }, v.responseType = "arraybuffer", v.send(o);
        }
    }, l;
});