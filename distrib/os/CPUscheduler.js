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
                _Kernel.krnTrace("" + this.timer);
                if (this.timer == this.quantum) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH, 0));
                    this.timer = 0;
                }
            }
        };
        CPUscheduler.prototype.unwatch = function () {
            this.timer = 0;
        };
        CPUscheduler.prototype.switchContext = function () {
            if (_ProcessManager.running != void 0) {
                _CPU.isExecuting = false;
                _Kernel.krnTrace("Saving Context");
                _ProcessManager.running.PC = _CPU.PC;
                _ProcessManager.running.IR = _CPU.IR;
                _ProcessManager.running.Acc = _CPU.Acc;
                _ProcessManager.running.Xreg = _CPU.Xreg;
                _ProcessManager.running.Yreg = _CPU.Yreg;
                _ProcessManager.running.Zflag = _CPU.Zflag;
                _ProcessManager.readyQueue.enqueue(_ProcessManager.running);
                _ProcessManager.running = void 0;
            }
            _ProcessManager.running = _ProcessManager.readyQueue.dequeue();
            _Kernel.krnTrace("Switching Context");
            _CPU.PC = _ProcessManager.running.PC;
            _CPU.IR = _ProcessManager.running.IR;
            _CPU.Acc = _ProcessManager.running.Acc;
            _CPU.Xreg = _ProcessManager.running.Xreg;
            _CPU.Yreg = _ProcessManager.running.Yreg;
            _CPU.Zflag = _ProcessManager.running.Zflag;
            _CPUScheduler.watch();
            _CPU.isExecuting = true;
        };
        return CPUscheduler;
    }());
    TSOS.CPUscheduler = CPUscheduler;
})(TSOS || (TSOS = {}));
