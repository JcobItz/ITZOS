///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {
        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public prevend = 0, public history = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
            
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.

                    this.buffer = "";
                } else if (chr == String.fromCharCode(8)) {//    Backspace
                    //handles backspaces and passes pertinent information to the backSpace method
                    var curbuff = this.buffer;
                    var buflen = this.buffer.length - 1;
                    var last = curbuff.charAt(buflen);
                    var off = (CanvasTextFunctions.symbols[last].width * _DefaultFontSize) / 25.0;

                    curbuff = curbuff.slice(0, -1);
                    this.buffer = curbuff;

                    this.backSpace(off);
                } else if (chr == String.fromCharCode(9)) {//tab key
                    //captures tab key presses and triggers suggestions method
                    this.suggestions(this.buffer);


                } else if (chr == String.fromCharCode(38)) {//up arrow
                    //recalls command history
                    var com = this.lastCommand();
                    _DrawingContext.clearRect(10, this.currentYPosition - _DefaultFontSize, _Canvas.width, _Canvas.height);
                    this.currentXPosition = 10;
                    this.putText(com);



                } else if (chr == String.fromCharCode(40)) { // down arrow
                    //cycles forward through command history
                    var com = this.nextCommand();
                    if (com != "") {
                        _DrawingContext.clearRect(10, this.currentYPosition - _DefaultFontSize, _Canvas.width, _Canvas.height);
                        this.currentXPosition = 10;
                        this.putText(com);
                    }





                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
           
        }
        public suggestions(buff) {// offers suggestions for the given entry in the console
            var found = false;
            var opts = _OsShell.commandList;

           
           
            for (var i = 0; i < opts.length; i++) {
               
                if (_OsShell.commandList[i].command.substring(0, buff.length) == buff) {
                    this.buffer += _OsShell.commandList[i].command.substring(buff.length, _OsShell.commandList[i].command.length);
                    this.putText(_OsShell.commandList[i].command.substring(buff.length, _OsShell.commandList[i].command.length));
                    break;
                }
              
                continue;
                
            }
        }
        public backSpace(off): void { //deletes a character and moves currentXPosition
            if (this.currentXPosition <= 0) {
                this.currentYPosition -= (_DefaultFontSize + _FontHeightMargin + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize));
                var x = 0;
                
                this.currentXPosition = this.prevend;
                
            }
            _DrawingContext.clearRect(this.currentXPosition - off, this.currentYPosition - _DefaultFontSize, _Canvas.width, _Canvas.height);
            this.currentXPosition = this.currentXPosition - off;
        }
        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                this.history += text;
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
              
            }
            
        }
        public lastCommand() {//recalls previous command
            
            _OsShell.pointer--;
            this.buffer = _OsShell.history[_OsShell.pointer +1]
            return _OsShell.history[_OsShell.pointer +1];


        }
        public nextCommand() {//go forward through command history
            _OsShell.pointer++;
            this.buffer = _OsShell.history[_OsShell.pointer];
            return _OsShell.history[_OsShell.pointer];
        }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            // TODO: Handle scrolling. (iProject 1)
        }
        public BSOD(msg) { //Displays blue screen of death and the error that caused it.
            this.clearScreen();
            var screen = document.getElementById("display");
            screen.style.backgroundColor = "#4286f4";
            this.putText("I'm Sorry, Looks like theres a Kernel Error.");
            this.advanceLine();
            this.putText("The Kernel trapped the following message:  " + msg);

        }
    }
 }
