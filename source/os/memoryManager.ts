module TSOS {
    export class memoryManager {
        lim = 256;
        ///Memory separated into 3 partitions
        partitions = [
            { "base": 0, "limit": this.lim, "isEmpty": true },
            { "base": 256, "limit": this.lim, "isEmpty": true },
            { "base": 512, "limit": this.lim, "isEmpty": true }
        ];
        //loads program into memory
        public loadIn(codes, part) {
            var next = this.partitions[part].base;
            for (var i = 0; i < codes.length; i++) {
                var op_code = codes[i];
                _Mem.memoryArr[next] = op_code;
                next++;
            }
            //fill the remaining space in the partition with zeros
            for (var i = next; i < this.partitions[part].limit; i++) {
                _Mem.memoryArr[i] = "00";
            }
            this.partitions[part].isEmpty = false;

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