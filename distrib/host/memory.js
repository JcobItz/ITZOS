var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory(memoryArr) {
            if (memoryArr === void 0) { memoryArr = void 0; }
            this.memoryArr = memoryArr;
        }
        Memory.prototype.init = function () {
            //memory array acts as the addressable space of the memory;
            this.memoryArr = new Array(768);
            //fill memory with zeros
            for (var i = 0; i < this.memoryArr.length; i++) {
                this.memoryArr[i] = "00";
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
