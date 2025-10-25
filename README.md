<div align="center">
  <img src="./promo/devKataCLI-logo.png" alt="devKataCLI Logo" width="200">
  
  # devKataCLI

  ![npm](https://img.shields.io/npm/dt/devkatacli?style=flat)
  ![Version](https://img.shields.io/badge/version-1.0.2-orange.svg?style=flat)
  ![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)
  <br>
  [![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/fernd3v?style=flat)

  
  **Master dev habits, one kata at a time**
  
  Three progressive kata types:
  
   **mini** *(10-15min)* → **nami** *(15-30min)* → **dev** *(30-45min)*

---
</div>

## Why devKataCLI?

Building consistent development habits is hard. You know you should practice regularly, review code, and stay sharp—but life gets in the way.

devKataCLI gives you structure without overwhelming you:

- **Start small** - Begin with just 10-15 minutes
- **Build progressively** - Grow your practice as habits form  
- **Zero setup** - Run from anywhere in your terminal
- **Fully customizable** - Create your own katas or use defaults
- **Track progress** - See your consistency over time

Perfect for developers who want to establish morning routines, sharpen skills through spaced repetition, or simply build more intentional coding habits.

---
## Installation

### Prerequisites
- **Node.js 18+** (Required for all installation methods)

### Choose Your Installation Method

#### **Option 1: Homebrew (macOS/Linux)**
```bash
brew tap fern-d3v/devkatacli
brew install devkatacli
```

#### **Option 2: npm (Cross-platform)**
```bash
npm install -g devkatacli
```

#### **Option 3: npx (No installation)**
```bash
npx devkatacli start
```

#### **Option 4: From source**
```bash
git clone https://github.com/fern-d3v/devKataCLI.git
cd devKataCLI
npm install
npm link
```

### Verify Installation
```bash
devkata --help
```
You should see the command options and be ready to start!

---
## **Quick Start**

**1. Create Your First Kata**
    - Start by creating a kata routine:

 ```bash
 devkata new
 ```
You'll be guided through an interactive setup:

•  Choose kata type: mini (10-15min), nami (15-30min), or dev (30-45min)

•  Select template: Use defaults or create custom tasks

•  Link git repositories for code reviews

•  Configure coding sandbox languages

•  Build your personalized routine


**2. Start Your Daily Practice**
   -Run your morning kata:

```bash
 devkata start
```

 The CLI will:

•  Load your saved kata

•  Guide you through each task

•  Track completion status

•  Save your progress


**3. Configure Kata's After Setup**
```bash
devkata config
```
The CLI will run a similar setup to the `devkata new` command:

•  Choose which Kata to configure

•  Link git repositories

•  Select coding languages for sandbox

---
# **Example Workflow**
## Create a mini kata with default tasks
$ devkata new

✨ Create a new devKata routine

? What type of kata would you like to create? › miniKata (10-15 minutes)

? How would you like to configure this kata? › Use default kata

✅ miniKata created successfully with default tasks

## Start your daily practice
$ devkata start

? Select a kata to start: › miniKata

⠋ loading your kata...

✅ kata loaded!

⠋ Review yesterday's code for 10 minutes

? complete Review yesterday's code for 10 minutes? › Yes

✅ Review yesterday's code for 10 minutes completed!

⠋ Check today's tickets and prioritize

? complete Check today's tickets and prioritize? › Yes  

✅ Check today's tickets and prioritize completed!

✨ kata saved! see you tomorrow <3

---
### What's Included in Each Kata?

**miniKata** (10-15 minutes)
- Posture check with ergonomic tips
- Set 3 daily goals
- Discover a tech article from Dev.to
- Explore a random GitHub repository

**namiKata** (15-30 minutes)
- All miniKata tasks, plus:
- Hydration reminder
- Check communications (email, Slack, etc.)
- Review yesterday's code commits
- Practice typing skills on MonkeyType

**devKata** (30-45 minutes)
- All miniKata + namiKata tasks, plus:
- Stretching exercises
- Complete a coding challenge (LeetCode or CodeWars)
- Practice in your coding sandbox

---
### Available Commands

| Command | Description |
|---------|-------------|
| devkata new | Create a new kata routine (mini, nami, or dev) |
| devkata start | Start your daily kata practice |
| devkata config | Config kata after creation |
| devkata --help | Show all available commands |

---
### Features

•  **Progressive Kata Types**: Start small with miniKata (10-15min), build up to devKata (30-45min)

•  **Interactive CLI Experience**: Beautiful prompts with Dracula-themed colors

•  **API Integrations**: Search Dev.to articles and GitHub repos directly from your kata

•  **Git Integration**: Review yesterday's commits from your linked repositories

•  **Coding Challenges**: Quick access to LeetCode and CodeWars

•  **Typing Practice**: Launch MonkeyType for skill improvement

•  **Coding Sandbox**: Daily practice files for multiple languages

•  **Progress Tracking**: Automatic session logging with detailed metrics

•  **Default Templates**: Pre-built kata routines based on developer best practices

•  **Fully Customizable**: Create your own tasks or modify existing ones

---
### Configuration

Your configuration and logs are stored in `~/.config/devKata/`:

- `kata.json` - Your saved kata routines
- `config.json` - Git repositories and sandbox languages
- `logs/` - Daily session logs with detailed metrics
- `coding-sandbox.*` - Your practice files

---

<div align="center"><sub>Perfect for developers who want to learn CLI development while building better coding habits!</sub></div>


## Contributing

We welcome contributions! Please see our Contributing Guidelines for details on:

•  Setting up the development environment

•  Code style and conventions  

•  Submitting pull requests

•  Reporting issues

For questions or discussions, feel free to open an issue.

## License

This project is licensed under the MIT License - see the *LICENSE* file for details.

---

<div align="center">
  <sub>Built with ❤️ for developers who value consistency and growth</sub>
</div>
<div align="center">⛩️</div>
