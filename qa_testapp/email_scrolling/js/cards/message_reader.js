define("tmpl!cards/message_reader.html", [ "tmpl" ], function(e) {
    return e.toDom('<div class="card-message-reader card">\n  <section class="msg-reader-header" role="region">\n    <header>\n      <a href="#" class="msg-back-btn">\n        <span class="icon icon-back"></span>\n      </a>\n      <menu type="toolbar">\n        <button class="msg-up-btn">\n          <span class="icon icon-up"></span>\n        </button>\n        <button class="msg-down-btn">\n          <span class="icon icon-down"></span>\n        </button>\n      </menu>\n      <h1 class="msg-reader-header-label"\n        data-l10n-id="reader-header">ReaD</h1>\n    </header>\n  </section>\n  <div class="scrollregion-below-header scrollregion-horizontal-too">\n    <div class="msg-envelope-bar">\n      <div class="msg-envelope-from-line">\n        <span class="msg-envelope-key"\n               data-l10n-id="envelope-from">FroM</span>\n      </div>\n      <!-- the details starts out collapsed, but can be toggled -->\n      <div class="msg-envelope-details">\n        <div class="msg-envelope-to-line">\n          <span class="msg-envelope-key"\n                 data-l10n-id="envelope-to">tO</span>\n        </div>\n        <div class="msg-envelope-cc-line">\n          <span class="msg-envelope-key"\n                 data-l10n-id="envelope-cc">cC</span>\n        </div>\n        <div class="msg-envelope-bcc-line">\n          <span class="msg-envelope-key"\n                 data-l10n-id="envelope-bcc">BcC</span>\n        </div>\n      </div>\n      <div class="msg-envelope-subject-container">\n        <h3 class="msg-envelope-subject"></h3>\n        <span class="msg-envelope-date"></span>\n      </div>\n    </div>\n    <ul class="msg-attachments-container">\n    </ul>\n    <div class="msg-body-container"><progress></progress></div>\n  </div>\n  <!-- Tells us about remote/not downloaded images, asks to show -->\n  <div class="msg-reader-load-infobar collapsed">\n  </div>\n\n  <ul class="bb-tablist msg-reader-action-toolbar">\n    <li role="presentation">\n      <button class="icon msg-delete-btn"></button>\n    </li>\n    <li role="presentation">\n      <button class="icon msg-star-btn"></button>\n    </li>\n    <li role="presentation">\n      <button class="icon msg-move-btn"></button>\n    </li>\n    <li role="presentation">\n      <button class="icon msg-reply-btn"></button>\n    </li>\n  </ul>\n</div>\n');
}), define("tmpl!cards/msg/contact_menu.html", [ "tmpl" ], function(e) {
    return e.toDom('<form class="msg-contact-menu" role="dialog" data-type="action">\n   <header></header>\n   <menu>\n    <button class="msg-contact-menu-new collapsed" data-l10n-id="message-contact-menu-new">\n      Send new maiL\n    </button>\n    <button class="msg-contact-menu-reply collapsed" data-l10n-id="message-contact-menu-reply">\n      ReplY\n    </button>\n    <button class="msg-contact-menu-view collapsed" data-l10n-id="message-contact-menu-view">\n      View contacT\n    </button>\n    <button class="msg-contact-menu-create-contact collapsed" data-l10n-id="message-contact-menu-create">\n      Save new contacT\n    </button>\n    <button class="msg-contact-menu-add-to-existing-contact collapsed" data-l10n-id="message-contact-menu-add-existing">\n      Add to existing contacT\n    </button>\n     <button class="msg-contact-menu-cancel" data-l10n-id="message-multiedit-cancel">\n      CanceL\n    </button>\n   </menu>\n </form>');
}), define("tmpl!cards/msg/reply_menu.html", [ "tmpl" ], function(e) {
    return e.toDom('<form class="msg-reply-menu" role="dialog" data-type="action">\n  <header></header>\n  <menu>\n    <button class="msg-reply-menu-reply" data-l10n-id="message-reply-menu-reply">\n      ReplY\n    </button>\n    <button class="msg-reply-menu-reply-all" data-l10n-id="message-reply-menu-reply-all">\n      ReplY AlL\n    </button>\n    <button class="msg-reply-menu-forward" data-l10n-id="message-reply-menu-forward">\n      ForwarD\n    </button>\n    <button class="msg-reply-menu-cancel" data-l10n-id="message-reply-menu-cancel">\n      CanceL\n    </button>\n  </menu>\n</form>\n');
}), define("tmpl!cards/msg/browse_confirm.html", [ "tmpl" ], function(e) {
    return e.toDom('<form role="dialog" class="msg-browse-confirm" data-type="confirm">\n  <section>\n    <h1 data-l10n-id="confirm-dialog-title">Confirmation</h1>\n    <p></p>\n  </section>\n  <menu>\n    <button id="msg-browse-cancel" data-l10n-id="message-multiedit-cancel">CanceL</button>\n    <button id="msg-browse-ok" class="recommend" data-l10n-id="dialog-button-ok">OK</button>\n  </menu>\n</form>');
}), define("tmpl!cards/msg/peep_bubble.html", [ "tmpl" ], function(e) {
    return e.toDom('<div class="msg-peep-bubble peep-bubble">\n  <span class="msg-peep-content"></span>\n</div>\n');
}), define("tmpl!cards/msg/attachment_item.html", [ "tmpl" ], function(e) {
    return e.toDom('<li class="msg-attachment-item">\n  <span class="msg-attachment-icon"></span>\n  <span class="msg-attachment-filename"></span>\n  <span class="msg-attachment-filesize"></span>\n  <span data-l10n-id="message-attachment-too-large"\n        class="msg-attachment-too-large"></span>\n  <button class="msg-attachment-download">\n    <span class="icon icon-download"></span></button>\n  <span class="msg-attachment-downloading">\n    <progress class="small"></progress>\n  </span>\n  <button class="msg-attachment-view">\n    <span data-l10n-id="message-attachment-view"></span>\n  </button>\n</li>\n');
}), define("tmpl!cards/msg/attachment_disabled_confirm.html", [ "tmpl" ], function(e) {
    return e.toDom('<form role="dialog" class="msg-attachment-disabled-confirm" data-type="confirm">\n  <section>\n    <p><span data-l10n-id="message-send-attachment-disabled-confirm"></span></p>\n  </section>\n  <menu>\n    <button id="msg-attachment-disabled-cancel" data-l10n-id="message-multiedit-cancel">CanceL</button>\n    <button id="msg-attachment-disabled-ok" data-l10n-id="dialog-button-ok">OK</button>\n  </menu>\n</form>');
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
                var s = t || "scroll", a = n || null, o = e.timingFunction.indexOf(a) >= 0 ? a : "linear", i = "marquee", c = document.getElementById("marquee-h-text");
                if (this._headerWrapper.clientWidth < this._headerWrapper.scrollWidth) switch (this._marqueeCssClassList = [], 
                s) {
                  case "scroll":
                    var d = i + "-rtl", l = this._headerWrapper.scrollWidth;
                    c.style.width = l + "px", c.classList.add(d + "-start-" + o), this._marqueeCssClassList.push(d + "-start-" + o);
                    var r = this;
                    c.addEventListener("animationend", function() {
                        c.classList.remove(d + "-start-" + o), this._marqueeCssClassList.pop();
                        var e = r._headerWrapper.clientWidth + "px";
                        c.style.transform = "translateX(" + e + ")", c.classList.add(d), this._marqueeCssClassList.push(d);
                    });
                    break;

                  case "alternate":
                    var d = i + "-alt-", l = this._headerWrapper.scrollWidth - this._headerWrapper.clientWidth;
                    c.style.width = l + "px", c.classList.add(d + o);
                } else {
                    if (!this._marqueeCssClassList) return;
                    for (var d in this._marqueeCssClassList) c.classList.remove(d);
                    c.style.transform = "";
                }
            }
        }
    };
    return e;
}), define("cards/message_reader", [ "require", "tmpl!./message_reader.html", "tmpl!./msg/delete_confirm.html", "tmpl!./msg/contact_menu.html", "tmpl!./msg/reply_menu.html", "tmpl!./msg/browse_confirm.html", "tmpl!./msg/peep_bubble.html", "tmpl!./msg/attachment_item.html", "tmpl!./msg/attachment_disabled_confirm.html", "mail_common", "model", "header_cursor", "evt", "iframe_shims", "marquee", "l10n!" ], function(e) {
    function t(e, t, n) {
        u.Emitter.call(this), this.domNode = e, this.messageSuid = n.messageSuid, this.previousBtn = e.getElementsByClassName("msg-up-btn")[0], 
        this.previousIcon = e.getElementsByClassName("icon-up")[0], this.nextBtn = e.getElementsByClassName("msg-down-btn")[0], 
        this.nextIcon = this.domNode.getElementsByClassName("icon-down")[0], this.htmlBodyNodes = [], 
        this._on("msg-back-btn", "click", "onBack", !0), this._on("msg-up-btn", "click", "onPrevious"), 
        this._on("msg-down-btn", "click", "onNext"), this._on("msg-reply-btn", "click", "onReplyMenu"), 
        this._on("msg-delete-btn", "click", "onDelete"), this._on("msg-star-btn", "click", "onToggleStar"), 
        this._on("msg-move-btn", "click", "onMove"), this._on("msg-envelope-bar", "click", "onEnvelopeClick"), 
        this._on("msg-reader-load-infobar", "click", "onLoadBarClick"), this.disableReply(), 
        this.scrollContainer = e.getElementsByClassName("scrollregion-below-header")[0], 
        this.loadBar = this.domNode.getElementsByClassName("msg-reader-load-infobar")[0], 
        this.rootBodyNode = e.getElementsByClassName("msg-body-container")[0], this._builtBodyDom = !1, 
        this.handleBodyChange = this.handleBodyChange.bind(this), this.onMessageSuidNotFound = this.onMessageSuidNotFound.bind(this), 
        this.onCurrentMessage = this.onCurrentMessage.bind(this), p.on("messageSuidNotFound", this.onMessageSuidNotFound), 
        p.latest("currentMessage", this.onCurrentMessage), p.setCurrentMessage(this.header);
    }
    var n, s = e("tmpl!./message_reader.html"), a = e("tmpl!./msg/delete_confirm.html"), o = e("tmpl!./msg/contact_menu.html"), i = e("tmpl!./msg/reply_menu.html"), c = e("tmpl!./msg/browse_confirm.html"), d = e("tmpl!./msg/peep_bubble.html"), l = e("tmpl!./msg/attachment_item.html"), r = e("tmpl!./msg/attachment_disabled_confirm.html"), m = e("mail_common"), h = e("model"), p = e("header_cursor").cursor, u = e("evt"), g = e("iframe_shims"), b = e("marquee"), v = e("l10n!"), f = m.Cards, y = m.Toaster, C = m.ConfirmDialog, _ = m.displaySubject, N = m.prettyDate, E = m.prettyFileSize, A = [ null, "msg-body-content", "msg-body-signature", "msg-body-leadin", null, "msg-body-disclaimer", "msg-body-list", "msg-body-product", "msg-body-ads" ], w = [ "msg-body-q1", "msg-body-q2", "msg-body-q3", "msg-body-q4", "msg-body-q5", "msg-body-q6", "msg-body-q7", "msg-body-q8", "msg-body-q9" ], B = "msg-body-qmax";
    return t.prototype = {
        _contextMenuType: {
            VIEW_CONTACT: 1,
            CREATE_CONTACT: 2,
            ADD_TO_CONTACT: 4,
            REPLY: 8,
            NEW_MESSAGE: 16
        },
        _on: function(e, t, n, s) {
            this.domNode.getElementsByClassName(e)[0].addEventListener(t, function(e) {
                return this.header || s ? this[n](e) : void 0;
            }.bind(this), !1);
        },
        _setHeader: function(e) {
            this.header = e.makeCopy(), this.hackMutationHeader = e, this.header.isRead || this.header.setRead(!0), 
            this.hackMutationHeader.isStarred && this.domNode.getElementsByClassName("msg-star-btn")[0].classList.add("msg-btn-active"), 
            this.emit("header");
        },
        postInsert: function() {
            this._inDom = !0, this._afterInDomMessage && (this.onCurrentMessage(this._afterInDomMessage), 
            this._afterInDomMessage = null);
        },
        told: function(e) {
            e.messageSuid && (this.messageSuid = e.messageSuid);
        },
        handleBodyChange: function(e) {
            this.buildBodyDom(e.changeDetails);
        },
        onBack: function() {
            f.removeCardAndSuccessors(this.domNode, "animate");
        },
        onPrevious: function() {
            p.advance("previous");
        },
        onNext: function() {
            p.advance("next");
        },
        onMessageSuidNotFound: function(e) {
            this.messageSuid === e && this.onBack();
        },
        onCurrentMessage: function(e) {
            if (!this._inDom) return this._afterInDomMessage = e, void 0;
            this.messageSuid = null, this._setHeader(e.header), this.clearDom(), this.latestOnce("header", function() {
                this.buildHeaderDom(this.domNode), this.header.getBody({
                    downloadBodyReps: !0
                }, function(e) {
                    this.body = e, e.onchange = this.handleBodyChange, e.bodyRepsDownloaded && this.buildBodyDom();
                }.bind(this));
            }.bind(this));
            var t = e.siblings.hasPrevious;
            this.previousBtn.disabled = !t, this.previousIcon.classList[t ? "remove" : "add"]("icon-disabled");
            var n = e.siblings.hasNext;
            this.nextBtn.disabled = !n, this.nextIcon.classList[n ? "remove" : "add"]("icon-disabled");
        },
        reply: function() {
            f.eatEventsUntilNextCard();
            var e = this.header.replyToMessage(null, function() {
                f.pushCard("compose", "default", "animate", {
                    composer: e
                });
            });
        },
        replyAll: function() {
            f.eatEventsUntilNextCard();
            var e = this.header.replyToMessage("all", function() {
                f.pushCard("compose", "default", "animate", {
                    composer: e
                });
            });
        },
        forward: function() {
            var e = this.header.hasAttachments || this.body.embeddedImageCount > 0, t = function() {
                f.eatEventsUntilNextCard();
                var e = this.header.forwardMessage("inline", function() {
                    f.pushCard("compose", "default", "animate", {
                        composer: e
                    });
                });
            }.bind(this);
            if (e) {
                var n = r.cloneNode(!0);
                C.show(n, {
                    id: "msg-attachment-disabled-ok",
                    handler: function() {
                        t();
                    }
                }, {
                    id: "msg-attachment-disabled-cancel",
                    handler: null
                });
            } else t();
        },
        canReplyAll: function() {
            var e = h.account.identities.map(function(e) {
                return e.address;
            }), t = (this.header.to || []).concat(this.header.cc || []);
            this.header.replyTo && this.header.replyTo.author && t.push(this.header.replyTo.author);
            for (var n = 0; n < t.length; n++) {
                var s = t[n];
                if (s.address && -1 == e.indexOf(s.address)) return !0;
            }
            return !1;
        },
        onReplyMenu: function() {
            var e = i.cloneNode(!0);
            document.body.appendChild(e);
            var t = function(t) {
                switch (document.body.removeChild(e), t.explicitOriginalTarget.className) {
                  case "msg-reply-menu-reply":
                    this.reply();
                    break;

                  case "msg-reply-menu-reply-all":
                    this.replyAll();
                    break;

                  case "msg-reply-menu-forward":
                    this.forward();
                    break;

                  case "msg-reply-menu-cancel":                }
                return !1;
            }.bind(this);
            e.addEventListener("submit", t), this.canReplyAll() || e.querySelector(".msg-reply-menu-reply-all").classList.add("collapsed");
        },
        onDelete: function() {
            var e = a.cloneNode(!0);
            C.show(e, {
                id: "msg-delete-ok",
                handler: function() {
                    var e = this.header.deleteMessage();
                    y.logMutation(e, !0), f.removeCardAndSuccessors(this.domNode, "animate");
                }.bind(this)
            }, {
                id: "msg-delete-cancel",
                handler: null
            });
        },
        onToggleStar: function() {
            var e = this.domNode.getElementsByClassName("msg-star-btn")[0];
            this.hackMutationHeader.isStarred ? e.classList.remove("msg-btn-active") : e.classList.add("msg-btn-active"), 
            this.hackMutationHeader.isStarred = !this.hackMutationHeader.isStarred, this.header.setStarred(this.hackMutationHeader.isStarred);
        },
        onMove: function() {
            f.folderSelector(function(e) {
                var t = this.header.moveMessage(e);
                y.logMutation(t, !0), f.removeCardAndSuccessors(this.domNode, "animate");
            }.bind(this));
        },
        onEnvelopeClick: function(e) {
            var t = e.target;
            t.classList.contains("msg-peep-bubble") && this.onPeepClick(t);
        },
        onPeepClick: function(e) {
            var t = o.cloneNode(!0), n = e.peep, s = t.getElementsByTagName("header")[0];
            b.setup(n.address, s), document.body.appendChild(t), b.activate("alternate", "ease");
            var a = function(e) {
                switch (document.body.removeChild(t), e.explicitOriginalTarget.className) {
                  case "msg-contact-menu-new":
                    f.pushCard("compose", "default", "animate", {
                        composerData: {
                            message: this.header,
                            onComposer: function(e) {
                                e.to = [ {
                                    address: n.address,
                                    name: n.name
                                } ];
                            }
                        }
                    });
                    break;

                  case "msg-contact-menu-view":
                    new MozActivity({
                        name: "open",
                        data: {
                            type: "webcontacts/contact",
                            params: {
                                id: n.contactId
                            }
                        }
                    });
                    break;

                  case "msg-contact-menu-create-contact":
                    var s = {
                        email: n.address
                    };
                    n.name && (s.givenName = n.name), new MozActivity({
                        name: "new",
                        data: {
                            type: "webcontacts/contact",
                            params: s
                        }
                    });
                    break;

                  case "msg-contact-menu-add-to-existing-contact":
                    new MozActivity({
                        name: "update",
                        data: {
                            type: "webcontacts/contact",
                            params: {
                                email: n.address
                            }
                        }
                    });
                    break;

                  case "msg-contact-menu-reply":
                    var a = this.header.replyToMessage(null, function() {
                        f.pushCard("compose", "default", "animate", {
                            composer: a
                        });
                    });
                }
                return !1;
            }.bind(this);
            t.addEventListener("submit", a);
            var i = this._contextMenuType.NEW_MESSAGE, c = n.type;
            "from" === c && (i |= this._contextMenuType.REPLY), n.isContact ? i |= this._contextMenuType.VIEW_CONTACT : (i |= this._contextMenuType.CREATE_CONTACT, 
            i |= this._contextMenuType.ADD_TO_CONTACT), i & this._contextMenuType.VIEW_CONTACT && t.querySelector(".msg-contact-menu-view").classList.remove("collapsed"), 
            i & this._contextMenuType.CREATE_CONTACT && t.querySelector(".msg-contact-menu-create-contact").classList.remove("collapsed"), 
            i & this._contextMenuType.ADD_TO_CONTACT && t.querySelector(".msg-contact-menu-add-to-existing-contact").classList.remove("collapsed"), 
            i & this._contextMenuType.REPLY && t.querySelector(".msg-contact-menu-reply").classList.remove("collapsed"), 
            i & this._contextMenuType.NEW_MESSAGE && t.querySelector(".msg-contact-menu-new").classList.remove("collapsed");
        },
        onLoadBarClick: function() {
            var e = this, t = this.loadBar;
            if (this.body.embeddedImagesDownloaded) {
                for (var n = 0; n < this.htmlBodyNodes.length; n++) this.body.showExternalImages(this.htmlBodyNodes[n], this.iframeResizeHandler);
                t.classList.add("collapsed");
            } else this.body.downloadEmbeddedImages(function() {
                if (e.domNode) for (var t = 0; t < e.htmlBodyNodes.length; t++) e.body.showEmbeddedImages(e.htmlBodyNodes[t], e.iframeResizeHandler);
            }), t.classList.add("collapsed");
        },
        getAttachmentBlob: function(e, t) {
            try {
                var n = e._file[0], s = e._file[1], a = navigator.getDeviceStorage(n), o = a.get(s);
                o.onerror = function() {
                    console.warn("Could not open attachment file: ", s, o.error.name);
                }, o.onsuccess = function() {
                    var e = o.result;
                    t(e);
                };
            } catch (i) {
                console.warn("Exception getting attachment from device storage:", e._file, "\n", i, "\n", i.stack);
            }
        },
        onDownloadAttachmentClick: function(e, t) {
            e.setAttribute("state", "downloading"), t.download(function() {
                t._file && e.setAttribute("state", "downloaded");
            });
        },
        onViewAttachmentClick: function(e, t) {
            console.log("trying to open", t._file, "type:", t.mimetype), t._file && t.isDownloaded && this.getAttachmentBlob(t, function(e) {
                try {
                    if (!e) throw new Error("Blob does not exist");
                    var s = t.filename.split(".").pop(), a = e.type || t.mimetype, o = n.isSupportedType(a) ? a : n.guessTypeFromExtension(s), i = new MozActivity({
                        name: "open",
                        data: {
                            type: o,
                            blob: e
                        }
                    });
                    i.onerror = function() {
                        console.warn('Problem with "open" activity', i.error.name);
                    }, i.onsuccess = function() {
                        console.log('"open" activity allegedly succeeded');
                    };
                } catch (c) {
                    console.warn('Problem creating "open" activity:', c, "\n", c.stack);
                }
            });
        },
        onHyperlinkClick: function(e, t, n) {
            var s = c.cloneNode(!0), a = s.getElementsByTagName("p")[0];
            a.textContent = v.get("browse-to-url-prompt", {
                url: n
            }), C.show(s, {
                id: "msg-browse-ok",
                handler: function() {
                    window.open(n, "_blank", "dialog");
                }.bind(this)
            }, {
                id: "msg-browse-cancel",
                handler: null
            });
        },
        _populatePlaintextBodyNode: function(e, t) {
            for (var n = 0; n < t.length; n += 2) {
                var s, a = document.createElement("div"), o = 15 & t[n];
                if (4 === o) {
                    var i = (255 & t[n] >> 8) + 1;
                    s = i > 8 ? B : w[i];
                } else s = A[o];
                s && a.setAttribute("class", s);
                for (var c = h.api.utils.linkifyPlain(t[n + 1], document), d = 0; d < c.length; d++) a.appendChild(c[d]);
                e.appendChild(a);
            }
        },
        buildHeaderDom: function(e) {
            function t(t) {
                var n = t.element.getElementsByClassName("msg-peep-content")[0];
                "from" === t.type ? (e.getElementsByClassName("msg-reader-header-label")[0].textContent = t.name || t.address, 
                n.textContent = t.address, n.classList.add("msg-peep-address")) : (n.textContent = t.name || t.address, 
                !t.name && t.address ? n.classList.add("msg-peep-address") : n.classList.remove("msg-peep-address"));
            }
            function n(n, s) {
                var a = "msg-envelope-" + n + "-line", o = e.getElementsByClassName(a)[0];
                if (!s || !s.length) return o.classList.add("collapsed"), void 0;
                o.classList.remove("collapsed");
                for (var i = d, c = 0; c < s.length; c++) {
                    var l = s[c];
                    l.type = n, l.element = i.cloneNode(!0), l.element.peep = l, l.onchange = t, t(l), 
                    o.appendChild(l.element);
                }
            }
            var s = this.header;
            this.body, n("from", [ s.author ]), n("to", s.to), n("cc", s.cc), n("bcc", s.bcc);
            var a = e.getElementsByClassName("msg-envelope-date")[0];
            a.dataset.time = s.date.valueOf(), a.textContent = N(s.date), _(e.getElementsByClassName("msg-envelope-subject")[0], s);
        },
        clearDom: function() {
            var e = this.domNode;
            if (e) {
                Array.slice(e.querySelectorAll(".msg-peep-bubble")).forEach(function(e) {
                    e.parentNode.removeChild(e);
                });
                var t = e.getElementsByClassName("msg-attachments-container")[0];
                t.innerHTML = "", this.rootBodyNode.innerHTML = "<progress></progress>", this.loadBar.classList.add("collapsed");
            }
        },
        buildBodyDom: function(t) {
            var s = this.body, a = this.domNode, o = this.rootBodyNode, i = s.bodyReps, c = !1, d = s.embeddedImageCount && s.embeddedImagesDownloaded;
            if (this._builtBodyDom || (g.bindSanitizedClickHandler(o, this.onHyperlinkClick.bind(this), o, null), 
            this._builtBodyDom = !0), i.length && i[0].isDownloaded) {
                var r = o.querySelector("progress");
                r && r.parentNode.removeChild(r);
            }
            for (var m = 0; m < i.length; m++) {
                var p = i[m], u = o.childNodes[m];
                if (u || (u = o.appendChild(document.createElement("div"))), !t || !t.bodyReps || -1 !== t.bodyReps.indexOf(m)) if (u.innerHTML = "", 
                "plain" === p.type) this._populatePlaintextBodyNode(u, p.content); else if ("html" === p.type) {
                    var b = g.createAndInsertIframeForContent(p.content, this.scrollContainer, u, null, "interactive", this.onHyperlinkClick.bind(this)), f = b.iframe, y = f.contentDocument.body;
                    this.iframeResizeHandler = b.resizeHandler, h.api.utils.linkifyHTML(f.contentDocument), 
                    this.htmlBodyNodes.push(y), s.checkForExternalImages(y) && (c = !0), d && s.showEmbeddedImages(y, this.iframeResizeHandler);
                }
            }
            var C = this.loadBar;
            s.embeddedImageCount && !s.embeddedImagesDownloaded ? (C.classList.remove("collapsed"), 
            C.textContent = v.get("message-download-images", {
                n: s.embeddedImageCount
            })) : c ? (C.classList.remove("collapsed"), C.textContent = v.get("message-show-external-images")) : C.classList.add("collapsed");
            var _ = a.getElementsByClassName("msg-attachments-container")[0];
            s.attachments && s.attachments.length ? (_.classList.remove("collapsed"), e([ "shared/js/mime_mapper" ], function(e) {
                n || (n = e);
                for (var a = l, o = a.getElementsByClassName("msg-attachment-filename")[0], i = a.getElementsByClassName("msg-attachment-filesize")[0], c = 0; c < s.attachments.length; c++) {
                    var d = _.childNodes[c];
                    if (d || (d = _.appendChild(document.createElement("li"))), !t || !t.attachments || -1 !== t.attachments.indexOf(c)) {
                        var r, m = s.attachments[c], h = m.filename.split(".").pop(), p = 20971520, u = !0;
                        m.isDownloaded ? r = "downloaded" : m.isDownloadable ? m.sizeEstimateInBytes > p ? (r = "toolarge", 
                        u = !1) : r = n.isSupportedType(m.mimetype) || n.isSupportedExtension(h) ? "downloadable" : "nodownload" : (r = "nodownload", 
                        u = !1), a.setAttribute("state", r), o.textContent = m.filename, i.textContent = E(m.sizeEstimateInBytes);
                        var g = a.cloneNode(!0);
                        _.replaceChild(g, d);
                        var b = g.getElementsByClassName("msg-attachment-download")[0];
                        b.disabled = !u, u && b.addEventListener("click", this.onDownloadAttachmentClick.bind(this, g, m)), 
                        g.getElementsByClassName("msg-attachment-view")[0].addEventListener("click", this.onViewAttachmentClick.bind(this, g, m)), 
                        this.enableReply();
                    }
                }
            }.bind(this))) : (_.classList.add("collapsed"), this.enableReply());
        },
        disableReply: function() {
            var e = this.domNode.getElementsByClassName("msg-reply-btn")[0];
            e.setAttribute("aria-disabled", !0);
        },
        enableReply: function() {
            var e = this.domNode.getElementsByClassName("msg-reply-btn")[0];
            e.removeAttribute("aria-disabled");
        },
        die: function() {
            p.removeListener("messageSuidNotFound", this.onMessageSuidNotFound), p.removeListener("currentMessage", this.onCurrentMessage), 
            this.header && (this.header.__die(), this.header = null), this.body && (this.body.die(), 
            this.body = null), this.domNode = null;
        }
    }, u.mix(t.prototype), f.defineCardWithDefaultMode("message_reader", {
        tray: !1
    }, t, s), t;
});