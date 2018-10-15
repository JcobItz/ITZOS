module TSOS {
    export class memoryAccessor {
        
        public readMemory(loc){
            if (this.isValid(loc)) {
                return _Mem.memoryArr[loc + _MemoryManager.partitions[1].base + loc];
            }
        }
        public isValid(loc): boolean {
            
            if (loc + _MemoryManager.partitions[1].base < _MemoryManager.partitions[1].base + _MemoryManager.partitions[1].limit && loc + _MemoryManager.partitions[1] >= _MemoryManager.partitions[1].base) {
                return true;
            } else {
                return false;
            }
        }
    }
}