module TSOS {
    export class Memory {
       
        constructor(public memoryArr = void 0) {
            
        }
        public init() {
            //memory array acts as the addressable space of the memory;
            this.memoryArr = new Array(768);
            //fill memory with zeros
            for (var i = 0; i < this.memoryArr.length; i++) {
                this.memoryArr[i] = "00";
            }
        }
    }
}