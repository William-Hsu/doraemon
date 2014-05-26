define([ "require", "tmpl!./setup_fix_gmail.html", "mail_common", "l10n!" ], function(e) {
    function t(e, t, n) {
        this.domNode = e, this.account = n.account, this.restoreCard = n.restoreCard, this.getElement("sup-gmail-account").textContent = this.account.name;
        var s = {
            "sup-account-header-label": "setup-gmail-{ACCOUNT_TYPE}-header",
            "sup-enable-label": "setup-gmail-{ACCOUNT_TYPE}-message",
            "sup-dismiss-btn": "setup-gmail-{ACCOUNT_TYPE}-retry"
        }, i = "imap+smtp" === this.account.type ? "imap" : "pop3";
        for (var o in s) {
            var c = s[o].replace("{ACCOUNT_TYPE}", i);
            a.localize(this.getElement(o), c);
        }
        this.getElement("sup-dismiss-btn").addEventListener("click", this.onDismiss.bind(this), !1);
    }
    var n = e("tmpl!./setup_fix_gmail.html"), s = e("mail_common"), a = e("l10n!"), i = s.Cards;
    return t.prototype = {
        die: function() {},
        getElement: function(e) {
            return this.domNode.getElementsByClassName(e)[0];
        },
        onDismiss: function() {
            this.account.clearProblems(), i.removeCardAndSuccessors(this.domNode, "animate", 1, this.restoreCard);
        }
    }, i.defineCardWithDefaultMode("setup_fix_gmail", {
        tray: !1
    }, t, n), t;
});