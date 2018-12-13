var TSOS;
(function (TSOS) {
    var PCB = /** @class */ (function () {
        function PCB(processID) {
            //makes a new PCB with specified pid
            this.pid = processID;
        }
        PCB.prototype.init = function (part, length) {
            //initializes the rest of the PCB data
            this.State = "Ready";
            this.PC = 0;
            this.IR = "00";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.partition = part;
            if (this.partition != 999) {
                this.base = _MemoryManager.partitions[part].base;
            }
            else {
                this.base = 999;
            }
            this.limit = length;
            this.swapped = false;
            this.TSB = "0:0:0";
            this.priority = 0;
        };
        PCB.prototype.isLast = function () {
            //Checks if the PCB is completed
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
