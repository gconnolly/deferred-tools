(function (window, $, undefined) {

    var requestFileSystemDeferred = function requestFileSystemDeferred(type, size) {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (filesystem) {
                d.resolve(new DeferredFileSystem(filesystem));
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
                d.resolve(wrapEntry(entry, new DeferredFileSystem(entry.filesystem)));
            },
            resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;

        resolveLocalFileSystemURL(url, successCallback, errorCallback);

        return d.promise();
    };

    window.DeferredFileSystem = function DeferredFileSystem(filesystem) {
        this._filesystem = filesystem;

        this.name = filesystem.name;
        this.root = wrapEntry(filesystem.root, this);
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
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, self._entry.filesystem));
            };

        this._entry.copyTo(parent, newName, successCallback, errorCallback);

        return d.promise();
    };

    DeferredEntry.prototype.moveTo = function moveTo(parent, newName) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, self._entry.filesystem));
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
                d.resolve(wrapEntry(entry, this._entry.filesystem));
            };

        this._entry.remove(successCallback, errorCallback);

        return d.promise();
    };

    window.DeferredFileEntry = function DeferredFileEntry(fileEntry, filesystem) {
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

    window.DeferredDirectoryEntry = function DeferredDirectoryEntry(directoryEntry, filesystem) {
        DeferredEntry.call(this, directoryEntry);

        this.isFile = directoryEntry.isFile;
        this.isDirectory = directoryEntry.isDirectory;
        this.name = directoryEntry.name;
        this.fullPath = directoryEntry.fullPath;
        this.filesystem = filesystem;
    };

    DeferredDirectoryEntry.prototype = new DeferredEntry();

    DeferredDirectoryEntry.prototype.createReader = function createReader() {
        return new DeferredDirectoryReader(this._entry.createReader(), this._entry.filesystem);
    };

    DeferredDirectoryEntry.prototype.getFile = function getFile(path, options) {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, this._entry.filesystem));
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
                d.resolve(wrapEntry(entry, this._entry.filesystem));
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

    function DeferredDirectoryReader(directoryReader, filesystem) {
        this._directoryReader = directoryReader;
        this._filesystem = filesystem
    };

    DeferredDirectoryReader.prototype.readEntries = function readEntries() {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entries) {
                var wrappedEntries = [];
                for (var i = 0; i < entries.length; i++) {
                    wrappedEntries.push(wrapEntry(entries[i], this._filesystem));
                }

                d.resolve(wrappedEntries);
            };

        this._directoryReader.readEntries(successCallback, errorCallback);

        return d.promise();
    };

    function wrapEntry(entry, filesystem) {
        if (entry.isFile) {
            return new DeferredFileEntry(entry, filesystem);
        } else if (entry.isDirectory) {
            return new DeferredDirectoryEntry(entry, filesystem);
        }
    }

    window.requestFileSystemDeferred = requestFileSystemDeferred;
    window.resolveLocalFileSystemURLDeferred = resolveLocalFileSystemURLDeferred;

})(window, jQuery);
