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

    test('name is the name of the filesystem', function () {
        //Arrange

        //Act
        var deferredFileSystem = new DeferredFileSystem(fakeFileSystem);

        //Assert
        equal(deferredFileSystem.name, fakeFileSystem.name, 'name is correct');
    });

    test('root is the deferred root of the filesystem', function () {
        //Arrange

        //Act
        var deferredFileSystem = new DeferredFileSystem(fakeFileSystem);

        //Assert
        equal(deferredFileSystem.root, fakeFileSystem.root._entry, 'name is correct');
    });

    module('DeferredFileEntry', {
        setup: function () {
        }
    });

    test('', function () {
        //Arrange
        expect(0);

        //Act
        //Assert
    });

    module('DeferredDirectoryEntry', {
        setup: function () {
        }
    });

    test('', function () {
        //Arrange
        expect(0);

        //Act
        //Assert
    });

    module('DeferredFileEntry', {
        setup: function () {
        }
    });

    test('', function () {
        //Arrange
        expect(0);

        //Act
        //Assert
    });

    module('DeferredDirectoryReader', {
        setup: function () {
        }
    });

    test('', function () {
        //Arrange
        expect(0);

        //Act
        //Assert
    });
})(window, jQuery, undefined);