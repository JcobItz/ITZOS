module TSOS {
    export class Memory {
        memoryArr;
        public init() {
            //memory array acts as the addressable space of the memory;
            this.memoryArr = new Array(0x2F8);
            //fill memory with zeros
            for (var i = 0; i < this.memoryArr.length; i++) {
                this.memoryArr[i] = "00";
            }
        }
    }
}