define([ "require", "tmpl!./settings_account.html", "tmpl!./tng/account_settings_server.html", "tmpl!./tng/account_delete_confirm.html", "evt", "mail_common", "model", "l10n!", "./account_prefs_mixins", "mix" ], function(e) {
    function t(e, t, n) {
        this.domNode = e, this.account = n.account;
        var a = this.nodeFromClass("tng-account-server-container");
        this.nodeFromClass("tng-account-header-label").textContent = n.account.name, this._bindPrefs("tng-account-check-interval", "tng-notify-mail"), 
        this.nodeFromClass("tng-back-btn").addEventListener("click", this.onBack.bind(this), !1), 
        this.nodeFromClass("tng-account-delete").addEventListener("click", this.onDelete.bind(this), !1);
        var o = this.account.identities[0];
        if (this.nodeFromClass("tng-account-name").textContent = o && o.name || this.account.name, 
        this.nodeFromClass("tng-account-type").textContent = "activesync" === this.account.type ? "ActiveSync" : "imap+smtp" === this.account.type ? "IMAP+SMTP" : "POP3+SMTP", 
        this.defaultLabelNode = this.nodeFromClass("tng-default-label"), this.defaultInputNode = this.nodeFromClass("tng-default-input"), 
        this.account.isDefault ? (this.defaultInputNode.disabled = !0, this.defaultInputNode.checked = !0) : this.defaultLabelNode.addEventListener("click", this.onChangeDefaultAccount.bind(this), !1), 
        "activesync" === this.account.type) {
            var i = this.nodeFromClass("tng-account-synchronize");
            i.value = this.account.syncRange, i.addEventListener("change", this.onChangeSynchronize.bind(this), !1);
        } else this.nodeFromClass("synchronize-setting").style.display = "none";
        this.account.servers.forEach(function(e, t) {
            var n = s.cloneNode(!0), o = n.getElementsByClassName("tng-account-server-label")[0];
            o.textContent = c.get("settings-" + e.type + "-label"), o.addEventListener("click", this.onClickServers.bind(this, t), !1), 
            a.appendChild(n);
        }.bind(this)), this.nodeFromClass("tng-account-credentials").addEventListener("click", this.onClickCredentials.bind(this), !1);
    }
    var n = e("tmpl!./settings_account.html"), s = e("tmpl!./tng/account_settings_server.html"), a = e("tmpl!./tng/account_delete_confirm.html"), o = e("evt"), i = e("mail_common"), c = (e("model"), 
    e("l10n!")), d = e("./account_prefs_mixins"), l = e("mix"), r = i.Cards, m = i.ConfirmDialog;
    return t.prototype = {
        onBack: function() {
            r.removeCardAndSuccessors(this.domNode, "animate", 1);
        },
        onClickCredentials: function() {
            r.pushCard("settings_account_credentials", "default", "animate", {
                account: this.account
            }, "right");
        },
        onClickServers: function(e) {
            r.pushCard("settings_account_servers", "default", "animate", {
                account: this.account,
                index: e
            }, "right");
        },
        onChangeDefaultAccount: function(e) {
            e.stopPropagation(), e.preventBubble && e.preventBubble(), this.defaultInputNode.disabled || (this.defaultInputNode.disabled = !0, 
            this.defaultInputNode.checked = !0, this.account.modifyAccount({
                setAsDefault: !0
            }));
        },
        onChangeSynchronize: function(e) {
            this.account.modifyAccount({
                syncRange: e.target.value
            });
        },
        onDelete: function() {
            var e = this.account, t = a.cloneNode(!0), n = t.getElementsByTagName("p")[0];
            n.textContent = c.get("settings-account-delete-prompt", {
                account: e.name
            }), m.show(t, {
                id: "account-delete-ok",
                handler: function() {
                    e.deleteAccount(), o.emit("accountDeleted", e);
                }
            }, {
                id: "account-delete-cancel",
                handler: null
            });
        },
        die: function() {}
    }, l(t.prototype, d), r.defineCardWithDefaultMode("settings_account", {
        tray: !1
    }, t, n), t;
});