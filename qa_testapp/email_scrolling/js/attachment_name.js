define([ "require", "l10n!", "shared/js/mime_mapper" ], function(e) {
    var n = e("l10n!"), r = e("shared/js/mime_mapper"), a = {
        ensureName: function(e, a, t) {
            if (!a) {
                t = t || 1;
                var m = r.guessExtensionFromType(e.type);
                a = n.get("default-attachment-filename", {
                    n: t
                }) + (m ? "." + m : "");
            }
            return a;
        },
        ensureNameList: function(e, n) {
            for (var r = 0; r < e.length; r++) n[r] = a.ensureName(e[r], n[r], r + 1);
        }
    };
    return a;
});