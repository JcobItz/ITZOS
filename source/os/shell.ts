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

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public history = [];
        public pointer = -1;
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            sc = new ShellCommand(this.shellVer,
                                 "version",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            sc = new ShellCommand(this.shellVer,
                                  "v",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            //date
            sc = new ShellCommand(this.shellDate,
                "date",
                "Displays current date and time.");
            this.commandList[this.commandList.length] = sc;

            //whereami
            sc = new ShellCommand(this.shellLoc,
                "whereami",
                "Displays current location");
            this.commandList[this.commandList.length] = sc;

            //java
            sc = new ShellCommand(this.shellJava,
                                "java",
                                "Dispenses a hot cup of java");
            this.commandList[this.commandList.length] = sc;

            //status
            sc = new ShellCommand(this.shellStatus, "status", "<string> - sets the status message in the taskbar");

            this.commandList[this.commandList.length] = sc;

            //trigger error
            sc = new ShellCommand(this.shellTrigger, "trigger", " - Triggers a BSOD");

            this.commandList[this.commandList.length] = sc;
            //load
            sc = new ShellCommand(this.shellLoad, "load", " - validates hex code in program input.");

            this.commandList[this.commandList.length] = sc;
            //run
            sc = new ShellCommand(this.shellRun, "run", " <PID> - runs program with the specified PID");

            this.commandList[this.commandList.length] = sc;
            //clearMem
            sc = new ShellCommand(this.shellClearMem, "clearmem", " - clears the entire memory array");

            this.commandList[this.commandList.length] = sc;
            //runAll
            sc = new ShellCommand(this.shellRunAll, "runall", " - runs all programs in the ready Queue");

            this.commandList[this.commandList.length] = sc;
            //clearpartition
            sc = new ShellCommand(this.shellClearPartition, "clearpartition", " <int> - clears the specified partition.");

            this.commandList[this.commandList.length] = sc;
            //kill
            sc = new ShellCommand(this.shellKill, "kill", " <int> - Kills the Process with the specified PID");

            this.commandList[this.commandList.length] = sc;
            //Ps
            sc = new ShellCommand(this.shellPs, "ps", " - lists the PIDs of all processes in the readyQueue.");

            this.commandList[this.commandList.length] = sc;
            //quantumn <int>
            sc = new ShellCommand(this.shellQuantum, "quantum", " <int> - Sets the quantum of the CPUScheduler to the specified integer.");

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
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.history[this.history.length] = buffer;
                this.pointer++;
                this.execute(fn, args);
               
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText(this.shellSpellCheck());
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
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
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        public shellDate() {
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


            
        }
        public shellLoc() {
            //prints the Latitude and longitude of the user, obtained from the browser, to StdOut
            var lat: number;
            var lon: number;
          
            navigator.geolocation.getCurrentPosition((position) => {
               lat =  position.coords.latitude;
                lon = position.coords.longitude;
                _StdOut.putText("Your current location is latitude: " + lat + " longitude: " + lon + ".");
                return;
            });
        
        }
        public shellJava() {
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
        }

        public shellStatus(message) {
            // changes status text in the toolbar at the top of the screen
            var status = document.getElementById("status");
            status.innerText = message;
        }
        public TaskTime() {
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
        }
        public shellTrigger() {
            //triggers an OS error
            _Kernel.krnTrapError("Routine test");
        }
        public shellLoad() {
            //validates user program input and loads it into main memory
            var input = <HTMLTextAreaElement> document.getElementById("taProgramInput");
            var hex = [];
            hex = input.value.split(" ");//put the op codes into an array
            
            var reg = new RegExp(/^[0-9a-fA-F0-9]{2}/);
            for (var i = 0; i < hex.length; i++) {
                if (reg.test(hex[i])) {//if they satisfy the regular expression above continue
                    if (i == (hex.length - 1)) {
                        break;
                    }
                    continue;
                } else { //if they are not validated by the regex then tell the user they are invalid
                    
                    _StdOut.putText("Invalid Input: " + hex[i]);
                    document.getElementById("taProgramInput").style.border = "2px solid red";//and change the ta border to red for fun

                    
                    return;
                }
            }
            _StdOut.putText("Input Validated.");// if all the codes are valid, tell the user
  
            document.getElementById("taProgramInput").style.border = "2px solid green";
            _ProcessManager.createProcess(hex);//then load them into memory 
           
            
        }
        public shellSpellCheck() {
            //checks the spelling of commands
            var com = _Console.buffer;
            var commands = this.commandList;
            var suggestions = "";
            for (var i = 0; i < commands.length; i++) {
                if (commands[i][0].contains(com.substring(0,1))) {
                    suggestions += commands[i][0] + " ";
                } else {
                    continue;

                }
            }
            return suggestions;
        }
        public shellRun(PID) {
            //runs the program with the specified pid
            var found: boolean = false;
            for (var i = 0; i < _ProcessManager.residentQueue.getSize(); i++) {
                var p:TSOS.PCB = _ProcessManager.residentQueue.dequeue();
                if (p.pid == PID) {
                    found = true;
                    _ProcessManager.readyQueue.enqueue(p);
                } else {
                    _ProcessManager.residentQueue.enqueue(p);
                }
               
                
            }
            if (found) {
                _ProcessManager.run();
                Control.updatePCBDisp();
            } else {
                _StdOut.putText("The PID entered does not exist.  Please enter a valid PID.");
            }
            
           
            
            
            
        }
        public shellClearMem() {
            _MemoryManager.clearMem(0);
            _MemoryManager.clearMem(1);
            _MemoryManager.clearMem(2);
            Control.hostMemory();

        }
        public shellClearPartition(p: number) {
            _MemoryManager.clearMem(p);
           
        }
        
        public shellRunAll() {
            _ProcessManager.runAll();
            RUNALL = true;
        }
        public shellPs() {
            var pList = _ProcessManager.listPs();
            var output = "";
            for (var i = 0; i < pList.length; i++) {
                output += " " + pList[i] + ",";
            }
            
            _StdOut.putText(output);
        }
        public shellKill(pid) {
            _KernelInterruptQueue.enqueue(new Interrupt(EXIT_PROCESS, RUNALL));
        }
        public shellQuantum(q: number) {
            _CPUScheduler.quantum = q;
        }
        public shellCreateFile(f: string) {
            alert(f);
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

        }
        public shellReadFile(f: string) {
            console.log("SHell attempting to read file: " + f);
            _Kernel.krnTrace("Shell: attempting to read file" + f);
            _Kernel.krnTrace("checking for $");
            for (var i = 0; i < f.length; i++) {
                if (f.toString().charAt(i) == "$") {
                    _StdOut.putText("Oman u do not wanna do dat");
                    return;
                }
            }
            console.log("finished checking for $");
            _Kernel.krnTrace("Shell: Finished checking for $");
            
            var status = _krnDiskDriver.diskRead(f);
            console.log("recieved status");
            if (status == FILE_NAME_DOESNT_EXIST) {
                _StdOut.putText("The file: " + f + " does not exist.");
                return;
            } else {
                _StdOut.putText(status.toString());
                return;
            }
            // Print out file
            
            

        }
        public shellWriteFile(args) {
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
                    Control.hostDisk();
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
        }
        public shellDeleteFile(args) {
            if (args.length == 1) {
                // make sure user can't delete swap files
                if (args[0].includes("$")) {
                    _StdOut.putText("Oman u do not wanna do dat");
                    return;
                }
                var status = _krnDiskDriver.diskDelete(args[0]);
                if (status == SUCCESS) {
                    _StdOut.putText("The file: " + args[0] + " has been successfully deleted.");
                    Control.hostDisk();
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
        }
        public shellFormat() {
            _Disk.init();
            Control.hostDisk();
        }
        public shellLs() {
            _krnDiskDriver.ls();
            return;
        }
        public shellSetSchedule(sched) {
            _CPUScheduler.setSchedule(sched);
            return;

        }
        public shellGetSchedule() {
            _CPUScheduler.getSchedule();
        }
        
           

    }
}
