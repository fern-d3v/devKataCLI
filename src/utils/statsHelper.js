export function calculateTotalKatas(sessions) {
    const completedSessions = sessions.filter(session =>
        session.status === 'mastered' || session.status === 'partial')
    return completedSessions.length;
}

/**
 * Calculate average kata duration in minutes
 */
export function calculateAverageDuration(sessions) {
    const completedSessions = sessions.filter(session =>
        (session.status === 'mastered' || session.status === 'partial') && 
        session.totalDuration
    );
    
    if (completedSessions.length === 0) return 0;
    
    const totalSeconds = completedSessions.reduce((sum, session) => 
        sum + (session.totalDuration || 0), 0
    );
    
    // Return average in minutes, rounded to 1 decimal
    return Math.round((totalSeconds / completedSessions.length / 60) * 10) / 10;
}

/**
 * Aggregates all sessions from multiple log files within a date range
 * @param {Array} allLogs - Array of daily log objects
 * @param {number|null} days - Number of days to look back (7, 30, 90, 365, or null for all)
 * @returns {Array} - Filtered array of sessions
 */
export function getSessionsInRange(allLogs, days = null) {
    if (!allLogs || allLogs.length === 0) return [];
    
    // If days is null, return all sessions
    if (days === null) {
        return allLogs.flatMap(log => log.sessions);
    }
    
    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffString = cutoffDate.toISOString().slice(0, 10);
    
    // Filter logs within range and flatten sessions
    return allLogs
        .filter(log => log.date >= cutoffString)
        .flatMap(log => log.sessions);
}

export function calculateStreak(allLogs) {
    if (!allLogs || allLogs.length === 0) return 0;
    
    // Sort logs by date DESCENDING (newest first)
    const sortedLogs = [...allLogs].sort((a, b) => b.date.localeCompare(a.date));
    
    // Get today's date
    const today = new Date().toISOString().slice(0, 10);
    
    let streak = 0;
    let currentDate = new Date(today);
    let streakStarted = false;
    
    // Loop through each day starting from today
    // Continue for up to 365 days or until we run out of logs
    for (let i = 0; i < 365; i++) {
        const expectedDate = currentDate.toISOString().slice(0, 10);
        const log = sortedLogs.find(l => l.date === expectedDate);
        
        // Check if this day has at least one completed session
        if (log && log.sessions) {
            const hasCompleted = log.sessions.some(session => 
                session.status === 'mastered' || session.status === 'partial'
            );
            
            if (hasCompleted) {
                streak++;
                streakStarted = true;
                // Move to previous day
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (streakStarted) {
                // Had a log file but no completed sessions = streak ends
                break;
            } else {
                // No streak yet, keep looking back
                currentDate.setDate(currentDate.getDate() - 1);
            }
        } else {
            // No log file for this date
            if (streakStarted) {
                // Streak was going, now we hit a gap = streak ends
                break;
            } else {
                // No streak yet, keep looking back
                currentDate.setDate(currentDate.getDate() - 1);
            }
        }
    }
    
    return streak;
}

export function getCategoryStats(sessions) {
    // Flatten all tasks from all sessions
    const allTasks = sessions.flatMap(session => session.tasks);
    
    // Group and count by category
    const categoryCounts = allTasks.reduce((acc, task) => {
        const category = task.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});
    
    // Convert to array and sort by count descending
    return Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
}

export function getArticlesRead(sessions) {
    const articlesMap = new Map(); // Key: url, Value: {url, title}
    
    for (const session of sessions) {
        for (const task of session.tasks) {
            // Check if task is about reading an article
            if (task.description.toLowerCase().includes("article") || 
                task.description.toLowerCase().includes("read")) {
                
                const { url, title } = task.details || {};
                
                // Only add if we have both url and title
                if (url && title) {
                    // Map will naturally deduplicate by URL
                    articlesMap.set(url, { url, title });
                }
            }
        }
    }
    
    // Convert Map values to array
    return Array.from(articlesMap.values());
}

export function getReposReviewed(sessions) {
    const reposMap = new Map(); // Key: repoUrl, Value: {repoUrl, repoName}
    
    for (const session of sessions) {
        for (const task of session.tasks) {
            const desc = task.description.toLowerCase();
            
            if (desc.includes("repo") || desc.includes("github")) {
                const { repoUrl, repoName } = task.details || {};
                
                if (repoUrl && repoName) {
                    reposMap.set(repoUrl, { repoUrl, repoName });
                }
            }
        }
    }
    
    return Array.from(reposMap.values());
}

// TEMP: For testing
if (import.meta.url === `file://${process.argv[1]}`) {
    // Mock data
    const mockSessions = [
        {
            status: 'mastered',
            tasks: [
                { category: 'wellness', description: 'posture', details: {} },
                { category: 'learning', description: 'read article', details: { url: 'test.com', title: 'Test' } }
            ]
        }
    ];
    
    console.log('Total:', calculateTotalKatas(mockSessions));
    console.log('Categories:', getCategoryStats(mockSessions));
    console.log('Articles:', getArticlesRead(mockSessions));
}