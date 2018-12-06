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
            while (length < _MemoryManager.lim) {
                codes.push("00");
                length++;
            }
            _krnDiskDriver.writeSwap(filename, codes);
            return filename;
        };
        processSwap.prototype.rollIn = function (pcb) {
            //moves a process from disk to main memory
            var fname = "$SWAP" + pcb.pid;
            var codes = _krnDiskDriver.diskRead(fname)[0];
            var extra = Math.ceil(_MemoryManager.lim / _Disk.dataSize) * _Disk.dataSize;
            for (var i = 0; i < extra - _MemoryManager.lim; i++) {
                codes.pop();
            }
            if (_MemoryManager.hasSpace(codes.length)) {
                var partition = _MemoryManager.nextAvailable(codes.length);
                _MemoryManager.loadIn(codes, partition);
                pcb.partition = partition;
                _krnDiskDriver.diskDelete(fname);
                TSOS.Control.hostMemory();
                TSOS.Control.hostDisk();
            }
            else {
                this.rollOut(pcb);
            }
        };
        processSwap.prototype.rollOut = function (pcb) {
            //get the name of the file
            var fname = "$SWAP" + pcb.pid;
            //decide which memory partition to swap it with(don't wanna pick favorites though)
            var part_to_swap = Math.floor(Math.random() * _MemoryManager.partitions.length);
            var pcb_to_swap = this.findPCB(part_to_swap);
            if (pcb_to_swap != null) {
                var memData = _MemoryManager.getPartitionData(part_to_swap);
                _MemoryManager.clearMem(part_to_swap);
                var data = _krnDiskDriver.diskRead(fname)[0];
                var extra = Math.ceil(_MemoryManager.lim / _Disk.dataSize) * _Disk.dataSize;
                for (var i = 0; i < extra - _MemoryManager.lim; i++) {
                    data.pop();
                }
                if (_MemoryManager.hasSpace(data.length)) {
                    var part = _MemoryManager.nextAvailable();
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
                var memoryToDiskID = this.swapToDisk(memData, pcb_to_swap);
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
