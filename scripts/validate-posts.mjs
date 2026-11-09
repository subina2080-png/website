// Validates every article in src/content/posts/. Run: npm run validate:posts
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('src/content/posts');
const CATEGORIES = ['Vinyasa Flow', 'Pranayama & Breathwork', 'Chakra Healing', 'Mindful Living', 'Yoga Philosophy', 'Beginner Guides'];
const required = ['id', 'title', 'category', 'excerpt', 'readTime', 'date', 'author', 'coverImage', 'tags', 'content'];
let errors = 0;
const ids = new Set();

for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const fail = (msg) => { console.error(`✗ ${f}: ${msg}`); errors++; };
  let p;
  try { p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { fail('invalid JSON'); continue; }
  for (const k of required) if (p[k] === undefined || p[k] === '') fail(`missing "${k}"`);
  if (p.id !== f.replace('.json', '')) fail('"id" must equal the file name');
  if (!/^[a-z0-9-]+$/.test(p.id || '')) fail('"id" must be a lowercase-hyphen slug');
  if (ids.has(p.id)) fail('duplicate id'); ids.add(p.id);
  if (!CATEGORIES.includes(p.category)) fail(`unknown category "${p.category}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date || '')) fail('"date" must be YYYY-MM-DD');
  if (!Array.isArray(p.tags) || !p.tags.length) fail('"tags" must be a non-empty array');
  if (/<script|onerror=|onclick=|javascript:/i.test(p.content || '')) fail('content contains disallowed HTML');
}
if (errors) { console.error(`\n${errors} problem(s) found.`); process.exit(1); }
console.log(`✓ ${ids.size} article(s) valid`);
