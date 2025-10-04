import { getKata, saveKata } from "../utils/storage.js";
import { 
    handlePostureCheck, 
    handleSetDailyGoals,
    handleReadTechArticle,
    handleRandomRepoReview,
    handleReviewYesterdaysCode,
    handleTypingPractice,
    handleDailyCodingChallenge,
    handleCodingSandbox,
    handleHydrate,
    handleStretches,
    handleCheckCommunications
} from "../utils/handlers.js";
import { 
    createLogsDirectory,
    createSessionObject,
    createTaskLogEntry,
    appendSession 
} from "../utils/logger.js";
import { outro, spinner, isCancel, confirm, select, text } from "@clack/prompts";
import pc from 'picocolors';


  const dracula = {
       success: (text) => pc.green(text),    // Green
       error: (text) => pc.red(text),        // Red  
       info: (text) => pc.yellow(text),      // Orange/Yellow
       special: (text) => pc.magenta(text),   // Purple/Magenta
       alt: (text) => pc.cyan(text),       // Light Blue
       dim: (text) => pc.dim(text)             // Dimmed
};

export default async function startCmd() {
// Display ASCII art banner at the start
const orange = '\x1b[38;2;255;184;108m'; // Dracula orange
const purple = '\x1b[38;2;189;147;249m'; // Dracula purple
const reset = '\x1b[0m';

console.log('\n');
console.log(orange + '                                                 │█████████████' + reset);
console.log(orange + '                                                   │██    │██' + reset);
console.log(orange + '                                                   │██ │█ │██' + reset);
console.log(orange + '                                                │███████████████' + reset);
console.log(orange + '                                                   │██    │██' + reset);
console.log(orange + '                                                   │██    │██' + reset);
console.log(orange + '                                                   │██    │██' + reset);
console.log(orange + '                                                   │██    │██' + reset);
console.log('\n');
console.log(purple + '     █████                      █████   ████            █████                █████████  █████       █████' + reset);
console.log(purple + '    ░░███                      ░░███   ███░            ░░███                ███░░░░░███░░███       ░░███' + reset);
console.log(purple + '  ███████   ██████  █████ █████ ░███  ███     ██████   ███████    ██████   ███     ░░░  ░███        ░███' + reset);
console.log(purple + ' ███░░███  ███░░███░░███ ░░███  ░███████     ░░░░░███ ░░░███░    ░░░░░███ ░███          ░███        ░███' + reset);
console.log(purple + '░███ ░███ ░███████  ░███  ░███  ░███░░███     ███████   ░███      ███████ ░███          ░███        ░███' + reset);
console.log(purple + '░███ ░███ ░███░░░   ░░███ ███   ░███ ░░███   ███░░███   ░███ ███ ███░░███ ░░███     ███ ░███      █ ░███' + reset);
console.log(purple + '░░████████░░██████   ░░█████    █████ ░░████░░████████  ░░█████ ░░████████ ░░█████████  ███████████ █████' + reset);
console.log(purple + ' ░░░░░░░░  ░░░░░░     ░░░░░    ░░░░░   ░░░░  ░░░░░░░░    ░░░░░   ░░░░░░░░   ░░░░░░░░░  ░░░░░░░░░░░ ░░░░░' + reset);
console.log('\n');

// Have the user select which kata to run
const selectedKataType = await select({
    message: dracula.info('Select a kata to start:'),
    options: [
        { value: 'miniKata', label: 'miniKata' },
        { value: 'namiKata', label: 'namiKata' },
        { value: 'devKata', label: 'devKata' }
    ],
});
if (isCancel(selectedKataType)) {
    outro(dracula.error('kata cancelled'));
    return;
}
const kata = await getKata(selectedKataType);
    if (!kata || !Array.isArray(kata) || kata.length === 0) {
    outro(dracula.info(`No saved kata found for ${selectedKataType}. Please create one using the 'new' command.`));
    return;
}
const s = spinner();
await new Promise(resolve => setTimeout(resolve, 1000));
s.start(dracula.info('loading your kata...'));   
// Simulate some loading time
await new Promise(resolve => setTimeout(resolve, 1000));
s.stop(dracula.success('kata loaded!'));
// This ensures the logs folder exists before we try to write to it
await createLogsDirectory();
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const session = createSessionObject(selectedKataType);


// Loop through each task in the kata and exit if the user cancels
for (const task of kata) {
    const s2 = spinner();
    await new Promise(resolve => setTimeout(resolve, 1000));
    s2.start(dracula.info(task.description));
    // Stop the spinner before showing interactive content
    s2.stop();
    const taskStartTime = new Date();
    let taskResult; // Detect task type and call appropriate handler
    const description = task.description.toLowerCase();
    
    // Route to appropriate handler based on task description
    if (description.includes('posture')) {
        taskResult = await handlePostureCheck(task);
    } else if (description.includes('goal')) {
        taskResult = await handleSetDailyGoals(task);
    } else if (description.includes('article') || description.includes('read')) {
        taskResult = await handleReadTechArticle(task);
    } else if (description.includes('repo') || description.includes('github')) {
        taskResult = await handleRandomRepoReview(task);
    } else if (description.includes('review') || description.includes('yesterday')) {
        taskResult = await handleReviewYesterdaysCode(task);
    } else if (description.includes('typing')) {
        taskResult = await handleTypingPractice(task);
    } else if (description.includes('challenge') || description.includes('codewars') || description.includes('leetcode')) {
        taskResult = await handleDailyCodingChallenge(task);
    } else if (description.includes('sandbox')) {
        taskResult = await handleCodingSandbox(task);
    } else if (description.includes('hydrate') || description.includes('water')) {
        taskResult = await handleHydrate(task);
    } else if (description.includes('stretch')) {
        taskResult = await handleStretches(task);
    } else if (description.includes('communication') || description.includes('email') || description.includes('slack')) {
        taskResult = await handleCheckCommunications(task);
    } else {
        // Fallback for tasks without specific handlers
        const confirmed = await confirm({
            message: dracula.info(`complete ${task.description}?`)
        });
        if (isCancel(confirmed)) {
            taskResult = { completed: false, cancelled: true, details: {} };
        } else {
            taskResult = { completed: confirmed, cancelled: false, details: {} };
        }
    }   
    const taskEndTime = new Date();
    const duration = Math.floor((taskEndTime - taskStartTime) / 1000); // Duration in seconds
    // Create log entry for this task
    const logResult =  {
        status: taskResult.completed ? "mastered" : "deferred",
        timestamp: taskEndTime.toISOString(),
        duration: duration,
        details: taskResult.details || {},
        notes: ""
    };
    const taskLogEntry = createTaskLogEntry(task, logResult);
    session.tasks.push(taskLogEntry);
    // Handle the result
    if (taskResult.cancelled) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(dracula.error('kata cancelled'));
        outro(dracula.dim('see you next time <3'));
        // Mark the last task as abandoned (not just deferred)
        if (session.tasks.length > 0) {
            session.tasks[session.tasks.length - 1].status = "abandoned";
        }
        // Complete the session with abandoned status
        session.endTime = new Date().toISOString();
        session.totalDuration = Math.floor((new Date() - new Date(session.startTime)) / 1000);
        session.status = "abandoned";
        session.summary = {
            totalTasks: session.tasks.length,
            mastered: session.tasks.filter(t => t.status === "mastered").length,
            deferred: session.tasks.filter(t => t.status === "deferred").length,
            abandoned: session.tasks.filter(t => t.status === "abandoned").length
        };
        await appendSession(today, session); // Save the session log
        return;
    } else if (taskResult.completed) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(dracula.success(`${task.description} completed!`));
        task.completed = true;
        // Store rich session data if available
        if (taskResult.details) {
            task.lastSession = taskResult.details;
        }
    } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(dracula.info(`${task.description} skipped.`));
        task.completed = false;
    }
}
// Complete the session after all tasks
session.endTime = new Date().toISOString();
session.totalDuration = Math.floor((new Date() - new Date(session.startTime)) / 1000); // in seconds
// Calculate summary
session.summary = {
    totalTasks: session.tasks.length,
    mastered: session.tasks.filter(t => t.status === "mastered").length,
    deferred: session.tasks.filter(t => t.status === "deferred").length,
    abandoned: 0 // No abandoned tasks if we made it here
};
//Determine session status
if (session.summary.mastered === session.summary.totalTasks) {
    session.status = "mastered"; // All tasks completed
} else {
    session.status = "partial"; // Some tasks skipped
}
// Save the session to log
await appendSession(today, session);
const storedKata = await saveKata(selectedKataType, kata); // Save the updated kata with completion status
if (storedKata === true) {
    outro(dracula.special('kata saved! see you tomorrow <3'));
} else if (storedKata === false) {
    outro(dracula.error('Error saving kata. Please try again.'));
    // Ask the user what they want to do
    const userChoice = await select({
    message: dracula.info('what would you like to do?'),
    options: [
        { value: 'retry', label: dracula.info('retry saving the kata') },
        { value: 'printContinue', label: dracula.alt('print the kata results to the console, then continue') },
        { value: 'exit', label: dracula.error('exit without saving') }
    ]
});
    // Handle user choice
    if (userChoice === 'retry') {
        const retrySave = await saveKata(selectedKataType, kata);
        if (retrySave === false) {
            outro(dracula.error('Retry failed. Exiting without saving.'));
            return;
        } else if (retrySave === true) {
            outro(dracula.success('Kata saved successfully on retry!'));
        }
    } else if (userChoice === 'printContinue') {
            console.log(dracula.alt('Kata Results:', kata));
            outro(dracula.info('Kata results printed to console. Continuing...'));
        } else if (userChoice === 'exit') {
            outro(dracula.error('Exiting without saving. Your changes are not saved.'));
            return;
        }
    }
}