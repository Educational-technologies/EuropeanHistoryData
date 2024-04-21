import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import * as readline from "readline";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eventsPath = path.join(__dirname, "..", 'Data');  // Path where JSON files will be saved
const definitionsPath = path.join(__dirname, "..", 'Definitions');  // Path where JSON files will be saved

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

// Make stdin emit 'keypress' events and handle them
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}
class Tree {
    constructor() {
        this.root = new Node(""); // Root should be empty initially
    }

    insert(title) {
        let current = this.root;
        for (let i = 0; i < title.length; i++) {
            let char = title[i].toLowerCase(); // Convert to lowercase to maintain consistency
            let index = this.charToIndex(char); // Get the index of the character (or space
            if(index == null){
               // console.log("Invalid character found in title: " + char); dev work
                continue
            }

            if (current.children[index] === null) {
                current.children[index] = new Node();
            }
            current = current.children[index];
        }
        current.isWord = true; // Mark the end of a word
    }

    charToIndex(char) {
        if (char === ' ') return 26;
        const index = char.charCodeAt(0) - 'a'.charCodeAt(0);
        if (index < 0 || index > 25) return null; // Safeguard against invalid indices
        return index;
    }

    search(title) {
        let current = this.root;
        for (let i = 0; i < title.length; i++) {
            let char = title[i].toLowerCase();
            let index = this.charToIndex(char);
            if (index === null) {
                console.log("Invalid character found in title: " + char);
                continue; // Skip invalid characters
            }

            if (current.children[index] === null) {
                return "none found";
            }
            current = current.children[index];
        }
        return this.findFirstWord(current, title); // Return the result of findFirstWord
    }

    findFirstWord(node, accumulatedPrefix) {
        if (!node) {
            return "none found";  // Return "none found" if node is undefined
        }

        if (node.isWord) {
            return accumulatedPrefix;  // Found a complete word
        }

        for (let i = 0; i < node.children.length; i++) {
            if (node.children[i] !== null) {
                let additionalChar = i === 26 ? ' ' : String.fromCharCode(i + 'a'.charCodeAt(0));
                let result = this.findFirstWord(node.children[i], accumulatedPrefix + additionalChar);
                if (result !== "none found") return result;
            }
        }

        return "none found";  // If no word is found
    }

}

class Node {
    constructor() {
        this.children = Array(27).fill(null); // 26 letters + 1 for space
        this.isWord = false;
    }
}

let Events;
let Definitions;

function buildNodes(){
    Events = new Tree(); // Create the root node
    Definitions = new Tree(); // Create the root node
    fs.readdirSync(eventsPath).filter(file => path.extname(file) === '.json').forEach(file => {
        const filePath = path.join(eventsPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const event = JSON.parse(fileContent);
        Events.insert(event.title);
    });
    fs.readdirSync(definitionsPath).filter(file => path.extname(file) === '.json').forEach(file => {
        const filePath = path.join(definitionsPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const definition = JSON.parse(fileContent);
        Object.keys(definition).forEach(key => {
            Definitions.insert(key);
        })
    });
}

buildNodes()
let currentInput = "";
console.log("Enter a search term (or type 'exit' to quit) STILL BEING WORKED ON BTW, so numbers don't work so if you type revolutions instead of \'revolutions of 1848\' it would just be \'revolutions of\': ");
process.stdin.on('keypress', (char, key) => {
    if (key.sequence === '\u001b') { // ESC to exit
        process.exit();
    } else if (key.name === 'return') { // ENTER key
        console.clear();
        currentInput = ""; // Reset current input
        return;
    } else if (key.name === 'backspace') {
        currentInput = currentInput.slice(0, -1); // Remove last character
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        if(currentInput === ""){
            return;
        }
    } else if (/^[a-z ]$/i.test(char)) { // Check if the character is a letter or space
        currentInput += char; // Add character to current input
    }

    if(currentInput === "exit"){
        process.exit();
    }

    const linesUp = 1; // Number of lines to move the cursor up
    const lengthOfInput = rl.line.length; // Get the length of the current input

    const output = "Searching for " + currentInput + "...\nDefinition: " + Definitions.search(currentInput) + "\nEvent: " + Events.search(currentInput);
    console.clear();
    readline.moveCursor(process.stdout, -lengthOfInput, -linesUp);
    readline.clearLine(process.stdout, 1);
    console.log(output); // Print your message
    // Move cursor back down and show the user's input again
    process.stdout.write(currentInput);
});