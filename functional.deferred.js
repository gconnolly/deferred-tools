(function (window, $, undefined) {

    function UnderscoreDeferred(promises) {
        this.promises = promises;
    }

    UnderscoreDeferred.wrap = function wrap(list) {
        var promises = [];

        for (var i = 0; i < list.length; i++) {
            var d = $.Deferred();

            promises.push(d.promise());

            setTimeout(function (e, j) {
                e.resolve(list[j]);
            }, 1000, d, i);
        }

        return new UnderscoreDeferred(promises);
    };

    UnderscoreDeferred.prototype.map = function map(func) {
        var promises = [];

        for (var i = 0; i < this.promises.length; i++) {
            promises.push(this.promises[i].then(function (result) {
                return $.when(func(result));
            }));
        }

        return new UnderscoreDeferred(promises);
    };

    UnderscoreDeferred.prototype.toArray = function toArray(func) {
        var results = [];

        for (var i = 0; i < this.promises.length; i++) {
            this.promises[i].then(function (result) {
                results.push(result);
            });
        }

        return $.when.apply(null, this.promises)
                    .then(function () {
                        return func(results);
                    });
    };

})(window, jQuery);

var newList = UnderscoreDeferred.wrap([1, 2, 3, 4, 5])
            .map(function (item) {
                console.log(item + 1);
                return item + 1;
            })
            .map(function (item) {
                console.log(item * 2);
                return item * 2;
            })
            .toArray(function (results) {
                console.log(results);
            });