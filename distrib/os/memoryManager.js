var TSOS;
(function (TSOS) {
    var memoryManager = /** @class */ (function () {
        function memoryManager(lim, partitions) {
            if (lim === void 0) { lim = 256; }
            if (partitions === void 0) { partitions = []; }
            this.lim = lim;
            this.partitions = partitions;
            this.lim = 256;
            ///Memory separated into 3 partitions
            this.partitions = [
                { "base": 0, "limit": this.lim, "isEmpty": true },
                { "base": 256, "limit": this.lim, "isEmpty": true },
                { "base": 512, "limit": this.lim, "isEmpty": true }
            ];
        }
        //loads program into memory
        memoryManager.prototype.loadIn = function (codes, part) {
            var next = this.partitions[part].base;
            var start = next;
            for (var i = 0; i < codes.length; i++) {
                var op_code = codes[i];
                _Mem.memoryArr[next] = op_code;
                TSOS.Control.hostLog("Loaded " + op_code, "MemoryManager");
                next++;
            }
            //fill the remaining space in the partition with zeros
            for (var j = next; j < this.partitions[part].limit; j++) {
                _Mem.memoryArr[j] = "00";
            }
            this.partitions[part].isEmpty = false;
            TSOS.Control.hostMemory();
            var p = new TSOS.PCB(_ProcessManager.size());
            p.init(1, 0, codes.size);
            _ProcessManager.load(p);
            _StdOut.putText("Program loaded with pid " + p.pid);
            return;
        };
        //check if there is enough space for the given op codes where size = the number of op codes
        memoryManager.prototype.hasSpace = function (size) {
            for (var i = 0; i < this.partitions.length; i++) {
                if (this.partitions[i].isEmpty && this.partitions[i].limit >= size) {
                    return true;
                }
            }
            return false;
        };
        //returns the limit of the specified partition(p)
        memoryManager.prototype.getLimit = function (p) {
            return this.partitions[p].limit;
        };
        //returns the base of the specified partition(p)
        memoryManager.prototype.getBase = function (p) {
            return this.partitions[p].base;
        };
        return memoryManager;
    }());
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
