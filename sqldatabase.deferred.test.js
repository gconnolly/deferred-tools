(function (window, $, undefined) {

    var fakeSQLTransaction,
        fakeSQLDatabase;

    module('SQLTransaction', {
        setup: function () {
            fakeSQLTransaction = {};
            fakeSQLDatabase = {};
        }
    });

    test('executeSql executes provided query with arguments', function () {
        //Arrange
        var expectedSqlStatement = 'fakeSqlStatement',
            expectedSqlArguments = 'fakeSqlArguments',
            deferredSQLTransaction = new DeferredSQLTransaction(fakeSQLTransaction);

        fakeSQLTransaction.executeSql = function (actualSqlStatement, actualSqlArguments, successCallback, errorCallback) {
            //Assert
            equal(actualSqlStatement, expectedSqlStatement, 'query is correct');
            equal(actualSqlArguments, expectedSqlArguments, 'arguments are correct');
        }

        //Act
        deferredSQLTransaction.executeSql(expectedSqlStatement, expectedSqlArguments);
    });

    test('executeSql resolves promise if successful', function () {
        //Arrange
        var expectedSqlStatement = 'fakeSqlStatement',
            expectedSqlArguments = 'fakeSqlArguments',
            expectedResults = 'fakeResults',
            deferredSQLTransaction = new DeferredSQLTransaction(fakeSQLTransaction);

        fakeSQLTransaction.executeSql = function (actualSqlStatement, actualSqlArguments, successCallback, errorCallback) {
            successCallback(fakeSQLTransaction, expectedResults);
        }

        //Act
        deferredSQLTransaction.executeSql(expectedSqlStatement, expectedSqlArguments)
            .done(function (actualSQLTransaction, actualResults) {
                //Assert
                equal(actualSQLTransaction, deferredSQLTransaction, 'transaction is correct');
                equal(actualResults, expectedResults, 'results are correct');
            });
    });

    test('executeSql rejects promise if error and error callback provided', function () {
        //Arrange
        var expectedSqlStatement = 'fakeSqlStatement',
            expectedSqlArguments = 'fakeSqlArguments',
            expectedError = 'fakeError',
            deferredSQLTransaction = new DeferredSQLTransaction(fakeSQLTransaction);

        fakeSQLTransaction.executeSql = function (actualSqlStatement, actualSqlArguments, successCallback, errorCallback) {
            if (errorCallback) {
                errorCallback(fakeSQLTransaction, expectedError);
            }
        }

        //Act
        deferredSQLTransaction.executeSql(expectedSqlStatement, expectedSqlArguments, $.noop)
            .fail(function (actualSQLTransaction, actualError) {
                //Assert
                equal(actualSQLTransaction, deferredSQLTransaction, 'transaction is correct');
                equal(actualError, expectedError, 'error is correct');
            });
    });

    test('executeSql calls error callback if error and error callback provided', function () {
        //Arrange
        var expectedSqlStatement = 'fakeSqlStatement',
            expectedSqlArguments = 'fakeSqlArguments',
            expectedError = 'fakeError',
            expectedErrorCallback = function () {
                ok(true, 'error callback is called');
            },
            deferredSQLTransaction = new DeferredSQLTransaction(fakeSQLTransaction);

        fakeSQLTransaction.executeSql = function (actualSqlStatement, actualSqlArguments, successCallback, errorCallback) {
            if (errorCallback) {
                errorCallback(fakeSQLTransaction, expectedError);
            }
        }

        //Act
        deferredSQLTransaction.executeSql(expectedSqlStatement, expectedSqlArguments, expectedErrorCallback);
    });

    test('executeSql does not resolve or reject promise if error and executeSql not handling error', function () {
        //Arrange
        var expectedSqlStatement = 'fakeSqlStatement',
            expectedSqlArguments = 'fakeSqlArguments',
            expectedError = 'fakeError',
            deferredSQLTransaction = new DeferredSQLTransaction(fakeSQLTransaction);

        fakeSQLTransaction.executeSql = function (actualSqlStatement, actualSqlArguments, successCallback, errorCallback) {
            if (errorCallback) {
                errorCallback(fakeSQLTransaction, expectedError);
            }
        }

        //Act
        expect(0);

        deferredSQLTransaction.executeSql(expectedSqlStatement, expectedSqlArguments, false)
            .fail(function () {
                //Assert
                ok(true, 'executeSql should not fail');
            })
            .done(function () {
                //Assert
                ok(true, 'executeSql should not done');
            });
    });

    module('SQLDatabase', {
        setup: function () {
            fakeSQLDatabase = {
                version: 'fakeVersion'
            };
        }
    });

    test('DeferredSQLDatabase takes the version of the SQLDatabase', function () {
        //Arrange
        //Act
        var deferredSQLDatabase = new DeferredSQLDatabase(fakeSQLDatabase);

        //Assert
        equal(deferredSQLDatabase.version, fakeSQLDatabase.version, 'version is correct');
    });

    test('transaction executes callback', function () {
        //Arrange
        var deferredSQLDatabase = new DeferredSQLDatabase(fakeSQLDatabase),
            expectedCallback = function () {
                return 'fakeCallback';
            };

        fakeSQLDatabase.transaction = function (actualCallback, errorCallback, successCallback) {
            //Assert
            equal(actualCallback(), expectedCallback(), 'callback is correct');
        }

        //Act
        deferredSQLDatabase.transaction(expectedCallback);
    });

    test('transaction resolves promise if successful', function () {
        //Arrange
        var deferredSQLDatabase = new DeferredSQLDatabase(fakeSQLDatabase),
            expectedCallback = function () {
                return 'fakeCallback';
            };

        fakeSQLDatabase.transaction = function (actualCallback, errorCallback, successCallback) {
            successCallback();
        };

        //Act
        deferredSQLDatabase.transaction(expectedCallback)
            .done(function () {
                //Assert
                ok(true, 'transaction is resolved');
            });
    });

    test('transaction rejects promise if error', function () {
        //Arrange
        var deferredSQLDatabase = new DeferredSQLDatabase(fakeSQLDatabase),
            expectedError = 'fakeError',
            expectedCallback = function () {
                return 'fakeCallback';
            };

        fakeSQLDatabase.transaction = function (actualCallback, errorCallback, successCallback) {
            errorCallback(expectedError);
        };

        //Act
        deferredSQLDatabase.transaction(expectedCallback)
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

    test('readTransaction executes callback', function () {
        //Arrange
        var deferredSQLDatabase = new DeferredSQLDatabase(fakeSQLDatabase),
            expectedCallback = function () {
                return 'fakeCallback';
            };

        fakeSQLDatabase.readTransaction = function (actualCallback, errorCallback, successCallback) {
            //Assert
            equal(actualCallback(), expectedCallback(), 'callback is correct');
        }

        //Act
        deferredSQLDatabase.readTransaction(expectedCallback);
    });

    test('readTransaction resolves promise if successful', function () {
        //Arrange
        var deferredSQLDatabase = new DeferredSQLDatabase(fakeSQLDatabase),
            expectedCallback = function () {
                return 'fakeCallback';
            };

        fakeSQLDatabase.readTransaction = function (actualCallback, errorCallback, successCallback) {
            successCallback();
        };

        //Act
        deferredSQLDatabase.readTransaction(expectedCallback)
            .done(function () {
                //Assert
                ok(true, 'transaction is resolved');
            });
    });

    test('readTransaction rejects promise if error', function () {
        //Arrange
        var deferredSQLDatabase = new DeferredSQLDatabase(fakeSQLDatabase),
            expectedError = 'fakeError',
            expectedCallback = function () {
                return 'fakeCallback';
            };

        fakeSQLDatabase.readTransaction = function (actualCallback, errorCallback, successCallback) {
            errorCallback(expectedError);
        };

        //Act
        deferredSQLDatabase.readTransaction(expectedCallback)
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

    test('changeVersion executes callback', function () {
        //Arrange
        var deferredSQLDatabase = new DeferredSQLDatabase(fakeSQLDatabase),
            expectedOldVersion = 'expectedOldVersion',
            expectedNewVersion = 'expectedNewVersion',
            expectedCallback = function () {
                return 'fakeCallback';
            };

        fakeSQLDatabase.changeVersion = function (actualOldVersion, actualNewVersion, actualCallback, errorCallback, successCallback) {
            //Assert
            equal(actualCallback(), expectedCallback(), 'callback is correct');
        }

        //Act
        deferredSQLDatabase.changeVersion(expectedOldVersion, expectedNewVersion, expectedCallback);
    });

    test('changeVersion resolves promise if successful', function () {
        //Arrange
        var deferredSQLDatabase = new DeferredSQLDatabase(fakeSQLDatabase),
            expectedOldVersion = 'expectedOldVersion',
            expectedNewVersion = 'expectedNewVersion',
            expectedCallback = function () {
                return 'fakeCallback';
            };

        fakeSQLDatabase.changeVersion = function (actualOldVersion, actualNewVersion, actualCallback, errorCallback, successCallback) {
            successCallback();
        };

        //Act
        deferredSQLDatabase.changeVersion(expectedOldVersion, expectedNewVersion, expectedCallback)
        .done(function () {
            //Assert
            ok(true, 'transaction is resolved');
            equal(deferredSQLDatabase.version, fakeSQLDatabase.version, 'version is correct');
        });
    });

    test('changeVersion rejects promise if error', function () {
        //Arrange
        var deferredSQLDatabase = new DeferredSQLDatabase(fakeSQLDatabase),
            expectedOldVersion = 'expectedOldVersion',
            expectedNewVersion = 'expectedNewVersion',
            expectedError = 'fakeError',
            expectedCallback = function () {
                return 'fakeCallback';
            };

        fakeSQLDatabase.changeVersion = function (actualOldVersion, actualNewVersion, actualCallback, errorCallback, successCallback) {
            errorCallback(expectedError);
        };

        //Act
        deferredSQLDatabase.changeVersion(expectedOldVersion, expectedNewVersion, expectedCallback)
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
                equal(deferredSQLDatabase.version, fakeSQLDatabase.version, 'version is correct');
            });
    });

})(window, jQuery, undefined);