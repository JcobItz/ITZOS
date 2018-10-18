var TSOS;
(function (TSOS) {
    var processManager = /** @class */ (function () {
        function processManager(processArr, running) {
            if (processArr === void 0) { processArr = []; }
            if (running === void 0) { running = void 0; }
            this.processArr = processArr;
            this.running = running;
            //creates an empty array of PCBS
            this.processArr = new Array();
        }
        processManager.prototype.init = function () {
            this.processArr = new Array();
        };
        processManager.prototype.load = function (p) {
            //sets the running process to the requested process
            this.processArr[this.processArr.length] = p;
            TSOS.Control.updatePCBDisp();
        };
        processManager.prototype.remove = function (p) {
            //removes a PCB from the array of PCBS and updates the PCB display
            this.running = void 0;
            this.processArr.shift();
            TSOS.Control.updatePCBDisp();
        };
        processManager.prototype.currentProcess = function () {
            //returns the current running process
            return this.running;
        };
        processManager.prototype.updatePCB = function () {
            //updates the Data in the PCB
            var processes = "";
            for (var i = 0; i < this.processArr.length; i++) {
                processes += this.processArr[i].pid + " ";
            }
            TSOS.Control.hostLog(processes, "Process Manager");
            var p = this.processArr[this.processArr.indexOf(this.running)];
            p.PC = _CPU.PC;
            p.IR = _CPU.IR;
            p.Acc = _CPU.Acc;
            p.Xreg = _CPU.Xreg;
            p.Yreg = _CPU.Yreg;
            p.Zflag = _CPU.Zflag;
        };
        return processManager;
    }());
    TSOS.processManager = processManager;
})(TSOS || (TSOS = {}));
