# DevKataCLI Warp Plan

## Project Overview
Building a personal, interactive CLI tool for developer warmup routines with three kata types:
- **quickKata**: 5-10 minute focused warmup
- **namiKata**: 15-30 minute medium-length routine (renamed from kihoKata)
- **devKata**: 30-45 minute comprehensive warmup with coding challenges

## Current Status ✅
Based on analysis of your codebase, here's what's already implemented:

### ✅ Completed Tasks
- [x] **Project Setup**: Package.json with ES modules, dependencies installed
- [x] **File Structure**: Proper src/ directory with commands/ and utils/ folders
- [x] **Storage Utility**: Basic `storage.js` with `getKata()` and `saveKata()` functions
- [x] **New Command**: Mostly complete `new.js` with interactive prompts and kata creation
- [x] **Start Command**: Partial implementation in `start.js` with kata selection

### 🔧 Issues Identified
- **storage.js**: `getKata()` function doesn't accept a kata type parameter but `start.js` is calling it with one
- **new.js**: Has syntax errors (extra closing brace on line 21)
- **index.js**: Nearly empty, missing commander setup and command registration
- **package.json**: Missing `bin` field for CLI installation

## Phase 1: Fix Current Implementation 🔨

### Task 1.1: Fix Storage Functions
**Priority: High**
- Fix `getKata()` to accept optional kata type parameter
- Ensure it returns specific kata or all katas based on parameter
- Add proper error handling with try/catch

### Task 1.2: Fix New Command Syntax Errors
**Priority: High**
- Remove extra closing brace on line 21
- Ensure proper async/await flow

### Task 1.3: Complete Index.js
**Priority: High**
- Import commander and set up program
- Import and register 'new' and 'start' commands
- Add proper command descriptions and parsing

### Task 1.4: Complete Start Command
**Priority: High**
- Fix the getKata() function call to match storage.js signature
- Implement task loop with spinners and confirmations
- Add task completion tracking and saving
- Handle empty kata scenarios

### Task 1.5: Add CLI Installation Support
**Priority: Medium**
- Add `bin` field to package.json pointing to src/index.js
- Test with `npm link` for local installation

## Phase 2: Polish & Enhancement 🎨

### Task 2.1: Error Handling & User Experience
**Priority: Medium**
- Add comprehensive try/catch blocks in all functions
- Implement user-friendly error messages with picocolors
- Add input validation and edge case handling

### Task 2.2: Color Enhancement
**Priority: Low**
- Import and use picocolors for success (green), error (red), and info (yellow) messages
- Enhance visual feedback throughout the CLI

### Task 2.3: Code Documentation
**Priority: Low**
- Add JSDoc comments to all functions
- Document the 'why' behind complex logic decisions

## Phase 3: Default Kata Configurations & Logging 🎯

### Task 3.1: Default Kata Templates
**Priority: High** *(New Decision)*
- **quickKata** defaults: Posture check, set daily goals, read tech article, random GitHub repo code review
- **namiKata** defaults: Hydrate, check communications, review yesterday's code  
- **devKata** defaults: Stretches, daily coding challenge, coding sandbox
- Store default templates in `src/utils/storage.js` or separate constants file
- Maintain backward compatibility with existing custom katas

### Task 3.2: Enhanced New Command Flow
**Priority: High** *(New Decision)*
- Add prompt: "Use default tasks for this kata?" (Yes/Customize)
- If Yes → load predefined task list for selected kata type
- If Customize → keep existing interactive task creation flow
- Update success messages to indicate default vs custom configuration

### Task 3.3: Daily Execution Logging
**Priority: High** *(New Decision)*
- Implement JSON logging system for kata execution tracking
- Log format: `{timestamp, kataType, tasks:[{name, status}], completed}`
- Save to `~/.config/devKata/logs/` directory
- Choose between:
  - One file per day: `kata-YYYY-MM-DD.json`
  - Single rolling log file: `execLog.json`
- Log every successful kata completion from start command

### Task 3.4: GitHub Repository Integration
**Priority: Optional**
- Implement random GitHub repo fetching for quickKata and devKata default tasks
- Use Node.js fetch API to call GitHub Search API
- Display random JavaScript repositories for code review

### Task 3.5: Coding Sandbox Feature  
**Priority: Optional**
- Create local sandbox file creation for devKata default task
- Use child_process to open files in user's preferred editor
- Read $EDITOR environment variable

### Task 3.6: Additional CLI Commands
**Priority: Optional**
- `list` command to show all saved katas
- `clear` command to delete specific kata types
- `status` command to show completion progress
- `logs` command to view execution history

## Implementation Order 📋

1. **Fix storage.js getKata() function** (Critical - blocks start command)
2. **Fix new.js syntax errors** (Critical - prevents kata creation)  
3. **Complete index.js with commander setup** (Critical - no CLI without this)
4. **Complete start.js implementation** (High - core functionality)
5. **Add bin field and test installation** (High - makes it a real CLI)
6. **Implement default kata templates** (High - new core feature)
7. **Enhanced new command with default/custom flow** (High - new core feature)
8. **Daily execution logging system** (High - tracking & analytics)
9. **Add error handling and colors** (Medium - improves UX)
10. **Implement optional advanced features** (Optional - nice to have)

## Testing Strategy 🧪

### Manual Testing Checklist
- [ ] `npm link` works and installs CLI globally
- [ ] `devkata new` creates katas successfully for all three types
- [ ] `devkata new` offers default vs customize options
- [ ] Default kata templates load correctly for each type
- [ ] Custom kata creation flow still works as before
- [ ] `devkata start` runs katas and tracks completion
- [ ] Daily execution logging creates files in `~/.config/devKata/logs/`
- [ ] Multiple kata runs on same day append/update correctly
- [ ] Error handling works for missing files, corrupted JSON, etc.
- [ ] Colors display correctly in terminal
- [ ] Configuration files are created in proper location (~/.config/devKata/)

### Test Scenarios
- [ ] First-time user (no config files exist)
- [ ] User with existing katas
- [ ] Invalid JSON in config file
- [ ] Permission issues with config directory
- [ ] Cancelled prompts and edge cases

## File Structure Reference 📁
```
/Users/fern/code/js/cli/devKataCLI/
├── .gitignore ✅
├── package.json ✅ (needs bin field)
├── warmup_plan.md ✅
├── warp.md ✅ (this file)
├── src/
│   ├── index.js ⚠️ (needs commander setup)
│   ├── commands/
│   │   ├── new.js ⚠️ (has syntax errors, needs default flow)
│   │   └── start.js ⚠️ (incomplete implementation, needs logging)
│   └── utils/
│       └── storage.js ⚠️ (function signature issues, needs defaults & logging)
└── ~/.config/devKata/
    ├── kata.json (created at runtime)
    └── logs/ (new - for daily execution tracking)
        ├── kata-2025-01-15.json (option 1: daily files)
        └── execLog.json (option 2: rolling log)
```

## Notes 📝
- Project uses ES modules (type: "module" in package.json)
- Dependencies: @clack/prompts, commander, picocolors
- Target platform: Node.js CLI for macOS/Linux/Windows
- Configuration stored in user's home directory following XDG conventions

---

*This plan is designed to guide both manual development and AI assistance. Update task status as work progresses.*