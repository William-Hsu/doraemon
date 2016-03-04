'use strict';
var utils = this.utils || {};

utils.ActionMenu = (function() {
    
    var FILE_NAME = 'action_menu';

    function getPath() {
        var path = document.querySelector('[src*="' + FILE_NAME + '.js"]').src;
        return path.substring(0, path.lastIndexOf('/') + 1);
    }

    var actionMenus = Object.create(null);
    var counter = 0;
    var Action = function(container) {
        this.container = container;
        container.dataset.id = ++counter;
        this.callbacks = Object.create(null);
        container.addEventListener('click', this);
        container.addEventListener('animationend', this);
    };

    Action.prototype = {
        get id() {
          return this.container.id;
        },

        show: function am_show() {
            this.container.classList.remove('hidden');
            this.container.classList.add('onviewport');
        },

        hide: function am_hide() {
            this.container.classList.remove('onviewport');
        },

        addEventListener: function am_addEventListener(type, callback) {
            if (type !== 'click' || typeof callback !== 'function') {
                return;
            }
            this.callbacks[callback] = callback;
        },

        removeEventListener: function am_removeEventListener(type, callback) {
            if (type === 'click' && typeof callback === 'function') {
                delete this.callbacks[callback];
            }
        },

        handleEvent: function am_handleEvent(evt) {
            switch (evt.type) {
                case 'click':
                    evt.stopPropagation();
                    evt.preventDefault();
                    if (evt.target.tagName !== 'BUTTON') {
                      return;
                    }
                    window.setTimeout(this.hide.bind(this));
                    typeof this.onclick === 'function' && this.onclick(evt);
                    var callbacks = this.callbacks;
                    Object.keys(callbacks).forEach(function(callback) {
                        setTimeout(function() {
                            callbacks[callback](evt);
                        });
                    });
                break;

                case 'animationend':
                    var eventName = 'actionmenu-showed';
                    if (evt.animationName === 'hide') {
                        this.container.classList.add('hidden');
                        eventName = 'actionmenu-hidden';
                    }
                    window.dispatchEvent(new CustomEvent(eventName));
                    break;
               }
        },

        destroy: function am_destroy() {
            if (!this.container) {
                return;
            }
            this.container.removeEventListener('click', this);
            this.container.removeEventListener('animationend', this);
            this.container.parentNode.removeChild(this.container);
            this.container = this.callbacks = this.onclick = null;
        }
    };

    function addStyleSheet() {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = getPath() + 'action_menu_behavior.css';
        document.head.appendChild(link);
    }

    function initialize() {
        addStyleSheet();
        var elements = document.querySelectorAll('[role="dialog"][data-type="action"]');
        Array.prototype.forEach.call(elements, function(element) {
            utils.ActionMenu.bind(element);
        });
    }

    if (document.readyState === 'complete') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', function loaded() {
            document.removeEventListener('DOMContentLoaded', loaded);
            initialize();
        });
    }

    function destroy() {
        Object.keys(actionMenus).forEach(function destroying(id) {
          actionMenus[id].destroy();
        });
        actionMenus = Object.create(null);
        counter = 0;
    }

    function build(descriptor) {
        var form = document.createElement('form');
        form.setAttribute('role', 'dialog');
        form.dataset.type = 'action';
        form.classList.add('hidden');

        if (descriptor.id) {
            form.id = descriptor.id;
        }

        var section = document.createElement('section');
        var h1 = document.createElement('h1');
        h1.textContent = descriptor.title || '';
        section.appendChild(h1);
        form.appendChild(section);
        var actions = descriptor.actions;
        if (actions) {
            var menu = document.createElement('menu');
            menu.classList.add('actions');
            actions.forEach(function(action) {
                var button = document.createElement('button');
                button.id = action.id;
                button.textContent = action.title;
                menu.appendChild(button);
                var classes = action.classList;
                    if (classes) {
                        classes.trim().split(/\s+/g).forEach(function(clazz) {
                            button.classList.add(clazz);
                        });
                    }
            });
        form.appendChild(menu);
        }
        return form;
    }
    return {
        get: function get(id) {
            var elem = document.getElementById(id);
            if (!elem) {
                return;
            }
            return actionMenus[elem.dataset.id];
        },

        bind: function bind(elem) {
            elem = typeof elem === 'object' ? elem : document.querySelector(elem);
            var out = actionMenus[elem.dataset.id];
            if (out) {
                return out;
            }

            out = new Action(elem);
            actionMenus[elem.dataset.id] = out;
            return out;
        },

        create: function create(descriptor) {
            return build(descriptor || {});
        },
        destroy: destroy
    };
})();
