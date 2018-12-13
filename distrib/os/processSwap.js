var TSOS;
(function (TSOS) {
    var processSwap = /** @class */ (function () {
        function processSwap() {
        }
        processSwap.prototype.swapToDisk = function (codes, pid) {
            //create a filename for the swapped process 
            var filename = "$SWAP" + pid;
            _krnDiskDriver.createFile(filename);
            var l = codes.length;
            _krnDiskDriver.writeSwap(filename, codes);
            return filename;
        };
        processSwap.prototype.rollIn = function (pcb) {
            //moves a process from disk to main memory
            var fname = "$SWAP" + pcb.pid;
            var codes = _krnDiskDriver.diskRead(fname)[0];
            if (codes == FILE_NAME_DOESNT_EXIST) {
                alert("WHOOPS");
                return;
            }
            if (_MemoryManager.hasSpace(codes.length)) {
                var partition = _MemoryManager.nextAvailable(codes.length);
                if (partition == -1) {
                    alert();
                }
                _MemoryManager.loadIn(codes, partition);
                _Kernel.krnTrace("Rolling In");
                pcb.partition = partition;
                pcb.swapped = false;
                pcb.State = "Ready";
                _krnDiskDriver.diskDelete(fname);
                TSOS.Control.hostMemory();
                TSOS.Control.hostDisk();
            }
            else {
                _Kernel.krnTrace("Rolling out");
                this.rollOut(pcb);
            }
        };
        processSwap.prototype.rollOut = function (pcb) {
            //get the name of the file
            var fname = "$SWAP" + pcb.pid;
            //decide which memory partition to swap it with(don't wanna pick favorites though)
            var part_to_swap = Math.floor(Math.random() * _MemoryManager.partitions.length);
            _Kernel.krnTrace("Got partition to swap");
            var pcb_to_swap = this.findPCB(part_to_swap);
            _Kernel.krnTrace("Got PCB to swap");
            if (pcb_to_swap != null) {
                var memData = _MemoryManager.getPartitionData(part_to_swap);
                _MemoryManager.clearMem(part_to_swap);
                var data = _krnDiskDriver.diskRead(fname)[0];
                if (_MemoryManager.hasSpace(data.length)) {
                    var part = _MemoryManager.nextAvailable(data.length);
                    _MemoryManager.loadIn(data, part);
                    pcb.partition = part;
                    pcb.swapped = false;
                    pcb.State = "Ready";
                    _krnDiskDriver.diskDelete(fname);
                    TSOS.Control.hostDisk();
                }
                else {
                    return;
                }
                var memoryToDiskID = this.swapToDisk(memData, pcb_to_swap.pid);
                if (memoryToDiskID != null) {
                    pcb_to_swap.partition = 999;
                    pcb_to_swap.swapped = true;
                    pcb_to_swap.State = "Swapped";
                    pcb_to_swap.TSB = memoryToDiskID;
                    TSOS.Control.hostLog("Performed roll out and roll in", "os");
                    TSOS.Control.updatePCBDisp();
                    TSOS.Control.hostMemory();
                    TSOS.Control.hostDisk();
                }
                else {
                    TSOS.Control.hostLog("Not enough space for swap", "os");
                    _MemoryManager.clearMem(0);
                    _MemoryManager.clearMem(1);
                    _MemoryManager.clearMem(2);
                    _CPU.isExecuting = false;
                }
            }
        };
        processSwap.prototype.findPCB = function (part) {
            for (var i = 0; i < _ProcessManager.readyQueue.getSize(); i++) {
                if (_ProcessManager.readyQueue.q[i].partition == part) {
                    return _ProcessManager.readyQueue.q[i];
                }
            }
            for (var i = 0; i < _ProcessManager.residentQueue.getSize(); i++) {
                if (_ProcessManager.residentQueue.q[i].partition == part) {
                    return _ProcessManager.residentQueue.q[i];
                }
            }
        };
        return processSwap;
    }());
    TSOS.processSwap = processSwap;
})(TSOS || (TSOS = {}));
