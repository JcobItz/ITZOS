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
var TSOS;
(function (TSOS) {
    var Cpu = /** @class */ (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting, MainMem, processes) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (MainMem === void 0) { MainMem = new Memory(); }
            if (processes === void 0) { processes = []; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.MainMem = MainMem;
            this.processes = processes;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.MainMem.init();
            var pcDisp = document.getElementById('PC');
            pcDisp.innerText = "" + this.PC;
            var irDisp = document.getElementById('IR');
            irDisp.innerText = "null";
            var accDisp = document.getElementById('Acc');
            accDisp.innerText = "" + this.Acc;
            var xDisp = document.getElementById('Xreg');
            xDisp.innerText = "" + this.Xreg;
            var yDisp = document.getElementById('Yreg');
            yDisp.innerText = "" + this.Yreg;
            var zDisp = document.getElementById('Zflag');
            zDisp.innerText = "" + this.Zflag;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.isExecuting = true;
            var pcDisp = document.getElementById('PC');
            pcDisp.innerText = "" + this.PC;
            var irDisp = document.getElementById('IR');
            irDisp.innerText = "" + this.processes[0].IR;
            var accDisp = document.getElementById('Acc');
            accDisp.innerText = "" + this.Acc;
            var xDisp = document.getElementById('Xreg');
            xDisp.innerText = "" + this.Xreg;
            var yDisp = document.getElementById('Yreg');
            yDisp.innerText = "" + this.Yreg;
            var zDisp = document.getElementById('Zflag');
            zDisp.innerText = "" + this.Zflag;
            if (this.MainMem.addresses["$0000"] != null) {
                var codes = this.MainMem.addresses["$0000"];
                for (var i = 0; i < codes.length; i++) {
                    var x = codes[i].split(" ");
                    x[0](x[1]);
                }
            }
            this.isExecuting = false;
        };
        Cpu.prototype.LDA = function (loc) {
            if (loc.substring(0, 1) == '#') {
                var x = loc.substring(2);
                this.Acc = +x;
            }
            else {
                this.Acc = this.MainMem.addresses[loc][0];
            }
        };
        Cpu.prototype.STA = function (loc) {
            this.MainMem.addresses[loc][0] = this.Acc;
        };
        Cpu.prototype.ADC = function (loc) {
            this.Acc += this.MainMem.addresses[loc][0];
        };
        Cpu.prototype.LDX = function (loc) {
            if (loc.substring(0, 1) == '#') {
                var x = loc.substring(2);
                this.Xreg = +x;
            }
            else {
                this.Xreg = this.MainMem.addresses[loc][0];
            }
        };
        Cpu.prototype.LDY = function (loc) {
            if (loc.substring(0, 1) == '#') {
                var x = loc.substring(2);
                this.Yreg = +x;
            }
            else {
                this.Yreg = this.MainMem.addresses[loc][0];
            }
        };
        Cpu.prototype.NOP = function () {
        };
        Cpu.prototype.CPX = function (loc) {
            var x = this.Xreg;
            var y = this.MainMem.addresses[loc][0];
            if (x == y) {
                this.Zflag = 1;
            }
        };
        Cpu.prototype.BNE = function (loc) {
        };
        Cpu.prototype.Fetch = function (input) {
            var pcb = new PCB(this.processes.length, this.MainMem.next, input.substring(0, 2));
            this.MainMem.put(this.MainMem.next, input);
        };
        Cpu.prototype.Execute = function (raw) {
            var codes = [];
            var input = raw.split(" ");
            for (var i = 0; i < input.length; i++) {
                if (input[i] == "A9") {
                    codes[codes.length] = "LDA #$" + input[i + 1];
                }
                else if (input[i] == "AD") {
                    codes[codes.length] = "LDA $" + input[i + 2] + input[i + 1];
                    i += 3;
                }
                else if (input[i] == "8D") {
                    codes[codes.length] = "STA $" + input[i + 2] + input[i + 1];
                    i += 3;
                }
                else if (input[i] == "6D") {
                    codes[codes.length] = "ADC $" + input[i + 2] + input[i + 1];
                    i += 3;
                }
                else if (input[i] == "A2") {
                    codes[codes.length] = "LDX #$" + input[i + 1];
                    i += 2;
                }
                else if (input[i] == "AE") {
                    codes[codes.length] = "LDX $" + input[i + 2] + input[i + 1];
                    i += 3;
                }
                else if (input[i] == "A0") {
                    codes[codes.length] = "LDY #$" + input[i + 1];
                    i += 2;
                }
                else if (input[i] == "AC") {
                    codes[codes.length] = "LDY $" + input[i + 2] + input[i + 1];
                    i += 3;
                }
                else if (input[i] == "EC") {
                    codes[codes.length] = "CPX $" + input[i + 2] + input[i + 1];
                    i += 3;
                }
                else if (input[i] == "00") {
                    codes[codes.length] = "BRK";
                }
                else if (input[i] == "EA") {
                    codes[codes.length] = "NOP";
                }
                else if (input[i] == "D0") {
                    codes[codes.length] = "BNE $" + input[i + 1];
                    i += 2;
                }
                else {
                    var reg = new RegExp(/^[0-9]{2}$/);
                    if (!reg.test(input[i])) {
                        _StdOut.putText("" + input[i] + " is not a valid op code");
                    }
                }
            }
            //var pcb = new PCB(0, this.PC, input[0]);
            // this.processes[this.processes.length] = pcb;
            // _StdOut.putText("User Program successfully added to main memory with PID " + pcb.pid);
            var p_pid = document.getElementById("PID");
            var p_pc = document.getElementById("p_PC");
            var p_ir = document.getElementById("p_IR");
            var p_acc = document.getElementById("p_Acc");
            var p_x = document.getElementById("p_Xreg");
            var p_y = document.getElementById("p_Yreg");
            var p_z = document.getElementById("p_Zflag");
            // p_pid.innerHTML = ""+pcb.pid;
            // p_pc.innerHTML = ""+pcb.PC;
            // p_ir.innerHTML = pcb.IR;
            // p_acc.innerText = "" + 0;
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
    var Memory = /** @class */ (function () {
        function Memory() {
            this.addresses = new Array(0xeee);
        }
        Memory.prototype.init = function () {
            for (var i = 0x000; i < this.addresses.length; i++) {
                this.addresses[i] = new Array(8);
                for (var j = 0; j < this.addresses[i].length; j++) {
                    this.addresses[i][j] = 0x00;
                }
                var disp = document.getElementById('addresses');
                var row = disp.insertRow(disp.rows.length);
                var loc = row.insertCell(0);
                loc.innerText = "" + i.toString(16);
                for (var y = 0; y < 8; y++) {
                    var cell = row.insertCell(y + 1);
                    cell.innerHTML = this.addresses[i][y];
                }
            }
        };
        Memory.prototype.put = function (key, value) {
            var start = key;
            if (value.length <= 8) {
                TSOS.Control.hostLog("less than 8");
                for (var i = 0; i < this.addresses[key].length; i++) {
                    this.addresses[key][i] = value[i];
                }
                TSOS.Control.hostLog("added");
            }
            else {
                var done = false;
                var j = 0;
                while (!done) {
                    for (var i = 0; i < this.addresses[key].length; i++) {
                        if (i == 7) {
                            if (j < value.length + 1) {
                                this.addresses[key][i] = 0xF;
                            }
                        }
                        this.addresses[key][i] = value[j];
                        j++;
                    }
                    if (j < value.length) {
                        key++;
                    }
                }
            }
            var disp = document.getElementById('addresses');
            var row = disp.insertRow(disp.rows.length);
            var loc = row.insertCell(0);
            loc.innerHTML = "" + start;
            for (var i = 0; i < 8; i++) {
                var cell = row.insertCell(i + 1);
                cell.innerHTML = this.addresses[start][i];
            }
            if (key > start) {
                start++;
                while (start <= key) {
                    var newrow = disp.insertRow(disp.rows.length);
                    var address = newrow.insertCell(0);
                    address.innerHTML = "" + start;
                    for (var i = 0; i < 8; i++) {
                        var cell = row.insertCell(i + 1);
                        cell.innerHTML = this.addresses[start][i];
                    }
                }
            }
        };
        Memory.prototype.get = function (loc) {
            return this.addresses[loc];
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
    var PCB = /** @class */ (function () {
        function PCB(pid, PC, IR) {
            if (pid === void 0) { pid = 0; }
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = 0x000; }
            this.pid = pid;
            this.PC = PC;
            this.IR = IR;
        }
        PCB.prototype.init = function (id, pc, ir) {
            this.pid = id;
            this.PC = pc;
            this.IR = ir;
        };
        return PCB;
    }());
})(TSOS || (TSOS = {}));
