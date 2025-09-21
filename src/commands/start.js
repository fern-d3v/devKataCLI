import { getKata, saveKata } from "../utils/storage.js";
import { outro, spinner, isCancel, confirm, select } from "@clack/prompts";

export default async function startCmd() {
// Have the user select which kata to run
const selectedKataType = await select({
    message: 'Select a kata to start:',
    options: [
        { value: 'miniKata', label: 'miniKata' },
        { value: 'namiKata', label: 'namiKata' },
        { value: 'devKata', label: 'devKata' }
    ],
});

if (isCancel(selectedKataType)) {
    outro('kata cancelled');
    return;
}

const kata = await getKata(selectedKataType);

    if (!kata || kata.length === 0) {
    outro(`No saved kata found for ${selectedKataType}. Please create one using the 'new' command.`);
    return;
}

    const s = spinner();
    await new Promise(resolve => setTimeout(resolve, 1000));
    s.start('Loading your kata...');   
    // Simulate some loading time
    await new Promise(resolve => setTimeout(resolve, 1000));
    s.stop('kata loaded!');

    // Loop through each task in the kata and exit if the user cancels
    for (const task of kata) {
    const s2 = spinner();
    await new Promise(resolve => setTimeout(resolve, 1000));
    s2.start(task.description);

    const confirmed = await confirm({
    message: `complete ${task.description}?`
    });

    if (isCancel(confirmed)) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // spinner timing to make it seem like it is processing
    s2.stop('kedai cancelled');
    outro('the kedai was cancelled');
    return;
    } else {
        if (confirmed) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            s2.stop('kedai completed!');
            task.completed = true;
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
            s2.stop('kedai skipped');
            task.completed = false;
        }
    }
};
}
const storedKata = await saveKata(selectedKataType, kata); // Save the updated kata with completion status
if (storedKata === true) {
    outro('kata saved! see you tomorrow <3');
} else if (storedKata === false) {
    outro('Error saving kata. Please try again.');
    // Ask the user what they want to do 
    const userChoice = await select({
        message: 'what would you like to do?',
        options: [
            { value: 'retry', label: 'retry saving the kata' },
            { value: 'printContinue', label: 'print the kata results to the console, then continue' },
            { value: 'exit', label: 'exit without saving' }
        ]
    });
    // Handle user choice
    if (userChoice === 'retry') {
        const retrySave = await saveKata(selectedKataType, kata);
        if (retrySave === false) {
            outro('Retry failed. Exiting without saving.');
            return;
        } else if (retrySave === true) {
            outro('Kata saved successfully on retry!');
        }
    } else if (userChoice === 'printContinue') {
            console.log('Kata Results:', kata);
            outro('Kata results printed to console. Continuing...');
        } else if (userChoice === 'exit') {
            outro('Exiting without saving. Your changes are not saved.');
            return;
        }
    }
