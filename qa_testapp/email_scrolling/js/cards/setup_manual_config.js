define([ "require", "tmpl!./setup_manual_config.html", "mail_common", "./setup_account_info" ], function(e) {
    function t(e, t, s) {
        this.domNode = e;
        var n = e.getElementsByClassName("sup-back-btn")[0];
        n.addEventListener("click", this.onBack.bind(this), !1), this.nextButton = e.getElementsByClassName("sup-manual-next-btn")[0], 
        this.nextButton.addEventListener("click", this.onNext.bind(this), !1), this.formNode = e.getElementsByClassName("sup-manual-form")[0], 
        this.accountTypeNode = e.getElementsByClassName("sup-manual-account-type")[0], this.accountTypeNode.addEventListener("change", this.onChangeAccountType.bind(this), !1), 
        this.formItems = {
            common: {},
            composite: {},
            smtp: {},
            activeSync: {}
        }, this.formItems.common.displayName = e.getElementsByClassName("sup-info-name")[0], 
        this.formItems.common.displayName.value = s.displayName, this.formItems.common.emailAddress = e.getElementsByClassName("sup-info-email")[0], 
        this.formItems.common.emailAddress.value = s.emailAddress, this.formItems.common.password = e.getElementsByClassName("sup-info-password")[0], 
        this.formItems.common.password.value = s.password, this.formItems.common.passwordWrapper = e.getElementsByClassName("sup-manual-password-wrapper")[0], 
        this.formItems.composite.hostname = e.getElementsByClassName("sup-manual-composite-hostname")[0], 
        this.formItems.composite.port = e.getElementsByClassName("sup-manual-composite-port")[0], 
        this.formItems.composite.socket = e.getElementsByClassName("sup-manual-composite-socket")[0], 
        this.formItems.composite.username = e.getElementsByClassName("sup-manual-composite-username")[0], 
        this.formItems.composite.username.value = s.emailAddress, this.formItems.composite.password = e.getElementsByClassName("sup-manual-composite-password")[0], 
        this.formItems.composite.password.value = s.password, this.formItems.smtp.hostname = e.getElementsByClassName("sup-manual-smtp-hostname")[0], 
        this.formItems.smtp.port = e.getElementsByClassName("sup-manual-smtp-port")[0], 
        this.formItems.smtp.socket = e.getElementsByClassName("sup-manual-smtp-socket")[0], 
        this.formItems.smtp.username = e.getElementsByClassName("sup-manual-smtp-username")[0], 
        this.formItems.smtp.username.value = s.emailAddress, this.formItems.smtp.password = e.getElementsByClassName("sup-manual-smtp-password")[0], 
        this.formItems.smtp.password.value = s.password, this.formItems.activeSync.hostname = e.getElementsByClassName("sup-manual-activesync-hostname")[0], 
        this.formItems.activeSync.username = e.getElementsByClassName("sup-manual-activesync-username")[0], 
        this.changeIfSame(this.formItems.common.emailAddress, [ this.formItems.composite.username, this.formItems.smtp.username ]), 
        this.changeIfSame(this.formItems.composite.username, [ this.formItems.smtp.username ]), 
        this.changeIfSame(this.formItems.composite.password, [ this.formItems.smtp.password ]);
        for (var a in this.formItems) for (var o in this.formItems[a]) "INPUT" === this.formItems[a][o].tagName && this.formItems[a][o].addEventListener("input", this.onInfoInput.bind(this));
        this.requireFields("composite", !0), this.requireFields("smtp", !0), this.requireFields("activeSync", !1), 
        this.formItems.composite.socket.addEventListener("change", this.onChangeCompositeSocket.bind(this)), 
        this.formItems.smtp.socket.addEventListener("change", this.onChangeSmtpSocket.bind(this)), 
        this.onChangeAccountType({
            target: this.accountTypeNode
        }), new i({
            formElem: this.formNode,
            onLast: this.onNext.bind(this)
        });
    }
    var s = e("tmpl!./setup_manual_config.html"), n = e("mail_common"), a = e("./setup_account_info"), o = n.Cards, i = n.FormNavigation;
    return t.prototype = {
        onBack: function() {
            o.removeCardAndSuccessors(this.domNode, "animate", 1);
        },
        onNext: function(e) {
            e.preventDefault();
            var t = {
                type: this.accountTypeNode.value
            };
            "imap+smtp" === t.type || "pop3+smtp" === t.type ? (t.incoming = {
                hostname: this.formItems.composite.hostname.value,
                port: this.formItems.composite.port.value,
                socketType: this.formItems.composite.socket.value,
                username: this.formItems.composite.username.value,
                password: this.formItems.composite.password.value
            }, t.outgoing = {
                hostname: this.formItems.smtp.hostname.value,
                port: this.formItems.smtp.port.value,
                socketType: this.formItems.smtp.socket.value,
                username: this.formItems.smtp.username.value,
                password: this.formItems.smtp.password.value
            }) : t.incoming = {
                server: "https://" + this.formItems.activeSync.hostname.value,
                username: this.formItems.activeSync.username.value
            }, this.pushSetupCard(t);
        },
        pushSetupCard: function(e) {
            var t;
            t = "activesync" === this.accountTypeNode.value ? this.formItems.common.password.value : this.formItems.composite.password.value, 
            o.pushCard("setup_progress", "default", "animate", {
                displayName: this.formItems.common.displayName.value,
                emailAddress: this.formItems.common.emailAddress.value,
                password: t,
                domainInfo: e,
                callingCard: this
            }, "right");
        },
        onInfoInput: function() {
            this.nextButton.disabled = !this.formNode.checkValidity();
        },
        changeIfSame: function(e, t) {
            e._previousValue = e.value, e.addEventListener("input", function(s) {
                for (var n = 0; n < t.length; n++) {
                    var a = t[n];
                    a.value === s.target._previousValue && (a.value = a._previousValue = s.target.value);
                }
                e._previousValue = s.target.value, this.onInfoInput();
            }.bind(this));
        },
        onChangeAccountType: function(e) {
            var t = this.domNode.getElementsByClassName("sup-manual-composite")[0], s = this.domNode.getElementsByClassName("sup-manual-activesync")[0], n = "imap+smtp" === e.target.value || "pop3+smtp" === e.target.value, a = "imap+smtp" === e.target.value;
            n ? (t.classList.remove("collapsed"), s.classList.add("collapsed"), this.domNode.getElementsByClassName("sup-manual-imap-title")[0].classList.toggle("collapsed", !a), 
            this.domNode.getElementsByClassName("sup-manual-pop3-title")[0].classList.toggle("collapsed", a)) : (t.classList.add("collapsed"), 
            s.classList.remove("collapsed")), this.formItems.common.passwordWrapper.classList.toggle("collapsed", n), 
            this.requireFields("composite", n), this.requireFields("smtp", n), this.requireFields("activeSync", !n), 
            this.onChangeCompositeSocket({
                target: this.formItems.composite.socket
            });
        },
        onChangeCompositeSocket: function(e) {
            var t = "imap+smtp" === this.accountTypeNode.value, s = t ? "993" : "995", n = t ? "143" : "110", a = e.target.value, o = this.formItems.composite.port;
            "SSL" === a ? o.value = s : "STARTTLS" == a && (o.value = n);
        },
        onChangeSmtpSocket: function(e) {
            const t = "465", s = "587";
            var n = e.target.value, a = this.formItems.smtp.port;
            "SSL" === n && a.value === s ? a.value = t : "STARTTLS" == n && a.value == t && (a.value = s);
        },
        requireFields: function(e, t) {
            for (var s in this.formItems[e]) {
                var n = this.formItems[e][s];
                n.hasAttribute("data-maybe-required") && (t ? n.setAttribute("required", "") : n.removeAttribute("required"));
            }
        },
        showError: a.prototype.showError,
        die: function() {}
    }, o.defineCardWithDefaultMode("setup_manual_config", {
        tray: !1
    }, t, s), t;
});