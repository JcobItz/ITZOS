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
        processManager.prototype.createProcess = function (codes) {
            //first make sure the op codes can fit within a partition
            if (codes.length > _MemoryManager.lim) {
                _StdOut.putText("Failed loading user program, the program must be less than 256 bytes");
                return;
            }
            //then make sure there is an available partition
            var part = _MemoryManager.nextAvailable();
            if (part > -1) {
                var p = new TSOS.PCB(_PID);
                p.init(part, codes.length);
                TSOS.Control.hostLog("Loaded process with PID " + _PID);
                _PID++;
                this.residentQueue.enqueue(p);
                _MemoryManager.loadIn(codes, _MemoryManager.nextAvailable());
                TSOS.Control.updatePCBDisp();
            }
            else {
                _StdOut.putText("There are no available memory partitions, please use the cleamMem command to clear all partitions, or clearPartition to clear one.");
            }
        };
        processManager.prototype.remove = function (p) {
            //removes a PCB from the array of PCBS and updates the PCB display
            for (var i = 0; i < _ProcessManager.residentQueue.getSize(); i++) {
                var pro = _ProcessManager.residentQueue.dequeue();
                if (pro.pid != p.pid) {
                    _ProcessManager.residentQueue.enqueue(pro);
                }
            }
            TSOS.Control.updatePCBDisp();
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
                this.running.State = "running";
                _CPU.isExecuting = true;
            }
        };
        processManager.prototype.isEmpty = function () {
            return this.residentQueue.isEmpty();
        };
        return processManager;
    }());
    TSOS.processManager = processManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=processManager.js.map