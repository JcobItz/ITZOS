///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

module TSOS {
    export class deviceDriverDisk extends DeviceDriver {
        constructor() {
            super();
            this.driverEntry = this.DiskdriverEntry();

        }
        public DiskdriverEntry() {
            this.status = "loaded";

        }
        public formatDisk() {

            //reformats the disk and overwrites all data
            //first reinitialize disk
            _Disk.init();

            //then remove any swapped processes from the resident Queue
            var resSize = _ProcessManager.residentQueue.getSize();
            for (var i = 0; i < resSize; i++) {
                var pcb: PCB = _ProcessManager.residentQueue.dequeue();
                if (pcb.swapped) {
                    //if its swapped we just dont put it back on the queue
                } else {
                    _ProcessManager.residentQueue.enqueue(pcb);
                }

            }
            Control.updatePCBDisp();
            Control.hostDisk();


        }
        public ls() {
            //lists all files present on the system
            _StdOut.putText("filename                    date created");
            _StdOut.advanceLine();

            
            for (var s = 0; s < _Disk.sectors; s++) {
                for (var b = 0; b < _Disk.blocks; b++) {
                    if (s == 0 && b == 0) {
                        continue;
                    }
                    //only look on first track, where the directory is
                    var ID = "0:" + s + ":" + b;
                    var block = JSON.parse(sessionStorage.getItem(ID));
                    if (block.availableBit == "1") {//only get blocks that are in use
                        var data = this.readData(ID);
                        var string = "";
                        var date = "";
                        
                        for (var i = 4; i < data.length; i++) {
                            
                                if (data[i] != "00") {
                                    string += String.fromCharCode(parseInt(data[i], 16));
                                }
                            
                        }
                        string += "         -          ";
                        string += parseInt(data[0], 16) + "/";
                        string += parseInt(data[1], 16) + "/";
                        var year = "" + data[2] + "" + data[3];
                        string += parseInt(year, 16);
                        _KernelInterruptQueue.enqueue(new Interrupt(CONSOLE_WRITE, string));
                       
                    }
                }
            }
            return;

            
        }
        public alreadyExists(file: string): boolean {
            //checks to see if a file already exists in the directory
            var hexArr = this.toASCII(file);
            for (var s = 0; s < _Disk.sectors; s++) {
                for (var b = 0; b < _Disk.blocks; b++) {
                    if (s == 0 && b == 0) {
                        // ignore first block in first sector, it is the MBR
                        continue;
                    }
                    var tsbID = "0" + ":" + s + ":" + b;
                    var dirBlock = JSON.parse(sessionStorage.getItem(tsbID));
                    var matchingFileName = true;
                    // check only blocks with data stored in them
                    if (dirBlock.availableBit == "1") {
                        for (var k = 4, j = 0; j < hexArr.length; k++ , j++) {
                            if (hexArr[j] != dirBlock.data[k]) {
                                matchingFileName = false;
                            }
                        }
                        // If reach end of hexArr but dirBlock data still more?
                        if (dirBlock.data[hexArr.length + 4] != "00") {
                            matchingFileName = false;
                        }
                        // We found the filename
                        if (matchingFileName) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        public diskWrite(filename, text) {
            //Writes data to the specified file
            //check directory for filename
            var hex = this.toASCII(filename);
            for (var s = 0; s < _Disk.sectors; s++) {
                for (var b = 0; b < _Disk.blocks; b++) {
                    if (s == 0 && b == 0) {
                        //ignore mbr
                        continue;
                    }
                    var ID = "0" + ":" + s + ":" + b;
                    var dir = JSON.parse(sessionStorage.getItem(ID));
                    var fileFound = true;
                    if (dir.availableBit == "1") {//only check blocks in use
                        for (var i = 4, j = 0; j < hex.length; i++ , j++) {
                            if (hex[j] != dir.data[i]) {
                                fileFound = false;
                            }
                        }
                        //at the end of the hex array make sure there isn't more data in dir after it
                        if (dir.data[hex.length + 4] != "00") {
                            fileFound = false;
                        }
                        if (fileFound) {
                            //convert text to hex array, remove quotes
                            var textArr = this.toASCII(text.slice(1, -1));
                            //allocate the appropriate amount of space
                            var suffSpace = this.allocateDiskSpace(dir.pointer, textArr);
                            if (suffSpace == null) {
                                return DISK_FULL;
                            }
                            //now write the data to the disk
                            this.writeData(dir.pointer, textArr);
                            return SUCCESS;
                        }


                    }
                }
            }
            return FILE_NAME_DOESNT_EXIST;
        }
        public writeData(ID, data) {
            //writes data to block specified by diskWrite
            var pointer = 0;
            var currentID = ID;
            _Kernel.krnTrace("Writing to ID: " + currentID);
            var currBlock = JSON.parse(sessionStorage.getItem(currentID));
            //clear existing data
            currBlock = this.clearData(currBlock);
            
            for (var i = 0; i < data.length; i++) {
                currBlock.data[pointer] = data[i];
                pointer++;
                
            //make sure there is still space in the block
                if (pointer == _Disk.dataSize) {
                    //set block in session storage
                    sessionStorage.setItem(currentID, JSON.stringify(currBlock));
                    currentID = currBlock.pointer;
                    currBlock = JSON.parse(sessionStorage.getItem(currentID));
                    currBlock = this.clearData(currBlock);
                    pointer = 0;
                }
            }
            
            //if the pointer in current block is still pointing to something, the old file was longer, so clear the rest
            this.deleteData(currBlock.pointer);
            currBlock.pointer = "0:0:0";
            //update the session storage
            sessionStorage.setItem(currentID, JSON.stringify(currBlock));
            Control.hostDisk();
            
        }
        public writeSwap(fname, codes) {
            //writes a user program to disk for use later
            var hex = this.toASCII(fname);
            for (var s = 0; s < _Disk.sectors; s++) {
                for (var b = 0; b < _Disk.blocks; b++) {
                    if (s == 0 && b == 0) {
                        //ignore mbr
                        continue;
                    }
                    var ID = "0" + ":" + s + ":" + b;
                    var dir = JSON.parse(sessionStorage.getItem(ID));
                    var fileFound = true;
                    if (dir.availableBit == "1") {//only check blocks in use
                        for (var i = 4, j = 0; j < hex.length; i++ , j++) {
                            if (hex[j] != dir.data[i]) {
                                fileFound = false;
                            }
                        }
                        //at the end of the hex array make sure there isn't more data in dir after it
                        if (dir.data[hex.length + 4] != "00") {
                            fileFound = false;
                        }
                        if (fileFound) {
                            //allocate sufficient space for codes
                            //put codes into a data block
                            var dataBlock = JSON.parse(sessionStorage.getItem(dir.pointer));
                            dataBlock.availableBit = "0";
                            sessionStorage.setItem(dir.pointer, JSON.stringify(dataBlock));
                            
                            var loc = this.allocateDiskSpace(codes, dir.pointer);
                            
                            if (!loc) {
                                return DISK_FULL;
                            }
                            
                            this.writeData(dir.pointer, codes);
                            
                            return SUCCESS;

                           
                        }


                    }
                }
            }
            return FILE_NAME_DOESNT_EXIST;

        }
        public readData(ID) {
            //reads data at the id given by diskRead
            _Kernel.krnTrace("DiskDriver: Reading data in location: " + ID);
            var block = JSON.parse(sessionStorage.getItem(ID));
            var pointer = 0;
            var retArr = [];
            while (true) {
                //read entire data block
                retArr.push(block.data[pointer]);
                pointer++;
                if (pointer == _Disk.dataSize) {
                    //go to next ID if there is a pointer to it
                    if (block.pointer != "0:0:0") {
                        block = JSON.parse(sessionStorage.getItem(block.pointer));
                        pointer = 0;
                    } else {
                        return retArr;
                    }
                } 
            }
            
        }
        public diskRead(filename) {
            //reads the data in a specific file
            _Kernel.krnTrace("DiskDriver: attempting to read file: " + filename);
           
            //look for filename in directory
            var hex = new Array();
            hex = this.toASCII(filename);
            
           
            for (var s = 0; s < _Disk.sectors; s++) {
                for (var b = 0; b < _Disk.blocks; b++) {
                    if (s == 0 && b == 0) {
                        //ignore the mbr
                        continue;
                    }
                    var ID = "0:" + s + ":" + b;
                    var dir = JSON.parse(sessionStorage.getItem(ID));
                    var fileFound = true;
                    if (dir.availableBit == "1") {
                        var ptr = 4;
                        for (var j = 0; j < hex.length; j++) {
                            if (hex[j] != dir.data[ptr]) {
                                fileFound = false;
                            }
                            ptr++;
                        }
                        //if the dir data has more than the filename, it doesn't match
                        if (dir.data[hex.length + 4] != "00") {
                            fileFound = false;
                        }
                        //if we did find it
                        if (fileFound) {
                            
                            //read recursively
                            var dataPointer = dir.pointer;
                            
                            var data:string[] = this.readData(dataPointer);
                           
                            
                            var fileData = "";
                            for (var i = 0; i < data.length; i++) {
                                //read until we get to a 00
                                if (data[i] != "00") {
                                    fileData += (String.fromCharCode(parseInt(data[i], 16)));
                                    
                                } else {
                                    break;
                                }
                            }
                            
                            var retVal = [data, fileData];
                            return retVal;
                        }
                    }
                }
            }
            return FILE_NAME_DOESNT_EXIST;
        }
        public diskDelete(file) {
            //deletes a file
            
            var hexArr = this.toASCII(file);
            for (var s = 0; s < _Disk.sectors; s++) {
                for (var b = 0; b < _Disk.blocks; b++) {
                    if (s == 0 && b == 0) {
                        // ignore first block in first sector, it is the MBR
                        continue;
                    }
                    var tsbID = "0" + ":" + s + ":" + b;
                    var dirBlock = JSON.parse(sessionStorage.getItem(tsbID));
                    var fileFound = true;
                    // check only blocks with data stored in them
                    if (dirBlock.availableBit == "1") {
                        for (var k = 4, j = 0; j < hexArr.length; k++ , j++) {
                            if (hexArr[j] != dirBlock.data[k]) {
                                fileFound = false;
                            }
                        }
                        // If reach end of hexArr but dirBlock data still more?
                        if (dirBlock.data[hexArr.length + 4] != "00") {
                            fileFound = false;
                        }
                        // We found the filename
                        if (fileFound) {
                            var status = this.deleteData(tsbID);
                            return status;
                        }
                    }
                }
            }
        }
        public deleteData(ID) {
            //removes the pointers and changes the available bit of the ID given by diskDelete
            var block = JSON.parse(sessionStorage.getItem(ID));
            if (block.pointer != "0:0:0") {//if the pointer of the next block isnt empty
                this.deleteData(block.pointer);//keep deleting recursively
            }
            block.availableBit = "0";
            sessionStorage.setItem(ID, JSON.stringify(block));
            return SUCCESS;
        }
        public createFile(filename: string) {
            //creates new file in first open block in the directory
            _Kernel.krnTrace("Attempting to create file: " + filename);
            if (this.alreadyExists(filename)) {
                return "Already exists";
            }
            for (var s = 0; s < _Disk.sectors; s++) {
                for (var b = 0; b < _Disk.blocks; b++) {
                    if (s == 0 && b == 0) {
                        //ignore block 0 sector 0 because it has mbr
                        continue;
                    }
                    var tsbID = "0" + ":" + s + ":" + b;
                    var dir = JSON.parse(sessionStorage.getItem(tsbID));
                    
                    if (dir.availableBit == "0") {//if block is available
                        //find first empty block 
                        var blockID = this.nextFreeBlock();
                        if (blockID != null) {
                            var block = JSON.parse(sessionStorage.getItem(blockID));
                            dir.availableBit = "1";
                            block.availableBit = "1";
                            //clear any data in the block
                            block = this.clearData(block);
                            //change dir pointer to new available block
                            dir.pointer = blockID;
                            //convert desired filename to ASCII
                            var hex = new Array();
                            hex = this.toASCII(filename);
                            //clear dir block
                            dir = this.clearData(dir);
                            //get date(in hex of course)
                            var date = new Date();
                            var month = (date.getMonth() + 1).toString(16);
                            if (month.length == 1) {
                                month = "0" + month; //always display 2 digit month
                            }
                            var day = (date.getDate()).toString(16);
                            if (day.length == 1) {
                                day = "0" + day; //again always display 2 digit day
                            }
                            var year = (date.getFullYear()).toString(16);
                            if (year.length == 3) {
                                year = "0" + year;
                            }
                            //store date in first 4 bytes
                            dir.data[0] = month;
                            dir.data[1] = day;
                            dir.data[2] = year.substring(0, 2);
                            dir.data[3] = year.substring(2);
                            //insert data into dir block
                            var pointer = 4;
                            for (var j = 0; j < hex.length; j++) {
                                dir.data[pointer] = hex[j];
                                pointer++;
                            }
                            sessionStorage.setItem(tsbID, JSON.stringify(dir));
                            sessionStorage.setItem(blockID, JSON.stringify(block));
                            Control.hostDisk();
                            return SUCCESS;
                        }

                    }
                }
            }
            Control.hostDisk();
            return DISK_FULL;
        }
        public allocateDiskSpace(file, ID) {
            //allocates some disk space for a file 
            //check the size of the file, if its more than one block we have to allocate more than one block 
            var length = file.length;
            var blockID = ID;
            var block = JSON.parse(sessionStorage.getItem(ID));
            //traverse block in case it already contains data to make sure we allocate enough blocks
            while (length > _Disk.dataSize) {
                //if the pointer is 0:0:0(the default stating pointer), find free blocks
                if (block.pointer != "0:0:0" && block.availableBit == "1") {
                    length -= _Disk.dataSize;
                    blockID = block.pointer;
                    block = JSON.parse(sessionStorage.getItem(block.pointer));
                } else {
                    //if you're here, you must need some more blocks
                    //mark that we're using this
                    block.availableBit = "1";
                    //find the number of blocks needed
                    var blocksNeeded = Math.ceil(length / _Disk.dataSize);
                    //ask for that many blocks
                    var freeBlocks = this.getFreeBlocks(blocksNeeded);
                    //if there are enough blocks
                    if (freeBlocks != null) {
                        //mark them as in use, and set pointers
                        //set current blocks pointer to first block in freeBlocks array
                        for (var i = 0, free = freeBlocks; i < free.length; i++) {
                            var b = free[i];
                            block.pointer = b;
                            block.availableBit = "1";
                            //set in session storage
                            sessionStorage.setItem(blockID, JSON.stringify(block));
                            blockID = b;
                            block = JSON.parse(sessionStorage.getItem(blockID));
                        }
                        block.availableBit = "1";
                        sessionStorage.setItem(blockID, JSON.stringify(block));
                        return true;
                    } else {
                        block.availableBit = "0";
                        return false;
                    }
                    
                }
            }
            sessionStorage.setItem(blockID, JSON.stringify(block));
            return true;
        }
        public nextFreeBlock() {
            //finds the next free block to store data
            for (var t = 1; t < _Disk.tracks; t++) {
                for (var s = 0; s < _Disk.sectors; s++) {
                    for (var b = 0; b < _Disk.blocks; b++) {
                        var tsbID = t + ":" + s + ":" + b;
                        var block = JSON.parse(sessionStorage.getItem(tsbID));
                        if (block.availableBit == "0") {//if block is available, return the tsbID
                            return tsbID;
                        }
                    }
                }
            }
        }
        public clearData(block) {
            //overwrites data in a specified block
            for (var i = 0; i < _Disk.dataSize; i++) {
                block.data[i] = "00";
            }
            return block;
        }
        
        public toASCII(f: string) {
            _Kernel.krnTrace("converting filename: " + f + " to ASCII");
            var stringArr = f.toString().split("");
            var hexArr = new Array();
            // Look at each character's ASCII value and convert it to a hex string
            for (var i = 0; i < stringArr.length; i++) {
                
                hexArr[i] = (stringArr[i].charCodeAt(0).toString(16));
            }
            _Kernel.krnTrace("returned hexArr");
            return hexArr;
        }
        public getFreeBlocks(n) {
            //returns an array with IDs of free blocks 
            var blocks = [];
            var start = _Disk.sectors * _Disk.blocks;//where blocks start
            var end = _Disk.tracks * _Disk.sectors;//where they end
            for (var t = 1; t < _Disk.tracks; t++) {
                for (var s = 0; s < _Disk.sectors; s++) {
                    for (var b = 0; b < _Disk.blocks; b++) {
                        var ID = t + ":" + s + ":" + b;
                        var dataBlock = JSON.parse(sessionStorage.getItem(ID));
                        //if available, push the ID to the array of free blocks
                        if (dataBlock.availableBit == "0") {
                            blocks.push(ID);
                            n--;
                        }
                        //if we found the requested number of blocks, return them
                        if (n == 0) {
                            return blocks;
                        }
                    }
                }
            }
            if (n != 0) {
                return null;
            }
        }

    }
}