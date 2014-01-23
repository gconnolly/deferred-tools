(function (window, $, undefined) {

    function SQLDeferredTransaction(tx) {
        this.transaction = tx;
    };

    SQLDeferredTransaction.prototype.executeSql = function executeSql(sqlStatement, sqlArguments) {
        var self = this,
            d = $.Deferred(),
            callback = function (tx, resultSet) {
                d.resolve(self, resultSet);
            },
            errorCallback = function (tx, error) {
                d.reject(self, error);
            };

        self.transaction.executeSql(sqlStatement, sqlArguments, callback, errorCallback);

        return d.promise();
    };

    function SQLDeferredDatabase() { }

    SQLDeferredDatabase.prototype.openDatabase = function openDatabase(name, version, displayName, estimatedSize) {
        var self = this,
            d = $.Deferred(),
            creationCallback = function () {
                return self;
            };

        self.database = window.openDatabase(name, version, displayName, estimatedSize, creationCallback);

        self.version = self.database.version;

        return d.promise();
    };

    SQLDeferredDatabase.prototype.transaction = function transaction(callback) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function () {
                d.resolve();
            },
            wrappedCallback = function (tx) {
                callback(new SQLDeferredTransaction(tx));
            };

        self.database.transaction(wrappedCallback, errorCallback, successCallback);

        return d.promise();
    };

    SQLDeferredDatabase.prototype.readTransaction = function readTransaction(callback) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (tx) {
                d.resolve(new SQLDeferredTransaction(tx));
            };

        self.database.readTransaction(callback, errorCallback, successCallback);

        return d.promise();
    };

    SQLDeferredDatabase.prototype.changeVersion = function changeVersion(oldVersion, newVersion, callback) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (tx) {
                self.version = self.database.version;

                d.resolve(new SQLDeferredTransaction(tx));
            };

        self.database.changeVersion(oldVersion, newVersion, callback, errorCallback, successCallback);

        return d.promise();
    };

    window.SQLDeferredDatabase = SQLDeferredDatabase;

})(window, jQuery);
