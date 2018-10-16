module TSOS {
    export class memoryManager {
        public constructor(public lim = 256, public partitions = []) {
            this.lim = 256;
            ///Memory separated into 3 partitions
            this.partitions = [
                { "base": 0, "limit": this.lim, "isEmpty": true },
                { "base": 256, "limit": this.lim, "isEmpty": true },
                { "base": 512, "limit": this.lim, "isEmpty": true }
            ];
        }
        //loads program into memory
        public loadIn(codes, part) {
            var next = this.partitions[part].base;
            var start = next;
            for (var i = 0; i < codes.length; i++) {
                var op_code = codes[i];
                _Mem.memoryArr[next] = op_code;
                Control.hostLog("Loaded "+op_code, "MemoryManager");
                next++;
            }
            //fill the remaining space in the partition with zeros
            for (var j = next; j < this.partitions[part].limit; j++) {
                _Mem.memoryArr[j] = "00";
            }
            this.partitions[part].isEmpty = false;
            Control.hostMemory();
            var p = new PCB(_ProcessManager.size());
            p.init(1, 0, codes.size);
            _ProcessManager.load(p);
            _StdOut.putText("Program loaded with pid " + p.pid);
            return;
        }
        //check if there is enough space for the given op codes where size = the number of op codes
        public hasSpace(size): boolean {
            for (var i = 0; i < this.partitions.length; i++) {
                if (this.partitions[i].isEmpty && this.partitions[i].limit >= size) {
                    return true;
                }
            }
            return false;
        }
        //returns the limit of the specified partition(p)
        public getLimit(p): number {
            return this.partitions[p].limit;
        }
        //returns the base of the specified partition(p)
        public getBase(p): number {
            return this.partitions[p].base;
        }

    }
}