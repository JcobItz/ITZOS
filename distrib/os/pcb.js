var TSOS;
(function (TSOS) {
    var PCB = /** @class */ (function () {
        function PCB(processID) {
            this.pid = processID;
        }
        PCB.prototype.init = function (part, start, end) {
            this.State = "Ready";
            this.PC = start;
            this.IR = "00";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.partition = part;
            this.begin = start;
            this.end = start + end;
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
