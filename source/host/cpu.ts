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
        public constructor(public PC = 0,
            public IR = "00",
            public Acc = 0,
            public Xreg = 0,
            public Yreg = 0,
            public Zflag = 0,
            public isExecuting: boolean = false) {
       
    }

        public init(): void {
            this.PC = 0;
            this.IR = "00";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;


            

            

        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.IR = _MemoryAccessor.readMemory(this.PC);
            
            Control.updateCPUDisp();
            
            this.isExecuting = true;
            if (!_MemoryAccessor.isValid(this.PC)) {
                _KernelInterruptQueue.enqueue(new Interrupt(PC_OUT_OF_BOUNDS, 0));
               
            } else {
                var code = _MemoryAccessor.readMemory(this.PC);
                _Kernel.krnTrace("Executing op code " + code + "at " + this.PC);
                
                switch (code) {
                    case "A9":
                        //load accumulator with constant which is located in the next memory location 
                        this.Acc = parseInt(_MemoryAccessor.readMemory(this.PC + 1), 16);
                        Control.hostLog("Setting accumulator to " + _MemoryAccessor.readMemory(this.PC + 1), "CPU");

                        this.PC += 2;
                        Control.updateCPUDisp();
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
                        Control.hostMemory();
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
                        //set isExecuting to false
                        
                        //change process state to complete
                        _ProcessManager.updatePCB();
                        //remove the process
                        
                        if (RUNALL) {
                            if (_ProcessManager.readyQueue.getSize() > 0) {
                                _KernelInterruptQueue.enqueue(new Interrupt(EXIT_PROCESS, RUNALL));
                               
                            } else {
                                _Kernel.krnTrace("Finished Running all processes");
                                _KernelInterruptQueue.enqueue(new Interrupt(EXIT_PROCESS, RUNALL));
                            }
                            
                        } else {
                            _KernelInterruptQueue.enqueue(new Interrupt(EXIT_PROCESS, RUNALL));
                        }
                        Control.hostMemory();
                        Control.updatePCBDisp();
                        
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
                        } else {
                            this.Zflag = 0;

                        }
                        this.PC += 3;
                        break;
                    case "D0":
                        //branch n bytes if Xflag = 0
                        if (this.Zflag == 0) {
                            //first make sure the Zflag is zero
                            //then get the number of bytes we have to branch
                            var bytes = parseInt(_MemoryAccessor.readMemory(this.PC + 1), 16);
                            //then branch the specified number of bytes
                            this.PC = _MemoryAccessor.BNE(this.PC, bytes);

                        } else {
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
                        //if Xreg = 2, print the 00-terminated string stored at the address in the Yreg
                        if (this.Xreg == 1) {
                            _KernelInterruptQueue.enqueue(new Interrupt(CONSOLE_WRITE, "Yreg: " + this.Yreg));
                        } else if (this.Xreg == 2) {
                            var addr = this.Yreg;
                            var output = "";
                            // Gets the ASCII from the address, converts it to characters, then passes to console's putText.
                            while (_MemoryAccessor.readMemory(addr) != "00") {
                                var ascii = _MemoryAccessor.readMemory(addr);
                                // Convert hex to decimal
                                var dec = parseInt(ascii.toString(), 16);
                                var chr = String.fromCharCode(dec);
                                output += chr;
                                addr++;
                            }
                            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONSOLE_WRITE, "String: " + output));

                        }
                        this.PC++;
                        break;
                    
                }
                //update CPU and Memory displays
                try {
                    _ProcessManager.updatePCB();
                } catch (e) {
                    console.log('Error' + e);
                }
               
                Control.updateCPUDisp();
                Control.hostMemory();
                Control.updatePCBDisp();
                
                
                
                





            }
            

        }





    }
}