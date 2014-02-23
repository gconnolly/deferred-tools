(function (window, $, undefined) {

    var fakeFileSystem,
        fakeDirectoryEntry,
        fakeFileEntry;

    module('DeferredFileSystem', {
        setup: function () {
            fakeDirectoryEntry = {};

            fakeFileSystem = {
                root: fakeDirectoryEntry,
                name: 'fakeFileSystemName'
            };
        }
    });

    test('properties are copied from filesystem', function () {
        //Arrange

        //Act
        var deferredFileSystem = new DeferredFileSystem(fakeFileSystem);

        //Assert
        equal(deferredFileSystem.name, fakeFileSystem.name, 'name is correct');
        equal(deferredFileSystem.root, fakeFileSystem.root._entry, 'root is correct');
    });

    module('DeferredFileEntry', {
        setup: function () {
            fakeFileEntry = {
                isFile: 'fakeIsFile',
                isDirectory: 'fakeIsDirectory',
                name: 'fakeName',
                fullPath: 'fakeFullPath'
            };

            fakeFileSystem = {};
        }
    });

    test('properties are copied from fileEntry', function () {
        //Arrange

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);

        //Assert
        equal(deferredFileEntry.isFile, fakeFileEntry.isFile, 'isFile is correct');
        equal(deferredFileEntry.isDirectory, fakeFileEntry.isDirectory, 'isDirectory is correct');
        equal(deferredFileEntry.name, fakeFileEntry.name, 'name is correct');
        equal(deferredFileEntry.fullPath, fakeFileEntry.fullPath, 'fullPath is correct');
        equal(deferredFileEntry.filesystem, fakeFileSystem, 'filesystem is correct');
    });

    test('getMetadata resolves promise if successful', function () {
        //Arrange
        var expectedMetadata = 'expectedMetadata';

        fakeFileEntry.getMetadata = function (successCallback, errorCallback) {
            successCallback(expectedMetadata);
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.getMetadata()
            .done(function (actualMetadata) {
                //Assert
                equal(actualMetadata, expectedMetadata, 'metadata is correct');
            });
    });

    test('getMetadata rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError';

        fakeFileEntry.getMetadata = function (successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.getMetadata()
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

    test('copyTo executes with provided parent and new name', function () {
        //Arrange
        var expectedFileEntryCopy = {
                name: 'expectedFileEntryCopy',
                isFile: true,
                isDirectory: false
            },
            expectedParent = 'expectedParent',
            expectedNewName = 'expectedNewName';

        fakeFileEntry.copyTo = function (actualParent, actualNewName, successCallback, errorCallback) {
            equal(actualParent, expectedParent, 'parent is correct');
            equal(actualNewName, expectedNewName, 'newname is correct');
        };

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.copyTo(expectedParent, expectedNewName);
    });

    test('copyTo resolves promise if successful', function () {
        //Arrange
        var expectedFileEntryCopy = {
                name: 'expectedFileEntryCopy',
                isFile: true,
                isDirectory: false
            },
            expectedParent = 'expectedParent',
            expectedNewName = 'expectedNewName';

        fakeFileEntry.copyTo = function (actualParent, actualNewName, successCallback, errorCallback) {
            successCallback(expectedFileEntryCopy);
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.copyTo(expectedParent, expectedNewName)
                .done(function (actualFileEntryCopy) {
                    //Assert
                    equal(actualFileEntryCopy._entry, expectedFileEntryCopy, 'fileentry is correct');
                });
    });

    test('copyTo rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError',
                expectedParent = 'expectedParent',
                expectedNewName = 'expectedNewName';

        fakeFileEntry.copyTo = function (actualParent, actualNewName, successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.copyTo(expectedParent, expectedNewName)
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
        });

        test('moveTo executes with provided parent and new name', function () {
            //Arrange
            var expectedFileEntryMove = {
                    name: 'expectedFileEntryMove',
                    isFile: true,
                    isDirectory: false
                },
                expectedParent = 'expectedParent',
                expectedNewName = 'expectedNewName';

            fakeFileEntry.moveTo = function (actualParent, actualNewName, successCallback, errorCallback) {
                equal(actualParent, expectedParent, 'parent is correct');
                equal(actualNewName, expectedNewName, 'newname is correct');
            };

            //Act
            var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
            deferredFileEntry.moveTo(expectedParent, expectedNewName);
        });

        test('moveTo resolves promise if successful', function () {
            //Arrange
            var expectedFileEntryMove = {
                    name: 'expectedFileEntryMove',
                    isFile: true,
                    isDirectory: false
                },
                expectedParent = 'expectedParent',
                expectedNewName = 'expectedNewName';

            fakeFileEntry.moveTo = function (actualParent, actualNewName, successCallback, errorCallback) {
                successCallback(expectedFileEntryMove);
            }

            //Act
            var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
            deferredFileEntry.moveTo(expectedParent, expectedNewName)
                .done(function (actualFileEntryMove) {
                    //Assert
                    equal(actualFileEntryMove._entry, expectedFileEntryMove, 'fileentry is correct');
                });
        });

        test('moveTo rejects promise if error', function () {
            //Arrange
            var expectedError = 'expectedError',
                expectedParent = 'expectedParent',
                expectedNewName = 'expectedNewName';

            fakeFileEntry.moveTo = function (actualParent, actualNewName, successCallback, errorCallback) {
                errorCallback(expectedError);
            }

            //Act
            var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
            deferredFileEntry.moveTo(expectedParent, expectedNewName)
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
        });

        //remove
        //toURL
        //getParent
        //createWriter
        //file

    module('DeferredDirectoryEntry', {
        setup: function () {
            fakeDirectoryEntry = {
                isFile: 'fakeIsFile',
                isDirectory: 'fakeIsDirectory',
                name: 'fakeName',
                fullPath: 'fakeFullPath'
            };

            fakeFileSystem = {};
        }
    });

    test('properties are copied from directoryEntry', function () {
        //Arrange

        //Act
        var deferredDirectoryEntry = new DeferredFileEntry(fakeDirectoryEntry, fakeFileSystem);

        //Assert
        equal(deferredDirectoryEntry.isFile, fakeDirectoryEntry.isFile, 'isFile is correct');
        equal(deferredDirectoryEntry.isDirectory, fakeDirectoryEntry.isDirectory, 'isDirectory is correct');
        equal(deferredDirectoryEntry.name, fakeDirectoryEntry.name, 'name is correct');
        equal(deferredDirectoryEntry.fullPath, fakeDirectoryEntry.fullPath, 'fullPath is correct');
        equal(deferredDirectoryEntry.filesystem, fakeFileSystem, 'filesystem is correct');
    });

    test('getMetadata resolves promise if successful', function () {
        //Arrange
        var expectedMetadata = 'expectedMetadata';

        fakeDirectoryEntry.getMetadata = function (successCallback, errorCallback) {
            successCallback(expectedMetadata);
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.getMetadata()
            .done(function (actualMetadata) {
                //Assert
                equal(actualMetadata, expectedMetadata, 'metadata is correct');
            });
    });

    test('getMetadata rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError';

        fakeDirectoryEntry.getMetadata = function (successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.getMetadata()
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
        });

        test('copyTo executes with provided parent and new name', function () {
            //Arrange
            var expectedDirectoryEntryCopy = {
                    name: 'expectedFileEntryCopy',
                    isFile: true,
                    isDirectory: false
                },
                expectedParent = 'expectedParent',
                expectedNewName = 'expectedNewName';

            fakeDirectoryEntry.copyTo = function (actualParent, actualNewName, successCallback, errorCallback) {
                equal(actualParent, expectedParent, 'parent is correct');
                equal(actualNewName, expectedNewName, 'newname is correct');
            };

            //Act
            var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
            deferredDirectoryEntry.copyTo(expectedParent, expectedNewName);
        });

        test('copyTo resolves promise if successful', function () {
            //Arrange
            var expectedDirectoryEntryCopy = {
                    name: 'expectedDirectoryEntryCopy',
                    isFile: false,
                    isDirectory: true
                },
                expectedParent = 'expectedParent',
                expectedNewName = 'expectedNewName';

            fakeDirectoryEntry.copyTo = function (actualParent, actualNewName, successCallback, errorCallback) {
                successCallback(expectedDirectoryEntryCopy);
            }

            //Act
            var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
            deferredDirectoryEntry.copyTo(expectedParent, expectedNewName)
                .done(function (actualDirectoryEntryCopy) {
                    //Assert
                    equal(actualDirectoryEntryCopy._entry, expectedDirectoryEntryCopy, 'directoryentry is correct');
                });
        });

        test('copyTo rejects promise if error', function () {
            //Arrange
            var expectedError = 'expectedError',
                expectedParent = 'expectedParent',
                expectedNewName = 'expectedNewName';

            fakeDirectoryEntry.copyTo = function (actualParent, actualNewName, successCallback, errorCallback) {
                errorCallback(expectedError);
            }

            //Act
            var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
            deferredDirectoryEntry.copyTo(expectedParent, expectedNewName)
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
        });

        test('moveTo executes with provided parent and new name', function () {
            //Arrange
            var expectedDirectoryEntryMove = {
                    name: 'expectedDirectoryEntryMove',
                    isFile: true,
                    isDirectory: false
                },
                expectedParent = 'expectedParent',
                expectedNewName = 'expectedNewName';

            fakeDirectoryEntry.moveTo = function (actualParent, actualNewName, successCallback, errorCallback) {
                equal(actualParent, expectedParent, 'parent is correct');
                equal(actualNewName, expectedNewName, 'newname is correct');
            };

            //Act
            var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
            deferredDirectoryEntry.moveTo(expectedParent, expectedNewName);
        });

        test('moveTo resolves promise if successful', function () {
            //Arrange
            var expectedDirectoryEntryMove = {
                    name: 'expectedDirectoryEntryMove',
                    isFile: false,
                    isDirectory: true
                },
                expectedParent = 'expectedParent',
                expectedNewName = 'expectedNewName';

            fakeDirectoryEntry.moveTo = function (actualParent, actualNewName, successCallback, errorCallback) {
                successCallback(expectedDirectoryEntryMove);
            }

            //Act
            var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
            deferredDirectoryEntry.moveTo(expectedParent, expectedNewName)
                .done(function (actualDirectoryEntryMove) {
                    //Assert
                    equal(actualDirectoryEntryMove._entry, expectedDirectoryEntryMove, 'directoryentry is correct');
                });
        });

        test('moveTo rejects promise if error', function () {
            //Arrange
            var expectedError = 'expectedError',
                expectedParent = 'expectedParent',
                expectedNewName = 'expectedNewName';

            fakeDirectoryEntry.moveTo = function (actualParent, actualNewName, successCallback, errorCallback) {
                errorCallback(expectedError);
            }

            //Act
            var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
            deferredDirectoryEntry.moveTo(expectedParent, expectedNewName)
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
        });

        //remove
        //toURL
        //getParent
        //createReader
        //getFile
        //getDirectory
        //removeRecursively

    module('DeferredDirectoryReader', {
        setup: function () {
        }
    });

    //readEntries
})(window, jQuery, undefined);