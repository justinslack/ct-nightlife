#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { geocodeAddressWithFallback } from '../src/lib/geocoding.js';

interface FrontMatter {
  title: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  slug?: string;
  date?: string;
  neighborhood?: string;
  decades?: string[];
  status?: string;
  tags?: string[];
  start_year?: number;
  end_year?: number;
  cover_image?: string;
  gallery?: string[];
  description?: string;
  notable_events?: Array<{
    year: number;
    title: string;
    description: string;
  }>;
  sources?: Array<{
    title: string;
    url: string;
  }>;
  contributor?: string;
  last_updated?: string;
}

const contentDirectory = path.join(process.cwd(), 'src', 'content', 'documents');

/**
 * Check if a location object has valid coordinates
 */
function hasValidCoordinates(location?: { lat: number; lng: number }): boolean {
  return !!(location && 
    location.lat != null && 
    location.lng != null && 
    location.lat !== 0 && 
    location.lng !== 0);
}

/**
 * Process a single MDX file
 */
async function processFile(filePath: string): Promise<boolean> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    const typedFrontmatter = frontmatter as FrontMatter;

    // Skip if no address or address is empty
    if (!typedFrontmatter.address || typedFrontmatter.address.trim() === '') {
      console.log(`⏭️  Skipping ${path.basename(filePath)}: No address found`);
      return false;
    }

    // Skip if already has valid coordinates
    if (hasValidCoordinates(typedFrontmatter.location)) {
      console.log(`⏭️  Skipping ${path.basename(filePath)}: Already has valid coordinates`);
      return false;
    }

    console.log(`🔍 Geocoding "${typedFrontmatter.address}" for ${path.basename(filePath)}...`);

    // Geocode the address
    const result = await geocodeAddressWithFallback(typedFrontmatter.address);

    if (!result) {
      console.log(`❌ Failed to geocode address for ${path.basename(filePath)}`);
      return false;
    }

    // Update the frontmatter
    typedFrontmatter.location = {
      lat: result.lat,
      lng: result.lng,
    };

    // Optionally update the address with the formatted address from geocoding
    if (result.formatted_address && result.formatted_address !== typedFrontmatter.address) {
      console.log(`📍 Updated address format: ${result.formatted_address}`);
      // Uncomment the next line if you want to update the address with the formatted version
      // typedFrontmatter.address = result.formatted_address;
    }

    // Reconstruct the file content
    const updatedContent = matter.stringify(content, typedFrontmatter);

    // Write back to file
    fs.writeFileSync(filePath, updatedContent, 'utf8');

    console.log(`✅ Updated ${path.basename(filePath)} with coordinates: ${result.lat}, ${result.lng}`);
    return true;

  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, error);
    return false;
  }
}

/**
 * Process all MDX files in the documents directory
 */
async function processAllFiles(): Promise<void> {
  try {
    const files = fs.readdirSync(contentDirectory);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    console.log(`📂 Found ${mdxFiles.length} MDX files to process...\n`);

    let processed = 0;
    let updated = 0;

    for (const file of mdxFiles) {
      const filePath = path.join(contentDirectory, file);
      const wasUpdated = await processFile(filePath);
      
      processed++;
      if (wasUpdated) {
        updated++;
      }

      // Add a small delay to be respectful to geocoding APIs
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Processed: ${processed} files`);
    console.log(`   Updated: ${updated} files`);
    console.log(`   Skipped: ${processed - updated} files`);

  } catch (error) {
    console.error('❌ Error processing files:', error);
    process.exit(1);
  }
}

/**
 * Process a specific file by name
 */
async function processSpecificFile(fileName: string): Promise<void> {
  const filePath = path.join(contentDirectory, fileName.endsWith('.mdx') ? fileName : `${fileName}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`📂 Processing specific file: ${fileName}\n`);
  await processFile(filePath);
}

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Process specific file
    const fileName = args[0];
    await processSpecificFile(fileName);
  } else {
    // Process all files
    await processAllFiles();
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 