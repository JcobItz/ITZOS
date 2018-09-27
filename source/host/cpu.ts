///<reference path="../globals.ts" />


/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false, public MainMem = new Memory()) {
               
        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.MainMem = new Memory();
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.isExecuting = true;
            if (this.MainMem.values["$0000"] != null) {
                var codes = this.MainMem.values["$0000"];
                for (var i = 0; i < codes.length; i++) {
                    var x = codes[i].split(" ");
                    x[0](x[1]);
                    
                }
            }
            this.PC++;
            



        }
        public LDA(loc) {
            if (loc.substring(0, 1) == '#') {
                this.Acc = loc.substring(2);
            } else {
                this.Acc = this.MainMem.values[loc];
            }
            

        }
        public STA(loc) {
            this.MainMem.values[loc] = this.Acc;
        }
        public Assemble(raw) {
            var codes = [];
            var input = raw.split(" ");
            for (var i = 0; i < input.length; i++) {
                if (input[i] == "A9") {
                    codes[codes.length] = "LDA #$" + input[i + 1];

                } else if (input[i] == "AD") {
                    codes[codes.length] = "LDA $" + input[i + 2] + input[i + 1];
                } else if (input[i] == "8D") {
                    codes[codes.length] = "STA $" + input[i + 2] + input[i + 1];
                } else {
                    var reg = new RegExp(/^[0-9]{2}$/);
                    if (!reg.test(input[i])) {
                        _StdOut.putText("" + input[i] + " is not a valid op code");
                    }


                }
            }
            this.MainMem.put("$0000", codes);
            var pcb = new PCB();
            pcb.init(this.PC);
            _StdOut.putText("User Program successfully added to main memory with PID " + pcb.pid);
        }
        
    }
    class Memory {
        constructor(public values = {}) {

        }
        
        public init(): void {
          var values: {};
        }
        public put(key: string, value: any) {
            var reg = new RegExp(/^$[0-9a-fA-F]{4}$/);
            this.values[key] = value;

        }
        public get(loc: string): string {
            for (var key in this.values) {
                if (key == loc) {
                    return this.values[key];
                }
            }
            return "memory address " + loc + " not found.";
        }

    }
    class PCB {
        constructor(public pid = 0) {

        }
        public init(ID) {
            this.pid = ID;
        }

    }
}
