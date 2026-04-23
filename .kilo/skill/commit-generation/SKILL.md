---
name:   commit-message-generation
description: A skill for generating meaningful, conventional commit messages based on changes made
---

# Commit Message Generation Skill

This skill helps generate meaningful commit messages following conventional commit standards.

## Conventional Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

## How to Use This Skill

When analyzing changes, consider:

1. **What type of change is this?** (feat, fix, docs, etc.)
2. **What is the scope?** (optional - e.g., frontend, backend, auth, api, etc.)
3. **What is a concise description of the change?**

## Examples

- `feat(auth): add JWT token refresh functionality`
- `fix(api): correct null reference exception in PedidoController`
- `docs: update README with installation instructions`
- `style(frontend): fix Tailwind CSS class ordering in components`
- `refactor(backend): simplify ProductService validation logic`
- `build: update npm dependencies in frontend package.json`
- `chore: add .gitignore rules for IDE files`

## Process

1. Examine the staged changes
2. Determine the appropriate type
3. Identify the scope (if applicable)
4. Write a clear, imperative description
5. Keep the subject line under 50 characters when possible
6. Add a body if needed for explanation (wrap at 72 characters)
7. Add footers for breaking changes or issue references

## GitHub MCP Integration

When using GitHub MCP tools to commit:

1. **Using `github_push_files`** (recommended for multiple files):
   - Collect all modified files with their current content
   - Use file paths relative to repository root
   - Provide commit message following conventional commit format
   - Repository: owner = "Felipe-Pinheiro-Lopes", repo = "ADPV"

2. **Using `github_create_or_update_file`** (for single file commits):
   - Provide file path, content, commit message, and branch
   - Useful for atomic single-file changes

3. **Important Notes**:
   - GitHub MCP commits are pushed directly to the remote repository
   - Ensure you have the correct branch checked out locally
   - The commit will appear on GitHub immediately after the API call

Let's apply this to generate commit messages for the current changes.