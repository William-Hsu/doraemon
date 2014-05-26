define([ "require", "tmpl!./settings_account_servers.html", "mail_common", "l10n!" ], function(e) {
    function t(e, t, n) {
        this.domNode = e, this.account = n.account, this.server = n.account.servers[n.index], 
        e.getElementsByClassName("tng-account-connInfo-container")[0], e.getElementsByClassName("tng-account-header-label")[0].textContent = this.account.name, 
        e.getElementsByClassName("tng-back-btn")[0].addEventListener("click", this.onBack.bind(this), !1), 
        e.getElementsByClassName("tng-account-save")[0].addEventListener("click", this.onBack.bind(this), !1), 
        e.getElementsByClassName("tng-account-server-label")[0].textContent = a.get("settings-" + this.server.type + "-label");
        var s = this.domNode.getElementsByClassName("tng-server-hostname-input")[0], o = this.domNode.getElementsByClassName("tng-server-port-input")[0];
        s.value = this.server.connInfo.hostname || this.server.connInfo.server, o.value = this.server.connInfo.port || "";
    }
    var n = e("tmpl!./settings_account_servers.html"), s = e("mail_common"), a = e("l10n!"), o = s.Cards;
    return t.prototype = {
        onBack: function() {
            o.removeCardAndSuccessors(this.domNode, "animate", 1);
        },
        die: function() {}
    }, o.defineCardWithDefaultMode("settings_account_servers", {
        tray: !1
    }, t, n), t;
});