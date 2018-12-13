var TSOS;
(function (TSOS) {
    var processManager = /** @class */ (function () {
        function processManager(residentQueue, readyQueue, running) {
            if (residentQueue === void 0) { residentQueue = new TSOS.Queue(); }
            if (readyQueue === void 0) { readyQueue = new TSOS.Queue(); }
            if (running === void 0) { running = void 0; }
            this.residentQueue = residentQueue;
            this.readyQueue = readyQueue;
            this.running = running;
            //creates an empty array of PCBS
            this.init();
        }
        processManager.prototype.init = function () {
            var q = new Array();
            var qq = new Array();
            this.residentQueue = new TSOS.Queue(q);
            this.readyQueue = new TSOS.Queue(qq);
        };
        processManager.prototype.getTopPriority = function () {
            var size = this.readyQueue.getSize();
            var top;
            for (var i = 0; i < size; i++) {
                var pcb = this.readyQueue.dequeue();
                if (top == null) {
                    top = pcb;
                }
                else {
                    if (pcb.priority < top.priority) {
                        this.readyQueue.enqueue(top);
                        top = pcb;
                    }
                    else {
                        this.readyQueue.enqueue(pcb);
                    }
                }
            }
            return top;
        };
        processManager.prototype.createProcess = function (codes, args) {
            //first make sure the op codes can fit within a partition
            if (codes.length > _MemoryManager.lim) {
                _StdOut.putText("Failed loading user program, the program must be less than 256 bytes");
                return;
            }
            //then make sure there is an available partition
            var part = _MemoryManager.nextAvailable(codes.length);
            if (part > -1) {
                var p = new TSOS.PCB(_PID);
                p.init(part, codes.length);
                if (args != null && args.length > 0) { // add the priority if there is one
                    p.priority = args[0];
                }
                else {
                    p.priority = 1; //  if not just make it 1
                }
                TSOS.Control.hostLog("Loaded process with PID " + _PID);
                _Console.putText("Loaded process with PID " + _PID);
                _PID++;
                this.residentQueue.enqueue(p);
                //then load it into memory
                _MemoryManager.loadIn(codes, part);
            }
            else {
                //load it into disk
                var prevLength = codes.length;
                var id = _Swap.swapToDisk(codes, _PID); // first create the file name
                if (id != null) {
                    var pcb = new TSOS.PCB(_PID); // create the PCB today
                    pcb.init(999, prevLength); // 999 denotes a process in swap
                    if (args != null && args.length > 0) { // add the priority if there is one
                        pcb.priority = args[0];
                    }
                    else {
                        pcb.priority = 1; //  if not just make it 1
                    }
                    pcb.swapped = true;
                    pcb.State = "Swapped";
                    this.residentQueue.enqueue(pcb);
                    TSOS.Control.updatePCBDisp();
                    _StdOut.putText("Program loaded into swap memory with PID: " + _PID);
                    _PID++;
                }
                else {
                    _StdOut.putText("Program loading failed, no memory available");
                }
            }
        };
        processManager.prototype.remove = function (pid) {
            //removes a PCB from the array of PCBS and updates the PCB display
            if (this.running != void 0) {
                if (this.running.pid == pid) {
                    _MemoryManager.clearMem(this.running.partition);
                    this.running = void 0;
                    _Kernel.krnTrace("removed pid " + pid + "(running process)");
                }
            }
            else {
                for (var i = 0; i < this.readyQueue.getSize(); i++) {
                    var pro = this.readyQueue.dequeue();
                    if (pro.pid == pid) {
                        _Kernel.krnTrace("removed pid " + pid);
                        return;
                    }
                    else {
                        this.readyQueue.enqueue(pro);
                    }
                }
            }
            TSOS.Control.updatePCBDisp();
            TSOS.Control.hostMemory();
        };
        processManager.prototype.updatePCB = function () {
            //updates the Data in the PCB
            this.running.PC = _CPU.PC;
            this.running.IR = _CPU.IR;
            this.running.Acc = _CPU.Acc;
            this.running.Xreg = _CPU.Xreg;
            this.running.Yreg = _CPU.Yreg;
            this.running.Zflag = _CPU.Zflag;
        };
        processManager.prototype.runAll = function () {
            _Kernel.krnTrace("Running all loaded processes");
            RUNALL = true;
            while (!this.residentQueue.isEmpty()) {
                this.readyQueue.enqueue(this.residentQueue.dequeue());
            }
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH, 0));
        };
        processManager.prototype.run = function () {
            TSOS.Control.hostLog("Running", "Process Manager");
            if (!this.isEmpty()) {
                TSOS.Control.hostLog("not empty", "Process Manager");
                this.running = this.readyQueue.dequeue();
                _RunningPartition = this.running.partition;
                _CPU.PC = this.running.PC;
                _CPU.IR = this.running.IR;
                _CPU.Acc = this.running.Acc;
                _CPU.Xreg = this.running.Xreg;
                _CPU.Yreg = this.running.Yreg;
                _CPU.Zflag = this.running.Zflag;
                _CPU.isExecuting = true;
                if (this.running.swapped) {
                    // if its swapped we have to roll in.
                    _Swap.rollIn(this.running);
                    this.running.swapped = false;
                    this.running.TSB = "0:0:0";
                }
                this.running.State = "running";
                TSOS.Control.updatePCBDisp();
                TSOS.Control.hostMemory();
                TSOS.Control.updateCPUDisp();
            }
        };
        processManager.prototype.listPs = function () {
            var ps = [];
            for (var i = 0; i < this.readyQueue.getSize(); i++) {
                var p = this.readyQueue.dequeue();
                ps[i] = p.pid;
                this.readyQueue.enqueue(p);
            }
            return ps;
        };
        processManager.prototype.isEmpty = function () {
            return this.readyQueue.isEmpty();
        };
        return processManager;
    }());
    TSOS.processManager = processManager;
})(TSOS || (TSOS = {}));
