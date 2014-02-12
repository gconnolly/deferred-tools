(function (window, $, undefined) {

    function DeferredLocalFileSystem() {
        this.TEMPORARY = window.TEMPORARY;
        this.PERSISTENT = window.PERSISTENT;
    };

    var requestFileSystemDeferred = function requestFileSystemDeferred(type, size) {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (fileSystem) {
                d.resolve(new DeferredFileSystem(fileSystem));
            },
            requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

        requestFileSystem(type, size, successCallback, errorCallback);

        return d.promise();
    };

    var resolveLocalFileSystemURLDeferred = function resolveLocalFileSystemURLDeferred(url) {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, new DeferredFileSystem(entry.fileSystem)));
            },
            resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;

        resolveLocalFileSystemURL(url, successCallback, errorCallback);

        return d.promise();
    };

    function DeferredFileSystem(fileSystem) {
        this._fileSystem = fileSystem;

        this.name = fileSystem.name;
        this.root = wrapEntry(fileSystem.root, this);
    };

    function DeferredEntry(entry) {
        this._entry = entry;
    };

    DeferredEntry.prototype.getMetadata = function getMetadata() {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (metadata) {
                d.resolve(metadata);
            };

        this._entry.getMetadata(successCallback, errorCallback);

        return d.promise();
    };

    DeferredEntry.prototype.copyTo = function copyTo(parent, newName) {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, this._entry.fileSystem));
            };

        this._entry.copyTo(parent, newName, successCallback, errorCallback);

        return d.promise();
    };

    DeferredEntry.prototype.moveTo = function moveTo(parent, newName) {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, this._entry.fileSystem));
            };

        this._entry.moveTo(parent, newName, successCallback, errorCallback);

        return d.promise();
    };

    DeferredEntry.prototype.remove = function remove() {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function () {
                d.resolve();
            };

        this._entry.remove(successCallback, errorCallback);

        return d.promise();
    };

    DeferredEntry.prototype.toURL = function toURL() {
        return this.entry.toURL();
    };

    DeferredEntry.prototype.getParent = function getParent() {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, this._entry.fileSystem));
            };

        this._entry.remove(successCallback, errorCallback);

        return d.promise();
    };

    window.DeferredFileEntry = function DeferredFileEntry(fileEntry, fileSystem) {
        DeferredEntry.call(this, fileEntry);

        this.isFile = fileEntry.isFile;
        this.isDirectory = fileEntry.isDirectory;
        this.name = fileEntry.name;
        this.fullPath = fileEntry.fullPath;
        this.filesystem = filesystem;
    };

    DeferredFileEntry.prototype = new DeferredEntry();

    DeferredFileEntry.prototype.createWriter = function createWriter() {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (fileWriter) {
                d.resolve(fileWriter);
            };

        this._entry.createWriter(successCallback, errorCallback);

        return d.promise();
    };

    DeferredFileEntry.prototype.file = function file() {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (file) {
                d.resolve(file);
            };

        this._entry.file(successCallback, errorCallback);

        return d.promise();
    };

    window.DeferredDirectoryEntry = function DeferredDirectoryEntry(directoryEntry, fileSystem) {
        DeferredEntry.call(this, directoryEntry);

        this.isFile = directoryEntry.isFile;
        this.isDirectory = directoryEntry.isDirectory;
        this.name = directoryEntry.name;
        this.fullPath = directoryEntry.fullPath;
        this.filesystem = fileSystem;
    };

    DeferredDirectoryEntry.prototype = new DeferredEntry();

    DeferredDirectoryEntry.prototype.createReader = function createReader() {
        return new DeferredDirectoryReader(this._entry.createReader());
    };

    DeferredDirectoryEntry.prototype = new DeferredEntry();

    DeferredDirectoryEntry.prototype.getFile = function getFile(path, options) {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, this._entry.fileSystem));
            };

        this._entry.getFile(path, options, successCallback, errorCallback);

        return d.promise();
    };

    DeferredDirectoryEntry.prototype.getDirectory = function getDirectory(path, options) {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, this._entry.fileSystem));
            };

        this._entry.getDirectory(path, options, successCallback, errorCallback);

        return d.promise();
    };

    DeferredDirectoryEntry.prototype.removeRecursively = function removeRecursively() {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function () {
                d.resolve();
            };

        this._entry.remove(successCallback, errorCallback);

        return d.promise();
    };

    function DeferredDirectoryReader(directoryReader) {
        this._directoryReader = directoryReader;
    };

    DeferredDirectoryReader.prototype.readEntries = function readEntries() {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entries) {
                //wrap entries in 'Deferred' object.

                d.resolve(entries);
            };

        this._directoryReader.readEntries(successCallback, errorCallback);

        return d.promise();
    };

    function wrapEntry(entry, fileSystem) {
        if (entry.isFile) {
            return new DeferredFileEntry(entry, fileSystem);
        } else if (entry.isDirectory) {
            return new DeferredDirectoryEntry(entry, fileSystem);
        }
    }

    window.requestFileSystemDeferred = requestFileSystemDeferred;
    window.resolveLocalFileSystemURLDeferred = resolveLocalFileSystemURLDeferred;

})(window, jQuery);
