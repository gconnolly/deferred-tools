(function (window, $, undefined) {

    function DeferredSQLTransaction(tx) {
        this.transaction = tx;
    };

    DeferredSQLTransaction.prototype.executeSql = function executeSql(sqlStatement, sqlArguments) {
        var self = this,
            d = $.Deferred(),
            successCallback = function (tx, resultSet) {
                d.resolve(self, resultSet);
            },
            errorCallback = function (tx, error) {
                d.reject(self, error);
                return true;
            };

        self.transaction.executeSql(sqlStatement, sqlArguments, successCallback, errorCallback);

        return d.promise();
    };

    function DeferredSQLDatabase(db) {
        this.database = db;
        this.version = db.version;
    }

    var openDatabaseDeferred = function openDatabase(name, version, displayName, estimatedSize, creationCallback) {
        var self = this,
            d = $.Deferred(),
            wrappedCreationCallback = function () {
                creationCallback(deferredDb);
            },
            db = window.openDatabase(name, version, displayName, estimatedSize, wrappedCreationCallback),
            deferredDb = new DeferredSQLDatabase(db);

        return deferredDb;
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
            successCallback = function () {
                d.resolve();
            },
            wrappedCallback = function (tx) {
                callback(new DeferredSQLTransaction(tx));
            };

        self.database.readTransaction(wrappedCallback, errorCallback, successCallback);

        return d.promise();
    };

    DeferredSQLDatabase.prototype.changeVersion = function changeVersion(oldVersion, newVersion, callback) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function () {
                self.version = self.database.version;
                d.resolve();
            },
            wrappedCallback = function (tx) {
                callback(new DeferredSQLTransaction(tx));
            };

        self.database.changeVersion(oldVersion, newVersion, callback, errorCallback, successCallback);

        return d.promise();
    };

    window.openDatabaseDeferred = openDatabaseDeferred;

})(window, jQuery);
