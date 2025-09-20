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

await saveKata(selectedKataType, kata); // Save the updated kata with completion status

outro('kata completed! see you tomorrow <3')
    
}