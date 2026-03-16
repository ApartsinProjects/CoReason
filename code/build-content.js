#!/usr/bin/env node
/**
 * AI CoReasoning Lab — Content Build Script
 * =======================================
 * Reads YAML files from content/{lang}/ and compiles them into JS files
 * that can be loaded via <script> tags (file:// compatible).
 *
 * Usage:
 *   node build-content.js          # one-shot build
 *   node build-content.js --watch  # rebuild on changes
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { globSync } = require('glob');

// ── Paths ──────────────────────────────────────────────────────────
const CONTENT_DIR = path.join(__dirname, 'content');
const OUTPUT_DIR = path.join(__dirname, 'client', 'content-compiled');

// Subdirectories whose files become keyed entries (filename → object)
const COLLECTION_DIRS = ['challenges', 'courses', 'prompts', 'instructions', 'subjects'];

// Top-level YAML files whose content is used directly
const SINGLE_FILES = {
  'ui-labels.yaml': 'uiLabels',
  'institutions.yaml': 'institutions',
  'users.yaml': 'users',
  'scenarios.yaml': 'scenarios',
  'mockup-data.yaml': 'mockupData'
};

// ── Helpers ────────────────────────────────────────────────────────

/**
 * Convert a kebab-case filename to a camelCase key for JS output.
 *   'deep-learning-101' → 'deep-learning-101'  (kept as-is for content keys)
 */
function fileKey(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

/**
 * Safely read and parse a YAML file. Returns null on error.
 */
function readYaml(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return yaml.load(raw);
  } catch (err) {
    console.error(`  [WARN] Failed to parse ${filePath}: ${err.message}`);
    return null;
  }
}

// ── Build one language ─────────────────────────────────────────────

function buildLanguage(lang) {
  const langDir = path.join(CONTENT_DIR, lang);
  if (!fs.existsSync(langDir)) return null;

  const result = {};

  // 1. Single-file types
  for (const [filename, propName] of Object.entries(SINGLE_FILES)) {
    const filePath = path.join(langDir, filename);
    if (fs.existsSync(filePath)) {
      const data = readYaml(filePath);
      if (data !== null) {
        result[propName] = data;
      }
    }
  }

  // 2. Collection directories
  for (const dirName of COLLECTION_DIRS) {
    const dirPath = path.join(langDir, dirName);
    if (!fs.existsSync(dirPath)) continue;

    const collection = {};
    // Use globSync to find all .yaml and .yml files in the directory
    const pattern = path.join(dirPath, '*.{yaml,yml}').replace(/\\/g, '/');
    const files = globSync(pattern);

    for (const filePath of files) {
      const key = fileKey(filePath);
      const data = readYaml(filePath);
      if (data !== null) {
        collection[key] = data;
      }
    }

    // Convert directory name to camelCase property name
    result[dirName] = collection;
  }

  return result;
}

// ── Write compiled output ──────────────────────────────────────────

function writeCompiledJS(lang, data) {
  const outPath = path.join(OUTPUT_DIR, `${lang}.js`);
  const json = JSON.stringify(data, null, 2);
  const content = [
    '// Auto-generated \u2014 do not edit. Run: npm run build',
    'window.CONTENT = window.CONTENT || {};',
    `window.CONTENT[${JSON.stringify(lang)}] = ${json};`,
    ''
  ].join('\n');

  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`  \u2713 ${outPath}`);
}

function writeAllJS(languages) {
  const outPath = path.join(OUTPUT_DIR, 'all.js');
  const lines = [
    '// Auto-generated \u2014 do not edit. Run: npm run build',
    '// Aggregates all language bundles into window.CONTENT.',
    'window.CONTENT = window.CONTENT || {};',
    ''
  ];

  for (const lang of languages) {
    const perLangPath = `${lang}.js`;
    // Use document.write to load each language file synchronously
    // This works with file:// protocol and ensures ordering
    lines.push(
      `document.write('<script src="' + (document.currentScript ? document.currentScript.src.replace(/all\\.js$/, '') : 'content-compiled/') + '${perLangPath}"><\\/script>');`
    );
  }
  lines.push('');

  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log(`  \u2713 ${outPath}`);
}

// ── Main build ─────────────────────────────────────────────────────

function build() {
  console.log('Building content...');

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Discover all language directories
  const langDirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  if (langDirs.length === 0) {
    console.log('  No language directories found in content/. Nothing to build.');
    return;
  }

  const builtLanguages = [];

  for (const lang of langDirs) {
    const data = buildLanguage(lang);
    if (data !== null && Object.keys(data).length > 0) {
      writeCompiledJS(lang, data);
      builtLanguages.push(lang);
    } else {
      console.log(`  [SKIP] ${lang}/ — no YAML files found`);
    }
  }

  if (builtLanguages.length > 0) {
    writeAllJS(builtLanguages);
  }

  console.log(`Done. Built ${builtLanguages.length} language(s): ${builtLanguages.join(', ') || '(none)'}`);
}

// ── Watch mode ─────────────────────────────────────────────────────

function watch() {
  console.log('Watching content/ for changes... (Ctrl+C to stop)\n');
  build();

  let debounceTimer = null;
  const rebuildDebounced = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log('\n--- Change detected ---');
      build();
    }, 300);
  };

  // Watch recursively
  fs.watch(CONTENT_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && (filename.endsWith('.yaml') || filename.endsWith('.yml'))) {
      rebuildDebounced();
    }
  });
}

// ── Entry point ────────────────────────────────────────────────────

if (process.argv.includes('--watch')) {
  watch();
} else {
  build();
}
