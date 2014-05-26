define([], function() {
    return function(e, t, n) {
        return Object.keys(t).forEach(function(s) {
            (!e.hasOwnProperty(s) || n) && (e[s] = t[s]);
        }), e;
    };
});