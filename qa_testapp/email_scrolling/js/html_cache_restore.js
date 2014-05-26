function plog(e) {
    console.log(e + " " + (performance.now() - _xstart));
}

var _xstart = performance.timing.fetchStart - performance.timing.navigationStart;

window.htmlCacheRestorePendingMessage = [], function() {
    function e() {
        for (var e, t, s, i = document.cookie, r = /htmlc(\d+)=([^;]+)/g, o = []; e = r.exec(i); ) o[parseInt(e[1], 10)] = e[2] || "";
        return i = decodeURIComponent(o.join("")), t = i.indexOf(":"), -1 === t ? i = "" : (s = i.substring(0, t), 
        i = i.substring(t + 1)), s !== n && (i = ""), i;
    }
    function t() {
        var e = document.createElement("script");
        i ? (e.setAttribute("data-main", r), e.src = i) : e.src = r, document.head.appendChild(e);
    }
    var n = "1", s = document.querySelector("[data-loadsrc]"), i = s.dataset.loader, r = s.dataset.loadsrc, o = document.getElementById(s.dataset.targetid);
    navigator.mozHasPendingMessage && (navigator.mozHasPendingMessage("activity") && window.htmlCacheRestorePendingMessage.push("activity"), 
    navigator.mozHasPendingMessage("alarm") && window.htmlCacheRestorePendingMessage.push("alarm"), 
    navigator.mozHasPendingMessage("notification") && window.htmlCacheRestorePendingMessage.push("notification")), 
    window.htmlCacheRestorePendingMessage.length ? t() : (o.innerHTML = e(), window.addEventListener("load", t, !1));
}();