#!/usr/bin/env node

/**
 * Tool to list the ten most recent bug issues from the toeverything/AFFiNE repository
 * This demo version uses pre-fetched data to show functionality
 */

// Demo data based on actual GitHub API results (fetched previously)
const DEMO_BUG_ISSUES = [
  {
    "id": 3038375593,
    "number": 12128,
    "state": "open",
    "title": "[Bug]: Edgeless Export Frames as Image (PNG/SVG)",
    "user": {"login": "fallsdevil"},
    "created_at": "2025-05-05T01:02:39Z",
    "html_url": "https://github.com/toeverything/AFFiNE/issues/12128",
    "body": "A dedicated Export as Image action in Edgeless mode (whiteboard) that lets users download their canvas as PNG or SVG. It should offer: Export entire canvas, a specific frame, or custom selection..."
  },
  {
    "id": 3036740744,
    "number": 12115,
    "state": "open", 
    "title": "[Bugt]: add a way to zoom without needing a middle mouse button",
    "user": {"login": "gabrielcamilo0321"},
    "created_at": "2025-05-02T19:59:44Z",
    "html_url": "https://github.com/toeverything/AFFiNE/issues/12115",
    "body": "add a way to zoom in edgeless mode without needing a middle mouse button, like a shortcut, for example shift or alt + left mouse button to zoom."
  },
  {
    "id": 2997331918,
    "number": 11719,
    "state": "closed",
    "title": "[Bug]: Web frontend ignores AFFINE_SERVER_SUB_PATH",
    "user": {"login": "jorne"},
    "created_at": "2025-04-15T19:03:06Z",
    "html_url": "https://github.com/toeverything/AFFiNE/issues/11719",
    "body": "I'm trying to make AFFiNE available under https://sub.mydomain.com/affine, using NPM as proxy. I've set AFFINE_SERVER_SUB_PATH=/affine in the env file."
  },
  {
    "id": 2991436697,
    "number": 11656,
    "state": "open",
    "title": "[Bug]: Attachment in database view is not visible on the shared view of the page",
    "user": {"login": "wikinikiwings"},
    "created_at": "2025-04-13T19:28:47Z",
    "html_url": "https://github.com/toeverything/AFFiNE/issues/11656",
    "body": "all types of attachments are visible on the shared page, but attachments in the database view - are not showing"
  },
  {
    "id": 2976574946,
    "number": 11515,
    "state": "open",
    "title": "[Bug]: Input text exceeds before character selection",
    "user": {"login": "Edit-Mr"},
    "created_at": "2025-04-07T11:40:45Z",
    "html_url": "https://github.com/toeverything/AFFiNE/issues/11515",
    "body": "When using a Chinese input method in the mind map, the input text exceeds the text box before character selection is completed."
  },
  {
    "id": 2769179704,
    "number": 9526,
    "state": "closed",
    "title": "journals's title(and its property) get lost after exporting and importing",
    "user": {"login": "happyZYM"},
    "created_at": "2025-01-05T09:00:48Z",
    "html_url": "https://github.com/toeverything/AFFiNE/issues/9526",
    "body": "I'm using the AppImage version. When I export a space and import it again, all the titles of journals are lost."
  },
  {
    "id": 2601277065,
    "number": 8559,
    "state": "closed",
    "title": "Loss folder information when import Workspace",
    "user": {"login": "Markche1985"},
    "created_at": "2024-10-21T04:23:25Z",
    "html_url": "https://github.com/toeverything/AFFiNE/issues/8559",
    "body": "when export and import workspace, the folder will loss(tag and documents are fine, but no folder)"
  },
  {
    "id": 2478006065,
    "number": 7937,
    "state": "closed",
    "title": "Linux App version bugged - JavaScript errors since last update",
    "user": {"login": "MindHack"},
    "created_at": "2024-08-21T13:09:50Z",
    "html_url": "https://github.com/toeverything/AFFiNE/issues/7937",
    "body": "Hi ! I am using the Linux app in up-to-date Fedora 40. It has ceased to work properly following the last update."
  },
  {
    "id": 2467318206,
    "number": 7881,
    "state": "closed",
    "title": "[bug] Opening Docs in new tabs redirects to app.affine.pro",
    "user": {"login": "compgeniuses"},
    "created_at": "2024-08-15T03:36:26Z",
    "html_url": "https://github.com/toeverything/AFFiNE/issues/7881",
    "body": "when you click the 3 dotted menu on a docs, and chose the option to open in new tab, the link tries to open using app.affine.pro instead of the localhosted instance"
  },
  {
    "id": 2458040625,
    "number": 7822,
    "state": "closed",
    "title": "Linked docs in the sidebar cannot be sorted or ordered",
    "user": {"login": "JimmFly"},
    "created_at": "2024-08-09T14:21:38Z",
    "html_url": "https://github.com/toeverything/AFFiNE/issues/7822",
    "body": "The order of Linked Docs in the sidebar does not match their original order in the article, and it is also not possible to rearrange them by dragging in the sidebar."
  }
];

/**
 * Format a date to a readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Get issue state emoji
 * @param {string} state - Issue state (open/closed)
 * @returns {string} Emoji representation
 */
function getStateEmoji(state) {
  return state === 'open' ? '🐛' : '✅';
}

/**
 * Display issues in a formatted table
 * @param {Array} issues - Array of issue objects
 */
function displayIssues(issues) {
  console.log('📋 Ten Most Recent Bug Issues in toeverything/AFFiNE\n');
  console.log('═'.repeat(100));
  
  issues.forEach((issue, index) => {
    const stateEmoji = getStateEmoji(issue.state);
    const createdDate = formatDate(issue.created_at);
    const title = truncateText(issue.title, 60);
    const author = issue.user.login;
    
    console.log(`${index + 1}. ${stateEmoji} #${issue.number} - ${title}`);
    console.log(`   📅 Created: ${createdDate} | 👤 Author: ${author} | 🏷️ State: ${issue.state}`);
    console.log(`   🔗 ${issue.html_url}`);
    
    if (issue.body) {
      const description = truncateText(issue.body.replace(/\r?\n/g, ' '), 80);
      console.log(`   📝 ${description}`);
    }
    
    console.log('');
  });
  
  console.log('═'.repeat(100));
  console.log(`\n📊 Summary: Found ${issues.length} bug issues`);
  console.log(`🐛 Open: ${issues.filter(issue => issue.state === 'open').length}`);
  console.log(`✅ Closed: ${issues.filter(issue => issue.state === 'closed').length}`);
}

/**
 * Main function
 */
function main() {
  console.log('🔧 Bug Issues Tool (Demo Mode)');
  console.log('Note: This demo uses pre-fetched data from the GitHub API\n');
  
  displayIssues(DEMO_BUG_ISSUES);
  
  console.log('\n💡 To use with live data, you can:');
  console.log('   - Set a GITHUB_TOKEN environment variable');
  console.log('   - Use the full version in index.js');
  console.log('   - Or run: node tools/bug-issues/index.js');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { displayIssues, DEMO_BUG_ISSUES };