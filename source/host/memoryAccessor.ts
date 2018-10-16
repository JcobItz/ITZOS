module TSOS {
    export class memoryAccessor {
        
        public readMemory(loc){
            if (this.isValid(loc)) {
                return _Mem.memoryArr[loc + _MemoryManager.partitions[1].base];
            }
        }
        public writeMemory(loc, val) {
            
            if (this.isValid(loc)) {
                Control.hostLog("valid memory Location", "MemoryAccessor");
                if (parseInt(val, 16) < 16) {
                    val = "0" + val;

                }

                _Mem.memoryArr[_MemoryManager.partitions[1].base + loc] = val;

            } else {
                _Kernel.krnTrapError("Invalid Memory Location");

            }
        }
        public BNE(pc, bytes) {
            return (pc + bytes + 2) % _MemoryManager.getLimit(1);

        }
        public isValid(loc): boolean {
            
            if (loc + _MemoryManager.getBase(1) < _MemoryManager.getBase(1) + _MemoryManager.getLimit(1) && loc + _MemoryManager.getBase(1)>= _MemoryManager.getBase(1)) {
                return true;
            } else {
                return false;
            }
        }
    }
}