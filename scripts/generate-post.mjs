// Generates ONE article draft with the Claude API and writes it to src/content/posts/.
// Used by .github/workflows/weekly-blog-draft.yml, which opens a Pull Request for review.
// Needs the ANTHROPIC_API_KEY environment variable. Run locally: npm run generate:post
import fs from 'node:fs';
import path from 'node:path';

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';
const postsDir = path.resolve('src/content/posts');
const topicsFile = path.resolve('src/content/topics.json');
const CATEGORIES = ['Vinyasa Flow', 'Pranayama & Breathwork', 'Chakra Healing', 'Mindful Living', 'Yoga Philosophy', 'Beginner Guides'];

if (!process.env.ANTHROPIC_API_KEY) { console.error('ANTHROPIC_API_KEY is not set'); process.exit(1); }

const existing = fs.readdirSync(postsDir).filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(postsDir, f), 'utf8')));
const usedTitles = existing.map((p) => p.title);

// Pick the next topic from the editorial queue (topics.json), else let the model choose a fresh one.
const topics = fs.existsSync(topicsFile) ? JSON.parse(fs.readFileSync(topicsFile, 'utf8')) : [];
const topic = topics.find((t) => !existing.some((p) => p.id === t.id));
const brief = topic
  ? `Topic: ${topic.title}\nCategory: ${topic.category}\nAngle / notes: ${topic.notes || 'none'}`
  : `Choose a fresh topic that is NOT already covered. Already published: ${usedTitles.join(' | ')}. Pick the most useful category among: ${CATEGORIES.join(', ')}.`;

const system = `You are the writer of the journal of Subina Aacharya, a certified RYT-500 yoga instructor and mindfulness mentor from the Kathmandu Valley. Write in English, in a warm, calm, grounded first-person voice. Be accurate and safety-conscious: no medical claims or cures, mention consulting a professional for injuries, pregnancy or health conditions where relevant, and never invent studies, statistics or quotes. Return ONLY a JSON object, no markdown fences.`;

const user = `${brief}

Write a 700-1000 word article. Return JSON with exactly these keys:
{"id": lowercase-hyphen slug (max 60 chars), "title": string, "category": one of ${JSON.stringify(CATEGORIES)}, "excerpt": 1-2 sentences (max 200 chars), "tags": 3-4 short tags, "content": HTML string using only <p class="lead">, <p>, <h3>, <ul><li>, <ol><li>, <strong>, <em>, <blockquote>}
The first paragraph is <p class="lead">. Use 3-5 <h3> sections. No <h1>/<h2>, no images, no links.`;

const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
  body: JSON.stringify({ model: MODEL, max_tokens: 4000, system, messages: [{ role: 'user', content: user }] })
});
if (!res.ok) { console.error('API error', res.status, await res.text()); process.exit(1); }
const data = await res.json();
const text = data.content.map((b) => b.text || '').join('').trim().replace(/^```(?:json)?|```$/g, '');
const gen = JSON.parse(text);

const id = (topic?.id || gen.id).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
if (existing.some((p) => p.id === id)) { console.error(`Article "${id}" already exists`); process.exit(1); }

// Cover images: rotate through the covers already used on the site (no hotlink guessing).
const covers = [...new Set(existing.map((p) => p.coverImage))];
const words = gen.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

const post = {
  id,
  title: gen.title,
  category: CATEGORIES.includes(gen.category) ? gen.category : (topic?.category || 'Mindful Living'),
  excerpt: gen.excerpt,
  readTime: `${Math.max(3, Math.round(words / 200))} min read`,
  date: new Date().toISOString().slice(0, 10),
  author: 'Subina Aacharya',
  featured: false,
  coverImage: topic?.coverImage || covers[existing.length % covers.length],
  tags: gen.tags,
  content: gen.content.trim()
};
fs.writeFileSync(path.join(postsDir, `${id}.json`), JSON.stringify(post, null, 2) + '\n');
console.log(`Draft written: src/content/posts/${id}.json`);
console.log(`::notice::${post.title}`);
fs.writeFileSync(process.env.GITHUB_OUTPUT ? process.env.GITHUB_OUTPUT : '/dev/null', `title=${post.title}\nid=${id}\n`, { flag: 'a' });
