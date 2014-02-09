(function (window, $, undefined) {

var fakeSQLTransaction,
    executeSqlPromise;

module('SQLTransaction', {
    setup: function () {
        executeSqlPromise = $.Deferred();
        fakeSQLTransaction = {
    };
    },
    teardown: function () {
        // clean up after each test
    }
});

test('executeSql executes provided query with arguments', function () {
    //Arrange
    var expectedSqlStatement = 'fakeSqlStatement',
        expectedSqlArguments = 'fakeSqlArguments'
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

test('executeSql rejects promise if error and executeSql is handling error', function () {
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
    deferredSQLTransaction.executeSql(expectedSqlStatement, expectedSqlArguments, true)
        .fail(function (actualSQLTransaction, actualError) {
            //Assert
            equal(actualSQLTransaction, deferredSQLTransaction, 'transaction is correct');
            equal(actualError, expectedError, 'error is correct');
        });
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

})(window, jQuery, undefined);