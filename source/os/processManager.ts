module TSOS {
    export class processManager {
        public constructor(public processArr = [], public running = void 0) {
            //creates an empty array of PCBS
            this.processArr = new Array<TSOS.PCB>();
        }
        public init() {
            this.processArr = new Array<TSOS.PCB>();
        }
      
        public load(p: TSOS.PCB) {
            //sets the running process to the requested process
            this.processArr[this.processArr.length] = p;
            Control.updatePCBDisp();

        }
        public remove(p: TSOS.PCB) {
            //removes a PCB from the array of PCBS and updates the PCB display
            this.running = void 0;
            this.processArr.shift();
            Control.updatePCBDisp();
            
        }
        public currentProcess() {
            //returns the current running process
            return this.running;
        }
        public updatePCB() {
            //updates the Data in the PCB
            var processes = "";
            for (var i = 0; i < this.processArr.length; i++) {
                processes += this.processArr[i].pid + " ";
            }
            Control.hostLog(processes,"Process Manager")
            var p = <TSOS.PCB> this.processArr[this.processArr.indexOf(this.running)];
            p.PC = _CPU.PC;
            p.IR = _CPU.IR;
            p.Acc = _CPU.Acc;
            p.Xreg = _CPU.Xreg;
            p.Yreg = _CPU.Yreg;
            p.Zflag = _CPU.Zflag;

        }
    }
}