import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { generateUUID } from './helpers.js';

const configDir = path.join(os.homedir(), '.config', 'devKata');
const logsDir = path.join(configDir, 'logs');

export async function createLogsDirectory() {
    try {
            // Ensure the directory exists
            await fs.mkdir(logsDir, { recursive: true });
            // Get existing logs or create new object if none exist
            return true; // Indicate success
    } catch (error) {
        console.error('Error creating logs directory:', error);
        return false; // Indicate failure to create
    }
};

export async function getDailyLog(date) {
    const filename = `kataLog_${date}.json`;
    const filePath = path.join(logsDir, filename);
    
    try {
        const jsonString = await fs.readFile(filePath, 'utf-8');
        const kataLog = JSON.parse(jsonString);
        return kataLog;  // Just return the whole thing
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Return default structure for a new day
            return {
                date: date,
                appVersion: "1.0.0",  // TODO: make dynamic
                katas: {},
                sessions: []
            };
        } else {
            console.error('Error reading daily log file:', error);
            return {
                date: date,
                appVersion: "1.0.0",  // TODO: make dynamic
                katas: {},
                sessions: []
            };
        }
    }
};

export async function saveDailyLog(date, logData) {
    // Create filename (same as getDailyLog)
    const filename = `kataLog_${date}.json`;
    // Create full path (same as getDailyLog)
    const filePath = path.join(logsDir, filename);
    // Convert logData to JSON string
    const jsonString = JSON.stringify(logData, null, 2);
    // Try to write the file, with error handling
    try {
        await fs.writeFile(filePath, jsonString, 'utf8');
        // Return success
        return true;
    } catch (error) {
        // Log the error
        console.error('Error saving daily log file:', error);
            return false;
    }
};

export async function appendSession(date, session) {
    // Get existing log data for the date
    const logData = await getDailyLog(date);
    // Append the new session
    logData.sessions.push(session);
    // Save the updated log data back to file
    const result = await saveDailyLog(date, logData);
    return result;  // Returns true/false to indicate success
};

export function createSessionObject(kataType) {
    return {
        // Use generateUUID() to create a unique ID
        sessionId: generateUUID(),
        // Set the kataType from the parameter
        kataType: kataType,
        // Set startTime to current time as ISO string
        startTime: new Date().toISOString(),
        // The null will be filled in when session ends
        endTime: null,
        totalDuration: null,
        status: null,
        tasks: [], // Set tasks to an empty array
        summary: {} // Set summary to an empty object
    };
};

export function createTaskLogEntry(task, result) {
    return {
        // Pull taskId, description, category from the task object
        taskId: task.taskId,
        description: task.description,
        category: task.category,
        // Pull status, timestamp, duration, details from the result object
        status: result.status || null,
        timestamp: result.timestamp || null,
        duration: result.duration || null,
        details: result.details || null,
        // For notes: use result.notes if it exists, otherwise use empty string
        notes: result.notes || ""
    };
};

