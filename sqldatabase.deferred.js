(function (window, $, undefined) {

    window.DeferredSQLTransaction = function DeferredSQLTransaction(tx) {
        this._transaction = tx;
    };

    DeferredSQLTransaction.prototype.executeSql = function executeSql(sqlStatement, sqlArguments, errorCallback) {
        var self = this,
            d = $.Deferred(),
            successCallback = function (tx, resultSet) {
                d.resolve(self, resultSet);
            },
            wrappedErrorCallback = function (tx, error) {
                d.reject(self, error);

                return errorCallback(tx, error);
            };

        this._transaction.executeSql(sqlStatement, sqlArguments, successCallback, errorCallback ? wrappedErrorCallback : undefined);

        return d.promise();
    };

    window.DeferredSQLDatabase = function DeferredSQLDatabase(db) {
        this._database = db;
        this.version = db.version;
    }

    var openDatabaseDeferred = function openDatabase(name, version, displayName, estimatedSize, creationCallback) {
        var d = $.Deferred(),
            wrappedCreationCallback = function () {
                creationCallback(deferredDb);
            },
            db = window.openDatabase(name, version, displayName, estimatedSize, wrappedCreationCallback),
            deferredDb = new DeferredSQLDatabase(db);

        return deferredDb;
    };

    DeferredSQLDatabase.prototype.transaction = function transaction(callback) {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function () {
                d.resolve();
            },
            wrappedCallback = function (tx) {
                return callback(new DeferredSQLTransaction(tx));
            };

        this._database.transaction(wrappedCallback, errorCallback, successCallback);

        return d.promise();
    };

    DeferredSQLDatabase.prototype.readTransaction = function readTransaction(callback) {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function () {
                d.resolve();
            },
            wrappedCallback = function (tx) {
                return callback(new DeferredSQLTransaction(tx));
            };

        this._database.readTransaction(wrappedCallback, errorCallback, successCallback);

        return d.promise();
    };

    DeferredSQLDatabase.prototype.changeVersion = function changeVersion(oldVersion, newVersion, callback) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                self.version = self._database.version;
                d.reject(error);
            },
            successCallback = function () {
                self.version = self._database.version;
                d.resolve();
            },
            wrappedCallback = function (tx) {
                return callback(new DeferredSQLTransaction(tx));
            };

        this._database.changeVersion(oldVersion, newVersion, callback, errorCallback, successCallback);

        return d.promise();
    };

    window.openDatabaseDeferred = openDatabaseDeferred;

})(window, jQuery);
