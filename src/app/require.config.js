// require.js looks for the following global when initializing
var require = {
    baseUrl: ".",
    paths: {
        "bootstrap":            "bower_modules/components-bootstrap/js/bootstrap.min",
        "jquery":               "bower_modules/jquery/jquery",
        "jquery.mask":          "bower_modules/jquery-mask-library/lib/mask",
        "knockout":             "bower_modules/knockout/dist/knockout",
        "text":                 "bower_modules/requirejs-text/text"
    },
    shim: {
        "bootstrap": { deps: ["jquery"] }
    }
};
