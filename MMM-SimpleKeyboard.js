Module.register("MMM-SimpleKeyboard", {
    defaults: {},

    getScripts: function() {
        return [
            this.file("node_modules/simple-keyboard/build/index.js")
        ];
    },

    getStyles: function() {
        return [
            this.file("node_modules/simple-keyboard/build/css/index.css")
        ];
    },

    start: function() {
        this.keyboardVisible = false;
    },


getDom: function() {
    let wrapper = document.createElement("div");

    if (this.keyboardVisible) {
        let keyboardDiv = document.createElement("div");
        keyboardDiv.className = "simple-keyboard";
        wrapper.appendChild(keyboardDiv);

        setTimeout(() => {
            this.initializeKeyboard(keyboardDiv);
        }, 100);
    }

    return wrapper;
},


initializeKeyboard: function(keyboardDiv) {
    console.log("Initializing keyboard...");
    keyboardDiv.style.display = "block";

    let inputField = this.activeInputId ? document.getElementById(this.activeInputId) : document.getElementById('eventTitle');
    let existingValue = inputField ? inputField.value : "";

    // Destroy the existing keyboard instance if it exists
    if (this.keyboard) {
        this.keyboard.destroy();
    }

    // Initialize a new keyboard instance
    this.keyboard = new SimpleKeyboard.default({
        onChange: input => this.handleInput(input),
        onKeyPress: button => this.handleKeyPress(button)
    });

    // Set the initial value for the new keyboard instance
    this.keyboard.setInput(existingValue);
},

bindEventListeners: function() {
    let eventTitleInput = document.getElementById("eventTitle");
    let keyboardDiv = document.querySelector('.simple-keyboard');

    if (eventTitleInput) {
        // Event listener for when the input field is focused
        eventTitleInput.addEventListener("focus", () => {
            console.log("Event Title input field focused.");
            if (keyboardDiv) {
                keyboardDiv.style.display = 'block'; // Show the keyboard
            }

            this.keyboardVisible = true;
            this.updateDom();

            // Set the keyboard's input to the current value of the field
            let existingValue = eventTitleInput.value || "";
            this.keyboard.setInput(existingValue);
        });

        // Event listener for when the input field loses focus
        eventTitleInput.addEventListener("blur", () => {
            console.log("Event Title input field lost focus.");
            if (keyboardDiv) {
                keyboardDiv.style.display = 'none'; // Hide the keyboard
            }

            this.keyboardVisible = false;
            this.updateDom();
        });
    } else {
        console.log("Event Title input field not found.");
    }


    
        document.addEventListener("blur", (event) => {
        if (event.target.tagName.toLowerCase() === "input") {
            this.keyboardVisible = false;
            this.updateDom();  // Ensure to update the DOM when keyboard visibility changes.
        }
    }, true);


        document.addEventListener("mousedown", (event) => {
            let inputField = document.querySelector("input");

            if (!keyboardDiv.contains(event.target) && event.target !== inputField) {
                keyboardDiv.style.display = "none";
            }
        });

        keyboardDiv.addEventListener("mousedown", (event) => {
            event.preventDefault();
        });
    },
    
        notificationReceived: function(notification, payload, sender) {
        if (notification === "SHOW_KEYBOARD") {
            this.keyboardVisible = true;
            this.activeInputId = payload && payload.inputId ? payload.inputId : 'eventTitle';
            this.updateDom();
        }
        
if (notification === 'FORM_CLOSED') {
    console.log("Received notification that the form was closed.");
    
    let keyboardDiv = document.querySelector('.simple-keyboard');
    console.log("keyboardDiv element:", keyboardDiv);  // Checking the retrieved element
    
    if(keyboardDiv) {
        console.log("Hiding the keyboardDiv...");  // Verifying logic execution
        keyboardDiv.style.display = 'none'; 
        console.log("keyboardDiv display style after setting:", keyboardDiv.style.display);  // Checking the applied style
    } else {
        console.log("keyboardDiv not found.");
    }
}
    },

    handleInput: function(input) {
        let inputField = this.activeInputId ? document.getElementById(this.activeInputId) : document.getElementById('eventTitle');
        if(inputField) {
            inputField.value = input;
        }
    },

    handleKeyPress: function(button) {
        let inputField = this.activeInputId ? document.getElementById(this.activeInputId) : document.getElementById('eventTitle');

        if (inputField) {
            if (button === "{bksp}") {
                // Handle backspace key press
                let currentInput = inputField.value;
                inputField.value = currentInput.slice(0, -1); // Remove the last character from the input
            } else if (button === "{shift}" || button === "{lock}") {
                // Handle shift or lock key press
                let currentLayout = this.keyboard.options.layoutName;
                let shiftToggle = currentLayout === "default" ? "shift" : "default";
                this.keyboard.setOptions({
                    layoutName: shiftToggle
                });
                this.shiftPressed = button === "{shift}"; // Set or reset the flag based on whether shift was pressed
            } else {
                // Handle all other key presses
                if (this.shiftPressed) {
                    // Revert back to default layout if shift was previously pressed
                    this.keyboard.setOptions({
                        layoutName: "default"
                    });
                    this.shiftPressed = false;  // Reset the shift flag
                }
            }
        }
    }
    
    
});
