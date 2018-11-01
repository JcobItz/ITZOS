///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />

/* ------------
     Control.ts

     Requires globals.ts.

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }
        public static hostMemory() {
            var table = <HTMLTableElement>document.getElementById('addresses');
            var pointer = 0;
            for (var i = 0; i < table.rows.length; i++) {
                for (var j = 1; j < 9; j++) {
                    table.rows[i].cells.item(j).innerHTML = _Mem.memoryArr[pointer].toString().toUpperCase();
                    table.rows[i].cells.item(j).style.color = "black";
                    table.rows[i].cells.item(j).style['font-weight'] = "normal";
                    // Check to see if the hex needs a leading zero.
                    // If it does, then convert the hex to decimal, then back to hex, and add a leading zero.
                    // We do that seemingly dumb step because if the value stored in memory already has a leading 0, will make display look gross.
                    var dec = parseInt(_Mem.memoryArr[pointer].toString(), 16);
                    if (dec < 16 && dec > 0) {
                        table.rows[i].cells.item(j).innerHTML = "0" + dec.toString(16).toUpperCase();
                    }
                    pointer++;
                }
            }
        }
        public static initMemDisplay() {
            var table = <HTMLTableElement> document.getElementById('addresses');
            // We assume each row will hold 8 memory values
            for (var i = 0; i < _Mem.memoryArr.length / 8; i++) {
                var row = table.insertRow(i);
                var memoryAddrCell = row.insertCell(0);
                var address = i * 8;
                // Display address in proper memory hex notation
                // Adds leading 0s if necessary
                var displayAddress = "0x";
                for (var k = 0; k < 3 - address.toString(16).length; k++) {
                    displayAddress += "0";
                }
                displayAddress += address.toString(16).toUpperCase();
                memoryAddrCell.innerHTML = displayAddress;
                // Fill all the cells with 00s
                for (var j = 1; j < 9; j++) {
                    var cell = row.insertCell(j);
                    cell.innerHTML = "00";
                    cell.classList.add("memoryCell");
                }
            }
        }
        public static updatePCBDisp() {
            //updates the PCB display
            var table = <HTMLTableElement>document.getElementById('processes');
            //first remove all the rows from the table so we don't have duplicates
            for (var x = 1; x < table.rows.length; x++) {
                table.deleteRow(x);
            }
            //then add all of the processes in the resident to the table
            var p = new Array<TSOS.PCB>();
            //put the resident queue into an array 
            for (var i = 0; i < _ProcessManager.residentQueue.getSize(); i++) {
                p.push(_ProcessManager.residentQueue.dequeue());
            }
            //then loop throught the array to update add each pcb to the table
            for (var i = 0; i < p.length; i++) {
                if (!_ProcessManager.residentQueue[i] == void 0) {


                    var row = table.insertRow(i + 1);
                    var PID = row.insertCell(0);
                    PID.innerHTML = "" + _ProcessManager.residentQueue[i].pid;
                    var PC = row.insertCell(1);
                    PC.innerHTML = "" + _ProcessManager.residentQueue[i].PC;
                    var IR = row.insertCell(2);
                    IR.innerHTML = "" + _ProcessManager.residentQueue[i].IR;
                    var Acc = row.insertCell(3);
                    Acc.innerHTML = "" + _ProcessManager.residentQueue[i].Acc;
                    var Xreg = row.insertCell(4);
                    Xreg.innerHTML = "" + _ProcessManager.residentQueue[i].Xreg;
                    var Yreg = row.insertCell(5);
                    Yreg.innerHTML = "" + _ProcessManager.residentQueue[i].Yreg;
                    var Zflag = row.insertCell(6);
                    Zflag.innerHTML = "" + _ProcessManager.residentQueue[i].Zflag;
                    var State = row.insertCell(7);
                    State.innerHTML = "" + _ProcessManager.residentQueue[i].State;
                }
            }
            for (var i = 0; i < p.length; i++) {
                _ProcessManager.residentQueue.enqueue(p[i]);
            }
        }
        public static updateCPUDisp() {
            //updates the CPU display with the current data
            var pcDisp = document.getElementById('PC');
            pcDisp.innerHTML = "" + _CPU.PC;

            var irDisp = document.getElementById('IR');
            irDisp.innerHTML = "" + _CPU.IR;

            var accDisp = document.getElementById('Acc');
            accDisp.innerHTML = "" + _CPU.Acc;

            var xDisp = document.getElementById('Xreg');
            xDisp.innerHTML = "" + _CPU.Xreg;

            var yDisp = document.getElementById('Yreg');
            yDisp.innerHTML = "" + _CPU.Yreg;

            var zDisp = document.getElementById('Zflag');
            zDisp.innerHTML = "" + _CPU.Zflag;
        }

        //
        // Host Events
        //
        
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            this.updateCPUDisp();
            _Mem = new Memory();
            _Mem.init();
           
            this.hostMemory();
            this.initMemDisplay();

            _MemoryAccessor = new memoryAccessor();
            _MemoryManager = new memoryManager();
            _ProcessManager = new processManager();

            _CPUScheduler = new TSOS.CPUscheduler();

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
    }
}
