# Plan

# Building the Daily Dev Warmup CLI

## Project Goal

To create a personal, interactive CLI tool that lets you define and run through different kata routines to get you ready for coding. The CLI will support three kata types:
- **quickKata**: A short, focused warmup routine
- **kihoKata**: A medium-length kata with intermediate exercises
- **devKata**: A comprehensive warmup (full-kata) including coding challenges

### Core Technologies

- Runtime: Node.js
- Language: JavaScript (using modern ES Modules with `import`/`export`)   Libraries:
    - `@clack/prompts`: For creating beautiful, interactive prompts in the terminal.
    - `commander`: To create the main commands for your CLI (like `new` and `start`).
    - `picocolors`: For adding color to your terminal output.
    - `github api` : To pull random repositories from.

---

## Phase 1: The Interactive Katas (Your MVP)

### ~~Step 1: Setting Up Your Project Environment~~

Your first task is to create the project and install the tools you'll need.

- Initialize your project:
    - In your terminal, run `npm init -y`. This creates a `package.json` file, which is the manifest for your Node.js project.
- Enable ES Modules:
    - Open the new `package.json` file and add this line to the top level: `"type": "module",`.
        - This tells Node.js you'll be using the modern `import`/`export` syntax for your JavaScript files.
- Install libraries:
    - Run `npm install @clack/prompts commander picocolors`.
        - This downloads the libraries listed above and adds them to your project's dependencies.
- Create a `.gitignore` file:
    - Create a file named `.gitignore` in your main project directory.
    - Inside this file, add a single line: `node_modules/`.
        - This tells Git (a version control system) to ignore the folder where all your downloaded libraries are stored, which is a crucial best practice.

### ~~Step 2: Create Your File Structure~~

Organization is key. Create the following folders and empty files. This structure separates your code based on its purpose.


```
/dev_warmup

├── .gitignore

├── package.json

└── src/    

    ├── index.js    

    ├── commands/    

    │   ├── new.js    

    │   └── start.js    

    └── utils/        

        └── storage.js
```


### ~~Step 3: Build the Storage Utility (`src/utils/storage.js`)~~

**Goal**: Create reusable functions to save and load your kata routines to and from a file.

**What to learn and do**:

1. ~~Find the User's Home Directory:~~ 
    1. Research Node.js's built-in `os` module to find the function that gives you the current user's home directory.
2. ~~Work with File Paths:~~ 
    1. Research Node.js's built-in `path` module. You'll need it to combine the home directory path with your own folder and file name (e.g., `.config/dev-warmup/katas.json`).
3. Read and Write Files:
    1. Research Node.js's built-in `fs/promises` module. You need to learn how to read a file's contents and how to write text to a file. Since you'll be storing data in JSON format, you'll also need to learn about `JSON.parse()` (to turn JSON text into a JavaScript object) and `JSON.stringify()` (to turn a JavaScript object into JSON text).
4. Handle Missing Files/Directories: 
    1. Your script will fail if it tries to read a file that doesn't exist. 
        1. Learn how to check if a directory or file exists using `fs/promises`, and if it doesn't, create it.
5. Export Your Functions: 
    1. Create and `export` two `async` functions:
        1. `getKatas()`: This function should find, read, and parse the `katas.json` file. If the file doesn't exist, it should return an empty object `{}`.
        2. `saveKata(type, tasks)`: This function should accept a kata type (string) and an array of tasks, combine them into an object structure, and save it to your `katas.json` file, overwriting the previous kata of the same type.

### ~~Step 4: Implement the 'new' Command (`src/commands/new.js`)~~

**Goal**: Create an interactive prompt that lets a user create or overwrite their kata checklists.

**What to learn and do**:

1. Use Clack Prompts: 
    1. Look at the `@clack/prompts` documentation. You'll want to `import` functions like `intro`, `outro`, `text`, `select`, and `group`.
2. Select Kata Type:
    1. Use the `select` prompt to have the user choose between "quickKata", "kihoKata", or "devKata".
3. Get User Input for Tasks: 
    1. Ask the user to input exactly 3 tasks for the selected kata type.
    2. For devKata, automatically include the codingSandbox and codeWars tasks, and ask for one more custom task.
4. Store the Tasks:
    1. As the user submits each task, add it to a JavaScript array as objects with a task description and a completion status (`{ description: "Task text", completed: false }`).
5. Save the Kata: 
    1. Once the tasks are collected, `import` and call your `saveKata()` function from `storage.js`, passing it the kata type and the array of task objects.
6. Export Your Main Function:
    1. Wrap all this logic in a single function and `export` it.

### Step 5: Implement the 'start' Command (`src/commands/start.js`)

**Goal**: Guide the user through the tasks in their selected kata.

**What to learn and do**:

1. ~~Load the Katas:~~
    1. `import` and call your `getKatas()` function from `storage.js`.
2. ~~Select Kata Type:~~
    1. Use the `select` prompt to have the user choose which kata to run ("quickKata", "kihoKata", or "devKata").
3. ~~Handle No Kata:~~
    1. If the selected kata doesn't exist or has no tasks, print a message telling the user to run the `new` command first, and then exit.
4. Loop Through Tasks:
    1. Use a `for...of` loop to go through the array of tasks one by one.
5. Use Clack Spinners:
    1. Inside the loop, look at the `@clack/prompts` documentation for `spinner`. 
        1. Start a spinner that displays the current task description.
        2. The spinner will keep running while you wait for the user.
6. Wait for User Confirmation: 
    1. To mark a task as complete and proceed to the next task, wait for the user to press a key. 
        1. Use `clack.confirm({ message: 'Mark as complete?' })`.
7. Update Task Completion: 
    1. When a task is confirmed as complete, update its `completed` status to `true`.
8. Special Handling for devKata:
    1. If the task is a codingSandbox or codeWars task, add special handling to support these features.
9. Save Updated Kata:
    1. After all tasks are complete, save the updated kata with the completion statuses.
10. Export Your Main Function: 
    1. Wrap this logic in a single function and `export` it.
    

### Step 6: Wire Everything Together (`src/index.js`)

**Goal**: Define your CLI commands and link them to the functions you wrote.

**What to learn and do**:

1. Make the File Executable: 
    1. Add this exact line to the very top of the file: `#!/usr/bin/env node`. 
        1. This "shebang" tells the terminal to execute the file using Node.js.
2. Use Commander:
    1. `import` the `program` object from the `commander` library.
3. Import Your Commands:
    1. `import` the main functions you exported from `src/commands/new.js` and `src/commands/start.js`.
4. Define Commands:
    1. Look at the `commander` documentation. You will define your commands like this:
        1. `program.command('new').description('Create a new kata routine').action(yourImportedNewFunction);`
        2. `program.command('start').description('Start a kata routine').action(yourImportedStartFunction);`
5. Parse the Arguments:
    1. At the very end of the file, call `program.parse()`. 
        1. This tells `commander` to read the terminal arguments and run the correct action.

### Step 7: Test Your CLI Locally

**Goal**: Run your CLI on your own machine as if it were a real command.

1. Add a `bin` field:
    1. In your `package.json`, add a `bin` field that maps a command name to your entry point file. It should look like this:    
        1. `"bin": {"devkata": "src/index.js"}`  
2. Run `npm link`: 
    1. In your terminal, run the command `npm link`. 
        1. This takes your project and installs it globally on your machine, creating a symbolic link to your project folder. 
        2. You can now run `devkata new` and `devkata start` from anywhere in your terminal!

---

## **Phase 1.5: Polishing Your Application**

Once your CLI is working, it's time to make it robust and user-friendly. This is what separates a hobby project from a high-quality tool.

### **1. Add Robust Error Handling**

**Goal:** Prevent your application from crashing if something unexpected happens.

**What to learn and do:**

- **Learn `try...catch`:** Research how to use `try...catch` blocks in JavaScript. They allow you to "try" a piece of code that might fail, and "catch" the error if it does, so you can handle it gracefully.
- **Apply to `storage.js`:** Your `getKatas` and `saveKata` functions are the most likely to fail (e.g., the JSON file is corrupted, or you don't have permission to write the file). Wrap the core logic of these functions in `try...catch` blocks.
- **Give Feedback:** In the `catch` block, log a user-friendly error message (e.g., "Error: Could not read the katas file. It might be corrupted.") and exit the application cleanly.

### **2. Improve User Feedback with Colors**

**Goal:** Use color to make your CLI's output easier to read at a glance.

**What to learn and do:**

- **Use `picocolors`:** `import` functions from the `picocolors` library you installed (e.g., `import { green, red, yellow } from 'picocolors'`).
- **Apply Colors:**
    - Wrap success messages in `green()` (e.g., "Kata created successfully!").
    - Wrap error messages from your `catch` blocks in `red()`.
    - Wrap informational notes or warnings in `yellow()` (e.g., "No kata found. Run `devkata new` to create one.").

### **3. Write Good Code Comments**

**Goal:** Make your code easy to understand for your future self and for others.

**What to learn and do:**

- **Comment the *Why*, Not the *What*:** Don't write comments that state the obvious (e.g., `// this is a variable`). Instead, write comments to explain *why* you made a particular choice, especially if the logic is complex. For example: `// Using a while loop here to allow the user to enter multiple tasks at once.`

---

## **Phase 2: Ideas for Future Expansion**

Once your MVP is polished, challenge yourself with these advanced features.

### **Challenge 1: The Random GitHub Repository Task**

**Goal:** Implement the GitHub repository review task for the devKata.

**What to learn and do:**

1. **Making HTTP Requests:** Your app needs to talk to the GitHub server. Research how to use the built-in `fetch` API in Node.js to make web requests.
2. **Working with APIs:** Learn the basics of REST APIs. You'll be making a `GET` request to a specific URL and getting a JSON object back.
3. **Read API Documentation:** Search for the "GitHub REST API documentation" and find the "Search Repositories" endpoint. This will tell you what URL to use and what parameters you can add.
4. **Implement the Logic:**
    - When a devKata task is the GitHub review task, call a function to handle it.
    - This function will use `fetch` to call the GitHub Search API. Your query might look for popular JavaScript repos: `https://api.github.com/search/repositories?q=language:javascript+stars:>100`.
    - Parse the JSON response from the API. The repositories will be in an `items` array.
    - Pick a random repository from the `items` array and get its `html_url`.
    - Display the URL to the user. The `clack.note` function is great for this.

### **Challenge 2: The Local Coding Sandbox**

**Goal:** Implement the coding sandbox task for the devKata.

**What to learn and do:**

- **Learn `child_process`:** Research Node.js's built-in `child_process` module, specifically the `spawn` function. This lets you run other programs (like a code editor) from your script.
- **Read Environment Variables:** Learn how to read environment variables in Node.js (`process.env`). The `$EDITOR` variable often holds the user's preferred command-line editor.
- **Implement the Logic:** When the codingSandbox task is run in the devKata, check if `~/dev-warmup-sandbox/my-problem.js` exists. If not, create it. Then use `spawn` to open the file in `process.env.EDITOR`.

### **Challenge 3: More CLI Commands**

**Goal:** Add more features to make your CLI more powerful.

- **`list` command:** Create a new command that prints all saved katas to the console without running them interactively.
- **`clear` command:** Create a new command that deletes specified kata types (after asking the user for confirmation using `clack.confirm`).

---

## **Appendix: Kata Task Ideas**

Here are some task ideas for each kata type. Remember, each kata should have exactly 3 tasks.

### **1. quickKata (Short, Focused Warmup)**

- **Stretches:** A simple prompt: `"Do 2 minutes of hand and wrist stretches."`
- **Posture Check:** A simple prompt: `"Adjust your chair, monitor, and keyboard."`
- **Hydrate:** A simple prompt: `"Drink a glass of water."`

### **2. kihoKata (Medium Warmup)**

- **Review Yesterday's Code:** A prompt: `"Take 5 minutes to review the code you wrote yesterday."`
- **Set Daily Goals:** An interactive prompt: `"What are your top 3 priorities for today?"`
- **Check Communications:** A prompt: `"Clear urgent messages in Email/Slack."`

### **3. devKata (Full Warmup)**

- **CodeWars Challenge:** A task that opens a link to a coding challenge on CodeWars.
- **Coding Sandbox:** The feature that creates a local practice file and opens it in your editor.
- **Custom Task:** A user-defined task that completes the full kata routine.

## **Appendix B: Warmup Plans Resources**

Below are links to the sites that influenced this project

### **Links**

- [Dev Warmup Routine](https://dev.to/abubakersiddique771/i-replaced-my-morning-routine-with-a-dev-warmup-heres-what-changed-2edi)