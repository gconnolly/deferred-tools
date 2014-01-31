(function (window, $, undefined) {

    function DeferredLocalFileSystem() {
        this.TEMPORARY = window.TEMPORARY;
        this.PERSISTENT = window.PERSISTENT;
    };

    DeferredLocalFileSystem.prototype.requestFileSystem = function requestFileSystem(type, size) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (fileSystem) {
                d.resolve(new DeferredFileSystem(fileSystem));
            };

        window.requestFileSystem(type, size, successCallback, errorCallback);

        return d.promise();
    };

    DeferredLocalFileSystem.prototype.resolveLocalFileSystemURL = function resolveLocalFileSystemURL(url) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(new DeferredEntry(entry));
            };

        window.resolveLocalFileSystemURL(url, successCallback, errorCallback);

        return d.promise();
    };

    function DeferredFileSystem(fileSystem) {
        var self = this;

        //
        self.fileSystem = fileSystem;

        //
        self.name = fileSystem.name;
        self.root = fileSystem.root;
    };

    function DeferredEntry(entry) {
        var self = this;

        //
        self.entry = entry;

        //
        self.isFile = entry.isFile;
        self.isDirectory = entry.isDirectory;
        self.name = entry.name;
        self.fullPath = entry.fullPath;
        self.filesystem = entry.filesystem;
    };

    DeferredEntry.prototype.getMetadata = function getMetadata() {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (metadata) {
                d.resolve(metadata);
            };

        self.entry.getMetadata(successCallback, errorCallback);

        return d.promise();
    };

    DeferredEntry.prototype.copyTo = function copyTo(parent, newName) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(new DeferredEntry(entry));
            };

        self.entry.copyTo(parent, newName, successCallback, errorCallback);

        return d.promise();
    };

    DeferredEntry.prototype.moveTo = function moveTo(parent, newName) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(new DeferredEntry(entry));
            };

        self.entry.moveTo(parent, newName, successCallback, errorCallback);

        return d.promise();
    };

    DeferredEntry.prototype.remove = function remove() {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function () {
                d.resolve();
            };

        self.entry.remove(successCallback, errorCallback);

        return d.promise();
    };

    DeferredEntry.prototype.toURL = function toURL() {
        var self = this;

        return self.entry.toURL();
    };

    DeferredEntry.prototype.getParent = function getParent() {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(new DeferredEntry(entry));
            };

        self.entry.remove(successCallback, errorCallback);

        return d.promise();
    };

    function DeferredFileEntry(fileEntry) {
        this.entry = fileEntry;
    };

    DeferredFileEntry.prototype.createWriter = function createWriter() {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (fileWriter) {
                d.resolve(fileWriter);
            };

        self.entry.createWriter(successCallback, errorCallback);

        return d.promise();
    };

    DeferredFileEntry.prototype.file = function file() {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (file) {
                d.resolve(file);
            };

        self.entry.file(successCallback, errorCallback);

        return d.promise();
    };

    function DeferredDirectoryEntry(directoryEntry) {
        this.entry = directoryEntry;
    };

    DeferredDirectoryEntry.prototype.createReader = function createReader() {
        return new DeferredDirectoryReader(self.directoryEntry.createReader());
    };

    DeferredDirectoryEntry.prototype.getFile = function getFile(path, options) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(new DeferredEntry(entry));
            };

        self.entry.getFile(path, options, successCallback, errorCallback);

        return d.promise();
    };

    DeferredDirectoryEntry.prototype.getDirectory = function getDirectory(path, options) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(new DeferredEntry(entry));
            };

        self.entry.getDirectory(path, options, successCallback, errorCallback);

        return d.promise();
    };

    DeferredDirectoryEntry.prototype.removeRecursively = function removeRecursively() {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function () {
                d.resolve();
            };

        self.entry.remove(successCallback, errorCallback);

        return d.promise();
    };

    function DeferredDirectoryReader(directoryReader) {
        this.directoryReader = directoryReader;
    };

    DeferredDirectoryReader.prototype.readEntries = function readEntries() {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entries) {
                //wrap entries in 'Deferred' object.

                d.resolve(entries);
            };

        self.directoryReader.readEntries(successCallback, errorCallback);

        return d.promise();
    };

})(window, jQuery);
