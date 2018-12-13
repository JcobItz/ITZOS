module TSOS {
    export class memoryAccessor {
        
        public readMemory(loc: number) {
            //returns the hex data at the specified location
            var part = _ProcessManager.running.partition;
            if (this.isValid(loc)) {
                
                return _Mem.memoryArr[_MemoryManager.partitions[part].base + loc].toString();
            }
        }
        public writeMemory(loc, val) {
            //Converts specified value to hex
            //writes it to memory at specified location
            if (this.isValid(loc)) {//make sure its a real location!
                Control.hostLog("valid memory Location", "MemoryAccessor");
                if (parseInt(val, 16) < 16) {//add leading zero if necessary
                    val = "0" + val;

                }

                _Mem.memoryArr[_MemoryManager.partitions[_ProcessManager.running.partition].base + loc] = val;
                return;

            } else {
                _Kernel.krnTrapError("Invalid Memory Location");
                return;
            }
        } 
        public BNE(pc, bytes) {
            return (pc + bytes + 2) % _MemoryManager.getLimit(_ProcessManager.running.partition);//returns location to branch to

        }
        public isValid(loc): boolean {
            //makes sure the specified address exists in the partition of the running process
            if ((loc + _MemoryManager.getBase(_ProcessManager.running.partition)) < (_MemoryManager.getBase(_ProcessManager.running.partition) + _MemoryManager.getLimit(_ProcessManager.running.partition)) && (loc + _MemoryManager.getBase(_ProcessManager.running.partition)) >= (_MemoryManager.getBase(_ProcessManager.running.partition))) {
                 Control.hostLog("Valid Memory Location: " +(loc + _MemoryManager.getBase(_ProcessManager.running.partition)), "MemAccessor");
                return true;
            } else {
                return false;
            }
        }
    }
}