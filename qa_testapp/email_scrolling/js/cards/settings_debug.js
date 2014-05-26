var _secretDebug;

define([ "require", "tmpl!./settings_debug.html", "mail_common", "api" ], function(e) {
    function t(e) {
        this.domNode = e, e.getElementsByClassName("tng-close-btn")[0].addEventListener("click", this.onClose.bind(this), !1), 
        e.getElementsByClassName("tng-dbg-reset")[0].addEventListener("click", window.location.reload.bind(window.location), !1), 
        e.getElementsByClassName("tng-dbg-dump-storage")[0].addEventListener("click", this.dumpLog.bind(this, "storage"), !1), 
        this.loggingButton = e.getElementsByClassName("tng-dbg-logging")[0], this.dangerousLoggingButton = e.getElementsByClassName("tng-dbg-dangerous-logging")[0], 
        this.loggingButton.addEventListener("click", this.cycleLogging.bind(this, !0, !0), !1), 
        this.dangerousLoggingButton.addEventListener("click", this.cycleLogging.bind(this, !0, "dangerous"), !1), 
        this.cycleLogging(!1), e.querySelector(".tng-dbg-fastsync").addEventListener("click", this.fastSync.bind(this), !0);
    }
    var n = e("tmpl!./settings_debug.html"), s = e("mail_common"), a = e("api"), o = s.Cards;
    return _secretDebug || (_secretDebug = {}), t.prototype = {
        onClose: function() {
            o.removeCardAndSuccessors(this.domNode, "animate", 1);
        },
        dumpLog: function(e) {
            a.debugSupport("dumpLog", e);
        },
        cycleLogging: function(e, t) {
            var n = a.config.debugLogging;
            if (e) {
                if (t === !0) n = !n; else if ("dangerous" === t && n === !0) n = "dangerous"; else {
                    if ("dangerous" !== t || "dangerous" !== n) return;
                    n = !0;
                }
                a.debugSupport("setLogging", n);
            }
            var s, o;
            n === !0 ? (s = "Logging is ENABLED; toggle", o = "Logging is SAFE; toggle") : "dangerous" === n ? (s = "Logging is ENABLED; toggle", 
            o = "Logging DANGEROUSLY ENTRAINS USER DATA; toggle") : (s = "Logging is DISABLED; toggle", 
            o = "(enable logging to access this secret button)"), this.loggingButton.textContent = s, 
            this.dangerousLoggingButton.textContent = o;
        },
        fastSync: function() {
            _secretDebug.fastSync = [ 2e4, 6e4 ];
        },
        die: function() {}
    }, o.defineCardWithDefaultMode("settings_debug", {
        tray: !1
    }, t, n), t;
});