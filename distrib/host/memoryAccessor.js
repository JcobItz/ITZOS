var TSOS;
(function (TSOS) {
    var memoryAccessor = /** @class */ (function () {
        function memoryAccessor() {
        }
        memoryAccessor.prototype.readMemory = function (loc) {
            //returns the hex data at the specified location
            var part = _ProcessManager.running.partition;
            if (this.isValid(loc)) {
                return _Mem.memoryArr[_MemoryManager.partitions[part].base + loc].toString();
            }
        };
        memoryAccessor.prototype.writeMemory = function (loc, val) {
            //Converts specified value to hex
            //writes it to memory at specified location
            if (this.isValid(loc)) { //make sure its a real location!
                TSOS.Control.hostLog("valid memory Location", "MemoryAccessor");
                if (parseInt(val, 16) < 16) { //add leading zero if necessary
                    val = "0" + val;
                }
                _Mem.memoryArr[_MemoryManager.partitions[_ProcessManager.running.partition].base + loc] = val;
                return;
            }
            else {
                _Kernel.krnTrapError("Invalid Memory Location");
                return;
            }
        };
        memoryAccessor.prototype.BNE = function (pc, bytes) {
            return (pc + bytes + 2) % _MemoryManager.getLimit(_ProcessManager.running.partition); //returns location to branch to
        };
        memoryAccessor.prototype.isValid = function (loc) {
            //makes sure the specified address exists in the partition of the running process
            if ((loc + _MemoryManager.getBase(_ProcessManager.running.partition)) < (_MemoryManager.getBase(_ProcessManager.running.partition) + _MemoryManager.getLimit(_ProcessManager.running.partition)) && (loc + _MemoryManager.getBase(_ProcessManager.running.partition)) >= (_MemoryManager.getBase(_ProcessManager.running.partition))) {
                TSOS.Control.hostLog("Valid Memory Location: " + (loc + _MemoryManager.getBase(_ProcessManager.running.partition)), "MemAccessor");
                return true;
            }
            else {
                return false;
            }
        };
        return memoryAccessor;
    }());
    TSOS.memoryAccessor = memoryAccessor;
})(TSOS || (TSOS = {}));
