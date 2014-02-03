#!/usr/bin/env node
/*jslint node: true*/
(function () {
    var Q = require("q");

    function foo() {
        var deferred = Q.defer();
        deferred.resolve();
        return deferred.promise;
    }

    function bar() {
        var deferred = Q.defer();
        throw new Error("Can't bar");
        return deferred.promise;
    }

    function init() {
        foo()
            .then(function () {
                return bar();
            })
            .fail(function (err) {
                console.log(err.message);   // Can't bar
            });
    }

    init();
})();
