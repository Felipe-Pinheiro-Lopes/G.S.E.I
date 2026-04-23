---
description: Analyze project modifications, group them logically, and commit with generated messages using Git and GitHub
agent: general
subtask: true
skill: commit-generation
---

# Commit Workflow (Git + GitHub)

This workflow helps you analyze changes, group them logically, and create meaningful commits using Git and optionally push to GitHub.

## Repository Configuration:
- **Owner**: Felipe-Pinheiro-Lopes
- **Repository**: ADPV
- **Default Branch**: main
- **Git User**: Felipe P. Lopes <felipe.atender.comercial@gmail.com>

## Steps:

1. **Analyze modifications** - Check current git status for changed files
2. **Identify changed files** - Review local modifications and untracked files
3. **Group changes** - Separate modifications into logical groups (frontend, backend, docs, etc.)
4. **Generate commit messages** - Create descriptive commit messages for each group using the commit-generation skill
5. **Stage changes** - Add selected files to the staging area
6. **Create commits** - Commit staged changes with meaningful messages
7. **Push to GitHub** - Optionally push commits to remote repository

## Usage:

Run this command to start the commit workflow:
```
/commit
```

## Git Tools Used:
- `git status` - Check current repository status
- `git add` - Stage files for commit
- `git commit` - Create commits with meaningful messages
- `git push` - Push commits to GitHub (optional)

## Process:

1. Read local modified files using the Read tool
2. Generate appropriate commit messages using the commit-generation skill
3. Stage files with `git add`
4. Create commits using `git commit -m "<message>"`
5. Push to GitHub with `git push origin <branch>` if desired

## Examples of logical groupings:
- Frontend UI changes (adpv-front/)
- Backend API modifications (API/)
- Database migrations (API/Migrations/)
- Documentation updates (README.md, .md files)
- Configuration changes (.json, .csproj files)
- Build artifacts (bin/, obj/ - typically not committed)

## Let's start by analyzing the current state of the repository and preparing the commit.

(End of file - total 64 lines)