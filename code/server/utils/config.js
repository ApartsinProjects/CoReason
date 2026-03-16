'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function resolveEnvVars(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/\$\{(\w+)\}/g, (_, name) => process.env[name] || '');
  }
  if (Array.isArray(obj)) return obj.map(resolveEnvVars);
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = resolveEnvVars(v);
    }
    return result;
  }
  return obj;
}

function loadConfig() {
  const configDir = path.resolve(__dirname, '../config');
  const env = process.env.NODE_ENV || 'development';

  // Load default config
  const defaultPath = path.join(configDir, 'default.yaml');
  let config = yaml.load(fs.readFileSync(defaultPath, 'utf8'));

  // Merge environment-specific config
  const envFiles = [
    path.join(configDir, `${env}.yaml`),
    path.join(configDir, 'local.yaml'),  // Always highest priority, gitignored
  ];

  for (const filePath of envFiles) {
    if (fs.existsSync(filePath)) {
      const override = yaml.load(fs.readFileSync(filePath, 'utf8'));
      if (override) {
        config = deepMerge(config, override);
      }
    }
  }

  // Resolve environment variable placeholders
  config = resolveEnvVars(config);

  return config;
}

module.exports = { loadConfig, deepMerge, resolveEnvVars };
