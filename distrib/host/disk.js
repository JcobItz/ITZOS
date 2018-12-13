var TSOS;
(function (TSOS) {
    var Disk = /** @class */ (function () {
        function Disk(tracks, //number of tracks on the disk
        sectors, //number of sectors per track
        blocks, //number of blocks per sector
        dataSize) {
            if (tracks === void 0) { tracks = 4; }
            if (sectors === void 0) { sectors = 8; }
            if (blocks === void 0) { blocks = 8; }
            if (dataSize === void 0) { dataSize = 60; }
            this.tracks = tracks;
            this.sectors = sectors;
            this.blocks = blocks;
            this.dataSize = dataSize;
        }
        Disk.prototype.init = function () {
            //loads data with zeros, and sets all pointers to 0:0:0
            for (var t = 0; t < this.tracks; t++) {
                for (var s = 0; s < this.sectors; s++) {
                    for (var b = 0; b < this.blocks; b++) {
                        var key = t + ":" + s + ":" + b;
                        var data = new Array();
                        for (var d = 0; d < this.dataSize; d++) {
                            data.push("00");
                        }
                        var block = {
                            availableBit: "0",
                            pointer: "0:0:0",
                            data: data
                        };
                        sessionStorage.setItem(key, JSON.stringify(block)); //push each one to session storage
                    }
                }
            }
        };
        return Disk;
    }());
    TSOS.Disk = Disk;
})(TSOS || (TSOS = {}));
