function consoleHelper() {
    for (var e = arguments[0] + ":", t = 1; t < arguments.length; t++) e += " " + arguments[t];
    e += "[0m\n", dump(e);
}

var requirejs, require, define;

(function(global, undef) {
    function hasProp(e, t) {
        return hasOwn.call(e, t);
    }
    function getOwn(e, t) {
        return e && hasProp(e, t) && e[t];
    }
    function eachProp(e, t) {
        var n;
        for (n in e) if (hasProp(e, n) && t(e[n], n)) break;
    }
    function mixin(e, t, n, s) {
        return t && eachProp(t, function(t, i) {
            (n || !hasProp(e, i)) && (!s || "object" != typeof t || !t || Array.isArray(t) || "function" == typeof t || t instanceof RegExp ? e[i] = t : (e[i] || (e[i] = {}), 
            mixin(e[i], t, n, s)));
        }), e;
    }
    function getGlobal(e) {
        if (!e) return e;
        var t = global;
        return e.split(".").forEach(function(e) {
            t = t[e];
        }), t;
    }
    function newContext(e) {
        function t(e) {
            var t, n, s = e.length;
            for (t = 0; s > t; t++) if (n = e[t], "." === n) e.splice(t, 1), t -= 1; else if (".." === n) {
                if (1 === t && (".." === e[2] || ".." === e[0])) break;
                t > 0 && (e.splice(t - 1, 2), t -= 2);
            }
        }
        function n(e, n, s) {
            var i, o, r, a, c, d, l, u, h, p, f, m = n && n.split("/"), g = m, _ = M.map, y = _ && _["*"];
            if (e && "." === e.charAt(0) && (n ? (g = m.slice(0, m.length - 1), e = e.split("/"), 
            l = e.length - 1, M.nodeIdCompat && jsSuffixRegExp.test(e[l]) && (e[l] = e[l].replace(jsSuffixRegExp, "")), 
            e = g.concat(e), t(e), e = e.join("/")) : 0 === e.indexOf("./") && (e = e.substring(2))), 
            s && _ && (m || y)) {
                r = e.split("/");
                e: for (a = r.length; a > 0; a -= 1) {
                    if (d = r.slice(0, a).join("/"), m) for (c = m.length; c > 0; c -= 1) if (o = getOwn(_, m.slice(0, c).join("/")), 
                    o && (o = getOwn(o, d))) {
                        u = o, h = a;
                        break e;
                    }
                    !p && y && getOwn(y, d) && (p = getOwn(y, d), f = a);
                }
                !u && p && (u = p, h = f), u && (r.splice(0, h, u), e = r.join("/"));
            }
            return i = getOwn(M.pkgs, e), i ? i : e;
        }
        function s(e) {
            function t() {
                var t;
                return e.init && (t = e.init.apply(global, arguments)), t || e.exports && getGlobal(e.exports);
            }
            return t;
        }
        function i(e) {
            var t, n, s, i;
            for (t = 0; t < queue.length; t += 1) {
                if ("string" != typeof queue[t][0]) {
                    if (!e) break;
                    queue[t].unshift(e), e = undef;
                }
                s = queue.shift(), n = s[0], t -= 1, hasProp(k, n) || hasProp(O, n) || (hasProp(B, n) ? w.apply(undef, s) : O[n] = s);
            }
            e && (i = getOwn(M.shim, e) || {}, w(e, i.deps || [], i.exportsFn));
        }
        function o(e, t) {
            var s = function(n, o, r, a) {
                var c, d;
                if (t && i(), "string" == typeof n) {
                    if (T[n]) return T[n](e);
                    if (c = E(n, e, !0).id, !hasProp(k, c)) throw new Error("Not loaded: " + c);
                    return k[c];
                }
                return n && !Array.isArray(n) && (d = n, n = undef, Array.isArray(o) && (n = o, 
                o = r, r = a), t) ? s.config(d)(n, o, r) : (o = o || function() {}, prim.nextTick(function() {
                    i(), w(undef, n || [], o, r, e);
                }), s);
            };
            return s.isBrowser = "undefined" != typeof document && "undefined" != typeof navigator, 
            s.nameToUrl = function(e, t, n) {
                var i, o, r, a, c, d, l, u = getOwn(M.pkgs, e);
                if (u && (e = u), l = getOwn(G, e)) return s.nameToUrl(l, t, n);
                if (urlRegExp.test(e)) c = e + (t || ""); else {
                    for (i = M.paths, o = e.split("/"), r = o.length; r > 0; r -= 1) if (a = o.slice(0, r).join("/"), 
                    d = getOwn(i, a)) {
                        Array.isArray(d) && (d = d[0]), o.splice(0, r, d);
                        break;
                    }
                    c = o.join("/"), c += t || (/^data\:|\?/.test(c) || n ? "" : ".js"), c = ("/" === c.charAt(0) || c.match(/^[\w\+\.\-]+:/) ? "" : M.baseUrl) + c;
                }
                return M.urlArgs ? c + ((-1 === c.indexOf("?") ? "?" : "&") + M.urlArgs) : c;
            }, s.toUrl = function(t) {
                var i, o = t.lastIndexOf("."), r = t.split("/")[0], a = "." === r || ".." === r;
                return -1 !== o && (!a || o > 1) && (i = t.substring(o, t.length), t = t.substring(0, o)), 
                s.nameToUrl(n(t, e), i, !0);
            }, s.defined = function(t) {
                return hasProp(k, E(t, e, !0).id);
            }, s.specified = function(t) {
                return t = E(t, e, !0).id, hasProp(k, t) || hasProp(B, t);
            }, s;
        }
        function r(e, t, n) {
            e && (k[e] = n, requirejs.onResourceLoad && requirejs.onResourceLoad(x, t.map, t.deps)), 
            t.finished = !0, t.resolve(n);
        }
        function a(e, t) {
            e.finished = !0, e.rejected = !0, e.reject(t);
        }
        function c(e) {
            return function(t) {
                return n(t, e, !0);
            };
        }
        function d(e) {
            var t = e.map.id, n = e.factory.apply(k[t], e.values);
            t ? n === undef && (e.cjsModule ? n = e.cjsModule.exports : e.usingExports && (n = k[t])) : D.splice(D.indexOf(e), 1), 
            r(t, e, n);
        }
        function l(e, t) {
            this.rejected || this.depDefined[t] || (this.depDefined[t] = !0, this.depCount += 1, 
            this.values[t] = e, this.depending || this.depCount !== this.depMax || d(this));
        }
        function u(e) {
            var t = {};
            return t.promise = prim(function(e, n) {
                t.resolve = e, t.reject = n;
            }), t.map = e ? E(e, null, !0) : {}, t.depCount = 0, t.depMax = 0, t.values = [], 
            t.depDefined = [], t.depFinished = l, t.map.pr && (t.deps = [ E(t.map.pr) ]), t;
        }
        function h(e) {
            var t;
            return e ? (t = hasProp(B, e) && B[e], t || (t = B[e] = u(e))) : (t = u(), D.push(t)), 
            t;
        }
        function p(e, t) {
            return function(n) {
                e.rejected || (n.dynaId || (n.dynaId = "id" + (H += 1), n.requireModules = [ t ]), 
                a(e, n));
            };
        }
        function f(e, t, n, s) {
            n.depMax += 1, A(e, t).then(function(e) {
                n.depFinished(e, s);
            }, p(n, e.id)).catch(p(n, n.map.id));
        }
        function m(e) {
            function t(t) {
                n || r(e, h(e), t);
            }
            var n;
            return t.error = function(t) {
                h(e).reject(t);
            }, t.fromText = function(t, s) {
                var o = h(e), r = E(E(e).n), c = r.id;
                n = !0, o.factory = function(e, t) {
                    return t;
                }, s && (t = s), hasProp(M.config, e) && (M.config[c] = M.config[e]);
                try {
                    S.exec(t);
                } catch (d) {
                    a(o, new Error("fromText eval for " + c + " failed: " + d));
                }
                i(c), o.deps = [ r ], f(r, null, o, o.deps.length);
            }, t;
        }
        function g(e, t, n) {
            e.load(t.n, o(n), m(t.id), {});
        }
        function _(e) {
            var t, n = e ? e.indexOf("!") : -1;
            return n > -1 && (t = e.substring(0, n), e = e.substring(n + 1, e.length)), [ t, e ];
        }
        function y(e, t, n) {
            var s = e.map.id;
            t[s] = !0, !e.finished && e.deps && e.deps.forEach(function(s) {
                var i = s.id, o = !hasProp(T, i) && h(i);
                !o || o.finished || n[i] || (hasProp(t, i) ? e.deps.forEach(function(t, n) {
                    t.id === i && e.depFinished(k[i], n);
                }) : y(o, t, n));
            }), n[s] = !0;
        }
        function v(e) {
            var t, n = [], s = 1e3 * M.waitSeconds, i = s && P + s < new Date().getTime();
            0 === F && (e ? e.finished || y(e, {}, {}) : D.length && D.forEach(function(e) {
                y(e, {}, {});
            })), i ? (eachProp(B, function(e) {
                e.finished || n.push(e.map.id);
            }), t = new Error("Timeout for modules: " + n), t.requireModules = n, S.onError(t)) : (F || D.length) && (I || (I = !0, 
            prim.nextTick(function() {
                I = !1, v();
            })));
        }
        function b(e) {
            prim.nextTick(function() {
                e.dynaId && U[e.dynaId] || (U[e.dynaId] = !0, S.onError(e));
            });
        }
        var S, w, E, A, T, I, C, x, k = {}, O = {}, M = {
            waitSeconds: 7,
            baseUrl: "./",
            paths: {},
            bundles: {},
            pkgs: {},
            shim: {},
            config: {}
        }, N = {}, D = [], B = {}, L = {}, R = {}, F = 0, P = new Date().getTime(), H = 0, U = {}, q = {}, G = {};
        return C = "function" == typeof importScripts ? function(e) {
            var t = e.url;
            q[t] || (q[t] = !0, h(e.id), importScripts(t), i(e.id));
        } : function(e) {
            var t, n = e.id, s = e.url;
            q[s] || (q[s] = !0, t = document.createElement("script"), t.setAttribute("data-requiremodule", n), 
            t.type = M.scriptType || "text/javascript", t.charset = "utf-8", t.async = !0, F += 1, 
            t.addEventListener("load", function() {
                F -= 1, i(n);
            }, !1), t.addEventListener("error", function() {
                F -= 1;
                var e, s = getOwn(M.paths, n), i = getOwn(B, n);
                s && Array.isArray(s) && s.length > 1 ? (t.parentNode.removeChild(t), s.shift(), 
                i.map = E(n), C(i.map)) : (e = new Error("Load failed: " + n + ": " + t.src), e.requireModules = [ n ], 
                h(n).reject(e));
            }, !1), t.src = s, document.head.appendChild(t));
        }, A = function(e, t) {
            var n, s, i = e.id, o = M.shim[i];
            if (hasProp(O, i)) n = O[i], delete O[i], w.apply(undef, n); else if (!hasProp(B, i)) if (e.pr) {
                if (!(s = getOwn(G, i))) return A(E(e.pr)).then(function(e) {
                    var n = E(i, t, !0), s = n.id, o = getOwn(M.shim, s);
                    return hasProp(R, s) || (R[s] = !0, o && o.deps ? S(o.deps, function() {
                        g(e, n, t);
                    }) : g(e, n, t)), h(s).promise;
                });
                e.url = S.nameToUrl(s), C(e);
            } else o && o.deps ? S(o.deps, function() {
                C(e);
            }) : C(e);
            return h(i).promise;
        }, E = function(e, t, s) {
            if ("string" != typeof e) return e;
            var i, o, r, a, d, l = e + " & " + (t || "") + " & " + !!s;
            return r = _(e), a = r[0], e = r[1], !a && hasProp(N, l) ? N[l] : (a && (a = n(a, t, s), 
            i = hasProp(k, a) && k[a]), a ? e = i && i.normalize ? i.normalize(e, c(t)) : n(e, t, s) : (e = n(e, t, s), 
            r = _(e), a = r[0], e = r[1], o = S.nameToUrl(e)), d = {
                id: a ? a + "!" + e : e,
                n: e,
                pr: a,
                url: o
            }, a || (N[l] = d), d);
        }, T = {
            require: function(e) {
                return o(e);
            },
            exports: function(e) {
                var t = k[e];
                return "undefined" != typeof t ? t : k[e] = {};
            },
            module: function(e) {
                return {
                    id: e,
                    uri: "",
                    exports: T.exports(e),
                    config: function() {
                        return getOwn(M.config, e) || {};
                    }
                };
            }
        }, w = function(e, t, n, s, i) {
            if (!e || !hasProp(L, e)) {
                L[e] = !0;
                var o = h(e);
                t && !Array.isArray(t) && (n = t, t = []), o.promise.catch(s || b), i = i || e, 
                "function" == typeof n ? (!t.length && n.length && (n.toString().replace(commentRegExp, "").replace(cjsRequireRegExp, function(e, n) {
                    t.push(n);
                }), t = (1 === n.length ? [ "require" ] : [ "require", "exports", "module" ]).concat(t)), 
                o.factory = n, o.deps = t, o.depending = !0, t.forEach(function(n, s) {
                    var r;
                    t[s] = r = E(n, i, !0), n = r.id, "require" === n ? o.values[s] = T.require(e) : "exports" === n ? (o.values[s] = T.exports(e), 
                    o.usingExports = !0) : "module" === n ? o.values[s] = o.cjsModule = T.module(e) : void 0 === n ? o.values[s] = void 0 : f(r, i, o, s);
                }), o.depending = !1, o.depCount === o.depMax && d(o)) : e && r(e, o, n), P = new Date().getTime(), 
                e || v(o);
            }
        }, S = o(null, !0), S.config = function(t) {
            if (t.context && t.context !== e) return newContext(t.context).config(t);
            N = {}, t.baseUrl && "/" !== t.baseUrl.charAt(t.baseUrl.length - 1) && (t.baseUrl += "/");
            var n, i = M.shim, o = {
                paths: !0,
                bundles: !0,
                config: !0,
                map: !0
            };
            return eachProp(t, function(e, t) {
                o[t] ? (M[t] || (M[t] = {}), mixin(M[t], e, !0, !0)) : M[t] = e;
            }), t.bundles && eachProp(t.bundles, function(e, t) {
                e.forEach(function(e) {
                    e !== t && (G[e] = t);
                });
            }), t.shim && (eachProp(t.shim, function(e, t) {
                Array.isArray(e) && (e = {
                    deps: e
                }), !e.exports && !e.init || e.exportsFn || (e.exportsFn = s(e)), i[t] = e;
            }), M.shim = i), t.packages && t.packages.forEach(function(e) {
                var t, n;
                e = "string" == typeof e ? {
                    name: e
                } : e, n = e.name, t = e.location, t && (M.paths[n] = e.location), M.pkgs[n] = e.name + "/" + (e.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "");
            }), n = M.definePrim, n && (O[n] = [ n, [], function() {
                return prim;
            } ]), (t.deps || t.callback) && S(t.deps, t.callback), S;
        }, S.onError = function(e) {
            throw e;
        }, x = {
            id: e,
            defined: k,
            waiting: O,
            config: M,
            deferreds: B
        }, contexts[e] = x, S;
    }
    var prim, topReq, dataMain, src, subPath, bootstrapConfig = requirejs || require, hasOwn = Object.prototype.hasOwnProperty, contexts = {}, queue = [], currDirRegExp = /^\.\//, urlRegExp = /^\/|\:|\?|\.js$/, commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/;
    "function" != typeof requirejs && (function() {
        function e() {
            a = 0;
            var e = d;
            for (d = []; e.length; ) e.shift()();
        }
        function t(t) {
            d.push(t), a || (a = setTimeout(e, 0));
        }
        function n(e) {
            e();
        }
        function s(e) {
            var t = typeof e;
            return "object" === t || "function" === t;
        }
        function i(e, t) {
            prim.nextTick(function() {
                e.forEach(function(e) {
                    e(t);
                });
            });
        }
        function o(e, t, n) {
            e.hasOwnProperty("v") ? prim.nextTick(function() {
                n(e.v);
            }) : t.push(n);
        }
        function r(e, t, n) {
            e.hasOwnProperty("e") ? prim.nextTick(function() {
                n(e.e);
            }) : t.push(n);
        }
        var a, c, d = [];
        c = "function" == typeof setImmediate ? setImmediate.bind() : "undefined" != typeof process && process.nextTick ? process.nextTick : "undefined" != typeof setTimeout ? t : n, 
        prim = function l(e) {
            function t() {
                function e(e, d, l) {
                    if (!a) {
                        if (a = !0, n === e) return a = !1, o.reject(new TypeError("value is same promise")), 
                        void 0;
                        try {
                            var u = e && e.then;
                            s(e) && "function" == typeof u ? (r = t(), u.call(e, r.resolve, r.reject)) : (c[d] = e, 
                            i(l, e));
                        } catch (h) {
                            a = !1, o.reject(h);
                        }
                    }
                }
                var o, r, a = !1;
                return o = {
                    resolve: function(t) {
                        e(t, "v", d);
                    },
                    reject: function(t) {
                        e(t, "e", u);
                    }
                };
            }
            var n, a, c = {}, d = [], u = [];
            a = t(), n = {
                then: function(e, t) {
                    var n = l(function(n, s) {
                        function i(e, t, i) {
                            try {
                                e && "function" == typeof e ? (i = e(i), n(i)) : t(i);
                            } catch (o) {
                                s(o);
                            }
                        }
                        o(c, d, i.bind(void 0, e, n)), r(c, u, i.bind(void 0, t, s));
                    });
                    return n;
                },
                "catch": function(e) {
                    return n.then(null, e);
                }
            };
            try {
                e(a.resolve, a.reject);
            } catch (h) {
                a.reject(h);
            }
            return n;
        }, prim.resolve = function(e) {
            return prim(function(t) {
                t(e);
            });
        }, prim.reject = function(e) {
            return prim(function(t, n) {
                n(e);
            });
        }, prim.cast = function(e) {
            return s(e) && "then" in e ? e : prim(function(t, n) {
                e instanceof Error ? n(e) : t(e);
            });
        }, prim.all = function(e) {
            return prim(function(t, n) {
                function s(e, n) {
                    r[e] = n, i += 1, i === o && t(r);
                }
                var i = 0, o = e.length, r = [];
                e.forEach(function(e, t) {
                    prim.cast(e).then(function(e) {
                        s(t, e);
                    }, function(e) {
                        n(e);
                    });
                });
            });
        }, prim.nextTick = c;
    }(), requirejs = topReq = newContext("_"), "function" != typeof require && (require = topReq), 
    topReq.exec = function(text) {
        return eval(text);
    }, topReq.contexts = contexts, define = function() {
        queue.push([].slice.call(arguments, 0));
    }, define.amd = {
        jQuery: !0
    }, bootstrapConfig && topReq.config(bootstrapConfig), topReq.isBrowser && !contexts._.config.skipDataMain && (dataMain = document.querySelectorAll("script[data-main]")[0], 
    dataMain = dataMain && dataMain.getAttribute("data-main"), dataMain && (dataMain = dataMain.replace(jsSuffixRegExp, ""), 
    bootstrapConfig && bootstrapConfig.baseUrl || (src = dataMain.split("/"), dataMain = src.pop(), 
    subPath = src.length ? src.join("/") + "/" : "./", topReq.config({
        baseUrl: subPath
    })), topReq([ dataMain ]))));
})(this), define("alameda", function() {});

var window = self;

window.console = {
    log: consoleHelper.bind(null, "[32mWLOG"),
    error: consoleHelper.bind(null, "[31mWERR"),
    info: consoleHelper.bind(null, "[36mWINF"),
    warn: consoleHelper.bind(null, "[33mWWAR")
};

var document = {
    cookie: null
};

define("mailapi/worker-bootstrap", function() {}), require.config({
    waitSeconds: 0,
    baseUrl: "..",
    paths: {
        mailcomposer: "mailapi/composer",
        wbxml: "mailapi/activesync/protocollayer",
        "activesync/codepages": "mailapi/activesync/protocollayer",
        "activesync/protocol": "mailapi/activesync/protocollayer",
        "activesync/codepages/FolderHierarchy": "mailapi/activesync/configurator",
        "activesync/codepages/ComposeMail": "mailapi/activesync/configurator",
        "activesync/codepages/AirSync": "mailapi/activesync/configurator",
        "activesync/codepages/AirSyncBase": "mailapi/activesync/configurator",
        "activesync/codepages/ItemEstimate": "mailapi/activesync/configurator",
        "activesync/codepages/Email": "mailapi/activesync/configurator",
        "activesync/codepages/ItemOperations": "mailapi/activesync/configurator",
        "activesync/codepages/Move": "mailapi/activesync/configurator",
        "mailapi/htmlchew": "mailapi/chewlayer",
        "mailapi/quotechew": "mailapi/chewlayer",
        "mailapi/mailchew": "mailapi/chewlayer",
        "mailapi/imap/imapchew": "mailapi/chewlayer",
        "mailapi/imap/protocol/sync": "mailapi/imap/protocollayer",
        "mailapi/imap/protocol/textparser": "mailapi/imap/protocollayer",
        "mailapi/imap/protocol/snippetparser": "mailapi/imap/protocollayer",
        "mailapi/imap/protocol/bodyfetcher": "mailapi/imap/protocollayer",
        tls: "mailapi/smtp/probe",
        imap: "mailapi/imap/probe",
        "simplesmtp/lib/client": "mailapi/smtp/probe"
    },
    scriptType: "application/javascript;version=1.8",
    definePrim: "prim"
}), define("q", [ "prim" ], function(e) {
    return {
        defer: e
    };
}), define("config", function() {}), define("buffer", [ "require", "exports", "module" ], function(e, t) {
    function n(e) {
        return e = ~~Math.ceil(+e), 0 > e ? 0 : e;
    }
    function s(e) {
        for (var t = 0, n = 0, s = 0, i = new Uint8Array(Math.ceil(3 * e.length / 4)), o = 0; o < e.length; o++) {
            var r, a = e.charCodeAt(o);
            if (a >= 65 && 90 >= a) r = a - 65; else if (a >= 97 && 122 >= a) r = a - 97 + 26; else if (a >= 48 && 57 >= a) r = a - 48 + 52; else if (43 === a) r = 62; else {
                if (47 !== a) {
                    if (61 === a) {
                        n = 0;
                        continue;
                    }
                    continue;
                }
                r = 63;
            }
            t = t << 6 | r, n += 6, n >= 8 && (n -= 8, i[s++] = t >> n, 2 === n ? t &= 3 : 4 === n && (t &= 15));
        }
        return s < i.length ? i.subarray(0, s) : i;
    }
    function i(e, t) {
        var n, i;
        switch (t) {
          case "base64":
            return n = s(e);

          case "binary":
            for (n = new Uint8Array(e.length), i = 0; i < e.length; i++) n[i] = e.charCodeAt(i);
            return n;

          case "hex":
            for (n = new Uint8Array(2 * e.length), i = 0; i < e.length; i++) {
                var o, r = e.charCodeAt(i);
                o = r >> 4, n[2 * i] = 10 > o ? o + 48 : o - 10 + 97, o = 15 & r, n[2 * i + 1] = 10 > o ? o + 48 : o - 10 + 97;
            }
            return n;

          case "utf8":
            t = "utf-8";

          default:
            return t || (t = "utf-8"), new TextEncoder(t, a).encode(e);
        }
    }
    function o(e, t) {
        var n, s;
        switch (t) {
          case "base64":
          case "binary":
            for (n = new Array(e.length), s = 0; s < e.length; s++) n[s] = String.fromCharCode(e[s]);
            return "base64" === t ? window.btoa(n.join("")) : n.join("");

          case "hex":
            for (n = new Array(e.length / 2), s = 0; s < e.length; s += 2) {
                var i, o = e[s];
                i = 57 >= o ? 16 * (o - 48) : 97 > o ? 16 * (o - 64 + 10) : 16 * (o - 97 + 10), 
                o = e[s + 1], i += 57 >= o ? o - 48 : 97 > o ? o - 64 + 10 : o - 97 + 10, n.push(String.fromCharCode(i));
            }
            return n.join("");

          case "utf8":
            t = "utf-8";

          default:
            return t || (t = "utf-8"), new TextDecoder(t, a).decode(e);
        }
    }
    function r(e, t, s) {
        var o, r;
        if ("number" == typeof s) o = e.subarray(s, n(t) + s); else switch (r = typeof e) {
          case "number":
            o = new Uint8Array(n(e));
            break;

          case "string":
            o = i(e, t);
            break;

          case "object":
            o = o instanceof Uint8Array ? e : new Uint8Array(e);
            break;

          default:
            throw new Error("First argument needs to be a number, array or string.");
        }
        return o;
    }
    var a = {
        fatal: !1
    };
    t.Buffer = r, r.byteLength = function(e, t) {
        var n = i(e, t);
        return n.length;
    }, r.isBuffer = function(e) {
        return e instanceof Uint8Array && e.copy === c.copy;
    };
    var c = Uint8Array.prototype;
    c.copy = function(e, t, n, s) {
        var i = this;
        if (n || (n = 0), s || (s = this.length), t || (t = 0), n > s) throw new Error("sourceEnd < sourceStart");
        if (s !== n && 0 != e.length && 0 != i.length) {
            if (0 > t || t >= e.length) throw new Error("targetStart out of bounds");
            if (0 > n || n >= i.length) throw new Error("sourceStart out of bounds");
            if (0 > s || s > i.length) throw new Error("sourceEnd out of bounds");
            s > this.length && (s = this.length), e.length - t < s - n && (s = e.length - t + n);
            for (var o = n; s > o; o++) e[o + t] = this[o];
        }
    }, c.slice = function(e, t) {
        if (void 0 === t && (t = this.length), t > this.length) throw new Error("oob");
        if (e > t) throw new Error("oob");
        return r(this, t - e, +e);
    }, c.toString = function(e, t, n) {
        return e = String(e || "utf-8").toLowerCase(), t = +t || 0, "undefined" == typeof n && (n = this.length), 
        +n == t ? "" : 0 === t && n === this.length ? o(this, e) : o(this.subarray(t, n), e);
    }, c.write = function(e, t, n, s) {
        if (isFinite(t)) isFinite(n) || (s = n, n = void 0); else {
            var o = s;
            s = t, t = n, n = o;
        }
        t = +t || 0;
        var r = this.length - t;
        n ? (n = +n, n > r && (n = r)) : n = r, s = String(s || "utf-8").toLowerCase();
        for (var a = i(e, s), c = 0; c < a.length; c++) this[c + t] = a[c];
        return a.length;
    };
}), function() {
    function e(e) {
        setTimeout(e);
    }
    window.setZeroTimeout = e, window.process = {
        immediate: !1,
        nextTick: function(e) {
            this.immediate ? e() : window.setZeroTimeout(e);
        }
    };
}(), define("mailapi/shim-sham", [ "buffer" ], function(e) {
    window.Buffer = e.Buffer;
}), define("event-queue", [ "require" ], function() {
    return {
        enqueue: function(e) {
            setTimeout(function() {
                try {
                    e();
                } catch (t) {
                    throw console.error("exception in enqueued task: " + t), MAGIC_ERROR_TRAPPER && MAGIC_ERROR_TRAPPER.yoAnError(t), 
                    t;
                }
            }, 0);
        }
    };
}), define("microtime", [ "require" ], function() {
    return window && window.performance && window.performance.now ? {
        now: function() {
            return 1e3 * window.performance.now();
        }
    } : {
        now: function() {
            return 1e3 * Date.now();
        }
    };
}), define("rdcommon/extransform", [ "require", "exports" ], function(e, t) {
    function n(e) {
        if (!e) return e;
        if (e.length > 96) {
            var t = e.lastIndexOf("/");
            if (-1 !== t) return e.substring(t + 1);
        }
        return s && e.substring(0, s.length) === s ? e.substring(s.length) : e;
    }
    var s;
    Error.prepareStackTrace = function(e, t) {
        for (var s = [], i = 0; i < t.length; i++) {
            var o = t[i];
            s.push({
                filename: n(o.getFileName()),
                lineNo: o.getLineNumber(),
                funcName: o.getFunctionName()
            });
        }
        return s;
    }, Error.captureStackTrace || (Error.captureStackTrace = function(e) {
        try {
            throw new Error();
        } catch (t) {
            for (var s, o = t.stack.split("\n"), r = e.stack = [], a = 0; a < o.length; a++) (s = i.exec(o[a])) && r.push({
                filename: n(s[2]),
                lineNo: s[3],
                funcName: s[1]
            });
        }
    });
    var i = /^(.*)@(.+):(\d+)$/;
    t.transformException = function(e) {
        if (!(e instanceof Error || e && "object" == typeof e && "stack" in e)) return {
            n: "Object",
            m: "" + e,
            f: []
        };
        var t = e.stack;
        if (Array.isArray(t)) return {
            n: e.name,
            m: e.message,
            f: t
        };
        var s = {
            n: e.name,
            m: e.message,
            f: []
        };
        if (t) for (var o, r = t.split("\n"), a = s.f, c = 0; c < r.length; c++) (o = i.exec(r[c])) && a.push({
            filename: n(o[2]),
            lineNo: o[3],
            funcName: o[1]
        }); else e.filename && s.f.push({
            filename: e.filename,
            lineNo: e.lineNumber,
            funcName: ""
        });
        return s;
    };
}), define("rdcommon/log", [ "q", "microtime", "./extransform", "exports" ], function(e, t, n, s) {
    function i() {}
    function o(e, t, n) {
        if (null == e || "object" != typeof e) return e;
        n || (n = 0);
        var s = n + 1, i = 64;
        if (t && "tostring" === t) {
            if (Array.isArray(e)) return e.join("");
            if ("string" != typeof e) return e.toString();
        }
        var r = {};
        for (var a in e) {
            var c = e[a];
            switch (typeof c) {
              case "string":
                r[a] = i && c.length > i ? "OMITTED STRING, originally " + c.length + " bytes long" : c;
                break;

              case "object":
                r[a] = null == c || Array.isArray(c) || "toJSON" in c || n >= 2 ? c : o(c, null, s);
                break;

              default:
                r[a] = c;
            }
        }
        return r;
    }
    function r(e, t, n) {
        var s, i = 0, o = 0, r = n - 1;
        "toJSON" in e && (e = e.toJSON()), "toJSON" in t && (t = t.toJSON());
        for (s in e) {
            if (i++, !(s in t)) return !1;
            if (n) {
                if (!a(e[s], t[s], r)) return !1;
            } else if (e[s] !== t[s]) return !1;
        }
        for (s in t) o++;
        return i !== o ? !1 : !0;
    }
    function a(e, t, n) {
        var s = typeof e, i = typeof t;
        if ("object" !== s || i !== s || null == e || null == t) return e === t;
        if (e === t) return !0;
        if (Array.isArray(e)) {
            if (!Array.isArray(t)) return !1;
            if (e.length !== t.length) return !1;
            for (var o = 0; o < e.length; o++) if (!a(e[o], t[o], n - 1)) return !1;
            return !0;
        }
        return r(e, t, n);
    }
    function c(e) {
        return function() {
            this._ignore || (this._ignore = {}), this._ignore[e] = !0;
        };
    }
    function d(e, t) {
        this.moduleFab = e, this.name = t, this._latchedVars = [];
        var n = this.dummyProto = Object.create(m);
        n.__defName = t, n.__latchedVars = this._latchedVars, n.__FAB = this.moduleFab;
        var s = this.logProto = Object.create(g);
        s.__defName = t, s.__latchedVars = this._latchedVars, s.__FAB = this.moduleFab;
        var i = this.testLogProto = Object.create(_);
        i.__defName = t, i.__latchedVars = this._latchedVars, i.__FAB = this.moduleFab;
        var o = this.testActorProto = Object.create(b);
        o.__defName = t, this._definedAs = {};
    }
    function l(e, t, n) {
        var s = (t._testActors, t._rawDefs);
        for (var i in n) {
            var o, r, a = n[i];
            s[i] = a;
            for (o in a) if (-1 === w.indexOf(o)) throw new Error("key '" + o + "' is not a legal log def key");
            var c = new d(t, i);
            if ("semanticIdent" in a && c.useSemanticIdent(a.semanticIdent), "stateVars" in a) for (o in a.stateVars) c.addStateVar(o);
            if ("latchState" in a) for (o in a.latchState) c.addLatchedState(o);
            if ("events" in a) {
                var l = null;
                "TEST_ONLY_events" in a && (l = a.TEST_ONLY_events);
                for (o in a.events) r = null, l && l.hasOwnProperty(o) && (r = l[o]), c.addEvent(o, a.events[o], r);
            }
            if ("asyncJobs" in a) {
                var u = null;
                "TEST_ONLY_asyncJobs" in a && (u = a.TEST_ONLY_asyncJobs);
                for (o in a.asyncJobs) r = null, u && u.hasOwnProperty(o) && (r = u[o]), c.addAsyncJob(o, a.asyncJobs[o], r);
            }
            if ("calls" in a) {
                var h = null;
                "TEST_ONLY_calls" in a && (h = a.TEST_ONLY_calls);
                for (o in a.calls) r = null, h && h.hasOwnProperty(o) && (r = h[o]), c.addCall(o, a.calls[o], r);
            }
            if ("errors" in a) for (o in a.errors) c.addError(o, a.errors[o]);
            c.makeFabs();
        }
        return t;
    }
    var u = 0;
    s.getCurrentSeq = function() {
        return u;
    };
    var h = 1, p = -1, f = s.ThingProto = {
        get digitalName() {
            return this.__diginame;
        },
        set digitalName(e) {
            this.__diginame = e;
        },
        toString: function() {
            return "[Thing:" + this.__type + "]";
        },
        toJSON: function() {
            var e = {
                type: this.__type,
                name: this.__name,
                dname: this.__diginame,
                uniqueName: this._uniqueName
            };
            return this.__hardcodedFamily && (e.family = this.__hardcodedFamily), e;
        }
    };
    s.__makeThing = function(e, t, n, s) {
        var i;
        return void 0 === s && (s = f), i = Object.create(s), i.__type = e, i.__name = t, 
        i.__diginame = n, i.__hardcodedFamily = null, i._uniqueName = p--, i;
    };
    var m = {
        _kids: void 0,
        logLevel: "dummy",
        toString: function() {
            return "[DummyLog]";
        },
        toJSON: function() {
            throw new Error("I WAS NOT PLANNING ON BEING SERIALIZED");
        },
        __die: i,
        __updateIdent: i
    }, g = {
        _named: null,
        logLevel: "safe",
        toJSON: function() {
            var e = {
                loggerIdent: this.__defName,
                semanticIdent: this._ident,
                uniqueName: this._uniqueName,
                born: this._born,
                died: this._died,
                events: this._eventMap,
                entries: this._entries,
                kids: this._kids
            };
            if (this.__latchedVars.length) {
                for (var t = this.__latchedVars, n = {}, s = 0; s < t.length; s++) n[t[s]] = this[":" + t[s]];
                e.latched = n;
            }
            return this._named && (e.named = this._named), e;
        },
        __die: function() {
            this._died = t.now(), this.__FAB._onDeath && this.__FAB._onDeath(this);
        },
        __updateIdent: function(e) {
            if (Array.isArray(e)) {
                for (var t = [], n = 0; n < e.length; n++) {
                    var s = e[n];
                    "object" != typeof s || null == s ? t.push(s) : t.push(s._uniqueName);
                }
                e = t;
            }
            this._ident = e;
        }
    }, _ = Object.create(g);
    _.logLevel = "dangerous", _.__unexpectedEntry = function(e, t) {
        var n = [ "!unexpected", t ];
        this._entries[e] = n;
    }, _.__mismatchEntry = function(e, t, n) {
        var s = [ "!mismatch", t, n ];
        this._entries[e] = s;
    }, _.__failedExpectation = function(e) {
        var n = [ "!failedexp", e, t.now(), u++ ];
        this._entries.push(n);
    }, _.__die = function() {
        this._died = t.now();
        var e = this._actor;
        e && (e._expectDeath && (e._expectDeath = !1, e.__loggerFired()), e._lifecycleListener && e._lifecycleListener.call(null, "dead", this.__instance, this));
    };
    var y = "(died)", v = [ y ], b = {
        toString: function() {
            return "[Actor " + this.__defName + ": " + this.__name + "]";
        },
        toJSON: function() {
            return {
                actorIdent: this.__defName,
                semanticIdent: this.__name,
                uniqueName: this._uniqueName,
                parentUniqueName: this._parentUniqueName,
                loggerUniqueName: this._logger ? this._logger._uniqueName : null
            };
        },
        __attachToLogger: function(e) {
            e._actor = this, this._logger = e, this._lifecycleListener && this._lifecycleListener.call(null, "attach", e.__instance, e);
        },
        attachLifecycleListener: function(e) {
            this._lifecycleListener = e;
        },
        asyncEventsAreComingDoNotResolve: function() {
            if (!this._activeForTestStep) throw new Error("Attempt to set expectations on an actor (" + this.__defName + ": " + this.__name + ") that is not " + "participating in this test step!");
            if (this._resolved) throw new Error("Attempt to add expectations when already resolved!");
            if (this._expectDeath) throw new Error("death expectation incompatible with async events");
            this._expectDeath = !0;
        },
        asyncEventsAllDoneDoResolve: function() {
            this._expectDeath = !1, this.__loggerFired();
        },
        expectNothing: function() {
            if (this._expectations.length) throw new Error("Already expecting something this turn! " + JSON.stringify(this._expectations[0]));
            this._expectNothing = !0;
        },
        expectOnly__die: function() {
            if (!this._activeForTestStep) throw new Error("Attempt to set expectations on an actor (" + this.__defName + ": " + this.__name + ") that is not " + "participating in this test step!");
            if (this._resolved) throw new Error("Attempt to add expectations when already resolved!");
            if (this._expectDeath) throw new Error("Already expecting our death!  Are you using asyncEventsAreComingDoNotResolve?");
            this._expectDeath = !0;
        },
        expectUseSetMatching: function() {
            this._unorderedSetMode = !0;
        },
        __prepForTestStep: function(e) {
            this._logger || e.reportPendingActor(this), this._activeForTestStep && this.__resetExpectations(), 
            this._activeForTestStep = !0, this._logger && (this._iEntry = this._logger._entries.length);
        },
        __waitForExpectations: function() {
            return this._expectNothing && (this._expectations.length || this._iExpectation) ? !1 : this._expectationsMetSoFar ? this._iExpectation >= this._expectations.length && (this._expectDeath ? this._logger && this._logger._died : !0) ? (this._resolved = !0, 
            this._expectationsMetSoFar) : (this._deferred || (this._deferred = e.defer()), this._deferred.promise) : !1;
        },
        __stepCleanup: null,
        __resetExpectations: function() {
            this.__stepCleanup && this.__stepCleanup();
            var e = this._expectationsMetSoFar;
            return this._expectationsMetSoFar = !0, this._iExpectation = 0, this._ignore = null, 
            this._expectations.splice(0, this._expectations.length), this._expectNothing = !1, 
            this._expectDeath = !1, this._unorderedSetMode = !1, this._deferred = null, this._resolved = !1, 
            this._activeForTestStep = !1, e;
        },
        __failUnmetExpectations: function() {
            if (this._iExpectation < this._expectations.length && this._logger) for (var e = this._iExpectation; e < this._expectations.length; e++) this._logger.__failedExpectation(this._expectations[e]);
            this._expectDeath && !this._logger._died && this._logger.__failedExpectation(v);
        },
        __loggerFired: function() {
            var e, t, n = this._logger._entries;
            if (this._unorderedSetMode) {
                for (;this._iExpectation < this._expectations.length && this._iEntry < n.length; ) if (t = n[this._iEntry++], 
                !("!" === t[0][0] || this._ignore && this._ignore.hasOwnProperty(t[0]))) {
                    for (var s = !1, i = this._iExpectation; i < this._expectations.length; i++) if (e = this._expectations[i], 
                    e[0] === t[0] && this["_verify_" + e[0]](e, t)) {
                        i !== this._iExpectation && (this._expectations[i] = this._expectations[this._iExpectation], 
                        this._expectations[this._iExpectation] = e), this._iExpectation++, s = !0;
                        break;
                    }
                    s || (this._logger.__unexpectedEntry(this._iEntry - 1, t), this._expectationsMetSoFar = !1, 
                    this._deferred && this._deferred.reject([ this.__defName, e, t ]));
                }
                return this._iExpectation === this._expectations.length && n.length > this._iEntry ? (this._expectationsMetSoFar = !1, 
                this._logger.__unexpectedEntry(this._iEntry, n[this._iEntry]), this._iEntry++) : this._iExpectation >= this._expectations.length && this._deferred && (this._expectDeath ? this._logger && this._logger._died : !0) && (this._resolved = !0, 
                this._deferred.resolve()), void 0;
            }
            for (;this._iExpectation < this._expectations.length && this._iEntry < n.length; ) if (e = this._expectations[this._iExpectation], 
            t = n[this._iEntry++], !("!" === t[0][0] || this._ignore && this._ignore.hasOwnProperty(t[0]))) {
                if (e[0] !== t[0]) this._logger.__unexpectedEntry(this._iEntry - 1, t); else {
                    if (this["_verify_" + e[0]](e, t)) {
                        this._iExpectation++;
                        continue;
                    }
                    this._logger.__mismatchEntry(this._iEntry - 1, e, t), this._iExpectation++;
                }
                return this._expectationsMetSoFar && (this._expectationsMetSoFar = !1, this._deferred && this._deferred.reject([ this.__defName, e, t ])), 
                void 0;
            }
            this._activeForTestStep && (this._expectations.length && this._iExpectation === this._expectations.length && n.length > this._iEntry || !this._expectations.length && this._expectNothing) && (this._ignore && this._ignore.hasOwnProperty(n[this._iEntry][0]) || (this._expectationsMetSoFar = !1, 
            this._logger.__unexpectedEntry(this._iEntry, n[this._iEntry])), this._iEntry++), 
            this._iExpectation >= this._expectations.length && this._deferred && (this._expectDeath ? this._logger && this._logger._died : !0) && (this._resolved = !0, 
            this._deferred.resolve());
        }
    };
    s.TestActorProtoBase = b;
    var S = 6;
    s.smartCompareEquiv = a, d.prototype = {
        _define: function(e, t) {
            if (this._definedAs.hasOwnProperty(e)) throw new Error("Attempt to define '" + e + "' as a " + t + " when it is already defined as a " + this._definedAs[e] + "!");
            this._definedAs[e] = t;
        },
        _wrapLogProtoForTest: function(e) {
            var t = this.logProto[e];
            this.testLogProto[e] = function() {
                var e = t.apply(this, arguments), n = this._actor;
                return n && n.__loggerFired(), e;
            };
        },
        addStateVar: function(e) {
            this._define(e, "state"), this.dummyProto[e] = i;
            var n = ":" + e;
            this.logProto[e] = function(s) {
                var i = this[n];
                i !== s && (this[n] = s, this._entries.push([ e, s, t.now(), u++ ]));
            }, this._wrapLogProtoForTest(e), this.testActorProto["expect_" + e] = function(t) {
                if (!this._activeForTestStep) throw new Error("Attempt to set expectations on an actor (" + this.__defName + ": " + this.__name + ") that is not " + "participating in this test step!");
                if (this._resolved) throw new Error("Attempt to add expectations when already resolved!");
                return this._expectations.push([ e, t ]), this;
            }, this.testActorProto["ignore_" + e] = c(e), this.testActorProto["_verify_" + e] = function(e, t) {
                return a(e[1], t[1], S);
            };
        },
        addLatchedState: function(e) {
            this._define(e, "latchedState"), this._latchedVars.push(e);
            var t = ":" + e;
            this.testLogProto[e] = this.logProto[e] = this.dummyProto[e] = function(e) {
                this[t] = e;
            };
        },
        addEvent: function(e, s, i) {
            this._define(e, "event");
            var r = 0, d = [];
            for (var l in s) r++, d.push(s[l]);
            if (this.dummyProto[e] = function() {
                this._eventMap[e] = (this._eventMap[e] || 0) + 1;
            }, this.logProto[e] = function() {
                this._eventMap[e] = (this._eventMap[e] || 0) + 1;
                for (var s = [ e ], i = 0; r > i; i++) if (d[i] === C) {
                    var o = arguments[i];
                    s.push(n.transformException(o));
                } else s.push(arguments[i]);
                s.push(t.now()), s.push(u++), this._entries.push(s);
            }, i) {
                var h = 0, p = [];
                for (l in i) h++, p.push(i[l]);
                this.testLogProto[e] = function() {
                    this._eventMap[e] = (this._eventMap[e] || 0) + 1;
                    var s, i = [ e ];
                    for (s = 0; r > s; s++) if (d[s] === C) {
                        var a = arguments[s];
                        i.push(n.transformException(a));
                    } else i.push(arguments[s]);
                    i.push(t.now()), i.push(u++);
                    for (var c = 0; h > c; c++, s++) i.push(o(arguments[s], p[c]));
                    this._entries.push(i);
                    var l = this._actor;
                    l && l.__loggerFired();
                };
            } else this._wrapLogProtoForTest(e);
            this.testActorProto["expect_" + e] = function() {
                if (!this._activeForTestStep) throw new Error("Attempt to set expectations on an actor (" + this.__defName + ": " + this.__name + ") that is not " + "participating in this test step!");
                if (this._resolved) throw new Error("Attempt to add expectations when already resolved!");
                for (var t = [ e ], n = 0; n < arguments.length; n++) d[n] && d[n] !== C && t.push(arguments[n]);
                return this._expectations.push(t), this;
            }, this.testActorProto["ignore_" + e] = c(e), this.testActorProto["_verify_" + e] = function(e, t) {
                for (var n = 1; n < e.length; n++) if (!a(e[n], t[n], S)) return !1;
                return !0;
            };
        },
        addAsyncJob: function(e, s, r) {
            var d = e + "_begin", l = e + "_end";
            this.dummyProto[d] = i, this.dummyProto[l] = i;
            var h = 0, p = 0, f = [], m = [];
            for (var g in s) h++, f.push(s[g]);
            if (this.logProto[d] = function() {
                this._eventMap[d] = (this._eventMap[d] || 0) + 1;
                for (var e = [ d ], s = 0; h > s; s++) if (f[s] === C) {
                    var i = arguments[s];
                    e.push(n.transformException(i));
                } else e.push(arguments[s]);
                e.push(t.now()), e.push(u++), this._entries.push(e);
            }, this.logProto[l] = function() {
                this._eventMap[l] = (this._eventMap[l] || 0) + 1;
                for (var e = [ l ], s = 0; h > s; s++) if (f[s] === C) {
                    var i = arguments[s];
                    e.push(n.transformException(i));
                } else e.push(arguments[s]);
                e.push(t.now()), e.push(u++), this._entries.push(e);
            }, r) {
                for (g in r) p++, m.push(r[g]);
                this.testLogProto[d] = function() {
                    this._eventMap[d] = (this._eventMap[d] || 0) + 1;
                    for (var e = [ d ], s = 0; h > s; s++) if (f[s] === C) {
                        var i = arguments[s];
                        e.push(n.transformException(i));
                    } else e.push(arguments[s]);
                    e.push(t.now()), e.push(u++);
                    for (var r = 0; p > r; r++, s++) e.push(o(arguments[s], m[r]));
                    this._entries.push(e);
                    var a = this._actor;
                    a && a.__loggerFired();
                }, this.testLogProto[l] = function() {
                    this._eventMap[l] = (this._eventMap[l] || 0) + 1;
                    for (var e = [ l ], s = 0; h > s; s++) if (f[s] === C) {
                        var i = arguments[s];
                        e.push(n.transformException(i));
                    } else e.push(arguments[s]);
                    e.push(t.now()), e.push(u++);
                    for (var r = 0; p > r; r++, s++) e.push(o(arguments[s], m[r]));
                    this._entries.push(e);
                    var a = this._actor;
                    a && a.__loggerFired();
                };
            } else this._wrapLogProtoForTest(d), this._wrapLogProtoForTest(l);
            this.testActorProto["expect_" + d] = function() {
                if (!this._activeForTestStep) throw new Error("Attempt to set expectations on an actor (" + this.__defName + ": " + this.__name + ") that is not " + "participating in this test step!");
                if (this._resolved) throw new Error("Attempt to add expectations when already resolved!");
                for (var e = [ d ], t = 0; t < arguments.length; t++) f[t] && f[t] !== C && e.push(arguments[t]);
                return this._expectations.push(e), this;
            }, this.testActorProto["ignore_" + d] = c(d), this.testActorProto["expect_" + l] = function() {
                if (!this._activeForTestStep) throw new Error("Attempt to set expectations on an actor (" + this.__defName + ": " + this.__name + ") that is not " + "participating in this test step!");
                if (this._resolved) throw new Error("Attempt to add expectations when already resolved!");
                for (var e = [ l ], t = 0; t < arguments.length; t++) f[t] && f[t] !== C && e.push(arguments[t]);
                return this._expectations.push(e), this;
            }, this.testActorProto["ignore_" + l] = c(l), this.testActorProto["_verify_" + d] = this.testActorProto["_verify_" + l] = function(e, t) {
                for (var n = 1; n < e.length; n++) if (!a(e[n], t[n], S)) return !1;
                return !0;
            };
        },
        addCall: function(e, s, i) {
            this._define(e, "call");
            var r = 0, d = 0, l = [], h = [];
            for (var p in s) r++, l.push(s[p]);
            if (this.dummyProto[e] = function() {
                var t;
                try {
                    t = arguments[r + 1].apply(arguments[r], Array.prototype.slice.call(arguments, r + 2));
                } catch (n) {
                    this._eventMap[e] = (this._eventMap[e] || 0) + 1, t = n;
                }
                return t;
            }, this.logProto[e] = function() {
                var s, i, o = [ e ];
                for (i = 0; r > i; i++) o.push(arguments[i]);
                o.push(t.now()), o.push(u++), this._entries.push(o);
                try {
                    s = arguments[r + 1].apply(arguments[r], Array.prototype.slice.call(arguments, i + 2)), 
                    o.push(t.now()), o.push(u++), o.push(null);
                } catch (a) {
                    o.push(t.now()), o.push(u++), o.push(n.transformException(a)), this._eventMap[e] = (this._eventMap[e] || 0) + 1, 
                    s = a;
                }
                return s;
            }, i) {
                for (p in i) d++, h.push(i[p]);
                this.testLogProto[e] = function() {
                    var s, i, a = [ e ];
                    for (i = 0; r > i; i++) a.push(arguments[i]);
                    a.push(t.now()), a.push(u++), this._entries.push(a);
                    try {
                        s = arguments[r + 1].apply(arguments[r], Array.prototype.slice.call(arguments, i + 2)), 
                        a.push(t.now()), a.push(u++), a.push(null), i += 2;
                        for (var c = 0; d > c; c++, i++) a.push(o(arguments[i], h[c]));
                    } catch (l) {
                        a.push(t.now()), a.push(u++), a.push(n.transformException(l)), i += 2;
                        for (var c = 0; d > c; c++, i++) a.push(o(arguments[i], h[c]));
                        this._eventMap[e] = (this._eventMap[e] || 0) + 1, s = l;
                    }
                    var p = this._actor;
                    return p && p.__loggerFired(), s;
                };
            } else this._wrapLogProtoForTest(e);
            this.testActorProto["expect_" + e] = function() {
                if (!this._activeForTestStep) throw new Error("Attempt to set expectations on an actor (" + this.__defName + ": " + this.__name + ") that is not " + "participating in this test step!");
                if (this._resolved) throw new Error("Attempt to add expectations when already resolved!");
                for (var t = [ e ], n = 0; n < arguments.length; n++) l[n] && t.push(arguments[n]);
                return this._expectations.push(t), this;
            }, this.testActorProto["ignore_" + e] = c(e), this.testActorProto["_verify_" + e] = function(e, t) {
                if (t.length > r + d + 6) return !1;
                for (var n = 1; n < e.length; n++) if (!a(e[n], t[n], S)) return !1;
                return !0;
            };
        },
        addError: function(e, s) {
            this._define(e, "error");
            var i = 0, o = [];
            for (var r in s) i++, o.push(s[r]);
            this.dummyProto[e] = function() {
                this._eventMap[e] = (this._eventMap[e] || 0) + 1;
            }, this.logProto[e] = function() {
                this._eventMap[e] = (this._eventMap[e] || 0) + 1;
                for (var s = [ e ], r = 0; i > r; r++) if (o[r] === C) {
                    var a = arguments[r];
                    s.push(n.transformException(a));
                } else s.push(arguments[r]);
                s.push(t.now()), s.push(u++), this._entries.push(s);
            }, this._wrapLogProtoForTest(e), this.testActorProto["expect_" + e] = function() {
                if (!this._activeForTestStep) throw new Error("Attempt to set expectations on an actor (" + this.__defName + ": " + this.__name + ") that is not " + "participating in this test step!");
                if (this._resolved) throw new Error("Attempt to add expectations when already resolved!");
                for (var t = [ e ], n = 0; n < arguments.length; n++) o[n] && o[n] !== C && t.push(arguments[n]);
                return this._expectations.push(t), this;
            }, this.testActorProto["ignore_" + e] = c(e), this.testActorProto["_verify_" + e] = function(e, t) {
                for (var n = 1; n < e.length; n++) if (!a(e[n], t[n], S)) return !1;
                return !0;
            };
        },
        useSemanticIdent: function() {},
        makeFabs: function() {
            var e = this.moduleFab, n = function() {
                this._eventMap = {};
            };
            n.prototype = this.dummyProto;
            var s = function(e) {
                this.__updateIdent(e), this._uniqueName = h++, this._eventMap = {}, this._entries = [], 
                this._born = t.now(), this._died = null, this._kids = null;
            };
            s.prototype = this.logProto;
            var i = function(e) {
                s.call(this, e), this._actor = null;
            };
            i.prototype = this.testLogProto;
            var o = function(e, t) {
                this.__name = e, this._uniqueName = h++, this._parentUniqueName = t, this._logger = void 0, 
                this._ignore = null, this._expectations = [], this._expectationsMetSoFar = !0, this._expectNothing = !1, 
                this._expectDeath = !1, this._unorderedSetMode = !1, this._activeForTestStep = !1, 
                this._iEntry = this._iExpectation = 0, this._lifecycleListener = null;
            };
            o.prototype = this.testActorProto, this.moduleFab._actorCons[this.name] = o;
            var r = function a(t, o, r) {
                var c, d;
                if (d = e._underTest || a._underTest) {
                    if ("string" == typeof o) throw new Error("A string can't be a logger => not a valid parent");
                    c = new i(r), c.__instance = t, o = d.reportNewLogger(c, o);
                } else {
                    if (!e._generalLog && !i._generalLog) return new n();
                    c = new s(r);
                }
                return o && (void 0 === o._kids || (null === o._kids ? o._kids = [ c ] : o._kids.push(c))), 
                c;
            };
            this.moduleFab[this.name] = r;
        }
    };
    var w = [ "implClass", "type", "subtype", "topBilling", "semanticIdent", "dicing", "stateVars", "latchState", "events", "asyncJobs", "calls", "errors", "TEST_ONLY_calls", "TEST_ONLY_events", "TEST_ONLY_asyncJobs", "LAYER_MAPPING" ];
    s.__augmentFab = l;
    var E = [], A = !1, T = !1;
    s.register = function(e, t) {
        var n = {
            _generalLog: A,
            _underTest: T,
            _actorCons: {},
            _rawDefs: {},
            _onDeath: null
        };
        return E.push(n), l(e, n, t);
    }, s.provideSchemaForAllKnownFabs = function() {
        for (var e = {}, t = 0; t < E.length; t++) {
            var n = E[t]._rawDefs;
            for (var s in n) e[s] = n[s];
        }
        return e;
    };
    var I = {
        reportNewLogger: function(e, t) {
            return t;
        }
    };
    s.enableGeneralLogging = function() {
        A = !0;
        for (var e = 0; e < E.length; e++) {
            var t = E[e];
            t._generalLog = !0;
        }
    }, s.DEBUG_markAllFabsUnderTest = function() {
        T = I;
        for (var e = 0; e < E.length; e++) {
            var t = E[e];
            t._underTest = I;
        }
    }, s.DEBUG_dumpEntriesOnDeath = function(e) {
        e._generalLog = !0, e._onDeath = function(e) {
            console.log("!! DIED:", e.__defName, e._ident), console.log(JSON.stringify(e._entries, null, 2));
        };
    }, s.DEBUG_dumpAllFabEntriesOnDeath = function() {
        for (var e = 0; e < E.length; e++) {
            var t = E[e];
            s.DEBUG_dumpEntriesOnDeath(t);
        }
    }, s.CONNECTION = "connection", s.SERVER = "server", s.CLIENT = "client", s.TASK = "task", 
    s.DAEMON = "daemon", s.DATABASE = "database", s.CRYPTO = "crypto", s.QUERY = "query", 
    s.ACCOUNT = "account", s.LOGGING = "log", s.TEST_DRIVER = "testdriver", s.TEST_GROUP = "testgroup", 
    s.TEST_CASE = "testcase", s.TEST_PERMUTATION = "testperm", s.TEST_STEP = "teststep", 
    s.TEST_LAZY = "testlazy", s.TEST_SYNTHETIC_ACTOR = "test:synthactor";
    var C = s.EXCEPTION = "exception";
    s.JSONABLE = "jsonable", s.TOSTRING = "tostring", s.RAWOBJ_DATABIAS = "jsonable", 
    s.STATEREP = "staterep", s.STATEANNO = "stateanno", s.STATEDELTA = "statedelta";
}), define("mailapi/util", [ "exports" ], function(e) {
    e.cmpHeaderYoungToOld = function(e, t) {
        var n = t.date - e.date;
        return n ? n : t.id - e.id;
    }, e.bsearchForInsert = function(e, t, n) {
        if (!e.length) return 0;
        for (var s, i, o = 0, r = e.length - 1; r >= o; ) if (s = o + Math.floor((r - o) / 2), 
        i = n(t, e[s]), 0 > i) r = s - 1; else {
            if (!(i > 0)) break;
            o = s + 1;
        }
        return 0 > i ? s : i > 0 ? s + 1 : s;
    }, e.bsearchMaybeExists = function(e, t, n, s, i) {
        for (var o, r, a = void 0 === s ? 0 : s, c = void 0 === i ? e.length - 1 : i; c >= a; ) if (o = a + Math.floor((c - a) / 2), 
        r = n(t, e[o]), 0 > r) c = o - 1; else {
            if (!(r > 0)) return o;
            a = o + 1;
        }
        return null;
    }, e.partitionMessagesByFolderId = function(e) {
        for (var t = [], n = {}, s = 0; s < e.length; s++) {
            var i = e[s], o = i.suid, r = o.lastIndexOf("/"), a = o.substring(0, r);
            if (n.hasOwnProperty(a)) n[a].push(i); else {
                var c = [ i ];
                t.push({
                    folderId: a,
                    messages: c
                }), n[a] = c;
            }
        }
        return t;
    }, e.formatAddresses = function(e) {
        for (var t = [], n = 0; n < e.length; n++) {
            var s = e[n];
            "string" == typeof s ? t.push(s) : s.name ? t.push('"' + s.name.replace(/["']/g, "") + '" <' + s.address + ">") : t.push(s.address);
        }
        return t.join(", ");
    };
}), define("mailapi/a64", [ "exports" ], function(e) {
    function t(e, t) {
        var i = [];
        do i.push(n[63 & e]), e = Math.floor(e / 64); while (e > 0);
        i.reverse();
        var o = i.join("");
        return t && o.length < t ? s.substring(0, t - o.length) + o : o;
    }
    var n = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "}" ], s = "0000000000000000";
    e.encodeInt = t;
    var i = Math.pow(10, 14) / Math.pow(2, 14), o = Math.pow(2, 14), r = Math.pow(2, 22), a = (Math.pow(2, 32), 
    Math.pow(2, 36));
    e.parseUI64 = function(e, n) {
        if (e.length < 16) return t(parseInt(e, 10));
        var c = parseInt(e.substring(e.length - 14), 10), d = parseInt(e.substring(0, e.length - 14), 10), l = d * i, u = l % a * o % a + c % a, h = u % a, p = Math.floor(u / a) % 2, f = Math.floor(l / r) + Math.floor(c / a) + p, m = t(f) + t(h, 6);
        return n && m.length < n ? s.substring(0, n - m.length) + m : m;
    }, e.cmpUI64 = function(e, t) {
        var n = e.length - t.length;
        return 0 !== n ? n : t > e ? -1 : e > t ? 1 : 0;
    }, e.decodeUI64 = function(e) {
        for (var t = 0; 48 === e.charCodeAt(t); t++) ;
        t && (e = e.substring(t));
        var a, c;
        if (e.length <= 8) {
            for (a = 0, c = 0; c < e.length; c++) a = 64 * a + n.indexOf(e[c]);
            return a.toString(10);
        }
        var d = e.substring(0, e.length - 6), l = 0, u = e.substring(e.length - 6), h = 0;
        for (c = 0; c < d.length; c++) l = 64 * l + n.indexOf(d[c]);
        for (c = 0; c < u.length; c++) h = 64 * h + n.indexOf(u[c]);
        var p = l * r + Math.floor(h / o), f = p / i, m = Math.floor(f), g = m.toString(), _ = p - m * i, y = _ * o + h % o, v = y.toString();
        return v.length < 14 && (v = s.substring(0, 14 - v.length) + v), g + v;
    };
}), define("mailapi/allback", [ "exports", "prim" ], function(e, t) {
    e.allbackMaker = function(e, t) {
        var n = {}, s = {}, i = e.concat();
        return e.forEach(function(e) {
            n[e] = void 0, s[e] = function(s) {
                var o = i.indexOf(e);
                if (-1 === o) throw console.error("Callback '" + e + "' fired multiple times!"), 
                new Error("Callback '" + e + "' fired multiple times!");
                i.splice(o, 1), n[e] = arguments.length > 1 ? arguments : s, 0 === i.length && t && t(n);
            };
        }), s;
    }, e.latch = function() {
        function e(e) {
            o++;
            var t = !1;
            return function() {
                if (t) {
                    var n = new Error("You have already resolved this deferred!");
                    throw console.error(n + "\n" + n.stack), n;
                }
                t = !0, e && (i[e] = Array.slice(arguments)), 0 === --o && setZeroTimeout(function() {
                    s.resolve(i);
                });
            };
        }
        var n = !1, s = {}, i = {}, o = 0;
        s.promise = t(function(e, t) {
            s.resolve = e, s.reject = t;
        });
        var r = e();
        return {
            defer: e,
            then: function() {
                var e = s.promise.then.apply(s.promise, arguments);
                return n || (n = !0, r()), e;
            }
        };
    };
}), define("mailapi/date", [ "module", "exports" ], function(e, t) {
    t.BEFORE = function(e, t) {
        return t > e;
    }, t.ON_OR_BEFORE = function(e, t) {
        return t >= e;
    }, t.SINCE = function(e, t) {
        return e >= t;
    }, t.STRICTLY_AFTER = function(e, t) {
        return e > t;
    }, t.IN_BS_DATE_RANGE = function(e, t, n) {
        return e >= t && n > e;
    };
    var n = 1;
    t.TIME_DIR_AT_OR_BEYOND = function(e, t, s) {
        return e === n ? s >= t : null === s ? t >= o() : t >= s;
    }, t.TIME_DIR_DELTA = function(e, t, s) {
        return e === n ? t - s : s - t;
    }, t.TIME_DIR_ADD = function(e, t, s) {
        return e === n ? t + s : t - s;
    }, t.HOUR_MILLIS = 36e5;
    var s = t.DAY_MILLIS = 864e5, i = null;
    t.TEST_LetsDoTheTimewarpAgain = function(e) {
        return null === e ? (i = null, void 0) : ("number" != typeof e && (e = e.valueOf()), 
        i = e, void 0);
    };
    var o = t.NOW = function() {
        return i || Date.now();
    }, r = t.makeDaysAgo = function(e, t) {
        var n = a((i || Date.now()) + t) - e * s;
        return n;
    };
    t.makeDaysBefore = function(e, t, n) {
        return null === e ? r(t - 1, n) : a(e) - t * s;
    };
    var a = t.quantizeDate = function(e) {
        return null === e ? null : ("number" == typeof e && (e = new Date(e)), e.setUTCHours(0, 0, 0, 0).valueOf());
    };
    t.quantizeDateUp = function(e) {
        "number" == typeof e && (e = new Date(e));
        var t = e.setUTCHours(0, 0, 0, 0).valueOf();
        return e.valueOf() === t ? t : t + s;
    };
}), define("mailapi/syncbase", [ "./date", "exports" ], function(e, t) {
    t.OPEN_REFRESH_THRESH_MS = 6e5, t.GROW_REFRESH_THRESH_MS = 36e5, t.EXPECTED_BLOCK_SIZE = 8, 
    t.MAX_BLOCK_SIZE = 1024 * t.EXPECTED_BLOCK_SIZE, t.BLOCK_SPLIT_SMALL_PART = 1024 * (t.EXPECTED_BLOCK_SIZE / 3), 
    t.BLOCK_SPLIT_EQUAL_PART = 1024 * (t.EXPECTED_BLOCK_SIZE / 2), t.BLOCK_SPLIT_LARGE_PART = 1024 * (t.EXPECTED_BLOCK_SIZE / 1.5), 
    t.BLOCK_PURGE_EVERY_N_NEW_BODY_BLOCKS = 32, t.BLOCK_PURGE_ONLY_AFTER_UNSYNCED_MS = 14 * e.DAY_MILLIS, 
    t.BLOCK_PURGE_HARD_MAX_BLOCK_LIMIT = 1024, t.POP3_SAVE_STATE_EVERY_N_MESSAGES = 50, 
    t.POP3_MAX_MESSAGES_PER_SYNC = 100, t.POP3_INFER_ATTACHMENTS_SIZE = 524288, t.POP3_SNIPPET_SIZE_GOAL = 4096, 
    t.SYNC_FOLDER_LIST_EVERY_MS = e.DAY_MILLIS, t.INITIAL_FILL_SIZE = 15, t.INITIAL_SYNC_DAYS = 3, 
    t.INITIAL_SYNC_GROWTH_DAYS = 3, t.TIME_SCALE_FACTOR_ON_NO_MESSAGES = 2, t.OLDEST_SYNC_DATE = Date.UTC(1990, 0, 1), 
    t.SYNC_WHOLE_FOLDER_AT_N_MESSAGES = 40, t.BISECT_DATE_AT_N_MESSAGES = 60, t.TOO_MANY_MESSAGES = 2e3, 
    t.HEADER_EST_SIZE_IN_BYTES = 430, t.MAX_OP_TRY_COUNT = 10, t.OP_UNKNOWN_ERROR_TRY_COUNT_INCREMENT = 5, 
    t.DEFERRED_OP_DELAY_MS = 3e4, t.CHECK_INTERVALS_ENUMS_TO_MS = {
        manual: 0,
        "3min": 18e4,
        "5min": 3e5,
        "10min": 6e5,
        "15min": 9e5,
        "30min": 18e5,
        "60min": 36e5
    }, t.DEFAULT_CHECK_INTERVAL_ENUM = "manual";
    var n = 864e5;
    t.SYNC_RANGE_ENUMS_TO_MS = {
        auto: 30 * n,
        "1d": 1 * n,
        "3d": 3 * n,
        "1w": 7 * n,
        "2w": 14 * n,
        "1m": 30 * n,
        all: 10950 * n
    }, t.TEST_adjustSyncValues = function(e) {
        var n = {
            fillSize: "INITIAL_FILL_SIZE",
            days: "INITIAL_SYNC_DAYS",
            growDays: "INITIAL_SYNC_GROWTH_DAYS",
            wholeFolderSync: "SYNC_WHOLE_FOLDER_AT_N_MESSAGES",
            bisectThresh: "BISECT_DATE_AT_N_MESSAGES",
            tooMany: "TOO_MANY_MESSAGES",
            scaleFactor: "TIME_SCALE_FACTOR_ON_NO_MESSAGES",
            openRefreshThresh: "OPEN_REFRESH_THRESH_MS",
            growRefreshThresh: "GROW_REFRESH_THRESH_MS"
        };
        for (var s in e) if (e.hasOwnProperty(s)) {
            var i = n[s] || s;
            t.hasOwnProperty(i) ? t[i] = e[s] : console.warn("Invalid key for TEST_adjustSyncValues: " + s);
        }
    };
}), define("mailapi/mailslice", [ "rdcommon/log", "./util", "./a64", "./allback", "./date", "./syncbase", "module", "exports" ], function(e, t, n, s, i, o, r, a) {
    function c(e, t, n) {
        this._bridgeHandle = e, e.__listener = this, this._storage = t, this._LOG = B.MailSlice(this, n, e._handle), 
        this.startTS = null, this.startUID = null, this.endTS = null, this.endUID = null, 
        this.waitingOnData = !1, this.ignoreHeaders = !1, this.headers = [], this.desiredHeaders = o.INITIAL_FILL_SIZE, 
        this.headerCount = t.headerCount;
    }
    function d(e, t, n, s, i, o) {
        this._account = e, this._imapDb = s, this.folderId = t, this.folderMeta = n.$meta, 
        this._folderImpl = n.$impl, this._LOG = B.FolderStorage(this, o, t), this._accuracyRanges = n.accuracy, 
        this._headerBlockInfos = n.headerBlocks, this.headerCount = 0, this._headerBlockInfos && this._headerBlockInfos.forEach(function(e) {
            this.headerCount += e.count;
        }.bind(this)), this._bodyBlockInfos = n.bodyBlocks, this._serverIdHeaderBlockMapping = n.serverIdHeaderBlockMapping, 
        this._headerBlocks = {}, this._loadedHeaderBlockInfos = [], this._bodyBlocks = {}, 
        this._loadedBodyBlockInfos = [], this._flushExcessTimeoutId = 0, this._bound_flushExcessOnTimeout = this._flushExcessOnTimeout.bind(this), 
        this._bound_makeHeaderBlock = this._makeHeaderBlock.bind(this), this._bound_insertHeaderInBlock = this._insertHeaderInBlock.bind(this), 
        this._bound_splitHeaderBlock = this._splitHeaderBlock.bind(this), this._bound_deleteHeaderFromBlock = this._deleteHeaderFromBlock.bind(this), 
        this._bound_makeBodyBlock = this._makeBodyBlock.bind(this), this._bound_insertBodyInBlock = this._insertBodyInBlock.bind(this), 
        this._bound_splitBodyBlock = this._splitBodyBlock.bind(this), this._bound_deleteBodyFromBlock = this._deleteBodyFromBlock.bind(this), 
        this._dirty = !1, this._dirtyHeaderBlocks = {}, this._dirtyBodyBlocks = {}, this._pendingLoads = [], 
        this._pendingLoadListeners = {}, this._deferredCalls = [], this._mutexQueue = [], 
        this._slices = [], this._curSyncSlice = null, this._messagePurgeScheduled = !1, 
        this.folderSyncer = i && new i(e, this, this._LOG);
    }
    var l = t.bsearchForInsert, u = t.bsearchMaybeExists, h = t.cmpHeaderYoungToOld, p = (s.allbackMaker, 
    i.BEFORE), f = i.ON_OR_BEFORE, m = i.SINCE, g = i.STRICTLY_AFTER, _ = i.IN_BS_DATE_RANGE, y = (i.HOUR_MILLIS, 
    i.DAY_MILLIS), v = i.NOW, b = i.quantizeDate, S = i.quantizeDateUp, w = 1, E = -1, A = 2, T = 5, I = 10, C = 4, x = 2, k = 4, O = 8, M = 4, N = a.tupleRangeIntersectsTupleRange = function(e, t) {
        return p(e.endTS, t.startTS) || g(e.startTS, t.endTS) ? !1 : e.endTS === t.startTS && e.endUID < t.startUID || e.startTS === t.endTS && e.startTS > t.endUID ? !1 : !0;
    }, D = .02;
    a.MailSlice = c, c.prototype = {
        type: "folder",
        set atTop(e) {
            return this._bridgeHandle && (this._bridgeHandle.atTop = e), e;
        },
        set atBottom(e) {
            return this._bridgeHandle && (this._bridgeHandle.atBottom = e), e;
        },
        set userCanGrowUpwards(e) {
            return this._bridgeHandle && (this._bridgeHandle.userCanGrowUpwards = e), e;
        },
        set userCanGrowDownwards(e) {
            return this._bridgeHandle && (this._bridgeHandle.userCanGrowDownwards = e), e;
        },
        set headerCount(e) {
            return this._bridgeHandle && (this._bridgeHandle.headerCount = e), e;
        },
        _updateSliceFlags: function() {
            var e = this._bridgeHandle;
            e.atTop = this._storage.headerIsYoungestKnown(this.endTS, this.endUID), e.atBottom = this._storage.headerIsOldestKnown(this.startTS, this.startUID), 
            e.userCanGrowUpwards = e.atTop ? !this._storage.syncedToToday() : !1, e.userCanGrowDownwards = e.atBottom ? !this._storage.syncedToDawnOfTime() : !1;
        },
        reset: function() {
            this._bridgeHandle && this.headers.length && (this._bridgeHandle.sendSplice(0, this.headers.length, [], !1, !0), 
            this.headers.splice(0, this.headers.length), this.startTS = null, this.startUID = null, 
            this.endTS = null, this.endUID = null);
        },
        refresh: function() {
            this._storage.refreshSlice(this);
        },
        reqNoteRanges: function(e, t, n, s) {
            if (this._bridgeHandle) {
                var i;
                if (e >= this.headers.length || this.headers[e].suid !== t) for (e = 0, i = 0; i < this.headers.length; i++) if (this.headers[i].suid === t) {
                    e = i;
                    break;
                }
                if (n >= this.headers.length || this.headers[n].suid !== s) for (i = this.headers.length - 1; i >= 0; i--) if (this.headers[i].suid === s) {
                    n = i;
                    break;
                }
                if (n + 1 < this.headers.length) {
                    this.atBottom = !1, this.userCanGrowDownwards = !1;
                    var o = this.headers.length - n - 1;
                    this.desiredHeaders -= o, this._bridgeHandle.sendSplice(n + 1, o, [], !0, e > 0), 
                    this.headers.splice(n + 1, this.headers.length - n - 1);
                    var r = this.headers[n];
                    this.startTS = r.date, this.startUID = r.id;
                }
                if (e > 0) {
                    this.atTop = !1, this.userCanGrowUpwards = !1, this.desiredHeaders -= e, this._bridgeHandle.sendSplice(0, e, [], !0, !1), 
                    this.headers.splice(0, e);
                    var a = this.headers[0];
                    this.endTS = a.date, this.endUID = a.id;
                }
                this._storage.sliceShrunk(this);
            }
        },
        reqGrow: function(e, t) {
            -1 === e ? e = -o.INITIAL_FILL_SIZE : 1 === e && (e = o.INITIAL_FILL_SIZE), this._storage.growSlice(this, e, t);
        },
        sendEmptyCompletion: function() {
            this.setStatus("synced", !0, !1);
        },
        setStatus: function(e, t, n, s, i, o) {
            if (this._bridgeHandle) {
                switch (e) {
                  case "synced":
                  case "syncfailed":
                    this._updateSliceFlags();
                }
                this._bridgeHandle.sendStatus(e, t, n, i, o);
            }
        },
        setSyncProgress: function(e) {
            this._bridgeHandle && this._bridgeHandle.sendSyncProgress(e);
        },
        batchAppendHeaders: function(e, t, n) {
            if (this._bridgeHandle) {
                this._LOG.headersAppended(e), -1 === t && (t = this.headers.length), this.headers.splice.apply(this.headers, [ t, 0 ].concat(e));
                for (var s = 0; s < e.length; s++) {
                    var i = e[s];
                    null === this.startTS || p(i.date, this.startTS) ? (this.startTS = i.date, this.startUID = i.id) : i.date === this.startTS && i.id < this.startUID && (this.startUID = i.id), 
                    null === this.endTS || g(i.date, this.endTS) ? (this.endTS = i.date, this.endUID = i.id) : i.date === this.endTS && i.id > this.endUID && (this.endUID = i.id);
                }
                this._updateSliceFlags(), this._bridgeHandle.sendSplice(t, 0, e, !0, n);
            }
        },
        onHeaderAdded: function(e) {
            if (this._bridgeHandle) {
                var t = l(this.headers, e, h), n = this.headers.length;
                n >= this.desiredHeaders && t === n || (n >= this.desiredHeaders && this.desiredHeaders++, 
                null === this.startTS || p(e.date, this.startTS) ? (this.startTS = e.date, this.startUID = e.id) : e.date === this.startTS && e.id < this.startUID && (this.startUID = e.id), 
                null === this.endTS || g(e.date, this.endTS) ? (this.endTS = e.date, this.endUID = e.id) : e.date === this.endTS && e.id > this.endUID && (this.endUID = e.id), 
                this._LOG.headerAdded(t, e), this._bridgeHandle.sendSplice(t, 0, [ e ], Boolean(this.waitingOnData), Boolean(this.waitingOnData)), 
                this.headers.splice(t, 0, e));
            }
        },
        onHeaderModified: function(e) {
            if (this._bridgeHandle) {
                var t = u(this.headers, e, h);
                null !== t && (this.headers[t] = e, this._LOG.headerModified(t, e), this._bridgeHandle.sendUpdate([ t, e ]));
            }
        },
        onHeaderRemoved: function(e) {
            if (this._bridgeHandle) {
                var t = u(this.headers, e, h);
                if (null !== t && (this._LOG.headerRemoved(t, e), this._bridgeHandle.sendSplice(t, 1, [], Boolean(this.waitingOnData), Boolean(this.waitingOnData)), 
                this.headers.splice(t, 1), e.date === this.endTS && e.id === this.endUID && (this.headers.length ? (this.endTS = this.headers[0].date, 
                this.endUID = this.headers[0].id) : (this.endTS = null, this.endUID = null)), e.date === this.startTS && e.id === this.startUID)) if (this.headers.length) {
                    var n = this.headers[this.headers.length - 1];
                    this.startTS = n.date, this.startUID = n.id;
                } else this.startTS = null, this.startUID = null;
            }
        },
        die: function() {
            this._bridgeHandle = null, this.desiredHeaders = 0, this._storage.dyingSlice(this), 
            this._LOG.__die();
        },
        get isDead() {
            return null === this._bridgeHandle;
        }
    }, a.FolderStorage = d, d.prototype = {
        get hasActiveSlices() {
            return this._slices.length > 0;
        },
        resetAndRefreshActiveSlices: function() {
            if (this._slices.length) for (var e = this._slices.length - 1; e >= 0; e--) {
                var t = this._slices[e];
                t.desiredHeaders = o.INITIAL_FILL_SIZE, t.reset(), "folder" === t.type && this._resetAndResyncSlice(t, !0, null);
            }
        },
        generatePersistenceInfo: function() {
            if (!this._dirty) return null;
            var e = {
                id: this.folderId,
                headerBlocks: this._dirtyHeaderBlocks,
                bodyBlocks: this._dirtyBodyBlocks
            };
            return this._dirtyHeaderBlocks = {}, this._dirtyBodyBlocks = {}, this._dirty = !1, 
            this.flushExcessCachedBlocks("persist"), e;
        },
        _invokeNextMutexedCall: function() {
            var e = this._mutexQueue[0], t = this, n = !1;
            this._mutexedCallInProgress = !0, this._LOG.mutexedCall_begin(e.name);
            try {
                e.func(function() {
                    return n ? (t._LOG.tooManyCallbacks(e.name), void 0) : (t._LOG.mutexedCall_end(e.name), 
                    n = !0, t._mutexQueue[0] !== e ? (t._LOG.mutexInvariantFail(e.name, t._mutexQueue[0].name), 
                    void 0) : (t._mutexQueue.shift(), t.flushExcessCachedBlocks("mutex"), t._mutexQueue.length ? window.setZeroTimeout(t._invokeNextMutexedCall.bind(t)) : 0 === t._slices.length && t.folderSyncer.allConsumersDead(), 
                    void 0));
                });
            } catch (s) {
                this._LOG.mutexedOpErr(s);
            }
        },
        runMutexed: function(e, t) {
            var n = 0 === this._mutexQueue.length;
            this._mutexQueue.push({
                name: e,
                func: t
            }), n && this._invokeNextMutexedCall();
        },
        _issueNewHeaderId: function() {
            return this._folderImpl.nextId++;
        },
        _makeHeaderBlock: function(e, t, s, i, o, r, a) {
            var c = n.encodeInt(this._folderImpl.nextHeaderBlock++), d = {
                blockId: c,
                startTS: e,
                startUID: t,
                endTS: s,
                endUID: i,
                count: r ? r.length : 0,
                estSize: o || 0
            }, l = {
                ids: r || [],
                headers: a || []
            };
            if (this._dirty = !0, this._headerBlocks[c] = l, this._dirtyHeaderBlocks[c] = l, 
            this._serverIdHeaderBlockMapping && a) for (var u = this._serverIdHeaderBlockMapping, h = 0; h < a.length; h++) {
                var p = a[h];
                p.srvid && (u[p.srvid] = c);
            }
            return d;
        },
        _insertHeaderInBlock: function(e, t, n, s) {
            var i = l(s.headers, e, h);
            s.ids.splice(i, 0, e.id), s.headers.splice(i, 0, e), this._dirty = !0, this._dirtyHeaderBlocks[n.blockId] = s;
        },
        _deleteHeaderFromBlock: function(e, t, n) {
            var s, i = n.ids.indexOf(e);
            n.ids.splice(i, 1), n.headers.splice(i, 1), t.estSize -= o.HEADER_EST_SIZE_IN_BYTES, 
            t.count--, this._dirty = !0, this._dirtyHeaderBlocks[t.blockId] = n, 0 === i && t.count && (s = n.headers[0], 
            t.endTS = s.date, t.endUID = s.id), i === t.count && i > 0 && (s = n.headers[i - 1], 
            t.startTS = s.date, t.startUID = s.id);
        },
        _splitHeaderBlock: function(e, t, n) {
            var s = Math.ceil(n / o.HEADER_EST_SIZE_IN_BYTES);
            if (s > t.headers.length) throw new Error("No need to split!");
            var i = t.headers.length - s, r = t.headers[s], a = this._makeHeaderBlock(e.startTS, e.startUID, r.date, r.id, i * o.HEADER_EST_SIZE_IN_BYTES, t.ids.splice(s, i), t.headers.splice(s, i)), c = t.headers[s - 1];
            return e.count = s, e.estSize = s * o.HEADER_EST_SIZE_IN_BYTES, e.startTS = c.date, 
            e.startUID = c.id, this._dirtyHeaderBlocks[e.blockId] = t, a;
        },
        _makeBodyBlock: function(e, t, s, i, r, a, c) {
            var d = n.encodeInt(this._folderImpl.nextBodyBlock++), l = {
                blockId: d,
                startTS: e,
                startUID: t,
                endTS: s,
                endUID: i,
                count: a ? a.length : 0,
                estSize: r || 0
            }, u = {
                ids: a || [],
                bodies: c || {}
            };
            return this._dirty = !0, this._bodyBlocks[d] = u, this._dirtyBodyBlocks[d] = u, 
            0 !== this._folderImpl.nextBodyBlock % o.BLOCK_PURGE_EVERY_N_NEW_BODY_BLOCKS || this._messagePurgeScheduled || (this._messagePurgeScheduled = !0, 
            this._account.scheduleMessagePurge(this.folderId)), l;
        },
        _insertBodyInBlock: function(e, t, n, s) {
            function i(n, i) {
                var o = n === t ? e.date : s.bodies[n].date, r = i === t ? e.date : s.bodies[i].date, a = r - o;
                return a ? a : a = i - n;
            }
            var o = l(s.ids, t, i);
            s.ids.splice(o, 0, t), s.bodies[t] = e, this._dirty = !0, this._dirtyBodyBlocks[n.blockId] = s;
        },
        _deleteBodyFromBlock: function(e, t, n) {
            var s = n.ids.indexOf(e), i = n.bodies[e];
            return -1 !== s && i ? (n.ids.splice(s, 1), delete n.bodies[e], t.estSize -= i.size, 
            t.count--, this._dirty = !0, this._dirtyBodyBlocks[t.blockId] = n, 0 === s && t.count && (t.endUID = e = n.ids[0], 
            t.endTS = n.bodies[e].date), s === t.count && s > 0 && (t.startUID = e = n.ids[s - 1], 
            t.startTS = n.bodies[e].date), void 0) : (this._LOG.bodyBlockMissing(e, s, !!i), 
            void 0);
        },
        _splitBodyBlock: function(e, t, n) {
            var s, i, o, r = e.startTS, a = e.startUID, c = 0, d = t.ids, l = {}, u = {}, h = null, p = d.length - 1;
            for (s = 0; p > s; s++) if (i = d[s], o = t.bodies[i], c += o.size, l[i] = o, c >= n) {
                s++;
                break;
            }
            for (e.count = h = s, e.startTS = o.date, e.startUID = i; s < d.length; s++) i = d[s], 
            u[i] = t.bodies[i];
            var f = d[h], m = this._makeBodyBlock(r, a, u[f].date, f, e.estSize - c, d.splice(h, d.length - h), u);
            return e.estSize = c, t.bodies = l, this._dirtyBodyBlocks[e.blockId] = t, m;
        },
        flushExcessCachedBlocks: function() {
            function e(e) {
                for (var t = 0; t < n.length; t++) {
                    var s = n[t];
                    if (N(s, e)) return !0;
                }
                return !1;
            }
            function t(e, t, n, s, i, o) {
                for (var r = n.length - 1; r > -1; r--) {
                    var a = n[r];
                    i.hasOwnProperty(a.blockId) || o(a) && (delete s[a.blockId], n.splice(r, 1));
                }
            }
            var n = this._slices.filter(function(e) {
                return "folder" === e.type;
            });
            t("header", this._headerBlockInfos, this._loadedHeaderBlockInfos, this._headerBlocks, this._dirtyHeaderBlocks, function(t) {
                return !e(t);
            });
            var s = n.length ? 1 : 0, i = 0;
            t("body", this._bodyBlockInfos, this._loadedBodyBlockInfos, this._bodyBlocks, this._dirtyBodyBlocks, function() {
                return i += 1, i > s;
            });
        },
        _flushExcessOnTimeout: function() {
            this._flushExcessTimeoutId = 0, this.isDead || 0 !== this._mutexQueue.length || this.flushExcessCachedBlocks("flushExcessOnTimeout");
        },
        _discardCachedBlockUsingDateAndID: function(e, t, n) {
            var s, i, o, r;
            this._LOG.discardFromBlock(e, t, n), "header" === e ? (s = this._headerBlockInfos, 
            i = this._loadedHeaderBlockInfos, o = this._headerBlocks, r = this._dirtyHeaderBlocks) : (s = this._bodyBlockInfos, 
            i = this._loadedBodyBlockInfos, o = this._bodyBlocks, r = this._dirtyBodyBlocks);
            var a = this._findRangeObjIndexForDateAndID(s, t, n), c = (a[0], a[1]);
            if (!c) return this._LOG.badDiscardRequest(e, t, n), void 0;
            var d = c.blockId;
            if (o.hasOwnProperty(d)) {
                if (r.hasOwnProperty(d)) return this._LOG.badDiscardRequest(e, t, n), void 0;
                delete o[d];
                var l = i.indexOf(c);
                -1 !== l && i.splice(l, 1);
            }
        },
        purgeExcessMessages: function(e) {
            this._messagePurgeScheduled = !1;
            var t = Math.max(this._purge_findLastAccessCutPoint(), this._purge_findHardBlockCutPoint(this._headerBlockInfos), this._purge_findHardBlockCutPoint(this._bodyBlockInfos));
            if (0 === t) return e(0, t), void 0;
            t = b(t + y) - this._account.tzOffset;
            var n = this._accuracyRanges, s = this._findFirstObjIndexForDateRange(n, t, t);
            s[1] ? (s[1].startTS = t, n.splice(s[0] + 1, n.length - s[0])) : n.splice(s[0], n.length - s[0]);
            var i = this._headerBlockInfos, o = (this._headerBlocks, 0), r = !1, a = !1, c = function() {
                if (r) return a = !0, void 0;
                for (;;) {
                    if (!i.length) return e(o, t), void 0;
                    var n = i[i.length - 1];
                    if (!this._headerBlocks.hasOwnProperty(n.blockId)) return this._loadBlock("header", n, c), 
                    void 0;
                    var s = this._headerBlocks[n.blockId], d = s.headers[s.headers.length - 1];
                    if (m(d.date, t)) return e(o, t), void 0;
                    if (a = !1, r = !0, o++, this.deleteMessageHeaderAndBodyUsingHeader(d, c), r = !1, 
                    !a) return;
                }
            }.bind(this);
            c();
        },
        _purge_findLastAccessCutPoint: function() {
            var e, t = this._accuracyRanges, n = i.NOW() - o.BLOCK_PURGE_ONLY_AFTER_UNSYNCED_MS;
            for (e = t.length; e >= 1; e--) {
                var s = t[e - 1];
                if (s.fullSync && s.fullSync.updated > n) break;
            }
            if (e === t.length) return 0;
            var r = t[e].endTS, a = o.SYNC_RANGE_ENUMS_TO_MS[this._account.accountDef.syncRange] || o.SYNC_RANGE_ENUMS_TO_MS.auto, c = i.NOW() - a - y;
            return g(r, c) ? c : r;
        },
        _purge_findHardBlockCutPoint: function(e) {
            return e.length <= o.BLOCK_PURGE_HARD_MAX_BLOCK_LIMIT ? 0 : e[o.BLOCK_PURGE_HARD_MAX_BLOCK_LIMIT].startTS;
        },
        _findRangeObjIndexForDate: function(e, t) {
            var n;
            for (n = 0; n < e.length; n++) {
                var s = e[n];
                if (m(t, s.endTS)) return [ n, null ];
                if (m(t, s.startTS)) return [ n, s ];
            }
            return [ n, null ];
        },
        _findRangeObjIndexForDateAndID: function(e, t, n) {
            var s;
            for (s = 0; s < e.length; s++) {
                var i = e[s];
                if (g(t, i.endTS) || t === i.endTS && n > i.endUID) return [ s, null ];
                if (g(t, i.startTS) || t === i.startTS && n >= i.startUID) return [ s, i ];
            }
            return [ s, null ];
        },
        _findFirstObjIndexForDateRange: function(e, t, n) {
            var s;
            for (s = 0; s < e.length; s++) {
                var i = e[s];
                if (g(t, i.endTS)) return [ s, null ];
                if (null === n || g(n, i.startTS)) return [ s, i ];
            }
            return [ s, null ];
        },
        _findLastObjIndexForDateRange: function(e, t, n) {
            var s;
            for (s = e.length - 1; s >= 0; s--) {
                var i = e[s];
                if (f(n, i.startTS)) return [ s + 1, null ];
                if (p(t, i.endTS)) return [ s, i ];
            }
            return [ 0, null ];
        },
        _findFirstObjForDateRange: function(e, t, n) {
            var s, i = null === n ? m : _;
            for (s = 0; s < e.length; s++) {
                var o = e[s].date;
                if (i(o, t, n)) return [ s, e[s] ];
            }
            return [ s, null ];
        },
        _insertIntoBlockUsingDateAndUID: function(e, t, n, s, i, r, a) {
            function c(e) {
                if (b.estSize += i, b.count++, f(r, n, b, e), b.count > 1 && b.estSize >= o.MAX_BLOCK_SIZE) {
                    var c;
                    c = 0 === v ? o.BLOCK_SPLIT_SMALL_PART : v === d.length - 1 ? o.BLOCK_SPLIT_LARGE_PART : o.BLOCK_SPLIT_EQUAL_PART;
                    var h;
                    h = m(b, e, c), d.splice(v + 1, 0, h), l.push(h), (p(t, h.endTS) || t === h.endTS && n <= h.endUID) && (v++, 
                    b = h, e = u[b.blockId]);
                }
                _ && s && (_[s] = b.blockId), a && a(b, e);
            }
            var d, l, u, h, f, m, _;
            "header" === e ? (d = this._headerBlockInfos, l = this._loadedHeaderBlockInfos, 
            u = this._headerBlocks, _ = this._serverIdHeaderBlockMapping, h = this._bound_makeHeaderBlock, 
            f = this._bound_insertHeaderInBlock, m = this._bound_splitHeaderBlock) : (d = this._bodyBlockInfos, 
            l = this._loadedBodyBlockInfos, u = this._bodyBlocks, _ = null, h = this._bound_makeBodyBlock, 
            f = this._bound_insertBodyInBlock, m = this._bound_splitBodyBlock);
            var y = this._findRangeObjIndexForDateAndID(d, t, n), v = y[0], b = y[1];
            b || (0 === d.length ? (b = h(t, n, t, n), d.splice(v, 0, b), l.push(b)) : v < d.length && d[v].estSize + i < o.MAX_BLOCK_SIZE ? (b = d[v], 
            g(t, b.endTS) ? (b.endTS = t, b.endUID = n) : t === b.endTS && n > b.endUID && (b.endUID = n)) : v > 0 && d[v - 1].estSize + i < o.MAX_BLOCK_SIZE ? (b = d[--v], 
            p(t, b.startTS) ? (b.startTS = t, b.startUID = n) : t === b.startTS && n < b.startUID && (b.startUID = n)) : v > 0 && v < d.length / 2 || v === d.length ? (b = d[--v], 
            p(t, b.startTS) ? (b.startTS = t, b.startUID = n) : t === b.startTS && n < b.startUID && (b.startUID = n)) : (b = d[v], 
            g(t, b.endTS) ? (b.endTS = t, b.endUID = n) : t === b.endTS && n > b.endUID && (b.endUID = n))), 
            u.hasOwnProperty(b.blockId) ? c.call(this, u[b.blockId]) : this._loadBlock(e, b, c.bind(this));
        },
        runAfterDeferredCalls: function(e, t) {
            this._deferredCalls.length ? this._deferredCalls.push(e) : t ? window.setZeroTimeout(e) : e();
        },
        _runDeferredCalls: function() {
            for (;this._deferredCalls.length && 0 === this._pendingLoads.length; ) {
                var e = this._deferredCalls.shift();
                try {
                    e();
                } catch (t) {
                    this._LOG.callbackErr(t);
                }
            }
        },
        _findBlockInfoFromBlockId: function(e, t) {
            var n;
            n = "header" === e ? this._headerBlockInfos : this._bodyBlockInfos;
            for (var s = 0; s < n.length; s++) {
                var i = n[s];
                if (i.blockId === t) return i;
            }
            return null;
        },
        _loadBlock: function(e, t, n) {
            function s(n) {
                n || r._LOG.badBlockLoad(e, i), r._LOG.loadBlock_end(e, i, n), "header" === e ? (r._headerBlocks[i] = n, 
                r._loadedHeaderBlockInfos.push(t)) : (r._bodyBlocks[i] = n, r._loadedBodyBlockInfos.push(t)), 
                r._pendingLoads.splice(r._pendingLoads.indexOf(o), 1);
                var s = r._pendingLoadListeners[o];
                delete r._pendingLoadListeners[o];
                for (var a = 0; a < s.length; a++) try {
                    s[a](n);
                } catch (c) {
                    r._LOG.callbackErr(c);
                }
                0 === r._pendingLoads.length && r._runDeferredCalls(), 0 !== r._mutexQueue.length || r._flushExcessTimeoutId || (r._flushExcessTimeoutId = setTimeout(r._bound_flushExcessOnTimeout, 5e3));
            }
            var i = t.blockId, o = e + i;
            if (-1 !== this._pendingLoads.indexOf(o)) return this._pendingLoadListeners[o].push(n), 
            void 0;
            this._pendingLoads.length, this._pendingLoads.push(o), this._pendingLoadListeners[o] = [ n ];
            var r = this;
            this._LOG.loadBlock_begin(e, i), "header" === e ? this._imapDb.loadHeaderBlock(this.folderId, i, s) : this._imapDb.loadBodyBlock(this.folderId, i, s);
        },
        _deleteFromBlock: function(e, t, n, s) {
            function i(t) {
                c(n, u, t), 0 === u.count && (o.splice(l, 1), delete a[u.blockId], r.splice(r.indexOf(u), 1), 
                this._dirty = !0, "header" === e ? this._dirtyHeaderBlocks[u.blockId] = null : this._dirtyBodyBlocks[u.blockId] = null), 
                s && s();
            }
            var o, r, a, c;
            this._LOG.deleteFromBlock(e, t, n), "header" === e ? (o = this._headerBlockInfos, 
            r = this._loadedHeaderBlockInfos, a = this._headerBlocks, c = this._bound_deleteHeaderFromBlock) : (o = this._bodyBlockInfos, 
            r = this._loadedBodyBlockInfos, a = this._bodyBlocks, c = this._bound_deleteBodyFromBlock);
            var d = this._findRangeObjIndexForDateAndID(o, t, n), l = d[0], u = d[1];
            return u ? (a.hasOwnProperty(u.blockId) ? i.call(this, a[u.blockId]) : this._loadBlock(e, u, i.bind(this)), 
            void 0) : (this._LOG.badDeletionRequest(e, t, n), void 0);
        },
        sliceOpenSearch: function(e) {
            this._slices.push(e);
        },
        sliceOpenMostRecent: function(e, t) {
            e.setStatus("synchronizing", !1, !0, !1, D), this.runMutexed("sync", this._sliceOpenMostRecent.bind(this, e, t));
        },
        _sliceOpenMostRecent: function(e, t, n) {
            this._slices.push(e);
            var s = function(t, s, i) {
                s || (s = t ? "syncfailed" : "synced"), void 0 === i && (i = !1), e.waitingOnData = !1, 
                e.setStatus(s, !0, i, !0), this._curSyncSlice = null, n();
            }.bind(this);
            if (this._accuracyRanges.length || "localdrafts" === this.folderMeta.type) {
                var i;
                return i = this._account.universe.online && this.folderSyncer.syncable && "localdrafts" !== this.folderMeta.type ? t ? "force" : !0 : !1, 
                e.waitingOnData = "db", this.getMessagesInImapDateRange(0, null, o.INITIAL_FILL_SIZE, o.INITIAL_FILL_SIZE, this.onFetchDBHeaders.bind(this, e, i, s, n)), 
                void 0;
            }
            if (!this._account.universe.online || "localdrafts" === this.folderMeta.type) return s(), 
            void 0;
            if (!this.folderSyncer.syncable) return console.log("Synchronization is currently blocked; waiting..."), 
            s(null, "syncblocked", !0), void 0;
            var r = e.setSyncProgress.bind(e), a = function(t, n) {
                e.waitingOnData = t, n && (e.ignoreHeaders = !0), this._curSyncSlice = e;
            }.bind(this);
            e._updateSliceFlags(), this.folderSyncer.initialSync(e, o.INITIAL_SYNC_DAYS, a, s, r);
        },
        growSlice: function(e, t, n) {
            n && e.setStatus("synchronizing", !1, !0, !1, D), this.runMutexed("grow", this._growSlice.bind(this, e, t, n));
        },
        _growSlice: function(e, t, n, s) {
            var r, a, c = [], d = function(t, d) {
                if (0 === t.length, c = r === w ? c.concat(t) : t.concat(c), !d) {
                    var l = function(t) {
                        e.desiredHeaders = e.headers.length, e.waitingOnData = !1, e.setStatus(t ? "syncfailed" : "synced", !0, !1, !0), 
                        this._curSyncSlice = null, s();
                    }.bind(this), u = e.setSyncProgress.bind(e);
                    if (c.length) {
                        var h;
                        if (this._account.universe.online && this._account.enabled && this.folderSyncer.canGrowSync) {
                            var p, f, _, y = !1;
                            if (r === w) {
                                var E = c[c.length - 1];
                                p = v() - o.OPEN_REFRESH_THRESH_MS + this._account.tzOffset, _ = e.startTS + i.DAY_MILLIS + this._account.tzOffset, 
                                f = this.headerIsOldestKnown(E.date, E.id) ? this.getOldestFullSyncDate() : E.date + this._account.tzOffset;
                            } else {
                                p = v() - o.GROW_REFRESH_THRESH_MS + this._account.tzOffset;
                                var A = c[0];
                                f = e.endTS + this._account.tzOffset, _ = A.date + i.DAY_MILLIS + this._account.tzOffset;
                            }
                            g(_, p) ? (_ = p, y = !0) : _ = b(_), h = m(f, _) ? null : this.checkAccuracyCoverageNeedingRefresh(b(f), _, o.GROW_REFRESH_THRESH_MS);
                        } else h = null;
                        return e.batchAppendHeaders(c, r === w ? -1 : 0, !0), e.desiredHeaders = Math.max(e.headers.length, a), 
                        h && h.startTS !== h.endTS ? (n || e.setStatus("synchronizing", !1, !0, !1, D), 
                        this.folderSyncer.refreshSync(e, r, b(h.startTS), y && h.endTS === p ? null : S(h.endTS), null, l, u)) : l(), 
                        void 0;
                    }
                    if (!this._account.universe.online || !this.folderSyncer.canGrowSync || !n) return this.folderSyncer.syncable && e.sendEmptyCompletion(), 
                    s(), void 0;
                    n || e.setStatus("synchronizing", !1, !0, !1, D), this._curSyncSlice = e, e.waitingOnData = "grow", 
                    e.desiredHeaders += a, this.folderSyncer.growSync(e, r, r === w ? b(e.startTS) : b(e.endTS + i.DAY_MILLIS), o.INITIAL_SYNC_GROWTH_DAYS, l, u);
                }
            }.bind(this);
            0 === this._mutexQueue.length && this.flushExcessCachedBlocks("grow"), 0 > t ? (r = E, 
            a = -t, this.getMessagesAfterMessage(e.endTS, e.endUID, a, d)) : (r = w, a = t, 
            this.getMessagesBeforeMessage(e.startTS, e.startUID, a, d));
        },
        sliceShrunk: function() {
            0 === this._mutexQueue.length && this.flushExcessCachedBlocks("shrunk");
        },
        refreshSlice: function(e) {
            e.setStatus("synchronizing", !1, !0, !1, 0), this.runMutexed("refresh", this._refreshSlice.bind(this, e, !1));
        },
        _refreshSlice: function(e, t, n) {
            e.waitingOnData = "refresh";
            var s = e.startTS, i = e.endTS, r = null, a = null;
            if (this.headerIsYoungestKnown(i, e.endUID)) {
                var c = i;
                a = 0, e._onAddingHeader = function(t) {
                    !m(t.date, c) || t.flags && -1 !== t.flags.indexOf("\\Seen") || (a += 1, e.onNewHeader && e.onNewHeader(t));
                }.bind(this), i = null;
            } else i = b(i + y + this._account.tzOffset);
            this.headerIsOldestKnown(s, e.startUID) ? (r = b(s + this._account.tzOffset), s = this.getOldestFullSyncDate()) : s += this._account.tzOffset, 
            s && (s = b(s));
            var d = function(t) {
                e._onAddingHeader = null;
                var s = "synced";
                switch (t) {
                  case "aborted":
                  case "unknown":
                    s = "syncfailed";
                }
                return n(), e.waitingOnData = !1, e.setStatus(s, !0, !1, !1, null, a), void 0;
            }.bind(this);
            return t && null === this.checkAccuracyCoverageNeedingRefresh(s, i || v() - o.OPEN_REFRESH_THRESH_MS + this._account.tzOffset, o.OPEN_REFRESH_THRESH_MS) ? (d(), 
            void 0) : (this.folderSyncer.refreshSync(e, E, s, i, r, d, e.setSyncProgress.bind(e)), 
            void 0);
        },
        _resetAndResyncSlice: function(e, t, n) {
            this._slices.splice(this._slices.indexOf(e), 1), n ? this._sliceOpenMostRecent(e, t, n) : this.sliceOpenMostRecent(e, t);
        },
        dyingSlice: function(e) {
            var t = this._slices.indexOf(e);
            this._slices.splice(t, 1), "folder" === e.type && this.flushExcessCachedBlocks("deadslice"), 
            0 === this._slices.length && 0 === this._mutexQueue.length && this.folderSyncer.allConsumersDead();
        },
        onFetchDBHeaders: function(e, t, n, s, i, o) {
            var r = !1;
            if (!o && t && (o = !0, r = !0), i.length && e.batchAppendHeaders(i, -1, !0), o) {
                if (r) {
                    e.desiredHeaders = e.headers.length, this._curSyncSlice = null;
                    var a = "force" !== t;
                    this._refreshSlice(e, a, s);
                }
            } else e.desiredHeaders = e.headers.length, n();
        },
        sliceQuicksearch: function() {},
        getYoungestMessageTimestamp: function() {
            return this._headerBlockInfos.length ? this._headerBlockInfos[0].endTS : 0;
        },
        headerIsYoungestKnown: function(e, t) {
            if (!this._headerBlockInfos.length) return null === e && null === t;
            var n = this._headerBlockInfos[0];
            return e === n.endTS && t === n.endUID;
        },
        getOldestMessageTimestamp: function() {
            return this._headerBlockInfos.length ? this._headerBlockInfos[this._headerBlockInfos.length - 1].startTS : 0;
        },
        headerIsOldestKnown: function(e, t) {
            if (!this._headerBlockInfos.length) return null === e && null === t;
            var n = this._headerBlockInfos[this._headerBlockInfos.length - 1];
            return e === n.startTS && t === n.startUID;
        },
        getNewestFullSyncDate: function() {
            return this._accuracyRanges.length ? this._accuracyRanges[0].endTS : 0;
        },
        getOldestFullSyncDate: function() {
            for (var e = this._accuracyRanges.length - 1; e >= 0 && !this._accuracyRanges[e].fullSync; ) e--;
            var t;
            return t = e >= 0 ? this._accuracyRanges[e].startTS : v();
        },
        syncedToToday: function() {
            if (!this.folderSyncer.canGrowSync) return !0;
            var e = this.getNewestFullSyncDate();
            return m(e, b(v() + this._account.tzOffset));
        },
        syncedToDawnOfTime: function() {
            if (!this.folderSyncer.canGrowSync) return !0;
            var e = this.getOldestFullSyncDate();
            return f(e, o.OLDEST_SYNC_DATE + i.DAY_MILLIS);
        },
        getKnownMessageCount: function() {
            for (var e = 0, t = 0; t < this._headerBlockInfos.length; t++) {
                var n = this._headerBlockInfos[t];
                e += n.count;
            }
            return e;
        },
        getMessagesInImapDateRange: function(e, t, n, s, i) {
            function r() {
                for (;;) {
                    if (!l._headerBlocks.hasOwnProperty(a.blockId)) return l._loadBlock("header", a, r), 
                    void 0;
                    var n = l._headerBlocks[a.blockId], s = l._findFirstObjForDateRange(n.headers, e, t), o = s[0], h = s[1];
                    if (!h) return i([], !1), void 0;
                    for (var f = o; f < n.headers.length && d && (h = n.headers[f], !p(h.date, e)); f++, 
                    d--) ;
                    if (d && f < n.headers.length ? c = 0 : c -= f - o, c && (++u >= l._headerBlockInfos.length ? c = 0 : (a = l._headerBlockInfos[u], 
                    g(e, a.endTS) && (c = 0))), i(n.headers.slice(o, f), Boolean(c)), !c) return;
                }
            }
            var a, c = null != n ? n : o.TOO_MANY_MESSAGES, d = null != s ? s : o.TOO_MANY_MESSAGES, l = this, u = null, h = this._findFirstObjIndexForDateRange(this._headerBlockInfos, e, t);
            return u = h[0], (a = h[1]) ? (r(), void 0) : (i([], !1), void 0);
        },
        getAllMessagesInImapDateRange: function(e, t, n) {
            function s(e, t) {
                i = i ? i.concat(e) : e, t || n(i);
            }
            var i = null;
            this.getMessagesInImapDateRange(e, t, null, null, s);
        },
        getMessagesBeforeMessage: function(e, t, n, s) {
            function i() {
                for (;;) {
                    if (!l._headerBlocks.hasOwnProperty(c.blockId)) return l._loadBlock("header", c, i), 
                    void 0;
                    var n = l._headerBlocks[c.blockId];
                    null === u ? (u = null !== t ? n.ids.indexOf(t) : 0, -1 === u && (l._LOG.badIterationStart(e, t), 
                    d = 0), u++) : u = 0;
                    var o = Math.min(n.headers.length - u, d);
                    if (u >= n.headers.length && (o = 0), d -= o, d && (++a >= l._headerBlockInfos.length ? d = 0 : c = l._headerBlockInfos[a]), 
                    s(n.headers.slice(u, u + o), Boolean(d)), !d) return;
                }
            }
            var r, a, c, d = null != n ? n : o.TOO_MANY_MESSAGES, l = this;
            if (e ? (r = this._findRangeObjIndexForDateAndID(this._headerBlockInfos, e, t), 
            a = r[0], c = r[1]) : (a = 0, c = this._headerBlockInfos[0]), !c) return this._LOG.badIterationStart(e, t), 
            s([], !1), void 0;
            var u = null;
            i();
        },
        getMessagesAfterMessage: function(e, t, n, s) {
            function i() {
                for (;;) {
                    if (!a._headerBlocks.hasOwnProperty(l.blockId)) return a._loadBlock("header", l, i), 
                    void 0;
                    var n = a._headerBlocks[l.blockId];
                    null === u ? (u = n.ids.indexOf(t), -1 === u && (a._LOG.badIterationStart(e, t), 
                    r = 0), u--) : u = n.headers.length - 1;
                    var o = Math.min(u + 1, r);
                    0 > u && (o = 0), r -= o, r && (--d < 0 ? r = 0 : l = a._headerBlockInfos[d]);
                    var c = n.headers.slice(u - o + 1, u + 1);
                    if (s(c, Boolean(r)), !r) return;
                }
            }
            var r = null != n ? n : o.TOO_MANY_MESSAGES, a = this, c = this._findRangeObjIndexForDateAndID(this._headerBlockInfos, e, t), d = c[0], l = c[1];
            if (!l) return this._LOG.badIterationStart(e, t), s([], !1), void 0;
            var u = null;
            i();
        },
        markSyncRange: function(e, t, n, s) {
            function i(e, t, n, s) {
                return {
                    startTS: e,
                    endTS: t,
                    fullSync: "string" == typeof n ? {
                        highestModseq: n,
                        updated: s
                    } : {
                        highestModseq: n.fullSync.highestModseq,
                        updated: n.fullSync.updated
                    }
                };
            }
            if (t || (t = v() + this._account.tzOffset), e > t) throw new Error("Your timestamps are switched!");
            var o, r, a = this._accuracyRanges, c = this._findFirstObjIndexForDateRange(a, e, t), d = this._findLastObjIndexForDateRange(a, e, t);
            o = c[1] && g(c[1].endTS, t), r = d[1] && p(d[1].startTS, e);
            var l = [], u = d[0] - c[0];
            d[1] && u++, o && (c[1].fullSync && c[1].fullSync.highestModseq === n && c[1].fullSync.updated === s ? t = c[1].endTS : l.push(i(t, c[1].endTS, c[1]))), 
            l.push(i(e, t, n, s)), r && (d[1].fullSync && d[1].fullSync.highestModseq === n && d[1].fullSync.updated === s ? l[l.length - 1].startTS = d[1].startTS : l.push(i(d[1].startTS, e, d[1])));
            var h = c[0] > 0 ? a[c[0] - 1] : null, f = d[1] ? 1 : 0, m = d[0] < a.length - f ? a[d[0] + f] : null;
            h && l[0].endTS === h.startTS && h.fullSync && h.fullSync.highestModseq === n && h.fullSync.updated === s && (l[0].endTS = h.endTS, 
            c[0]--, u++), m && l[l.length - 1].startTS === m.endTS && m.fullSync && m.fullSync.highestModseq === n && m.fullSync.updated === s && (l[l.length - 1].startTS = m.startTS, 
            u++), a.splice.apply(a, [ c[0], u ].concat(l)), this.folderMeta.lastSyncedAt = v(), 
            this._account.universe && this._account.universe.__notifyModifiedFolder(this._account, this.folderMeta);
        },
        markSyncedToDawnOfTime: function() {
            this._LOG.syncedToDawnOfTime();
            var e = this._accuracyRanges;
            e[e.length - 1].startTS = o.OLDEST_SYNC_DATE;
        },
        clearSyncedToDawnOfTime: function(e) {
            var t = this._accuracyRanges;
            if (t.length) {
                var n = t[t.length - 1];
                g(n.endTS, e) ? n.startTS = e : (this._LOG.accuracyRangeSuspect(n), t.pop());
            }
        },
        checkAccuracyCoverageNeedingRefresh: function(e, t, n) {
            var s, i = this._accuracyRanges, o = this._findFirstObjIndexForDateRange(i, e, t), r = this._findLastObjIndexForDateRange(i, e, t), a = v() - n, c = {
                startTS: e,
                endTS: t
            };
            if (o[1]) {
                var d;
                for (d = o[0]; d <= r[0] && (s = i[d], !p(s.endTS, c.endTS)) && s.fullSync && !p(s.fullSync.updated, a); d++) {
                    if (f(s.startTS, c.startTS)) return null;
                    c.endTS = s.startTS;
                }
                for (d = r[0]; d >= 0 && (s = i[d], !g(s.startTS, c.startTS)) && s.fullSync && !p(s.fullSync.updated, a); d--) c.startTS = s.endTS;
            }
            return c;
        },
        getMessage: function(e, t, n, s) {
            function i() {
                if (!--a) {
                    if (!r || !o) return s(null);
                    s({
                        header: o,
                        body: r
                    });
                }
            }
            "function" == typeof n && (s = n, n = void 0);
            var o, r, a = 2;
            this.getMessageHeader(e, t, function(e) {
                o = e, i();
            });
            var c = function(e) {
                r = e, i();
            };
            n && n.withBodyReps ? this.getMessageBodyWithReps(e, t, c) : this.getMessageBody(e, t, c);
        },
        getMessageHeader: function(e, t, n) {
            var s = parseInt(e.substring(e.lastIndexOf("/") + 1)), i = this._findRangeObjIndexForDateAndID(this._headerBlockInfos, t, s);
            if (null !== i[1]) {
                var o = i[1], r = this;
                if (!this._headerBlocks.hasOwnProperty(o.blockId)) return this._loadBlock("header", o, function(e) {
                    var t = e.ids.indexOf(s), i = e.headers[t] || null;
                    i || r._LOG.headerNotFound();
                    try {
                        n(i);
                    } catch (o) {
                        r._LOG.callbackErr(o);
                    }
                }), void 0;
                var a = this._headerBlocks[o.blockId], c = a.ids.indexOf(s), d = a.headers[c] || null;
                d || this._LOG.headerNotFound();
                try {
                    n(d);
                } catch (l) {
                    this._LOG.callbackErr(l);
                }
            } else {
                this._LOG.headerNotFound();
                try {
                    n(null);
                } catch (l) {
                    this._LOG.callbackErr(l);
                }
            }
        },
        getMessageHeaders: function(e, t) {
            for (var n = e.length, s = [], i = function(e) {
                e && s.push(e), --n || t(s);
            }, o = 0; o < e.length; o++) {
                var r = e[o];
                this.getMessageHeader(r.suid, r.date, i);
            }
        },
        addMessageHeader: function(e, t, n) {
            if (null == e.id || null == e.suid) throw new Error("No valid id: " + e.id + " or suid: " + e.suid);
            if (this._pendingLoads.length) return this._deferredCalls.push(this.addMessageHeader.bind(this, e, t, n)), 
            void 0;
            if (this._LOG.addMessageHeader(e.date, e.id, e.srvid), this.headerCount += 1, this._curSyncSlice && !this._curSyncSlice.ignoreHeaders && (this._curSyncSlice.headerCount = this.headerCount, 
            this._curSyncSlice.onHeaderAdded(e, t, !0, !0)), this._slices.length > (this._curSyncSlice ? 1 : 0)) for (var s = e.date, i = e.id, r = 0; r < this._slices.length; r++) {
                var a = this._slices[r];
                if (a !== this._curSyncSlice) {
                    if (null !== a.startTS) {
                        if (p(s, a.startTS)) {
                            if (a.headers.length >= a.desiredHeaders) continue;
                        } else if (m(s, a.endTS)) {
                            if (!this._headerBlockInfos.length || a.endTS !== this._headerBlockInfos[0].endTS || a.endUID !== this._headerBlockInfos[0].endUID) continue;
                        } else if (s === a.startTS && i < a.startUID || s === a.endTS && i > a.endUID) continue;
                    } else a.desiredHeaders++;
                    if ("folder" === a.type && (a.headerCount = this.headerCount), a._onAddingHeader) try {
                        a._onAddingHeader(e);
                    } catch (c) {
                        this._LOG.callbackErr(c);
                    }
                    try {
                        a.onHeaderAdded(e, t, !1, !0);
                    } catch (c) {
                        this._LOG.callbackErr(c);
                    }
                }
            }
            this._insertIntoBlockUsingDateAndUID("header", e.date, e.id, e.srvid, o.HEADER_EST_SIZE_IN_BYTES, e, n);
        },
        updateMessageHeader: function(e, t, n, s, i, o) {
            function r(r) {
                var a, l = r.ids.indexOf(t);
                if (-1 === l) {
                    if (!(s instanceof Function)) throw new Error("Failed to find ID " + t + "!");
                    s(null);
                } else s instanceof Function ? s(a = r.headers[l]) || (a = null) : a = r.headers[l] = s;
                if (a && (d._dirty = !0, d._dirtyHeaderBlocks[c.blockId] = r, d._LOG.updateMessageHeader(a.date, a.id, a.srvid), 
                d._slices.length > (d._curSyncSlice ? 1 : 0))) for (var u = 0; u < d._slices.length; u++) {
                    var h = d._slices[u];
                    if (!(n && h === d._curSyncSlice || p(e, h.startTS) || g(e, h.endTS) || e === h.startTS && t < h.startUID || e === h.endTS && t > h.endUID)) try {
                        h.onHeaderModified(a, i);
                    } catch (f) {
                        this._LOG.callbackErr(f);
                    }
                }
                o && o();
            }
            if (this._pendingLoads.length) return this._deferredCalls.push(this.updateMessageHeader.bind(this, e, t, n, s, i, o)), 
            void 0;
            var a = this._findRangeObjIndexForDateAndID(this._headerBlockInfos, e, t), c = (a[0], 
            a[1]), d = this;
            if (c) this._headerBlocks.hasOwnProperty(c.blockId) ? r(this._headerBlocks[c.blockId]) : this._loadBlock("header", c, r); else {
                if (!(s instanceof Function)) throw new Error("Failed to find block containing header with date: " + e + " id: " + t);
                s(null);
            }
        },
        updateMessageHeaderByServerId: function(e, t, n, s) {
            if (this._pendingLoads.length) return this._deferredCalls.push(this.updateMessageHeaderByServerId.bind(this, e, t, n)), 
            void 0;
            var i = this._serverIdHeaderBlockMapping[e];
            if (void 0 === e) return this._LOG.serverIdMappingMissing(e), void 0;
            var o = function(i) {
                for (var o = i.headers, r = 0; r < o.length; r++) {
                    var a = o[r];
                    if (a.srvid === e) return this.updateMessageHeader(a.date, a.id, t, n, s), void 0;
                }
            }.bind(this);
            if (this._headerBlocks.hasOwnProperty(i)) o(this._headerBlocks[i]); else {
                var r = this._findBlockInfoFromBlockId("header", i);
                this._loadBlock("header", r, o);
            }
        },
        unchangedMessageHeader: function(e) {
            return this._pendingLoads.length ? (this._deferredCalls.push(this.unchangedMessageHeader.bind(this, e)), 
            void 0) : (this._curSyncSlice && !this._curSyncSlice.ignoreHeaders && this._curSyncSlice.onHeaderAdded(e, !0, !1), 
            void 0);
        },
        hasMessageWithServerId: function(e) {
            if (!this._serverIdHeaderBlockMapping) throw new Error("Server ID mapping not supported for this storage!");
            var t = this._serverIdHeaderBlockMapping[e];
            return void 0 === e ? (this._LOG.serverIdMappingMissing(e), !1) : !!t;
        },
        deleteMessageHeaderAndBody: function(e, t, n) {
            this.getMessageHeader(e, t, function(e) {
                e ? this.deleteMessageHeaderAndBodyUsingHeader(e, n) : n();
            }.bind(this));
        },
        deleteMessageHeaderUsingHeader: function(e, t) {
            if (this._pendingLoads.length) return this._deferredCalls.push(this.deleteMessageHeaderUsingHeader.bind(this, e, t)), 
            void 0;
            if (this.headerCount -= 1, this._curSyncSlice && !this._curSyncSlice.ignoreHeaders && (this._curSyncSlice.headerCount = this.headerCount, 
            this._curSyncSlice.onHeaderRemoved(e)), this._slices.length > (this._curSyncSlice ? 1 : 0)) for (var n = 0; n < this._slices.length; n++) {
                var s = this._slices[n];
                "folder" === s.type && (s.headerCount = this.headerCount), s !== this._curSyncSlice && (p(e.date, s.startTS) || g(e.date, s.endTS) || e.date === s.startTS && e.id < s.startUID || e.date === s.endTS && e.id > s.endUID || s.onHeaderRemoved(e));
            }
            this._serverIdHeaderBlockMapping && e.srvid && delete this._serverIdHeaderBlockMapping[e.srvid], 
            this._deleteFromBlock("header", e.date, e.id, t);
        },
        deleteMessageHeaderAndBodyUsingHeader: function(e, t) {
            return this._pendingLoads.length ? (this._deferredCalls.push(this.deleteMessageHeaderAndBodyUsingHeader.bind(this, e, t)), 
            void 0) : (this.deleteMessageHeaderUsingHeader(e, function() {
                this._deleteFromBlock("body", e.date, e.id, t);
            }.bind(this)), void 0);
        },
        deleteMessageByServerId: function(e) {
            if (!this._serverIdHeaderBlockMapping) throw new Error("Server ID mapping not supported for this storage!");
            if (this._pendingLoads.length) return this._deferredCalls.push(this.deleteMessageByServerId.bind(this, e)), 
            void 0;
            var t = this._serverIdHeaderBlockMapping[e];
            if (void 0 === e) return this._LOG.serverIdMappingMissing(e), void 0;
            var n = function(t) {
                for (var n = t.headers, s = 0; s < n.length; s++) {
                    var i = n[s];
                    if (i.srvid === e) return this.deleteMessageHeaderAndBodyUsingHeader(i), void 0;
                }
            }.bind(this);
            if (this._headerBlocks.hasOwnProperty(t)) n(this._headerBlocks[t]); else {
                var s = this._findBlockInfoFromBlockId("header", t);
                this._loadBlock("header", s, n);
            }
        },
        addMessageBody: function(e, t, n) {
            function s(e) {
                if (d += C, e) for (var t = 0; t < e.length; t++) {
                    var n = e[t];
                    d += A + 2 * T + (n.name ? n.name.length : 0) + (n.address ? n.address.length : 0);
                }
            }
            function i(e) {
                if (d += C, e) for (var t = 0; t < e.length; t++) {
                    var n = e[t];
                    d += A + 2 * T + n.name.length + n.type.length + I;
                }
            }
            function o(e) {
                d += T + e.length;
            }
            function r(e) {
                if (d += k, e) for (var t = 0; t < e.length; t++) d += T + e[t].length;
            }
            function a(e) {
                d += k + O * (e.length / 2) + M * (e.length / 2);
                for (var t = 1; t < e.length; t += 2) e[t] && (d += e[t].length);
            }
            function c(e) {
                if (e) {
                    d += M * (e.length / 2);
                    for (var t = 0; t < e.length; t++) {
                        var n = e[t];
                        "html" === n.type ? d += M + n.amountDownloaded : n.content && a(n.content);
                    }
                }
            }
            if (this._pendingLoads.length) return this._deferredCalls.push(this.addMessageBody.bind(this, e, t, n)), 
            void 0;
            this._LOG.addMessageBody(e.date, e.id, e.srvid, t);
            var d = A + I + 4 * x;
            t.to && s(t.to), t.cc && s(t.cc), t.bcc && s(t.bcc), t.replyTo && o(t.replyTo), 
            i(t.attachments), i(t.relatedParts), r(t.references), c(t.bodyReps), t.size = d, 
            this._insertIntoBlockUsingDateAndUID("body", e.date, e.id, e.srvid, t.size, t, n);
        },
        messageBodyRepsDownloaded: function(e) {
            return e.bodyReps && e.bodyReps.length ? e.bodyReps.every(function(e) {
                return e.isDownloaded;
            }) : !0;
        },
        getMessageBodyWithReps: function(e, t, n) {
            var s = this;
            this.getMessageBody(e, t, function(i) {
                return i ? s.messageBodyRepsDownloaded(i) ? n(i) : (s._account.universe.downloadMessageBodyReps(e, t, function(e, t) {
                    n(t);
                }), void 0) : n(i);
            });
        },
        getMessageBody: function(e, t, n) {
            if (this._pendingLoads.length) return this._deferredCalls.push(this.getMessageBody.bind(this, e, t, n)), 
            void 0;
            var s = parseInt(e.substring(e.lastIndexOf("/") + 1)), i = this._findRangeObjIndexForDateAndID(this._bodyBlockInfos, t, s);
            if (null !== i[1]) {
                var o = i[1], r = this;
                if (!this._bodyBlocks.hasOwnProperty(o.blockId)) return this._loadBlock("body", o, function(e) {
                    var t = e.bodies[s] || null;
                    t || r._LOG.bodyNotFound();
                    try {
                        n(t);
                    } catch (i) {
                        r._LOG.callbackErr(i);
                    }
                }), void 0;
                var a = this._bodyBlocks[o.blockId], c = a.bodies[s] || null;
                c || this._LOG.bodyNotFound();
                try {
                    n(c);
                } catch (d) {
                    this._LOG.callbackErr(d);
                }
            } else {
                this._LOG.bodyNotFound();
                try {
                    n(null);
                } catch (d) {
                    this._LOG.callbackErr(d);
                }
            }
        },
        updateMessageBody: function(e, t, n, s, i) {
            function o() {
                n.flushBecause ? (t = null, d._account.saveAccountState(null, function() {
                    d.getMessageBody(a, e.date, r);
                }, "flushBody")) : r();
            }
            function r(e) {
                e && (t = e), s && d._account.universe && d._account.universe.__notifyModifiedBody(a, s, t), 
                i && i(t);
            }
            if ("function" == typeof s && (i = s, s = null), this._pendingLoads.length) return this._deferredCalls.push(this.updateMessageBody.bind(this, e, t, n, s, i)), 
            void 0;
            var a = e.suid, c = parseInt(a.substring(a.lastIndexOf("/") + 1)), d = this;
            this._deleteFromBlock("body", e.date, c, function() {
                d.addMessageBody(e, t, o);
            });
        },
        shutdown: function() {
            for (var e = this._slices.length - 1; e >= 0; e--) this._slices[e].die();
            this.folderSyncer.shutdown(), this._LOG.__die();
        },
        youAreDeadCleanupAfterYourself: function() {}
    };
    var B = a.LOGFAB = e.register(r, {
        MailSlice: {
            type: e.QUERY,
            events: {
                headersAppended: {},
                headerAdded: {
                    index: !1
                },
                headerModified: {
                    index: !1
                },
                headerRemoved: {
                    index: !1
                }
            },
            TEST_ONLY_events: {
                headersAppended: {
                    headers: !1
                },
                headerAdded: {
                    header: !1
                },
                headerModified: {
                    header: !1
                },
                headerRemoved: {
                    header: !1
                }
            }
        },
        FolderStorage: {
            type: e.DATABASE,
            events: {
                addMessageHeader: {
                    date: !1,
                    id: !1,
                    srvid: !1
                },
                addMessageBody: {
                    date: !1,
                    id: !1,
                    srvid: !1
                },
                updateMessageHeader: {
                    date: !1,
                    id: !1,
                    srvid: !1
                },
                updateMessageBody: {
                    date: !1,
                    id: !1
                },
                deleteFromBlock: {
                    type: !1,
                    date: !1,
                    id: !1
                },
                discardFromBlock: {
                    type: !1,
                    date: !1,
                    id: !1
                },
                headerNotFound: {},
                bodyNotFound: {},
                syncedToDawnOfTime: {}
            },
            TEST_ONLY_events: {
                addMessageBody: {
                    body: !1
                }
            },
            asyncJobs: {
                loadBlock: {
                    type: !1,
                    blockId: !1
                },
                mutexedCall: {
                    name: !0
                }
            },
            TEST_ONLY_asyncJobs: {
                loadBlock: {
                    block: !1
                }
            },
            errors: {
                callbackErr: {
                    ex: e.EXCEPTION
                },
                badBlockLoad: {
                    type: !1,
                    blockId: !1
                },
                badIterationStart: {
                    date: !1,
                    id: !1
                },
                badDeletionRequest: {
                    type: !1,
                    date: !1,
                    id: !1
                },
                badDiscardRequest: {
                    type: !1,
                    date: !1,
                    id: !1
                },
                bodyBlockMissing: {
                    id: !1,
                    idx: !1,
                    dict: !1
                },
                serverIdMappingMissing: {
                    srvid: !1
                },
                accuracyRangeSuspect: {
                    arange: !1
                },
                mutexedOpErr: {
                    err: e.EXCEPTION
                },
                tooManyCallbacks: {
                    name: !1
                },
                mutexInvariantFail: {
                    fireName: !1,
                    curName: !1
                }
            }
        }
    });
}), define("mailapi/db/mail_rep", [ "require" ], function() {
    function e(e) {
        if (!e.author) throw new Error("No author?!");
        if (!e.date) throw new Error("No date?!");
        return {
            id: e.id,
            srvid: e.srvid || null,
            suid: e.suid || null,
            guid: e.guid || null,
            author: e.author,
            to: e.to || null,
            cc: e.cc || null,
            bcc: e.bcc || null,
            replyTo: e.replyTo || null,
            date: e.date,
            flags: e.flags || [],
            hasAttachments: e.hasAttachments || !1,
            subject: null != e.subject ? e.subject : null,
            snippet: null != e.snippet ? e.snippet : null
        };
    }
    function t(e) {
        if (!e.date) throw new Error("No date?!");
        if (!e.attachments || !e.bodyReps) throw new Error("No attachments / bodyReps?!");
        return {
            date: e.date,
            size: e.size || 0,
            attachments: e.attachments,
            relatedParts: e.relatedParts || null,
            references: e.references || null,
            bodyReps: e.bodyReps
        };
    }
    function n(e) {
        if ("plain" !== e.type && "html" !== e.type) throw new Error("Bad body type: " + e.type);
        if (void 0 === e.sizeEstimate) throw new Error("Need size estimate!");
        return {
            type: e.type,
            part: e.part || null,
            sizeEstimate: e.sizeEstimate,
            amountDownloaded: e.amountDownloaded || 0,
            isDownloaded: e.isDownloaded || !1,
            _partInfo: e._partInfo || null,
            content: e.content || ""
        };
    }
    function s(e) {
        if (void 0 === e.sizeEstimate) throw new Error("Need size estimate!");
        return {
            name: null != e.name ? e.name : null,
            contentId: e.contentId || null,
            type: e.type || "application/octet-stream",
            part: e.part || null,
            encoding: e.encoding || null,
            sizeEstimate: e.sizeEstimate,
            file: e.file || null,
            charset: e.charset || null,
            textFormat: e.textFormat || null
        };
    }
    return {
        makeHeaderInfo: e,
        makeBodyInfo: t,
        makeBodyPart: n,
        makeAttachmentPart: s
    };
}), function(e, t) {
    "function" == typeof define && define.amd ? define("bleach/css-parser/tokenizer", [ "exports" ], t) : "undefined" != typeof exports ? t(exports) : t(e);
}(this, function(e) {
    function t(e) {
        return G(e, 48, 57);
    }
    function n(e) {
        return t(e) || G(e, 65, 70) || G(e, 97, 102);
    }
    function s(e) {
        return G(e, 65, 90);
    }
    function i(e) {
        return G(e, 97, 122);
    }
    function o(e) {
        return s(e) || i(e);
    }
    function r(e) {
        return e >= 160;
    }
    function a(e) {
        return o(e) || r(e) || 95 == e;
    }
    function c(e) {
        return a(e) || t(e) || 45 == e;
    }
    function d(e) {
        return G(e, 0, 8) || G(e, 14, 31) || G(e, 127, 159);
    }
    function l(e) {
        return 10 == e || 12 == e;
    }
    function u(e) {
        return l(e) || 9 == e || 32 == e;
    }
    function h(e) {
        return l(e) || isNaN(e);
    }
    function p(e, s) {
        void 0 == s && (s = {
            transformFunctionWhitespace: !1,
            scientificNotation: !1
        });
        for (var i, o, r = -1, p = [], f = "data", m = 0, M = 0, G = 0, z = function() {
            m += 1, G = M, M = 0;
        }, W = {
            line: m,
            column: M
        }, Y = function(t) {
            return void 0 === t && (t = 1), e.charCodeAt(r + t);
        }, X = function(t) {
            return void 0 === t && (t = 1), r += t, i = e.charCodeAt(r), l(i) ? z() : M += t, 
            !0;
        }, K = function() {
            return r -= 1, l(i) ? (m -= 1, M = G) : M -= 1, W.line = m, W.column = M, !0;
        }, V = function() {
            return r >= e.length;
        }, J = function() {}, $ = function(e) {
            return e ? e.finish() : e = o.finish(), s.loc === !0 && (e.loc = {}, e.loc.start = {
                line: W.line,
                column: W.column,
                idx: W.idx
            }, W = {
                line: m,
                column: M,
                idx: r
            }, e.loc.end = W), p.push(e), o = void 0, !0;
        }, Q = function(e) {
            return o = e, !0;
        }, Z = function() {
            return console.log("Parse error at index " + r + ", processing codepoint 0x" + i.toString(16) + " in state " + f + "."), 
            !0;
        }, et = function(e) {
            return console.log("MAJOR SPEC ERROR: " + e), !0;
        }, tt = function(e) {
            return f = e, !0;
        }, nt = function() {
            if (X(), n(i)) {
                for (var e = [], t = 0; 6 > t && n(i); t++) e.push(i), X();
                var s = parseInt(e.map(String.fromCharCode).join(""), 16);
                return s > j && (s = 65533), u(i) || K(), s;
            }
            return i;
        }; ;) {
            if (r > 2 * e.length) return "I'm infinite-looping!";
            switch (X(), f) {
              case "data":
                if (u(i)) for ($(new y()); u(Y()); ) X(); else if (34 == i) tt("double-quote-string"); else if (35 == i) tt("hash"); else if (39 == i) tt("single-quote-string"); else if (40 == i) $(new C()); else if (41 == i) $(new x()); else if (43 == i) t(Y()) || 46 == Y() && t(Y(2)) ? tt("number") && K() : $(new O(i)); else if (45 == i) 45 == Y(1) && 62 == Y(2) ? X(2) && $(new b()) : t(Y()) || 46 == Y(1) && t(Y(2)) ? tt("number") && K() : tt("ident") && K(); else if (46 == i) t(Y()) ? tt("number") && K() : $(new O(i)); else if (47 == i) 42 == Y() ? X() && tt("comment") : $(new O(i)); else if (58 == i) $(new S()); else if (59 == i) $(new w()); else if (60 == i) 33 == Y(1) && 45 == Y(2) && 45 == Y(3) ? X(3) && $(new v()) : $(new O(i)); else if (64 == i) tt("at-keyword"); else if (91 == i) $(new T()); else if (92 == i) h(Y()) ? Z() && $(new O(i)) : tt("ident") && K(); else if (93 == i) $(new I()); else if (123 == i) $(new E()); else if (125 == i) $(new A()); else if (t(i)) tt("number") && K(); else if (85 == i || 117 == i) 43 == Y(1) && n(Y(2)) ? X() && tt("unicode-range") : tt("ident") && K(); else if (a(i)) tt("ident") && K(); else {
                    if (V()) return $(new k()), p;
                    $(new O(i));
                }
                break;

              case "double-quote-string":
                void 0 == o && Q(new R()), 34 == i ? $() && tt("data") : V() ? Z() && $() && tt("data") && K() : l(i) ? Z() && $(new g()) && tt("data") && K() : 92 == i ? h(Y()) ? Z() && $(new g()) && tt("data") : l(Y()) ? X() : o.append(nt()) : o.append(i);
                break;

              case "single-quote-string":
                void 0 == o && Q(new R()), 39 == i ? $() && tt("data") : V() ? Z() && $() && tt("data") : l(i) ? Z() && $(new g()) && tt("data") && K() : 92 == i ? h(Y()) ? Z() && $(new g()) && tt("data") : l(Y()) ? X() : o.append(nt()) : o.append(i);
                break;

              case "hash":
                c(i) ? Q(new L(i)) && tt("hash-rest") : 92 == i ? h(Y()) ? Z() && $(new O(35)) && tt("data") && K() : Q(new L(nt())) && tt("hash-rest") : $(new O(35)) && tt("data") && K();
                break;

              case "hash-rest":
                c(i) ? o.append(i) : 92 == i ? h(Y()) ? Z() && $() && tt("data") && K() : o.append(nt()) : $() && tt("data") && K();
                break;

              case "comment":
                42 == i ? 47 == Y() ? X() && tt("data") : J() : V() ? Z() && tt("data") && K() : J();
                break;

              case "at-keyword":
                45 == i ? a(Y()) ? Q(new B(45)) && tt("at-keyword-rest") : 92 != Y(1) || h(Y(2)) ? Z() && $(new O(64)) && tt("data") && K() : Q(new AtKeywordtoken(45)) && tt("at-keyword-rest") : a(i) ? Q(new B(i)) && tt("at-keyword-rest") : 92 == i ? h(Y()) ? Z() && $(new O(35)) && tt("data") && K() : Q(new B(nt())) && tt("at-keyword-rest") : $(new O(64)) && tt("data") && K();
                break;

              case "at-keyword-rest":
                c(i) ? o.append(i) : 92 == i ? h(Y()) ? Z() && $() && tt("data") && K() : o.append(nt()) : $() && tt("data") && K();
                break;

              case "ident":
                45 == i ? a(Y()) ? Q(new N(i)) && tt("ident-rest") : 92 != Y(1) || h(Y(2)) ? $(new O(45)) && tt("data") : Q(new N(i)) && tt("ident-rest") : a(i) ? Q(new N(i)) && tt("ident-rest") : 92 == i ? h(Y()) ? Z() && tt("data") && K() : Q(new N(nt())) && tt("ident-rest") : et("Hit the generic 'else' clause in ident state.") && tt("data") && K();
                break;

              case "ident-rest":
                c(i) ? o.append(i) : 92 == i ? h(Y()) ? Z() && $() && tt("data") && K() : o.append(nt()) : 40 == i ? o.ASCIImatch("url") ? tt("url") : $(new D(o)) && tt("data") : u(i) && s.transformFunctionWhitespace ? tt("transform-function-whitespace") && K() : $() && tt("data") && K();
                break;

              case "transform-function-whitespace":
                u(Y()) ? J() : 40 == i ? $(new D(o)) && tt("data") : $() && tt("data") && K();
                break;

              case "number":
                Q(new P()), 45 == i ? t(Y()) ? X() && o.append([ 45, i ]) && tt("number-rest") : 46 == Y(1) && t(Y(2)) ? X(2) && o.append([ 45, 46, i ]) && tt("number-fraction") : tt("data") && K() : 43 == i ? t(Y()) ? X() && o.append([ 43, i ]) && tt("number-rest") : 46 == Y(1) && t(Y(2)) ? X(2) && o.append([ 43, 46, i ]) && tt("number-fraction") : tt("data") && K() : t(i) ? o.append(i) && tt("number-rest") : 46 == i ? t(Y()) ? X() && o.append([ 46, i ]) && tt("number-fraction") : tt("data") && K() : tt("data") && K();
                break;

              case "number-rest":
                t(i) ? o.append(i) : 46 == i ? t(Y()) ? X() && o.append([ 46, i ]) && tt("number-fraction") : $() && tt("data") && K() : 37 == i ? $(new H(o)) && tt("data") : 69 == i || 101 == i ? t(Y()) ? X() && o.append([ 37, i ]) && tt("sci-notation") : 43 != Y(1) && 45 != Y(1) || !t(Y(2)) ? Q(new U(o, i)) && tt("dimension") : o.append([ 37, Y(1), Y(2) ]) && X(2) && tt("sci-notation") : 45 == i ? a(Y()) ? X() && Q(new U(o, [ 45, i ])) && tt("dimension") : 92 == Y(1) && h(Y(2)) ? Z() && $() && tt("data") && K() : 92 == Y(1) ? X() && Q(new U(o, [ 45, nt() ])) && tt("dimension") : $() && tt("data") && K() : a(i) ? Q(new U(o, i)) && tt("dimension") : 92 == i ? h(Y) ? Z() && $() && tt("data") && K() : Q(new U(o, nt)) && tt("dimension") : $() && tt("data") && K();
                break;

              case "number-fraction":
                o.type = "number", t(i) ? o.append(i) : 37 == i ? $(new H(o)) && tt("data") : 69 == i || 101 == i ? t(Y()) ? X() && o.append([ 101, i ]) && tt("sci-notation") : 43 != Y(1) && 45 != Y(1) || !t(Y(2)) ? Q(new U(o, i)) && tt("dimension") : o.append([ 101, Y(1), Y(2) ]) && X(2) && tt("sci-notation") : 45 == i ? a(Y()) ? X() && Q(new U(o, [ 45, i ])) && tt("dimension") : 92 == Y(1) && h(Y(2)) ? Z() && $() && tt("data") && K() : 92 == Y(1) ? X() && Q(new U(o, [ 45, nt() ])) && tt("dimension") : $() && tt("data") && K() : a(i) ? Q(new U(o, i)) && tt("dimension") : 92 == i ? h(Y) ? Z() && $() && tt("data") && K() : Q(new U(o, nt())) && tt("dimension") : $() && tt("data") && K();
                break;

              case "dimension":
                c(i) ? o.append(i) : 92 == i ? h(Y()) ? Z() && $() && tt("data") && K() : o.append(nt()) : $() && tt("data") && K();
                break;

              case "sci-notation":
                o.type = "number", t(i) ? o.append(i) : $() && tt("data") && K();
                break;

              case "url":
                V() ? Z() && $(new _()) && tt("data") : 34 == i ? tt("url-double-quote") : 39 == i ? tt("url-single-quote") : 41 == i ? $(new F()) && tt("data") : u(i) ? J() : tt("url-unquoted") && K();
                break;

              case "url-double-quote":
                o instanceof F || Q(new F()), V() ? Z() && $(new _()) && tt("data") : 34 == i ? tt("url-end") : l(i) ? Z() && tt("bad-url") : 92 == i ? l(Y()) ? X() : h(Y()) ? Z() && $(new _()) && tt("data") && K() : o.append(nt()) : o.append(i);
                break;

              case "url-single-quote":
                o instanceof F || Q(new F()), V() ? Z() && $(new _()) && tt("data") : 39 == i ? tt("url-end") : l(i) ? Z() && tt("bad-url") : 92 == i ? l(Y()) ? X() : h(Y()) ? Z() && $(new _()) && tt("data") && K() : o.append(nt()) : o.append(i);
                break;

              case "url-end":
                V() ? Z() && $(new _()) && tt("data") : u(i) ? J() : 41 == i ? $() && tt("data") : Z() && tt("bad-url") && K();
                break;

              case "url-unquoted":
                o instanceof F || Q(new F()), V() ? Z() && $(new _()) && tt("data") : u(i) ? tt("url-end") : 41 == i ? $() && tt("data") : 34 == i || 39 == i || 40 == i || d(i) ? Z() && tt("bad-url") : 92 == i ? h(Y()) ? Z() && tt("bad-url") : o.append(nt()) : o.append(i);
                break;

              case "bad-url":
                V() ? Z() && $(new _()) && tt("data") : 41 == i ? $(new _()) && tt("data") : 92 == i ? h(Y()) ? J() : nt() : J();
                break;

              case "unicode-range":
                for (var st = [ i ], it = [ i ], ot = 1; 6 > ot && n(Y()); ot++) X(), st.push(i), 
                it.push(i);
                if (63 == Y()) {
                    for (;6 > ot && 63 == Y(); ot++) X(), st.push("0".charCodeAt(0)), it.push("f".charCodeAt(0));
                    $(new q(st, it)) && tt("data");
                } else if (45 == Y(1) && n(Y(2))) {
                    X(), X(), it = [ i ];
                    for (var ot = 1; 6 > ot && n(Y()); ot++) X(), it.push(i);
                    $(new q(st, it)) && tt("data");
                } else $(new q(st)) && tt("data");
                break;

              default:
                et("Unknown state '" + f + "'");
            }
        }
    }
    function f(e) {
        return String.fromCharCode.apply(null, e.filter(function(e) {
            return e;
        }));
    }
    function m() {
        return this;
    }
    function g() {
        return this;
    }
    function _() {
        return this;
    }
    function y() {
        return this;
    }
    function v() {
        return this;
    }
    function b() {
        return this;
    }
    function S() {
        return this;
    }
    function w() {
        return this;
    }
    function E() {
        return this;
    }
    function A() {
        return this;
    }
    function T() {
        return this;
    }
    function I() {
        return this;
    }
    function C() {
        return this;
    }
    function x() {
        return this;
    }
    function k() {
        return this;
    }
    function O(e) {
        return this.value = String.fromCharCode(e), this;
    }
    function M() {
        return this;
    }
    function N(e) {
        this.value = [], this.append(e);
    }
    function D(e) {
        this.value = e.finish().value;
    }
    function B(e) {
        this.value = [], this.append(e);
    }
    function L(e) {
        this.value = [], this.append(e);
    }
    function R(e) {
        this.value = [], this.append(e);
    }
    function F(e) {
        this.value = [], this.append(e);
    }
    function P(e) {
        this.value = [], this.append(e), this.type = "integer";
    }
    function H(e) {
        e.finish(), this.value = e.value, this.repr = e.repr;
    }
    function U(e, t) {
        e.finish(), this.num = e.value, this.unit = [], this.repr = e.repr, this.append(t);
    }
    function q(e, t) {
        return e = parseInt(f(e), 16), t = void 0 === t ? e + 1 : parseInt(f(t), 16), e > j && (t = e), 
        e > t && (t = e), t > j && (t = j), this.start = e, this.end = t, this;
    }
    var G = function(e, t, n) {
        return e >= t && n >= e;
    }, j = 1114111;
    m.prototype.finish = function() {
        return this;
    }, m.prototype.toString = function() {
        return this.tokenType;
    }, m.prototype.toJSON = function() {
        return this.toString();
    }, g.prototype = new m(), g.prototype.tokenType = "BADSTRING", _.prototype = new m(), 
    _.prototype.tokenType = "BADURL", y.prototype = new m(), y.prototype.tokenType = "WHITESPACE", 
    y.prototype.toString = function() {
        return "WS";
    }, v.prototype = new m(), v.prototype.tokenType = "CDO", b.prototype = new m(), 
    b.prototype.tokenType = "CDC", S.prototype = new m(), S.prototype.tokenType = ":", 
    w.prototype = new m(), w.prototype.tokenType = ";", E.prototype = new m(), E.prototype.tokenType = "{", 
    A.prototype = new m(), A.prototype.tokenType = "}", T.prototype = new m(), T.prototype.tokenType = "[", 
    I.prototype = new m(), I.prototype.tokenType = "]", C.prototype = new m(), C.prototype.tokenType = "(", 
    x.prototype = new m(), x.prototype.tokenType = ")", k.prototype = new m(), k.prototype.tokenType = "EOF", 
    O.prototype = new m(), O.prototype.tokenType = "DELIM", O.prototype.toString = function() {
        return "DELIM(" + this.value + ")";
    }, M.prototype = new m(), M.prototype.append = function(e) {
        if (e instanceof Array) for (var t = 0; t < e.length; t++) this.value.push(e[t]); else this.value.push(e);
        return !0;
    }, M.prototype.finish = function() {
        return this.value = this.valueAsString(), this;
    }, M.prototype.ASCIImatch = function(e) {
        return this.valueAsString().toLowerCase() == e.toLowerCase();
    }, M.prototype.valueAsString = function() {
        return "string" == typeof this.value ? this.value : f(this.value);
    }, M.prototype.valueAsCodes = function() {
        if ("string" == typeof this.value) {
            for (var e = [], t = 0; t < this.value.length; t++) e.push(this.value.charCodeAt(t));
            return e;
        }
        return this.value.filter(function(e) {
            return e;
        });
    }, N.prototype = new M(), N.prototype.tokenType = "IDENT", N.prototype.toString = function() {
        return "IDENT(" + this.value + ")";
    }, D.prototype = new M(), D.prototype.tokenType = "FUNCTION", D.prototype.toString = function() {
        return "FUNCTION(" + this.value + ")";
    }, B.prototype = new M(), B.prototype.tokenType = "AT-KEYWORD", B.prototype.toString = function() {
        return "AT(" + this.value + ")";
    }, L.prototype = new M(), L.prototype.tokenType = "HASH", L.prototype.toString = function() {
        return "HASH(" + this.value + ")";
    }, R.prototype = new M(), R.prototype.tokenType = "STRING", R.prototype.toString = function() {
        return '"' + this.value + '"';
    }, F.prototype = new M(), F.prototype.tokenType = "URL", F.prototype.toString = function() {
        return "URL(" + this.value + ")";
    }, P.prototype = new M(), P.prototype.tokenType = "NUMBER", P.prototype.toString = function() {
        return "integer" == this.type ? "INT(" + this.value + ")" : "NUMBER(" + this.value + ")";
    }, P.prototype.finish = function() {
        return this.repr = this.valueAsString(), this.value = 1 * this.repr, 0 != Math.abs(this.value) % 1 && (this.type = "number"), 
        this;
    }, H.prototype = new m(), H.prototype.tokenType = "PERCENTAGE", H.prototype.toString = function() {
        return "PERCENTAGE(" + this.value + ")";
    }, U.prototype = new m(), U.prototype.tokenType = "DIMENSION", U.prototype.toString = function() {
        return "DIM(" + this.num + "," + this.unit + ")";
    }, U.prototype.append = function(e) {
        if (e instanceof Array) for (var t = 0; t < e.length; t++) this.unit.push(e[t]); else this.unit.push(e);
        return !0;
    }, U.prototype.finish = function() {
        return this.unit = f(this.unit), this.repr += this.unit, this;
    }, q.prototype = new m(), q.prototype.tokenType = "UNICODE-RANGE", q.prototype.toString = function() {
        return this.start + 1 == this.end ? "UNICODE-RANGE(" + this.start.toString(16).toUpperCase() + ")" : this.start < this.end ? "UNICODE-RANGE(" + this.start.toString(16).toUpperCase() + "-" + this.end.toString(16).toUpperCase() + ")" : "UNICODE-RANGE()";
    }, q.prototype.contains = function(e) {
        return e >= this.start && e < this.end;
    }, e.tokenize = p, e.EOFToken = k;
}), function(e, t) {
    "function" == typeof define && define.amd ? define("bleach/css-parser/parser", [ "require", "exports" ], t) : "undefined" != typeof exports ? t(require, exports) : t(e);
}(this, function(e, t) {
    function n(e, t) {
        function n() {
            switch (h.tokenType) {
              case "(":
              case "[":
              case "{":
                return s();

              case "FUNCTION":
                return u();

              default:
                return h;
            }
        }
        function s() {
            for (var e = {
                "(": ")",
                "[": "]",
                "{": "}"
            }[h.tokenType], t = new c(h.tokenType); ;) switch (y(), h.tokenType) {
              case "EOF":
              case e:
                return t;

              default:
                t.append(n());
            }
        }
        function u() {
            for (var e = new d(h.value), t = new l(); ;) switch (y(), h.tokenType) {
              case "EOF":
              case ")":
                return e.append(t), e;

              case "DELIM":
                "," == h.value ? (e.append(t), t = new l()) : t.append(h);
                break;

              default:
                t.append(n());
            }
        }
        var h, p, f = t || "top-level", m = -1;
        switch (f) {
          case "top-level":
            p = new i();
            break;

          case "declaration":
            p = new r();
        }
        p.startTok = e[0];
        for (var g = [ p ], _ = g[0], y = function(t) {
            return void 0 === t && (t = 1), m += t, h = m < e.length ? e[m] : new EOFToken(), 
            !0;
        }, v = function() {
            return m--, !0;
        }, b = function() {
            return e[m + 1];
        }, S = function(e) {
            return void 0 === e ? "" !== _.fillType ? f = _.fillType : "STYLESHEET" == _.type ? f = "top-level" : (console.log("Unknown rule-type while switching to current rule's content mode: ", _), 
            f = "") : f = e, !0;
        }, w = function(e) {
            return _ = e, _.startTok = h, g.push(_), !0;
        }, E = function(e) {
            return console.log("Parse error at token " + m + ": " + h + ".\n" + e), !0;
        }, A = function() {
            var e = g.pop();
            return e.endTok = h, _ = g[g.length - 1], _.append(e), !0;
        }, T = function() {
            return g.pop(), _ = g[g.length - 1], !0;
        }, I = function() {
            for (;g.length > 1; ) A();
            _.endTok = h;
        }; ;) switch (y(), f) {
          case "top-level":
            switch (h.tokenType) {
              case "CDO":
              case "CDC":
              case "WHITESPACE":
                break;

              case "AT-KEYWORD":
                w(new o(h.value)) && S("at-rule");
                break;

              case "{":
                E("Attempt to open a curly-block at top-level.") && n();
                break;

              case "EOF":
                return I(), p;

              default:
                w(new r()) && S("selector") && v();
            }
            break;

          case "at-rule":
            switch (h.tokenType) {
              case ";":
                A() && S();
                break;

              case "{":
                "" !== _.fillType ? S(_.fillType) : E("Attempt to open a curly-block in a statement-type at-rule.") && T() && S("next-block") && v();
                break;

              case "EOF":
                return I(), p;

              default:
                _.appendPrelude(n());
            }
            break;

          case "rule":
            switch (h.tokenType) {
              case "WHITESPACE":
                break;

              case "}":
                A() && S();
                break;

              case "AT-KEYWORD":
                w(new o(h.value)) && S("at-rule");
                break;

              case "EOF":
                return I(), p;

              default:
                w(new r()) && S("selector") && v();
            }
            break;

          case "selector":
            switch (h.tokenType) {
              case "{":
                S("declaration");
                break;

              case "EOF":
                return T() && I(), p;

              default:
                _.appendSelector(n());
            }
            break;

          case "declaration":
            switch (h.tokenType) {
              case "WHITESPACE":
              case ";":
                break;

              case "}":
                A() && S();
                break;

              case "AT-RULE":
                w(new o(h.value)) && S("at-rule");
                break;

              case "IDENT":
                w(new a(h.value)) && S("after-declaration-name");
                break;

              case "EOF":
                return I(), p;

              default:
                E() && T() && S("next-declaration");
            }
            break;

          case "after-declaration-name":
            switch (h.tokenType) {
              case "WHITESPACE":
                break;

              case ":":
                S("declaration-value");
                break;

              case ";":
                E("Incomplete declaration - semicolon after property name.") && T() && S();
                break;

              case "EOF":
                return T() && I(), p;

              default:
                E("Invalid declaration - additional token after property name") && T() && S("next-declaration");
            }
            break;

          case "declaration-value":
            switch (h.tokenType) {
              case "DELIM":
                "!" == h.value && "IDENTIFIER" == b().tokenType && "important" == b().value.toLowerCase() ? (y(), 
                _.important = !0, S("declaration-end")) : _.append(h);
                break;

              case ";":
                A() && S();
                break;

              case "}":
                A() && A() && S();
                break;

              case "EOF":
                return I(), p;

              default:
                _.append(n());
            }
            break;

          case "declaration-end":
            switch (h.tokenType) {
              case "WHITESPACE":
                break;

              case ";":
                A() && S();
                break;

              case "}":
                A() && A() && S();
                break;

              case "EOF":
                return I(), p;

              default:
                E("Invalid declaration - additional token after !important.") && T() && S("next-declaration");
            }
            break;

          case "next-block":
            switch (h.tokenType) {
              case "{":
                n() && S();
                break;

              case "EOF":
                return I(), p;

              default:
                n();
            }
            break;

          case "next-declaration":
            switch (h.tokenType) {
              case ";":
                S("declaration");
                break;

              case "}":
                S("declaration") && v();
                break;

              case "EOF":
                return I(), p;

              default:
                n();
            }
            break;

          default:
            return console.log("Unknown parsing mode: " + f), void 0;
        }
    }
    function s() {
        return this;
    }
    function i() {
        return this.value = [], this;
    }
    function o(e) {
        return this.name = e, this.prelude = [], this.value = [], e in o.registry && (this.fillType = o.registry[e]), 
        this;
    }
    function r() {
        return this.selector = [], this.value = [], this;
    }
    function a(e) {
        return this.name = e, this.value = [], this;
    }
    function c(e) {
        return this.name = e, this.value = [], this;
    }
    function d(e) {
        return this.name = e, this.value = [], this;
    }
    function l() {
        return this.value = [], this;
    }
    e("./tokenizer"), s.prototype.fillType = "", s.prototype.toString = function(e) {
        return JSON.stringify(this.toJSON(), null, e);
    }, s.prototype.append = function(e) {
        return this.value.push(e), this;
    }, i.prototype = new s(), i.prototype.type = "STYLESHEET", i.prototype.toJSON = function() {
        return {
            type: "stylesheet",
            value: this.value.map(function(e) {
                return e.toJSON();
            })
        };
    }, o.prototype = new s(), o.prototype.type = "AT-RULE", o.prototype.appendPrelude = function(e) {
        return this.prelude.push(e), this;
    }, o.prototype.toJSON = function() {
        return {
            type: "at",
            name: this.name,
            prelude: this.prelude.map(function(e) {
                return e.toJSON();
            }),
            value: this.value.map(function(e) {
                return e.toJSON();
            })
        };
    }, o.registry = {
        "import": "",
        media: "rule",
        "font-face": "declaration",
        page: "declaration",
        keyframes: "rule",
        namespace: "",
        "counter-style": "declaration",
        supports: "rule",
        document: "rule",
        "font-feature-values": "declaration",
        viewport: "",
        "region-style": "rule"
    }, r.prototype = new s(), r.prototype.type = "STYLE-RULE", r.prototype.fillType = "declaration", 
    r.prototype.appendSelector = function(e) {
        return this.selector.push(e), this;
    }, r.prototype.toJSON = function() {
        return {
            type: "selector",
            selector: this.selector.map(function(e) {
                return e.toJSON();
            }),
            value: this.value.map(function(e) {
                return e.toJSON();
            })
        };
    }, a.prototype = new s(), a.prototype.type = "DECLARATION", a.prototype.toJSON = function() {
        return {
            type: "declaration",
            name: this.name,
            value: this.value.map(function(e) {
                return e.toJSON();
            })
        };
    }, c.prototype = new s(), c.prototype.type = "BLOCK", c.prototype.toJSON = function() {
        return {
            type: "block",
            name: this.name,
            value: this.value.map(function(e) {
                return e.toJSON();
            })
        };
    }, d.prototype = new s(), d.prototype.type = "FUNCTION", d.prototype.toJSON = function() {
        return {
            type: "func",
            name: this.name,
            value: this.value.map(function(e) {
                return e.toJSON();
            })
        };
    }, l.prototype = new s(), l.prototype.type = "FUNCTION-ARG", l.prototype.toJSON = function() {
        return this.value.map(function(e) {
            return e.toJSON();
        });
    }, t.parse = n;
}), "object" == typeof exports && "function" != typeof define && (define = function(e) {
    e(require, exports, module);
}), define("bleach", [ "require", "exports", "module", "./bleach/css-parser/tokenizer", "./bleach/css-parser/parser" ], function(e, t) {
    function n() {
        h = {}, Object.keys(m).forEach(function(e) {
            h[m[e]] = e;
        });
    }
    function s(e) {
        return e.replace(/[<>"']|&(?![#a-zA-Z0-9]+;)/g, function(e) {
            return "&#" + e.charCodeAt(0) + ";";
        });
    }
    var i = e("./bleach/css-parser/tokenizer"), o = e("./bleach/css-parser/parser"), r = [ "a", "abbr", "acronym", "b", "blockquote", "code", "em", "i", "li", "ol", "strong", "ul" ], a = {
        a: [ "href", "title" ],
        abbr: [ "title" ],
        acronym: [ "title" ]
    }, c = [], d = {
        tags: r,
        prune: [],
        attributes: a,
        styles: c,
        strip: !1,
        stripComments: !0
    };
    t.clean = function(e, n) {
        return e ? (e = e.replace(/<!DOCTYPE\s+[^>]*>/g, ""), t.cleanNode(e, n)) : "";
    }, t.cleanNode = function(e, t) {
        try {
            t = t || d;
            var n, s = t.hasOwnProperty("attributes") ? t.attributes : d.attributes;
            Array.isArray(s) ? (n = s, s = {}) : n = s.hasOwnProperty("*") ? s["*"] : [];
            var i = {
                ignoreComment: "stripComments" in t ? t.stripComments : d.stripComments,
                allowedStyles: t.styles || d.styles,
                allowedTags: t.tags || d.tags,
                stripMode: "strip" in t ? t.strip : d.strip,
                pruneTags: t.prune || d.prune,
                allowedAttributesByTag: s,
                wildAttributes: n,
                callbackRegexp: t.callbackRegexp || null,
                callback: t.callbackRegexp && t.callback || null,
                maxLength: t.maxLength || 0
            }, o = new u(i);
            return p.HTMLParser(e, o), o.output;
        } catch (r) {
            throw console.error(r, "\n", r.stack), r;
        }
    };
    var l = /\s+/g, u = function(e) {
        this.output = "", this.ignoreComment = e.ignoreComment, this.allowedStyles = e.allowedStyles, 
        this.allowedTags = e.allowedTags, this.stripMode = e.stripMode, this.pruneTags = e.pruneTags, 
        this.allowedAttributesByTag = e.allowedAttributesByTag, this.wildAttributes = e.wildAttributes, 
        this.callbackRegexp = e.callbackRegexp, this.callback = e.callback, this.isInsideStyleTag = !1, 
        this.isInsidePrunedTag = 0, this.isInsideStrippedTag = 0, this.maxLength = e.maxLength || 0, 
        this.complete = !1, this.ignoreFragments = this.maxLength > 0;
    };
    u.prototype = {
        start: function(e, t, n) {
            if (-1 !== this.pruneTags.indexOf(e)) return n || this.isInsidePrunedTag++, void 0;
            if (!this.isInsidePrunedTag) {
                if (-1 === this.allowedTags.indexOf(e)) return this.stripMode ? (n || this.isInsideStrippedTag++, 
                void 0) : (this.output += "&lt;" + (n ? "/" : "") + e + "&gt;", void 0);
                this.isInsideStyleTag = "style" == e && !n;
                var s = this.callbackRegexp;
                s && s.test(e) && (t = this.callback(e, t));
                for (var i = this.allowedAttributesByTag[e], o = this.wildAttributes, r = "<" + e, a = 0; a < t.length; a++) {
                    var c = t[a], d = c.name.toLowerCase();
                    if (-1 !== o.indexOf(d) || i && -1 !== i.indexOf(d)) if ("style" == d) {
                        var l = "";
                        try {
                            l = f.parseAttribute(c.escaped, this.allowedStyles);
                        } catch (u) {
                            console.log('CSSParser.parseAttribute failed for: "' + c.escaped + '", skipping. Error: ' + u);
                        }
                        r += " " + d + '="' + l + '"';
                    } else r += " " + d + '="' + c.escaped + '"';
                }
                r += (n ? "/" : "") + ">", this.output += r;
            }
        },
        end: function(e) {
            if (-1 !== this.pruneTags.indexOf(e)) return this.isInsidePrunedTag--, void 0;
            if (!this.isInsidePrunedTag) {
                if (-1 === this.allowedTags.indexOf(e)) return this.isInsideStrippedTag ? (this.isInsideStrippedTag--, 
                void 0) : (this.output += "&lt;/" + e + "&gt;", void 0);
                this.isInsideStyleTag && (this.isInsideStyleTag = !1), this.output += "</" + e + ">";
            }
        },
        chars: function(e) {
            if (!this.isInsidePrunedTag && !this.complete) {
                if (this.isInsideStyleTag) return this.output += f.parseBody(e, this.allowedStyles), 
                void 0;
                if (this.maxLength) {
                    if (this.insideTagForSnippet) return -1 !== e.indexOf(">") && (this.insideTagForSnippet = !1), 
                    void 0;
                    if ("<" === e.charAt(0)) return this.insideTagForSnippet = !0, void 0;
                    var t = e.replace(l, " "), n = this.output.length;
                    n && " " === t[0] && " " === this.output[n - 1] && (t = t.substring(1)), this.output += t, 
                    this.output.length >= this.maxLength && (this.output = this.output.substring(0, this.maxLength), 
                    this.complete = !0);
                } else this.output += s(e);
            }
        },
        comment: function(e) {
            this.isInsidePrunedTag || this.ignoreComment || (this.output += "<!--" + e + "-->");
        }
    };
    var h, p = function() {
        function e(e) {
            for (var t = {}, n = e.split(","), s = 0; s < n.length; s++) t[n[s]] = !0;
            return t;
        }
        var t = /^<(?:[-A-Za-z0-9_]+:)?([-A-Za-z0-9_]+)([^>]*)>/, n = /^<\/(?:[-A-Za-z0-9_]+:)?([-A-Za-z0-9_]+)[^>]*>/, s = /(?:[-A-Za-z0-9_]+:)?([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^>\s]+)))?/g, i = e("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed"), o = e("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul"), r = e("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"), a = e("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"), c = e("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"), d = e("script,style");
        return this.HTMLParser = function(e, l) {
            function u(e, t, n) {
                if (t = t.toLowerCase(), o[t]) for (;g.last() && r[g.last()]; ) h("", g.last());
                a[t] && g.last() == t && h("", t);
                var d = i[t];
                if (n.length && "/" === n[n.length - 1] && (d = !0, n = n.slice(0, -1)), d || g.push(t), 
                l.start) {
                    var u = [];
                    n.replace(s, function(e, t) {
                        var n = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : c[t] ? t : "";
                        u.push({
                            name: t,
                            value: n,
                            escaped: n.replace(/"/g, "&quot;")
                        });
                    }), l.start && l.start(t, u, d);
                }
            }
            function h(e, t) {
                if (t) {
                    t = t.toLowerCase();
                    for (var n = g.length - 1; n >= 0 && g[n] != t; n--) ;
                } else var n = 0;
                if (n >= 0) {
                    for (var s = g.length - 1; s >= n; s--) l.end && l.end(g[s]);
                    g.length = n;
                }
            }
            var p, f, m, g = [], _ = e;
            for (g.last = function() {
                return this[this.length - 1];
            }; e; ) {
                if (f = !0, g.last() && d[g.last()]) {
                    var y = !1;
                    if (e = e.replace(new RegExp("^([^]*?)</" + g.last() + "[^>]*>", "i"), function(e, t) {
                        return y || (t = t.replace(/<!--([^]*?)-->/g, "$1").replace(/<!\[CDATA\[([^]*?)]]>/g, "$1"), 
                        l.chars && (l.chars(t), y = l.complete)), "";
                    }), l.complete) return this;
                    h("", g.last());
                } else if (0 == e.lastIndexOf("<!--", 0) ? (p = e.indexOf("-->"), p >= 5 ? (l.comment && l.comment(e.substring(4, p)), 
                e = e.substring(p + 3), f = !1) : (l.comment && l.comment(e.substring(4, -1)), e = "", 
                f = !1)) : 0 == e.lastIndexOf("</", 0) ? (m = e.match(n), m && (e = e.substring(m[0].length), 
                m[0].replace(n, h), f = !1)) : 0 == e.lastIndexOf("<", 0) && (m = e.match(t), m && (e = e.substring(m[0].length), 
                m[0].replace(t, u), f = !1)), f) {
                    if (p = e.indexOf("<"), 0 === p) {
                        var v = e.substring(0, 1);
                        e = e.substring(1);
                    } else {
                        var v = 0 > p ? e : e.substring(0, p);
                        e = 0 > p ? "" : e.substring(p);
                    }
                    if (l.chars && (l.chars(v), l.complete)) return this;
                }
                if (e == _) {
                    if (l.ignoreFragments) return;
                    throw console.log(e), console.log(_), "Parse Error: " + e;
                }
                _ = e;
            }
            h();
        }, this;
    }(), f = {
        parseAttribute: function(e, t) {
            var n = i.tokenize(e, {
                loc: !0
            }), s = o.parse(n, "declaration"), r = [];
            this._filterDeclarations(null, s.value, t, e, r);
            var a = r.join("");
            return a;
        },
        _filterDeclarations: function(e, t, n, s, i) {
            for (var o = 0; o < t.length; o++) {
                var r = t[o];
                "DECLARATION" === r.type && -1 !== n.indexOf(r.name) && i.push(s.substring(r.startTok.loc.start.idx, e && e.endTok === r.endTok ? r.endTok.loc.start.idx : r.endTok.loc.end.idx + 1));
            }
        },
        parseBody: function(e, t) {
            var n = "";
            try {
                for (var s = i.tokenize(e, {
                    loc: !0
                }), r = o.parse(s), a = [], c = 0; c < r.value.length; c++) {
                    var d = r.value[c];
                    "STYLE-RULE" === d.type && (a.push(e.substring(d.startTok.loc.start.idx, d.value.length ? d.value[0].startTok.loc.start.idx : d.endTok.loc.start.idx)), 
                    this._filterDeclarations(d, d.value, t, e, a), a.push(e.substring(d.endTok.loc.start.idx, d.endTok.loc.end.idx + 1)));
                }
                n = a.join("");
            } catch (l) {
                console.log("bleach CSS parsing failed, skipping. Error: " + l), n = "";
            }
            return n;
        }
    }, m = {
        34: "quot",
        38: "amp",
        39: "apos",
        60: "lt",
        62: "gt",
        160: "nbsp",
        161: "iexcl",
        162: "cent",
        163: "pound",
        164: "curren",
        165: "yen",
        166: "brvbar",
        167: "sect",
        168: "uml",
        169: "copy",
        170: "ordf",
        171: "laquo",
        172: "not",
        173: "shy",
        174: "reg",
        175: "macr",
        176: "deg",
        177: "plusmn",
        178: "sup2",
        179: "sup3",
        180: "acute",
        181: "micro",
        182: "para",
        183: "middot",
        184: "cedil",
        185: "sup1",
        186: "ordm",
        187: "raquo",
        188: "frac14",
        189: "frac12",
        190: "frac34",
        191: "iquest",
        192: "Agrave",
        193: "Aacute",
        194: "Acirc",
        195: "Atilde",
        196: "Auml",
        197: "Aring",
        198: "AElig",
        199: "Ccedil",
        200: "Egrave",
        201: "Eacute",
        202: "Ecirc",
        203: "Euml",
        204: "Igrave",
        205: "Iacute",
        206: "Icirc",
        207: "Iuml",
        208: "ETH",
        209: "Ntilde",
        210: "Ograve",
        211: "Oacute",
        212: "Ocirc",
        213: "Otilde",
        214: "Ouml",
        215: "times",
        216: "Oslash",
        217: "Ugrave",
        218: "Uacute",
        219: "Ucirc",
        220: "Uuml",
        221: "Yacute",
        222: "THORN",
        223: "szlig",
        224: "agrave",
        225: "aacute",
        226: "acirc",
        227: "atilde",
        228: "auml",
        229: "aring",
        230: "aelig",
        231: "ccedil",
        232: "egrave",
        233: "eacute",
        234: "ecirc",
        235: "euml",
        236: "igrave",
        237: "iacute",
        238: "icirc",
        239: "iuml",
        240: "eth",
        241: "ntilde",
        242: "ograve",
        243: "oacute",
        244: "ocirc",
        245: "otilde",
        246: "ouml",
        247: "divide",
        248: "oslash",
        249: "ugrave",
        250: "uacute",
        251: "ucirc",
        252: "uuml",
        253: "yacute",
        254: "thorn",
        255: "yuml",
        402: "fnof",
        913: "Alpha",
        914: "Beta",
        915: "Gamma",
        916: "Delta",
        917: "Epsilon",
        918: "Zeta",
        919: "Eta",
        920: "Theta",
        921: "Iota",
        922: "Kappa",
        923: "Lambda",
        924: "Mu",
        925: "Nu",
        926: "Xi",
        927: "Omicron",
        928: "Pi",
        929: "Rho",
        931: "Sigma",
        932: "Tau",
        933: "Upsilon",
        934: "Phi",
        935: "Chi",
        936: "Psi",
        937: "Omega",
        945: "alpha",
        946: "beta",
        947: "gamma",
        948: "delta",
        949: "epsilon",
        950: "zeta",
        951: "eta",
        952: "theta",
        953: "iota",
        954: "kappa",
        955: "lambda",
        956: "mu",
        957: "nu",
        958: "xi",
        959: "omicron",
        960: "pi",
        961: "rho",
        962: "sigmaf",
        963: "sigma",
        964: "tau",
        965: "upsilon",
        966: "phi",
        967: "chi",
        968: "psi",
        969: "omega",
        977: "thetasym",
        978: "upsih",
        982: "piv",
        8226: "bull",
        8230: "hellip",
        8242: "prime",
        8243: "Prime",
        8254: "oline",
        8260: "frasl",
        8472: "weierp",
        8465: "image",
        8476: "real",
        8482: "trade",
        8501: "alefsym",
        8592: "larr",
        8593: "uarr",
        8594: "rarr",
        8595: "darr",
        8596: "harr",
        8629: "crarr",
        8656: "lArr",
        8657: "uArr",
        8658: "rArr",
        8659: "dArr",
        8660: "hArr",
        8704: "forall",
        8706: "part",
        8707: "exist",
        8709: "empty",
        8711: "nabla",
        8712: "isin",
        8713: "notin",
        8715: "ni",
        8719: "prod",
        8721: "sum",
        8722: "minus",
        8727: "lowast",
        8730: "radic",
        8733: "prop",
        8734: "infin",
        8736: "ang",
        8743: "and",
        8744: "or",
        8745: "cap",
        8746: "cup",
        8747: "int",
        8756: "there4",
        8764: "sim",
        8773: "cong",
        8776: "asymp",
        8800: "ne",
        8801: "equiv",
        8804: "le",
        8805: "ge",
        8834: "sub",
        8835: "sup",
        8836: "nsub",
        8838: "sube",
        8839: "supe",
        8853: "oplus",
        8855: "otimes",
        8869: "perp",
        8901: "sdot",
        8968: "lceil",
        8969: "rceil",
        8970: "lfloor",
        8971: "rfloor",
        9001: "lang",
        9002: "rang",
        9674: "loz",
        9824: "spades",
        9827: "clubs",
        9829: "hearts",
        9830: "diams",
        338: "OElig",
        339: "oelig",
        352: "Scaron",
        353: "scaron",
        376: "Yuml",
        710: "circ",
        732: "tilde",
        8194: "ensp",
        8195: "emsp",
        8201: "thinsp",
        8204: "zwnj",
        8205: "zwj",
        8206: "lrm",
        8207: "rlm",
        8211: "ndash",
        8212: "mdash",
        8216: "lsquo",
        8217: "rsquo",
        8218: "sbquo",
        8220: "ldquo",
        8221: "rdquo",
        8222: "bdquo",
        8224: "dagger",
        8225: "Dagger",
        8240: "permil",
        8249: "lsaquo",
        8250: "rsaquo",
        8364: "euro"
    }, g = /\&([#a-zA-Z0-9]+);/g;
    t.unescapeHTMLEntities = function(e) {
        return e.replace(g, function(e, t) {
            var s = "";
            if ("#" === t.charAt(0)) {
                var i = t.charAt(1);
                s = "x" === i || "X" === i ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(parseInt(t.substring(1), 10));
            } else h || n(), h.hasOwnProperty(t) && (s = String.fromCharCode(h[t]));
            return s;
        });
    }, t.escapePlaintextIntoElementContext = function(e) {
        return e.replace(/[&<>"'\/]/g, function(e) {
            var t = e.charCodeAt(0);
            return "&" + (m[t] || "#" + t) + ";";
        });
    }, t.escapePlaintextIntoAttribute = function(e) {
        return e.replace(/[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u0100]/g, function(e) {
            var t = e.charCodeAt(0);
            return "&" + (m[t] || "#" + t) + ";";
        });
    };
}), define("mailapi/htmlchew", [ "exports", "bleach" ], function(e, t) {
    function n(e, t) {
        for (var n = e.length, s = 0; n > s; s++) {
            var i = e[s];
            if (i.name.toLowerCase() === t) return i;
        }
        return null;
    }
    function s(e, t) {
        var s;
        if (h.test(e)) {
            t = t.filter(function(e) {
                switch (e.name.toLowerCase()) {
                  case "cid-src":
                  case "ext-src":
                    return !1;

                  case "class":
                    s = e;

                  default:
                    return !0;
                }
            });
            var i = n(t, "src");
            i && (d.test(i.escaped) ? (i.name = "cid-src", s ? s.escaped += " moz-embedded-image" : t.push({
                name: "class",
                escaped: "moz-embedded-image"
            }), i.escaped = i.escaped.substring(4)) : l.test(i.escaped) && (i.name = "ext-src", 
            s ? s.escaped += " moz-external-image" : t.push({
                name: "class",
                escaped: "moz-external-image"
            })));
        } else {
            t = t.filter(function(e) {
                switch (e.name.toLowerCase()) {
                  case "cid-src":
                  case "ext-src":
                    return !1;

                  case "class":
                    s = e;

                  default:
                    return !0;
                }
            });
            var o = n(t, "href");
            if (o) {
                var r = o.escaped;
                l.test(r) || u.test(r) ? (o.name = "ext-href", s ? s.escaped += " moz-external-link" : t.push({
                    name: "class",
                    escaped: "moz-external-link"
                })) : t.splice(t.indexOf(o), 1);
            }
        }
        return t;
    }
    var i = [ "a", "abbr", "acronym", "area", "article", "aside", "b", "bdi", "bdo", "big", "blockquote", "br", "caption", "center", "cite", "code", "col", "colgroup", "dd", "del", "details", "dfn", "dir", "div", "dl", "dt", "em", "figcaption", "figure", "font", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "i", "img", "ins", "kbd", "label", "legend", "li", "listing", "map", "mark", "nav", "nobr", "noscript", "ol", "output", "p", "pre", "q", "rp", "rt", "ruby", "s", "samp", "section", "small", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "time", "title", "tr", "tt", "u", "ul", "var", "wbr" ], o = [ "button", "datalist", "script", "select", "svg", "title" ], r = {
        "*": [ "abbr", "align", "alt", "axis", "bgcolor", "border", "cellpadding", "cellspacing", "charoff", "class", "clear", "color", "cols", "colspan", "compact", "coords", "datetime", "dir", "face", "frame", "headers", "height", "hspace", "id", "lang", "media", "nohref", "noshade", "nowrap", "open", "pointsize", "pubdate", "reversed", "rows", "rowspan", "rules", "size", "scope", "scoped", "shape", "span", "start", "summary", "style", "title", "valign", "value", "vspace", "width" ],
        a: [ "ext-href", "hreflang" ],
        area: [ "ext-href", "hreflang" ],
        blockquote: [ "cite", "type" ],
        img: [ "cid-src", "ext-src", "ismap", "usemap" ],
        meta: [ "charset" ],
        ol: [ "type" ],
        style: [ "type" ]
    }, a = [ "background-color", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-color", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "clear", "color", "display", "float", "font-family", "font-size", "font-style", "font-weight", "height", "line-height", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "text-align", "text-align-last", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-style", "text-indent", "vertical-align", "white-space", "width", "word-break", "word-spacing", "word-wrap" ], c = /^(?:a|area|img)$/, d = /^cid:/i, l = /^http(?:s)?/i, u = /^mailto:/i, h = /^img$/, p = {
        tags: i,
        strip: !0,
        stripComments: !0,
        prune: o,
        attributes: r,
        styles: a,
        asNode: !0,
        callbackRegexp: c,
        callback: s
    }, f = {
        tags: [],
        strip: !0,
        stripComments: !0,
        prune: [ "style", "button", "datalist", "script", "select", "svg", "title" ],
        asNode: !0,
        maxLength: 100
    };
    e.sanitizeAndNormalizeHtml = function(e) {
        return t.clean(e, p);
    }, e.generateSnippet = function(e) {
        return t.unescapeHTMLEntities(t.clean(e, f));
    };
    var m = {
        tags: [],
        strip: !0,
        stripComments: !0,
        prune: [ "style", "button", "datalist", "script", "select", "svg", "title" ],
        asNode: !0
    }, g = {
        tags: [],
        strip: !0,
        stripComments: !0,
        prune: [ "style", "button", "datalist", "script", "select", "svg", "title", "blockquote" ],
        asNode: !0
    };
    e.generateSearchableTextVersion = function(e, n) {
        var s;
        s = n ? m : g;
        var i = t.clean(e, s);
        return t.unescapeHTMLEntities(i);
    }, e.wrapTextIntoSafeHTMLString = function(e, n, s, i) {
        void 0 === s && (s = !0), n = n || "div", e = t.escapePlaintextIntoElementContext(e), 
        e = s ? e.replace(/\n/g, "<br/>") : e;
        var o = "";
        if (i) for (var r = i.length, a = 0; r > a; a += 2) o += " " + i[a] + '="' + t.escapePlaintextIntoAttribute(i[a + 1]) + '"';
        return "<" + n + o + ">" + e + "</" + n + ">";
    };
    var _ = /"/g;
    e.escapeAttrValue = function(e) {
        return e.replace(_, "&quot;");
    };
}), define("mailapi/searchfilter", [ "rdcommon/log", "./util", "./syncbase", "./date", "./htmlchew", "module", "exports" ], function(e, t, n, s, i, o, r) {
    function a(e, t) {
        var n = e.header, s = t.header, i = s.date - n.date;
        return i ? i : s.id - n.id;
    }
    function c(e, t, n) {
        if (!t) return null;
        if (e instanceof RegExp) return e.exec(n ? t.slice(n) : t);
        var s = t.indexOf(e, n);
        if (-1 == s) return null;
        var i = [ e ];
        return i.index = s - n, i;
    }
    function d(e) {
        this.phrase = e;
    }
    function l(e, t, n, s, i) {
        this.phrase = e, this.stopAfter = t, this.checkTo = n, this.checkCc = s, this.checkBcc = i;
    }
    function u(e, t, n, s, i, o) {
        s > t && (s = t);
        var r = e.indexOf(" ", t - s);
        -1 === r || r >= t - 1 ? r = t - s : r++;
        var a;
        t + n + i >= e.length ? a = e.length : (a = e.lastIndexOf(" ", t + n + i - 1), t + n >= a && (a = t + n + i));
        var c = e.substring(r, a);
        return {
            text: c,
            offset: r,
            matchRuns: [ {
                start: t - r,
                length: n
            } ],
            path: o
        };
    }
    function h(e, t, n, s) {
        this.phrase = e, this.stopAfter = t, this.contextBefore = n, this.contextAfter = s;
    }
    function p(e, t, n, s, i) {
        this.phrase = e, this.stopAfter = n, this.contextBefore = s, this.contextAfter = i, 
        this.matchQuotes = t;
    }
    function f(e) {
        this.filters = e, this.bodiesNeeded = !1, this.messagesChecked = 0;
        for (var t = 0; t < e.length; t++) {
            var n = e[t];
            n.needsBody && (this.bodiesNeeded = !0);
        }
    }
    function m(e, t, s, i, o) {
        console.log("sf: creating SearchSlice:", s), this._bridgeHandle = e, e.__listener = this, 
        e.userCanGrowDownwards = !1, this._storage = t, this._LOG = E.SearchSlice(this, o, e._handle), 
        this.startTS = null, this.startUID = null, this.endTS = null, this.endUID = null, 
        s instanceof RegExp || (s = new RegExp(s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), "i"));
        var r = [];
        i.author && r.push(new d(s)), i.recipients && r.push(new l(s, 1, !0, !0, !0)), i.subject && r.push(new h(s, 1, S, w)), 
        i.body && r.push(new p(s, "yes-quotes" === i.body, 1, S, w)), this.filterer = new f(r), 
        this._bound_gotOlderMessages = this._gotMessages.bind(this, 1), this._bound_gotNewerMessages = this._gotMessages.bind(this, -1), 
        this.desiredHeaders = n.INITIAL_FILL_SIZE, this.reset();
    }
    var g = s.BEFORE, _ = (s.ON_OR_BEFORE, s.SINCE, s.STRICTLY_AFTER), y = t.bsearchMaybeExists, v = t.bsearchForInsert;
    r.AuthorFilter = d, d.prototype = {
        needsBody: !1,
        testMessage: function(e, t, n) {
            var s, i = e.author, o = this.phrase;
            return (s = c(o, i.name, 0)) ? (n.author = {
                text: i.name,
                offset: 0,
                matchRuns: [ {
                    start: s.index,
                    length: s[0].length
                } ],
                path: null
            }, !0) : (s = c(o, i.address, 0)) ? (n.author = {
                text: i.address,
                offset: 0,
                matchRuns: [ {
                    start: s.index,
                    length: s[0].length
                } ],
                path: null
            }, !0) : (n.author = null, !1);
        }
    }, r.RecipientFilter = l, l.prototype = {
        needsBody: !0,
        testMessage: function(e, t, n) {
            function s(e) {
                for (var t, n = 0; n < e.length; n++) {
                    var s = e[n];
                    if (t = c(i, s.name, 0)) {
                        if (r.push({
                            text: s.name,
                            offset: 0,
                            matchRuns: [ {
                                start: t.index,
                                length: t[0].length
                            } ],
                            path: null
                        }), r.length < o) continue;
                        return;
                    }
                    if ((t = c(i, s.address, 0)) && (r.push({
                        text: s.address,
                        offset: 0,
                        matchRuns: [ {
                            start: t.index,
                            length: t[0].length
                        } ],
                        path: null
                    }), r.length >= o)) return;
                }
            }
            var i = this.phrase, o = this.stopAfter, r = [];
            return this.checkTo && e.to && s(e.to), this.checkCc && e.cc && r.length < o && s(e.cc), 
            this.checkBcc && e.bcc && r.length < o && s(e.bcc), r.length ? (n.recipients = r, 
            !0) : (n.recipients = null, !1);
        }
    }, r.SubjectFilter = h, h.prototype = {
        needsBody: !1,
        testMessage: function(e, t, n) {
            var s = e.subject;
            if (!s) return !1;
            for (var i = this.phrase, o = s.length, r = this.stopAfter, a = this.contextBefore, d = this.contextAfter, l = [], h = 0; o > h && l.length < r; ) {
                var p = c(i, s, h);
                if (!p) break;
                l.push(u(s, h + p.index, p[0].length, a, d, null)), h += p.index + p[0].length;
            }
            return l.length ? (n.subject = l, !0) : (n.subject = null, !1);
        }
    };
    var b = 1;
    r.BodyFilter = p, p.prototype = {
        needsBody: !0,
        testMessage: function(e, t, n) {
            for (var s, o, r = this.phrase, a = this.stopAfter, d = this.contextBefore, l = this.contextAfter, h = [], p = this.matchQuotes, f = 0; f < t.bodyReps.length; f++) {
                var m = t.bodyReps[f].type, g = t.bodyReps[f].content;
                if ("plain" === m) for (var _ = 0; _ < g.length && h.length < a; _ += 2) {
                    var y = 15 & g[_], v = g[_ + 1], S = null;
                    if (p || y === b) for (s = 0; s < v.length && h.length < a && (o = c(r, v, s), o); ) null === S && (S = [ f, _ ]), 
                    h.push(u(v, s + o.index, o[0].length, d, l, S)), s += o.index + o[0].length;
                } else if ("html" === m) {
                    var w = i.generateSearchableTextVersion(g, this.matchQuotes);
                    for (s = 0; s < g.length && h.length < a && (o = c(r, w, s), o); ) h.push(u(w, s + o.index, o[0].length, d, l, null)), 
                    s += o.index + o[0].length;
                }
            }
            return h.length ? (n.body = h, !0) : (n.body = null, !1);
        }
    }, r.MessageFilterer = f, f.prototype = {
        testMessage: function(e, t) {
            this.messagesChecked++;
            var n = !1, s = {}, i = this.filters;
            try {
                for (var o = 0; o < i.length; o++) {
                    var r = i[o];
                    r.testMessage(e, t, s) && (n = !0);
                }
            } catch (a) {
                console.error("filter exception", a, "\n", a.stack);
            }
            return n ? s : !1;
        }
    };
    var S = 16, w = 40;
    r.SearchSlice = m, m.prototype = {
        type: "search",
        set atTop(e) {
            this._bridgeHandle.atTop = e;
        },
        get atBottom() {
            return this._bridgeHandle.atBottom;
        },
        set atBottom(e) {
            this._bridgeHandle.atBottom = e;
        },
        set headerCount(e) {
            return this._bridgeHandle && (this._bridgeHandle.headerCount = e), e;
        },
        IMAGINARY_MESSAGE_COUNT_WHEN_NOT_AT_BOTTOM: 1,
        reset: function() {
            this.headers = [], this.headerCount = 0, this._loading = !0, this.startTS = null, 
            this.startUID = null, this.endTS = null, this.endUID = null, this._storage.getMessagesInImapDateRange(0, null, this.desiredHeaders, this.desiredHeaders, this._gotMessages.bind(this, 1));
        },
        _gotMessages: function(e, t, n) {
            if (this._bridgeHandle) {
                var s = n ? "sf: " : "sf:";
                if (console.log(s, "gotMessages", t.length, "more coming?", n), t.length) if (-1 === e) this.endTS = t[0].date, 
                this.endUID = t[0].id; else {
                    var i = t[t.length - 1];
                    this.startTS = i.date, this.startUID = i.id, null === this.endTS && (this.endTS = t[0].date, 
                    this.endUID = t[0].id);
                }
                var o = function(t, i) {
                    if (this._bridgeHandle) {
                        var o = [];
                        for (c = 0; c < t.length; c++) {
                            var r = t[c], a = i ? i[c] : null;
                            this._headersChecked++;
                            var d = this.filterer.testMessage(r, a);
                            d && o.push({
                                header: r,
                                matches: d
                            });
                        }
                        var l = this.atTop = this._storage.headerIsYoungestKnown(this.endTS, this.endUID), u = this.atBottom = this._storage.headerIsOldestKnown(this.startTS, this.startUID), h = -1 === e ? !l : !u, p = this.headers.length + o.length, f = !n && p < this.desiredHeaders && h;
                        if (o.length) {
                            console.log(s, "willHave", p, "of", this.desiredHeaders, "want more?", f);
                            var m = -1 === e ? 0 : this.headers.length;
                            this._LOG.headersAppended(m, o), this.headers.splice.apply(this.headers, [ m, 0 ].concat(o)), 
                            this.headerCount = this.headers.length + (u ? 0 : this.IMAGINARY_MESSAGE_COUNT_WHEN_NOT_AT_BOTTOM), 
                            this._bridgeHandle.sendSplice(m, 0, o, !0, n || f), f ? (console.log(s, "requesting more because want more"), 
                            this.reqGrow(e, !1, !0)) : n || (console.log(s, "stopping (already reported), no want more.", "can get more?", h), 
                            this._loading = !1, this.desiredHeaders = this.headers.length);
                        } else n || (this.headerCount = this.headers.length + (u ? 0 : this.IMAGINARY_MESSAGE_COUNT_WHEN_NOT_AT_BOTTOM), 
                        f ? (console.log(s, "requesting more because no matches but want more"), this.reqGrow(e, !1, !0)) : (console.log(s, "stopping, no matches, no want more.", "can get more?", h), 
                        this._bridgeHandle.sendStatus("synced", !0, !1), this._loading = !1, this.desiredHeaders = this.headers.length));
                    }
                }.bind(this);
                if (this.filterer.bodiesNeeded) {
                    for (var r = [], a = function(e) {
                        e || console.log(s, "failed to get a body for: ", t[r.length].suid, t[r.length].subject), 
                        r.push(e), r.length === t.length && o(t, r);
                    }, c = 0; c < t.length; c++) {
                        var d = t[c];
                        this._storage.getMessageBody(d.suid, d.date, a);
                    }
                    t.length || this._storage.runAfterDeferredCalls(o.bind(null, t, null));
                } else o(t, null);
            }
        },
        refresh: function() {},
        onHeaderAdded: function(e, t) {
            if (this._bridgeHandle && !this._loading) {
                null === this.startTS || g(e.date, this.startTS) ? (this.startTS = e.date, this.startUID = e.id) : e.date === this.startTS && e.id < this.startUID && (this.startUID = e.id), 
                null === this.endTS || _(e.date, this.endTS) ? (this.endTS = e.date, this.endUID = e.id) : e.date === this.endTS && e.id > this.endUID && (this.endUID = e.id);
                var n = this.filterer.testMessage(e, t);
                if (!n) return this.desiredHeaders = this.headers.length, void 0;
                var s = {
                    header: e,
                    matches: n
                }, i = v(this.headers, s, a);
                this.desiredHeaders = this.headers.length, this._LOG.headerAdded(i, s), this.headers.splice(i, 0, s), 
                this.headerCount = this.headers.length + (this.atBottom ? 0 : this.IMAGINARY_MESSAGE_COUNT_WHEN_NOT_AT_BOTTOM), 
                this._bridgeHandle.sendSplice(i, 0, [ s ], !1, !1);
            }
        },
        onHeaderModified: function(e, t) {
            if (this._bridgeHandle && !this._loading) {
                var n = {
                    header: e,
                    matches: null
                }, s = y(this.headers, n, a);
                if (null !== s) {
                    var i = this.headers[s];
                    return i.header = e, this._LOG.headerModified(s, i), this._bridgeHandle.sendUpdate([ s, i ]), 
                    void 0;
                }
                this.filterer.bodiesNeeded && t && this.onHeaderAdded(e, t);
            }
        },
        onHeaderRemoved: function(e) {
            if (this._bridgeHandle) {
                if (e.date === this.endTS && e.id === this.endUID && (this.headers.length ? (this.endTS = this.headers[0].header.date, 
                this.endUID = this.headers[0].header.id) : (this.endTS = null, this.endUID = null)), 
                e.date === this.startTS && e.id === this.startUID) if (this.headers.length) {
                    var t = this.headers[this.headers.length - 1];
                    this.startTS = t.header.date, this.startUID = t.header.id;
                } else this.startTS = null, this.startUID = null;
                var n = {
                    header: e,
                    matches: null
                }, s = y(this.headers, n, a);
                null !== s && (this._LOG.headerRemoved(s, n), this.headers.splice(s, 1), this.headerCount = this.headers.length + (this.atBottom ? 0 : this.IMAGINARY_MESSAGE_COUNT_WHEN_NOT_AT_BOTTOM), 
                this._bridgeHandle.sendSplice(s, 1, [], !1, !1));
            }
        },
        reqNoteRanges: function(e, t, n, s) {
            var i;
            if (e >= this.headers.length || this.headers[e].suid !== t) for (e = 0, i = 0; i < this.headers.length; i++) if (this.headers[i].suid === t) {
                e = i;
                break;
            }
            if (n >= this.headers.length || this.headers[n].suid !== s) for (i = this.headers.length - 1; i >= 0; i--) if (this.headers[i].suid === s) {
                n = i;
                break;
            }
            if (n + 1 < this.headers.length) {
                this.atBottom = !1, this.userCanGrowDownwards = !1;
                var o = this.headers.length - n - 1;
                this.desiredHeaders -= o, this.headers.splice(n + 1, this.headers.length - n - 1), 
                this.headerCount = this.headers.length + this.IMAGINARY_MESSAGE_COUNT_WHEN_NOT_AT_BOTTOM, 
                this._bridgeHandle.sendSplice(n + 1, o, [], !0, e > 0);
                var r = this.headers[n].header;
                this.startTS = r.date, this.startUID = r.id;
            }
            if (e > 0) {
                this.atTop = !1, this.desiredHeaders -= e, this.headers.splice(0, e), this.headerCount = this.headers.length + (this.atBottom ? 0 : this.IMAGINARY_MESSAGE_COUNT_WHEN_NOT_AT_BOTTOM), 
                this._bridgeHandle.sendSplice(0, e, [], !0, !1);
                var a = this.headers[0].header;
                this.endTS = a.date, this.endUID = a.id;
            }
        },
        reqGrow: function(e, t, s) {
            if (s || !this._loading) {
                this._loading = !0;
                var i;
                0 > e ? (i = -1 === e ? n.INITIAL_FILL_SIZE : -e, s || (this.desiredHeaders += i), 
                this._storage.getMessagesAfterMessage(this.endTS, this.endUID, i, this._gotMessages.bind(this, -1))) : (i = 1 >= e ? n.INITIAL_FILL_SIZE : e, 
                s || (this.desiredHeaders += i), this._storage.getMessagesBeforeMessage(this.startTS, this.startUID, i, this._gotMessages.bind(this, 1)));
            }
        },
        die: function() {
            this._storage.dyingSlice(this), this._bridgeHandle = null, this._LOG.__die();
        }
    };
    var E = r.LOGFAB = e.register(o, {
        SearchSlice: {
            type: e.QUERY,
            events: {
                headersAppended: {
                    index: !1
                },
                headerAdded: {
                    index: !1
                },
                headerModified: {
                    index: !1
                },
                headerRemoved: {
                    index: !1
                }
            },
            TEST_ONLY_events: {
                headersAppended: {
                    headers: !1
                },
                headerAdded: {
                    header: !1
                },
                headerModified: {
                    header: !1
                },
                headerRemoved: {
                    header: !1
                }
            }
        }
    });
}), define("mailapi/worker-router", [], function() {
    function e(e) {
        var t = e.data, n = r[t.type];
        n && n(t);
    }
    function t(e) {
        delete r[e];
    }
    function n(e, t) {
        return r[e] = t, function(t, n) {
            window.postMessage({
                type: e,
                uid: null,
                cmd: t,
                args: n
            });
        };
    }
    function s(e) {
        if (a.hasOwnProperty(e)) return a[e];
        r[e] = function(e) {
            var n = t[e.uid];
            n && (delete t[e.uid], n.apply(n, e.args));
        };
        var t = {}, n = 0, s = function(s, i, o) {
            o && (t[n] = o), window.postMessage({
                type: e,
                uid: n++,
                cmd: s,
                args: i
            });
        };
        return a[e] = s, s;
    }
    function i(e) {
        var t = 0, n = {};
        return r[e] = function(e) {
            var t = n[e.uid];
            t && t(e);
        }, {
            register: function(s) {
                var i = t++;
                return n[i] = s, {
                    sendMessage: function(t, n, s) {
                        window.postMessage({
                            type: e,
                            uid: i,
                            cmd: t,
                            args: n
                        }, s);
                    },
                    unregister: function() {
                        delete n[i];
                    }
                };
            }
        };
    }
    function o() {
        window.removeEventListener("message", e), r = {}, a = {};
    }
    var r = {};
    window.addEventListener("message", e);
    var a = {};
    return {
        registerSimple: n,
        registerCallbackType: s,
        registerInstanceType: i,
        unregister: t,
        shutdown: o
    };
}), define("mailapi/jobmixins", [ "./worker-router", "./util", "exports" ], function(e, t, n) {
    var s = e.registerCallbackType("devicestorage");
    n.local_do_modtags = function(e, t, n) {
        var s = n ? e.removeTags : e.addTags, i = n ? e.addTags : e.removeTags;
        this._partitionAndAccessFoldersSequentially(e.messages, !1, function(e, t, n, o, r) {
            function a() {
                0 === --c && r();
            }
            for (var c = n.length, d = 0; d < n.length; d++) {
                var l, u, h, p = n[d], f = !1;
                if (s) for (l = 0; l < s.length; l++) u = s[l], h = p.flags.indexOf(u), -1 === h && (p.flags.push(u), 
                p.flags.sort(), f = !0);
                if (i) for (l = 0; l < i.length; l++) u = i[l], h = p.flags.indexOf(u), -1 !== h && (p.flags.splice(h, 1), 
                f = !0);
                t.updateMessageHeader(p.date, p.id, !1, p, null, a);
            }
        }, function() {
            t(null, null, !0);
        }, null, n, "modtags");
    }, n.local_undo_modtags = function(e, t) {
        return this.local_do_modtags(e, t, !0);
    }, n.local_do_move = function(e, t, n) {
        e.guids = {};
        var s = !this.resilientServerIds, i = this._stateDelta, o = this;
        i.moveMap || (i.moveMap = {}), i.serverIdMap || (i.serverIdMap = {}), n || (n = e.targetFolder), 
        this._partitionAndAccessFoldersSequentially(e.messages, !1, function(t, r, a, c, d) {
            function l(e, t) {
                g = t, u();
            }
            function u() {
                return m >= a.length ? (d(), void 0) : (_ = a[m++], r.getMessageBody(_.suid, _.date, h), 
                void 0);
            }
            function h(t) {
                y = t, _.srvid && (i.serverIdMap[_.suid] = _.srvid), r === g || "localdrafts" === r.folderMeta.type ? "move" === e.type ? u() : r.deleteMessageHeaderAndBodyUsingHeader(_, u) : r.deleteMessageHeaderAndBodyUsingHeader(_, p);
            }
            function p() {
                var e = _.suid;
                _.id = g._issueNewHeaderId(), _.suid = g.folderId + "/" + _.id, s && (_.srvid = null), 
                i.moveMap[e] = _.suid, v = 2, g.addMessageHeader(_, y, f), g.addMessageBody(_, y, f);
            }
            function f() {
                0 === --v && u();
            }
            var m = 0, g = null, _ = null, y = null, v = 0;
            r.folderId === n ? (g = r, u()) : o._accessFolderForMutation(n, !1, l, null, "local move target");
        }, function() {
            t(null, null, !0);
        }, null, !1, "local move source");
    }, n.local_undo_move = function(e, t) {
        t(null);
    }, n.local_do_delete = function(e, t) {
        var n = this.account.getFirstFolderWithType("trash");
        return n ? (this.local_do_move(e, t, n.id), void 0) : (this.account.ensureEssentialFolders(), 
        t("defer"), void 0);
    }, n.local_undo_delete = function(e, t) {
        var n = this.account.getFirstFolderWithType("trash");
        return n ? (this.local_undo_move(e, t, n.id), void 0) : (t("unknown"), void 0);
    }, n.do_download = function(e, t) {
        function n() {
            o.updateMessageBody(r, a, {
                flushBecause: "blobs"
            }, {
                changeDetails: {
                    attachments: e.attachmentIndices
                }
            }, function() {
                t(y, null, !0);
            });
        }
        var s, o, r, a, c, d = this, l = e.messageSuid.lastIndexOf("/"), u = e.messageSuid.substring(0, l), h = function(t, n) {
            s = t, o = n, o.getMessageHeader(e.messageSuid, e.messageDate, g);
        }, p = function() {
            t("aborted-retry");
        }, f = [], m = [], g = function(t) {
            r = t, c = r.srvid, o.getMessageBody(e.messageSuid, e.messageDate, _);
        }, _ = function(t) {
            a = t;
            var n, i;
            for (n = 0; n < e.relPartIndices.length; n++) i = a.relatedParts[e.relPartIndices[n]], 
            i.file || (f.push(i), m.push("idb"));
            for (n = 0; n < e.attachmentIndices.length; n++) i = a.attachments[e.attachmentIndices[n]], 
            i.file || (f.push(i), m.push("sdcard"));
            s.downloadMessageAttachments(c, f, v);
        }, y = null, v = function(e, s) {
            function o() {
                --r || n();
            }
            if (s.length !== f.length) return t(e, null, !1), void 0;
            y = e;
            for (var r = 1, a = 0; a < f.length; a++) {
                var c = f[a], l = s[a], u = m[a];
                l && (c.sizeEstimate = l.size, c.type = l.type, "idb" === u ? c.file = l : (r++, 
                i(d._LOG, l, u, c.name, c, o)));
            }
            o();
        };
        d._accessFolderForMutation(u, !0, h, p, "download");
    };
    var i = n.saveToDeviceStorage = function(e, t, n, o, r, a, c) {
        var d = function(s, d, l) {
            if (s) e.savedAttachment(n, t.type, t.size), console.log("saved attachment to", n, l, "type:", t.type), 
            r.file = [ n, l ], a(); else {
                if (e.saveFailure(n, t.type, d, o), console.warn("failed to save attachment to", n, o, "type:", t.type), 
                c) return a(d), void 0;
                var u = o.lastIndexOf(".");
                -1 === u && (u = o.length), o = o.substring(0, u) + "-" + Date.now() + o.substring(u), 
                i(e, t, n, o, r, a, !0);
            }
        };
        s("save", [ n, t, o ], d);
    };
    n.local_do_download = function(e, t) {
        t(null);
    }, n.check_download = function(e, t) {
        t(null, "coherent-notyet");
    }, n.local_undo_download = function(e, t) {
        t(null);
    }, n.undo_download = function(e, t) {
        t(null);
    }, n.local_do_downloadBodies = function(e, t) {
        t(null);
    }, n.do_downloadBodies = function(e, t) {
        var n, s = 0;
        this._partitionAndAccessFoldersSequentially(e.messages, !0, function(t, i, o, r, a) {
            t.downloadBodies(o, e.options, function(e, t) {
                s += t, e && !n && (n = e), a();
            });
        }, function() {
            t(n, null, s > 0);
        }, function() {
            n = "aborted-retry";
        }, !1, "downloadBodies", !0);
    }, n.check_downloadBodies = function(e, t) {
        t(null, "coherent-notyet");
    }, n.check_downloadBodyReps = function(e, t) {
        t(null, "coherent-notyet");
    }, n.do_downloadBodyReps = function(e, t) {
        var n, s, i = this, o = e.messageSuid.lastIndexOf("/"), r = e.messageSuid.substring(0, o), a = function(t, i) {
            n = t, s = i, s.getMessageHeader(e.messageSuid, e.messageDate, d);
        }, c = function() {
            t("aborted-retry");
        }, d = function(e) {
            return e ? (s.getMessageBody(e.suid, e.date, function(t) {
                t.bodyReps.every(function(e) {
                    return e.isDownloaded;
                }) ? l(null, t, !0) : n.downloadBodyReps(e, l);
            }), void 0) : (t(), void 0);
        }, l = function(e, n, s) {
            if (e) return console.error("Error downloading reps", e), t("unknown"), void 0;
            var i = !s;
            t(null, n, i);
        };
        i._accessFolderForMutation(r, !0, a, c, "downloadBodyReps");
    }, n.local_do_downloadBodyReps = function(e, t) {
        t(null);
    }, n.postJobCleanup = function(e) {
        if (e) {
            var t, n;
            if (this._stateDelta.serverIdMap) {
                t = this._stateDelta.serverIdMap, n = this._state.suidToServerId;
                for (var s in t) {
                    var i = t[s];
                    null === i ? delete n[s] : n[s] = i;
                }
            }
            if (this._stateDelta.moveMap) {
                t = this._stateDelta.moveMap, n = this._state.moveMap;
                for (var o in t) {
                    var r = t[o];
                    n[o] = r;
                }
            }
        }
        for (var a = 0; a < this._heldMutexReleasers.length; a++) this._heldMutexReleasers[a]();
        this._heldMutexReleasers = [], this._stateDelta.serverIdMap = null, this._stateDelta.moveMap = null;
    }, n.allJobsDone = function() {
        this._state.suidToServerId = {}, this._state.moveMap = {};
    }, n._partitionAndAccessFoldersSequentially = function(e, n, s, i, o, r, a, c) {
        var d, l, u = t.partitionMessagesByFolderId(e), h = this, p = null, f = null, m = null, g = 0, _ = null, y = !1;
        r && u.reverse();
        var v = function() {
            if (!y) {
                if (g >= u.length) return y = !0, i(null), void 0;
                if (g) {
                    d = null;
                    var e = h._heldMutexReleasers.pop();
                    e && e(), d = null;
                }
                _ = u[g++], f = _.messages, m = null, _.folderId !== p && (p = _.folderId, h._accessFolderForMutation(p, n, S, b, a));
            }
        }, b = function() {
            if (!y) {
                if (o) try {
                    o();
                } catch (e) {
                    h._LOG.callbackErr(e);
                }
                y = !0, i("connection-lost");
            }
        }, S = function(e, t) {
            if (!y) if (d = e, l = t, n && !c) {
                var i = [], o = h._state.suidToServerId;
                m = [];
                for (var r = 0; r < f.length; r++) {
                    var a = f[r], u = o[a.suid];
                    u ? m.push(u) : (m.push(null), i.push(a));
                }
                if (i.length) l.getMessageHeaders(i, w); else try {
                    s(d, l, m, f, v);
                } catch (p) {
                    console.error("PAAFS error:", p, "\n", p.stack);
                }
            } else l.getMessageHeaders(f, E);
        }, w = function(e) {
            if (!y) {
                for (var t = m.indexOf(null), n = 0; n < e.length; n++) {
                    var i = e[n];
                    if (i) {
                        var o = i.srvid;
                        m[t] = o, o || console.warn("Header", e[n].suid, "missing server id in job!");
                    }
                    t = m.indexOf(null, t + 1);
                }
                if (!m.length) return v(), void 0;
                try {
                    s(d, l, m, f, v);
                } catch (r) {
                    console.error("PAAFS error:", r, "\n", r.stack);
                }
            }
        }, E = function(e) {
            if (!y) {
                if (!e.length) return v(), void 0;
                e.sort(function(e, t) {
                    return e.date > t.date;
                });
                try {
                    s(d, l, e, f, v);
                } catch (t) {
                    console.error("PAAFS error:", t, "\n", t.stack);
                }
            }
        };
        v();
    };
}), define("mailapi/drafts/draft_rep", [ "require", "mailapi/db/mail_rep" ], function(e) {
    function t(e, t, n, s, o) {
        var r = o.getIdentityForSenderIdentityId(n.senderId), a = i.makeHeaderInfo({
            id: s.id,
            srvid: null,
            suid: s.suid,
            guid: e ? e.guid : null,
            author: {
                name: r.name,
                address: r.address
            },
            to: n.to,
            cc: n.cc,
            bcc: n.bcc,
            replyTo: r.replyTo,
            date: s.date,
            flags: [],
            hasAttachments: e ? e.hasAttachments : !1,
            subject: n.subject,
            snippet: n.body.text.substring(0, 100)
        }), c = i.makeBodyInfo({
            date: s.date,
            size: 0,
            attachments: t ? t.attachments.concat() : [],
            relatedParts: t ? t.relatedParts.concat() : [],
            references: n.referencesStr,
            bodyReps: []
        });
        return c.bodyReps.push(i.makeBodyPart({
            type: "plain",
            part: null,
            sizeEstimate: n.body.text.length,
            amountDownloaded: n.body.text.length,
            isDownloaded: !0,
            _partInfo: {},
            content: [ 1, n.body.text ]
        })), n.body.html && c.bodyReps.push(i.makeBodyPart({
            type: "html",
            part: null,
            sizeEstimate: n.body.html.length,
            amountDownloaded: n.body.html.length,
            isDownloaded: !0,
            _partInfo: {},
            content: n.body.html
        })), {
            header: a,
            body: c
        };
    }
    function n(e, t, n) {
        var s = {
            text: "",
            html: null
        };
        n.bodyReps.length >= 1 && "plain" === n.bodyReps[0].type && 2 === n.bodyReps[0].content.length && 1 === n.bodyReps[0].content[0] && (s.text = n.bodyReps[0].content[1]), 
        2 == n.bodyReps.length && "html" === n.bodyReps[1].type && (s.html = n.bodyReps[1].content);
        var i = [];
        n.attachments.forEach(function(e) {
            i.push({
                name: e.name,
                blob: e.file
            });
        }), {
            identity: e.identities[0],
            subject: t.subject,
            body: s,
            to: t.to,
            cc: t.cc,
            bcc: t.bcc,
            referencesStr: n.references,
            attachments: i
        };
    }
    function s(e, t, n) {
        var s = i.makeHeaderInfo(e);
        s.id = n.id, s.suid = n.suid;
        var o = i.makeBodyInfo(t);
        return o.attachments && (o.attachments = o.attachments.map(function(e) {
            var t = i.makeAttachmentPart(e);
            return t.type = "application/x-gelam-no-download", t.file = null, t;
        })), o.relatedParts && (o.relatedParts = []), o.bodyReps = o.bodyReps.map(function(e) {
            return i.makeBodyPart(e);
        }), {
            header: s,
            body: o
        };
    }
    var i = e("mailapi/db/mail_rep");
    return {
        mergeDraftStates: t,
        convertHeaderAndBodyToDraftRep: n,
        cloneDraftMessageForSentFolderWithoutAttachments: s
    };
}), define("mailapi/b64", [ "require" ], function() {
    function e(e) {
        function t(e) {
            r[c++] = 25 >= e ? 65 + e : 51 >= e ? 71 + e : 61 >= e ? -4 + e : 62 === e ? 43 : 47;
        }
        var n = Math.floor(e.length / 57), s = e.length - 57 * n, i = 78 * n;
        s && (i += 4 * Math.ceil(s / 3) + 2);
        var o, r = new Uint8Array(i), a = 0, c = 0;
        for (o = e.length; o >= 3; o -= 3) {
            var d = e[a++], l = e[a++], u = e[a++];
            t(d >> 2), t((3 & d) << 4 | l >> 4), t((15 & l) << 2 | u >> 6), t(63 & u), (0 === a % 57 || 3 === o) && (r[c++] = 13, 
            r[c++] = 10);
        }
        switch (o) {
          case 2:
            d = e[a++], l = e[a++], t(d >> 2), t((3 & d) << 4 | l >> 4), t(0 | (15 & l) << 2), 
            r[c++] = 61, r[c++] = 13, r[c++] = 10;
            break;

          case 1:
            d = e[a++], t(d >> 2), t(0 | (3 & d) << 4), r[c++] = 61, r[c++] = 61, r[c++] = 13, 
            r[c++] = 10;
        }
        return r;
    }
    return {
        mimeStyleBase64Encode: e
    };
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
        } catch (i) {
            console.error("XHR send() failure on blob"), t("error");
        }
        URL.revokeObjectURL(n);
    }
    return {
        asyncFetchBlobAsUint8Array: e
    };
}), define("mailapi/drafts/jobs", [ "require", "exports", "module", "mailapi/db/mail_rep", "mailapi/drafts/draft_rep", "mailapi/b64", "mailapi/async_blob_fetcher" ], function(e, t) {
    var n = e("mailapi/db/mail_rep"), s = e("mailapi/drafts/draft_rep"), i = e("mailapi/b64"), o = e("mailapi/async_blob_fetcher").asyncFetchBlobAsUint8Array, r = t.draftsMixins = {};
    r.BLOB_BASE64_BATCH_CONVERT_SIZE = 524286, r.local_do_attachBlobToDraft = function(e, t) {
        var s = this.account.getFirstFolderWithType("localdrafts");
        if (!s) return t("moot"), void 0;
        var r = this;
        this._accessFolderForMutation(s.id, !1, function(s, a) {
            function c(s) {
                return h = s.header, p = s.body, h && p ? (p.attaching = n.makeAttachmentPart({
                    name: e.attachmentDef.name,
                    type: f.type,
                    sizeEstimate: f.size,
                    file: []
                }), d(p), void 0) : (t("failure-give-up"), void 0);
            }
            function d(e) {
                p = e;
                var t = Math.min(f.size, m + r.BLOB_BASE64_BATCH_CONVERT_SIZE);
                console.log("attachBlobToDraft: fetching", m, "to", t, "of", f.size);
                var n = f.slice(m, t);
                m = t, o(n, l);
            }
            function l(e, n) {
                if (console.log("attachBlobToDraft: fetched"), e) return t("failure-give-up"), void 0;
                var s = m >= f.size, o = i.mimeStyleBase64Encode(n);
                p.attaching.file.push(new Blob([ o ], {
                    type: f.type
                }));
                var r;
                if (s) {
                    var c = p.attachments.length;
                    p.attachments.push(p.attaching), delete p.attaching, r = {
                        changeDetails: {
                            attachments: [ c ]
                        }
                    };
                } else r = null;
                console.log("attachBlobToDraft: flushing"), a.updateMessageBody(h, p, {
                    flushBecause: "blobs"
                }, r, s ? u : d), p = null;
            }
            function u() {
                console.log("attachBlobToDraft: blob fully attached"), t(null);
            }
            var h, p, f = e.attachmentDef.blob;
            console.log("attachBlobToDraft: retrieving message"), a.getMessage(e.existingNamer.suid, e.existingNamer.date, {}, c);
            var m = 0;
        }, null, "attachBlobToDraft");
    }, r.do_attachBlobToDraft = function(e, t) {
        t(null);
    }, r.check_attachBlobToDraft = function(e, t) {
        t(null, "moot");
    }, r.local_undo_attachBlobToDraft = function(e, t) {
        t(null);
    }, r.undo_attachBlobToDraft = function(e, t) {
        t(null);
    }, r.local_do_detachAttachmentFromDraft = function(e, t) {
        var n = this.account.getFirstFolderWithType("localdrafts");
        return n ? (this._accessFolderForMutation(n.id, !1, function(n, s) {
            function i(n) {
                return r = n.header, a = n.body, r && a ? (a.attachments.splice(e.attachmentIndex, 1), 
                console.log("detachAttachmentFromDraft: flushing"), s.updateMessageBody(r, a, {
                    flushBecause: "blobs"
                }, {
                    changeDetails: {
                        detachedAttachments: [ e.attachmentIndex ]
                    }
                }, o), void 0) : (t("failure-give-up"), void 0);
            }
            function o() {
                console.log("detachAttachmentFromDraft: blob fully detached"), t(null);
            }
            var r, a;
            console.log("detachAttachmentFromDraft: retrieving message"), s.getMessage(e.existingNamer.suid, e.existingNamer.date, {}, i);
        }, null, "detachAttachmentFromDraft"), void 0) : (t("moot"), void 0);
    }, r.do_detachAttachmentFromDraft = function(e, t) {
        t(null);
    }, r.check_detachAttachmentFromDraft = function(e, t) {
        t(null);
    }, r.local_undo_detachAttachmentFromDraft = function(e, t) {
        t(null);
    }, r.undo_detachAttachmentFromDraft = function(e, t) {
        t(null);
    }, r.local_do_saveDraft = function(e, t) {
        var n = this.account.getFirstFolderWithType("localdrafts");
        if (!n) return t("moot"), void 0;
        var i = this;
        this._accessFolderForMutation(n.id, !1, function(n, o) {
            function r(n) {
                function r() {
                    0 === --a && t(null, c, !0);
                }
                var c = s.mergeDraftStates(n.header, n.body, e.draftRep, e.newDraftInfo, i.account.universe);
                e.existingNamer && (a++, o.deleteMessageHeaderAndBody(e.existingNamer.suid, e.existingNamer.date, r)), 
                o.addMessageHeader(c.header, c.body, r), o.addMessageBody(c.header, c.body, r);
            }
            var a = 2;
            e.existingNamer ? o.getMessage(e.existingNamer.suid, e.existingNamer.date, null, r) : r({
                header: null,
                body: null
            });
        }, null, "saveDraft");
    }, r.do_saveDraft = function(e, t) {
        t(null);
    }, r.check_saveDraft = function(e, t) {
        t(null, "moot");
    }, r.local_undo_saveDraft = function(e, t) {
        t(null);
    }, r.undo_saveDraft = function(e, t) {
        t(null);
    }, r.local_do_deleteDraft = function(e, t) {
        var n = this.account.getFirstFolderWithType("localdrafts");
        return n ? (this._accessFolderForMutation(n.id, !1, function(n, s) {
            s.deleteMessageHeaderAndBody(e.messageNamer.suid, e.messageNamer.date, function() {
                t(null, null, !0);
            });
        }, null, "deleteDraft"), void 0) : (t("moot"), void 0);
    }, r.do_deleteDraft = function(e, t) {
        t(null);
    }, r.check_deleteDraft = function(e, t) {
        t(null, "moot");
    }, r.local_undo_deleteDraft = function(e, t) {
        t(null);
    }, r.undo_deleteDraft = function(e, t) {
        t(null);
    };
}), define("mailapi/accountmixins", [ "exports" ], function(e) {
    function t(e, t) {
        window.setZeroTimeout(function() {
            t(null, null);
        });
    }
    e.runOp = function(e, n, s) {
        console.log("runOp(" + n + ": " + JSON.stringify(e).substring(0, 160) + ")");
        var i = n + "_" + e.type, o = this, r = this._jobDriver[i];
        r || (console.warn("Unsupported op:", e.type, "mode:", n), r = t), this._LOG.runOp_begin(n, e.type, null, e);
        try {
            r.call(this._jobDriver, e, function(t, i, r) {
                o._jobDriver.postJobCleanup(!t), console.log("runOp_end(" + n + ": " + JSON.stringify(e).substring(0, 160) + ")\n"), 
                o._LOG.runOp_end(n, e.type, t, e), window.setZeroTimeout(function() {
                    s(t, i, r);
                });
            });
        } catch (a) {
            this._LOG.opError(n, e.type, a);
        }
    }, e.getFirstFolderWithType = function(e) {
        for (var t = this.folders, n = 0; n < t.length; n++) if (t[n].type === e) return t[n];
        return null;
    }, e.getFolderByPath = function(e) {
        for (var t = this.folders, n = 0; n < t.length; n++) if (t[n].path === e) return t[n];
        return null;
    }, e.saveAccountState = function(e, t, n) {
        if (!this._alive) return this._LOG.accountDeleted("saveAccountState"), null;
        this._saveAccountStateActive = !0, this._deferredSaveAccountCalls || (this._deferredSaveAccountCalls = []), 
        t && this.runAfterSaves(t);
        for (var s = [], i = 0; i < this.folders.length; i++) {
            var o = this.folders[i], r = this._folderStorages[o.id], a = r.generatePersistenceInfo();
            a && s.push(a);
        }
        this._LOG.saveAccountState(n);
        var c = this._db.saveAccountFolderStates(this.id, this._folderInfos, s, this._deadFolderIds, function() {
            this._saveAccountStateActive = !1;
            var e = this._deferredSaveAccountCalls;
            this._deferredSaveAccountCalls = [], e.forEach(function(e) {
                e();
            });
        }.bind(this), e);
        return this._deadFolderIds = null, c;
    }, e.runAfterSaves = function(e) {
        this._saveAccountStateActive || this._saveAccountIsImminent ? this._deferredSaveAccountCalls.push(e) : e();
    };
}), define("events", [ "require", "exports", "module" ], function(e, t) {
    process.EventEmitter || (process.EventEmitter = function() {});
    var n = t.EventEmitter = process.EventEmitter, s = "function" == typeof Array.isArray ? Array.isArray : function(e) {
        return "[object Array]" === Object.toString.call(e);
    }, i = 10;
    n.prototype.setMaxListeners = function(e) {
        this._events || (this._events = {}), this._events.maxListeners = e;
    }, n.prototype.emit = function(e) {
        if ("error" === e && (!this._events || !this._events.error || s(this._events.error) && !this._events.error.length)) throw arguments[1] instanceof Error ? arguments[1] : new Error("Uncaught, unspecified 'error' event.");
        if (!this._events) return !1;
        var t = this._events[e];
        if (!t) return !1;
        if ("function" == typeof t) {
            switch (arguments.length) {
              case 1:
                t.call(this);
                break;

              case 2:
                t.call(this, arguments[1]);
                break;

              case 3:
                t.call(this, arguments[1], arguments[2]);
                break;

              default:
                var n = Array.prototype.slice.call(arguments, 1);
                t.apply(this, n);
            }
            return !0;
        }
        if (s(t)) {
            for (var n = Array.prototype.slice.call(arguments, 1), i = t.slice(), o = 0, r = i.length; r > o; o++) i[o].apply(this, n);
            return !0;
        }
        return !1;
    }, n.prototype.addListener = function(e, t) {
        if ("function" != typeof t) throw new Error("addListener only takes instances of Function");
        if (this._events || (this._events = {}), this.emit("newListener", e, t), this._events[e]) if (s(this._events[e])) {
            if (!this._events[e].warned) {
                var n;
                n = void 0 !== this._events.maxListeners ? this._events.maxListeners : i, n && n > 0 && this._events[e].length > n && (this._events[e].warned = !0, 
                console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), 
                console.trace());
            }
            this._events[e].push(t);
        } else this._events[e] = [ this._events[e], t ]; else this._events[e] = t;
        return this;
    }, n.prototype.on = n.prototype.addListener, n.prototype.once = function(e, t) {
        var n = this;
        return n.on(e, function s() {
            n.removeListener(e, s), t.apply(this, arguments);
        }), this;
    }, n.prototype.removeListener = function(e, t) {
        if ("function" != typeof t) throw new Error("removeListener only takes instances of Function");
        if (!this._events || !this._events[e]) return this;
        var n = this._events[e];
        if (s(n)) {
            var i = n.indexOf(t);
            if (0 > i) return this;
            n.splice(i, 1), 0 == n.length && delete this._events[e];
        } else this._events[e] === t && delete this._events[e];
        return this;
    }, n.prototype.removeAllListeners = function(e) {
        return e && this._events && this._events[e] && (this._events[e] = null), e || (this._events = {}), 
        this;
    }, n.prototype.listeners = function(e) {
        return this._events || (this._events = {}), this._events[e] || (this._events[e] = []), 
        s(this._events[e]) || (this._events[e] = [ this._events[e] ]), this._events[e];
    };
}), define("util", [ "require", "exports", "module", "events" ], function(e, t) {
    e("events"), t.print = function() {}, t.puts = function() {}, t.debug = function() {}, 
    t.log = function() {}, t.pump = null, t.inherits = function(e, t) {
        e.super_ = t, e.prototype = Object.create(t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        });
    };
}), define("stream", [ "require", "exports", "module", "events", "util" ], function(e, t, n) {
    function s() {
        i.EventEmitter.call(this);
    }
    var i = e("events"), o = e("util");
    o.inherits(s, i.EventEmitter), n.exports = s, s.Stream = s, s.prototype.pipe = function(e, t) {
        function n(t) {
            e.writable && !1 === e.write(t) && c.pause && c.pause();
        }
        function s() {
            c.readable && c.resume && c.resume();
        }
        function i() {
            d || (d = !0, e._pipeCount--, a(), e._pipeCount > 0 || e.end());
        }
        function o() {
            d || (d = !0, e._pipeCount--, a(), e._pipeCount > 0 || e.destroy());
        }
        function r(e) {
            if (a(), 0 === this.listeners("error").length) throw e;
        }
        function a() {
            c.removeListener("data", n), e.removeListener("drain", s), c.removeListener("end", i), 
            c.removeListener("close", o), c.removeListener("error", r), e.removeListener("error", r), 
            c.removeListener("end", a), c.removeListener("close", a), e.removeListener("end", a), 
            e.removeListener("close", a);
        }
        var c = this;
        c.on("data", n), e.on("drain", s), e._isStdio || t && t.end === !1 || (e._pipeCount = e._pipeCount || 0, 
        e._pipeCount++, c.on("end", i), c.on("close", o));
        var d = !1;
        return c.on("error", r), e.on("error", r), c.on("end", a), c.on("close", a), e.on("end", a), 
        e.on("close", a), e.emit("pipe", c), e;
    };
}), define("crypto", [ "require", "exports", "module" ], function(e, t) {
    function n(e) {
        return o(i(a(e)));
    }
    function s(e) {
        return r(i(a(e)));
    }
    function i(e) {
        return d(l(c(e), 8 * e.length));
    }
    function o(e) {
        try {} catch (t) {
            y = 0;
        }
        for (var n, s = y ? "0123456789ABCDEF" : "0123456789abcdef", i = "", o = 0; o < e.length; o++) n = e.charCodeAt(o), 
        i += s.charAt(15 & n >>> 4) + s.charAt(15 & n);
        return i;
    }
    function r(e) {
        try {} catch (t) {
            v = "";
        }
        for (var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = "", i = e.length, o = 0; i > o; o += 3) for (var r = e.charCodeAt(o) << 16 | (i > o + 1 ? e.charCodeAt(o + 1) << 8 : 0) | (i > o + 2 ? e.charCodeAt(o + 2) : 0), a = 0; 4 > a; a++) s += 8 * o + 6 * a > 8 * e.length ? v : n.charAt(63 & r >>> 6 * (3 - a));
        return s;
    }
    function a(e) {
        for (var t, n, s = "", i = -1; ++i < e.length; ) t = e.charCodeAt(i), n = i + 1 < e.length ? e.charCodeAt(i + 1) : 0, 
        t >= 55296 && 56319 >= t && n >= 56320 && 57343 >= n && (t = 65536 + ((1023 & t) << 10) + (1023 & n), 
        i++), 127 >= t ? s += String.fromCharCode(t) : 2047 >= t ? s += String.fromCharCode(192 | 31 & t >>> 6, 128 | 63 & t) : 65535 >= t ? s += String.fromCharCode(224 | 15 & t >>> 12, 128 | 63 & t >>> 6, 128 | 63 & t) : 2097151 >= t && (s += String.fromCharCode(240 | 7 & t >>> 18, 128 | 63 & t >>> 12, 128 | 63 & t >>> 6, 128 | 63 & t));
        return s;
    }
    function c(e) {
        for (var t = Array(e.length >> 2), n = 0; n < t.length; n++) t[n] = 0;
        for (var n = 0; n < 8 * e.length; n += 8) t[n >> 5] |= (255 & e.charCodeAt(n / 8)) << n % 32;
        return t;
    }
    function d(e) {
        for (var t = "", n = 0; n < 32 * e.length; n += 8) t += String.fromCharCode(255 & e[n >> 5] >>> n % 32);
        return t;
    }
    function l(e, t) {
        e[t >> 5] |= 128 << t % 32, e[(t + 64 >>> 9 << 4) + 14] = t;
        for (var n = 1732584193, s = -271733879, i = -1732584194, o = 271733878, r = 0; r < e.length; r += 16) {
            var a = n, c = s, d = i, l = o;
            n = h(n, s, i, o, e[r + 0], 7, -680876936), o = h(o, n, s, i, e[r + 1], 12, -389564586), 
            i = h(i, o, n, s, e[r + 2], 17, 606105819), s = h(s, i, o, n, e[r + 3], 22, -1044525330), 
            n = h(n, s, i, o, e[r + 4], 7, -176418897), o = h(o, n, s, i, e[r + 5], 12, 1200080426), 
            i = h(i, o, n, s, e[r + 6], 17, -1473231341), s = h(s, i, o, n, e[r + 7], 22, -45705983), 
            n = h(n, s, i, o, e[r + 8], 7, 1770035416), o = h(o, n, s, i, e[r + 9], 12, -1958414417), 
            i = h(i, o, n, s, e[r + 10], 17, -42063), s = h(s, i, o, n, e[r + 11], 22, -1990404162), 
            n = h(n, s, i, o, e[r + 12], 7, 1804603682), o = h(o, n, s, i, e[r + 13], 12, -40341101), 
            i = h(i, o, n, s, e[r + 14], 17, -1502002290), s = h(s, i, o, n, e[r + 15], 22, 1236535329), 
            n = p(n, s, i, o, e[r + 1], 5, -165796510), o = p(o, n, s, i, e[r + 6], 9, -1069501632), 
            i = p(i, o, n, s, e[r + 11], 14, 643717713), s = p(s, i, o, n, e[r + 0], 20, -373897302), 
            n = p(n, s, i, o, e[r + 5], 5, -701558691), o = p(o, n, s, i, e[r + 10], 9, 38016083), 
            i = p(i, o, n, s, e[r + 15], 14, -660478335), s = p(s, i, o, n, e[r + 4], 20, -405537848), 
            n = p(n, s, i, o, e[r + 9], 5, 568446438), o = p(o, n, s, i, e[r + 14], 9, -1019803690), 
            i = p(i, o, n, s, e[r + 3], 14, -187363961), s = p(s, i, o, n, e[r + 8], 20, 1163531501), 
            n = p(n, s, i, o, e[r + 13], 5, -1444681467), o = p(o, n, s, i, e[r + 2], 9, -51403784), 
            i = p(i, o, n, s, e[r + 7], 14, 1735328473), s = p(s, i, o, n, e[r + 12], 20, -1926607734), 
            n = f(n, s, i, o, e[r + 5], 4, -378558), o = f(o, n, s, i, e[r + 8], 11, -2022574463), 
            i = f(i, o, n, s, e[r + 11], 16, 1839030562), s = f(s, i, o, n, e[r + 14], 23, -35309556), 
            n = f(n, s, i, o, e[r + 1], 4, -1530992060), o = f(o, n, s, i, e[r + 4], 11, 1272893353), 
            i = f(i, o, n, s, e[r + 7], 16, -155497632), s = f(s, i, o, n, e[r + 10], 23, -1094730640), 
            n = f(n, s, i, o, e[r + 13], 4, 681279174), o = f(o, n, s, i, e[r + 0], 11, -358537222), 
            i = f(i, o, n, s, e[r + 3], 16, -722521979), s = f(s, i, o, n, e[r + 6], 23, 76029189), 
            n = f(n, s, i, o, e[r + 9], 4, -640364487), o = f(o, n, s, i, e[r + 12], 11, -421815835), 
            i = f(i, o, n, s, e[r + 15], 16, 530742520), s = f(s, i, o, n, e[r + 2], 23, -995338651), 
            n = m(n, s, i, o, e[r + 0], 6, -198630844), o = m(o, n, s, i, e[r + 7], 10, 1126891415), 
            i = m(i, o, n, s, e[r + 14], 15, -1416354905), s = m(s, i, o, n, e[r + 5], 21, -57434055), 
            n = m(n, s, i, o, e[r + 12], 6, 1700485571), o = m(o, n, s, i, e[r + 3], 10, -1894986606), 
            i = m(i, o, n, s, e[r + 10], 15, -1051523), s = m(s, i, o, n, e[r + 1], 21, -2054922799), 
            n = m(n, s, i, o, e[r + 8], 6, 1873313359), o = m(o, n, s, i, e[r + 15], 10, -30611744), 
            i = m(i, o, n, s, e[r + 6], 15, -1560198380), s = m(s, i, o, n, e[r + 13], 21, 1309151649), 
            n = m(n, s, i, o, e[r + 4], 6, -145523070), o = m(o, n, s, i, e[r + 11], 10, -1120210379), 
            i = m(i, o, n, s, e[r + 2], 15, 718787259), s = m(s, i, o, n, e[r + 9], 21, -343485551), 
            n = g(n, a), s = g(s, c), i = g(i, d), o = g(o, l);
        }
        return Array(n, s, i, o);
    }
    function u(e, t, n, s, i, o) {
        return g(_(g(g(t, e), g(s, o)), i), n);
    }
    function h(e, t, n, s, i, o, r) {
        return u(t & n | ~t & s, e, t, i, o, r);
    }
    function p(e, t, n, s, i, o, r) {
        return u(t & s | n & ~s, e, t, i, o, r);
    }
    function f(e, t, n, s, i, o, r) {
        return u(t ^ n ^ s, e, t, i, o, r);
    }
    function m(e, t, n, s, i, o, r) {
        return u(n ^ (t | ~s), e, t, i, o, r);
    }
    function g(e, t) {
        var n = (65535 & e) + (65535 & t), s = (e >> 16) + (t >> 16) + (n >> 16);
        return s << 16 | 65535 & n;
    }
    function _(e, t) {
        return e << t | e >>> 32 - t;
    }
    t.createHash = function(e) {
        if ("md5" !== e) throw new Error("MD5 or bust!");
        var t = "";
        return {
            update: function(e) {
                return t += e, this;
            },
            digest: function(e) {
                switch (e) {
                  case "hex":
                    return n(t);

                  case "base64":
                    return s(t);

                  default:
                    throw new Error("The encoding is no good: " + e);
                }
            }
        };
    };
    var y = 0, v = "";
}), define("mix", [], function() {
    return function(e, t, n) {
        return Object.keys(t).forEach(function(s) {
            (!e.hasOwnProperty(s) || n) && (e[s] = t[s]);
        }), e;
    };
}), define("utf7", [ "exports" ], function(e) {
    function t(e) {
        for (var t = new Buffer(2 * e.length, "ascii"), n = 0, s = 0; n < e.length; n++) {
            var i = e.charCodeAt(n);
            t[s++] = i >> 8, t[s++] = 255 & i;
        }
        return t.toString("base64").replace(/=+$/, "");
    }
    function n(e) {
        return new Buffer(e, "base64").toString("utf-16be");
    }
    function s(e) {
        return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    var i = "A-Za-z0-9" + s("'(),-./:?"), o = s("!\"#$%&*;<=>@[]^_'{|}"), r = s(" \r\n	"), a = {}, c = new RegExp("[^" + r + i + o + "]+", "g");
    e.imap = {}, e.encode = function(e, n) {
        return n || (n = ""), a[n] || (a[n] = new RegExp("[^" + i + s(n) + "]+", "g")), 
        e.replace(a[n], function(e) {
            return "+" + ("+" === e ? "" : t(e)) + "-";
        });
    }, e.encodeAll = function(e) {
        return e.replace(c, function(e) {
            return "+" + ("+" === e ? "" : t(e)) + "-";
        });
    }, e.imap.encode = function(e) {
        return e.replace(/&/g, "&-").replace(/[^\x20-\x7e]+/g, function(e) {
            return e = ("&" === e ? "" : t(e)).replace(/\//g, ","), "&" + e + "-";
        });
    }, e.decode = function(e) {
        return e.replace(/\+([A-Za-z0-9\/]*)-?/gi, function(e, t) {
            return "" === t ? "+" : n(t);
        });
    }, e.imap.decode = function(e) {
        return e.replace(/&([^-]*)-/g, function(e, t) {
            return "" === t ? "&" : n(t.replace(/,/g, "/"));
        });
    };
}), define("encoding", [ "utf7", "exports" ], function(e, t) {
    function n(e) {
        return e = (e || "").toString().trim().toLowerCase().replace(/^latin[\-_]?(\d+)$/, "iso-8859-$1").replace(/^(?:(?:win(?:dows)?)|ms)[\-_]?(\d+)$/, "windows-$1").replace(/^utf[\-_]?(\d+)$/, "utf-$1").replace(/^us_?ascii$/, "ascii");
    }
    t.checkEncoding = n;
    var s = {
        fatal: !1
    };
    t.convert = function(t, i, o) {
        if (i = "utf-8", o = n(o || "utf-8"), i === o) return new Buffer(t, "utf-8");
        if ("utf-7" === o || "utf7" === o) return e.decode(t.toString());
        if (/^utf-8$/.test(i)) {
            var r;
            try {
                r = new TextDecoder(o, s);
            } catch (a) {
                console.warn("Unsupported encoding", o, "switching to utf-8"), r = new TextDecoder("utf-8", s);
            }
            return "string" == typeof t && (t = new Buffer(t, "binary")), r.decode(t);
        }
        var c = i.indexOf("/");
        -1 !== c && "/" === i[c + 1] && (i = i.substring(0, c));
        var d = new TextEncoder(i, s);
        return d.encode(t);
    };
}), define("mailapi/mailchew-strings", [ "exports", "events" ], function(e, t) {
    e.events = new t.EventEmitter(), e.set = function(t) {
        e.strings = t, e.events.emit("strings", t);
    };
}), define("mailapi/slice_bridge_proxy", [ "exports" ], function(e) {
    function t(e, t, n) {
        this._bridge = e, this._ns = t, this._handle = n, this.__listener = null, this.status = "synced", 
        this.progress = 0, this.atTop = !1, this.atBottom = !1, this.headerCount = 0, this.userCanGrowUpwards = !1, 
        this.userCanGrowDownwards = !1, this.pendingUpdates = [], this.scheduledUpdate = !1;
    }
    e.SliceBridgeProxy = t, t.prototype = {
        sendSplice: function(e, t, n, s, i, o) {
            var r = {
                index: e,
                howMany: t,
                addItems: n,
                requested: s,
                moreExpected: i,
                newEmailCount: o,
                headerCount: this.headerCount,
                type: "slice"
            };
            this.addUpdate(r);
        },
        sendUpdate: function(e) {
            var t = {
                updates: e,
                type: "update"
            };
            this.addUpdate(t);
        },
        sendStatus: function(e, t, n, s, i) {
            this.status = e, null != s && (this.progress = s), this.sendSplice(0, 0, [], t, n, i);
        },
        sendSyncProgress: function(e) {
            this.progress = e, this.sendSplice(0, 0, [], !0, !0);
        },
        addUpdate: function(e) {
            this.pendingUpdates.push(e), this.pendingUpdates.length > 5 ? this.flushUpdates() : this.scheduledUpdate || (window.setZeroTimeout(this.flushUpdates.bind(this)), 
            this.scheduledUpdate = !0);
        },
        flushUpdates: function() {
            this._bridge.__sendMessage({
                type: "batchSlice",
                handle: this._handle,
                status: this.status,
                progress: this.progress,
                atTop: this.atTop,
                atBottom: this.atBottom,
                userCanGrowUpwards: this.userCanGrowUpwards,
                userCanGrowDownwards: this.userCanGrowDownwards,
                sliceUpdates: this.pendingUpdates
            }), this.pendingUpdates = [], this.scheduledUpdate = !1;
        },
        die: function() {
            this.__listener && this.__listener.die();
        }
    };
}), define("mailapi/mailbridge", [ "rdcommon/log", "./util", "./mailchew-strings", "./date", "./slice_bridge_proxy", "require", "module", "exports" ], function(e, t, n, s, i, o, r, a) {
    function c(e) {
        return e.toBridgeWire();
    }
    function d(e, t) {
        if (!t) return e.id;
        var n = e.getFolderMetaForFolderId(t.parentId);
        return d(e, n) + "!" + g[t.type] + "!" + t.name.toLocaleLowerCase();
    }
    function l(e, t) {
        return t > e ? -1 : e > t ? 1 : 0;
    }
    function u(e, t) {
        if (!e) return !1;
        for (var n = t.address, s = 0; s < e.length; s++) if (e[s].address === n) return !0;
        return !1;
    }
    function h(e, t) {
        this.universe = e, this.universe.registerBridge(this), this._LOG = _.MailBridge(this, e._LOG, t), 
        this._slices = {}, this._slicesByType = {
            accounts: [],
            identities: [],
            folders: [],
            headers: [],
            matchedHeaders: []
        }, this._observedBodies = {}, this._pendingRequests = {}, this._lastUndoableOpPair = null;
    }
    var p = t.bsearchForInsert, f = t.bsearchMaybeExists, m = i.SliceBridgeProxy, g = {
        account: "a",
        inbox: "c",
        starred: "e",
        important: "f",
        drafts: "g",
        localdrafts: "h",
        queue: "i",
        sent: "j",
        junk: "k",
        trash: "m",
        archive: "o",
        normal: "z",
        nomail: "z"
    };
    a.MailBridge = h, h.prototype = {
        __sendMessage: function() {
            throw new Error("This is supposed to get hidden by an instance var.");
        },
        __receiveMessage: function(e) {
            var t = "_cmd_" + e.type;
            return t in this ? (this._LOG.cmd(e.type, this, this[t], e), void 0) : (this._LOG.badMessageType(e.type), 
            void 0);
        },
        _cmd_ping: function(e) {
            this.__sendMessage({
                type: "pong",
                handle: e.handle
            });
        },
        _cmd_modifyConfig: function(e) {
            this.universe.modifyConfig(e.mods);
        },
        bodyHasObservers: function(e) {
            return !!this._observedBodies[e];
        },
        notifyConfig: function(e) {
            this.__sendMessage({
                type: "config",
                config: e
            });
        },
        _cmd_debugSupport: function(e) {
            switch (e.cmd) {
              case "setLogging":
                this.universe.modifyConfig({
                    debugLogging: e.arg
                });
                break;

              case "dumpLog":
                switch (e.arg) {
                  case "storage":
                    this.universe.dumpLogToDeviceStorage();
                }
            }
        },
        _cmd_setInteractive: function() {
            this.universe.setInteractive();
        },
        _cmd_localizedStrings: function(e) {
            n.set(e.strings);
        },
        _cmd_tryToCreateAccount: function(e) {
            var t = this;
            this.universe.tryToCreateAccount(e.details, e.domainInfo, function(n, s, i) {
                t.__sendMessage({
                    type: "tryToCreateAccountResults",
                    handle: e.handle,
                    account: s ? s.toBridgeWire() : null,
                    error: n,
                    errorDetails: i
                });
            });
        },
        _cmd_clearAccountProblems: function(e) {
            var t = this.universe.getAccountForAccountId(e.accountId), n = this;
            t.checkAccount(function(s, i) {
                function o(e) {
                    return !e || "bad-user-or-pass" !== e && "bad-address" !== e && "needs-app-pass" !== e && "imap-disabled" !== e;
                }
                o(s) && o(i) && n.universe.clearAccountProblems(t), n.__sendMessage({
                    type: "clearAccountProblems",
                    handle: e.handle
                });
            });
        },
        _cmd_modifyAccount: function(e) {
            var t = this.universe.getAccountForAccountId(e.accountId), n = t.accountDef;
            for (var i in e.mods) {
                var o = e.mods[i];
                switch (i) {
                  case "name":
                    n.name = o;
                    break;

                  case "username":
                    n.credentials.outgoingUsername === n.credentials.username && (n.credentials.outgoingUsername = o), 
                    n.credentials.username = o;
                    break;

                  case "incomingUsername":
                    n.credentials.username = o;
                    break;

                  case "outgoingUsername":
                    n.credentials.outgoingUsername = o;
                    break;

                  case "password":
                    n.credentials.outgoingPassword === n.credentials.password && (n.credentials.outgoingPassword = o), 
                    n.credentials.password = o;
                    break;

                  case "incomingPassword":
                    n.credentials.password = o;
                    break;

                  case "outgoingPassword":
                    n.credentials.outgoingPassword = o;
                    break;

                  case "identities":
                    break;

                  case "servers":
                    break;

                  case "syncRange":
                    n.syncRange = o;
                    break;

                  case "syncInterval":
                    n.syncInterval = o;
                    break;

                  case "notifyOnNew":
                    n.notifyOnNew = o;
                    break;

                  case "setAsDefault":
                    o && (n.defaultPriority = s.NOW());
                    break;

                  default:
                    throw new Error('Invalid key for modifyAccount: "' + i);
                }
            }
            this.universe.saveAccountDef(n, null), this.__sendMessage({
                type: "modifyAccount",
                handle: e.handle
            });
        },
        _cmd_deleteAccount: function(e) {
            this.universe.deleteAccount(e.accountId);
        },
        notifyBadLogin: function(e, t, n) {
            this.__sendMessage({
                type: "badLogin",
                account: e.toBridgeWire(),
                problem: t,
                whichSide: n
            });
        },
        _cmd_viewAccounts: function(e) {
            var t = this._slices[e.handle] = new m(this, "accounts", e.handle);
            t.markers = this.universe.accounts.map(function(e) {
                return e.id;
            }), this._slicesByType.accounts.push(t);
            var n = this.universe.accounts.map(c);
            t.sendSplice(0, 0, n, !0, !1);
        },
        notifyAccountAdded: function(e) {
            var t, n, s, i = e.toBridgeWire(), o = null, r = null;
            for (s = this._slicesByType.accounts, t = 0; t < s.length; t++) n = s[t], n.sendSplice(n.markers.length, 0, [ i ], !1, !1), 
            n.markers.push(e.id);
            i = e.toBridgeFolder(), s = this._slicesByType.folders;
            var a, c = d(e, i);
            for (t = 0; t < s.length; t++) if (n = s[t], "account" !== n.mode) {
                a = p(n.markers, c, l), o = [ i ], r = [ c ];
                for (var u = 0; u < e.folders.length; u++) {
                    var h = e.folders[u], f = d(e, h), m = p(r, f, l);
                    o.splice(m, 0, h), r.splice(m, 0, f);
                }
                n.sendSplice(a, 0, o, !1, !1), n.markers.splice.apply(n.markers, [ a, 0 ].concat(r));
            }
        },
        notifyAccountModified: function(e) {
            for (var t = this._slicesByType.accounts, n = e.toBridgeWire(), s = 0; s < t.length; s++) {
                var i = t[s], o = i.markers.indexOf(e.id);
                -1 !== o && i.sendUpdate([ o, n ]);
            }
        },
        notifyAccountRemoved: function(e) {
            var t, n, s;
            for (s = this._slicesByType.accounts, t = 0; t < s.length; t++) {
                n = s[t];
                var i = n.markers.indexOf(e);
                -1 !== i && (n.sendSplice(i, 1, [], !1, !1), n.markers.splice(i, 1));
            }
            s = this._slicesByType.folders;
            var o = e + "!!", r = e + "!|";
            for (t = 0; t < s.length; t++) {
                n = s[t];
                var a = p(n.markers, o, l), c = p(n.markers, r, l);
                c !== a && (n.sendSplice(a, c - a, [], !1, !1), n.markers.splice(a, c - a));
            }
        },
        _cmd_viewSenderIdentities: function(e) {
            var t = this._slices[e.handle] = new m(this, "identities", e.handle);
            this._slicesByType.identities.push(t);
            var n = this.universe.identities;
            t.sendSplice(0, 0, n, !0, !1);
        },
        _cmd_requestBodies: function(e) {
            var t = this;
            this.universe.downloadBodies(e.messages, e.options, function() {
                t.__sendMessage({
                    type: "requestBodiesComplete",
                    handle: e.handle,
                    requestId: e.requestId
                });
            });
        },
        notifyFolderAdded: function(e, t) {
            for (var n = d(e, t), s = this._slicesByType.folders, i = 0; i < s.length; i++) {
                var o = s[i], r = p(o.markers, n, l);
                o.sendSplice(r, 0, [ t ], !1, !1), o.markers.splice(r, 0, n);
            }
        },
        notifyFolderModified: function(e, t) {
            for (var n = d(e, t), s = this._slicesByType.folders, i = 0; i < s.length; i++) {
                var o = s[i], r = f(o.markers, n, l);
                null !== r && o.sendUpdate([ r, t ]);
            }
        },
        notifyFolderRemoved: function(e, t) {
            for (var n = d(e, t), s = this._slicesByType.folders, i = 0; i < s.length; i++) {
                var o = s[i], r = f(o.markers, n, l);
                null !== r && (o.sendSplice(r, 1, [], !1, !1), o.markers.splice(r, 1));
            }
        },
        notifyBodyModified: function(e, t, n) {
            var s = this._observedBodies[e], i = this.__sendMessage;
            if (s) for (var o in s) {
                var r = s[o] || i;
                r.call(this, {
                    type: "bodyModified",
                    handle: o,
                    bodyInfo: n,
                    detail: t
                });
            }
        },
        _cmd_viewFolders: function(e) {
            function t(e) {
                for (var t = 0; t < e.folders.length; t++) {
                    var n = e.folders[t], o = d(e, n), r = p(s, o, l);
                    i.splice(r, 0, n), s.splice(r, 0, o);
                }
            }
            var n = this._slices[e.handle] = new m(this, "folders", e.handle);
            this._slicesByType.folders.push(n), n.mode = e.mode, n.argument = e.argument;
            var s = n.markers = [], i = [];
            if ("account" === e.mode) t(this.universe.getAccountForAccountId(e.argument)); else {
                var o = this.universe.accounts.concat();
                o.sort(function(e, t) {
                    return e.id.localeCompare(t.id);
                });
                for (var r = 0; r < o.length; r++) {
                    var a = o[r], c = a.toBridgeFolder(), u = d(a, c), h = p(s, u, l);
                    i.splice(h, 0, c), s.splice(h, 0, u), t(a);
                }
            }
            n.sendSplice(0, 0, i, !0, !1);
        },
        _cmd_createFolder: function(e) {
            this.universe.createFolder(e.accountId, e.parentFolderId, e.containOnlyOtherFolders);
        },
        _cmd_viewFolderMessages: function(e) {
            var t = this._slices[e.handle] = new m(this, "headers", e.handle);
            this._slicesByType.headers.push(t);
            var n = this.universe.getAccountForFolderId(e.folderId);
            n.sliceFolderMessages(e.folderId, t);
        },
        _cmd_searchFolderMessages: function(e) {
            var t = this._slices[e.handle] = new m(this, "matchedHeaders", e.handle);
            this._slicesByType.matchedHeaders.push(t);
            var n = this.universe.getAccountForFolderId(e.folderId);
            n.searchFolderMessages(e.folderId, t, e.phrase, e.whatToSearch);
        },
        _cmd_refreshHeaders: function(e) {
            var t = this._slices[e.handle];
            return t ? (t.__listener && t.__listener.refresh(), void 0) : (this._LOG.badSliceHandle(e.handle), 
            void 0);
        },
        _cmd_growSlice: function(e) {
            var t = this._slices[e.handle];
            return t ? (t.__listener && t.__listener.reqGrow(e.dirMagnitude, e.userRequestsGrowth), 
            void 0) : (this._LOG.badSliceHandle(e.handle), void 0);
        },
        _cmd_shrinkSlice: function(e) {
            var t = this._slices[e.handle];
            return t ? (t.__listener && t.__listener.reqNoteRanges(e.firstIndex, e.firstSuid, e.lastIndex, e.lastSuid), 
            void 0) : (this._LOG.badSliceHandle(e.handle), void 0);
        },
        _cmd_killSlice: function(e) {
            var t = this._slices[e.handle];
            if (!t) return this._LOG.badSliceHandle(e.handle), void 0;
            delete this._slices[e.handle];
            var n = this._slicesByType[t._ns], s = n.indexOf(t);
            n.splice(s, 1), t.die(), this.__sendMessage({
                type: "sliceDead",
                handle: e.handle
            });
        },
        _cmd_getBody: function(e) {
            var t = this, n = this.universe.getFolderStorageForMessageSuid(e.suid), s = [], i = function(e) {
                s.push(e);
            };
            this._observedBodies[e.suid] || (this._observedBodies[e.suid] = {}), this._observedBodies[e.suid][e.handle] = i;
            var o = function(i) {
                t.__sendMessage({
                    type: "gotBody",
                    handle: e.handle,
                    bodyInfo: i
                }), e.downloadBodyReps && !n.messageBodyRepsDownloaded(i) && t.universe.downloadMessageBodyReps(e.suid, e.date, function() {}), 
                s.forEach(t.__sendMessage, t), s = null, t._observedBodies[e.suid][e.handle] = null;
            };
            e.withBodyReps ? n.getMessageBodyWithReps(e.suid, e.date, o) : n.getMessageBody(e.suid, e.date, o);
        },
        _cmd_killBody: function(e) {
            var t = this._observedBodies[e.id];
            if (t) {
                delete t[e.handle];
                var n = !0;
                for (var s in t) {
                    n = !1;
                    break;
                }
                n && delete this._observedBodies[e.id];
            }
            this.__sendMessage({
                type: "bodyDead",
                handle: e.handle
            });
        },
        _cmd_downloadAttachments: function(e) {
            var t = this;
            this.universe.downloadMessageAttachments(e.suid, e.date, e.relPartIndices, e.attachmentIndices, function() {
                t.__sendMessage({
                    type: "downloadedAttachments",
                    handle: e.handle
                });
            });
        },
        _cmd_modifyMessageTags: function(e) {
            var t = this.universe.modifyMessageTags(e.opcode, e.messages, e.addTags, e.removeTags);
            this.__sendMessage({
                type: "mutationConfirmed",
                handle: e.handle,
                longtermIds: t
            });
        },
        _cmd_deleteMessages: function(e) {
            var t = this.universe.deleteMessages(e.messages);
            this.__sendMessage({
                type: "mutationConfirmed",
                handle: e.handle,
                longtermIds: t
            });
        },
        _cmd_moveMessages: function(e) {
            var t = this.universe.moveMessages(e.messages, e.targetFolder);
            this.__sendMessage({
                type: "mutationConfirmed",
                handle: e.handle,
                longtermIds: t
            });
        },
        _cmd_undo: function(e) {
            this.universe.undoMutation(e.longtermIds);
        },
        _cmd_beginCompose: function(e) {
            o([ "mailapi/drafts/composer" ], function(t) {
                var n, s, i = this._pendingRequests[e.handle] = {
                    type: "compose",
                    active: "begin",
                    account: null,
                    persistedNamer: null,
                    die: !1
                };
                if (n = "new" === e.mode && "folder" === e.submode ? this.universe.getAccountForFolderId(e.refSuid) : this.universe.getAccountForMessageSuid(e.refSuid), 
                i.account = n, s = n.identities[0], "reply" !== e.mode && "forward" !== e.mode) return this.__sendMessage({
                    type: "composeBegun",
                    handle: e.handle,
                    error: null,
                    identity: s,
                    subject: "",
                    body: {
                        text: "",
                        html: null
                    },
                    to: [],
                    cc: [],
                    bcc: [],
                    references: null,
                    attachments: []
                });
                var o = this.universe.getFolderStorageForMessageSuid(e.refSuid), r = this;
                o.getMessage(e.refSuid, e.refDate, {
                    withBodyReps: !0
                }, function(n) {
                    if (!n) return console.warn("Cannot compose message missing header/body: ", e.refSuid);
                    var o = n.header, a = n.body;
                    if ("reply" === e.mode) {
                        var c, d, l, h = {
                            name: e.refAuthor.name,
                            address: o.replyTo && o.replyTo.address || e.refAuthor.address
                        };
                        switch (e.submode) {
                          case "list":
                          case null:
                          case "sender":
                            c = [ h ], d = l = [];
                            break;

                          case "all":
                            c = u(o.to, h) || u(o.cc, h) ? o.to : o.to && o.to.length ? [ h ].concat(o.to) : [ h ];
                            var p = function(e) {
                                return e.address !== s.address;
                            };
                            c = c.filter(p), d = (o.cc || []).filter(p), l = o.bcc;
                        }
                        var f;
                        f = a.references ? a.references.concat([ e.refGuid ]).map(function(e) {
                            return "<" + e + ">";
                        }).join(" ") : e.refGuid ? "<" + e.refGuid + ">" : "", i.active = null, r.__sendMessage({
                            type: "composeBegun",
                            handle: e.handle,
                            error: null,
                            identity: s,
                            subject: t.mailchew.generateReplySubject(e.refSubject),
                            body: t.mailchew.generateReplyBody(a.bodyReps, h, e.refDate, s, e.refGuid),
                            to: c,
                            cc: d,
                            bcc: l,
                            referencesStr: f,
                            attachments: []
                        });
                    } else i.active = null, r.__sendMessage({
                        type: "composeBegun",
                        handle: e.handle,
                        error: null,
                        identity: s,
                        subject: t.mailchew.generateForwardSubject(e.refSubject),
                        body: t.mailchew.generateForwardMessage(e.refAuthor, e.refDate, e.refSubject, o, a, s),
                        to: [],
                        cc: [],
                        bcc: [],
                        references: null,
                        attachments: []
                    });
                });
            }.bind(this));
        },
        _cmd_attachBlobToDraft: function(e) {
            o([ "mailapi/drafts/composer" ], function() {
                var t = this._pendingRequests[e.draftHandle];
                t && this.universe.attachBlobToDraft(t.account, t.persistedNamer, e.attachmentDef, function(t) {
                    this.__sendMessage({
                        type: "attachedBlobToDraft",
                        handle: e.handle,
                        draftHandle: e.draftHandle,
                        err: t
                    });
                }.bind(this));
            }.bind(this));
        },
        _cmd_detachAttachmentFromDraft: function(e) {
            o([ "mailapi/drafts/composer" ], function() {
                var t = this._pendingRequests[e.draftHandle];
                t && this.universe.detachAttachmentFromDraft(t.account, t.persistedNamer, e.attachmentIndex, function(t) {
                    this.__sendMessage({
                        type: "detachedAttachmentFromDraft",
                        handle: e.handle,
                        draftHandle: e.draftHandle,
                        err: t
                    });
                }.bind(this));
            }.bind(this));
        },
        _cmd_resumeCompose: function(e) {
            var t = this._pendingRequests[e.handle] = {
                type: "compose",
                active: "resume",
                account: null,
                persistedNamer: e.messageNamer,
                die: !1
            }, n = t.account = this.universe.getAccountForMessageSuid(e.messageNamer.suid), s = this.universe.getFolderStorageForMessageSuid(e.messageNamer.suid), i = this;
            s.runMutexed("resumeCompose", function(o) {
                function r() {
                    i.__sendMessage({
                        type: "composeBegun",
                        handle: e.handle,
                        error: "no-message"
                    }), o();
                }
                s.getMessage(e.messageNamer.suid, e.messageNamer.date, function(s) {
                    try {
                        if (!s.header || !s.body) return r(), void 0;
                        var a = s.header, c = s.body, d = {
                            text: "",
                            html: null
                        };
                        c.bodyReps.length >= 1 && "plain" === c.bodyReps[0].type && 2 === c.bodyReps[0].content.length && 1 === c.bodyReps[0].content[0] && (d.text = c.bodyReps[0].content[1]), 
                        2 == c.bodyReps.length && "html" === c.bodyReps[1].type && (d.html = c.bodyReps[1].content);
                        var l = [];
                        c.attachments.forEach(function(e) {
                            l.push({
                                name: e.name,
                                blob: {
                                    size: e.sizeEstimate,
                                    type: e.type
                                }
                            });
                        }), t.active = null, i.__sendMessage({
                            type: "composeBegun",
                            handle: e.handle,
                            error: null,
                            identity: n.identities[0],
                            subject: a.subject,
                            body: d,
                            to: a.to,
                            cc: a.cc,
                            bcc: a.bcc,
                            referencesStr: c.references,
                            attachments: l
                        }), o();
                    } catch (u) {
                        r();
                    }
                });
            });
        },
        _cmd_doneCompose: function(e) {
            o([ "mailapi/drafts/composer" ], function(t) {
                function n() {
                    i.__sendMessage({
                        type: "doneCompose",
                        handle: e.handle,
                        err: null,
                        badAddresses: null,
                        messageId: null,
                        sentDate: null
                    });
                }
                var s = this._pendingRequests[e.handle], i = this;
                if (s) {
                    if ("die" === e.command) return s.active ? s.die = !0 : delete this._pendingRequests[e.handle], 
                    void 0;
                    var o;
                    if ("delete" === e.command) return s.persistedNamer ? (o = this.universe.getAccountForMessageSuid(s.persistedNamer.suid), 
                    this.universe.deleteDraft(o, s.persistedNamer, n)) : n(), delete this._pendingRequests[e.handle], 
                    void 0;
                    var r = e.state;
                    o = this.universe.getAccountForSenderIdentityId(r.senderId);
                    var a = this.universe.getIdentityForSenderIdentityId(r.senderId);
                    "send" === e.command ? s.persistedNamer = this.universe.saveDraft(o, s.persistedNamer, r, function(n, i) {
                        var r = new t.Composer(i, o, a);
                        s.active = null, s.die && delete this._pendingRequests[e.handle], o.sendMessage(r, function(t, n) {
                            t || this.universe.deleteDraft(o, s.persistedNamer), this.__sendMessage({
                                type: "doneCompose",
                                handle: e.handle,
                                err: t,
                                badAddresses: n,
                                messageId: r.messageId,
                                sentDate: r.sentDate.valueOf()
                            });
                        }.bind(this));
                    }.bind(this)) : "save" === e.command && (s.persistedNamer = this.universe.saveDraft(o, s.persistedNamer, r, function() {
                        s.active = null, s.die && delete i._pendingRequests[e.handle], i.__sendMessage({
                            type: "doneCompose",
                            handle: e.handle,
                            err: null,
                            badAddresses: null,
                            messageId: null,
                            sentDate: null
                        });
                    }));
                }
            }.bind(this));
        },
        notifyCronSyncStart: function(e) {
            this.__sendMessage({
                type: "cronSyncStart",
                accountIds: e
            });
        },
        notifyCronSyncStop: function(e) {
            this.__sendMessage({
                type: "cronSyncStop",
                accountsResults: e
            });
        }
    };
    var _ = a.LOGFAB = e.register(r, {
        MailBridge: {
            type: e.DAEMON,
            events: {
                send: {
                    type: !0
                }
            },
            TEST_ONLY_events: {
                send: {
                    msg: !1
                }
            },
            errors: {
                badMessageType: {
                    type: !0
                },
                badSliceHandle: {
                    handle: !0
                }
            },
            calls: {
                cmd: {
                    command: !0
                }
            },
            TEST_ONLY_calls: {}
        }
    });
}), define("rdcommon/logreaper", [ "./log", "microtime", "exports" ], function(e, t, n) {
    function s(e) {
        this._rootLogger = e, this._lastTimestamp = null, this._lastSeq = null;
    }
    var i = [];
    n.LogReaper = s, s.prototype = {
        reapHierLogTimeSlice: function() {
            function n(e) {
                var t = !0, s = e.toJSON();
                s.events = null, s.kids = null, null !== e._died && (t = !1);
                var o = null;
                for (var r in e._eventMap) {
                    var a = e._eventMap[r];
                    a && (t = !1, null === o && (s.events = o = {}), o[r] = a, e._eventMap[r] = 0);
                }
                if (s.entries.length ? (t = !1, e._entries = []) : s.entries = i, e._kids && e._kids.length) for (var c = 0; c < e._kids.length; c++) {
                    var d = e._kids[c], l = n(d);
                    l && (s.kids || (s.kids = []), s.kids.push(l), t = !1), null !== d._died && e._kids.splice(c--, 1);
                }
                return t ? null : s;
            }
            var s, o, r = this._rootLogger;
            null === this._lastTimestamp ? (s = 0, o = r._born) : (s = this._lastSeq + 1, o = this._lastTimestamp);
            var a = (e.getCurrentSeq(), this._lastTimestamp = t.now());
            return {
                begin: o,
                end: a,
                logFrag: n(r)
            };
        }
    };
}), define("mailapi/maildb", [ "./worker-router", "exports" ], function(e, t) {
    function n(e) {
        function t() {
            console.log("main thread reports DB ready"), this._ready = !0, this._callbacksQueue.forEach(function(e) {
                e();
            }), this._callbacksQueue = null;
        }
        this._callbacksQueue = [], s("open", [ e ], t.bind(this));
    }
    var s = e.registerCallbackType("maildb");
    t.MailDB = n, n.prototype = {
        close: function() {
            s("close");
        },
        getConfig: function(e) {
            return this._ready ? (console.log("issuing getConfig call to main thread"), s("getConfig", null, e), 
            void 0) : (console.log("deferring getConfig call until ready"), this._callbacksQueue.push(this.getConfig.bind(this, e)), 
            void 0);
        },
        saveConfig: function(e) {
            s("saveConfig", [ e ]);
        },
        saveAccountDef: function(e, t, n) {
            s("saveAccountDef", [ e, t, n ]);
        },
        loadHeaderBlock: function(e, t, n) {
            s("loadHeaderBlock", [ e, t ], n);
        },
        loadBodyBlock: function(e, t, n) {
            s("loadBodyBlock", [ e, t ], n);
        },
        saveAccountFolderStates: function(e, t, n, i, o) {
            var r = [ e, t, n, i ];
            return s("saveAccountFolderStates", r, o), null;
        },
        deleteAccount: function(e) {
            s("deleteAccount", [ e ]);
        }
    };
}), define("mailapi/cronsync", [ "rdcommon/log", "./worker-router", "./slice_bridge_proxy", "./mailslice", "prim", "module", "exports" ], function(e, t, n, s, i, o, r) {
    function a(e) {
        console.log("cronsync: " + e + "\n");
    }
    function c(e, t, n) {
        var i = new h({
            __sendMessage: function() {}
        }, "cron"), o = new s.MailSlice(i, e, n), r = i.sendStatus, a = [];
        return o.onNewHeader = function(e) {
            console.log("onNewHeader: " + e), a.push(e);
        }, i.sendStatus = function(e, n, s) {
            r.apply(this, arguments), n && !s && t && (t(a), o.die());
        }, o;
    }
    function d(e, n) {
        this._universe = e, this._universeDeferred = {}, this._isUniverseReady = !1, this._universeDeferred.promise = i(function(e, t) {
            this._universeDeferred.resolve = e, this._universeDeferred.reject = t;
        }.bind(this)), this._LOG = p.CronSync(this, null, n), this._activeSlices = [], this._completedEnsureSync = !0, 
        this._syncAccountsDone = !0, this._synced = [], this.sendCronSync = t.registerSimple("cronsync", function(e) {
            var t = e.args;
            switch (e.cmd) {
              case "alarm":
                a("received an alarm via a message handler"), this.onAlarm.apply(this, t);
                break;

              case "syncEnsured":
                a("received an syncEnsured via a message handler"), this.onSyncEnsured.apply(this, t);
            }
        }.bind(this)), this.sendCronSync("hello");
    }
    var l = 5, u = 4096, h = n.SliceBridgeProxy;
    r.CronSync = d, d.prototype = {
        _killSlices: function() {
            this._activeSlices.forEach(function(e) {
                e.die();
            });
        },
        onUniverseReady: function() {
            this._universeDeferred.resolve(), this.ensureSync();
        },
        whenUniverse: function(e) {
            this._universeDeferred.promise.then(e);
        },
        ensureSync: function() {
            this._completedEnsureSync && (this._completedEnsureSync = !1, a("ensureSync called"), 
            this.whenUniverse(function() {
                var e = this._universe.accounts, t = {};
                e.forEach(function(e) {
                    var n = e.accountDef.syncInterval, s = "interval" + n;
                    t.hasOwnProperty(s) || (t[s] = []), t[s].push(e.id);
                }), this.sendCronSync("ensureSync", [ t ]);
            }.bind(this)));
        },
        syncAccount: function(e, t) {
            if (!this._universe.online || !e.enabled) return a("syncAcount early exit: online: " + this._universe.online + ", enabled: " + e.enabled), 
            t(), void 0;
            var n = function(n) {
                this._universe.waitForAccountOps(e, function() {
                    e.runAfterSaves(function() {
                        t(n);
                    });
                });
            }.bind(this), s = e.getFirstFolderWithType("inbox"), i = e.getFolderStorageForFolderId(s.id);
            this._LOG.syncAccount_begin(e.id);
            var o = c(i, function(t) {
                this._LOG.syncAccount_end(e.id), this._activeSlices.splice(this._activeSlices.indexOf(o), 1);
                var s = [];
                t.some(function(t, n) {
                    return s.push({
                        date: t.date,
                        from: t.author.name || t.author.address,
                        subject: t.subject,
                        accountId: e.id,
                        messageSuid: t.suid
                    }), n === l - 1 ? !0 : void 0;
                }), t.length ? (a("Asking for snippets for " + s.length + " headers"), this._universe.online ? this._universe.downloadBodies(t.slice(0, l), {
                    maximumBytesToFetch: u
                }, function() {
                    a("Notifying for " + t.length + " headers"), n([ t.length, s ]);
                }.bind(this)) : (a("UNIVERSE OFFLINE. Notifying for " + t.length + " headers"), 
                n([ t.length, s ]))) : n();
            }.bind(this), this._LOG);
            this._activeSlices.push(o), i.sliceOpenMostRecent(o, !0);
        },
        onAlarm: function(e) {
            this.whenUniverse(function() {
                if (this._LOG.alarmFired(), e) {
                    var t = this._universe.accounts, n = [], s = [];
                    this._universe.__notifyStartedCronSync(e), e.forEach(function(e) {
                        t.some(function(t) {
                            return t.id === e ? (n.push(t), s.push(e), !0) : void 0;
                        });
                    }), this._syncAccountsDone = !1, this.ensureSync();
                    var i = n.length, o = 0, r = {
                        accountIds: e
                    }, a = function() {
                        o += 1, i > o || (this._killSlices(), this._syncAccountsDone = !0, this._onSyncDone = function() {
                            this._synced.length && (r.updates = this._synced, this._synced = []), this._universe.__notifyStoppedCronSync(r);
                        }.bind(this), this._checkSyncDone());
                    }.bind(this);
                    return s.length ? (n.forEach(function(e) {
                        this.syncAccount(e, function(t) {
                            t && this._synced.push({
                                id: e.id,
                                address: e.identities[0].address,
                                count: t[0],
                                latestMessageInfos: t[1]
                            }), a();
                        }.bind(this));
                    }.bind(this)), void 0) : a();
                }
            }.bind(this));
        },
        _checkSyncDone: function() {
            this._completedEnsureSync && this._syncAccountsDone && this._onSyncDone && (this._onSyncDone(), 
            this._onSyncDone = null);
        },
        onSyncEnsured: function() {
            this._completedEnsureSync = !0, this._checkSyncDone();
        },
        shutdown: function() {
            t.unregister("cronsync"), this._killSlices();
        }
    };
    var p = r.LOGFAB = e.register(o, {
        CronSync: {
            type: e.DAEMON,
            events: {
                alarmFired: {}
            },
            TEST_ONLY_events: {},
            asyncJobs: {
                syncAccount: {
                    id: !1
                }
            },
            errors: {},
            calls: {},
            TEST_ONLY_calls: {}
        }
    });
}), define("mailapi/accountcommon", [ "rdcommon/log", "./a64", "require", "module", "exports" ], function(e, t, n, s, i) {
    function o(e, t) {
        var s = u[e] || null;
        "string" == typeof s ? n([ s ], function(e) {
            t(e.account.Account);
        }) : setTimeout(function() {
            t(null);
        }, 4);
    }
    function r(e, n, s) {
        var i = [];
        for (var o in Iterator(s)) {
            var r = o[1];
            i.push({
                id: n + "/" + t.encodeInt(e.config.nextIdentityNum++),
                name: r.name,
                address: r.address,
                replyTo: r.replyTo,
                signature: r.signature
            });
        }
        return i;
    }
    function a(e) {
        this._LOG = e, this.timeout = l;
    }
    function c(e, t, s, i) {
        n([ u[s.def.type] ], function(n) {
            n.configurator.recreateAccount(e, t, s, i);
        });
    }
    function d(e, t, s, i, o) {
        n([ u[s.type] ], function(n) {
            n.configurator.tryToCreateAccount(e, t, s, i, o);
        });
    }
    var l = 3e4, u = {
        "imap+smtp": "./composite/configurator",
        "pop3+smtp": "./composite/configurator",
        activesync: "./activesync/configurator"
    };
    i.accountTypeToClass = o;
    var h = i._autoconfigByDomain = {
        localhost: {
            type: "imap+smtp",
            incoming: {
                hostname: "localhost",
                port: 143,
                socketType: "plain",
                username: "%EMAILLOCALPART%"
            },
            outgoing: {
                hostname: "localhost",
                port: 25,
                socketType: "plain",
                username: "%EMAILLOCALPART%"
            }
        },
        fakeimaphost: {
            type: "imap+smtp",
            incoming: {
                hostname: "localhost",
                port: 0,
                socketType: "plain",
                username: "%EMAILLOCALPART%"
            },
            outgoing: {
                hostname: "localhost",
                port: 0,
                socketType: "plain",
                username: "%EMAILLOCALPART%"
            }
        },
        fakepop3host: {
            type: "pop3+smtp",
            incoming: {
                hostname: "localhost",
                port: 0,
                socketType: "plain",
                username: "%EMAILLOCALPART%"
            },
            outgoing: {
                hostname: "localhost",
                port: 0,
                socketType: "plain",
                username: "%EMAILLOCALPART%"
            }
        },
        slocalhost: {
            type: "imap+smtp",
            incoming: {
                hostname: "localhost",
                port: 993,
                socketType: "SSL",
                username: "%EMAILLOCALPART%"
            },
            outgoing: {
                hostname: "localhost",
                port: 465,
                socketType: "SSL",
                username: "%EMAILLOCALPART%"
            }
        },
        fakeashost: {
            type: "activesync",
            displayName: "Test",
            incoming: {
                server: "http://localhost:8880",
                username: "%EMAILADDRESS%"
            }
        },
        saslocalhost: {
            type: "activesync",
            displayName: "Test",
            incoming: {
                server: "https://localhost:443",
                username: "%EMAILADDRESS%"
            }
        },
        "nonesuch.nonesuch": {
            type: "imap+smtp",
            imapHost: "nonesuch.nonesuch",
            imapPort: 993,
            imapCrypto: !0,
            smtpHost: "nonesuch.nonesuch",
            smtpPort: 465,
            smtpCrypto: !0,
            usernameIsFullEmail: !1
        }
    };
    i.recreateIdentities = r, i.Autoconfigurator = a, a.prototype = {
        _fatalErrors: [ "bad-user-or-pass", "not-authorized" ],
        _isSuccessOrFatal: function(e) {
            return !e || -1 !== this._fatalErrors.indexOf(e);
        },
        _getXmlConfig: function(e, t) {
            var n = new XMLHttpRequest({
                mozSystem: !0
            });
            n.open("GET", e, !0), n.timeout = this.timeout, n.onload = function() {
                return n.status < 200 || n.status >= 300 ? (t("no-config-info", null, {
                    status: n.status
                }), void 0) : (self.postMessage({
                    uid: 0,
                    type: "configparser",
                    cmd: "accountcommon",
                    args: [ n.responseText ]
                }), self.addEventListener("message", function e(n) {
                    var s = n.data;
                    if ("configparser" == s.type && "accountcommon" == s.cmd) {
                        self.removeEventListener(n.type, e);
                        var i = s.args, o = i[0], r = i[1];
                        t(o ? null : "no-config-info", o, o ? null : {
                            status: r
                        });
                    }
                }), void 0);
            }, n.ontimeout = function() {
                t("no-config-info", null, {
                    status: "timeout"
                });
            }, n.onerror = function() {
                t("no-config-info", null, {
                    status: "error"
                });
            };
            try {
                n.send();
            } catch (s) {
                t("no-config-info", null, {
                    status: 404
                });
            }
        },
        _getConfigFromLocalFile: function(e, t) {
            this._getXmlConfig("/autoconfig/" + encodeURIComponent(e), t);
        },
        _getConfigFromAutodiscover: function(e, t) {
            var s = this;
            n([ "activesync/protocol" ], function(n) {
                n.autodiscover(e.emailAddress, e.password, s.timeout, function(e, s) {
                    if (e) {
                        var i = "no-config-info", o = {};
                        return e instanceof n.HttpError && (401 === e.status ? i = "bad-user-or-pass" : 403 === e.status ? i = "not-authorized" : o.status = e.status), 
                        t(i, null, o), void 0;
                    }
                    var r = {
                        type: "activesync",
                        displayName: s.user.name,
                        incoming: {
                            server: s.mobileSyncServer.url,
                            username: s.user.email
                        }
                    };
                    t(null, r, null);
                });
            });
        },
        _getConfigFromDomain: function(e, t, n) {
            var s = "/mail/config-v1.1.xml?emailaddress=" + encodeURIComponent(e.emailAddress), i = "http://autoconfig." + t + s, o = this;
            this._getXmlConfig(i, function(e, i, r) {
                if (o._isSuccessOrFatal(e)) return n(e, i, r), void 0;
                var a = "http://" + t + "/.well-known/autoconfig" + s;
                o._getXmlConfig(a, n);
            });
        },
        _getConfigFromDB: function(e, t) {
            this._getXmlConfig("https://live.mozillamessaging.com/autoconfig/v1.1/" + encodeURIComponent(e), t);
        },
        _getMX: function(e, t) {
            var n = new XMLHttpRequest({
                mozSystem: !0
            });
            n.open("GET", "https://live.mozillamessaging.com/dns/mx/" + encodeURIComponent(e), !0), 
            n.timeout = this.timeout, n.onload = function() {
                200 === n.status ? t(null, n.responseText.split("\n")[0], null) : t("no-config-info", null, {
                    status: "mx" + n.status
                });
            }, n.ontimeout = function() {
                t("no-config-info", null, {
                    status: "mxtimeout"
                });
            }, n.onerror = function() {
                t("no-config-info", null, {
                    status: "mxerror"
                });
            }, n.send();
        },
        _getConfigFromMX: function(e, t) {
            var n = this;
            this._getMX(e, function(s, i, o) {
                return s ? t(s, null, o) : (i = i.split(".").slice(-2).join(".").toLowerCase(), 
                console.log("  Found MX for", i), e === i ? t("no-config-info", null, {
                    status: "mxsame"
                }) : (console.log("  Looking in local file store"), n._getConfigFromLocalFile(i, function(e, s, o) {
                    return e ? (console.log("  Looking in the Mozilla ISPDB"), n._getConfigFromDB(i, t), 
                    void 0) : (t(e, s, o), void 0);
                }), void 0));
            });
        },
        getConfig: function(e, t) {
            function n(t) {
                return t.replace("%EMAILADDRESS%", e.emailAddress).replace("%EMAILLOCALPART%", o).replace("%EMAILDOMAIN%", r).replace("%REALNAME%", e.displayName);
            }
            function s(e, s, i) {
                if (console.log(e ? "FAILURE" : "SUCCESS"), s) for (var o in Iterator(c)) {
                    var r = o[0], a = o[1];
                    if (s.hasOwnProperty(r)) {
                        var u = s[r];
                        for (var h in Iterator(a)) {
                            var p = h[1];
                            u.hasOwnProperty(p) && (u[p] = n(u[p]));
                        }
                    }
                }
                e && d && (e = d, i = l), t(e, s, i);
            }
            var i = e.emailAddress.split("@"), o = i[0], r = i[1], a = r.toLowerCase();
            console.log("Attempting to get autoconfiguration for", a);
            var c = {
                incoming: [ "username", "hostname", "server" ],
                outgoing: [ "username", "hostname" ]
            }, d = null, l = null;
            if (console.log("  Looking in GELAM"), h.hasOwnProperty(a)) return s(null, h[a]), 
            void 0;
            var u = this;
            console.log("  Looking in local file store"), this._getConfigFromLocalFile(a, function(t, n, i) {
                return u._isSuccessOrFatal(t) ? (s(t, n, i), void 0) : (console.log("  Looking at domain (Thunderbird autoconfig standard)"), 
                u._getConfigFromDomain(e, a, function(t, n, i) {
                    return u._isSuccessOrFatal(t) ? (s(t, n, i), void 0) : (console.log("  Trying ActiveSync domain autodiscover"), 
                    u._getConfigFromAutodiscover(e, function(e, t, n) {
                        if (!e) return s(e, t, n), void 0;
                        if ("not-authorized" === e) d = e, l = n; else if (u._isSuccessOrFatal(e)) return s(e, t, n), 
                        void 0;
                        console.log("  Looking in the Mozilla ISPDB"), u._getConfigFromDB(a, function(e, t, n) {
                            return u._isSuccessOrFatal(e) ? (s(e, t, n), void 0) : (console.log("  Looking up MX"), 
                            u._getConfigFromMX(a, s), void 0);
                        });
                    }), void 0);
                }), void 0);
            });
        },
        tryToCreateAccount: function(e, t, s) {
            var i = this;
            this.getConfig(t, function(o, r, a) {
                return o ? s(o, null, a) : (n([ u[r.type] ], function(n) {
                    n.configurator.tryToCreateAccount(e, t, r, s, i._LOG);
                }), void 0);
            });
        }
    }, i.recreateAccount = c, i.tryToManuallyCreateAccount = d;
}), define("mailapi/mailuniverse", [ "rdcommon/log", "rdcommon/logreaper", "./a64", "./date", "./syncbase", "./worker-router", "./maildb", "./cronsync", "./accountcommon", "module", "exports" ], function(e, t, n, s, i, o, r, a, c, d, l) {
    function u(e) {
        return function(t, n, s) {
            for (var i = 0; i < this._bridges.length; i++) {
                var o = this._bridges[i];
                o[e](t, n, s);
            }
        };
    }
    function h(t, n, s) {
        this.accounts = [], this._accountsById = {}, this.identities = [], this._identitiesById = {}, 
        this._opsByAccount = {}, this._opCompletionListenersByAccount = {}, this._opCallbacks = {}, 
        this._bridges = [], this._testModeDisablingLocalOps = !1, this._testModeFakeNavigator = s && s.fakeNavigator || null, 
        this.online = !0, this._onConnectionChange(n), this._mode = "cron", this._deferredOpTimeout = null, 
        this._boundQueueDeferredOps = this._queueDeferredOps.bind(this), this.config = null, 
        this._logReaper = null, this._logBacklog = null, this._LOG = null, this._db = new r.MailDB(s), 
        this._cronSync = new a.CronSync(this);
        var i = this;
        this._db.getConfig(function(n, s, o) {
            function r() {
                i.config.debugLogging && ("dangerous" !== i.config.debugLogging ? (console.warn("GENERAL LOGGING ENABLED!"), 
                console.warn("(CIRCULAR EVENT LOGGING WITH NON-SENSITIVE DATA)"), e.enableGeneralLogging()) : (console.warn("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"), 
                console.warn("DANGEROUS USER-DATA ENTRAINING LOGGING ENABLED !!!"), console.warn("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"), 
                console.warn("This means contents of e-mails and passwords if you"), console.warn("set up a new account.  (The IMAP protocol sanitizes"), 
                console.warn("passwords, but the bridge logger may not.)"), console.warn("..................................................."), 
                e.DEBUG_markAllFabsUnderTest()));
            }
            function a() {
                u += 1, u === h && (i._initFromConfig(), t());
            }
            var d, l, u = 0, h = s.length;
            if (n) {
                if (i.config = n, r(), i._LOG = m.MailUniverse(i, null, null), i.config.debugLogging && i._enableCircularLogging(), 
                i._LOG.configLoaded(i.config, s), h) {
                    for (l = 0; h > l; l++) d = s[l], i._loadAccount(d.def, d.folderInfo, null, a);
                    return;
                }
            } else {
                if (i.config = {
                    id: "config",
                    nextAccountNum: 0,
                    nextIdentityNum: 0,
                    debugLogging: o ? o.config.debugLogging : !1
                }, r(), i._LOG = m.MailUniverse(i, null, null), i.config.debugLogging && i._enableCircularLogging(), 
                i._db.saveConfig(i.config), o) {
                    i._LOG.configMigrating(o);
                    var p = o.accountInfos.length, f = o.oldVersion;
                    for (l = 0; l < o.accountInfos.length; l++) {
                        var d = o.accountInfos[l];
                        c.recreateAccount(i, f, d, function() {
                            0 === --p && (i._initFromConfig(), t());
                        });
                    }
                    return;
                }
                i._LOG.configCreated(i.config);
            }
            i._initFromConfig(), t();
        });
    }
    var p = 10, f = 30;
    l.MailUniverse = h, h.prototype = {
        _enableCircularLogging: function() {
            this._logReaper = new t.LogReaper(this._LOG), this._logBacklog = [], window.setInterval(function() {
                var e = this._logReaper.reapHierLogTimeSlice();
                e.logFrag && (this._logBacklog.push(e), this._logBacklog.length > f && this._logBacklog.shift());
            }.bind(this), 1e3);
        },
        createLogBacklogRep: function(t) {
            return {
                type: "backlog",
                id: t,
                schema: e.provideSchemaForAllKnownFabs(),
                backlog: this._logBacklog
            };
        },
        dumpLogToDeviceStorage: function() {
            var e = o.registerCallbackType("devicestorage");
            try {
                var t = new Blob([ JSON.stringify(this.createLogBacklogRep()) ], {
                    type: "application/json",
                    endings: "transparent"
                }), n = "gem-log-" + Date.now() + ".json";
                e("save", [ "sdcard", t, n ], function(e, t, s) {
                    e ? console.log('saved log to "sdcard" devicestorage:', s) : console.error("failed to save log to", n);
                });
            } catch (s) {
                console.error("Problem dumping log to device storage:", s, "\n", s.stack);
            }
        },
        _initFromConfig: function() {
            this._cronSync.onUniverseReady();
        },
        exposeConfigForClient: function() {
            return {
                debugLogging: this.config.debugLogging
            };
        },
        modifyConfig: function(e) {
            for (var t in e) {
                var n = e[t];
                switch (t) {
                  case "debugLogging":
                    break;

                  default:
                    continue;
                }
                this.config[t] = n;
            }
            this._db.saveConfig(this.config), this.__notifyConfig();
        },
        __notifyConfig: function() {
            for (var e = this.exposeConfigForClient(), t = 0; t < this._bridges.length; t++) {
                var n = this._bridges[t];
                n.notifyConfig(e);
            }
        },
        setInteractive: function() {
            this._mode = "interactive";
        },
        _onConnectionChange: function(e) {
            var t = this.online;
            if (this.online = this._testModeFakeNavigator ? this._testModeFakeNavigator.onLine : e, 
            console.log("Email knows that it is:", this.online ? "online" : "offline", "and previously was:", t ? "online" : "offline"), 
            this.minimizeNetworkUsage = !0, this.networkCostsMoney = !0, !t && this.online) for (var n = 0; n < this.accounts.length; n++) this._resumeOpProcessingForAccount(this.accounts[n]);
        },
        _dispatchLocalOpForAccount: function(e, t) {
            var n = this._opsByAccount[e.id];
            n.active = !0;
            var s;
            switch (t.lifecycle) {
              case "do":
                s = "local_do", t.localStatus = "doing";
                break;

              case "undo":
                s = "local_undo", t.localStatus = "undoing";
                break;

              default:
                throw new Error("Illegal lifecycle state for local op");
            }
            e.runOp(t, s, this._localOpCompleted.bind(this, e, t));
        },
        _dispatchServerOpForAccount: function(e, t) {
            var n = this._opsByAccount[e.id];
            n.active = !0;
            var s = t.lifecycle;
            "check" === t.serverStatus && (s = "check"), t.serverStatus = s + "ing", e.runOp(t, s, this._serverOpCompleted.bind(this, e, t));
        },
        _resumeOpProcessingForAccount: function(e) {
            var t = this._opsByAccount[e.id];
            if (e.enabled && !t.local.length && t.server.length && "doing" !== t.server[0].serverStatus && "undoing" !== t.server[0].serverStatus) {
                var n = t.server[0];
                this._dispatchServerOpForAccount(e, n);
            }
        },
        registerBridge: function(e) {
            this._bridges.push(e);
        },
        unregisterBridge: function(e) {
            var t = this._bridges.indexOf(e);
            -1 !== t && this._bridges.splice(t, 1);
        },
        tryToCreateAccount: function(e, t, n) {
            if (!this.online) return n("offline"), void 0;
            if (!e.forceCreate) for (var s = 0; s < this.accounts.length; s++) if (e.emailAddress === this.accounts[s].identities[0].address) return n("user-account-exists"), 
            void 0;
            if (t) c.tryToManuallyCreateAccount(this, e, t, n, this._LOG); else {
                var i = new c.Autoconfigurator(this._LOG);
                i.tryToCreateAccount(this, e, n);
            }
        },
        deleteAccount: function(e) {
            var t = null, n = this._accountsById[e];
            try {
                n.accountDeleted();
            } catch (s) {
                t = s;
            }
            this._db.deleteAccount(e), delete this._accountsById[e];
            var i = this.accounts.indexOf(n);
            this.accounts.splice(i, 1);
            for (var o = 0; o < n.identities.length; o++) {
                var r = n.identities[o];
                i = this.identities.indexOf(r), this.identities.splice(i, 1), delete this._identitiesById[r.id];
            }
            if (delete this._opsByAccount[e], delete this._opCompletionListenersByAccount[e], 
            this.__notifyRemovedAccount(e), t) throw t;
        },
        saveAccountDef: function(e, t) {
            this._db.saveAccountDef(this.config, e, t);
            var n = this.getAccountForAccountId(e.id);
            this._cronSync.ensureSync(), n && this.__notifyModifiedAccount(n);
        },
        _loadAccount: function(e, t, n, s) {
            c.accountTypeToClass(e.type, function(o) {
                if (!o) return this._LOG.badAccountType(e.type), void 0;
                var r = new o(this, e, t, this._db, n, this._LOG);
                this.accounts.push(r), this._accountsById[r.id] = r, this._opsByAccount[r.id] = {
                    active: !1,
                    local: [],
                    server: [],
                    deferred: []
                }, this._opCompletionListenersByAccount[r.id] = null;
                for (var a = 0; a < e.identities.length; a++) {
                    var c = e.identities[a];
                    this.identities.push(c), this._identitiesById[c.id] = c;
                }
                this.__notifyAddedAccount(r);
                var d = Date.now() - r.meta.lastFolderSyncAt;
                d >= i.SYNC_FOLDER_LIST_EVERY_MS && this.syncFolderList(r);
                for (var l = 0; l < r.mutations.length; l++) {
                    var u = r.mutations[l];
                    "done" !== u.lifecycle && "undone" !== u.lifecycle && "moot" !== u.lifecycle && (u.serverStatus = "check", 
                    this._queueAccountOp(r, u));
                }
                s(r);
            }.bind(this));
        },
        __reportAccountProblem: function(e, t, n) {
            var s = !1;
            if (-1 !== e.problems.indexOf(t) && (s = !0), this._LOG.reportProblem(t, s, e.id), 
            !s) switch (e.problems.push(t), e.enabled = !1, this.__notifyModifiedAccount(e), 
            t) {
              case "bad-user-or-pass":
              case "bad-address":
              case "imap-disabled":
              case "needs-app-pass":
                this.__notifyBadLogin(e, t, n);
            }
        },
        __removeAccountProblem: function(e, t) {
            var n = e.problems.indexOf(t);
            -1 !== n && (e.problems.splice(n, 1), e.enabled = 0 === e.problems.length, this.__notifyModifiedAccount(e), 
            e.enabled && this._resumeOpProcessingForAccount(e));
        },
        clearAccountProblems: function(e) {
            this._LOG.clearAccountProblems(e.id), e.enabled = !0, e.problems = [], this._resumeOpProcessingForAccount(e);
        },
        __notifyBadLogin: u("notifyBadLogin"),
        __notifyAddedAccount: u("notifyAccountAdded"),
        __notifyModifiedAccount: u("notifyAccountModified"),
        __notifyRemovedAccount: u("notifyAccountRemoved"),
        __notifyAddedFolder: u("notifyFolderAdded"),
        __notifyModifiedFolder: u("notifyFolderModified"),
        __notifyRemovedFolder: u("notifyFolderRemoved"),
        __notifyModifiedBody: u("notifyBodyModified"),
        __notifyStartedCronSync: u("notifyCronSyncStart"),
        __notifyStoppedCronSync: u("notifyCronSyncStop"),
        saveUniverseState: function() {
            for (var e = null, t = 0; t < this.accounts.length; t++) {
                var n = this.accounts[t];
                e = n.saveAccountState(e, null, "saveUniverse");
            }
        },
        shutdown: function(e) {
            function t() {
                0 === --n && e();
            }
            for (var n = this.accounts.length, s = 0; s < this.accounts.length; s++) {
                var i = this.accounts[s];
                i.shutdown(e ? t : null);
            }
            this._cronSync.shutdown(), this._db.close(), this._LOG && this._LOG.__die(), this.accounts.length || e();
        },
        getAccountForAccountId: function(e) {
            return this._accountsById[e];
        },
        getAccountForFolderId: function(e) {
            var t = e.substring(0, e.indexOf("/")), n = this._accountsById[t];
            return n;
        },
        getAccountForMessageSuid: function(e) {
            var t = e.substring(0, e.indexOf("/")), n = this._accountsById[t];
            return n;
        },
        getFolderStorageForFolderId: function(e) {
            var t = this.getAccountForFolderId(e);
            return t.getFolderStorageForFolderId(e);
        },
        getFolderStorageForMessageSuid: function(e) {
            var t = e.substring(0, e.lastIndexOf("/")), n = this.getAccountForFolderId(t);
            return n.getFolderStorageForFolderId(t);
        },
        getAccountForSenderIdentityId: function(e) {
            var t = e.substring(0, e.indexOf("/")), n = this._accountsById[t];
            return n;
        },
        getIdentityForSenderIdentityId: function(e) {
            return this._identitiesById[e];
        },
        _partitionMessagesByAccount: function(e, t) {
            for (var n = [], s = {}, i = 0; i < e.length; i++) {
                var o = e[i], r = o.suid, a = r.substring(0, r.indexOf("/"));
                if (s.hasOwnProperty(a)) s[a].push(o); else {
                    var c = [ o ];
                    n.push({
                        account: this._accountsById[a],
                        messages: c,
                        crossAccount: t && t !== a
                    }), s[a] = c;
                }
            }
            return n;
        },
        _deferOp: function(e, t) {
            this._opsByAccount[e.id].deferred.push(t.longtermId), null !== this._deferredOpTimeout && (this._deferredOpTimeout = window.setTimeout(this._boundQueueDeferredOps, i.DEFERRED_OP_DELAY_MS));
        },
        _queueDeferredOps: function() {
            if (this._deferredOpTimeout = null, "interactive" !== this._mode) return console.log("delaying deferred op since mode is " + this._mode), 
            this._deferredOpTimeout = window.setTimeout(this._boundQueueDeferredOps, i.DEFERRED_OP_DELAY_MS), 
            void 0;
            for (var e = 0; e < this.accounts.length; e++) for (var t = this.accounts[e], n = this._opsByAccount[t.id]; n.deferred.length; ) {
                var s = n.deferred.shift();
                -1 === n.server.indexOf(s) && "undo" !== s.lifecycle && this._queueAccountOp(t, s);
            }
        },
        _localOpCompleted: function(e, t, n, s, o) {
            var r = this._opsByAccount[e.id], a = r.server, c = r.local;
            r.active = !1;
            var d = !1, l = !1;
            if (n) switch (n) {
              case "defer":
                if (++t.tryCount < i.MAX_OP_TRY_COUNT) {
                    this._LOG.opDeferred(t.type, t.longtermId), this._deferOp(e, t), d = !0;
                    break;
                }

              default:
                this._LOG.opGaveUp(t.type, t.longtermId), t.lifecycle = "moot", t.localStatus = "unknown", 
                t.serverStatus = "moot", d = !0, l = !0;
            } else {
                switch (t.localStatus) {
                  case "doing":
                    t.localStatus = "done", "n/a" === t.serverStatus && (t.lifecycle = "done", l = !0);
                    break;

                  case "undoing":
                    t.localStatus = "undone", "n/a" === t.serverStatus && (t.lifecycle = "undone", l = !0);
                }
                o && e.saveAccountState(null, null, "localOp");
            }
            if (d) {
                var u = a.indexOf(t);
                -1 !== u && a.splice(u, 1);
            }
            if (c.shift(), l && this._opCallbacks.hasOwnProperty(t.longtermId)) {
                var h = this._opCallbacks[t.longtermId];
                delete this._opCallbacks[t.longtermId];
                try {
                    h(n, s, e, t);
                } catch (p) {
                    console.log(p.message, p.stack), this._LOG.opCallbackErr(t.type);
                }
            }
            c.length ? (t = c[0], this._dispatchLocalOpForAccount(e, t)) : a.length && this.online && e.enabled ? (t = a[0], 
            this._dispatchServerOpForAccount(e, t)) : this._opCompletionListenersByAccount[e.id] && (this._opCompletionListenersByAccount[e.id](e), 
            this._opCompletionListenersByAccount[e.id] = null);
        },
        _serverOpCompleted: function(e, t, n, s, o) {
            var r = this._opsByAccount[e.id], a = r.server, c = r.local;
            r.active = !1, a[0] !== t && this._LOG.opInvariantFailure();
            var d = !1, l = !0, u = !0;
            if (n) switch (n) {
              case "defer":
                ++t.tryCount < i.MAX_OP_TRY_COUNT ? ("doing" === t.serverStatus && "do" === t.lifecycle && (this._LOG.opDeferred(t.type, t.longtermId), 
                this._deferOp(e, t)), u = !1) : (t.lifecycle = "moot", t.serverStatus = "moot");
                break;

              case "aborted-retry":
                t.tryCount++, d = !0;
                break;

              default:
                t.tryCount += i.OP_UNKNOWN_ERROR_TRY_COUNT_INCREMENT, d = !0;
                break;

              case "failure-give-up":
                this._LOG.opGaveUp(t.type, t.longtermId), t.lifecycle = "moot", t.serverStatus = "moot";
                break;

              case "moot":
                this._LOG.opMooted(t.type, t.longtermId), t.lifecycle = "moot", t.serverStatus = "moot";
            } else {
                switch (t.serverStatus) {
                  case "checking":
                    switch (s) {
                      case "checked-notyet":
                      case "coherent-notyet":
                        t.serverStatus = null;
                        break;

                      case "idempotent":
                        t.serverStatus = "do" === t.lifecycle || "done" === t.lifecycle ? null : "done";
                        break;

                      case "happened":
                        t.serverStatus = "done";
                        break;

                      case "moot":
                        t.lifecycle = "moot", t.serverStatus = "moot";
                        break;

                      case "bailed":
                        this._LOG.opDeferred(t.type, t.longtermId), this._deferOp(e, t), u = !1;
                    }
                    break;

                  case "doing":
                    t.serverStatus = "done", "do" === t.lifecycle && (t.lifecycle = "done");
                    break;

                  case "undoing":
                    t.serverStatus = "undone", "undo" === t.lifecycle && (t.lifecycle = "undone");
                }
                ("do" === t.lifecycle || "undo" === t.lifecycle) && (l = !1);
            }
            if (d && (t.tryCount < i.MAX_OP_TRY_COUNT ? (t.serverStatus = "check", l = !1) : (this._LOG.opTryLimitReached(t.type, t.longtermId), 
            t.lifecycle = "moot", t.serverStatus = "moot")), l && a.shift(), o && (e._saveAccountIsImminent = !0), 
            u) {
                if (this._opCallbacks.hasOwnProperty(t.longtermId)) {
                    var h = this._opCallbacks[t.longtermId];
                    delete this._opCallbacks[t.longtermId];
                    try {
                        h(n, s, e, t);
                    } catch (p) {
                        console.log(p.message, p.stack), this._LOG.opCallbackErr(t.type);
                    }
                }
                o && (e._saveAccountIsImminent = !1, e.saveAccountState(null, null, "serverOp"));
            }
            c.length ? (t = c[0], this._dispatchLocalOpForAccount(e, t)) : a.length && this.online && e.enabled ? (t = a[0], 
            this._dispatchServerOpForAccount(e, t)) : this._opCompletionListenersByAccount[e.id] && (this._opCompletionListenersByAccount[e.id](e), 
            this._opCompletionListenersByAccount[e.id] = null);
        },
        _queueAccountOp: function(e, t, s) {
            if (console.log("queueOp", e.id, t.type), null === t.longtermId) for (t.longtermId = e.id + "/" + n.encodeInt(e.meta.nextMutationNum++), 
            e.mutations.push(t); e.mutations.length > p && "done" === e.mutations[0].lifecycle || "undone" === e.mutations[0].lifecycle || "moot" === e.mutations[0].lifecycle; ) e.mutations.shift(); else "session" === t.longtermId && (t.longtermId = e.id + "/" + n.encodeInt(e.meta.nextMutationNum++));
            s && (this._opCallbacks[t.longtermId] = s);
            var i = this._opsByAccount[e.id];
            return !this._testModeDisablingLocalOps && ("do" === t.lifecycle && null === t.localStatus || "undo" === t.lifecycle && "undone" !== t.localStatus && "unknown" !== t.localStatus) && i.local.push(t), 
            "n/a" !== t.serverStatus && "moot" !== t.serverStatus && i.server.push(t), i.active || (i.local.length ? 1 === i.local.length && i.local[0] === t && this._dispatchLocalOpForAccount(e, t) : 1 === i.server.length && i.server[0] === t && this.online && e.enabled && this._dispatchServerOpForAccount(e, t)), 
            t.longtermId;
        },
        waitForAccountOps: function(e, t) {
            var n = this._opsByAccount[e.id];
            0 !== n.local.length || 0 !== n.server.length && this.online && e.enabled ? this._opCompletionListenersByAccount[e.id] = t : t();
        },
        syncFolderList: function(e, t) {
            this._queueAccountOp(e, {
                type: "syncFolderList",
                longtermId: "session",
                lifecycle: "do",
                localStatus: "done",
                serverStatus: null,
                tryCount: 0,
                humanOp: "syncFolderList"
            }, t);
        },
        purgeExcessMessages: function(e, t, n) {
            this._queueAccountOp(e, {
                type: "purgeExcessMessages",
                longtermId: "session",
                lifecycle: "do",
                localStatus: null,
                serverStatus: "n/a",
                tryCount: 0,
                humanOp: "purgeExcessMessages",
                folderId: t
            }, n);
        },
        downloadMessageBodyReps: function(e, t, n) {
            var s = this.getAccountForMessageSuid(e);
            this._queueAccountOp(s, {
                type: "downloadBodyReps",
                longtermId: "session",
                lifecycle: "do",
                localStatus: "done",
                serverStatus: null,
                tryCount: 0,
                humanOp: "downloadBodyReps",
                messageSuid: e,
                messageDate: t
            }, n);
        },
        downloadBodies: function(e, t, n) {
            function s() {
                --o || n();
            }
            "function" == typeof t && (n = t, t = null);
            var i = this, o = 0;
            this._partitionMessagesByAccount(e, null).forEach(function(e) {
                o++, i._queueAccountOp(e.account, {
                    type: "downloadBodies",
                    longtermId: "session",
                    lifecycle: "do",
                    localStatus: "done",
                    serverStatus: null,
                    tryCount: 0,
                    humanOp: "downloadBodies",
                    messages: e.messages,
                    options: t
                }, s);
            });
        },
        downloadMessageAttachments: function(e, t, n, s, i) {
            var o = this.getAccountForMessageSuid(e);
            this._queueAccountOp(o, {
                type: "download",
                longtermId: null,
                lifecycle: "do",
                localStatus: null,
                serverStatus: null,
                tryCount: 0,
                humanOp: "download",
                messageSuid: e,
                messageDate: t,
                relPartIndices: n,
                attachmentIndices: s
            }, i);
        },
        modifyMessageTags: function(e, t, n, s) {
            var i = this, o = [];
            return this._partitionMessagesByAccount(t, null).forEach(function(t) {
                var r = i._queueAccountOp(t.account, {
                    type: "modtags",
                    longtermId: null,
                    lifecycle: "do",
                    localStatus: null,
                    serverStatus: null,
                    tryCount: 0,
                    humanOp: e,
                    messages: t.messages,
                    addTags: n,
                    removeTags: s,
                    progress: 0
                });
                o.push(r);
            }), o;
        },
        moveMessages: function(e, t) {
            var n = this, s = [], i = this.getAccountForFolderId(t);
            return this._partitionMessagesByAccount(e, null).forEach(function(e) {
                if (e.account !== i) throw new Error("cross-account moves not currently supported!");
                var o = n._queueAccountOp(e.account, {
                    type: "move",
                    longtermId: null,
                    lifecycle: "do",
                    localStatus: null,
                    serverStatus: null,
                    tryCount: 0,
                    humanOp: "move",
                    messages: e.messages,
                    targetFolder: t
                });
                s.push(o);
            }), s;
        },
        deleteMessages: function(e) {
            var t = this, n = [];
            return this._partitionMessagesByAccount(e, null).forEach(function(e) {
                var s = t._queueAccountOp(e.account, {
                    type: "delete",
                    longtermId: null,
                    lifecycle: "do",
                    localStatus: null,
                    serverStatus: null,
                    tryCount: 0,
                    humanOp: "delete",
                    messages: e.messages
                });
                n.push(s);
            }), n;
        },
        appendMessages: function(e, t, n) {
            var s = this.getAccountForFolderId(e), i = this._queueAccountOp(s, {
                type: "append",
                longtermId: "session",
                lifecycle: "do",
                localStatus: "done",
                serverStatus: null,
                tryCount: 0,
                humanOp: "append",
                messages: t,
                folderId: e
            }, n);
            return [ i ];
        },
        saveSentDraft: function(e, t, n) {
            var s = this.getAccountForMessageSuid(t.suid), i = this._queueAccountOp(s, {
                type: "saveSentDraft",
                longtermId: null,
                lifecycle: "do",
                localStatus: null,
                serverStatus: "n/a",
                tryCount: 0,
                humanOp: "saveSentDraft",
                folderId: e,
                headerInfo: t,
                bodyInfo: n
            });
            return [ i ];
        },
        attachBlobToDraft: function(e, t, n, s) {
            this._queueAccountOp(e, {
                type: "attachBlobToDraft",
                longtermId: "session",
                lifecycle: "do",
                localStatus: null,
                serverStatus: "n/a",
                tryCount: 0,
                humanOp: "attachBlobToDraft",
                existingNamer: t,
                attachmentDef: n
            }, s);
        },
        detachAttachmentFromDraft: function(e, t, n, s) {
            this._queueAccountOp(e, {
                type: "detachAttachmentFromDraft",
                longtermId: "session",
                lifecycle: "do",
                localStatus: null,
                serverStatus: "n/a",
                tryCount: 0,
                humanOp: "detachAttachmentFromDraft",
                existingNamer: t,
                attachmentIndex: n
            }, s);
        },
        saveDraft: function(e, t, n, i) {
            var o = e.getFirstFolderWithType("localdrafts"), r = e.getFolderStorageForFolderId(o.id), a = r._issueNewHeaderId(), c = {
                id: a,
                suid: r.folderId + "/" + a,
                date: s.NOW()
            };
            return this._queueAccountOp(e, {
                type: "saveDraft",
                longtermId: null,
                lifecycle: "do",
                localStatus: null,
                serverStatus: "n/a",
                tryCount: 0,
                humanOp: "saveDraft",
                existingNamer: t,
                newDraftInfo: c,
                draftRep: n
            }, i), {
                suid: c.suid,
                date: c.date
            };
        },
        deleteDraft: function(e, t, n) {
            this._queueAccountOp(e, {
                type: "deleteDraft",
                longtermId: null,
                lifecycle: "do",
                localStatus: null,
                serverStatus: "n/a",
                tryCount: 0,
                humanOp: "deleteDraft",
                messageNamer: t
            }, n);
        },
        createFolder: function(e, t, n, s, i) {
            var o = this.getAccountForAccountId(e), r = this._queueAccountOp(o, {
                type: "createFolder",
                longtermId: null,
                lifecycle: "do",
                localStatus: null,
                serverStatus: null,
                tryCount: 0,
                humanOp: "createFolder",
                parentFolderId: t,
                folderName: n,
                containOnlyOtherFolders: s
            }, i);
            return [ r ];
        },
        undoMutation: function(e) {
            for (var t = 0; t < e.length; t++) for (var n = e[t], s = this.getAccountForFolderId(n), i = this._opsByAccount[s.id], o = 0; o < s.mutations.length; o++) {
                var r = s.mutations[o];
                if (r.longtermId === n) {
                    if ("undo" === r.lifecycle || "undone" === r.lifecycle) continue;
                    if ("done" === r.lifecycle) {
                        r.lifecycle = "undo", this._queueAccountOp(s, r);
                        continue;
                    }
                    var a = i.local.indexOf(r);
                    if (-1 !== a) {
                        r.lifecycle = "undone", i.local.splice(a, 1);
                        continue;
                    }
                    r.lifecycle = "undo", this._queueAccountOp(s, r);
                }
            }
        }
    };
    var m = l.LOGFAB = e.register(d, {
        MailUniverse: {
            type: e.ACCOUNT,
            events: {
                configCreated: {},
                configMigrating: {},
                configLoaded: {},
                createAccount: {
                    type: !0,
                    id: !1
                },
                reportProblem: {
                    type: !0,
                    suppressed: !0,
                    id: !1
                },
                clearAccountProblems: {
                    id: !1
                },
                opDeferred: {
                    type: !0,
                    id: !1
                },
                opTryLimitReached: {
                    type: !0,
                    id: !1
                },
                opGaveUp: {
                    type: !0,
                    id: !1
                },
                opMooted: {
                    type: !0,
                    id: !1
                }
            },
            TEST_ONLY_events: {
                configCreated: {
                    config: !1
                },
                configMigrating: {
                    lazyCarryover: !1
                },
                configLoaded: {
                    config: !1,
                    accounts: !1
                },
                createAccount: {
                    name: !1
                }
            },
            errors: {
                badAccountType: {
                    type: !0
                },
                opCallbackErr: {
                    type: !1
                },
                opInvariantFailure: {}
            }
        }
    });
}), define("mailapi/worker-setup", [ "./shim-sham", "./worker-router", "./mailbridge", "./mailuniverse", "exports" ], function(e, t, n, s) {
    function i(e) {
        a++;
        var t = new n.MailBridge(e), s = r.register(function(e) {
            t.__receiveMessage(e.msg);
        }), i = s.sendMessage;
        t.__sendMessage = function(e) {
            t._LOG.send(e.type, e), i(null, e);
        }, t.__sendMessage({
            type: "hello",
            config: e.exposeConfigForClient()
        });
    }
    function o() {
        i(c), console.log("Mail universe/bridge created and notified!");
    }
    var r = t.registerInstanceType("bridge"), a = 0, c = null, d = t.registerSimple("control", function(e) {
        var t = e.args;
        switch (e.cmd) {
          case "hello":
            c = new s.MailUniverse(o, t[0]);
            break;

          case "online":
          case "offline":
            c._onConnectionChange(t[0]);
        }
    });
    d("hello");
}), require([ "mailapi/worker-setup" ]);