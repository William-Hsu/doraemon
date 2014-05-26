define([ "require", "tmpl!./settings_main.html", "tmpl!./tng/account_item.html", "mail_common", "api" ], function(e) {
    function t(e) {
        this.domNode = e, this.acctsSlice = i.viewAccounts(!1), this.acctsSlice.onsplice = this.onAccountsSplice.bind(this), 
        e.getElementsByClassName("tng-close-btn")[0].addEventListener("click", this.onClose.bind(this), !1), 
        this.accountsContainer = e.getElementsByClassName("tng-accounts-container")[0], 
        e.getElementsByClassName("tng-account-add")[0].addEventListener("click", this.onClickAddAccount.bind(this), !1), 
        this._secretButtonClickCount = 0, this._secretButtonTimer = null, e.getElementsByClassName("tng-email-lib-version")[0].addEventListener("click", this.onClickSecretButton.bind(this), !1);
    }
    var n = e("tmpl!./settings_main.html"), s = e("tmpl!./tng/account_item.html"), a = e("mail_common"), i = e("api"), o = a.Cards;
    return t.prototype = {
        nextCards: [ "setup_account_info", "settings_account" ],
        onClose: function() {
            o.removeCardAndSuccessors(this.domNode, "animate", 1, 1);
        },
        onAccountsSplice: function(e, t, n) {
            var a, i = this.accountsContainer;
            if (t) for (var o = e + t - 1; o >= e; o--) a = this.acctsSlice.items[o], i.removeChild(a.element);
            var c = e >= i.childElementCount ? null : i.children[e], d = this;
            n.forEach(function(e) {
                var t = e.element = s.cloneNode(!0);
                t.account = e, d.updateAccountDom(e, !0), i.insertBefore(t, c);
            });
        },
        updateAccountDom: function(e, t) {
            var n = e.element;
            if (t) {
                var s = n.getElementsByClassName("tng-account-item-label")[0];
                s.textContent = e.name, s.addEventListener("click", this.onClickEnterAccount.bind(this, e), !1);
            }
        },
        onClickAddAccount: function() {
            o.pushCard("setup_account_info", "default", "animate", {
                allowBack: !0
            }, "right");
        },
        onClickEnterAccount: function(e) {
            o.pushCard("settings_account", "default", "animate", {
                account: e
            }, "right");
        },
        onClickSecretButton: function() {
            null === this._secretButtonTimer && (this._secretButtonTimer = window.setTimeout(function() {
                this._secretButtonTimer = null, this._secretButtonClickCount = 0;
            }.bind(this), 2e3)), ++this._secretButtonClickCount >= 5 && (window.clearTimeout(this._secretButtonTimer), 
            this._secretButtonTimer = null, this._secretButtonClickCount = 0, o.pushCard("settings_debug", "default", "animate", {}, "right"));
        },
        die: function() {
            this.acctsSlice.die();
        }
    }, o.defineCardWithDefaultMode("settings_main", {
        tray: !1
    }, t, n), t;
});