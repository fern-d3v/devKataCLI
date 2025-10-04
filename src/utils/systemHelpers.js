// system helper functions
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);
// open URL in default browser
export async function openInBrowser(url) {
    try{
        // Validate URL to prevent command injection
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return { success: false, message: 'Invalid URL protocol', url };
        }
        
        // macOS uses 'open' command
        await execAsync(`open ${JSON.stringify(url)}`, { timeout: 5000 });
        return { success: true, message: 'Opened in browser' };
    } catch (error) {
        console.error('Error opening browser:', error.message);
        return { success: false, message: 'Failed to open browser', url };
    }
}
// open coding sandbox in default editor
export async function openInEditor(filePath) {
    try {
        // ensure file exists, create if it doesn't
        try {
            await fs.access(filePath);
        } catch {
            // file doesn't exist, create it with a comment
            const extension = path.extname(filePath);
            let initialContent = '';
            if (extension === '.js' || extension === '.ts') {
                initialContent = '// Daily coding sandbox\n\n';
            } else if (extension === '.py') {
                initialContent = '# Daily coding sandbox\n\n';
            } else if (extension === '.rs') {
                initialContent = '// Daily coding sandbox\n\n';
            } else if (extension === '.html') {
                initialContent = '<!-- Daily coding sandbox -->\n\n';
            } else if (extension === '.css') {
                initialContent = '/* Daily coding sandbox */\n\n';
            } else if (extension === '.c') {
                initialContent = '/* Daily coding sandbox */\n\n';
            }
            await fs.writeFile(filePath, initialContent, 'utf8');
        }
        // try opening with default application (macOS)
        try {
            await  execAsync(`open ${JSON.stringify(filePath)}`, { timeout: 5000 });
            return { success: true, message: 'Sandbox opened in default editor' };
        } catch {
            // fallback: try $EDITOR environment variable
            const editor = process.env.EDITOR || 'nano';
            return {
                success: false,
                message: `Could not open automatically. Use: ${editor} ${filePath}`,
                filePath,
                editor
            };
        }
    } catch (error) {
        console.error('Error opening editor:', error.message);
        return { success: false, message: 'Failed to open editor', error: error.message };
    }
}
// get git commits from a repository
export async function getGitCommits(repoPath, since = 'yesterday') {
    try {
        // Validate repoPath to prevent command injection
        const normalizedPath = path.normalize(repoPath);
        
        // git log command
        const untilDate = since === 'yesterday' ? 'today' : 'now';
        const cmd = `cd ${JSON.stringify(normalizedPath)} && git --no-pager log --since=${JSON.stringify(since)} --until=${JSON.stringify(untilDate)} --oneline`;
        
        const { stdout, stderr } = await execAsync(cmd, { timeout: 5000 });
        
        if (stderr && !stderr.includes('warning')) {
            throw new Error(stderr);
        }
        
        // parse commits
        const commits = stdout.trim().split('\n').filter(line => line.length > 0);
        
        return {
            success: true,
            commits,
            count: commits.length,
            repoPath
        };
    } catch (error) {
        console.error('Error getting git commits:', error.message);
        return {
            success: false,
            commits: [],
            count: 0,
            error: error.message
        };
    }
}
//Validate if a path is a git repository
export async function validateGitRepo(repoPath) {
    try {
        // Normalize path to prevent directory traversal
        const normalizedPath = path.normalize(repoPath);
        
        // check if .git directory exists
        const gitPath = path.join(normalizedPath, '.git');
        await fs.access(gitPath);
        // try running git status to confirm its a valid repo
        const cmd = `cd ${JSON.stringify(normalizedPath)} && git status`;
        await execAsync(cmd, { timeout: 3000 });
        return { success: true, message: 'Valid git repository' };
    } catch (error) {
        return { success: false, message: 'Not a valid git repository' };
    }
}