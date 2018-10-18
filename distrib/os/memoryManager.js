var TSOS;
(function (TSOS) {
    var memoryManager = /** @class */ (function () {
        function memoryManager(lim, partitions) {
            if (lim === void 0) { lim = 256; }
            if (partitions === void 0) { partitions = []; }
            this.lim = lim;
            this.partitions = partitions;
            this.lim = 256;
            ///Memory separated into 3 partitions of 256 bytes each
            this.partitions = [
                { "base": 0, "limit": this.lim, "isEmpty": true },
                { "base": 256, "limit": this.lim, "isEmpty": true },
                { "base": 512, "limit": this.lim, "isEmpty": true }
            ];
        }
        //loads program into memory
        memoryManager.prototype.loadIn = function (codes, part) {
            var next = this.nextAvailable(part); //this is the next available memory location
            var start = next; //save the starting location of the first op code
            for (var i = 0; i < codes.length; i++) {
                var op_code = codes[i];
                _Mem.memoryArr[next] = op_code; //insert the code into the memory array
                TSOS.Control.hostLog("Loaded " + op_code, "MemoryManager");
                next++; //increment the next available location pointer
            }
            //fill the remaining space in the partition with zeros
            for (var j = next; j < this.partitions[part].limit; j++) {
                _Mem.memoryArr[j] = "00";
            }
            this.partitions[part].isEmpty = false; //set the empty indicator accordingly
            TSOS.Control.hostMemory(); //update memory 
            var p = new TSOS.PCB(_ProcessManager.processArr.length); // create new pcb object
            //TODO: update PCB display
            p.init(1, 0, codes.size); //initialize the pcb
            _ProcessManager.load(p); //load it into the process manager
            _StdOut.putText("Program loaded with pid " + p.pid); //return the pid to the user so they can run it
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
        memoryManager.prototype.nextAvailable = function (partition) {
            //loops through the specified partition and returns the first available index
            for (var i = this.partitions[partition].base; i < this.partitions[partition].base + this.partitions[partition].limit; i++) {
                if (_Mem.memoryArr[i] == "00") {
                    if (!this.partitions[partition].isEmpty) { //if the partition is not empty 
                        return i + 1; //return i+1 so the previous process is followed by a 00 code
                    }
                    else { //if it is empty we can just return i
                        return i;
                    }
                }
            }
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
