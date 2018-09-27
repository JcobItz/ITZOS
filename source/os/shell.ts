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
            sc = new ShellCommand(this.shellRun, "run", " - runs program in memory location $0000");

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
            var input = <HTMLTextAreaElement>document.getElementById("taProgramInput");
            var hex = [];
            hex = input.value.split(" ");
            
            var reg = new RegExp(/^[0-9a-fA-F]{2}$/);
            for (var i = 0; i < hex.length; i++) {
                if (reg.test(hex[i])) {
                    if (i == (hex.length - 1)) {
                        break;
                    }
                    continue;
                } else {
                    
                    _StdOut.putText("Invalid Input.");
                    document.getElementById("taProgramInput").style.border = "2px solid red"
                    return;
                }
            }
            _StdOut.putText("Input Validated.");
            _StdOut.advanceLine();
            document.getElementById("taProgramInput").style.border = "2px solid green"
            _CPU.Assemble(input.value);
            return;
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
        public shellRun() {
            
        }
           

    }
}
