// Utility functions for the devKataCLI application
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export function startSession(task) {
    const now = new Date().toISOString();
    return {
        sessionId: generateUUID(),
        startedAt: now,
        endedAt: null,
        durationMs: null,
        completed: false,
        skipped: false,
        details: {}
    };
}
export function endSession(session, { completed = false, skipped = false, details = {} } = {}) {
    const now = new Date().toISOString();
    const startTime = new Date(session.startedAt);
    const endTime = new Date(now);
    return {
        ...session,
        endedAt: now,
        durationMs: endTime.getTime() - startTime.getTime(),
        completed,
        skipped,
        details: { ...session.details, ...details }
    };
}
export function getDefaultMetadata(task) {
    const description = task.description.toLowerCase();
    // Default values
    let estimatedDuration = 300; // 5 minutes default
    let difficulty = 'easy';
    let tags = [];
    // Check for wellness/health tasks
    if (description.includes('posture') || description.includes('stretch') || description.includes('hydrate')) {
        estimatedDuration = 300; // 5 minutes
        difficulty = 'easy';
        tags = ['health', 'ergonomics'];
    } else if (description.includes('code') || description.includes('challenge') || description.includes('sandbox')) {
        estimatedDuration = 900; // 15 minutes
        difficulty = 'medium';
        tags = ['programming', 'practice'];
    } else if (description.includes('read') || description.includes('article') || description.includes('review')) {
        estimatedDuration = 600; // 10 minutes
        difficulty = 'easy';
        tags = ['education', 'knowledge'];
    } else if (description.includes('typing')) {
        estimatedDuration = 300; // 5 minutes
        difficulty = 'easy';
        tags = ['skill', 'practice'];
    } else if (description.includes('goals') || description.includes('communications')) {
        estimatedDuration = 300; // 5 minutes
        difficulty = 'easy';
        tags = ['productivity', 'planning'];
    }
    
    return {
        estimatedDuration,
        difficulty,
        tags
    };
}
// Factory function to create rich task objects
export function createTask(description, kataType, customMetadata = {}) {
    const defaultMeta = getDefaultMetadata({ description });
    const category = defaultMeta.tags.length > 0 ? defaultMeta.tags[0] : 'general';
    return {
    taskId: generateUUID(),
    kataType: kataType,
    category: category,
    description: description,
    metadata: {
        estimatedDuration: defaultMeta.estimatedDuration,
        difficulty: defaultMeta.difficulty,
        tags: defaultMeta.tags,
        ...customMetadata
    },
    sessions: [],
    totalCompletions: 0,
    totalSkips: 0,
    lastCompleted: null,
    averageDuration: null,
    streak: 0
};
}