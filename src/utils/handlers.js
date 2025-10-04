import { confirm, text, isCancel, spinner, select } from "@clack/prompts";
import pc from 'picocolors';
import { getConfig } from './storage.js';
import { fetchDevToArticles, fetchGitHubRepos, getRandomItem } from './apiHelpers.js';
import { openInBrowser, openInEditor, getGitCommits, getCommitDiff, openRepoInIDE } from './systemHelpers.js';
import path from 'path';
import os from 'os';

// Dracula color theme
const dracula = {
    success: (text) => pc.green(text),
    error: (text) => pc.red(text),
    info: (text) => pc.yellow(text),
    special: (text) => pc.magenta(text),
    alt: (text) => pc.cyan(text),
    dim: (text) => pc.dim(text)
};

// Posture Check Handler
export async function handlePostureCheck(task) {
    const postureTips = [
        "Keep your feet flat on the floor",
        "Position your screen at eye level", 
        "Sit back in your chair with back support",
        "Keep your shoulders relaxed",
        "Position keyboard and mouse at elbow height"
    ];
    
    console.log(dracula.special("\nPosture Check Suggestions:"));
    console.log(dracula.dim("────────────────────────────────"));
    
    postureTips.forEach((tip, index) => {
        console.log(dracula.info(`  ${index + 1}. ${tip}`));
    });
    
    console.log(dracula.dim("────────────────────────────────\n"));
    
    const readyToContinue = await confirm({
        message: dracula.alt("Have you adjusted your posture? Ready to continue?")
    });
    
    if (isCancel(readyToContinue)) {
        return {
            completed: false,
            cancelled: true,
            details: {
                tipsShown: postureTips,
                userConfirmed: false,
                cancelled: true,
                timestamp: new Date().toISOString()
            }
        };
    }
    
    return {
        completed: readyToContinue,
        cancelled: false,
        details: {
            tipsShown: postureTips,
            userConfirmed: readyToContinue,
            timestamp: new Date().toISOString(),
            duration: 0
        }
    };
}

// Set Daily Goals Handler
export async function handleSetDailyGoals(task) {
    const goals = [];
    
    console.log(dracula.special("\n• Set Your Daily Goals"));
    console.log(dracula.dim("────────────────────────────────\n"));
    
    for (let i = 1; i <= 3; i++) {
        const goal = await text({
            message: dracula.info(`Goal ${i} of 3:`),
            placeholder: 'e.g., Complete the user authentication feature'
        });
        
        if (isCancel(goal)) {
            return {
                completed: false,
                cancelled: true,
                details: { goals, goalsSet: goals.length }
            };
        }
        
        if (goal && goal.trim()) {
            goals.push(goal.trim());
        }
    }
    
    console.log(dracula.success("\n✓ Daily Goals Set:"));
    goals.forEach((goal, index) => {
        console.log(dracula.alt(`  ${index + 1}. ${goal}`));
    });
    console.log();
    
    const confirmed = await confirm({
        message: dracula.info("Ready to tackle these goals?")
    });
    
    if (isCancel(confirmed)) {
        return {
            completed: false,
            cancelled: true,
            details: { goals, goalsSet: goals.length }
        };
    }
    
    return {
        completed: confirmed,
        cancelled: false,
        details: {
            goals,
            goalsSet: goals.length,
            timestamp: new Date().toISOString()
        }
    };
}
// Read Tech Article Handler
export async function handleReadTechArticle(task) {
    let searching = true;
    
    while (searching) {
        console.log(dracula.special("\n→ Find a Tech Article to Read"));
        console.log(dracula.dim("────────────────────────────────\n"));
        
        const tags = await text({
            message: dracula.info('Enter tags to search (comma-separated):'),
            placeholder: 'e.g., javascript, react, typescript'
        });
        
        if (isCancel(tags)) {
            return {
                completed: false,
                cancelled: true,
                details: {}
            };
        }
        
        const tagArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
        
        if (tagArray.length === 0) {
            console.log(dracula.error('No tags provided. Skipping article search.'));
            return { completed: false, cancelled: false, details: {} };
        }
        
        const s = spinner();
        s.start(dracula.info(`Searching Dev.to for articles with tag: ${tagArray[0]}...`));
        
        const result = await fetchDevToArticles(tagArray[0]);
        
        s.stop();
        
        if (!result.success || result.count === 0) {
            console.log(dracula.error('\n✗ No articles found with that tag'));
            console.log(dracula.dim('Try different tags or check back later\n'));
            
            const nextAction = await select({
                message: dracula.info('What would you like to do?'),
                options: [
                    { value: 'retry', label: dracula.special('Try different tags') },
                    { value: 'complete', label: dracula.alt('Mark as complete anyway') },
                    { value: 'skip', label: dracula.dim('Skip this task') }
                ]
            });
            
            if (isCancel(nextAction)) {
                return {
                    completed: false,
                    cancelled: true,
                    details: { tags: tagArray, articlesFound: 0 }
                };
            }
            
            if (nextAction === 'retry') {
                continue;
            } else if (nextAction === 'complete') {
                return {
                    completed: true,
                    cancelled: false,
                    details: { tags: tagArray, articlesFound: 0 }
                };
            } else {
                return {
                    completed: false,
                    cancelled: false,
                    details: { tags: tagArray, articlesFound: 0 }
                };
            }
        }
        
        const article = getRandomItem(result.articles);
        
        console.log(dracula.success(`\n✓ Found ${result.count} recent article(s)!\n`));
        console.log(dracula.special(`${article.title}`));
        console.log(dracula.dim(`   by ${article.user.name}`));
        console.log(dracula.alt(`   ${article.url}\n`));
        
        const confirmed = await confirm({
            message: dracula.info('Open this article and read it?')
        });
        
        if (isCancel(confirmed)) {
            return {
                completed: false,
                cancelled: true,
                details: { tags: tagArray, article: article.title, url: article.url }
            };
        }
        
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
    }
}
// Random GitHub Repo Review Handler
export async function handleRandomRepoReview(task) {
    let searching = true;
    
    while (searching) {
        console.log(dracula.special("\n→ Find a Random GitHub Repository"));
        console.log(dracula.dim("────────────────────────────────\n"));
        
        const query = await text({
            message: dracula.info('Enter language or topic to search:'),
            placeholder: 'e.g., javascript, python, machine-learning'
        });
        
        if (isCancel(query)) {
            return {
                completed: false,
                cancelled: true,
                details: {}
            };
        }
        
        if (!query || query.trim().length === 0) {
            console.log(dracula.error('No query provided. Skipping repo search.'));
            return { completed: false, cancelled: false, details: {} };
        }
        
        const s = spinner();
        s.start(dracula.info(`Searching GitHub for repos with: ${query}...`));
        
        const result = await fetchGitHubRepos(query.trim());
        
        s.stop();
        
        if (!result.success || result.count === 0) {
            console.log(dracula.error('\n✗ No repositories found'));
            console.log(dracula.dim('Try a different query\n'));
            
            const nextAction = await select({
                message: dracula.info('What would you like to do?'),
                options: [
                    { value: 'retry', label: dracula.special('Try a different query') },
                    { value: 'complete', label: dracula.alt('Mark as complete anyway') },
                    { value: 'skip', label: dracula.dim('Skip this task') }
                ]
            });
            
            if (isCancel(nextAction)) {
                return {
                    completed: false,
                    cancelled: true,
                    details: { query, reposFound: 0 }
                };
            }
            
            if (nextAction === 'retry') {
                continue;
            } else if (nextAction === 'complete') {
                return {
                    completed: true,
                    cancelled: false,
                    details: { query, reposFound: 0 }
                };
            } else {
                return {
                    completed: false,
                    cancelled: false,
                    details: { query, reposFound: 0 }
                };
            }
        }
        
        const repo = getRandomItem(result.repos);
        
        console.log(dracula.success(`\n✓ Found ${result.count} repositories!\n`));
        console.log(dracula.special(`${repo.full_name}`));
        console.log(dracula.dim(`   ${repo.description || 'No description'}`));
        console.log(dracula.info(`   ★ ${repo.stargazers_count.toLocaleString()} stars`));
        console.log(dracula.alt(`   ${repo.html_url}\n`));
        
        const confirmed = await confirm({
            message: dracula.info('Review this repository?')
        });
        
        if (isCancel(confirmed)) {
            return {
                completed: false,
                cancelled: true,
                details: { query, repo: repo.full_name, url: repo.html_url }
            };
        }
        
        return {
            completed: confirmed,
            cancelled: false,
            details: {
                query,
                repo: repo.full_name,
                description: repo.description,
                stars: repo.stargazers_count,
                url: repo.html_url,
                timestamp: new Date().toISOString()
            }
        };
    }
}
// Review Yesterday's Code Handler
export async function handleReviewYesterdaysCode(task) {
    console.log(dracula.special("\n→ Review Yesterday's Code"));
    console.log(dracula.dim("────────────────────────────────\n"));
    
    const config = await getConfig();
    
    if (!config.repositories || config.repositories.length === 0) {
        console.log(dracula.error('✗ No repositories linked'));
        console.log(dracula.dim('Run `devkata new` to connect a repo for review\n'));
        
        const skip = await confirm({
            message: dracula.info('Skip this task?')
        });
        
        return {
            completed: false,
            cancelled: isCancel(skip),
            details: { error: 'No repositories configured' }
        };
    }
    
    let selectedRepo;
    
    if (config.repositories.length === 1) {
        selectedRepo = config.repositories[0];
        console.log(dracula.info(`Using repository: ${selectedRepo}\n`));
    } else {
        const repoChoice = await select({
            message: dracula.info('Select a repository to review:'),
            options: config.repositories.map(repo => ({
                value: repo,
                label: repo
            }))
        });
        
        if (isCancel(repoChoice)) {
            return {
                completed: false,
                cancelled: true,
                details: {}
            };
        }
        
        selectedRepo = repoChoice;
    }
    
    const s = spinner();
    s.start(dracula.info('Fetching commits from yesterday...'));
    
    const result = await getGitCommits(selectedRepo, 'yesterday');
    
    s.stop();
    
    if (!result.success) {
        console.log(dracula.error('\n✗ Failed to fetch commits'));
        console.log(dracula.dim(`Error: ${result.error}\n`));
        
        const continueAnyway = await confirm({
            message: dracula.info('Mark task as complete anyway?')
        });
        
        return {
            completed: continueAnyway,
            cancelled: isCancel(continueAnyway),
            details: { repo: selectedRepo, error: result.error }
        };
    }
    
    if (result.count === 0) {
        console.log(dracula.info('\nℹ No commits from previous day, check back tomorrow\n'));
        
        const continueAnyway = await confirm({
            message: dracula.info('Mark task as complete?')
        });
        
        return {
            completed: continueAnyway,
            cancelled: isCancel(continueAnyway),
            details: { repo: selectedRepo, commits: 0 }
        };
    }
    
    console.log(dracula.success(`\n✓ Found ${result.count} commit(s) from yesterday:\n`));
    
    const reviewedCommits = [];
    let continueReviewing = true;
    
    while (continueReviewing) {
        // Create options for commit selection
        const commitOptions = result.commits.map((commit, index) => {
            const wasReviewed = reviewedCommits.includes(commit);
            const prefix = wasReviewed ? '✓ ' : '  ';
            return {
                value: commit,
                label: `${prefix}${commit}`
            };
        });
        
        // Add options to finish or open in IDE
        commitOptions.push(
            { value: '__open_ide__', label: dracula.special('→ Open repository in IDE') },
            { value: '__done__', label: dracula.success('✓ Done reviewing') }
        );
        
        const commitChoice = await select({
            message: dracula.info('Select a commit to review:'),
            options: commitOptions
        });
        
        if (isCancel(commitChoice)) {
            return {
                completed: false,
                cancelled: true,
                details: { repo: selectedRepo, commits: result.commits, reviewed: reviewedCommits }
            };
        }
        
        // Handle special actions
        if (commitChoice === '__done__') {
            continueReviewing = false;
            break;
        }
        
        if (commitChoice === '__open_ide__') {
            console.log(dracula.info('\nOpening repository in IDE...\n'));
            const openResult = await openRepoInIDE(selectedRepo);
            
            if (openResult.success) {
                console.log(dracula.success(`✓ ${openResult.message}\n`));
            } else {
                console.log(dracula.error(`✗ ${openResult.message}\n`));
            }
            
            const doneAfterIDE = await confirm({
                message: dracula.info('Finished reviewing in IDE?')
            });
            
            if (isCancel(doneAfterIDE)) {
                return {
                    completed: false,
                    cancelled: true,
                    details: { repo: selectedRepo, commits: result.commits, reviewed: reviewedCommits, openedInIDE: true }
                };
            }
            
            if (doneAfterIDE) {
                continueReviewing = false;
                break;
            }
            
            continue;
        }
        
        // Extract commit hash from the selected commit (format: "hash message")
        const commitHash = commitChoice.split(' ')[0];
        
        // Ask how to review this commit
        const reviewMethod = await select({
            message: dracula.info('How do you want to review this commit?'),
            options: [
                { value: 'terminal', label: dracula.alt('View diff in terminal') },
                { value: 'ide', label: dracula.special('Open in IDE') },
                { value: 'back', label: dracula.dim('← Go back') }
            ]
        });
        
        if (isCancel(reviewMethod)) {
            return {
                completed: false,
                cancelled: true,
                details: { repo: selectedRepo, commits: result.commits, reviewed: reviewedCommits }
            };
        }
        
        if (reviewMethod === 'back') {
            continue;
        }
        
        if (reviewMethod === 'terminal') {
            const s2 = spinner();
            s2.start(dracula.info('Fetching commit diff...'));
            
            const diffResult = await getCommitDiff(selectedRepo, commitHash);
            
            s2.stop();
            
            if (!diffResult.success) {
                console.log(dracula.error(`\n✗ Failed to fetch diff: ${diffResult.error}\n`));
            } else {
                console.log('\n' + dracula.dim('─'.repeat(80)));
                console.log(diffResult.diff);
                console.log(dracula.dim('─'.repeat(80)) + '\n');
            }
            
            // Mark as reviewed
            if (!reviewedCommits.includes(commitChoice)) {
                reviewedCommits.push(commitChoice);
            }
            
            const continueAfterDiff = await confirm({
                message: dracula.info('Review another commit?')
            });
            
            if (isCancel(continueAfterDiff) || !continueAfterDiff) {
                continueReviewing = false;
            }
        } else if (reviewMethod === 'ide') {
            console.log(dracula.info('\nOpening repository in IDE...\n'));
            const openResult = await openRepoInIDE(selectedRepo);
            
            if (openResult.success) {
                console.log(dracula.success(`✓ ${openResult.message}`));
                console.log(dracula.dim(`  Review commit: ${commitHash}\n`));
            } else {
                console.log(dracula.error(`✗ ${openResult.message}\n`));
            }
            
            // Mark as reviewed
            if (!reviewedCommits.includes(commitChoice)) {
                reviewedCommits.push(commitChoice);
            }
            
            const doneWithReview = await confirm({
                message: dracula.info('Finished reviewing?')
            });
            
            if (isCancel(doneWithReview)) {
                return {
                    completed: false,
                    cancelled: true,
                    details: { repo: selectedRepo, commits: result.commits, reviewed: reviewedCommits, openedInIDE: true }
                };
            }
            
            if (doneWithReview) {
                continueReviewing = false;
            }
        }
    }
    
    return {
        completed: true,
        cancelled: false,
        details: {
            repo: selectedRepo,
            commitCount: result.count,
            commits: result.commits,
            reviewedCommits: reviewedCommits,
            timestamp: new Date().toISOString()
        }
    };
}
// Typing Practice Handler
export async function handleTypingPractice(task) {
    console.log(dracula.special("\n→ Typing Practice"));
    console.log(dracula.dim("────────────────────────────────\n"));
    console.log(dracula.info('Opening MonkeyType for typing practice...\n'));
    
    const openResult = await openInBrowser('https://monkeytype.com');
    
    if (!openResult.success) {
        console.log(dracula.error('✗ Failed to open browser automatically'));
        console.log(dracula.alt(`   Open manually: ${openResult.url}\n`));
    } else {
        console.log(dracula.success('✓ Opened MonkeyType in browser\n'));
    }
    
    const confirmed = await confirm({
        message: dracula.info('Complete your typing practice?')
    });
    
    if (isCancel(confirmed)) {
        return {
            completed: false,
            cancelled: true,
            details: { url: 'https://monkeytype.com' }
        };
    }
    
    return {
        completed: confirmed,
        cancelled: false,
        details: {
            url: 'https://monkeytype.com',
            browserOpened: openResult.success,
            timestamp: new Date().toISOString()
        }
    };
}
// Daily Coding Challenge Handler
export async function handleDailyCodingChallenge(task) {
    console.log(dracula.special("\n→ Daily Coding Challenge"));
    console.log(dracula.dim("────────────────────────────────\n"));
    
    const platform = await select({
        message: dracula.info('Choose a platform:'),
        options: [
            { value: 'leetcode', label: 'LeetCode (l)' },
            { value: 'codewars', label: 'CodeWars (c)' }
        ]
    });
    
    if (isCancel(platform)) {
        return {
            completed: false,
            cancelled: true,
            details: {}
        };
    }
    
    const urls = {
        leetcode: 'https://leetcode.com/problemset/',
        codewars: 'https://www.codewars.com/dashboard'
    };
    
    const url = urls[platform];
    const platformName = platform === 'leetcode' ? 'LeetCode' : 'CodeWars';
    
    console.log(dracula.info(`\nOpening ${platformName}...\n`));
    
    const openResult = await openInBrowser(url);
    
    if (!openResult.success) {
        console.log(dracula.error('✗ Failed to open browser automatically'));
        console.log(dracula.alt(`   Open manually: ${url}\n`));
    } else {
        console.log(dracula.success(`✓ Opened ${platformName} in browser\n`));
    }
    
    const confirmed = await confirm({
        message: dracula.info(`Complete a challenge on ${platformName}?`)
    });
    
    if (isCancel(confirmed)) {
        return {
            completed: false,
            cancelled: true,
            details: { platform: platformName, url }
        };
    }
    
    return {
        completed: confirmed,
        cancelled: false,
        details: {
            platform: platformName,
            url,
            browserOpened: openResult.success,
            timestamp: new Date().toISOString()
        }
    };
}
// Coding Sandbox Handler
export async function handleCodingSandbox(task) {
    console.log(dracula.special("\n→ Coding Sandbox"));
    console.log(dracula.dim("────────────────────────────────\n"));
    
    const config = await getConfig();
    const configDir = path.join(os.homedir(), '.config', 'devKata');
    
    // Check if any sandbox languages are configured
    if (!config.sandboxLanguages || Object.keys(config.sandboxLanguages).length === 0) {
        console.log(dracula.error('✗ No sandbox languages configured'));
        console.log(dracula.dim('Run `devkata new` to configure sandbox languages\n'));
        
        const skip = await confirm({
            message: dracula.info('Skip this task?')
        });
        
        return {
            completed: false,
            cancelled: isCancel(skip),
            details: { error: 'No sandbox languages configured' }
        };
    }
    
    // If only one language, use it; otherwise let user choose
    let selectedLanguage;
    let extension;
    
    const languages = Object.keys(config.sandboxLanguages);
    
    if (languages.length === 1) {
        selectedLanguage = languages[0];
        extension = config.sandboxLanguages[selectedLanguage];
        console.log(dracula.info(`Using sandbox: ${selectedLanguage} (.${extension})\n`));
    } else {
        const langChoice = await select({
            message: dracula.info('Select a sandbox language:'),
            options: languages.map(lang => ({
                value: lang,
                label: `${lang} (.${config.sandboxLanguages[lang]})`
            }))
        });
        
        if (isCancel(langChoice)) {
            return {
                completed: false,
                cancelled: true,
                details: {}
            };
        }
        
        selectedLanguage = langChoice;
        extension = config.sandboxLanguages[selectedLanguage];
    }
    
    // Build file path
    const filePath = path.join(configDir, `coding-sandbox.${extension}`);
    
    console.log(dracula.info(`Opening sandbox file...\n`));
    
    const openResult = await openInEditor(filePath);
    
    if (!openResult.success) {
        console.log(dracula.error('✗ Could not open automatically'));
        console.log(dracula.alt(`   Open manually: ${openResult.filePath || filePath}\n`));
    } else {
        console.log(dracula.success('✓ Opened coding sandbox\n'));
    }
    
    const confirmed = await confirm({
        message: dracula.info('Practice in your coding sandbox?')
    });
    
    if (isCancel(confirmed)) {
        return {
            completed: false,
            cancelled: true,
            details: { language: selectedLanguage, filePath }
        };
    }
    
    return {
        completed: confirmed,
        cancelled: false,
        details: {
            language: selectedLanguage,
            extension,
            filePath,
            editorOpened: openResult.success,
            timestamp: new Date().toISOString()
        }
    };
}
// Hydrate Handler
export async function handleHydrate(task) {
    console.log(dracula.special("\n• Hydration Check"));
    console.log(dracula.dim("────────────────────────────────\n"));
    console.log(dracula.info('Remember to drink water!'));
    console.log(dracula.dim('Staying hydrated improves focus and productivity\n'));
    
    const confirmed = await confirm({
        message: dracula.alt('Have you had some water?')
    });
    
    if (isCancel(confirmed)) {
        return {
            completed: false,
            cancelled: true,
            details: {}
        };
    }
    
    return {
        completed: confirmed,
        cancelled: false,
        details: { timestamp: new Date().toISOString() }
    };
}
// Stretches Handler
export async function handleStretches(task) {
    const stretchSuggestions = [
        "Neck rolls - slowly rotate your head in circles",
        "Shoulder shrugs - raise and lower shoulders 10 times",
        "Wrist circles - rotate wrists clockwise and counterclockwise",
        "Stand up and do 10 arm circles",
        "Back stretch - clasp hands and reach forward",
        "Leg stretches - stand and alternate touching toes"
    ];
    
    console.log(dracula.special("\n• Stretch Break"));
    console.log(dracula.dim("────────────────────────────────\n"));
    
    stretchSuggestions.forEach((stretch, index) => {
        console.log(dracula.info(`  ${index + 1}. ${stretch}`));
    });
    
    console.log(dracula.dim("\n────────────────────────────────\n"));
    
    const confirmed = await confirm({
        message: dracula.alt('Have you done some stretches?')
    });
    
    if (isCancel(confirmed)) {
        return {
            completed: false,
            cancelled: true,
            details: { stretches: stretchSuggestions }
        };
    }
    
    return {
        completed: confirmed,
        cancelled: false,
        details: {
            stretches: stretchSuggestions,
            timestamp: new Date().toISOString()
        }
    };
}
// Check Communications Handler
export async function handleCheckCommunications(task) {
    console.log(dracula.special("\n→ Check Communications"));
    console.log(dracula.dim("────────────────────────────────\n"));
    console.log(dracula.info('Time to check your messages:'));
    console.log(dracula.dim('  • Email'));
    console.log(dracula.dim('  • Slack/Discord'));
    console.log(dracula.dim('  • Project management tools'));
    console.log(dracula.dim('  • Team notifications\n'));
    
    const confirmed = await confirm({
        message: dracula.alt('Have you checked your communications?')
    });
    
    if (isCancel(confirmed)) {
        return {
            completed: false,
            cancelled: true,
            details: {}
        };
    }
    
    return {
        completed: confirmed,
        cancelled: false,
        details: { timestamp: new Date().toISOString() }
    };
}