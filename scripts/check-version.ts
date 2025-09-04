#!/usr/bin/env ts-node

const fs = require('fs');
const { execSync } = require('child_process');

interface PackageJson {
  version: string;
  [key: string]: any;
}

/**
 * Check if package.json version matches the latest git tag
 */
function checkVersionSync(): void {
  try {
    // Read package.json version
    const packageJson: PackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const packageVersion = packageJson.version;
    
    // Get latest git tag
    let latestTag: string;
    try {
      const tagOutput = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' });
      latestTag = tagOutput.trim().replace(/^v/, ''); // Remove 'v' prefix
    } catch (error) {
      // No tags exist yet
      latestTag = '0.0.0';
    }
    
    console.log(`📦 Package.json version: ${packageVersion}`);
    console.log(`🏷️  Latest git tag: v${latestTag}`);
    
    if (packageVersion !== latestTag) {
      console.error('❌ Version mismatch detected!');
      console.error(`   Package.json: ${packageVersion}`);
      console.error(`   Latest tag:   v${latestTag}`);
      console.error('');
      console.error('💡 To fix this:');
      console.error('   1. Update package.json to match the latest tag, OR');
      console.error('   2. Create a new tag that matches package.json');
      console.error('');
      console.error('   Examples:');
      console.error(`   git tag v${packageVersion}  # Create tag from package.json`);
      console.error(`   npm version patch         # Update package.json and create tag`);
      process.exit(1);
    }
    
    console.log('✅ Version sync check passed!');
    
  } catch (error) {
    console.error('❌ Error checking version sync:', (error as Error).message);
    process.exit(1);
  }
}

checkVersionSync();
