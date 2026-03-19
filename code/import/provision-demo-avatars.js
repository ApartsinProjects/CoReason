'use strict';

/**
 * Provision avatar images for demo users.
 * Generates simple SVG avatars and saves them to client/uploads/avatars/,
 * then updates the database records.
 *
 * Usage: node import/provision-demo-avatars.js
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.all'), override: true });

const { loadConfig } = require('../server/utils/config');
const config = loadConfig();
const db = require('../server/db/knexfile').createKnex(config);

const avatarDir = path.resolve(__dirname, '../client/uploads/avatars');

// Demo users to provision avatars for (mix of roles & languages)
const DEMO_AVATARS = [
  { email: 'noa.cohen@tau.ac.il',        name: 'Noa Cohen',         bg: '#4CAF50', fg: '#fff' },
  { email: 'maria.garcia@mit.edu',        name: 'Maria Garcia',      bg: '#2196F3', fg: '#fff' },
  { email: 'dr.levy@tau.ac.il',           name: 'Dr. Sarah Levy',    bg: '#9C27B0', fg: '#fff' },
  { email: 'prof.chen@mit.edu',           name: 'Prof. Wei Chen',    bg: '#FF5722', fg: '#fff' },
  { email: 'noa.cohen.he@tau.ac.il',      name: 'נועה כהן',          bg: '#00BCD4', fg: '#fff' },
  { email: 'dr.levy.he@tau.ac.il',        name: 'ד״ר שרה לוי',       bg: '#E91E63', fg: '#fff' },
];

function getInitials(name) {
  // Handle Hebrew names: take first char of each word
  return name
    .replace(/^(Dr\.|Prof\.|ד״ר|פרופ׳)\s*/i, '')
    .split(/\s+/)
    .map(w => w[0] || '')
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function generateSvgAvatar(initials, bgColor, fgColor) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="64" fill="${bgColor}"/>
  <text x="64" y="64" dy="0.35em" text-anchor="middle"
        font-family="Arial, sans-serif" font-size="48" font-weight="700"
        fill="${fgColor}">${initials}</text>
</svg>`;
}

async function main() {
  // Ensure avatar directory exists
  if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
  }

  console.log('Provisioning demo avatars...\n');
  let updated = 0;

  for (const demo of DEMO_AVATARS) {
    const user = await db('users').where({ email: demo.email }).first();
    if (!user) {
      console.log(`  SKIP: User not found: ${demo.email}`);
      continue;
    }

    const initials = getInitials(demo.name);
    const svg = generateSvgAvatar(initials, demo.bg, demo.fg);
    const filename = `${user.id}-demo.svg`;
    const filePath = path.join(avatarDir, filename);
    const imageUrl = `/uploads/avatars/${filename}`;

    // Write SVG file
    fs.writeFileSync(filePath, svg, 'utf8');

    // Update database
    await db('users').where({ id: user.id }).update({
      profile_image: imageUrl,
      updated_at: new Date().toISOString(),
    });

    console.log(`  OK: ${demo.email} -> ${filename} (${initials})`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated} users.`);
  await db.destroy();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
