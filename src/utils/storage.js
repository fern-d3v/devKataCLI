// importing necessary modules
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Defining paths
const configDir = path.join(os.homedir(), '.config', 'devKata');
const configFilePath = path.join(configDir, 'routine.json');

// Function to read and write configuration file
export async function getRoutine() {
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
export async function saveRoutine(config) {
    try {
        // Ensure the directory exists
        await fs.mkdir(configDir, { recursive: true });

        const jsonString = JSON.stringify(config, null, 2);
        await fs.writeFile(configFilePath, jsonString, 'utf8');
    } catch (error) {
        console.error('Error saving config file:', error);
    }
};