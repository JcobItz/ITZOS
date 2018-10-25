var TSOS;
(function (TSOS) {
    var memoryAccessor = /** @class */ (function () {
        function memoryAccessor() {
        }
        memoryAccessor.prototype.readMemory = function (loc) {
            if (this.isValid(loc)) {
                return _Mem.memoryArr[_ProcessManager.running.partition.base + loc];
            }
        };
        memoryAccessor.prototype.writeMemory = function (loc, val) {
            if (this.isValid(loc)) {
                TSOS.Control.hostLog("valid memory Location", "MemoryAccessor");
                if (parseInt(val, 16) < 16) {
                    val = "0" + val;
                }
                _Mem.memoryArr[_ProcessManager.running.partition.base + loc] = val;
            }
            else {
                _Kernel.krnTrapError("Invalid Memory Location");
            }
        };
        memoryAccessor.prototype.overWriteAll = function () {
            for (var i = 0; i < _Mem.memoryArr.length; i++) {
                _Mem.memoryArr[i] = '00';
            }
        };
        memoryAccessor.prototype.BNE = function (pc, bytes) {
            return (pc + bytes + 2) % _MemoryManager.getLimit(0);
        };
        memoryAccessor.prototype.isValid = function (loc) {
            if (loc + _MemoryManager.getBase(0) < _MemoryManager.getBase(0) + _MemoryManager.getLimit(0) && loc + _MemoryManager.getBase(0) >= _MemoryManager.getBase(0)) {
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
