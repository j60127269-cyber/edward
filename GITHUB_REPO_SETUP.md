# GitHub Repository Setup Guide

## Option 1: Create Repo on GitHub Website (Recommended)

### Step 1: Create the repository on GitHub
1. Go to https://github.com/new
2. Enter repository name (e.g., `how-academia`)
3. Choose public or private
4. **DO NOT** initialize with README, .gitignore, or license (since you already have files)iji
5. Click "Create repository"

### Step 2: Initialize Git and Push Your Code

```bash
# Initialize git repository (if not already initialized)
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit"

# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Option 2: Create Repo Using GitHub CLI (if installed)

```bash
# Install GitHub CLI first (if not installed)
# Download from: https://cli.github.com/

# Login to GitHub
gh auth login

# Create repository and push code in one command
gh repo create REPO_NAME --public --source=. --remote=origin --push
```

---

## Quick Command Reference

```bash
# Initialize repository
git init

# Check status
git status

# Add all files
git add .

# Add specific file
git add filename.txt

# Commit changes
git commit -m "Your commit message"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Check remote
git remote -v

# Push to GitHub
git push -u origin main

# For subsequent commits
git add .
git commit -m "Update description"
git push
```

---

## For Your Current Project

Based on your Git config (username: `j60127269-cyber`, email: `j60127269@gmail.com`), here are the exact commands:

```bash
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "Initial commit: How Academia project"

# 4. Add remote (replace REPO_NAME with your actual repo name)
git remote add origin https://github.com/j60127269-cyber/REPO_NAME.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

---

## Troubleshooting

### If you get authentication errors:
- Use Personal Access Token instead of password
- Create token at: https://github.com/settings/tokens
- Use token as password when prompted

### If remote already exists:
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### Check current git config:
```bash
git config user.name
git config user.email
```

