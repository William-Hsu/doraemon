define([ "require", "tmpl!./setup_done.html", "mail_common", "model", "evt" ], function(e) {
    function t(e) {
        e.getElementsByClassName("sup-add-another-account-btn")[0].addEventListener("click", this.onAddAnother.bind(this), !1), 
        e.getElementsByClassName("sup-show-mail-btn")[0].addEventListener("click", this.onShowMail.bind(this), !1);
    }
    var n = e("tmpl!./setup_done.html"), s = e("mail_common"), a = (e("model"), e("evt")), o = s.Cards;
    return t.prototype = {
        onAddAnother: function() {
            a.emit("addAccount");
        },
        onShowMail: function() {
            a.emit("showLatestAccount");
        },
        die: function() {}
    }, o.defineCardWithDefaultMode("setup_done", {
        tray: !1
    }, t, n), t;
});