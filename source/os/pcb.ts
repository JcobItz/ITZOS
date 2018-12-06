module TSOS {
    export class PCB {
        public pid;
        public State;
        public PC;
        public IR;
        public Acc;
        public Xreg;
        public Yreg;
        public Zflag;
        public partition;
        public base;
        public limit;
        public swapped;
        public TSB;
        public priority;
        public constructor(processID) {
            //makes a new PCB with specified pid
            this.pid = processID;

        }
        public init(part, end) {
            //initializes the rest of the PCB data
            this.State = "Ready";
            this.PC = 0;
            this.IR = "00";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.partition = part;
            if (this.partition != 999) {
                this.base = _MemoryManager.partitions[part].base;
            } else {
                this.base = 999;
            }
            this.limit = end;
            this.swapped = false;
            this.TSB = "0:0:0";
            this.priority = 0;
        }
        public isLast() {
            Control.hostLog("PC: " + this.PC + " END:" + this.limit, "PCB");
            if (this.PC >= this.limit) {
                return true;
            } else {
                return false;
            }
        }


    }
}