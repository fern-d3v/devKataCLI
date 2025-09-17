import { getKata } from "../utils/storage.js";
import { outro, spinner, isCancel } from "@clack/prompts";
import { select } from '@clack/prompts';

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
    s.start('Loading your kata...');   
    // Simulate some loading time
    await new Promise(resolve => setTimeout(resolve, 1000));
    s.stop('kata loaded!');

    // TODO: Add task loop implementation here

}

