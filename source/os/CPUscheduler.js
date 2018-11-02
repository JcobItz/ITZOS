var TSOS;
(function (TSOS) {
    var CPUscheduler = /** @class */ (function () {
        function CPUscheduler(quantum, timer) {
            if (quantum === void 0) { quantum = 6; }
            if (timer === void 0) { timer = 0; }
            this.quantum = quantum;
            this.timer = timer;
            this.init(6);
        }
        CPUscheduler.prototype.init = function (q) {
            this.quantum = q;
        };
        CPUscheduler.prototype.watch = function () {
            if (_ProcessManager.readyQueue.getSize() > 0) {
                this.timer++;
                if (this.timer == this.quantum) {
                    _KernelInputQueue.enqueue(CONTEXT_SWITCH, 0);
                    this.timer = 0;
                }
            }
        };
        CPUscheduler.prototype.saveContext = function () {
            _CPU.isExecuting = false;
            _Kernel.krnTrace("Saving COntext");
            _ProcessManager.running.PC = _CPU.PC;
            _ProcessManager.running.IR = _CPU.IR;
            _ProcessManager.running.Acc = _CPU.Acc;
            _ProcessManager.running.Xreg = _CPU.Xreg;
            _ProcessManager.running.Yreg = _CPU.Yreg;
            _ProcessManager.running.Zflag = _CPU.Zflag;
            if (_ProcessManager.running.isLast()) {
                _ProcessManager.remove(_ProcessManager.running);
            }
            else {
                _ProcessManager.readyQueue.enqueue(_ProcessManager.running);
            }
            _ProcessManager.running = void 0;
        };
        CPUscheduler.prototype.switchContext = function () {
            _CPU.isExecuting = false;
            _CPU.init();
            _Kernel.krnTrace("Switching COntext");
            _CPU.PC = _ProcessManager.running.PC;
            _CPU.IR = _ProcessManager.running.IR;
            _CPU.Acc = _ProcessManager.running.Acc;
            _CPU.Xreg = _ProcessManager.running.Xreg;
            _CPU.Yreg = _ProcessManager.running.Yreg;
            _CPU.Zflag = _ProcessManager.running.Zflag;
        };
        return CPUscheduler;
    }());
    TSOS.CPUscheduler = CPUscheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=CPUscheduler.js.map