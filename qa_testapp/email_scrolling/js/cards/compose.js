define("tmpl!cards/compose.html", [ "tmpl" ], function(e) {
    return e.toDom('<div class="card-compose card">\n  <section class="cmp-compose-header" role="region">\n    <header>\n      <a href="#" class="cmp-back-btn">\n        <span class="icon icon-back">BacK</span>\n      </a>\n      <menu type="toolbar">\n        <a href="#" class="cmp-attachment-btn">\n          <span class="icon icon-attachment">AttachmenT</span>\n        </a>\n        <a href="#" class="cmp-send-btn">\n        <span class="icon icon-send">SenD</span>\n        </a>\n      </menu>\n      <h1 class="cmp-compose-header-label"\n        data-l10n-id="compose-header-short">ComposE MessagE</h1>\n    </header>\n  </section>\n  <div class="scrollregion-below-header">\n    <div class="cmp-envelope-bar">\n      <div class="cmp-envelope-line cmp-combo">\n        <span class="cmp-to-label cmp-addr-label"\n               data-l10n-id="compose-to">tO:</span>\n        <div class="cmp-to-container cmp-addr-container">\n          <div class="cmp-bubble-container">\n              <input class="cmp-to-text cmp-addr-text" type="email" />\n          </div>\n          <div class="cmp-to-add cmp-contact-add"></div>\n        </div>\n      </div>\n      <!-- XXX: spec calls for showing cc/bcc merged until selected,\n           but there is also the case where replying itself might need\n           to expand, so we are deferring that feature -->\n      <div class="cmp-envelope-line cmp-combo">\n        <span class="cmp-cc-label cmp-addr-label"\n               data-l10n-id="compose-cc">cC:</span>\n        <div class="cmp-cc-container cmp-addr-container">\n          <div class="cmp-bubble-container">\n            <input class="cmp-cc-text cmp-addr-text" type="email" />\n          </div>\n          <div class="cmp-cc-add cmp-contact-add"></div>\n        </div>\n      </div>\n      <div class="cmp-envelope-line cmp-combo">\n        <span class="cmp-bcc-label cmp-addr-label"\n               data-l10n-id="compose-bcc">BcC:</span>\n        <div class="cmp-bcc-container cmp-addr-container">\n          <div class="cmp-bubble-container">\n            <input class="cmp-bcc-text cmp-addr-text" type="email" />\n          </div>\n          <div class="cmp-bcc-add cmp-contact-add"></div>\n        </div>\n      </div>\n      <div class="cmp-envelope-line cmp-subject">\n        <span class="cmp-subject-label"\n               data-l10n-id="compose-subject">SubjecT:</span>\n        <input class="cmp-subject-text" type="text" />\n      </div>\n      <div class="cmp-envelope-line cmp-attachment-total collapsed">\n        <span class="cmp-attachment-label cmp-addr-label"\n               data-l10n-id="compose-attachments[zero]">AttachmentS:</span>\n        <span class="cmp-attachment-size"></span>\n      </div>\n      <ul class="cmp-attachment-container">\n      </ul>\n    </div>\n    <div class="cmp-body-text" contenteditable="true"></div>\n    <div class="cmp-body-html">\n    </div>\n  </div>\n</div>\n');
}), define("tmpl!cards/cmp/attachment_item.html", [ "tmpl" ], function(e) {
    return e.toDom('<li class="cmp-attachment-item">\n  <span class="cmp-attachment-icon"></span>\n  <span class="cmp-attachment-filename"></span>\n  <span class="cmp-attachment-filesize"></span>\n  <span class="cmp-attachment-remove"></span>\n</li>');
}), define("tmpl!cards/cmp/contact_menu.html", [ "tmpl" ], function(e) {
    return e.toDom('<form class="cmp-contact-menu" role="dialog" data-type="action">\n  <header></header>\n   <menu>\n     <button class="cmp-contact-menu-delete" data-l10n-id="message-edit-menu-delete">\n      DeletE\n    </button>\n     <button class="cmp-contact-menu-cancel" data-l10n-id="message-multiedit-cancel">\n      CanceL\n    </button>\n  </menu>\n</form>\n');
}), define("tmpl!cards/cmp/draft_menu.html", [ "tmpl" ], function(e) {
    return e.toDom('<form role="dialog" class="cmp-draft-menu" data-type="action">\n  <menu>\n    <button id="cmp-draft-save" data-l10n-id="compose-draft-save">SaVe DrAft</button>\n    <button id="cmp-draft-discard" class="danger" data-l10n-id="compose-discard-confirm">DisCarD</button>\n    <button id="cmp-draft-cancel" data-l10n-id="message-multiedit-cancel">CanCeL</button>\n  </menu>\n</form>');
}), define("tmpl!cards/cmp/peep_bubble.html", [ "tmpl" ], function(e) {
    return e.toDom('<div class="cmp-peep-bubble peep-bubble">\n  <span class="cmp-peep-name"></span>\n  <span class="cmp-peep-address collapsed"></span>\n</div>\n');
}), define("tmpl!cards/cmp/send_failed_confirm.html", [ "tmpl" ], function(e) {
    return e.toDom('<form role="dialog" class="cmp-send-failed-confirm" data-type="confirm">\n  <section>\n    <h1 data-l10n-id="confirm-dialog-title">ConfirmatioN</h1>\n    <p><span data-l10n-id="compose-send-message-failed"></span></p>\n  </section>\n  <menu>\n    <button id="cmp-send-failed-cancel" data-l10n-id="message-multiedit-cancel">CanceL</button>\n    <button id="cmp-send-failed-ok" class="recommend" data-l10n-id="dialog-button-ok">OK</button>\n  </menu>\n</form>');
}), define("tmpl!cards/cmp/sending_container.html", [ "tmpl" ], function(e) {
    return e.toDom('<form role="dialog" data-type="confirm" class="cmp-sending-container">\n  <section class="cmp-messages-sending">\n    <h1 data-l10n-id="compose-sending-message">Sending messagE</h1>\n    <p><progress></progress></p>\n  </section>\n</form>\n\n');
}), define("tmpl!cards/msg/attach_confirm.html", [ "tmpl" ], function(e) {
    return e.toDom('<form role="dialog" class="msg-attach-confirm" data-type="confirm">\n  <section>\n    <h1></h1>\n    <p></p>\n  </section>\n  <menu>\n    <button id="msg-attach-ok" class="full" data-l10n-id="dialog-button-ok">OK</button>\n  </menu>\n</form>');
}), define("marquee", [], function() {
    var e = {
        timingFunction: [ "linear", "ease" ],
        setup: function(e, t) {
            this._headerNode = t, this._headerWrapper = document.getElementById("marquee-h-wrapper"), 
            this._headerWrapper || (this._headerWrapper = document.createElement("div"), this._headerWrapper.id = "marquee-h-wrapper", 
            this._headerNode.appendChild(this._headerWrapper));
            var n = document.getElementById("marquee-h-text");
            n || (n = document.createElement("div"), n.id = "marquee-h-text", this._headerWrapper.appendChild(n)), 
            n.textContent = e;
        },
        activate: function(t, n) {
            if (this._headerNode && this._headerWrapper) {
                var s = t || "scroll", a = n || null, i = e.timingFunction.indexOf(a) >= 0 ? a : "linear", o = "marquee", c = document.getElementById("marquee-h-text");
                if (this._headerWrapper.clientWidth < this._headerWrapper.scrollWidth) switch (this._marqueeCssClassList = [], 
                s) {
                  case "scroll":
                    var d = o + "-rtl", r = this._headerWrapper.scrollWidth;
                    c.style.width = r + "px", c.classList.add(d + "-start-" + i), this._marqueeCssClassList.push(d + "-start-" + i);
                    var l = this;
                    c.addEventListener("animationend", function() {
                        c.classList.remove(d + "-start-" + i), this._marqueeCssClassList.pop();
                        var e = l._headerWrapper.clientWidth + "px";
                        c.style.transform = "translateX(" + e + ")", c.classList.add(d), this._marqueeCssClassList.push(d);
                    });
                    break;

                  case "alternate":
                    var d = o + "-alt-", r = this._headerWrapper.scrollWidth - this._headerWrapper.clientWidth;
                    c.style.width = r + "px", c.classList.add(d + i);
                } else {
                    if (!this._marqueeCssClassList) return;
                    for (var d in this._marqueeCssClassList) c.classList.remove(d);
                    c.style.transform = "";
                }
            }
        }
    };
    return e;
}), define("cards/compose", [ "require", "tmpl!./compose.html", "tmpl!./cmp/attachment_item.html", "tmpl!./cmp/contact_menu.html", "tmpl!./cmp/draft_menu.html", "tmpl!./cmp/peep_bubble.html", "tmpl!./cmp/send_failed_confirm.html", "tmpl!./cmp/sending_container.html", "tmpl!./msg/attach_confirm.html", "mail_common", "model", "iframe_shims", "marquee", "l10n!" ], function(e) {
    function t(e, t) {
        if (e.explicitOriginalTarget !== t) {
            e.stopPropagation();
            var n = t.getBoundingClientRect(), s = n.left + n.width / 2;
            t.focus();
            var a = 0;
            e.clientX >= s && (a = t.value.length), t.setSelectionRange(a, a);
        }
    }
    function n(e, n, s) {
        this.domNode = e, this.composer = s.composer, this.composerData = s.composerData || {}, 
        this.activity = s.activity, this.sending = !1, this.wifiLock = null, e.getElementsByClassName("cmp-back-btn")[0].addEventListener("click", this.onBack.bind(this), !1), 
        this.sendButton = e.getElementsByClassName("cmp-send-btn")[0], this.sendButton.addEventListener("click", this.onSend.bind(this), !1), 
        this._bound_onVisibilityChange = this.onVisibilityChange.bind(this), document.addEventListener("visibilitychange", this._bound_onVisibilityChange), 
        this.toNode = e.getElementsByClassName("cmp-to-text")[0], this.ccNode = e.getElementsByClassName("cmp-cc-text")[0], 
        this.bccNode = e.getElementsByClassName("cmp-bcc-text")[0], this.subjectNode = e.getElementsByClassName("cmp-subject-text")[0], 
        this.textBodyNode = e.getElementsByClassName("cmp-body-text")[0], this.htmlBodyContainer = e.getElementsByClassName("cmp-body-html")[0], 
        this.htmlIframeNode = null, this.scrollContainer = e.getElementsByClassName("scrollregion-below-header")[0], 
        this.toNode.addEventListener("keydown", this.onAddressKeydown.bind(this)), this.ccNode.addEventListener("keydown", this.onAddressKeydown.bind(this)), 
        this.bccNode.addEventListener("keydown", this.onAddressKeydown.bind(this)), this.toNode.addEventListener("input", this.onAddressInput.bind(this)), 
        this.ccNode.addEventListener("input", this.onAddressInput.bind(this)), this.bccNode.addEventListener("input", this.onAddressInput.bind(this));
        for (var a = e.getElementsByClassName("cmp-contact-add"), i = 0; i < a.length; i++) a[i].addEventListener("click", this.onContactAdd.bind(this));
        for (var o = e.getElementsByClassName("cmp-combo"), i = 0; i < o.length; i++) o[i].addEventListener("click", this.onContainerClick.bind(this));
        for (var c = e.getElementsByClassName("cmp-attachment-btn"), i = 0; i < c.length; i++) c[i].addEventListener("click", this.onAttachmentAdd.bind(this));
        var d = e.querySelector(".cmp-subject");
        if (d.addEventListener("click", function(e) {
            t(e, d.querySelector("input"));
        }), this.scrollContainer.addEventListener("click", function(e) {
            var t = this.textBodyNode.getBoundingClientRect();
            e.clientY > t.bottom && this._focusEditorWithCursorAtEnd(e);
        }.bind(this)), this.htmlBodyContainer.addEventListener("click", this._focusEditorWithCursorAtEnd.bind(this)), 
        this._selfClosed = !1, this.sentAudioKey = "mail.sent-sound.enabled", this.sentAudio = new Audio("/sounds/sent.ogg"), 
        this.sentAudio.mozAudioChannelType = "notification", this.sentAudioEnabled = !1, 
        navigator.mozSettings) {
            var r = navigator.mozSettings.createLock().get(this.sentAudioKey);
            r.onsuccess = function() {
                this.sentAudioEnabled = r.result[this.sentAudioKey];
            }.bind(this), navigator.mozSettings.addObserver(this.sentAudioKey, function(e) {
                this.sentAudioEnabled = e.settingValue;
            }.bind(this));
        }
    }
    var s = e("tmpl!./compose.html"), a = e("tmpl!./cmp/attachment_item.html"), i = e("tmpl!./cmp/contact_menu.html"), o = e("tmpl!./cmp/draft_menu.html"), c = e("tmpl!./cmp/peep_bubble.html"), d = (e("tmpl!./cmp/send_failed_confirm.html"), 
    e("tmpl!./cmp/sending_container.html")), r = e("tmpl!./msg/attach_confirm.html"), l = e("mail_common"), m = e("model"), h = e("iframe_shims"), p = e("marquee"), u = e("l10n!"), f = l.prettyFileSize, v = l.Cards, b = l.ConfirmDialog, g = 512e4;
    return n.prototype = {
        _focusEditorWithCursorAtEnd: function(e) {
            e && e.stopPropagation();
            var t = this.textBodyNode.lastChild, n = document.createRange();
            n.setStartAfter(t), n.setEndAfter(t), this.textBodyNode.focus();
            var s = window.getSelection();
            s.removeAllRanges(), s.addRange(n);
        },
        populateEditor: function(e) {
            for (var t = e.split("\n"), n = document.createDocumentFragment(), s = 0, a = t.length; a > s; s++) s && n.appendChild(document.createElement("br")), 
            n.appendChild(document.createTextNode(t[s]));
            this.textBodyNode.appendChild(n);
        },
        fromEditor: function() {
            for (var e = "", t = this.textBodyNode.childNodes.length, n = 0; t > n; n++) {
                var s = this.textBodyNode.childNodes[n];
                e += "BR" === s.nodeName && "_moz" !== s.getAttribute("type") ? "\n" : s.textContent;
            }
            return e;
        },
        postInsert: function() {
            e([ "iframe_shims" ], function() {
                if (this.composer) this._loadStateFromComposer(); else {
                    var e = this.composerData;
                    m.latestOnce("folder", function(t) {
                        this.composer = m.api.beginMessageComposition(e.message, t, e.options, function() {
                            e.onComposer && e.onComposer(this.composer), this._loadStateFromComposer();
                        }.bind(this));
                    }.bind(this));
                }
            }.bind(this));
        },
        _loadStateFromComposer: function() {
            function e(e, n) {
                return n ? (e.parentNode, n.map(function(n) {
                    var s, a;
                    "string" == typeof n ? s = a = n : (s = n.name, a = n.address), t.insertBubble(e, s, a);
                }), void 0) : "";
            }
            var t = this;
            if (e(this.toNode, this.composer.to), e(this.ccNode, this.composer.cc), e(this.bccNode, this.composer.bcc), 
            this.isEmptyAddress() && this.sendButton.setAttribute("aria-disabled", "true"), 
            this.insertAttachments(), this.subjectNode.value = this.composer.subject, this.populateEditor(this.composer.body.text), 
            this.composer.body.html) {
                var n = h.createAndInsertIframeForContent(this.composer.body.html, this.scrollContainer, this.htmlBodyContainer, null, "noninteractive", null);
                this.htmlIframeNode = n.iframe;
            }
        },
        _saveStateToComposer: function() {
            function e(e) {
                for (var t = e.parentNode, n = [], s = t.querySelectorAll(".cmp-peep-bubble"), a = 0; a < s.length; a++) {
                    var i = s[a].dataset;
                    n.push({
                        name: i.name,
                        address: i.address
                    });
                }
                if (0 !== e.value.trim().length) {
                    var o = m.api.parseMailbox(e.value);
                    n.push({
                        name: o.name,
                        address: o.address
                    });
                }
                return n;
            }
            this.composer.to = e(this.toNode), this.composer.cc = e(this.ccNode), this.composer.bcc = e(this.bccNode), 
            this.composer.subject = this.subjectNode.value, this.composer.body.text = this.fromEditor();
        },
        _closeCard: function() {
            this._selfClosed = !0, v.removeCardAndSuccessors(this.domNode, "animate");
        },
        _saveNeeded: function() {
            var e = this, t = function() {
                var t = e.domNode.querySelectorAll(".cmp-peep-bubble");
                return 0 !== t.length || e.toNode.value || e.ccNode.value || e.bccNode.value ? !1 : !0;
            };
            return this.composer ? this.subjectNode.value || this.textBodyNode.textContent || !t() || this.composer.attachments.length || this.composer.hasDraft : !1;
        },
        _saveDraft: function(e, t) {
            return this.sending && "automatic" === e ? (console.log("compose: skipping autosave because send in progress"), 
            void 0) : (this._saveStateToComposer(), this.composer.saveDraft(t), void 0);
        },
        createBubbleNode: function(e, t) {
            var n = c.cloneNode(!0);
            n.classList.add("peep-bubble"), n.classList.add("msg-peep-bubble"), n.setAttribute("data-address", t), 
            n.querySelector(".cmp-peep-address").textContent = t;
            var s = n.querySelector(".cmp-peep-name");
            return e ? (s.textContent = e, n.setAttribute("data-name", e)) : s.textContent = -1 !== t.indexOf("@") ? t.split("@")[0] : t, 
            n;
        },
        insertBubble: function(e, t, n) {
            var s = e.parentNode, a = this.createBubbleNode(t || n, n);
            s.insertBefore(a, e);
        },
        deleteBubble: function(e) {
            if (e) {
                var t = e.parentNode;
                e.classList.contains("cmp-peep-bubble") && t.removeChild(e), this.isEmptyAddress() && this.sendButton.setAttribute("aria-disabled", "true");
            }
        },
        isEmptyAddress: function() {
            var e = this.toNode.value + this.ccNode.value + this.bccNode.value, t = this.domNode.getElementsByClassName("cmp-envelope-bar")[0], n = t.querySelectorAll(".cmp-peep-bubble");
            return e.replace(/\s/g, "") || 0 !== n.length ? !1 : !0;
        },
        onAddressKeydown: function(e) {
            var t = e.target;
            if (e.target.parentNode, 8 === e.keyCode && "" === t.value) {
                var n = t.previousElementSibling;
                this.deleteBubble(n), this.isEmptyAddress() && this.sendButton.setAttribute("aria-disabled", "true");
            }
        },
        onAddressInput: function(e) {
            var t = e.target;
            if (e.target.parentNode, this.isEmptyAddress()) return this.sendButton.setAttribute("aria-disabled", "true"), 
            void 0;
            this.sendButton.setAttribute("aria-disabled", "false");
            var n = !1;
            switch (t.value.slice(-1)) {
              case " ":
                n = -1 !== t.value.indexOf("@");
                break;

              case ",":
              case ";":
                n = !0;
            }
            if (n) {
                t.style.width = "0.5rem";
                var s = m.api.parseMailbox(t.value);
                this.insertBubble(t, s.name, s.address), t.value = "";
            }
            if (!this.stringContainer) {
                this.stringContainer = document.createElement("div"), this.domNode.appendChild(this.stringContainer);
                var a = window.getComputedStyle(t);
                this.stringContainer.style.fontSize = a.fontSize;
            }
            this.stringContainer.style.display = "inline-block", this.stringContainer.textContent = t.value, 
            t.style.width = this.stringContainer.clientWidth + 2 + "px";
        },
        onContainerClick: function(e) {
            var n = e.target;
            if (n.classList.contains("cmp-peep-bubble")) {
                var s = i.cloneNode(!0), a = n.querySelector(".cmp-peep-address").textContent, o = s.getElementsByTagName("header")[0];
                p.setup(a, o), document.body.appendChild(s), p.activate("alternate", "ease");
                var c = function(e) {
                    switch (document.body.removeChild(s), e.explicitOriginalTarget.className) {
                      case "cmp-contact-menu-delete":
                        this.deleteBubble(n);
                        break;

                      case "cmp-contact-menu-cancel":                    }
                    return !1;
                }.bind(this);
                return s.addEventListener("submit", c), void 0;
            }
            var d = e.currentTarget.getElementsByClassName("cmp-addr-text")[0];
            t(e, d);
        },
        insertAttachments: function() {
            var e = this.domNode.getElementsByClassName("cmp-attachment-container")[0];
            if (this.composer.attachments && this.composer.attachments.length) {
                e.innerHTML = "";
                for (var t = a, n = t.getElementsByClassName("cmp-attachment-filename")[0], s = t.getElementsByClassName("cmp-attachment-filesize")[0], i = 0, o = 0; o < this.composer.attachments.length; o++) {
                    var c = this.composer.attachments[o];
                    if (i + c.blob.size > g) {
                        for (;this.composer.attachments.length > o; ) this.composer.removeAttachment(this.composer.attachments[o]);
                        var d = r.cloneNode(!0), l = d.getElementsByTagName("h1")[0], m = d.getElementsByTagName("p")[0];
                        return this.composer.attachments.length > 0 ? (l.textContent = u.get("composer-attachments-large"), 
                        m.textContent = u.get("compose-attchments-size-exceeded")) : (l.textContent = u.get("composer-attachment-large"), 
                        m.textContent = u.get("compose-attchment-size-exceeded")), b.show(d, {
                            id: "msg-attach-ok",
                            handler: function() {
                                this.updateAttachmentsSize();
                            }.bind(this)
                        }), void 0;
                    }
                    i += c.blob.size, n.textContent = c.name, s.textContent = f(c.blob.size);
                    var h = t.cloneNode(!0);
                    e.appendChild(h), h.getElementsByClassName("cmp-attachment-remove")[0].addEventListener("click", this.onClickRemoveAttachment.bind(this, h, c));
                }
                this.updateAttachmentsSize(), e.classList.remove("collapsed");
            } else e.classList.add("collapsed");
        },
        updateAttachmentsSize: function() {
            var e = this.domNode.getElementsByClassName("cmp-attachment-label")[0], t = this.domNode.getElementsByClassName("cmp-attachment-total")[0], n = this.domNode.getElementsByClassName("cmp-attachment-size")[0];
            if (e.textContent = u.get("compose-attachments", {
                n: this.composer.attachments.length
            }), 0 === this.composer.attachments.length) {
                n.textContent = "";
                var s = this.domNode.getElementsByClassName("cmp-attachment-container")[0];
                s.classList.add("collapsed");
            } else {
                for (var a = 0, i = 0; i < this.composer.attachments.length; i++) a += this.composer.attachments[i].blob.size;
                n.textContent = f(a);
            }
            this.composer.attachments.length > 1 ? t.classList.remove("collapsed") : t.classList.add("collapsed");
        },
        onClickRemoveAttachment: function(e, t) {
            e.parentNode.removeChild(e), this.composer.removeAttachment(t), this.updateAttachmentsSize();
        },
        onBack: function() {
            var e = function() {
                this.activity && (this.activity.postError("cancelled"), this.activity = null), this._closeCard();
            }.bind(this);
            if (!this._saveNeeded()) return console.log("compose: back: no save needed, exiting without prompt"), 
            e(), void 0;
            console.log("compose: back: save needed, prompting");
            var t = o.cloneNode(!0);
            this._savePromptMenu = t, document.body.appendChild(t);
            var n = function(n) {
                switch (document.body.removeChild(t), this._savePromptMenu = null, n.explicitOriginalTarget.id) {
                  case "cmp-draft-save":
                    console.log("compose: explicit draft save on exit"), this._saveDraft("explicit"), 
                    e();
                    break;

                  case "cmp-draft-discard":
                    console.log("compose: explicit draft discard on exit"), this.composer.abortCompositionDeleteDraft(), 
                    e();
                    break;

                  case "cmp-draft-cancel":
                    console.log("compose: canceled compose exit");
                }
                return !1;
            }.bind(this);
            t.addEventListener("submit", n);
        },
        onVisibilityChange: function() {
            document.hidden && this._saveNeeded() && (console.log("compose: autosaving; we became hidden and save needed."), 
            this._saveDraft("automatic"));
        },
        releaseLocks: function() {
            this.wifiLock && (this.wifiLock.unlock(), this.wifiLock = null);
        },
        onSend: function() {
            this.releaseLocks(), navigator.requestWakeLock && (this.wifiLock = navigator.requestWakeLock("wifi")), 
            this._saveStateToComposer();
            var e = this, t = this.activity, n = this.domNode, s = d;
            n.appendChild(s), this.sending = !0, console.log("compose: initiating send"), this.composer.finishCompositionSendMessage(function(a) {
                if (this.composer) {
                    console.log("compose: callback triggered, err:", a), this.releaseLocks();
                    var i = function() {
                        t && (t.postResult("complete"), t = null);
                    };
                    if (n.removeChild(s), a) return this.sending = !1, alert(u.get("compose-send-message-failed")), 
                    void 0;
                    e.sentAudioEnabled && e.sentAudio.play(), i(), this._closeCard();
                }
            }.bind(this));
        },
        onContactAdd: function(e) {
            e.stopPropagation();
            var t = e.target, n = this;
            t.classList.remove("show");
            try {
                var s = new MozActivity({
                    name: "pick",
                    data: {
                        type: "webcontacts/email"
                    }
                });
                s.onsuccess = function() {
                    if (this.result.email) {
                        var e = t.parentElement.querySelector(".cmp-addr-text"), s = this.result.name;
                        Array.isArray(s) && (s = s[0]), n.insertBubble(e, s, this.result.email), n.sendButton.setAttribute("aria-disabled", "false");
                    }
                };
            } catch (a) {
                console.log("WebActivities unavailable? : " + a);
            }
        },
        onAttachmentAdd: function(t) {
            t.stopPropagation();
            try {
                console.log("compose: attach: triggering web activity");
                var n = new MozActivity({
                    name: "pick",
                    data: {
                        type: [ "image/*", "video/*", "audio/*" ],
                        nocrop: !0
                    }
                });
                n.onsuccess = function() {
                    e([ "attachment_name" ], function(e) {
                        var t = n.result.blob, s = n.result.blob.name || n.result.name, a = this.composer.attachments.length + 1;
                        s = e.ensureName(t, s, a), console.log("compose: attach activity success:", s), 
                        s = s.substring(s.lastIndexOf("/") + 1), this.composer.addAttachment({
                            name: s,
                            blob: n.result.blob
                        }), this.insertAttachments();
                    }.bind(this));
                }.bind(this);
            } catch (s) {
                console.log("WebActivities unavailable? : " + s);
            }
        },
        die: function() {
            document.removeEventListener("visibilitychange", this._bound_onVisibilityChange), 
            this._savePromptMenu && (document.body.removeChild(this._savePromptMenu), this._savePromptMenu = null), 
            !this._selfClosed && this._saveNeeded() && (console.log("compose: autosaving draft because not self-closed"), 
            this._saveDraft("automatic")), this.releaseLocks(), this.composer && (this.composer.die(), 
            this.composer = null);
        }
    }, v.defineCardWithDefaultMode("compose", {}, n, s), n;
});