#!/usr/bin/env node

/**
 * Branch name validation script
 * Validates that branch names follow the required pattern:
 * - Must start with: feature/, fix/, hotfix/, or release/
 * - Followed by lowercase letters, numbers, dots, underscores, or hyphens
 * - Pattern: ^(feature|fix|hotfix|release)\/[a-z0-9._-]+$
 */

const { execSync } = require('child_process');

function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('❌ Error getting current branch:', error.message);
    process.exit(1);
  }
}

function validateBranchName(branchName) {
  // Skip validation for main/master branches
  if (branchName === 'main' || branchName === 'master') {
    return { valid: true, message: 'Main branch - skipping validation' };
  }

  // Check if branch name matches the required pattern
  const pattern = /^(feature|fix|hotfix|release)\/[a-z0-9._-]+$/;
  
  if (!pattern.test(branchName)) {
    return {
      valid: false,
      message: `Branch name '${branchName}' is invalid.\n` +
               `Allowed patterns:\n` +
               `  • feature/description (e.g., feature/user-authentication)\n` +
               `  • fix/description (e.g., fix/login-bug)\n` +
               `  • hotfix/description (e.g., hotfix/security-patch)\n` +
               `  • release/version (e.g., release/v1.2.0)\n\n` +
               `Rules:\n` +
               `  • Use lowercase letters, numbers, dots, underscores, or hyphens\n` +
               `  • No spaces or uppercase letters allowed`
    };
  }

  return { valid: true, message: `Branch name '${branchName}' is valid.` };
}

function main() {
  const branchName = getCurrentBranch();
  const validation = validateBranchName(branchName);

  if (validation.valid) {
    console.log(`✅ ${validation.message}`);
    process.exit(0);
  } else {
    console.error(`❌ ${validation.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateBranchName, getCurrentBranch };
