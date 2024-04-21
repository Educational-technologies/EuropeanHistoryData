import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eventsPath = path.join(__dirname, "..", 'Data');  // Path where JSON files will be saved

// Check for the '-def' argument
const includeDefinitions = process.argv.includes('-def');

if (!fs.existsSync(eventsPath)) {
    fs.mkdirSync(eventsPath, { recursive: true });
}

async function createJSONFiles() {
    try {
        const timeLineDataPath = path.resolve(__dirname, "..", "..", 'TimeLineData.js');
        const timeLineDataURL = pathToFileURL(timeLineDataPath);

        if (fs.existsSync(timeLineDataPath)) {
            const { TimeLineData, Definitions } = await import(timeLineDataURL.href);

            if (!TimeLineData) {
                throw new Error("TimeLineData is not defined in the imported module.");
            }

            // Process events or definitions based on the '-def' flag
            if (includeDefinitions) {
                // You can do like "Nationalism&Nationalist:"def" and then parse that as two things?
                // Additional logic for definitions
                console.log("Currently definitions are not supported, as some have the same values, i will figure it out soon!");
            } else {
                // Handle regular data processing
                TimeLineData.forEach(event => {
                    const filename = `${event.title.replace(/ /g, '_')}.json`;
                    const filepath = path.join(eventsPath, filename);
                    fs.writeFileSync(filepath, JSON.stringify(event, null, 2), 'utf8');
                    console.log(`File written: ${filepath}`);
                });

                console.log("JSON files created successfully.");
                console.log('Would you like to clear TimeLineData.js? (y/n) SAVE it somewhere before clearing it to be sure, but you should clear it!');
                process.stdin.on('data', (input) => {
                    if (input.toString().trim() === 'y') {
                        let fileString = "export const TimeLineData = [];\nexport const Definitions = {\n";
                        Object.keys(Definitions).forEach(key => {
                            // Use JSON.stringify to escape special characters in key and value
                            const escapedKey = JSON.stringify(key);
                            const escapedValue = JSON.stringify(Definitions[key]);

                            // Remove quotes around the key for JavaScript object literal syntax, if desired
                            fileString += `    ${escapedKey}: ${escapedValue},\n`;
                        });
                        fileString += "};\n";

                        fs.writeFileSync(timeLineDataPath, fileString, 'utf8');
                        console.log('TimeLineData.js has been cleared.');
                    }
                    process.exit();
                });
            }
        } else {
            throw new Error("TimeLineData.js does not exist in the specified path.");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

createJSONFiles();
