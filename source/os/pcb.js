var TSOS;
(function (TSOS) {
    var PCB = /** @class */ (function () {
        function PCB(processID) {
            //makes a new PCB with specified pid
            this.pid = processID;
        }
        PCB.prototype.init = function (part, end) {
            //initializes the rest of the PCB data
            this.State = "Ready";
            this.PC = 0;
            this.IR = "00";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.partition = part;
            this.base = _MemoryManager.partitions[part].base;
            this.limit = this.base + end;
        };
        PCB.prototype.isLast = function () {
            TSOS.Control.hostLog("PC: " + this.PC + " END:" + this.limit, "PCB");
            if (this.PC >= this.limit) {
                return true;
            }
            else {
                return false;
            }
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map