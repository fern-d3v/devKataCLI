// importing necessary modules
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { generateUUID, getDefaultMetadata, createTask } from './helpers.js';

// Defining paths
const configDir = path.join(os.homedir(), '.config', 'devKata');
const configFilePath = path.join(configDir, 'kata.json');
// Function to read and write configuration file
export async function getKata(type) {
    try {
        const jsonString = await fs.readFile(configFilePath, 'utf-8');
        const katas = JSON.parse(jsonString);
        if (katas && type) {
            return katas[type] || [];
        } else {
            return katas || [];
        }
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
            const jsonString = await fs.readFile(configFilePath, 'utf-8');
        kata = JSON.parse(jsonString) || {};
        } catch (error) {
             kata = {}; // Start with empty object if file doesn't exist
};
        // Update or add the specific kata type
        kata[type] = tasks;
        // Write back to the file
        const jsonString = JSON.stringify(kata, null, 2);
        await fs.writeFile(configFilePath, jsonString, 'utf8');
        return true; // Indicate success
    } catch (error) {
        console.error('Error saving config file:', error);
        return false; // Indicate failure to save
    }
};
// Function to store the full devKata
export const DEFAULT_KATAS = {
  miniKata: [
    createTask("Posture check", "miniKata"),
    createTask("Set daily goals", "miniKata"),
    createTask("Read tech article", "miniKata"),
    createTask("Random GitHub repo review", "miniKata")
  ],
  // Includes ALL miniKata tasks first
  namiKata: [
    createTask("Hydrate", "namiKata"),
    createTask("Check communications", "namiKata"),
    createTask("Review yesterday's code", "namiKata"),
    createTask("Practice your typing abilities", "namiKata")
  ],
  // Includes ALL miniKata + namiKata tasks first
  devKata: [
    createTask("Stretches", "devKata"),
    createTask("Daily coding challenge", "devKata"),
    createTask("Coding sandbox", "devKata")
  ],
};
// Function to build complete kata with progressive tasks
export async function buildKata(type) {
    let tasks = [];
    // Always start with miniKata
    tasks = [...DEFAULT_KATAS.miniKata];
    // Add namiKata tasks if selected
    if (type === 'namiKata' || type === 'devKata') {
        tasks = [...tasks, ...DEFAULT_KATAS.namiKata];
    }
    // Add devKata tasks if selected
    if (type === 'devKata') {
        tasks = [...tasks, ...DEFAULT_KATAS.devKata];
    }
    return tasks;
};