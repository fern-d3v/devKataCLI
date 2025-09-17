import { intro, outro, text, select, isCancel } from '@clack/prompts';
import { saveKata } from '../utils/storage.js';
import { DEFAULT_KATAS } from '../utils/storage.js';

// Wrap in an async function to use await
export default async function newCmd() {
  // Display an introductory message
  intro('Create a new devKata routine');

  const tasks = [];
  let anotherTask = true;



let taskCount = 3; // Default 3 tasks per kata

    // For devKata, pre-populate with coding sandbox and codewars tasks
    if (kataType === 'devKata') {
      tasks.push(
        { description: "Open coding sandbox for practice", completed: false },
        { description: "Complete a challenge on CodeWars", completed: false }
    );
      taskCount = 1; // Only need one more custom task for devKata
    }

    // Collect the required number of tasks
    for (let i = 0; i < taskCount; i++) {
      const taskPrompt = kataType === 'devKata' && i === 0 ? 'Enter a custom task to complete your devKata:' : `Enter a task ${i + 1} of ${taskCount}:`;

      const task = await text({
        message: taskPrompt,
        placeholder: 'e.g., Review yesterday\'s code for 10 minutes',
      });

      if (isCancel(task)) {
        outro('initialization cancelled. no kata created.');
        return;
      }

      if (task) {
        tasks.push({ description: task, completed: false });
      } else {
        outro('Empty task not allowed. Please provide a task description.');
        return;
      }
    }

// Save the new kata routine
    await saveKata(kataType, tasks);
    outro(`${kataType} created successfully!`);


// Implement buildKata() to construct the full kata based on selected type

 
}