module TSOS {
    export class Disk {
        public constructor(public tracks = 4,//number of tracks on the disk
            public sectors = 8,//number of sectors per track
            public blocks = 8,//number of blocks per sector
            public dataSize = 60) {//bytes of data that can be stored

        }
        public init() {

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
                        sessionStorage.setItem(key, JSON.stringify(block));
                    }
                }
            }
        }
    }
}