define([ "require", "tmpl!./setup_account_info.html", "mail_common", "./setup_l10n_map", "evt", "l10n!", "model" ], function(e) {
    function t(e, t, n) {
        if (this.domNode = e, n.allowBack) {
            var s = e.getElementsByClassName("sup-back-btn")[0];
            s.addEventListener("click", this.onBack.bind(this), !1), s.classList.remove("collapsed");
        }
        this.nextButton = e.getElementsByClassName("sup-info-next-btn")[0], this.nextButton.addEventListener("click", this.onNext.bind(this), !1), 
        this.formNode = e.getElementsByClassName("sup-account-form")[0], this.nameNode = this.domNode.getElementsByClassName("sup-info-name")[0], 
        this.emailNode = this.domNode.getElementsByClassName("sup-info-email")[0], this.passwordNode = this.domNode.getElementsByClassName("sup-info-password")[0], 
        this.emailNode.addEventListener("input", this.onInfoInput.bind(this)), this.nameNode.addEventListener("input", this.onInfoInput.bind(this)), 
        this.passwordNode.addEventListener("input", this.onInfoInput.bind(this)), this.manualConfig = e.getElementsByClassName("sup-manual-config-btn")[0], 
        this.manualConfig.addEventListener("click", this.onClickManualConfig.bind(this)), 
        new l({
            formElem: e.getElementsByTagName("form")[0],
            onLast: this.onNext.bind(this)
        });
    }
    var n = e("tmpl!./setup_account_info.html"), s = e("mail_common"), a = e("./setup_l10n_map"), o = e("evt"), i = e("l10n!"), c = e("model"), d = s.Cards, l = s.FormNavigation;
    return t.prototype = {
        onBack: function() {
            c.foldersSlice ? d.removeCardAndSuccessors(this.domNode, "animate", 1) : o.emit("resetApp");
        },
        onNext: function(e) {
            e.preventDefault(), this.domNode.getElementsByClassName("sup-info-name")[0], this.domNode.getElementsByClassName("sup-info-email")[0], 
            this.domNode.getElementsByClassName("sup-info-password")[0], d.pushCard("setup_progress", "default", "animate", {
                displayName: this.nameNode.value,
                emailAddress: this.emailNode.value,
                password: this.passwordNode.value,
                callingCard: this
            }, "right");
        },
        onInfoInput: function() {
            this.nextButton.disabled = this.manualConfig.disabled = !this.formNode.checkValidity();
        },
        onClickManualConfig: function(e) {
            e.preventDefault(), d.pushCard("setup_manual_config", "default", "animate", {
                displayName: this.nameNode.value,
                emailAddress: this.emailNode.value,
                password: this.passwordNode.value
            }, "right");
        },
        showError: function(e, t) {
            this.domNode.getElementsByClassName("sup-error-region")[0].classList.remove("collapsed");
            var n = this.domNode.getElementsByClassName("sup-error-message")[0], s = this.domNode.getElementsByClassName("sup-error-code")[0], o = i.get(a.hasOwnProperty(e) ? a[e] : a.unknown, t);
            n.textContent = o;
            var c = e;
            t && t.status && (c += "(" + t.status + ")"), s.textContent = c, this.domNode.getElementsByClassName("scrollregion-below-header")[0].scrollTop = 0;
        },
        die: function() {}
    }, d.defineCardWithDefaultMode("setup_account_info", {
        tray: !1
    }, t, n), t;
});