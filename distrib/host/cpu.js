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
        function Cpu(PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = "00"; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.IR = "00";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.IR = _MemoryAccessor.readMemory(this.PC);
            TSOS.Control.updateCPUDisp();
            this.isExecuting = true;
            if (!_MemoryAccessor.isValid(this.PC)) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(5, 0));
            }
            else {
                var code = _MemoryAccessor.readMemory(this.PC);
                _Kernel.krnTrace("Executing op code " + code);
                switch (code) {
                    case "A9":
                        //load accumulator with constant which is located in the next memory location 
                        this.Acc = parseInt(_MemoryAccessor.readMemory(this.PC + 1), 16);
                        TSOS.Control.hostLog("Setting accumulator to " + _MemoryAccessor.readMemory(this.PC + 1), "CPU");
                        this.PC += 2;
                        TSOS.Control.updateCPUDisp();
                        break;
                    case "AD":
                        //load accumulator with a constant stored in memory already
                        var hex = _MemoryAccessor.readMemory(this.PC + 2);
                        hex += _MemoryAccessor.readMemory(this.PC + 1);
                        var loc = parseInt(hex, 16);
                        this.Acc = parseInt(_MemoryAccessor.readMemory(loc), 16);
                        this.PC += 3;
                        break;
                    case "8D":
                        //store accumulator in memory
                        //first we get the address where they want to store it
                        var hex = _MemoryAccessor.readMemory(this.PC + 2);
                        hex += _MemoryAccessor.readMemory(this.PC + 1);
                        //get the decimal address
                        var address = parseInt(hex, 16);
                        //Acc is displayed as decimal so we need to convert it to hex to store it
                        var val = this.Acc.toString(16);
                        _MemoryAccessor.writeMemory(address, val);
                        TSOS.Control.hostMemory();
                        this.PC += 3;
                        break;
                    case "6D":
                        //Adds contents of address to the accumulator
                        //first get the address given by the program
                        var hex = _MemoryAccessor.readMemory(this.PC + 2);
                        hex += _MemoryAccessor.readMemory(this.PC + 1);
                        //then convert it to decimal address
                        var address = parseInt(hex, 16);
                        //then add the number at the given location to the accumulator after you convert it to decimal
                        this.Acc += parseInt(_MemoryAccessor.readMemory(address), 16);
                        this.PC += 3;
                        break;
                    case "A2":
                        //load the x register with a constant given by the user
                        //its stored in hex, so convert it to decimal 
                        this.Xreg = parseInt(_MemoryAccessor.readMemory(this.PC + 1), 16);
                        this.PC += 2;
                        break;
                    case "AE":
                        //load X register from memory
                        //first get the given address
                        var hex = _MemoryAccessor.readMemory(this.PC + 2);
                        hex += _MemoryAccessor.readMemory(this.PC + 1);
                        //convert to decimal address
                        var address = parseInt(hex, 16);
                        //then load it into the register while converting it to decimal
                        this.Xreg = parseInt(_MemoryAccessor.readMemory(address), 16);
                        this.PC += 3;
                        break;
                    case "A0":
                        //load the Y register with a constant given by the user
                        //its stored in hex, so convert it to decimal 
                        this.Yreg = parseInt(_MemoryAccessor.readMemory(this.PC + 1), 16);
                        this.PC += 2;
                        break;
                    case "AC":
                        //load Y register from memory
                        //first get the given address
                        var hex = _MemoryAccessor.readMemory(this.PC + 2);
                        hex += _MemoryAccessor.readMemory(this.PC + 1);
                        //convert to decimal address
                        var address = parseInt(hex, 16);
                        //then load it into the register while converting it to decimal
                        this.Yreg = parseInt(_MemoryAccessor.readMemory(address), 16);
                        this.PC += 3;
                        break;
                    case "EA":
                        //no operation, so we just increment the program counter
                        this.PC++;
                        break;
                    case "00":
                        //break
                        //system call for exit
                        this.isExecuting = false;
                        break;
                    case "EC":
                        //compare byte in memory to Xregister, set Zflag is equal
                        //first get the address given by the user
                        var hex = _MemoryAccessor.readMemory(this.PC + 2);
                        hex += _MemoryAccessor.readMemory(this.PC + 1);
                        //then convert it to decimal
                        var address = parseInt(hex, 16);
                        //then get the value at that address and convert it to decimal
                        var value = parseInt(_MemoryAccessor.readMemory(address), 16);
                        //compare it to the Xregister
                        if (this.Xreg == value) {
                            this.Zflag = 1;
                        }
                        else {
                            this.Zflag = 0;
                        }
                        this.PC += 3;
                        break;
                    case "D0":
                        //branch n bytes if Xflag = 0
                        if (this.Zflag = 0) {
                            //first make sure the Zflag is zero
                            //then get the number of bytes we have to branch
                            var bytes = parseInt(_MemoryAccessor.readMemory(this.PC + 1), 16);
                            //then branch the specified number of bytes
                            this.PC = _MemoryAccessor.BNE(this.PC, bytes);
                        }
                        else {
                            this.PC += 2;
                        }
                        break;
                    case "EE":
                        //increment the value of a byte
                        //first get the hex address of the byte
                        var hex = _MemoryAccessor.readMemory(this.PC + 2);
                        hex += _MemoryAccessor.readMemory(this.PC + 1);
                        //then get the decimal address
                        var address = parseInt(hex, 16);
                        //then get the decimal value at that address
                        var decVal = parseInt(_MemoryAccessor.readMemory(address), 16);
                        //increment the value
                        decVal++;
                        //then convert it back to hex
                        var hexVal = decVal.toString(16);
                        //then store it
                        _MemoryAccessor.writeMemory(address, hexVal);
                        this.PC += 3;
                        break;
                    case "FF":
                        //system call: if Xreg = 1, print integer stored in Yreg
                        //if Xreg = 2, print the 00-terminated string stored at the adress in the Yreg
                        if (this.Xreg == 1) {
                        }
                        else if (this.Xreg == 2) {
                        }
                        break;
                }
                TSOS.Control.updateCPUDisp();
                TSOS.Control.hostMemory();
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
