# Bug Issues Tool

A simple Node.js tool to list the ten most recent bug issues from the toeverything/AFFiNE GitHub repository.

## Usage

### Demo Mode (Recommended)

To see the tool in action with pre-fetched data:

```bash
# From the root of the AFFiNE repository
node tools/bug-issues/demo.js
```

### Live Data Mode

To fetch live data from GitHub API:

```bash
# From the root of the AFFiNE repository
node tools/bug-issues/index.js

# Or with GitHub token for higher rate limits
GITHUB_TOKEN=your_token_here node tools/bug-issues/index.js
```

Or from the tools/bug-issues directory:

```bash
# Demo mode
node demo.js

# Live mode
node index.js
```

## Features

- 📋 Lists the 10 most recent bug issues (both open and closed)
- 🐛 Shows issue state with emojis (🐛 for open, ✅ for closed)
- 📅 Displays creation date, author, and current state
- 🔗 Provides direct links to issues
- 📝 Shows truncated descriptions
- 📊 Provides a summary with open/closed counts

## Output Format

The tool displays issues in a formatted table with:
- Issue number and title
- Creation date and author
- Current state (open/closed)
- Direct link to the GitHub issue
- Brief description
- Summary statistics

## Files

- `demo.js` - Demo version with pre-fetched data (no API calls)
- `index.js` - Live version that fetches data from GitHub API
- `README.md` - This documentation
- `package.json` - Package configuration

## Requirements

- Node.js (version specified in package.json engines)
- Internet connection to access GitHub API (for live mode)
- Optional: GitHub token for higher rate limits (for live mode)

## Configuration

The tool is configured to:
- Target repository: `toeverything/AFFiNE`
- Look for issues with the "Bug" label
- Return the 10 most recent issues
- Sort by creation date (newest first)

These settings can be modified in the source code if needed.

## Rate Limits

GitHub's API has rate limits:
- Without authentication: 60 requests per hour
- With GitHub token: 5000 requests per hour

The demo mode doesn't make any API calls, so it always works.