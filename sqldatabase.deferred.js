(function (window, $, undefined) {

    function DeferredSQLTransaction(tx) {
        this.transaction = tx;
    };

    DeferredSQLTransaction.prototype.executeSql = function executeSql(sqlStatement, sqlArguments) {
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

    function DeferredSQLDatabase(db) {
        this.database = db;
        this.version = db.version;
    }

    window.openDatabaseDeferred = function openDatabase(name, version, displayName, estimatedSize) {
        var self = this,
            d = $.Deferred(),
            db = window.openDatabase(name, version, displayName, estimatedSize);

        return new DeferredSQLDatabase(db);
    };

    DeferredSQLDatabase.prototype.transaction = function transaction(callback) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function () {
                d.resolve();
            },
            wrappedCallback = function (tx) {
                callback(new DeferredSQLTransaction(tx));
            };

        self.database.transaction(wrappedCallback, errorCallback, successCallback);

        return d.promise();
    };

    DeferredSQLDatabase.prototype.readTransaction = function readTransaction(callback) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (tx) {
                d.resolve(new DeferredSQLTransaction(tx));
            };

        self.database.readTransaction(callback, errorCallback, successCallback);

        return d.promise();
    };

    DeferredSQLDatabase.prototype.changeVersion = function changeVersion(oldVersion, newVersion, callback) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (tx) {
                self.version = self.database.version;

                d.resolve(new DeferredSQLTransaction(tx));
            };

        self.database.changeVersion(oldVersion, newVersion, callback, errorCallback, successCallback);

        return d.promise();
    };

    window.DeferredSQLDatabase = DeferredSQLDatabase;

})(window, jQuery);
