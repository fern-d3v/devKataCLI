import { intro, outro, text, isCancel } from '@clack/prompts';
import { saveRoutine } from '../utils/storage.js';

// Wrap in an async function to use await
export default async function newCmd() {
  // Display an introductory message
  intro('Create a new devKata routine');

  const tasks = [];
  let anotherTask = true;

  // Loop to collect multiple tasks
  while (anotherTask) {
    const task = await text({
      message: 'Enter a task for your kata (or leave empty to finish):',
      placeholder: "e.g., Review yesterday's code for 10 minutes",
    });

    if (isCancel(task)) {
      outro('creation cancelled. no kata created');
      return;
    }

    // End the loop if the user just presses enter
    if (task) {
      tasks.push(task);
    } else {
      anotherTask = false;
    }
  }
  if (tasks.length > 0) {
    // Save the kata routine
    await saveRoutine(tasks);
    outro('kata created successfully!');
  } else {
    outro('no tasks were added. kata not created.');
  }
}