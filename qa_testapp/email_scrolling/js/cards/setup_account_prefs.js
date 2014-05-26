define([ "require", "tmpl!./setup_account_prefs.html", "./account_prefs_mixins", "mix", "mail_common" ], function(e) {
    function t(e, t, n) {
        this.domNode = e, this.account = n.account, this.nextButton = this.nodeFromClass("sup-info-next-btn"), 
        this.nextButton.addEventListener("click", this.onNext.bind(this), !1), this._bindPrefs("tng-account-check-interval", "tng-notify-mail");
    }
    var n = e("tmpl!./setup_account_prefs.html"), s = e("./account_prefs_mixins"), a = e("mix"), o = e("mail_common"), i = o.Cards;
    return t.prototype = {
        onNext: function() {
            i.pushCard("setup_done", "default", "animate", {});
        },
        die: function() {}
    }, a(t.prototype, s), i.defineCardWithDefaultMode("setup_account_prefs", {
        tray: !1
    }, t, n), t;
});