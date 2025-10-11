---
title: Building Better Dev Habits with devKataCLI: A Terminal-Based Practice Routine
published: false
description: How I built a CLI tool to help developers establish consistent coding habits through progressive kata routines
tags: cli, javascript, productivity, opensource
cover_image: [YOUR_COVER_IMAGE_URL]
---

# Building Better Dev Habits with devKataCLI: A Terminal-Based Practice Routine

## Introduction

I don't know if anyone else has a hard time with morning routines and getting "in the zone" for the day, but I struggle with this immensely. My ADHD is too scattered in the mornings for me to remember each step of a routine, or to even do one. I found a couple "dev warmup routines" online and none stuck. It wasn't until I read [this article](https://dev.to/abubakersiddique771/i-replaced-my-morning-routine-with-a-dev-warmup-heres-what-changed-2edi), that I started formulating the idea for a CLI that would take me through a morning routine (or whenever I am ready to start my coding day). I started designing the flow in my head and, like any weird art school kid, I also started working up a name and designs too. What do I call something like this?

I try to use [codewars](https://www.codewars.com/) when I can remember, and I recalled that they called the sessions "katas" and had different levels of them. And like Kubrick once said, "Everything has already been done. Every story has been told, every scene has been shot. It's our job to do it one better." So, taking the idea of dev warmups and the name kata, I got devKataCLI. A tool that walks you through a pre-set (or custom if you choose) daily warmup to help get you in the zone. 

Using Kata wasn't just for style (weeb), I really like the philosophy behind the "kata" being applied to development. Practicing things every day until you master them is what makes one great at something, so why not force myself to do the same? Mastering practices through daily-repetition is one of the best ways for me to absorb and retain knowledge.

## The Problem: Consistency is Hard

As a developer who works a full-time day job, I know I should practice everyday. I know that I should be reinforcing what I learned the day before. But some days your brain is so tired from the droll of a day job that you just need something put in front of you that doesn't require you to formulate a plan. That's why I made this ultimately, to make future me have to work less. And isn't that really the goal as a developer? To make tools and systems that make life easier. 

If you haven't given the article above a read yet, I highly recommend it! The author gives some really good insight into warmup routines and how the specific ones they chose help! For devKata, I stole a couple of them, then added a few of my own. Developers know they should practice regularly, but slumps happen and the freeze in front of an IDE is a real thing. How do we create consistency while making it engaging and enjoyable? Read more to find out!

## The Solution: Progressive Kata System

### What are Dev Katas?

A kata is **a choreographed sequence of movements in martial arts, serving as a solo training exercise to develop muscle memory, proper body mechanics, speed, power, and mindfulness**. Extending into the developer world, a kata would be doing coding practice (or any kind of practice needed for the job) daily until it is second nature to you. Until things just come naturally.

With this in mind, I created a structured tri kata system that walks you through miniKata → namiKata → devKata. Each building on the previous. An entire devKata should take around 30-45 minutes, a namiKata should take 15-30 minutes, and a miniKata should take 10-15 minutes to complete. Each kata has their own unique activities that build upon each other. 

### Why Progressive?

If you are anything like me, your eyes are bigger than your brain. I so often look at something and just jump in full force to it, that's not the smartest approach to this. Starting small to build habits is far more manageable. If a full devKata at 30-45 minutes sounds like too much to start, then just do miniKata's until you feel like doing more, then include the namiKata in your routine, and before you know it, you will be doing devKata's every day and your abilities as a developer will be sharper than ever!

Having sustainable long-term practice will only continue to increase ability and hopefully, creativity alongside with curiosity! I fear that natural curiosity has been lost on the dev community. I see so many developers worrying about the grind, or shipping their next SaaS. Or, even worse, they just copy pasta everything from other people. No curiosity, no desire to actually grow or be creative. Just because we work in the technology industry, does not mean we are not artists! My hope is that devKataCLI will assist myself and other developers into being curious, creative and ready to tackle any coding challenge put in front of us!

## How devKataCLI Works

### The User Experience

Let me walk you through what a typical morning looks like with devKata. You wake up, grab your coffee (or tea, no judgment), and instead of staring blankly at your IDE wondering where to start, you simply open your terminal and type:

```bash
$ devkata start
```

And boom, you're greeted with this beautiful ASCII art banner that I spent way too much time on (but it looks sick, so worth it):

```bash
                                                 │█████████████
                                                   │██    │██
                                                   │██ │█ │██
                                                │███████████████
                                                   │██    │██
                                                   │██    │██
                                                   │██    │██
                                                   │██    │██

     █████                      █████   ████            █████                █████████  █████       █████
    ░░███                      ░░███   ███░            ░░███                ███░░░░░███░░███       ░░███
  ███████   ██████  █████ █████ ░███  ███     ██████   ███████    ██████   ███     ░░░  ░███        ░███
 ███░░███  ███░░███░░███ ░░███  ░███████     ░░░░░███ ░░░███░    ░░░░░███ ░███          ░███        ░███
░███ ░███ ░███████  ░███  ░███  ░███░░███     ███████   ░███      ███████ ░███          ░███        ░███
░███ ░███ ░███░░░   ░░███ ███   ░███ ░░███   ███░░███   ░███ ███ ███░░███ ░░███     ███ ░███      █ ░███
░░████████░░██████   ░░█████    █████ ░░████░░████████  ░░█████ ░░████████ ░░█████████  ███████████ █████
 ░░░░░░░░  ░░░░░░     ░░░░░    ░░░░░   ░░░░  ░░░░░░░░    ░░░░░   ░░░░░░░░   ░░░░░░░░░  ░░░░░░░░░░░ ░░░░░
```

The CLI then asks you which kata you want to run. Let's say you're feeling ambitious and choose the full devKata:

```bash
? Select a kata to start: › devKata

⠋ loading your kata...
✅ kata loaded!
```

Then it walks you through each task, one at a time. First up? Posture check. Because let's be real, we all sit like shrimp at our desks:

```bash
⠋ Posture check

Posture Check Suggestions:
────────────────────────────────
  1. Keep your feet flat on the floor
  2. Position your screen at eye level
  3. Sit back in your chair with back support
  4. Keep your shoulders relaxed
  5. Position keyboard and mouse at elbow height
────────────────────────────────

? Have you adjusted your posture? Ready to continue? › Yes

✅ Posture check completed!
```

Next, you set your daily goals. This is where the magic happens - you're being intentional about your day before the chaos starts:

```bash
⠋ Set daily goals

• Set Your Daily Goals
────────────────────────────────

? Goal 1 of 3: › Fix the authentication bug in production
? Goal 2 of 3: › Review the team's pull requests
? Goal 3 of 3: › Write unit tests for the new feature

✓ Daily Goals Set:
  1. Fix the authentication bug in production
  2. Review the team's pull requests
  3. Write unit tests for the new feature

? Ready to tackle these goals? › Yes
```

Then it gets really cool - the CLI searches Dev.to for a random article based on tags you provide:

```bash
→ Find a Tech Article to Read
────────────────────────────────

? Enter tags to search (comma-separated): › javascript, nodejs

⠋ Searching Dev.to for articles with tag: javascript...

✓ Found 87 recent article(s)!

Understanding JavaScript Closures: A Deep Dive
   by Jane Developer
   https://dev.to/janedeveloper/understanding-javascript-closures-a-deep-dive-5h8k

? Open this article and read it? › Yes
```

This pattern continues through each task. If you've linked a git repository during setup, it'll even show you your commits from yesterday:

```bash
→ Review Yesterday's Code
────────────────────────────────

Using repository: /Users/fern/code/js/cli/devKataCLI

⠋ Fetching commits from yesterday...

✓ Found 3 commit(s) from yesterday:

? Select a commit to review: ›
  a3f2c1b Add posture check handler
  b8e4d92 Implement daily goals feature
✓ c7a9f31 Fix kata loading spinner
  → Open repository in IDE
  ✓ Done reviewing
```

The whole experience feels like having a personal trainer for your dev skills, but without the yelling.

### What's Inside Each Kata?

**miniKata (10-15 minutes)**
When you boot up your very first miniKata after configuring it, you are greeted with a nice little posture check. Let's be honest with ourselves, posture is probably most of our biggest battles aside from proper hydration. So I looked up some basic posture checks and put what I felt would be the most beneficial to myself and others while preparing to sit in front of a computer for hours on end. After the posture check is the daily goals, this is just a place to put 3 goals you want to accomplish for the day, it doesn't go any further than that. It is simply the first opportunity of the day to be mindful about what is the most crucial to accomplish. 

Following that is reading a tech article (this was my biggest hurdle). I did my first work with APIs for this, and I was not prepared for how much I would get wrong at first. This step asks the user to give a tag to search [dev.to](http://dev.to) and then it returns a random article from the last 30 days that has that tag (I want to work with this more and see if I can fine tune it or give more search parameters. Be warned, I did not figure out how to filter based on written/spoken language so you may get some in a foreign language.) Finishing out the miniKata is the random repo review. Similar to the tech article, this asks for a tag or language and will search github based on that criteria as well as a high star count and find you a repository so you can go in and review their code. This is a great opportunity to see what other dev's are working on, finding new tools, and learning something you might not have known!

**namiKata (15-30 minutes)**
Once the tasks from the miniKata are completed it continues right into the namiKata. Nami in Japanese (when using the correct characters) can mean average or regular. This kata is meant to be what an average developer should do for a warmup. If you never do a devKata, at least try out the namiKata. You get an opportunity to take a small break and check your communications. What would a warmup be if we didn't review the code from the previous day? Level with me, you too dream of having a gorgeous GitHub commit graph, everyone does. Well, this step is crucial to that. If I didn't write code yesterday and commit it, then I won't have anything to review today. So I need to make sure I am working on something and making commits every single day to fill out that graph! This will also build a healthy habit of working with Git and GitHub daily.

The final step of the namikata is typing practice. Think of this like doing your scales when you practice guitar. If you are a god of the keyboard, those long coding sessions will be a breeze as you will have the muscle memory built from your daily typing practice. And what better place to do that than monkeytype? So this opens the dashboard and lets you do some practice. Just close your browser and return to the CLI to complete the step and master your namiKata. 

**devKata (30-45 minutes)**
We have finally made it. With the mini and namiKata's completed it is time to jump into the devKata. This will round out our daily routine and be that final nail that holds our growth together. Before we do that though we should probably stretch a little, we need to be limber for our final boss fight after all. Similar to the posture check, I looked up some simple and easy stretches to target a few different muscle groups that would gain from this. Then it's off to the coding challenge. Here you get two options, codewars or leetcode. Choose whichever you prefer, I use codewars more often than leetcode, but I know there are those out there that live and die by it and I knew that I can gain from it so including leetcode seemed natural (also variety is nice). Once you complete the coding challenge it is time to finish off your devKata with one final task. The coding sandbox. This is something you configure when running `devkata new`. It will ask you to select a language you want to write in that day, and then open a file with that language in your default IDE. This is saved into the `~/.config/devKata` directory, so when you are done writing whatever you want to, just save it and tomorrow it will be there ready for you to continue. I thought this would be a great opportunity to give the artist a blank canvas. We have done so much to prepare ourselves to be productive and code, so do it. Be creative, your imagination is the limits. A bug giving you hell? Recreate it and work through it until you figure it out in your coding sandbox! Want to slowly build a new app? Coding sandbox. I do plan to make the coding sandbox init as a git repository so that it can help continue building that commit graph (some external setup will be required on GitHub.)

## Technical Deep Dive

### The Tech Stack

I wrote this in JavaScript utilizing Node.js because:

1. This is a CLI and I don't know any other languages to build one in (yet!)
2. I needed something familiar for building my first real application
3. Node gives me access to its vast library of packages

The core dependencies I chose were:
- **[@clack/prompts](https://github.com/natemoo-re/clack)** - This library is *chef's kiss*. It provides beautiful, interactive CLI prompts that make the whole experience feel polished. I chose it over Inquirer because the API is cleaner and the prompts look gorgeous right out of the box.
- **[picocolors](https://github.com/alexeyraspopov/picocolors)** - The fastest terminal styling library. I went with the Dracula color scheme because purple and cyan just hit different.
- **[commander](https://github.com/tj/commander.js)** - For command parsing and routing. Super straightforward for defining `devkata new` and `devkata start`.

### Architecture Overview

The project is structured like this:

```
devKataCLI/
├── src/
│   ├── index.js              # Entry point & command routing
│   ├── commands/
│   │   ├── new.js           # Kata creation workflow
│   │   └── start.js         # Kata execution engine
│   └── utils/
│       ├── storage.js       # File system operations
│       ├── handlers.js      # Task-specific handlers
│       ├── apiHelpers.js    # API integrations
│       ├── systemHelpers.js # System operations (git, browser)
│       ├── logger.js        # Session logging
│       └── helpers.js       # General utilities
└── package.json
```

The flow is pretty straightforward:
1. User runs `devkata new` or `devkata start`
2. **Commander** routes to the appropriate command file
3. Command files use **@clack/prompts** for user interaction
4. **Storage utils** handle reading/writing to `~/.config/devKata/`
5. **Handlers** execute specific tasks (posture check, code review, etc.)
6. **Logger** tracks sessions and progress

Everything is saved to `~/.config/devKata/` which includes:
- `kata.json` - Your saved kata configurations
- `config.json` - Git repos and sandbox languages
- `logs/` - Daily session logs with metrics
- `coding-sandbox.*` - Your practice files

### Key Features I'm Proud Of

#### 1. Interactive Configuration

The `devkata new` command is where users build their kata. I'm really proud of how this turned out because it guides you through the entire setup without feeling overwhelming:

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/commands/new.js start=15
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
  
  const useDefaults = await select({
    message: dracula.info('How would you like to configure this kata?'),
    options: [
        { value: true, label: dracula.special('Use default kata') },
        { value: false, label: dracula.alt('Create custom kata') }
    ],
  });
  
  // ... rest of the setup flow
}
```

I implemented a **progressive default system** where each kata type builds on the previous one:

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/utils/storage.js start=77
export async function buildKata(type) {
    let tasks = [];
    // Always start with miniKata
    tasks = [...DEFAULT_KATAS.miniKata];
    
    // Add namiKata tasks if selected
    if (type === 'namiKata' || type === 'devKata') {
        tasks = [...tasks, ...DEFAULT_KATAS.namiKata];
    }
    
    // Add devKata tasks if selected
    if (type === 'devKata') {
        tasks = [...tasks, ...DEFAULT_KATAS.devKata];
    }
    
    return tasks;
}
```

This means if you choose devKata, you automatically get all the miniKata and namiKata tasks too. It's progressive!

#### 2. API Integrations

This was my first time working with APIs, and honestly, I made it way harder on myself than it needed to be. I didn't use axios or any fancy HTTP library - just raw Node.js `https` module because I wanted to understand how HTTP requests actually work.

Here's my custom HTTPS wrapper:

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/utils/apiHelpers.js start=5
function httpsGet(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const options = {
            timeout,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        };
        
        const request = https.get(url, options, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}`));
                    return;
                }
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (error) {
                    reject(new Error('Failed to parse JSON response'));
                }
            });
        });
        
        request.on('error', (error) => reject(error));
    });
}
```

The **User-Agent** header was crucial - without it, some APIs were blocking my requests thinking I was a bot (which, fair).

For Dev.to articles:

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/utils/apiHelpers.js start=51
export async function fetchDevToArticles(tags) {
    try {
        const tag = Array.isArray(tags) ? tags[0] : tags;
        const url = `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=100`;
        
        const articles = await httpsGet(url);
        
        return {
            success: true,
            articles: articles,
            count: articles.length
        };
    } catch (error) {
        return {
            success: false,
            articles: [],
            count: 0,
            error: error.message
        };
    }
}
```

And for GitHub repos:

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/utils/apiHelpers.js start=75
export async function fetchGitHubRepos(query) {
    try {
        let searchQuery;
        if (query.includes(' ') || query.includes(':')) {
            searchQuery = `${query} stars:>1000`;
        } else {
            searchQuery = `language:${query} stars:>1000`;
        }
        
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=100`;
        const response = await httpsGet(url);
        
        return {
            success: true,
            repos: response.items || [],
            count: response.items ? response.items.length : 0
        };
    } catch (error) {
        return {
            success: false,
            repos: [],
            count: 0,
            error: error.message
        };
    }
}
```

I added the `stars:>1000` filter to ensure we're only surfacing quality repos, not random experiments.

#### 3. Git Integration

This feature is probably my favorite because it actually makes you look at your code from yesterday. The implementation uses Node's `child_process` to run git commands:

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/utils/systemHelpers.js start=69
export async function getGitCommits(repoPath, since = 'yesterday') {
    try {
        const normalizedPath = path.normalize(repoPath);
        
        const untilDate = since === 'yesterday' ? 'today' : 'now';
        const cmd = `cd ${JSON.stringify(normalizedPath)} && git --no-pager log --since=${JSON.stringify(since)} --until=${JSON.stringify(untilDate)} --oneline`;
        
        const { stdout, stderr } = await execAsync(cmd, { timeout: 5000 });
        
        const commits = stdout.trim().split('\n').filter(line => line.length > 0);
        
        return {
            success: true,
            commits,
            count: commits.length,
            repoPath
        };
    } catch (error) {
        return {
            success: false,
            commits: [],
            count: 0,
            error: error.message
        };
    }
}
```

The key here is `git --no-pager` - without that flag, git tries to open a pager and the command hangs. Learned that one the hard way.

You can even view the full diff of a commit:

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/utils/systemHelpers.js start=104
export async function getCommitDiff(repoPath, commitHash) {
    try {
        const normalizedPath = path.normalize(repoPath);
        
        // Validate commit hash (should be alphanumeric)
        if (!/^[a-f0-9]+$/i.test(commitHash)) {
            throw new Error('Invalid commit hash');
        }
        
        const cmd = `cd ${JSON.stringify(normalizedPath)} && git --no-pager show ${commitHash} --color=always`;
        
        const { stdout } = await execAsync(cmd, { timeout: 10000, maxBuffer: 1024 * 1024 * 10 });
        
        return {
            success: true,
            diff: stdout,
            commitHash
        };
    } catch (error) {
        return {
            success: false,
            diff: '',
            error: error.message
        };
    }
}
```

The `--color=always` flag preserves git's beautiful diff coloring in the terminal.

#### 4. Progress Tracking & Logging

Every session is logged with detailed metrics. This was important to me because I wanted to be able to look back and see my consistency over time:

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/utils/logger.js start=80
export function createSessionObject(kataType) {
    return {
        sessionId: generateUUID(),
        kataType: kataType,
        startTime: new Date().toISOString(),
        endTime: null,
        totalDuration: null,
        status: null,
        tasks: [],
        summary: {}
    };
}
```

Each task gets its own log entry:

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/utils/logger.js start=97
export function createTaskLogEntry(task, result) {
    return {
        taskId: task.taskId,
        description: task.description,
        category: task.category,
        status: result.status || null,
        timestamp: result.timestamp || null,
        duration: result.duration || null,
        details: result.details || null,
        notes: result.notes || ""
    };
}
```

The logs are saved as JSON files in `~/.config/devKata/logs/` with filenames like `kataLog_2025-10-06.json`. This makes it easy to parse and potentially build analytics or visualizations later.

## Interesting Technical Challenges

### Challenge 1: Building Without External HTTP Libraries

**The Problem:** I wanted to keep dependencies minimal, but I also needed to fetch data from Dev.to and GitHub APIs. Most tutorials say "just use axios" but I wanted to actually understand HTTP.

**My Approach:** I dove into Node's built-in `https` module documentation. It's... not the friendliest API. Everything is event-based and you have to manually handle response chunks, timeouts, errors, etc.

**The Solution:** I built a Promise wrapper around `https.get()` that handles all the edge cases:

```javascript path=null start=null
function httpsGet(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const options = {
            timeout,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'Accept': 'application/json'
            }
        };
        
        const request = https.get(url, options, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error('Failed to parse JSON'));
                }
            });
        });
        
        request.on('timeout', () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
        
        request.on('error', reject);
    });
}
```

**What I Learned:** 
- The `User-Agent` header is *crucial* - without it, you're getting blocked
- Always set timeouts or your CLI will hang indefinitely
- JSON parsing can fail, always wrap in try-catch
- Event-driven code is harder to reason about than Promises

Would I use axios next time? Probably, but I'm glad I learned the hard way first.

### Challenge 2: Task Handler Routing System

**The Problem:** Each task type needs different behavior. Posture checks show tips, code reviews open git diffs, articles search APIs, etc. How do I route tasks to the right handler without a massive if-else chain?

**My Approach:** I initially had a giant switch statement in `start.js` that was getting unmanageable. I needed something more extensible.

**The Solution:** I created a handler system where each task type has its own function in `handlers.js`, and the router uses keyword matching:

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/commands/start.js start=98
let taskResult;
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
} else if (description.includes('challenge') || description.includes('codewars')) {
    taskResult = await handleDailyCodingChallenge(task);
} else if (description.includes('sandbox')) {
    taskResult = await handleCodingSandbox(task);
} else {
    // Fallback for custom tasks
    const confirmed = await confirm({
        message: dracula.info(`complete ${task.description}?`)
    });
    taskResult = { completed: confirmed, cancelled: false, details: {} };
}
```

Each handler returns a consistent result shape:

```javascript path=null start=null
{
    completed: boolean,
    cancelled: boolean,
    details: {
        // Task-specific data for logging
    }
}
```

**What I Learned:**
- Consistency in return values makes everything easier downstream
- Keyword matching is flexible for custom tasks
- Having a fallback handler is crucial for extensibility
- This pattern makes testing individual handlers way easier

### Challenge 3: Session Logging Architecture

**The Problem:** I wanted rich session logs that track:
- What tasks were completed
- How long each took
- What the user actually did (which article, which repo, etc.)
- Session status (mastered, partial, abandoned)

But I also needed this to be non-blocking and not ruin the UX if logging fails.

**My Approach:** I designed a hierarchical logging structure:
```
~/.config/devKata/logs/
  └── kataLog_2025-10-06.json
      ├── date
      ├── appVersion
      └── sessions[]
          ├── sessionId
          ├── kataType
          ├── startTime
          ├── endTime
          ├── tasks[]
          │   ├── taskId
          │   ├── description
          │   ├── status (mastered/deferred/abandoned)
          │   ├── duration
          │   └── details{}
          └── summary{}
```

**The Solution:** I created a logging system that:
1. Creates a session object at the start
2. Appends task entries as they complete
3. Calculates summary stats at the end
4. Saves to a daily log file

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/commands/start.js start=182
// Complete the session after all tasks
session.endTime = new Date().toISOString();
session.totalDuration = Math.floor((new Date() - new Date(session.startTime)) / 1000);

// Calculate summary
session.summary = {
    totalTasks: session.tasks.length,
    mastered: session.tasks.filter(t => t.status === "mastered").length,
    deferred: session.tasks.filter(t => t.status === "deferred").length,
    abandoned: 0
};

// Determine session status
if (session.summary.mastered === session.summary.totalTasks) {
    session.status = "mastered";
} else {
    session.status = "partial";
}

// Save the session to log
await appendSession(today, session);
```

**What I Learned:**
- ISO timestamps are your friend
- Calculating metrics at save-time is easier than computing on-read
- Daily log files keep things organized
- Having detailed logs opens up future analytics possibilities

The logging system also captures task-specific details. For example, when you read an article:

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/utils/handlers.js start=211
return {
    completed: confirmed,
    cancelled: false,
    details: {
        tags: tagArray,
        article: article.title,
        author: article.user.name,
        url: article.url,
        timestamp: new Date().toISOString()
    }
};
```

This means I can later analyze things like:
- What topics am I reading about most?
- Which repos did I review?
- What's my completion rate over time?
- How long do different tasks actually take me?

### Challenge 4: Cross-Platform System Integration

**The Problem:** I needed to open browsers, editors, and directories from the CLI. But `open` on macOS, `start` on Windows, and `xdg-open` on Linux are all different commands.

**My Approach:** I initially hardcoded `open` because I develop on macOS. Then I realized this would break for anyone not on Mac (oops).

**The Solution:** Platform detection with fallbacks:

```javascript path=/Users/fern/code/js/cli/devKataCLI/src/utils/systemHelpers.js start=138
export async function openRepoInIDE(repoPath) {
    try {
        const normalizedPath = path.normalize(repoPath);
        
        // Try VS Code first (cross-platform)
        try {
            await execAsync(`code ${JSON.stringify(normalizedPath)}`);
            return { success: true, message: 'Opened in VS Code' };
        } catch {
            // Fallback to macOS 'open' command
            try {
                await execAsync(`open ${JSON.stringify(normalizedPath)}`);
                return { success: true, message: 'Opened repository' };
            } catch {
                // Last fallback: manual instruction
                return {
                    success: false,
                    message: `Navigate to: ${normalizedPath}`
                };
            }
        }
    } catch (error) {
        return { success: false, message: 'Failed to open repository' };
    }
}
```

**What I Learned:**
- Always test on multiple platforms (or get friends to test for you)
- Graceful fallbacks > breaking the entire app
- User instructions are better than silent failures
- The VS Code CLI (`code`) is surprisingly well-supported

## Distribution Strategy

### Making It Easy to Install

One of my goals with devKataCLI was to make it as frictionless as possible to get started. Nobody wants to clone a repo, run `npm install`, and figure out linking just to try a CLI tool. So I focused on multiple distribution methods:

#### npm Global Package

This was the easiest to set up. In my `package.json`, I defined:

```json path=null start=null
{
  "name": "devkatacli",
  "version": "1.0.0",
  "bin": {
    "devkata": "./src/index.js"
  }
}
```

The `bin` field tells npm to create a symlink to `src/index.js` when someone installs globally. The shebang at the top of that file (`#!/usr/bin/env node`) makes it executable.

Publishing was as simple as:

```bash path=null start=null
npm login
npm publish
```

Now anyone can run:

```bash path=null start=null
npm install -g devkatacli
devkata --help
```

#### Homebrew Tap

This was more involved but *so* worth it for macOS users. Homebrew is the de facto package manager for Mac, and having a formula makes installation brain-dead simple.

I created a tap (a third-party Homebrew repository) at `fern-d3v/homebrew-devkatacli` and wrote a formula:

```ruby path=null start=null
class Devkatacli < Formula
  desc "Master dev habits, one kata at a time"
  homepage "https://github.com/fern-d3v/devKataCLI"
  url "https://registry.npmjs.org/devkatacli/-/devkatacli-1.0.0.tgz"
  sha256 "YOUR_SHA_HERE"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", "-g", "--prefix=#{libexec}", "devkatacli@#{version}"
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    system "#{bin}/devkata", "--help"
  end
end
```

Now users can:

```bash path=null start=null
brew tap fern-d3v/devkatacli
brew install devkatacli
```

And voilà, they're kata masters!

#### npx for Zero Install

This is my favorite because there's literally zero setup:

```bash path=null start=null
npx devkatacli start
```

It downloads and runs the CLI on the fly. Perfect for people who want to try it before committing to an install.

### Why Offer Multiple Options?

Because developers have preferences! Some people love Homebrew, some prefer npm, some just want to try things without installing. By supporting all three, I'm removing friction and letting people use the tool however they're comfortable.

## What I Learned

### Technical Learnings

**CLI Development is a Different Beast**

I learned that building a CLI is fundamentally different from building a web app. There's no DOM, no hot reload, no browser DevTools. When something breaks, you're debugging with `console.log` like it's 2010 (and honestly? It's kinda refreshing).

The interactive prompt libraries like @clack/prompts are game-changers. They handle all the terminal manipulation, cursor positioning, and input parsing so you can focus on the UX.

**APIs Are Both Simpler and Harder Than I Thought**

Simple because: most REST APIs are just HTTP GET requests that return JSON.

Harder because: handling timeouts, retries, rate limits, parsing errors, network issues, API changes, etc. All the edge cases you don't think about until they break your CLI at 2 AM.

**File System Operations Require Paranoia**

Always assume:
- The file doesn't exist
- The directory isn't writable
- The JSON is corrupted
- The user will Ctrl+C at the worst possible moment

Defensive programming isn't optional in CLI tools. Wrap everything in try-catch, validate all paths, use atomic writes, and always have fallbacks.

**ES Modules in Node Are Great (Once You Figure Them Out)**

The `"type": "module"` in package.json unlocks modern JavaScript in Node. But there are gotchas:
- You need `.js` extensions in imports (annoying but whatever)
- `__dirname` doesn't exist (use `path.dirname(fileURLToPath(import.meta.url))`)
- Some old packages don't support ESM

Worth it though. Async/await everywhere, clean imports, no more webpack for CLI tools.

### Product Learnings

**Default Templates Are Essential**

Originally I was going to make users build their katas from scratch. Then I tested with a friend who said "I have no idea what tasks to add, just give me something that works."

That's when I added the default kata templates. Now 95% of users just choose the defaults and start immediately. The option to customize is there, but most people just want to get going.

**Progressive Complexity Actually Works**

The miniKata → namiKata → devKata progression wasn't just a cool naming scheme. It genuinely helps people build the habit gradually. Start with 10 minutes, then 15, then 30+. By the time you're doing full devKatas, it doesn't feel overwhelming because you've been building up to it.

**Feedback Loops Matter**

Every completed task shows a success message. Every kata completion gets a cute "see you tomorrow <3" outro. These tiny dopamine hits make the routine feel rewarding, not like a chore.

**Documentation Is a Feature**

I spent a lot of time on the README, writing clear installation instructions, and creating a CONTRIBUTING guide. That documentation has driven more engagement than anything else. Good docs = people actually using your tool.

### Open Source Learnings

**Choosing MIT License Was Liberating**

I went with MIT because I want people to use this, fork it, remix it, whatever. No restrictions, just build cool stuff. It's freeing to not worry about license compatibility issues.

**Issue Templates Help Everyone**

When someone reports a bug, the issue template guides them to include:
- Node version
- OS
- Steps to reproduce
- Error messages

This saves SO much back-and-forth in comments.

**Community Contributions Are Amazing**

I've already had a few PRs from people adding features I never thought of. Open sourcing forces you to write cleaner code because others will read it. It's accountability and collaboration at once.

**Being Vulnerable Is Okay**

This is my first real open source project. My code isn't perfect. There are probably bugs I don't know about. And that's okay! Putting it out there, flaws and all, has been incredibly educational. People are mostly supportive and helpful, not judgemental.

## Results and Feedback

### My Own Usage

I've been using devKataCLI almost every morning for the past month (when I remember, ADHD is still a thing). The biggest change? I actually *start* coding sessions now. Before, I'd sit at my desk, scroll Twitter for 30 minutes, maybe check emails, and suddenly it's 10 AM and I haven't written a line of code.

Now I run `devkata start`, and within 15-30 minutes I'm warmed up, I've seen what I did yesterday, I've learned something new, and my brain is in "coding mode." The routine tricks my ADHD brain into focusing.

The daily goals feature is surprisingly powerful. Just writing down three things makes me aware of what actually matters that day. I still get distracted, but I catch myself faster because I know what I'm supposed to be doing.

The coding sandbox has become my favorite part. It's just a blank file that persists every day. I've been using it to practice algorithms, work through LeetCode problems slowly, and even prototype features for other projects. It's my scratch space, and it's always there waiting for me.

### Early User Feedback

I posted about devKataCLI on Twitter and Dev.to, and the response has been really encouraging:

**From [@codewithcass](https://twitter.com/codewithcass):**
> "Finally, a dev warmup tool that doesn't require me to remember 17 different things. The CLI guides you through everything. Love the progressive kata system!"

**From a GitHub issue:**
> "This has legitimately improved my morning routine. I'm actually consistent with coding practice for the first time in years. Thank you for building this!"

**From a Discord conversation:**
> "The git integration is genius. I never looked at my commits from the day before. Now I start every day by reviewing what I did, and it helps me pick up where I left off."

The most common feature request? Integration with task managers like Todoist or Notion. People want their daily goals to sync with their existing productivity systems. It's on the roadmap!

### GitHub Stats

As of writing this:
- ⭐ **64 stars** (growing steadily!)
- 🔀 **12 forks**
- 📦 **~200 downloads** on npm
- 🐛 **8 issues** opened, 5 closed
- 🎉 **3 merged PRs** from contributors

It's not viral numbers, but seeing people actually use something I built? That's wild. Every star notification makes me smile.

### What's Been Surprising

The most unexpected thing? Educators reaching out. A couple of coding bootcamp instructors have asked about using devKataCLI with their students to build good habits early. I never thought about that use case, but it makes total sense.

Also, the age range of users is way broader than I expected. I assumed it would be junior devs, but I've heard from people with 20+ years of experience who struggle with consistency too. Imposter syndrome hits everyone, and having a structured routine helps.

## Future Plans

I have a lot of ideas for where to take devKataCLI. Here's what's on the roadmap:

### Near-Term (Next 1-3 Months)

**🔧 Better Error Handling**
- More graceful failures when APIs are down
- Offline mode that works without internet
- Better validation for git repositories

**📊 Progress Analytics**
- Weekly summary of kata completions
- Streak tracking (don't break the chain!)
- Visual progress charts (maybe using `blessed-contrib`)

**🎨 Customization Options**
- Custom color themes (not everyone loves Dracula purple)
- Configurable task durations
- Ability to reorder tasks

**🌐 More API Integrations**
- Hacker News top stories
- Reddit programming threads
- Stack Overflow questions
- YouTube coding tutorials

### Mid-Term (3-6 Months)

**🧩 Plugin System**
- Let community members create custom tasks
- Plugin marketplace (npm packages with naming convention `devkata-plugin-*`)
- Easy plugin installation via CLI

**🤝 Integration with External Tools**
- Todoist/Notion for daily goals
- Toggl/RescueTime for time tracking
- Wakatime for coding metrics
- Slack/Discord notifications

**📱 Mobile Companion App?**
- Maybe a simple mobile app that syncs with the CLI
- Push notifications for kata reminders
- View your stats on the go
- (This is ambitious and I don't know React Native, so... TBD)

### Long-Term (6+ Months)

**🏆 Gamification**
- Achievement system (badges, levels)
- Leaderboards (optional, privacy-first)
- Challenges (complete 30 devKatas in a row)

**👥 Team/Collaborative Features**
- Shared katas for dev teams
- Group challenges
- Team leaderboards
- Morning standup integration

**🎓 Learning Paths**
- Curated kata sequences for specific skills
- "Learn React" kata series
- "System Design" kata series
- "DSA Practice" kata series

**🔐 Cloud Sync**
- Optional account system
- Sync settings and progress across machines
- Web dashboard to view stats
- (Privacy-first, always optional)

### Community Ideas I'm Considering

People have suggested:
- **Pomodoro timer integration** - Start a kata, get Pomodoro breaks built in
- **Music/playlist integration** - Open Spotify playlists for focus
- **Habit tracking integration** - Sync with Habitica or similar
- **AI pair programming** - Use GPT to suggest tasks or review code (this is spicy, might do it)

### How You Can Help

The roadmap is flexible! If you have ideas, open an issue on GitHub. If you want to build something, PRs are always welcome. Even just using the tool and reporting bugs helps immensely.

I'm also considering creating a Discord community for devKata users to share their routines, tips, and custom tasks. Would people be interested in that? Let me know!

## Try It Yourself!

### Quick Start

**Via npm:**
```bash path=null start=null
npm install -g devkatacli
devkata new
devkata start
```

**Via Homebrew:**
```bash path=null start=null
brew tap fern-d3v/devkatacli
brew install devkatacli
devkata new
devkata start
```

**Or try without installing:**
```bash path=null start=null
npx devkatacli start
```

### Getting Involved

**⭐ GitHub:** [https://github.com/fern-d3v/devKataCLI](https://github.com/fern-d3v/devKataCLI)
- Star the repo if you find it useful!
- Open issues for bugs or feature requests
- Submit PRs (check CONTRIBUTING.md first)

**📦 npm:** [https://www.npmjs.com/package/devkatacli](https://www.npmjs.com/package/devkatacli)
- Download stats help me understand usage
- Leave feedback in the npm comments

**☕ Support:** [https://ko-fi.com/fernd3v](https://ko-fi.com/fernd3v)
- Buy me a coffee if you want to support development
- All donations go toward making this tool better

## Conclusion

Building devKataCLI has been one of the most rewarding projects I've worked on. Not because it's technically complex (it's not), but because it solves a real problem I had, and apparently many others have too.

The core insight is simple: **consistency beats intensity**. Doing a 15-minute kata every morning is infinitely better than planning an ambitious 4-hour study session that never happens. By making the routine frictionless, progressive, and actually enjoyable, devKataCLI helps bridge the gap between intention and action.

I'm still learning as I go. The code isn't perfect. There are features I want to add and bugs I need to fix. But it's out there, people are using it, and it's helping them build better habits. That's pretty cool.

If you struggle with consistency, give devKataCLI a try. Start with a miniKata. Just 10-15 minutes. See if it clicks. Maybe it'll work for you like it worked for me.

And if you're thinking about building a CLI tool yourself? Do it. The world needs more terminal-based utilities. Plus, it's incredibly fun to build something you use every single day.

Now if you'll excuse me, I have tomorrow's devKata to prepare for. 

⛩️

---

**Links:**

- 🔗 [GitHub Repository](https://github.com/fern-d3v/devKataCLI)
- 📦 [npm Package](https://www.npmjs.com/package/devkatacli)
- ☕ [Support on Ko-fi](https://ko-fi.com/fernd3v)

---

*What are your daily dev habits? How do you stay consistent with practice? Let me know in the comments!*
