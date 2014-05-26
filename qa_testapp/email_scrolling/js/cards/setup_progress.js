define([ "require", "tmpl!./setup_progress.html", "mail_common", "model", "api" ], function(e) {
    function t(e, t, n) {
        this.domNode = e, this.callingCard = n.callingCard;
        var s = e.getElementsByClassName("sup-back-btn")[0];
        s.addEventListener("click", this.onBack.bind(this), !1);
        var o = this;
        this.creationInProcess = !0, a.tryToCreateAccount({
            displayName: n.displayName,
            emailAddress: n.emailAddress,
            password: n.password
        }, n.domainInfo || null, function(e, t, n) {
            o.creationInProcess = !1, e ? o.onCreationError(e, t) : o.onCreationSuccess(n);
        });
    }
    var n = e("tmpl!./setup_progress.html"), s = e("mail_common"), a = (e("model"), 
    e("api")), o = s.Cards;
    return t.prototype = {
        cancelCreation: function() {
            !this.creationInProcess;
        },
        onBack: function(e) {
            e.preventDefault(), this.cancelCreation(), o.removeCardAndSuccessors(this.domNode, "animate", 1);
        },
        onCreationError: function(e, t) {
            this.callingCard.showError(e, t), o.removeCardAndSuccessors(this.domNode, "animate", 1);
        },
        onCreationSuccess: function(e) {
            o.pushCard("setup_account_prefs", "default", "animate", {
                account: e
            });
        },
        die: function() {
            this.cancelCreation();
        }
    }, o.defineCardWithDefaultMode("setup_progress", {
        tray: !1
    }, t, n), t;
});