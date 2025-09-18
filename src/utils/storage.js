// importing necessary modules
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

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
            return katas || {};
        }
    } catch (error) {
        // Specifically handle file not found error
        if (error.code === 'ENOENT') {
            return {}; // Return empty object if file doesn't exist
        } else {
          console.error('Error reading config file:', error);
          return {}; // Return empty object on other errors as well
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
            kata = await getKata() || {};
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

// Function to store the full devKata
export const DEFAULT_KATAS = {
  miniKata: [
    { description: "Posture check", completed: false }, // TODO: have tips displayed for good posture
    { description: "Set daily goals", completed: false }, // TODO: integrate with Notion, Todoist, or allow user to input goals
    { description: "Read tech article", completed: false }, // TODO: fetch from dev.to or other sources
    { description: "Random GitHub repo review", completed: false } // TODO: ask for tags, topics, catagoties to search and then find repos with 100 stars or more and then display the first 100 lines of code from one random file in the repository, also should give a link to the README.md
  ],
  // Includes ALL miniKata tasks first
  namiKata: [
    { description: "Hydrate", completed: false }, // TODO: have hydration fun facts displayed
    { description: "Check communications", completed: false }, // TODO: open email, slack, discord, etc, in a new window then close it after 5 minutes
    { description: "Review yesterday's code", completed: false }, // TODO: integrate with GitHub to fetch the user's PRs or commits from the previous day and display the first 100 lines of code from one random file in the PR or commit
    { description: "Practice your typing abilities", completed: false } // TODO: make sure this opens monkeystype
  ],
  // Includes ALL miniKata + namiKata tasks first
  devKata: [
    { description: "Stretches", completed: false }, // TODO: have stretch tips displayed
    { description: "Daily coding challenge", completed: false }, // TODO: integrate with LeetCode, HackerRank, CodeWars, etc
    { description: "Coding sandbox", completed: false } // TODO: open users IDE of choice in a new window to the devKataCLI directory devKata/Sandbox/sandbox.js
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
}