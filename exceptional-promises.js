#!/usr/bin/env node
/*jslint node: true*/
(function () {
    var Q = require("q");
    require("colors");

    function foo() {
        var deferred = Q.defer();
        throw new Error("Can't foo");
        deferred.resolve();
        return deferred.promise;
    }

    function bar() {
        var deferred = Q.defer();
        deferred.resolve();
        return deferred.promise;
    }

    function successHandlerFor(id) {
        return function successHandler() {
            console.log((id + ": YAY!").green);
        }
    }

    function errorHandlerFor(id) {
        return function errorHandler(err) {
            console.error((id + ": " + err.message).red);
            return Q.reject(err);
        }
    }

    /**
     * Calls `fn()` and returns a promise which either resolves to what `fn()` returns, or rejects to whatever `fn()` throws.
     * @param fn the possibly-error-throwing function to call
     * @returns {Q.promise} a promise which either resolves to what `fn()` returns, or rejects to whatever `fn()` throws.
     */
    function exceptionCatchingWrapper(fn) {
        var deferred = Q.defer();
        try {
            deferred.resolve(fn());
        } catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }

    function init() {
        var promiseFromFoo = exceptionCatchingWrapper(function () {
            foo();
        });

        var promiseFromBar = promiseFromFoo.then(function () {
            return bar();
        }, errorHandlerFor("promiseFromFoo"));

        promiseFromBar.then(successHandlerFor("promiseFromBar"), errorHandlerFor("promiseFromBar"));
    }

    init();
})();
