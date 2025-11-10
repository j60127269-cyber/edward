# GitHub Authentication Setup

## Problem
Git was using credentials for a different GitHub account (`globalrsk777-web`) instead of your account (`j60127269-cyber`).

## Solution: Use Personal Access Token

### Step 1: Create Personal Access Token on GitHub

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name (e.g., "edward-project")
4. Select expiration (30 days, 60 days, or no expiration)
5. Check the **`repo`** scope (this gives full access to repositories)
6. Click **"Generate token"**
7. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### Step 2: Push Your Code

When you run `git push`, it will prompt for:
- **Username**: `j60127269-cyber`
- **Password**: Paste your Personal Access Token (NOT your GitHub password)

### Alternative: Update Remote URL with Token

You can also embed the token in the remote URL (less secure but convenient):

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/j60127269-cyber/edward.git
```

---

## Quick Commands

```bash
# Update remote URL (after creating token)
git remote set-url origin https://github.com/j60127269-cyber/edward.git

# Push to GitHub (will prompt for credentials)
git push -u origin main
```

---

## Verify Setup

```bash
# Check remote URL
git remote -v

# Check current branch
git branch

# Check git config
git config user.name
git config user.email
```

