import { getKata, saveKata } from "../utils/storage.js";
import { handlePostureCheck } from "../utils/handlers.js";
import { outro, spinner, isCancel, confirm, select } from "@clack/prompts";
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
// Loop through each task in the kata and exit if the user cancels
for (const task of kata) {
    const s2 = spinner();
    await new Promise(resolve => setTimeout(resolve, 1000));
    s2.start(dracula.info(task.description));
    // Stop the spinner before showing interactive content
    s2.stop();
    // Detect task type and call appropriate handler
    let taskResult;
    if (task.description.toLowerCase().includes('posture')) {
        taskResult = await handlePostureCheck(task);
    } else {
        // Keep existing simple logic for other tasks temporarily
        const confirmed = await confirm({
            message: dracula.info(`complete ${task.description}?`)
        });
        if (isCancel(confirmed)) {
            taskResult = { completed: false, cancelled: true, details: {} };
        } else {
            taskResult = { completed: confirmed, cancelled: false, details: {} };
        }
    }    
    // Handle the result
    if (taskResult.cancelled) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(dracula.error('kata cancelled'));
        outro(dracula.dim('see you next time <3'));
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
