(function (window, $, undefined) {

    var fakeFileSystem,
        fakeDirectoryEntry,
        fakeFileEntry,
        fakeDirectoryReader;

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

    test('remove resolves promise if successful', function () {
        //Arrange
        fakeFileEntry.remove = function (successCallback, errorCallback) {
            successCallback();
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.remove()
                .done(function () {
                    //Assert
                    ok(true, 'remove is correct');
                });
    });

    test('remove rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError';

        fakeFileEntry.remove = function (successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.remove()
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

    test('toURL executes toURL on file entry', function () {
        //Arrange
        var expectedToURL = 'expectedToURL';
        fakeFileEntry.toURL = function () {
            return expectedToURL;
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        var actualToURL = deferredFileEntry.toURL();

        equal(actualToURL, expectedToURL, 'toURL is correct');
    });

    test('getParent resolves promise if successful', function () {
        //Arrange
        var expectedParentEntry = {
            name: 'expectedParentEntry',
            isFile: false,
            isDirectory: true
        };

        fakeFileEntry.getParent = function (successCallback, errorCallback) {
            successCallback(expectedParentEntry);
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.getParent()
                .done(function (actualParentEntry) {
                    //Assert
                    equal(actualParentEntry._entry, expectedParentEntry, 'getParent is correct');
                });
    });

    test('getParent rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError';

        fakeFileEntry.getParent = function (successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.getParent()
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

    test('createWriter resolves promise if successful', function () {
        //Arrange
        var expectedFileWriter = 'expectedFileWriter';

        fakeFileEntry.createWriter = function (successCallback, errorCallback) {
            successCallback(expectedFileWriter);
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.createWriter()
                .done(function (actualFileWriter) {
                    //Assert
                    equal(actualFileWriter, expectedFileWriter, 'fileWriter is correct');
                });
    });

    test('createWriter rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError';

        fakeFileEntry.createWriter = function (successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.createWriter()
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

    test('file resolves promise if successful', function () {
        //Arrange
        var expectedFile = 'expectedFile';

        fakeFileEntry.file = function (successCallback, errorCallback) {
            successCallback(expectedFile);
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.file()
                .done(function (actualFile) {
                    //Assert
                    equal(actualFile, expectedFile, 'file is correct');
                });
    });

    test('file rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError';

        fakeFileEntry.file = function (successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredFileEntry = new DeferredFileEntry(fakeFileEntry, fakeFileSystem);
        deferredFileEntry.file()
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

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

    test('remove resolves promise if successful', function () {
        //Arrange
        fakeDirectoryEntry.remove = function (successCallback, errorCallback) {
            successCallback();
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.remove()
            .done(function () {
                //Assert
                ok(true, 'remove is correct');
            });
    });

    test('remove rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError';

        fakeDirectoryEntry.remove = function (successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.remove()
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

    test('toURL executes toURL on directory entry', function () {
        //Arrange
        var expectedToURL = 'expectedToURL';
        fakeDirectoryEntry.toURL = function () {
            return expectedToURL;
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        var actualToURL = deferredDirectoryEntry.toURL();

        equal(actualToURL, expectedToURL, 'toURL is correct');
    });

    test('getParent resolves promise if successful', function () {
        //Arrange
        var expectedParentEntry = {
            name: 'expectedParentEntry',
            isFile: false,
            isDirectory: true
        };

        fakeDirectoryEntry.getParent = function (successCallback, errorCallback) {
            successCallback(expectedParentEntry);
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.getParent()
                .done(function (actualParentEntry) {
                    //Assert
                    equal(actualParentEntry._entry, expectedParentEntry, 'getParent is correct');
                });
    });

    test('getParent rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError';

        fakeDirectoryEntry.getParent = function (successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.getParent()
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

    test('createReader executes toURL on directory entry', function () {
        //Arrange
        var expectedDirectoryReader = 'expectedDirectoryReader';
        fakeDirectoryEntry.createReader = function () {
            return expectedDirectoryReader;
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        var actualDirectoryReader = deferredDirectoryEntry.createReader();

        equal(actualDirectoryReader._directoryReader, expectedDirectoryReader, 'createReader is correct');
    });

    test('getFile executes with provided path and options', function () {
        //Arrange
        var expectedPath = 'expectedPath',
                expectedOptions = 'expectedOptions';

        fakeDirectoryEntry.getFile = function (actualPath, actualOptions, successCallback, errorCallback) {
            equal(actualPath, expectedPath, 'path is correct');
            equal(actualOptions, expectedOptions, 'options is correct');
        };

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.getFile(expectedPath, expectedOptions);
    });

    test('getFile resolves promise if successful', function () {
        //Arrange
        var expectedFileEntry = {
                name: 'expectedFileEntry',
                isFile: true,
                isDirectory: false
            },
            expectedPath = 'expectedPath',
            expectedOptions = 'expectedOptions';

        fakeDirectoryEntry.getFile = function (actualPath, actualOptions, successCallback, errorCallback) {
            successCallback(expectedFileEntry);
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.getFile(expectedPath, expectedOptions)
                .done(function (actualFileEntry) {
                    //Assert
                    equal(actualFileEntry._entry, expectedFileEntry, 'getFile is correct');
                });
    });

    test('getFile rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError',
            expectedPath = 'expectedPath',
            expectedOptions = 'expectedOptions';

        fakeDirectoryEntry.getFile = function (actualPath, actualOptions, successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.getFile(expectedPath, expectedOptions)
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

    test('getDirectory executes with provided path and options', function () {
        //Arrange
        var expectedPath = 'expectedPath',
            expectedOptions = 'expectedOptions';

        fakeDirectoryEntry.getDirectory = function (actualPath, actualOptions, successCallback, errorCallback) {
            equal(actualPath, expectedPath, 'path is correct');
            equal(actualOptions, expectedOptions, 'options is correct');
        };

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.getDirectory(expectedPath, expectedOptions);
    });

    test('getDirectory resolves promise if successful', function () {
        //Arrange
        var expectedDirectoryEntry = {
                name: 'expectedDirectoryEntry',
                isFile: false,
                isDirectory: true
            },
            expectedPath = 'expectedPath',
            expectedOptions = 'expectedOptions';

        fakeDirectoryEntry.getDirectory = function (actualPath, actualOptions, successCallback, errorCallback) {
            successCallback(expectedDirectoryEntry);
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.getDirectory(expectedPath, expectedOptions)
                .done(function (actualDirectoryEntry) {
                    //Assert
                    equal(actualDirectoryEntry._entry, expectedDirectoryEntry, 'getDirectory is correct');
                });
    });

    test('getDirectory rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError',
            expectedPath = 'expectedPath',
            expectedOptions = 'expectedOptions';

        fakeDirectoryEntry.getDirectory = function (actualPath, actualOptions, successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.getDirectory(expectedPath, expectedOptions)
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

    test('removeRecursively resolves promise if successful', function () {
        //Arrange
        fakeDirectoryEntry.removeRecursively = function (successCallback, errorCallback) {
            successCallback();
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.removeRecursively()
                .done(function () {
                    //Assert
                    ok(true, 'removeRecursively is correct');
                });
    });

    test('removeRecursively rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError';

        fakeDirectoryEntry.removeRecursively = function (successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredDirectoryEntry = new DeferredDirectoryEntry(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryEntry.removeRecursively()
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

    module('DeferredDirectoryReader', {
        setup: function () {
            fakeDirectoryReader = {};
        }
    });

    test('readEntries resolves promise if successful', function () {
        //Arrange
        var expectedEntries = [{
            name: 'expectedEntry1',
            isFile: false,
            isDirectory: true
        },
        {
            name: 'expectedEntry2',
            isFile: true,
            isDirectory: false
        }];

        fakeDirectoryReader.readEntries = function (successCallback, errorCallback) {
            successCallback(expectedEntries);
        }

        //Act
        var deferredDirectoryReader = new DeferredDirectoryReader(fakeDirectoryReader, fakeFileSystem);
        deferredDirectoryReader.readEntries()
                .done(function (actualEntries) {
                    //Assert
                    for (var i = 0; i < expectedEntries.length; i++) {
                        equal(actualEntries[i]._entry, expectedEntries[i], 'entry is correct');
                    }
                });
    });

    test('readEntries rejects promise if error', function () {
        //Arrange
        var expectedError = 'expectedError';

        fakeDirectoryEntry.readEntries = function (successCallback, errorCallback) {
            errorCallback(expectedError);
        }

        //Act
        var deferredDirectoryReader = new DeferredDirectoryReader(fakeDirectoryEntry, fakeFileSystem);
        deferredDirectoryReader.readEntries()
            .fail(function (actualError) {
                //Assert
                equal(actualError, expectedError, 'error is correct');
            });
    });

    //readEntries
})(window, jQuery, undefined);