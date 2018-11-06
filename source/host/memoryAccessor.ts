module TSOS {
    export class memoryAccessor {
        
        public readMemory(loc: number) {
            var part = _ProcessManager.running.partition;
            if (this.isValid(loc)) {
                
                return _Mem.memoryArr[_MemoryManager.partitions[part].base + loc];
            }
        }
        public writeMemory(loc, val) {
            
            if (this.isValid(loc)) {
                Control.hostLog("valid memory Location", "MemoryAccessor");
                if (parseInt(val, 16) < 16) {
                    val = "0" + val;

                }

                _Mem.memoryArr[_MemoryManager.partitions[_ProcessManager.running.partition].base + loc] = val;
                return;

            } else {
                _Kernel.krnTrapError("Invalid Memory Location");
                return;
            }
        } public overWriteAll() {
            for (var i = 0; i < _Mem.memoryArr.length; i++) {
                _Mem.memoryArr[i] = '00';
            }
            return;
        }
        public BNE(pc, bytes) {
            return (pc + bytes + 2) % _MemoryManager.getLimit(_ProcessManager.running.partition);

        }
        public isValid(loc): boolean {
            
            if ((loc + _MemoryManager.getBase(_ProcessManager.running.partition)) < (_MemoryManager.getBase(_ProcessManager.running.partition) + _MemoryManager.getLimit(_ProcessManager.running.partition)) && (loc + _MemoryManager.getBase(_ProcessManager.running.partition)) >= (_MemoryManager.getBase(_ProcessManager.running.partition))) {
                 Control.hostLog("Valid Memory Location: " + _MemoryManager.getBase(_ProcessManager.running.partition), "MemAccessor");
                return true;
            } else {
                return false;
            }
        }
    }
}