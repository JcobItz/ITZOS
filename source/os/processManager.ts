module TSOS {
    export class processManager {
        public constructor(public residentQueue = new Queue(), public readyQueue = new Queue(), public running:TSOS.PCB = void 0) {
            //creates an empty array of PCBS
            this.init();
            
        }
        public init() {
            var q = new Array<TSOS.PCB>();
            var qq = new Array<TSOS.PCB>();
            this.residentQueue = new Queue(q);
            this.readyQueue = new Queue(qq);
            
        }
      
        public createProcess(codes) {
            //first make sure the op codes can fit within a partition
            if (codes.length > _MemoryManager.lim) {
                _StdOut.putText("Failed loading user program, the program must be less than 256 bytes");
                return;
            }
            //then make sure there is an available partition
            var part = _MemoryManager.nextAvailable();
            if (part > -1) {
                var p = new PCB(_PID);
                p.init(part, codes.length);
                Control.hostLog("Loaded process with PID " + _PID);
                _PID++;
                this.residentQueue.enqueue(p);

                _MemoryManager.loadIn(codes, _MemoryManager.nextAvailable());
                Control.updatePCBDisp();
            } else {
                _StdOut.putText("There are no available memory partitions, please use the cleamMem command to clear all partitions, or clearPartition to clear one.");
            }
           
        }
        public remove(p: TSOS.PCB) {
            //removes a PCB from the array of PCBS and updates the PCB display
           
            
            for (var i = 0; i < _ProcessManager.residentQueue.getSize(); i++) {
                var pro: TSOS.PCB = _ProcessManager.residentQueue.dequeue();
                if (pro.pid != p.pid) {
                    _ProcessManager.residentQueue.enqueue(pro);
                }
            }
           


           


            Control.updatePCBDisp();
        }
        
        public updatePCB() {
            //updates the Data in the PCB
            this.running.PC = _CPU.PC;
            this.running.IR = _CPU.IR;
            this.running.Acc = _CPU.Acc;
            this.running.Xreg = _CPU.Xreg;
            this.running.Yreg = _CPU.Yreg;
            this.running.Zflag = _CPU.Zflag;

            
        }
        public run() {
            Control.hostLog("Running", "Process Manager");
            if (!this.isEmpty()) {
                Control.hostLog("not empty", "Process Manager");
                
                this.running = this.readyQueue.dequeue();
                _RunningPartition = this.running.partition;
                _CPU.PC = this.running.PC;
                _CPU.IR = this.running.IR;
                _CPU.Acc = this.running.Acc;
                _CPU.Xreg = this.running.Xreg;
                _CPU.Yreg = this.running.Yreg;
                _CPU.Zflag = this.running.Zflag;
                this.running.State = "running";
                _CPU.isExecuting = true;
                
            }
        }
        public isEmpty() {
            
            return this.residentQueue.isEmpty();
        }
    }

}