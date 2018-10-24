var TSOS;
(function (TSOS) {
    var memoryAccessor = /** @class */ (function () {
        function memoryAccessor() {
        }
        memoryAccessor.prototype.readMemory = function (loc) {
            if (this.isValid(loc)) {
                return _Mem.memoryArr[loc + _MemoryManager.partitions[1].base];
            }
        };
        memoryAccessor.prototype.writeMemory = function (loc, val) {
            if (this.isValid(loc)) {
                TSOS.Control.hostLog("valid memory Location", "MemoryAccessor");
                if (parseInt(val, 16) < 16) {
                    val = "0" + val;
                }
                _Mem.memoryArr[_MemoryManager.partitions[1].base + loc] = val;
            }
            else {
                _Kernel.krnTrapError("Invalid Memory Location");
            }
        };
        memoryAccessor.prototype.BNE = function (pc, bytes) {
            return (pc + bytes + 2) % _MemoryManager.getLimit(1);
        };
        memoryAccessor.prototype.isValid = function (loc) {
            if (loc + _MemoryManager.getBase(1) < _MemoryManager.getBase(1) + _MemoryManager.getLimit(1) && loc + _MemoryManager.getBase(1) >= _MemoryManager.getBase(1)) {
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
//# sourceMappingURL=memoryAccessor.js.map