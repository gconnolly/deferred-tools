(function (window, $, undefined) {

    var Powerhouse = function Powerhouse(promise) {
        this.promise = promise;
    }

    Powerhouse.dispatch = function dispatch(promise) {
        var deferred = $.Deferred();

        promise.progress(function (result) {
            deferred.notify($.when().then(function () {
                return result;
            }));
        });

        return new Powerhouse(deferred.promise());
    };

    Powerhouse.chain = function chain(list) {
        var deferred = $.Deferred();

        for (var i = 0; i < list.length; i++) {
            var d = $.Deferred();
            deferred.notify(d.promise());
            d.resolve(list[i]);
        }

        deferred.resolve();

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
        var results = [];

        this.promise.progress(function (result) {
            result.then(function (value) {
                results.push(value);
            });
        });

        return this.promise.then(function () {
            return results;
        });
    };

    window.Powerhouse = Powerhouse;

})(window, jQuery);
