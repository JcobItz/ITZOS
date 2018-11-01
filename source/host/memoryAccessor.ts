module TSOS {
    export class memoryAccessor {
        
        public readMemory(loc){
            if (this.isValid(_MemoryManager.partitions[_ProcessManager.running.partition].base + loc)) {
                
                return _Mem.memoryArr[_MemoryManager.partitions[_ProcessManager.running.partition].base + loc];
            }
        }
        public writeMemory(loc, val) {
            
            if (this.isValid(_RunningPartition + loc)) {
                Control.hostLog("valid memory Location", "MemoryAccessor");
                if (parseInt(val, 16) < 16) {
                    val = "0" + val;

                }

                _Mem.memoryArr[_MemoryManager.partitions[_RunningPartition].base + loc] = val;

            } else {
                _Kernel.krnTrapError("Invalid Memory Location");

            }
        } public overWriteAll() {
            for (var i = 0; i < _Mem.memoryArr.length; i++) {
                _Mem.memoryArr[i] = '00';
            }
        }
        public BNE(pc, bytes) {
            return (pc + bytes + 2) % _MemoryManager.getLimit(_ProcessManager.running.partition);

        }
        public isValid(loc): boolean {
            
            if (loc + _MemoryManager.getBase(_ProcessManager.running.partition) < _MemoryManager.getBase(_ProcessManager.running.partition) + _MemoryManager.getLimit(_ProcessManager.running.partition) && loc + _MemoryManager.getBase(_ProcessManager.running.partition) >= _MemoryManager.getBase(_ProcessManager.running.partition)) {
                return true;
            } else {
                return false;
            }
        }
    }
}