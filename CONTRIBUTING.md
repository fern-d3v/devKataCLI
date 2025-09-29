# Contributing to devKataCLI

Thank you for your interest in contributing to devKataCLI! We welcome contributions from developers of all experience levels. This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/devKataCLI.git
   cd devKataCLI
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/originalowner/devKataCLI.git
   ```

## Development Environment

### Prerequisites

- Node.js 18+ (ES modules support required)
- npm (comes with Node.js)
- Git

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Link the CLI locally** for testing:
   ```bash
   npm link
   ```

3. **Verify the setup**:
   ```bash
   devkata --help
   ```

### Development Workflow

- **Test your changes** by running the CLI locally
- **Use the existing kata.json** for testing or create test configurations
- **Check that all commands work** (`devkata new`, `devkata start`)

## Project Structure

```
devKataCLI/
├── src/
│   ├── index.js              # CLI entry point and command routing
│   ├── commands/             # Command implementations
│   │   ├── new.js           # Kata creation workflow
│   │   └── start.js         # Kata execution workflow
│   └── utils/               # Shared utilities
│       ├── storage.js       # File system operations
│       ├── handlers.js      # Task-specific handlers
│       └── helpers.js       # General helper functions
├── promo/                   # Promotional materials
├── devKata-lessons.md       # Comprehensive learning guide
├── appendix_diagram.md      # Task ideas mind map
└── package.json            # Project configuration
```

### Key Technologies

- **Commander.js**: CLI framework and argument parsing
- **@clack/prompts**: Interactive terminal prompts
- **picocolors**: Terminal color styling
- **ES Modules**: Modern JavaScript module system

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-logging-system`
- `fix/kata-completion-bug`
- `docs/update-readme-examples`
- `refactor/improve-error-handling`

### Commit Messages

Write clear, descriptive commit messages:
```
feat: add daily logging system for kata completions

- Create logs directory in config folder
- Store session data with timestamps
- Add log rotation for file management
```

Use conventional commit prefixes:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Code Style

### JavaScript Style

- **ES Modules**: Use `import`/`export` syntax
- **Async/Await**: Prefer async/await over promise chains
- **Arrow Functions**: Use for inline functions and callbacks
- **Destructuring**: Use object/array destructuring where appropriate
- **Template Literals**: Use backticks for string interpolation

### CLI Conventions

- **Interactive Prompts**: Use @clack/prompts for all user input
- **Color Coding**: Use the established dracula color scheme:
  ```javascript
  const dracula = {
    success: (text) => pc.green(text),
    error: (text) => pc.red(text),
    info: (text) => pc.yellow(text),
    special: (text) => pc.magenta(text),
    alt: (text) => pc.cyan(text),
    dim: (text) => pc.dim(text)
  };
  ```
- **Error Handling**: Always handle user cancellation (`isCancel()`)
- **Loading States**: Use spinners for operations that take time

### File System Operations

- **Use utils/storage.js**: Don't directly access the file system from commands
- **Error Handling**: Handle file not found, permission errors gracefully
- **Atomic Operations**: Ensure data consistency during save operations

## Testing

### Manual Testing

Before submitting changes, test the following workflows:

1. **Kata Creation**:
   ```bash
   devkata new
   # Test all kata types (mini, nami, dev)
   # Test both default and custom kata creation
   ```

2. **Kata Execution**:
   ```bash
   devkata start
   # Test task completion, skipping, and cancellation
   # Verify progress is saved correctly
   ```

3. **Error Scenarios**:
   - No saved katas
   - Corrupted configuration files
   - User cancellation at various points

### Automated Testing

We welcome contributions to improve our testing infrastructure:
- Unit tests for utility functions
- Integration tests for command workflows
- CLI output testing

## Submitting Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit them

3. **Update documentation** if needed

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what you've changed
   - Screenshots or examples if applicable
   - Reference to any related issues

### Pull Request Guidelines

- **One feature per PR**: Keep changes focused and reviewable
- **Update documentation**: Include relevant documentation changes
- **Test your changes**: Ensure everything works as expected
- **Respond to feedback**: Be open to suggestions and iterate

## Reporting Issues

When reporting bugs, please include:

1. **Environment Information**:
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - Operating system
   - devKataCLI version

2. **Steps to Reproduce**:
   - Exact commands you ran
   - Expected vs actual behavior
   - Error messages or screenshots

3. **Additional Context**:
   - Configuration files (remove sensitive info)
   - Relevant logs or output

### Issue Templates

Use these labels to help categorize issues:
- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Community help needed

## Feature Requests

We love hearing about new ideas! When suggesting features:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** you're trying to solve
3. **Propose a solution** or approach
4. **Consider the scope** - would this benefit most users?
5. **Think about implementation** - how complex would this be?

## Development Tips

### Understanding the Codebase

- **Start with `src/index.js`** to understand command routing
- **Review existing commands** in `src/commands/` for patterns
- **Study the storage system** in `src/utils/storage.js`
- **Read the learning guide** in `devKata-lessons.md` for architecture insights

### Common Development Tasks

- **Adding a new command**: Create a new file in `src/commands/`, add to `src/index.js`
- **Adding new task types**: Extend handlers in `src/utils/handlers.js`
- **Modifying prompts**: Update command files using @clack/prompts patterns
- **Changing storage format**: Update `src/utils/storage.js` with migration logic

### Debugging

- **Use console.log** strategically (remove before committing)
- **Test with different kata configurations**
- **Verify file system operations** in `~/.config/devKata/`
- **Check error handling** with invalid inputs

## Getting Help

- **Open an issue** for questions about the codebase
- **Check the learning guide** (`devKata-lessons.md`) for architectural insights
- **Review existing code** for patterns and conventions
- **Join discussions** in issue comments

---

Thank you for contributing to devKataCLI! Your efforts help make developer habits more accessible and enjoyable for everyone. 🚀