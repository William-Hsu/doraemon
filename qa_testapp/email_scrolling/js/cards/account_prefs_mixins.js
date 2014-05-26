define([ "require", "evt", "l10n!" ], function(t) {
    var n = t("evt"), e = t("l10n!");
    return {
        _bindPrefs: function(t, n) {
            if (t) {
                var c = this.nodeFromClass(t), i = this.account.syncInterval, o = String(i), a = [];
                "undefined" != typeof _secretDebug && _secretDebug.fastSync && (a = a.concat(_secretDebug.fastSync));
                var s = Array.slice(c.options, 0).some(function(t) {
                    return o === t.value;
                });
                s || -1 !== a.indexOf(i) || a.push(i), a.forEach(function(t) {
                    var n = document.createElement("option"), i = t / 1e3;
                    n.value = String(t), e.localize(n, "settings-check-dynamic", {
                        n: i
                    }), c.appendChild(n);
                }), c.value = o, c.addEventListener("change", this.onChangeSyncInterval.bind(this), !1);
            }
            if (n) {
                var r = this.nodeFromClass(n);
                r.addEventListener("click", this.onNotifyEmailClick.bind(this), !1), r.checked = this.account.notifyOnNew;
            }
        },
        nodeFromClass: function(t) {
            return this.domNode.getElementsByClassName(t)[0];
        },
        onChangeSyncInterval: function(t) {
            var e = parseInt(t.target.value, 10);
            console.log("sync interval changed to", e);
            var c = {
                syncInterval: e
            };
            this.account.modifyAccount ? this.account.modifyAccount(c) : n.emitWhenListener("accountModified", this.account.id, c);
        },
        onNotifyEmailClick: function(t) {
            var e = t.target.checked;
            console.log("notifyOnNew changed to: " + e);
            var c = {
                notifyOnNew: e
            };
            this.account.modifyAccount ? this.account.modifyAccount(c) : n.emitWhenListener("accountModified", this.account.id, c);
        }
    };
});