define([ "require", "tmpl!./settings_account_credentials.html", "mail_common", "l10n!" ], function(e) {
    function t(e, t, n) {
        this.domNode = e, this.account = n.account, e.getElementsByClassName("tng-account-connInfo-container")[0], 
        e.getElementsByClassName("tng-account-header-label")[0].textContent = this.account.name, 
        e.getElementsByClassName("tng-back-btn")[0].addEventListener("click", this.onBack.bind(this), !1), 
        e.getElementsByClassName("tng-account-save")[0].addEventListener("click", this.onClickSave.bind(this), !1);
        var s = this.domNode.getElementsByClassName("tng-server-username-input")[0];
        this.passwordNodeInput = this.domNode.getElementsByClassName("tng-server-password-input")[0], 
        s.value = this.account.username;
    }
    var n = e("tmpl!./settings_account_credentials.html"), s = e("mail_common"), a = e("l10n!"), o = s.Cards;
    return t.prototype = {
        onBack: function() {
            o.removeCardAndSuccessors(this.domNode, "animate", 1);
        },
        onClickSave: function() {
            var e = this.passwordNodeInput.value;
            e ? (this.account.modifyAccount({
                password: e
            }), this.account.clearProblems()) : alert(a.get("settings-password-empty")), this.onBack();
        },
        die: function() {}
    }, o.defineCardWithDefaultMode("settings_account_credentials", {
        tray: !1
    }, t, n), t;
});