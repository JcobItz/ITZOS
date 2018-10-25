module TSOS {
    export class memoryAccessor {
        
        public readMemory(loc){
            if (this.isValid(loc)) {
                return _Mem.memoryArr[_ProcessManager.running.partition.base + loc];
            }
        }
        public writeMemory(loc, val) {
            
            if (this.isValid(loc)) {
                Control.hostLog("valid memory Location", "MemoryAccessor");
                if (parseInt(val, 16) < 16) {
                    val = "0" + val;

                }

                _Mem.memoryArr[_ProcessManager.running.partition.base + loc] = val;

            } else {
                _Kernel.krnTrapError("Invalid Memory Location");

            }
        } public overWriteAll() {
            for (var i = 0; i < _Mem.memoryArr.length; i++) {
                _Mem.memoryArr[i] = '00';
            }
        }
        public BNE(pc, bytes) {
            return (pc + bytes + 2) % _MemoryManager.getLimit(0);

        }
        public isValid(loc): boolean {
            
            if (loc + _MemoryManager.getBase(0) < _MemoryManager.getBase(0) + _MemoryManager.getLimit(0) && loc + _MemoryManager.getBase(0)>= _MemoryManager.getBase(0)) {
                return true;
            } else {
                return false;
            }
        }
    }
}