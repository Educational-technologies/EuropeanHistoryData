import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const eventsPath = path.join(__dirname, "..", "Data");
const definitionsPath = path.join(__dirname, "..", "Definitions");
const buildDirectory = path.join(__dirname, "..", "..", "Build");

function ensureDirectoryExistence(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });  // Create the directory and any necessary subdirectories
    }
}

function build() {
    let definitions = {};
    let data = [];

    // Process the event JSON files
    fs.readdirSync(eventsPath).filter(file => path.extname(file) === '.json').forEach(file => {
        const filePath = path.join(eventsPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const event = JSON.parse(fileContent);
        data.push(event);
    });

    // Sort data by dateValue
    data.sort((a, b) => {
        if (a.dateValue < b.dateValue) {
            return -1;
        } else if (a.dateValue > b.dateValue) {
            return 1;
        }
        return 0;
    });

    // Process the definition JSON files
    fs.readdirSync(definitionsPath).filter(file => path.extname(file) === '.json').forEach(file => {
        const filePath = path.join(definitionsPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const definition = JSON.parse(fileContent);
        definitions = { ...definitions, ...definition };
    });
    ensureDirectoryExistence(buildDirectory);
    // Write the aggregated data to JS files
    fs.writeFileSync(path.join(buildDirectory,"Data.js"), `export default ${JSON.stringify(data, null, 2)};`);
    fs.writeFileSync(path.join(buildDirectory,"Definitions.js"), `export default ${JSON.stringify(definitions, null, 2)};`);
}

build();
