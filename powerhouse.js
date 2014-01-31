(function (window, $, undefined) {

    var Powerhouse = function Powerhouse(promise) {
        this.promise = promise;
    }

    Powerhouse.wrap = function wrap(list) {
        var newPromise = $.Deferred();

        var interval = setInterval(function () {

            if (list.length) {
                var d = $.Deferred();
                var item = list.pop();
                newPromise.notify(d.promise());
                d.resolve(item);
            } else {
                clearInterval(interval);
                newPromise.resolve();
            }

        }, 3000);

        return new Powerhouse(newPromise.promise());
    };

    Powerhouse.prototype.each = function each(func) {
        var newPromise = $.Deferred();

        this.promise.progress(function (result) {
            newPromise.notify(result.then(function (value) {
                $.when(func(value)).then(function () {
                    return value;
                })
            }));
        });

        this.promise.done(newPromise.resolve);

        return new Powerhouse(newPromise.promise());
    };

    Powerhouse.prototype.map = function map(func) {
        var newPromise = $.Deferred();

        this.promise.progress(function (result) {
            newPromise.notify(result.then(function (value) {
                return $.when(func(value));
            }));
        });

        this.promise.done(newPromise.resolve);

        return new Powerhouse(newPromise.promise());
    };

    Powerhouse.prototype.filter = function filter(func) {
        var newPromise = $.Deferred();

        //TODO
        this.promise.done(newPromise.resolve);

        return new Powerhouse(newPromise.promise());
    };

    Powerhouse.prototype.toArray = function toArray() {
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
