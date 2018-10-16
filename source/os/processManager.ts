module TSOS {
    export class processManager {
        public constructor(public processArr = [], public running = void 0) {
            this.processArr = new Array<TSOS.PCB>();
        }
        public init() {
            this.processArr = new Array<TSOS.PCB>();
        }
        public size():number{
            return this.processArr.length;
        }
        public load(p:TSOS.PCB) {
            this.processArr[this.size()] = p;
            var pid = document.getElementById("PID");
            var pc = document.getElementById("p_PC");
            var ir = document.getElementById("p_IR");
            var acc = document.getElementById("p_Acc");
            var x = document.getElementById("p_Xreg");
            var y = document.getElementById("p_Yreg");
            var z = document.getElementById("p_Zflag");
            pid.innerHTML = p.pid;
            pc.innerHTML = p.PC;
            ir.innerHTML = p.IR;
            acc.innerHTML = p.Acc;
            x.innerHTML = p.Xreg;
            y.innerHTML = p.Yreg;
            z.innerHTML = p.Zflag;

        }
        public remove(p: TSOS.PCB) {
            this.processArr[0] = null;
            this.processArr.shift();
        }
        public currentProcess() {
            return this.running;
        }
    }
}