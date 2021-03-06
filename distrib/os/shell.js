///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = /** @class */ (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.history = [];
            this.pointer = -1;
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellVer, "version", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellVer, "v", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            //date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "Displays current date and time.");
            this.commandList[this.commandList.length] = sc;
            //whereami
            sc = new TSOS.ShellCommand(this.shellLoc, "whereami", "Displays current location");
            this.commandList[this.commandList.length] = sc;
            //java
            sc = new TSOS.ShellCommand(this.shellJava, "java", "Dispenses a hot cup of java");
            this.commandList[this.commandList.length] = sc;
            //status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - sets the status message in the taskbar");
            this.commandList[this.commandList.length] = sc;
            //trigger error
            sc = new TSOS.ShellCommand(this.shellTrigger, "trigger", " - Triggers a BSOD");
            this.commandList[this.commandList.length] = sc;
            //load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "<int:priority> - validates hex code in program input and creates a new process which is loaded into memory. <int:priority> is optional");
            this.commandList[this.commandList.length] = sc;
            //run
            sc = new TSOS.ShellCommand(this.shellRun, "run", " <PID> - runs program with the specified PID");
            this.commandList[this.commandList.length] = sc;
            //clearMem
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", " - clears the entire memory array");
            this.commandList[this.commandList.length] = sc;
            //runAll
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", " - runs all programs in the ready Queue");
            this.commandList[this.commandList.length] = sc;
            //clearpartition
            sc = new TSOS.ShellCommand(this.shellClearPartition, "clearpartition", " <int> - clears the specified partition.");
            this.commandList[this.commandList.length] = sc;
            //kill
            sc = new TSOS.ShellCommand(this.shellKill, "kill", " <int> - Kills the Process with the specified PID");
            this.commandList[this.commandList.length] = sc;
            //Ps
            sc = new TSOS.ShellCommand(this.shellPs, "ps", " - lists the PIDs of all processes in the readyQueue.");
            this.commandList[this.commandList.length] = sc;
            //quantumn <int>
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", " <int> - Sets the quantum of the CPUScheduler to the specified integer.");
            this.commandList[this.commandList.length] = sc;
            // create <filename> - creates a file
            sc = new TSOS.ShellCommand(this.shellCreateFile, "create", "<filename> - Creates a file given a filename");
            this.commandList[this.commandList.length] = sc;
            // read
            sc = new TSOS.ShellCommand(this.shellReadFile, "read", "<filename> - Reads a file given a filename");
            this.commandList[this.commandList.length] = sc;
            // write 
            sc = new TSOS.ShellCommand(this.shellWriteFile, "write", "<filename> \"text\" - Writes text to a file given a filename");
            this.commandList[this.commandList.length] = sc;
            // delete 
            sc = new TSOS.ShellCommand(this.shellDeleteFile, "delete", "<filename> - Deletes a file given a filename");
            this.commandList[this.commandList.length] = sc;
            //format
            sc = new TSOS.ShellCommand(this.shellFormat, "format", " - re-initializes entire disk, overwriting all data residing in it");
            this.commandList[this.commandList.length] = sc;
            //list
            sc = new TSOS.ShellCommand(this.shellLs, "ls", " - lists the names of all files in the filesystem");
            this.commandList[this.commandList.length] = sc;
            //setschedule
            sc = new TSOS.ShellCommand(this.shellSetSchedule, "setschedule", "<algorithm> - changes the CPU scheduling algorith to the specified algorithm.  Algorithms: rr(round robin), fcfs(first come first serve), p(priority). ");
            this.commandList[this.commandList.length] = sc;
            //getschedule
            sc = new TSOS.ShellCommand(this.shellGetSchedule, "getschedule", " - Returns the name of the CPU scheduling algorithm running.");
            this.commandList[this.commandList.length] = sc;
            this.TaskTime();
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            this.TaskTime();
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.history[this.history.length] = buffer;
                this.pointer++;
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // Displays help, manual entry for specified shell command
                    case "ver":
                        _StdOut.putText("ver displays the current version of the shell.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down the virtualOS, but leaves underlying host and hardware simulation running.");
                        break;
                    case "cls":
                        _StdOut.putText("Clears the screen and resets the cursor position.");
                        break;
                    case "man":
                        _StdOut.putText("'man <topic>' displays the manual page for <topic>.");
                        break;
                    case "trace":
                        _StdOut.putText("'trace <on | off>' turns the OS trace on or off.");
                        break;
                    case "rot13":
                        _StdOut.putText("'rot13 <string>' does rot13 obfuscation on <string>.");
                        break;
                    case "prompt":
                        _StdOut.putText("'prompt <string>' sets the prompt to <string>.");
                        break;
                    case "date":
                        _StdOut.putText("Displays the current date and time.");
                        break;
                    case "whereami":
                        _StdOut.putText("Returns the latitude and longitude coordinates of IP address.");
                    case "java":
                        _StdOut.putText("Prints a picture of a coffee cup.");
                    case "status":
                        _StdOut.putText("Syntax: status <string> - changes the message on the toolbar at the top of the screen.");
                    case "trigger":
                        _StdOut.putText("Triggers an error which triggers a blue screen of death.");
                    case "load":
                        _StdOut.putText("Validates a user program and loads it into memory.");
                    case "run":
                        _StdOut.putText("Syntax: run <pid> - runs the process with the specified pid.");
                    case "clearmem":
                        _StdOut.putText("Clears all memory locations.");
                    case "clearpartition":
                        _StdOut.putText("Syntax: clearpartition <int: 0-2>. Clears the Specified memory partition.");
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellDate = function () {
            //Prints the Date and time to StdOut
            var date = new Date();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            var today = "" + month + "/" + day + "/" + year;
            var hours = date.getHours();
            var mins = date.getMinutes();
            var tod = "AM";
            if (hours > 12) {
                tod = "PM";
                var adj = hours - 12;
                hours = adj;
            }
            var sMins = "" + mins;
            if (mins < 10) {
                sMins = "0" + mins;
            }
            _StdOut.putText("The date is: " + today + ".  The time is: " + hours + ":" + sMins + tod);
        };
        Shell.prototype.shellLoc = function () {
            //prints the Latitude and longitude of the user, obtained from the browser, to StdOut
            var lat;
            var lon;
            navigator.geolocation.getCurrentPosition(function (position) {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                _StdOut.putText("Your current location is latitude: " + lat + " longitude: " + lon + ".");
                return;
            });
        };
        Shell.prototype.shellJava = function () {
            //just displays a simple coffee cup in StdOut
            _StdOut.putText("           S");
            _StdOut.advanceLine();
            _StdOut.putText("           S  ");
            _StdOut.advanceLine();
            _StdOut.putText("           S  ");
            _StdOut.advanceLine();
            _StdOut.putText("           S  ");
            _StdOut.advanceLine();
            _StdOut.putText("X                             X");
            _StdOut.advanceLine();
            _StdOut.putText("X_____________________________X");
            _StdOut.advanceLine();
            _StdOut.putText("X                             X===");
            _StdOut.advanceLine();
            _StdOut.putText("X                             X   ===");
            _StdOut.advanceLine();
            _StdOut.putText("X                             X      =");
            _StdOut.advanceLine();
            _StdOut.putText("X                             X   ===");
            _StdOut.advanceLine();
            _StdOut.putText("X                             X===");
            _StdOut.advanceLine();
            _StdOut.putText("XXXXXXXXXXXXXXXXXXXXXXXXX");
        };
        Shell.prototype.shellStatus = function (message) {
            // changes status text in the toolbar at the top of the screen
            var status = document.getElementById("status");
            status.innerText = message;
        };
        Shell.prototype.TaskTime = function () {
            //Updates the toolbar time
            var time = document.getElementById("time");
            var date = new Date();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            var today = "" + month + "/" + day + "/" + year;
            var hours = date.getHours();
            var mins = date.getMinutes();
            var tod = "AM";
            if (hours > 12) {
                tod = "PM";
                var adj = hours - 12;
                hours = adj;
            }
            var sMins = "" + mins;
            if (mins < 10) {
                sMins = "0" + mins;
            }
            time.innerText = "" + hours + ":" + sMins + tod + "   " + today;
        };
        Shell.prototype.shellTrigger = function () {
            //triggers an OS error
            _Kernel.krnTrapError("Routine test");
        };
        Shell.prototype.shellLoad = function (args) {
            //validates user program input and loads it into main memory
            var input = document.getElementById("taProgramInput");
            var hex = [];
            hex = input.value.split(" "); //put the op codes into an array
            var reg = new RegExp(/^[0-9a-fA-F0-9]{2}/);
            for (var i = 0; i < hex.length; i++) {
                if (reg.test(hex[i])) { //if they satisfy the regular expression above continue
                    if (i == (hex.length - 1)) {
                        break;
                    }
                    continue;
                }
                else { //if they are not validated by the regex then tell the user they are invalid
                    _StdOut.putText("Invalid Input: " + hex[i]);
                    document.getElementById("taProgramInput").style.border = "2px solid red"; //and change the ta border to red for fun
                    return;
                }
            }
            _StdOut.putText("Input Validated."); // if all the codes are valid, tell the user
            document.getElementById("taProgramInput").style.border = "2px solid green";
            _ProcessManager.createProcess(hex, args); //then load them into memory 
        };
        Shell.prototype.shellSpellCheck = function () {
            //checks the spelling of commands
            var com = _Console.buffer;
            var commands = this.commandList;
            var suggestions = "";
            for (var i = 0; i < commands.length; i++) {
                if (commands[i][0].contains(com.substring(0, 1))) {
                    suggestions += commands[i][0] + " ";
                }
                else {
                    continue;
                }
            }
            return suggestions;
        };
        Shell.prototype.shellRun = function (PID) {
            //runs the program with the specified pid
            var found = false;
            for (var i = 0; i < _ProcessManager.residentQueue.getSize(); i++) {
                var p = _ProcessManager.residentQueue.dequeue();
                if (p.pid == PID) {
                    found = true;
                    _ProcessManager.readyQueue.enqueue(p);
                }
                else {
                    _ProcessManager.residentQueue.enqueue(p);
                }
            }
            if (found) {
                _ProcessManager.run();
                TSOS.Control.updatePCBDisp();
            }
            else {
                _StdOut.putText("The PID entered does not exist.  Please enter a valid PID.");
            }
        };
        Shell.prototype.shellClearMem = function () {
            _MemoryManager.clearMem(0);
            _MemoryManager.clearMem(1);
            _MemoryManager.clearMem(2);
            TSOS.Control.hostMemory();
        };
        Shell.prototype.shellClearPartition = function (p) {
            _MemoryManager.clearMem(p);
        };
        Shell.prototype.shellRunAll = function () {
            _ProcessManager.runAll();
            RUNALL = true;
        };
        Shell.prototype.shellPs = function () {
            var pList = _ProcessManager.listPs();
            var output = "";
            for (var i = 0; i < pList.length; i++) {
                output += " " + pList[i] + ",";
            }
            _StdOut.putText(output);
        };
        Shell.prototype.shellKill = function (pid) {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(EXIT_PROCESS, RUNALL));
        };
        Shell.prototype.shellQuantum = function (q) {
            _CPUScheduler.quantum = q;
        };
        Shell.prototype.shellCreateFile = function (f) {
            if (f.length > 56) {
                _StdOut.putText("File name length too long! Must be " + 56 + " characters or less.");
                return;
            }
            //var reg = new RegExp(/^[a-z]+$/i);
            if (f.toString().match('/^[a-z]+$/i')) {
                _StdOut.putText("Filenames may only be characters.");
                return;
            }
            var status = _krnDiskDriver.createFile(f.toString());
            if (status == SUCCESS) {
                _StdOut.putText("File successfully created: " + f);
                return;
            }
            else if (status == FILE_NAME_ALREADY_EXISTS) {
                _StdOut.putText("File name already exists.");
                return;
            }
            else if (status == DISK_FULL) {
                _StdOut.putText("File creation failure: No more space on disk.");
                return;
            }
            if (f.length == 0) {
                _StdOut.putText("Usage: create <filename>  Please supply a filename");
                return;
            }
        };
        Shell.prototype.shellReadFile = function (f) {
            _Kernel.krnTrace("Shell: attempting to read file" + f);
            _Kernel.krnTrace("checking for $");
            for (var i = 0; i < f.length; i++) {
                if (f.toString().charAt(i) == "$") {
                    _StdOut.putText("Look, you aren't the OS... you cant be trying to talk to my processes...");
                    return;
                }
            }
            _Kernel.krnTrace("Shell: Finished checking for $");
            var status = _krnDiskDriver.diskRead(f)[1];
            if (status == FILE_NAME_DOESNT_EXIST) {
                _StdOut.putText("The file: " + f + " does not exist.");
                return;
            }
            else {
                _StdOut.putText(status);
                return;
            }
            // Print out file
        };
        Shell.prototype.shellWriteFile = function (args) {
            if (args.length >= 2) {
                // make sure user can't write to swap files
                if (args[0].includes("$")) {
                    _StdOut.putText("Oman u do not wanna do dat");
                    return;
                }
                // If user entered spaces, combine the args
                var string = "";
                for (var i = 1; i < args.length; i++) {
                    string += args[i] + " ";
                }
                // Check to make sure the user has quotes
                if (string.charAt(0) != "\"" || string.charAt(string.length - 2) != "\"") {
                    _StdOut.putText("Usage: write <filename> \"<text>\"  Please supply a filename and text surrounded by quotes.");
                    return;
                }
                string = string.trim();
                // Enforce what can be written to file. Only characters and spaces!
                if (!string.substring(1, string.length - 1).match(/^.[a-z ]*$/i)) {
                    _StdOut.putText("Files may only have characters and spaces written to them.");
                    return;
                }
                var status_3 = _krnDiskDriver.diskWrite(args[0], string);
                if (status_3 == SUCCESS) {
                    TSOS.Control.hostDisk();
                    _StdOut.putText("The file: " + args[0] + " has been successfully written to.");
                    return;
                }
                else if (status_3 == FILE_NAME_DOESNT_EXIST) {
                    _StdOut.putText("The file: " + args[0] + " does not exist.");
                    return;
                }
                else if (status_3 == DISK_FULL) {
                    _StdOut.putText("Unable to write to the file: " + args[0] + ". Not enough disk space to write!");
                    return;
                }
            }
            else {
                _StdOut.putText("Usage: write <filename> \"<text>\"  Please supply a filename and text surrounded by quotes.");
                return;
            }
        };
        Shell.prototype.shellDeleteFile = function (args) {
            if (args.length == 1) {
                // make sure user can't delete swap files
                if (args[0].includes("$")) {
                    _StdOut.putText("Oman u do not wanna do dat");
                    return;
                }
                var status = _krnDiskDriver.diskDelete(args[0]);
                if (status == SUCCESS) {
                    _StdOut.putText("The file: " + args[0] + " has been successfully deleted.");
                    TSOS.Control.hostDisk();
                    return;
                }
                else if (status == FILE_NAME_DOESNT_EXIST) {
                    _StdOut.putText("The file: " + args[0] + " does not exist.");
                    return;
                }
            }
            else {
                _StdOut.putText("Usage: delete <filename>  Please supply a filename.");
                return;
            }
        };
        Shell.prototype.shellFormat = function () {
            _krnDiskDriver.formatDisk();
            _StdOut.putText("Disk successfully formatted");
            return;
        };
        Shell.prototype.shellLs = function () {
            _krnDiskDriver.ls();
            return;
        };
        Shell.prototype.shellSetSchedule = function (sched) {
            _CPUScheduler.setSchedule(sched);
            return;
        };
        Shell.prototype.shellGetSchedule = function () {
            _CPUScheduler.getSchedule();
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
