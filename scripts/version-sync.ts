#!/usr/bin/env ts-node

const fs = require('fs');
const { execSync } = require('child_process');

interface PackageJson {
  version: string;
  [key: string]: any;
}

/**
 * Sync package.json version with git tags
 */
function syncVersion(): void {
  try {
    // Read package.json
    const packageJson: PackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const packageVersion = packageJson.version;
    
    // Get latest git tag
    let latestTag: string;
    try {
      const tagOutput = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' });
      latestTag = tagOutput.trim().replace(/^v/, '');
    } catch (error) {
      latestTag = '0.0.0';
    }
    
    console.log(`📦 Package.json version: ${packageVersion}`);
    console.log(`🏷️  Latest git tag: v${latestTag}`);
    
    if (packageVersion === latestTag) {
      console.log('✅ Versions are already in sync!');
      return;
    }
    
    // Determine which version is newer
    const packageParts = packageVersion.split('.').map(Number);
    const tagParts = latestTag.split('.').map(Number);
    
    let packageIsNewer = false;
    for (let i = 0; i < 3; i++) {
      if (packageParts[i] > tagParts[i]) {
        packageIsNewer = true;
        break;
      } else if (packageParts[i] < tagParts[i]) {
        break;
      }
    }
    
    if (packageIsNewer) {
      console.log('📦 Package.json is newer than git tag');
      console.log(`🏷️  Creating new tag: v${packageVersion}`);
      
      // Create new tag
      execSync(`git tag v${packageVersion}`, { stdio: 'inherit' });
      console.log('✅ New tag created successfully!');
      console.log('💡 Remember to push the tag: git push origin v' + packageVersion);
    } else {
      console.log('🏷️  Git tag is newer than package.json');
      console.log(`📦 Updating package.json to: ${latestTag}`);
      
      // Update package.json
      packageJson.version = latestTag;
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
      console.log('✅ Package.json updated successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error syncing versions:', (error as Error).message);
    process.exit(1);
  }
}

syncVersion();
