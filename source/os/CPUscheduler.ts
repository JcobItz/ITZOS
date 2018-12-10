module TSOS {
    export class CPUscheduler{
        public constructor(public quantum = 6, public timer = 0, public algorithm = 'rr') {
            this.init(6);
        }
        public init(q) {
            this.quantum = q;
        }
        public watch() {

            switch (this.algorithm) {
                case "rr":
                    if (_ProcessManager.readyQueue.getSize() > 0) {
                        this.timer++;
                        _Kernel.krnTrace("" + this.timer);
                        if (this.timer == this.quantum) {
                            _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH, 0));
                            this.timer = 0;
                        }
                    }
                    break;
                case "fcfs":
                    if (_ProcessManager.readyQueue.getSize() > 0) {
                        if (_ProcessManager.running.isLast()) {
                            _KernelInterruptQueue(new Interrupt(CONTEXT_SWITCH, 0));

                        }
                    }
                    break;
                case "priority":
                    if (_ProcessManager.readyQueue.getSize() > 0) {
                        if (_ProcessManager.running.isLast()) {
                            _KernelInterruptQueue(new Interrupt(CONTEXT_SWITCH, 0));

                        }
                    }
                    break;
            }
        }
        public unwatch() {
            this.timer = 0;
        }
      
        public switchContext() {
            if (_ProcessManager.running != void 0) {
                _CPU.isExecuting = false;
                _Kernel.krnTrace("Saving Context");
                _ProcessManager.updatePCB();
                if (!_ProcessManager.running.isLast()) {
                    _ProcessManager.readyQueue.enqueue(_ProcessManager.running);
                } else {
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
                } else {
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
            } else {
                _Kernel.krnTrace("Switching Context");
                _CPU.PC = 0;
                _CPU.IR = "00";
                _CPU.Acc = 0;
                _CPU.Xreg = 0;
                _CPU.Yreg = 0;
                _CPU.Zflag = 0;
            }
            
            
            
            
            
        }
        public setSchedule(alg) {
            this.algorithm = alg;
        }
        public getSchedule() {
            _StdOut.putText("Current Sceduling Algorithm: " + this.algorithm);
        }
       
        
        

    }
}