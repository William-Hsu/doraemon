define([ "require", "tmpl!./setup_fix_password.html", "mail_common", "l10n!" ], function(e) {
    function t(e, t, n) {
        this.domNode = e, this.account = n.account, this.whichSide = n.whichSide, this.restoreCard = n.restoreCard;
        var s = e.getElementsByClassName("sup-bad-password-account")[0], i = this.account.type;
        if ("imap+smtp" === i || "pop3+smtp" === i) {
            var o = null;
            o = "incoming" === this.whichSide ? "imap+smtp" === i ? "settings-account-clarify-imap" : "settings-account-clarify-pop3" : "settings-account-clarify-smtp", 
            a.localize(s, o, {
                "account-name": this.account.name
            });
        }
        var c = e.getElementsByClassName("sup-use-password-btn")[0];
        c.addEventListener("click", this.onUsePassword.bind(this), !1), this.passwordNode = this.domNode.getElementsByClassName("sup-info-password")[0];
    }
    var n = e("tmpl!./setup_fix_password.html"), s = e("mail_common"), a = e("l10n!"), i = s.Cards;
    return t.prototype = {
        onUsePassword: function() {
            var e = this.passwordNode.value;
            e ? this.account.modifyAccount("incoming" === this.whichSide ? {
                password: e
            } : {
                outgoingPassword: e
            }, this.proceed.bind(this)) : this.proceed();
        },
        proceed: function() {
            this.account.clearProblems(), i.removeCardAndSuccessors(this.domNode, "animate", 1, this.restoreCard);
        },
        die: function() {}
    }, i.defineCardWithDefaultMode("setup_fix_password", {
        tray: !1
    }, t, n), t;
});