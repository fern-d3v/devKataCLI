// importing necessary modules
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Defining paths
const configDir = path.join(os.homedir(), '.config', 'devKata');
const configFilePath = path.join(configDir, 'kata.json');

// Function to read and write configuration file
export async function getKata() {
    try {
        const jsonString = await fs.readFile(configFilePath, 'utf-8');
        return JSON.parse(jsonString);
    } catch (error) {
        // Specifically handle file not found error
        if (error.code === 'ENOENT') {
            return []; // Return empty array if file doesn't exist
        } else {
          console.error('Error reading config file:', error);
          return []; // Return empty array on other errors as well
        }
    }
};

// Function to save JS object to the configuration file
export async function saveKata(type, tasks) {
    try {
        // Ensure the directory exists
        await fs.mkdir(configDir, { recursive: true });

        // Get existing katas or create new object if none exist
        let kata = {};
        try {
            kata = await getKata();
        } catch (error) {
            // If error reading, start with empty object
            kata = {};
        }

        // Update or add the specific kata type
        kata[type] = tasks;

        const jsonString = JSON.stringify(kata, null, 2);
        await fs.writeFile(configFilePath, jsonString, 'utf8');
    } catch (error) {
        console.error('Error saving config file:', error);
    }
};