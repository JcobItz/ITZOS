module TSOS {
    export class memoryManager {
        public constructor(public lim = 256, public partitions = []) {
            this.lim = 256;
            ///Memory separated into 3 partitions of 256 bytes each
            this.partitions = [
                { "base": 0, "limit": this.lim, "isEmpty": true },
                { "base": 256, "limit": this.lim, "isEmpty": true },
                { "base": 512, "limit": this.lim, "isEmpty": true }
            ];
        }
        //loads program into memory
        public loadIn(codes, part) {
            
            var next = this.partitions[part].base;           
            for (var i = 0; i < codes.length; i++) {
                var op_code = codes[i];
                _Mem.memoryArr[next] = op_code;//insert the code into the memory array
                Control.hostLog("Loaded "+op_code, "MemoryManager");
                next++;//increment the next available location pointer
            }
            //fill the remaining space in the partition with zeros
            for (var j = next; j < this.partitions[part].base + this.partitions[part].limit; j++) {
                _Mem.memoryArr[j] = "00";
            }
            this.partitions[part].isEmpty = false;//set the empty indicator accordingly
            Control.hostMemory();//update memory 
            
            Control.updatePCBDisp();
            _Kernel.krnTrace("Memory manager loaded code into partition: " + part);
            
            return;
        }
        //check if there is enough space for the given op codes where size = the number of op codes
        public hasSpace(size) {
            for (var i = 0; i < this.partitions.length; i++) {
                if (this.partitions[i].isEmpty && this.partitions[i].limit >= size) {
                    _Kernel.krnTrace("has space");
                    return true;
                }
            }
            return false;
        }
        public nextAvailable(size): number {
            //loops through the specified partition and returns the first available index
            for (var i = 0; i < this.partitions.length; i++) {
                if (this.partitions[i].isEmpty && this.partitions[i].limit >= size) {
                    return i;
                }
                
            }
            
        }
        public clearMem(p:number) {
            for (var i = this.partitions[p].base; i < this.partitions[p].base + this.partitions[p].limit; i++) {
                _Mem.memoryArr[i] = "00";
            }
            this.partitions[p].isEmpty = true;
            Control.hostMemory();
        }
        //returns the limit of the specified partition(p)
        public getLimit(p): number {
            return this.partitions[p].limit;
        }
        //returns the base of the specified partition(p)
        public getBase(p): number {
            return this.partitions[p].base;
        }
        public getPartitionData(part) {
            //returns the codes in the specified partition
            var data = [];
            var base = this.partitions[part].base;
            var limit = base + this.partitions[part].limit;
            for (var i = base; i < limit; i++) {
                data.push(_Mem.memoryArr[i]);
            }
            return data;

        }

    }
}