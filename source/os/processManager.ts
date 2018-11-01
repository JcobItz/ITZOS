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

            }
            this.residentQueue.enqueue(p);
            Control.updatePCBDisp();
            _MemoryManager.loadIn(codes, _MemoryManager.nextAvailable());

        }
        public remove(p: TSOS.PCB) {
            //removes a PCB from the array of PCBS and updates the PCB display
            var ps = new Array<TSOS.PCB>();
            for (var i = 0; i < this.residentQueue.getSize(); i++) {
                ps.push(this.residentQueue.dequeue());
            }
            for (var i = 0; i < ps.length; i++) {
                if (ps[i] == p) {
                    ps[i] == null;
                }
            }
            for (var i = 0; i < ps.length; i++) {
                if (ps[i] != null) {
                    this.residentQueue.enqueue(ps[i]);
                }
            }


           


            Control.updatePCBDisp();
        }
        
        public updatePCB(p:TSOS.PCB) {
            //updates the Data in the PCB
            
           
            p.PC = _CPU.PC;
            p.IR = _CPU.IR;
            p.Acc = _CPU.Acc;
            p.Xreg = _CPU.Xreg;
            p.Yreg = _CPU.Yreg;
            p.Zflag = _CPU.Zflag;

            this.running = p;

            
        }
        public run() {
            Control.hostLog("Running", "Process Manager");
            if (!this.isEmpty()) {
                Control.hostLog("not empty", "Process Manager");
                if (this.running != void 0) {
                   // _CPUScheduler.saveContext();
                   
                    
                }
                this.running = this.readyQueue.dequeue();
                _RunningPartition = this.running.partition;
                _CPUScheduler.switchContext();
                this.running.State = "running";
                
            }
        }
        public isEmpty() {
            
            return this.residentQueue.isEmpty();
        }
    }

}