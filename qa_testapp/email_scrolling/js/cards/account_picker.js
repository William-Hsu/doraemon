define([ "require", "tmpl!./account_picker.html", "tmpl!./fld/account_item.html", "date", "mail_common", "model" ], function(t) {
    function e(t, e, n) {
        this.domNode = t, this.curAccountId = n.curAccountId, this.acctsSlice = a.api.viewAccounts(!1), 
        this.acctsSlice.onsplice = this.onAccountsSplice.bind(this), this.acctsSlice.onchange = this.onAccountsChange.bind(this), 
        this.accountsContainer = t.getElementsByClassName("acct-list-container")[0], r(this.accountsContainer, "click", this.onClickAccount.bind(this)), 
        t.getElementsByClassName("fld-accounts-btn")[0].addEventListener("click", this.onHideAccounts.bind(this), !1), 
        t.getElementsByClassName("fld-nav-settings-btn")[0].addEventListener("click", this.onShowSettings.bind(this), !1);
    }
    var n = t("tmpl!./account_picker.html"), c = t("tmpl!./fld/account_item.html"), i = t("date"), o = t("mail_common"), a = t("model"), s = o.Cards, r = o.bindContainerHandler;
    return e.prototype = {
        nextCards: [ "settings_main" ],
        die: function() {
            this.acctsSlice.die();
        },
        onShowSettings: function() {
            s.pushCard("settings_main", "default", "animate", {}, "left");
        },
        onAccountsSplice: function(t, e, n) {
            var i, o = this.accountsContainer;
            if (e) for (var a = t + e - 1; a >= t; a--) i = this.acctsSlice.items[a], o.removeChild(i.element);
            var s = t >= o.childElementCount ? null : o.children[t];
            n.forEach(function(t) {
                var e = t.element = c.cloneNode(!0);
                e.account = t, this.updateAccountDom(t, !0), o.insertBefore(e, s), this.fetchLastSyncDate(t, e.querySelector(".fld-account-lastsync-value"));
            }.bind(this));
        },
        fetchLastSyncDate: function(t, e) {
            var n = a.api.viewFolders("account", t);
            n.oncomplete = function() {
                var t = n.getFirstFolderWithType("inbox"), c = t && t.lastSyncedAt;
                c && i.setPrettyNodeDate(e, c), n.die();
            }.bind(this);
        },
        onHideAccounts: function() {
            s.removeCardAndSuccessors(this.domNode, "animate", 1, [ "folder_picker", "navigation" ]);
        },
        onAccountsChange: function(t) {
            this.updateAccountDom(t, !1);
        },
        updateAccountDom: function(t, e) {
            var n = t.element;
            e && (n.getElementsByClassName("fld-account-name")[0].textContent = t.name), t.id === this.curAccountId ? n.classList.add("fld-account-selected") : n.classList.remove("fld-account-selected");
        },
        onClickAccount: function(t) {
            var e = this.curAccountId, n = this.curAccountId = t.account.id;
            e !== n && a.changeAccountFromId(n), this.onHideAccounts();
        }
    }, s.defineCard({
        name: "account_picker",
        modes: {
            navigation: {
                tray: !0
            },
            movetarget: {
                tray: !1
            }
        },
        constructor: e,
        templateNode: n
    }), e;
});