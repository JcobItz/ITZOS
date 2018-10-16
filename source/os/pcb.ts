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
        public begin;
        public end;

        public constructor(processID) {
            this.pid = processID;

        }
        public init(part, start, end) {
            this.State = "Ready";
            this.PC = start;
            this.IR = "00";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.partition = part;
            this.begin = start;
            this.end = start + end;
        }

    }
}