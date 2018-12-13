module TSOS {
    export class CPUscheduler{
        public constructor(public quantum = 6, public timer = 0, public algorithm = 'rr') {
            this.init(6);
        }
        public init(q) {
            this.quantum = q;
        }
        public watch() {
            //decides when to perform a context switch
            switch (this.algorithm) {
                case "rr":
                    //Round Robin Algorithm
                    if (_ProcessManager.readyQueue.getSize() > 0) {
                        this.timer++;//for Round Robin, we increment the timer
                        _Kernel.krnTrace("" + this.timer);
                        if (this.timer == this.quantum) {//and switches context when timer = quantum
                            this.timer = 0;
                            _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH, 0));
                            
                        }
                    }
                    break;
                case "fcfs":
                    //First Come First Serve Algorithm
                    if (_ProcessManager.readyQueue.getSize() > 0) {
                        if (_ProcessManager.running.isLast()) {//We only have to switch when the current process completes
                            _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH, 0));

                        }
                    }
                    break;
                case "priority":
                    //Non-preemptive priority
                    //we don't need to do much here, just switch context when process completes
                    //the real work is done in the process manager, and called during context switching
                    if (_ProcessManager.readyQueue.getSize() > 0) {
                        if (_ProcessManager.running.isLast()) {
                            _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH, 0));

                        }
                    }
                    break;
            }
        }
        public unwatch() {
            //resets timer when a new process begins
            this.timer = 0;
        }
        
      
        public switchContext() {

            //performs a context switch
            //if there is already a process running we need to save the context first
            if (_ProcessManager.running != void 0) {
                _CPU.isExecuting = false;
                _Kernel.krnTrace("Saving Context");
                //if the running process is not complete, put it back on the ready queue.
                //if it is complete, remove it
                if (!_ProcessManager.running.isLast()) {
                    _ProcessManager.readyQueue.enqueue(_ProcessManager.running);
                } else {
                    _ProcessManager.remove(_ProcessManager.running.pid);
                }
                _ProcessManager.running = void 0;
            }
            //if the algorithm is priority, we have to get the highest priority process
            //if it is any other algorithm, just get the next process in the ready queue
            if (_CPUScheduler.algorithm == "priority") {
                _ProcessManager.running = _ProcessManager.getTopPriority();
                _Kernel.krnTrace("Top Priority: "+_ProcessManager.running.pid);
            } else {
                _ProcessManager.running = _ProcessManager.readyQueue.dequeue();
            }
            
           
            if (_ProcessManager.running != void 0) {
                //if the process loaded into running is in memory, just load the PCB context ot the CPU and start executing
                //if it is swapped then we have to roll it in first, then load context to CPU
                if (!_ProcessManager.running.swapped) {

                    _Kernel.krnTrace("Switching Context to PID: "+_ProcessManager.running.pid);
                    _CPU.PC = _ProcessManager.running.PC;
                    _CPU.IR = _ProcessManager.running.IR;
                    _CPU.Acc = _ProcessManager.running.Acc;
                    _CPU.Xreg = _ProcessManager.running.Xreg;
                    _CPU.Yreg = _ProcessManager.running.Yreg;
                    _CPU.Zflag = _ProcessManager.running.Zflag;
                    _CPUScheduler.watch();
                } else {
                    _Swap.rollIn(_ProcessManager.running);
                    
                    _Kernel.krnTrace("Switching Context to PID: " + _ProcessManager.running.pid);
                    _CPU.PC = _ProcessManager.running.PC;
                    _CPU.IR = _ProcessManager.running.IR;
                    _CPU.Acc = _ProcessManager.running.Acc;
                    _CPU.Xreg = _ProcessManager.running.Xreg;
                    _CPU.Yreg = _ProcessManager.running.Yreg;
                    _CPU.Zflag = _ProcessManager.running.Zflag;
                    _CPUScheduler.watch();
                }
            } else {
                _Kernel.krnTrace("running is void");
                _CPU.PC = 0;
                _CPU.IR = "00";
                _CPU.Acc = 0;
                _CPU.Xreg = 0;
                _CPU.Yreg = 0;
                _CPU.Zflag = 0;
            }
            
            
            
            
            
        }
        public setSchedule(alg) {
            //switches the algorithm to the specified algorithm
         
            this.algorithm = alg;
        }
        public getSchedule() {
            //returns the current running scheduling algorithm
            _KernelInterruptQueue.enqueue(new Interrupt(CONSOLE_WRITE, "Scheduling algorithm: " + this.algorithm));
            return;
        }
       
        
        

    }
}