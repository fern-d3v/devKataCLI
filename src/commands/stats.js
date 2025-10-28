import { intro, outro, text, select, isCancel } from '@clack/prompts';
import pc from 'picocolors';

const dracula = {
    success: (text) => pc.green(text),
    error: (text) => pc.red(text),
    info: (text) => pc.yellow(text),
    special: (text) => pc.magenta(text),
    alt: (text) => pc.cyan(text),
    dim: (text) => pc.dim(text)
};

export default async function statsCmd() {
  intro(dracula.special('Check your devKata stats'));
  
  const kataType = await select({
    message: dracula.info('What type of kata would you like to see stats for?'),
    options: [
        { value: 'miniKata', label: 'miniKata (10-15 minutes)' },
        { value: 'namiKata', label: 'namiKata (15-30 minutes)' },
        { value: 'devKata', label: 'devKata (30-45 minutes)' }
    ],
});

const stats = {};

if (isCancel(kataType)) {
    outro(dracula.error('Kata stats retrieval cancelled.'));
    return;
}

outro(dracula.success(`${kataType} stats retrieved successfully!`));
}
