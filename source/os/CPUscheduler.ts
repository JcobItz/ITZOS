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
                _Kernel.krnTrace(""+this.timer);
                if (this.timer == this.quantum) {
                    _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH, 0));
                    this.timer = 0;
                }
            }
        }
        public unwatch() {
            this.timer = 0;
        }
      
        public switchContext() {
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
            
            
            
        }
        
       
        
        

    }
}