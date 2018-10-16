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
            this.processArr[this.size()] = p;
            var pid = document.getElementById("PID");
            var pc = document.getElementById("p_PC");
            var ir = document.getElementById("p_IR");
            var acc = document.getElementById("p_Acc");
            var x = document.getElementById("p_Xreg");
            var y = document.getElementById("p_Yreg");
            var z = document.getElementById("p_Zflag");
            pid.innerHTML = p.pid;
            pc.innerHTML = p.PC;
            ir.innerHTML = p.IR;
            acc.innerHTML = p.Acc;
            x.innerHTML = p.Xreg;
            y.innerHTML = p.Yreg;
            z.innerHTML = p.Zflag;
        };
        processManager.prototype.remove = function (p) {
            this.processArr[0] = null;
            this.processArr.shift();
        };
        processManager.prototype.currentProcess = function () {
            return this.running;
        };
        return processManager;
    }());
    TSOS.processManager = processManager;
})(TSOS || (TSOS = {}));
