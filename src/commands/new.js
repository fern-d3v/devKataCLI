import { intro, outro, text, select, isCancel } from '@clack/prompts';
import { saveKata, buildKata, addRepository, addSandboxLanguage, getConfig } from '../utils/storage.js';
import { DEFAULT_KATAS } from '../utils/storage.js';
import pc from 'picocolors';

const dracula = {
    success: (text) => pc.green(text),
    error: (text) => pc.red(text),
    info: (text) => pc.yellow(text),
    special: (text) => pc.magenta(text),
    alt: (text) => pc.cyan(text),
    dim: (text) => pc.dim(text)
};

export default async function newCmd() {
  intro(dracula.special('Create a new devKata routine'));
  
  const kataType = await select({
    message: dracula.info('What type of kata would you like to create?'),
    options: [
        { value: 'miniKata', label: 'miniKata (10-15 minutes)' },
        { value: 'namiKata', label: 'namiKata (15-30 minutes)' },
        { value: 'devKata', label: 'devKata (30-45 minutes)' }
    ],
});

  if (isCancel(kataType)) {
      outro(dracula.error('Kata creation cancelled.'));
      return;
  }
  
  const useDefaults = await select({
    message: dracula.info('How would you like to configure this kata?'),
    options: [
        { value: true, label: dracula.special('Use default kata') },
        { value: false, label: dracula.alt('Create custom kata') }
    ],
  });
  
  if (isCancel(useDefaults)) {
    outro(dracula.error('Kata creation cancelled.'));
    return;
  }
  
  let tasks = [];
  
  if (useDefaults === true) {
      tasks = await buildKata(kataType);
  } else {
      let taskCount = 3;
      
      if (kataType === 'devKata') {
          tasks.push(
              { description: "Open coding sandbox for practice", completed: false },
              { description: "Complete a challenge on CodeWars", completed: false }
          );
          taskCount = 1;
      }
      
      for (let i = 0; i < taskCount; i++) {
          const taskPrompt = kataType === 'devKata' && i === 0 
              ? 'Enter a custom task to complete your devKata:' 
              : `Enter a task ${i + 1} of ${taskCount}:`;
          
          const task = await text({
              message: dracula.info(taskPrompt),
              placeholder: 'e.g., Review yesterday\'s code for 10 minutes',
          });
          
          if (isCancel(task)) {
              outro(dracula.error('initialization cancelled. no kata created.'));
              return;
          }
          
          if (task) {
              tasks.push({ description: task, completed: false });
          } else {
              outro(dracula.error('Empty task not allowed. Please provide a task description.'));
              return;
          }
      }
  }
  
  const linkRepos = await select({
  message: dracula.info('Would you like to like any git repositories for code review?'),
  options: [
    { value: true, label: dracula.special('Yes, link repositories') },
    { value: false, label: dracula.dim('Skip for now') }
  ],
});
if (isCancel(linkRepos)) {
  outro(dracula.error('Kata creation cancelled.'));
  return;
}
if (linkRepos) {
  let addingRepos = true;
  while (addingRepos) {
    const repoPath = await text({
      message: dracula.info('Enter the full path to a git repository:'),
      placeholder: '/Users/username/projects/my-project',
    });
    if (isCancel(repoPath)) {
      addingRepos = false;
      break;
    }
    if (repoPath) {
      const result = await addRepository(repoPath);
      if (result.success) {
        console.log(dracula.success(`√ ${result.message}`));
      } else {
        console.log(dracula.error(`× ${result.message}`));
      }
    }
    const addAnother = await select({
      message: dracula.info('Add another repository?'),
      options: [
        { value: true, label: dracula.special('Yes') },
        { value: false, label: dracula.dim('No, continue') }
      ],
    });
      if (isCancel(addAnother) || !addAnother) {
        addingRepos = false;
      }
    }
  };
// Ask if user wants to set up coding sandbox languages
const configureSandbox = await select({
  message: dracula.info('Would you like to configure coding sandbox languages?'),
  options: [
    {value: true, label: dracula.special('Yes, configure languages')},
    {value: false, label: dracula.dim('Skip for now')}
  ]
});
if (isCancel(configureSandbox)) {
  outro(dracula.error('Kata creation cancelled.'));
  return;
}
if (configureSandbox) {
  // Define available languages with their extensions
  const languageOptions = [
        { value: 'javascript', label: 'JavaScript (.js)', extension: 'js' },
        { value: 'typescript', label: 'TypeScript (.ts)', extension: 'ts' },
        { value: 'rust', label: 'Rust (.rs)', extension: 'rs' },
        { value: 'html', label: 'HTML (.html)', extension: 'html' },
        { value: 'css', label: 'CSS (.css)', extension: 'css' },
        { value: 'c', label: 'C (.c)', extension: 'c' },
        { value: 'python', label: 'Python (.py)', extension: 'py' },
        { value: 'go', label: 'Go (.go)', extension: 'go' }
];
  let addingLanguages = true;
  while (addingLanguages) {
    const selectedLanguage = await select({
      message: dracula.info('Select a language to add:'),
      options: languageOptions.map(lang => ({
        value: lang,
        label: lang.label
      }))
    });
    if (isCancel(selectedLanguage)) {
      addingLanguages = false;
      break;
    }
    const result = await addSandboxLanguage(selectedLanguage.value, selectedLanguage.extension);
    if (result.success) {
      console.log(dracula.success(`√ ${result.message}`));
    } else {
      console.log(dracula.error(`× ${result.message}`));
    }
    const addAnotherLang = await select({
      message: dracula.info('Add another language?'),
      options: [
        { value: true, label: 'Yes'},
        { value: false, label: 'No, continue' }
      ],
    });
    if (isCancel(addAnotherLang) || !addAnotherLang) {
      addingLanguages = false;
    }
  }
}
  await saveKata(kataType, tasks);
  outro(dracula.success(`${kataType} created successfully!`));
}
