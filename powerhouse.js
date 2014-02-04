(function (window, $, undefined) {

    var Powerhouse = function Powerhouse(promise) {
        this.promise = promise;
    }

    Powerhouse.dispatch = function dispatch(promise) {
        var deferred = $.Deferred(),
            deferreds = [];

        promise.progress(function (result) {
            var d = $.when();
            deferreds.push(d);

            deferred.notify(d.then(function () {
                return result;
            }));
        });

        promise.done(function () {
            deferred.resolve(deferreds.length);
        });

        return new Powerhouse(deferred.promise());
    };

    Powerhouse.chain = function chain(list) {
        var deferred = $.Deferred(),
            deferreds = [];

        for (var i = 0; i < list.length; i++) {
            var dfd = $.Deferred();
            promises.push(d.promise());

            setTimeout(function (d, idx) {
                deferred.notify(d.promise());
                d.resolve(list[idx]);
            }, 0, dfd, i);
        }

        $.when.apply($, promises).done(function () {
            deferred.resolve(promises.length);
        });

        return new Powerhouse(deferred.promise());
    };

    Powerhouse.prototype.each = function each(func) {
        var deferred = $.Deferred();

        this.promise.progress(function (result) {
            deferred.notify(result.then(function (value) {
                return $.when(func(value)).then(function () {
                    return value;
                })
            }));
        });

        this.promise.done(deferred.resolve);

        return new Powerhouse(deferred.promise());
    };

    Powerhouse.prototype.map = function map(func) {
        var deferred = $.Deferred();

        this.promise.progress(function (result) {
            deferred.notify(result.then(function (value) {
                return $.when(func(value));
            }));
        });

        this.promise.done(deferred.resolve);

        return new Powerhouse(deferred.promise());
    };

    Powerhouse.prototype.filter = function filter(func) {
        var deferred = $.Deferred();

        //TODO

        this.promise.done(deferred.resolve);

        return new Powerhouse(deferred.promise());
    };

    Powerhouse.prototype.value = function value() {
        var results = [],
            actual = 0,
            expected = 0,
            finalResult;

        this.promise.progress(function (result) {
            result.then(function (value) {
                results.push(value);

                actual++;

                if (finalResult && (actual === expected)) {
                    finalResult.resolve(results);
                }
            });
        });

        return this.promise.then(function (exp) {
            finalResult = $.Deferred();
            expected = exp;

            if (finalResult && (actual === expected)) {
                finalResult.resolve(results);
            }

            return finalResult;
        });
    };

    window.Powerhouse = Powerhouse;

})(window, jQuery);
