var TSOS;
(function (TSOS) {
    var CPUscheduler = /** @class */ (function () {
        function CPUscheduler(quantum, timer, algorithm) {
            if (quantum === void 0) { quantum = 6; }
            if (timer === void 0) { timer = 0; }
            if (algorithm === void 0) { algorithm = 'rr'; }
            this.quantum = quantum;
            this.timer = timer;
            this.algorithm = algorithm;
            this.init(6);
        }
        CPUscheduler.prototype.init = function (q) {
            this.quantum = q;
        };
        CPUscheduler.prototype.watch = function () {
            switch (this.algorithm) {
                case "rr":
                    if (_ProcessManager.readyQueue.getSize() > 0) {
                        this.timer++;
                        _Kernel.krnTrace("" + this.timer);
                        if (this.timer == this.quantum) {
                            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH, 0));
                            this.timer = 0;
                        }
                    }
                    break;
                case "fcfs":
                    if (_ProcessManager.readyQueue.getSize() > 0) {
                        if (_ProcessManager.running.isLast()) {
                            _KernelInterruptQueue(new TSOS.Interrupt(CONTEXT_SWITCH, 0));
                        }
                    }
                    break;
                case "priority":
                    if (_ProcessManager.readyQueue.getSize() > 0) {
                        if (_ProcessManager.running.isLast()) {
                            _KernelInterruptQueue(new TSOS.Interrupt(CONTEXT_SWITCH, 0));
                        }
                    }
                    break;
            }
        };
        CPUscheduler.prototype.unwatch = function () {
            this.timer = 0;
        };
        CPUscheduler.prototype.switchContext = function () {
            if (_ProcessManager.running != void 0) {
                _CPU.isExecuting = false;
                _Kernel.krnTrace("Saving Context");
                _ProcessManager.updatePCB();
                if (!_ProcessManager.running.isLast()) {
                    _ProcessManager.readyQueue.enqueue(_ProcessManager.running);
                }
                else {
                    _ProcessManager.remove(_ProcessManager.running.pid);
                }
                _ProcessManager.running = void 0;
            }
            _ProcessManager.running = _ProcessManager.readyQueue.dequeue();
            if (_ProcessManager.running != void 0) {
                if (!_ProcessManager.running.swapped) {
                    _Kernel.krnTrace("Switching Context");
                    _CPU.PC = _ProcessManager.running.PC;
                    _CPU.IR = _ProcessManager.running.IR;
                    _CPU.Acc = _ProcessManager.running.Acc;
                    _CPU.Xreg = _ProcessManager.running.Xreg;
                    _CPU.Yreg = _ProcessManager.running.Yreg;
                    _CPU.Zflag = _ProcessManager.running.Zflag;
                    _CPUScheduler.watch();
                }
                else {
                    _Swap.rollIn(_ProcessManager.running);
                    _ProcessManager.updatePCB();
                    _Kernel.krnTrace("Switching Context");
                    _CPU.PC = _ProcessManager.running.PC;
                    _CPU.IR = _ProcessManager.running.IR;
                    _CPU.Acc = _ProcessManager.running.Acc;
                    _CPU.Xreg = _ProcessManager.running.Xreg;
                    _CPU.Yreg = _ProcessManager.running.Yreg;
                    _CPU.Zflag = _ProcessManager.running.Zflag;
                    _CPUScheduler.watch();
                }
            }
            else {
                _Kernel.krnTrace("Switching Context");
                _CPU.PC = 0;
                _CPU.IR = "00";
                _CPU.Acc = 0;
                _CPU.Xreg = 0;
                _CPU.Yreg = 0;
                _CPU.Zflag = 0;
            }
        };
        CPUscheduler.prototype.setSchedule = function (alg) {
            this.algorithm = alg;
        };
        CPUscheduler.prototype.getSchedule = function () {
            _StdOut.putText("Current Sceduling Algorithm: " + this.algorithm);
        };
        return CPUscheduler;
    }());
    TSOS.CPUscheduler = CPUscheduler;
})(TSOS || (TSOS = {}));
