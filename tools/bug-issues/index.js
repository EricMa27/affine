#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Tool to list the ten most recent bug issues from the toeverything/AFFiNE repository
 */

// Configuration
const OWNER = 'toeverything';
const REPO = 'AFFiNE';
const BUG_LABEL = 'Bug';
const LIMIT = 10;

/**
 * Make a request to GitHub API using fetch
 * @param {string} url - API endpoint URL
 * @returns {Promise<any>} Response data
 */
async function githubApiRequest(url) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AFFiNE-Bug-Issues-Tool',
    };

    // Add GitHub token if available
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(`Rate limit exceeded. Please set GITHUB_TOKEN environment variable or try again later.`);
      }
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`GitHub API request failed: ${error.message}`);
  }
}

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
 * Fetch the most recent bug issues
 * @returns {Promise<Array>} Array of issue objects
 */
async function fetchBugIssues() {
  try {
    console.log(`Fetching the ${LIMIT} most recent bug issues from ${OWNER}/${REPO}...\n`);
    
    // GitHub API endpoint for issues with label filter
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/issues?labels=${encodeURIComponent(BUG_LABEL)}&state=all&sort=created&direction=desc&per_page=${LIMIT}`;
    
    const issues = await githubApiRequest(url);
    
    return issues;
  } catch (error) {
    console.error('Error fetching issues:', error.message);
    process.exit(1);
  }
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
async function main() {
  try {
    const issues = await fetchBugIssues();
    
    if (issues.length === 0) {
      console.log('No bug issues found.');
      return;
    }
    
    displayIssues(issues);
  } catch (error) {
    console.error('An unexpected error occurred:', error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fetchBugIssues, displayIssues };