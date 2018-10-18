var TSOS;
(function (TSOS) {
    var processManager = /** @class */ (function () {
        function processManager(processArr, running) {
            if (processArr === void 0) { processArr = []; }
            if (running === void 0) { running = void 0; }
            this.processArr = processArr;
            this.running = running;
            this.processArr = new Array();
        }
        processManager.prototype.init = function () {
            this.processArr = new Array();
        };
        processManager.prototype.size = function () {
            return this.processArr.length;
        };
        processManager.prototype.load = function (p) {
            this.processArr[this.processArr.length] = p;
            TSOS.Control.updatePCBDisp();
        };
        processManager.prototype.remove = function (p) {
            this.running = void 0;
            this.processArr.shift();
            TSOS.Control.updatePCBDisp();
        };
        processManager.prototype.currentProcess = function () {
            return this.running;
        };
        processManager.prototype.updatePCB = function () {
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
