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
var TSOS;
(function (TSOS) {
    var Control = /** @class */ (function () {
        function Control() {
        }
        Control.hostInit = function () {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        };
        Control.hostLog = function (msg, source) {
            if (source === void 0) { source = "?"; }
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        };
        Control.hostMemory = function () {
            var table = document.getElementById('addresses');
            var pointer = 0;
            for (var i = 0; i < table.rows.length; i++) {
                for (var j = 1; j < 9; j++) {
                    table.rows[i].cells.item(j).innerHTML = _Mem.memoryArr[pointer].toString().toUpperCase();
                    table.rows[i].cells.item(j).style.color = "black";
                    table.rows[i].cells.item(j).style['font-weight'] = "normal";
                    // Check to see if the hex needs a leading zero.
                    // If it does convert it to decimal and throw the zero in
                    var dec = parseInt(_Mem.memoryArr[pointer].toString(), 16);
                    if (dec < 16 && dec > 0) {
                        table.rows[i].cells.item(j).innerHTML = "0" + dec.toString(16).toUpperCase();
                    }
                    pointer++;
                }
            }
        };
        Control.initMemDisplay = function () {
            var table = document.getElementById('addresses');
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
        };
        Control.updatePCBDisp = function () {
            //updates the PCB display
            var table = document.getElementById('processes');
            //first remove all the rows from the table so we don't have duplicates
            while (table.rows.length > 1) { //make sure we don't remove the thead because that would look like trash
                table.deleteRow(1);
            }
            var resQ = [];
            //load all the resident processes into an array
            var resSize = _ProcessManager.residentQueue.getSize();
            for (var i = 0; i < resSize; i++) {
                var pr = _ProcessManager.residentQueue.dequeue();
                resQ.push(pr);
                _ProcessManager.residentQueue.enqueue(pr);
            }
            //then add the PCB rows accordingly
            while (resQ.length > 0) {
                var p = resQ.shift();
                var row = table.insertRow(-1);
                var PID = row.insertCell(0);
                PID.innerHTML = "" + p.pid;
                var PC = row.insertCell(1);
                PC.innerHTML = "" + p.PC;
                var IR = row.insertCell(2);
                IR.innerHTML = "" + p.IR;
                var Acc = row.insertCell(3);
                Acc.innerHTML = "" + p.Acc;
                var Xreg = row.insertCell(4);
                Xreg.innerHTML = "" + p.Xreg;
                var Yreg = row.insertCell(5);
                Yreg.innerHTML = "" + p.Yreg;
                var Zflag = row.insertCell(6);
                Zflag.innerHTML = "" + p.Zflag;
                var State = row.insertCell(7);
                State.innerHTML = "" + p.State;
                var part = row.insertCell(8);
                part.innerHTML = "" + p.partition;
                var end = row.insertCell(9);
                end.innerHTML = "" + p.limit;
            }
            //first remove all the rows from the table so we don't have duplicates
            var table2 = document.getElementById('readyprocesses');
            while (table2.rows.length > 1) {
                table2.deleteRow(1);
            }
            var size = _ProcessManager.readyQueue.getSize();
            var readyQ = [];
            //then load all the ready processes into an array
            for (var i = 0; i < size; i++) {
                var pr = _ProcessManager.readyQueue.dequeue();
                readyQ.push(pr);
                _ProcessManager.readyQueue.enqueue(pr);
            }
            //and add all the ready PCB rowws accordingly
            while (readyQ.length > 0) {
                var p = readyQ.shift();
                var row = table2.insertRow(-1);
                var PID = row.insertCell(0);
                PID.innerHTML = "" + p.pid;
                var PC = row.insertCell(1);
                PC.innerHTML = "" + p.PC;
                var IR = row.insertCell(2);
                IR.innerHTML = "" + p.IR;
                var Acc = row.insertCell(3);
                Acc.innerHTML = "" + p.Acc;
                var Xreg = row.insertCell(4);
                Xreg.innerHTML = "" + p.Xreg;
                var Yreg = row.insertCell(5);
                Yreg.innerHTML = "" + p.Yreg;
                var Zflag = row.insertCell(6);
                Zflag.innerHTML = "" + p.Zflag;
                var State = row.insertCell(7);
                State.innerHTML = "" + p.State;
                var part = row.insertCell(8);
                part.innerHTML = "" + p.partition;
                var end = row.insertCell(9);
                end.innerHTML = "" + p.limit;
            }
        };
        Control.updateCPUDisp = function () {
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
        };
        //
        // Host Events
        //
        Control.hostBtnStartOS_click = function (btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            this.updateCPUDisp();
            _Mem = new TSOS.Memory();
            _Mem.init();
            this.hostMemory();
            this.initMemDisplay();
            _MemoryAccessor = new TSOS.memoryAccessor();
            _MemoryManager = new TSOS.memoryManager();
            _ProcessManager = new TSOS.processManager();
            _CPUScheduler = new TSOS.CPUscheduler();
            _Disk = new TSOS.Disk();
            _Disk.init();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
        };
        Control.hostBtnHaltOS_click = function (btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        };
        Control.hostBtnReset_click = function (btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        };
        Control.hostDisk = function () {
            var table = document.getElementById('diskTable');
            // Remove all rows
            var rows = table.rows.length;
            for (var i = 0; i < rows; i++) {
                table.deleteRow(0);
            }
            var rowNum = 0;
            // firefox sucks and doesn't keep session storage in order
            // For each row, insert the TSB, available bit, pointer, and data into separate cells
            for (var trackNum = 0; trackNum < _Disk.tracks; trackNum++) {
                for (var sectorNum = 0; sectorNum < _Disk.sectors; sectorNum++) {
                    for (var blockNum = 0; blockNum < _Disk.blocks; blockNum++) {
                        // generate proper tsb id since firefox sucks and doesn't keep session storage ordered
                        var tsbID = trackNum + ":" + sectorNum + ":" + blockNum;
                        var row = table.insertRow(rowNum);
                        rowNum++;
                        row.style.backgroundColor = "white";
                        var tsb = row.insertCell(0);
                        tsb.innerHTML = tsbID;
                        tsb.style.color = "lightcoral";
                        var availableBit = row.insertCell(1);
                        availableBit.innerHTML = JSON.parse(sessionStorage.getItem(tsbID)).availableBit;
                        availableBit.style.color = "lightgreen";
                        var pointer = row.insertCell(2);
                        var pointerVal = JSON.parse(sessionStorage.getItem(tsbID)).pointer;
                        pointer.innerHTML = pointerVal;
                        pointer.style.color = "lightgray";
                        var data = row.insertCell(3);
                        data.innerHTML = JSON.parse(sessionStorage.getItem(tsbID)).data.join("").toString();
                        data.style.color = "lightblue";
                    }
                }
            }
        };
        return Control;
    }());
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
