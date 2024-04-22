import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eventsPath = path.join(__dirname, "..", 'Data');  // Path where JSON files will be saved

console.log("This will find all of the uncompleted things");

let data = [];
fs.readdirSync(eventsPath).filter(file => path.extname(file) === '.json').forEach(file => {
    const filePath = path.join(eventsPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const event = JSON.parse(fileContent);
    data.push(event);
});

const regex = /%\{([^}]+)\}/g;

data.forEach(event => {
    const matches = event.summary.match(regex);
    if (matches !== null) {
        let hasMatch = false;
        const cleanMatches = matches.map(item => {
            // Correctly use the result of replace
            item = item.replace(/%{|}/g, '');
            const i = item.split('#');
            if (i.length === 1) {
                hasMatch = true;
                return i[0];
            }
            // Check if there is any event where the title matches the reference
            if (data.every(e => e.title !== i[1])) {
                hasMatch = true;
                return i[0]; // Return the key part
            }
            return null;
        });

        if (hasMatch) {
            console.log(event.title + " has errors in summary, the links for the following are not correct:");
            cleanMatches.forEach(item => {
                if (item !== null) {
                    console.log("\t - "+ item);
                }
            });
        }
    }
});


let uncompleted = data.filter(event => event.summary === "");
console.log("\n"+uncompleted.length + " uncompleted events found");

uncompleted.forEach(event => {
    console.log(event.title);
});


