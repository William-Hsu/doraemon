define([ "require", "tmpl!./setup_fix_gmail_twofactor.html", "mail_common", "./setup_fix_password" ], function(e) {
    var t = e("tmpl!./setup_fix_gmail_twofactor.html"), n = e("mail_common"), s = e("./setup_fix_password"), a = n.Cards;
    return a.defineCardWithDefaultMode("setup_fix_gmail_twofactor", {
        tray: !1
    }, s, t), s;
});