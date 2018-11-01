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
            }
            this.residentQueue.enqueue(p);
            TSOS.Control.updatePCBDisp();
            _MemoryManager.loadIn(codes, _MemoryManager.nextAvailable());
        };
        processManager.prototype.remove = function (p) {
            //removes a PCB from the array of PCBS and updates the PCB display
            var ps = new Array();
            for (var i = 0; i < this.residentQueue.getSize(); i++) {
                ps.push(this.residentQueue.dequeue());
            }
            for (var i = 0; i < ps.length; i++) {
                if (ps[i] == p) {
                    ps[i] == null;
                }
            }
            for (var i = 0; i < ps.length; i++) {
                if (ps[i] != null) {
                    this.residentQueue.enqueue(ps[i]);
                }
            }
            TSOS.Control.updatePCBDisp();
        };
        processManager.prototype.updatePCB = function (p) {
            //updates the Data in the PCB
            p.PC = _CPU.PC;
            p.IR = _CPU.IR;
            p.Acc = _CPU.Acc;
            p.Xreg = _CPU.Xreg;
            p.Yreg = _CPU.Yreg;
            p.Zflag = _CPU.Zflag;
            this.running = p;
        };
        processManager.prototype.run = function () {
            TSOS.Control.hostLog("Running", "Process Manager");
            if (!this.isEmpty()) {
                TSOS.Control.hostLog("not empty", "Process Manager");
                if (this.running != void 0) {
                    // _CPUScheduler.saveContext();
                }
                this.running = this.readyQueue.dequeue();
                _RunningPartition = this.running.partition;
                _CPUScheduler.switchContext();
                this.running.State = "running";
            }
        };
        processManager.prototype.isEmpty = function () {
            return this.residentQueue.isEmpty();
        };
        return processManager;
    }());
    TSOS.processManager = processManager;
})(TSOS || (TSOS = {}));
