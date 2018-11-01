module TSOS {
    export class CPUscheduler{
        public constructor(public quantum = 6, public timer = 0) {
            this.init(6);
        }
        public init(q) {
            this.quantum = q;
        }
        public watch() {
            if (_ProcessManager.readyQueue.getSize() > 0) {
                this.timer++;
                if (this.timer == this.quantum) {
                    _KernelInputQueue.enqueue(CONTEXT_SWITCH, 0);
                    this.timer = 0;
                }
            }
        }
        public saveContext() {
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
            } else {
                _ProcessManager.readyQueue.enqueue(_ProcessManager.running);
            }
            _ProcessManager.running = void 0;

        }
        public switchContext() {
            _CPU.isExecuting = false;
            _Kernel.krnTrace("Switching COntext");
            _CPU.PC = _ProcessManager.running.PC;
            _CPU.IR = _ProcessManager.running.IR;
            _CPU.Acc = _ProcessManager.running.Acc;
            _CPU.Xreg = _ProcessManager.running.Xreg;
            _CPU.Yreg = _ProcessManager.running.Yreg;
            _CPU.Zflag = _ProcessManager.running.Zflag;
            _CPU.isExecuting = true;
            
            
        }
        
       
        
        

    }
}