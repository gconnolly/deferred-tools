(function (window, $, undefined) {

    function wrapEntry(entry, filesystem) {
        if (entry.isFile) {
            return new window.DeferredFileEntry(entry, filesystem);
        }
        if (entry.isDirectory) {
            return new window.DeferredDirectoryEntry(entry, filesystem);
        }
    }

    window.DeferredFileSystem = function DeferredFileSystem(filesystem) {
        this._filesystem = filesystem;

        this.name = filesystem.name;
        this.root = wrapEntry(filesystem.root, this);
    };

    window.DeferredDirectoryReader = function DeferredDirectoryReader(directoryReader, filesystem) {
        this._directoryReader = directoryReader;
        this._filesystem = filesystem;
    };

    window.DeferredDirectoryReader.prototype.readEntries = function readEntries() {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entries) {
                var wrappedEntries = [],
                    i;

                for (i = 0; i < entries.length; i++) {
                    wrappedEntries.push(wrapEntry(entries[i], this._filesystem));
                }

                d.resolve(wrappedEntries);
            };

        this._directoryReader.readEntries(successCallback, errorCallback);

        return d.promise();
    };

    function DeferredEntry(entry) {
        this._entry = entry;
    }

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
        return this._entry.toURL();
    };

    DeferredEntry.prototype.getParent = function getParent() {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, self._entry.filesystem));
            };

        this._entry.getParent(successCallback, errorCallback);

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

    window.DeferredFileEntry.prototype = new DeferredEntry();

    window.DeferredFileEntry.prototype.createWriter = function createWriter() {
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

    window.DeferredFileEntry.prototype.file = function file() {
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

    window.DeferredDirectoryEntry.prototype = new DeferredEntry();

    window.DeferredDirectoryEntry.prototype.createReader = function createReader() {
        return new window.DeferredDirectoryReader(this._entry.createReader(), this._entry.filesystem);
    };

    window.DeferredDirectoryEntry.prototype.getFile = function getFile(path, options) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, self._entry.filesystem));
            };

        this._entry.getFile(path, options, successCallback, errorCallback);

        return d.promise();
    };

    window.DeferredDirectoryEntry.prototype.getDirectory = function getDirectory(path, options) {
        var self = this,
            d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, self._entry.filesystem));
            };

        this._entry.getDirectory(path, options, successCallback, errorCallback);

        return d.promise();
    };

    window.DeferredDirectoryEntry.prototype.removeRecursively = function removeRecursively() {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function () {
                d.resolve();
            };

        this._entry.removeRecursively(successCallback, errorCallback);

        return d.promise();
    };

    window.requestFileSystemDeferred = function requestFileSystemDeferred(type, size) {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (filesystem) {
                d.resolve(new window.DeferredFileSystem(filesystem));
            },
            requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

        requestFileSystem(type, size, successCallback, errorCallback);

        return d.promise();
    };

    window.resolveLocalFileSystemURLDeferred = function resolveLocalFileSystemURLDeferred(url) {
        var d = $.Deferred(),
            errorCallback = function (error) {
                d.reject(error);
            },
            successCallback = function (entry) {
                d.resolve(wrapEntry(entry, new window.DeferredFileSystem(entry.filesystem)));
            },
            resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;

        resolveLocalFileSystemURL(url, successCallback, errorCallback);

        return d.promise();
    };

})(window, jQuery);
