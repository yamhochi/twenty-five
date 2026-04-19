#!/usr/bin/env node
/**
 * sync-posts.mjs
 * Reads posts-meta.md and syncs metadata + headings back to individual post files.
 * Usage:
 *   pnpm sync-posts           — apply changes
 *   pnpm sync-posts --dry-run — preview changes without writing
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const META_FILE = resolve(ROOT, "posts-meta.md");
const DRY_RUN = process.argv.includes("--dry-run");

// ─── Parse posts-meta.md ────────────────────────────────────────────────────

function parseMetaFile(src) {
	const posts = [];

	// Split on horizontal rules, skip the header block
	const sections = src.split(/\n---\n/).slice(1);

	for (const section of sections) {
		const lines = section.trim().split("\n");
		if (!lines.length) continue;

		// First line is `## slug`
		const slugLine = lines.shift().trim();
		if (!slugLine.startsWith("## ")) continue;
		const slug = slugLine.slice(3).trim();

		const fields = {};
		const headings = [];
		let inHeadings = false;

		for (const line of lines) {
			if (line.trim() === "### Headings") {
				inHeadings = true;
				continue;
			}

			if (inHeadings) {
				// Lines like `- ## Heading text` or `- ### Heading text`
				const m = line.match(/^-\s+(#{1,6}\s+.+)$/);
				if (m) headings.push(m[1]);
				continue;
			}

			// key: value pairs
			const kv = line.match(/^([a-zA-Z.]+):\s*(.*)$/);
			if (kv) {
				fields[kv[1].trim()] = kv[2].trim();
			}
		}

		posts.push({ slug, fields, headings });
	}

	return posts;
}

// ─── Frontmatter helpers ─────────────────────────────────────────────────────

function parseFrontmatter(src) {
	const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!m) throw new Error("No frontmatter found");
	return { fm: m[1], body: m[2] };
}

function stripQuotes(s) {
	return s.replace(/^["']|["']$/g, "").trim();
}

function quoteIfNeeded(value) {
	// Already quoted
	if (value.startsWith('"') || value.startsWith("'")) return value;
	// Needs quoting if it contains special YAML chars
	if (/[:#{}\[\]|>&*!@]/.test(value)) {
		return `"${value.replace(/"/g, '\\"')}"`;
	}
	return value;
}

// Get the current raw value of a field from frontmatter (stripped of quotes)
function getFmValue(fm, key) {
	const pattern = new RegExp(`^${escapeRe(key)}:\\s*(.*)$`, "m");
	const m = fm.match(pattern);
	return m ? stripQuotes(m[1]) : null;
}

// Simple YAML line replacer — only writes if value changed
function setFmField(fm, key, newValue) {
	const current = getFmValue(fm, key);
	// Compare stripped values — only update if content differs
	if (current !== null && stripQuotes(newValue) === current) return fm;

	const pattern = new RegExp(`^(${escapeRe(key)}:\\s*).*$`, "m");
	if (pattern.test(fm)) {
		// Preserve quoting style: if original was quoted, keep quoted
		const origLine = fm.match(pattern)[0];
		const origVal = origLine.slice(origLine.indexOf(":") + 1).trim();
		const wasQuoted = origVal.startsWith('"') || origVal.startsWith("'");
		const out = wasQuoted ? `"${newValue.replace(/"/g, '\\"')}"` : quoteIfNeeded(newValue);
		return fm.replace(pattern, `${key}: ${out}`);
	}
	// Field doesn't exist — append
	return fm + `\n${key}: ${quoteIfNeeded(newValue)}`;
}

// Update coverImage block (nested YAML)
function setCoverImageField(fm, subKey, newValue) {
	// Check current value first
	const blockMatch = fm.match(/coverImage:\s*\n((?:\s+\S.*\n?)*)/);
	if (blockMatch) {
		const subPattern = new RegExp(`^(\\s+${escapeRe(subKey)}:\\s*)(.*)$`, "m");
		const subMatch = blockMatch[1].match(subPattern);
		if (subMatch && stripQuotes(subMatch[2]) === stripQuotes(newValue)) return fm;
	}

	const quoted = quoteIfNeeded(newValue);
	const pattern = new RegExp(
		`(coverImage:[\\s\\S]*?)(^\\s+${escapeRe(subKey)}:\\s*).*$`,
		"m",
	);
	if (pattern.test(fm)) {
		return fm.replace(pattern, `$1$2${quoted}`);
	}
	const blockPattern = /^(coverImage:\s*)$/m;
	if (blockPattern.test(fm)) {
		return fm.replace(blockPattern, `$1\n  ${subKey}: ${quoted}`);
	}
	return fm + `\ncoverImage:\n  ${subKey}: ${quoted}`;
}

// Update tags field
function setTagsField(fm, value) {
	const current = getFmValue(fm, "tags");
	// Strip array brackets for comparison
	const currentClean = current ? current.replace(/[\[\]"']/g, "").trim() : null;
	if (currentClean === value) return fm;

	const pattern = /^tags:.*$/m;
	if (pattern.test(fm)) {
		return fm.replace(pattern, `tags: ["${value}"]`);
	}
	return fm + `\ntags: ["${value}"]`;
}

function escapeRe(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Heading sync ─────────────────────────────────────────────────────────────

function syncHeadings(body, newHeadings) {
	if (!newHeadings.length) return body;

	// Collect all heading lines in order (preserving their positions)
	const lines = body.split("\n");
	const headingIndices = [];

	for (let i = 0; i < lines.length; i++) {
		if (/^#{1,6}\s+/.test(lines[i])) {
			headingIndices.push(i);
		}
	}

	if (headingIndices.length !== newHeadings.length) {
		console.warn(
			`  ⚠️  Heading count mismatch: file has ${headingIndices.length}, meta has ${newHeadings.length} — skipping heading sync`,
		);
		return body;
	}

	for (let i = 0; i < headingIndices.length; i++) {
		lines[headingIndices[i]] = newHeadings[i];
	}

	return lines.join("\n");
}

// ─── Sync a single post ───────────────────────────────────────────────────────

function syncPost(post) {
	const filePath = resolve(ROOT, post.fields.file);
	const original = readFileSync(filePath, "utf8");
	let { fm, body } = parseFrontmatter(original);

	const SIMPLE_FIELDS = ["title", "description", "company", "role", "service", "outcome", "publishDate", "theme"];

	for (const field of SIMPLE_FIELDS) {
		if (post.fields[field] !== undefined) {
			fm = setFmField(fm, field, post.fields[field]);
		}
	}

	if (post.fields["tags"] !== undefined) {
		fm = setTagsField(fm, post.fields["tags"]);
	}

	if (post.fields["coverImage.src"] !== undefined) {
		fm = setCoverImageField(fm, "src", post.fields["coverImage.src"]);
	}
	if (post.fields["coverImage.alt"] !== undefined) {
		fm = setCoverImageField(fm, "alt", post.fields["coverImage.alt"]);
	}

	body = syncHeadings(body, post.headings);

	const updated = `---\n${fm}\n---\n${body}`;

	if (updated === original) {
		console.log(`  ✓  ${post.fields.file} — no changes`);
		return;
	}

	if (DRY_RUN) {
		console.log(`  ~  ${post.fields.file} — would update`);
		showDiff(original, updated);
		return;
	}

	writeFileSync(filePath, updated, "utf8");
	console.log(`  ✓  ${post.fields.file} — updated`);
}

function showDiff(original, updated) {
	const a = original.split("\n");
	const b = updated.split("\n");
	const len = Math.max(a.length, b.length);
	for (let i = 0; i < len; i++) {
		if (a[i] !== b[i]) {
			if (a[i] !== undefined) console.log(`    - ${a[i]}`);
			if (b[i] !== undefined) console.log(`    + ${b[i]}`);
		}
	}
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const src = readFileSync(META_FILE, "utf8");
const posts = parseMetaFile(src);

console.log(`\nsyncing ${posts.length} posts${DRY_RUN ? " (dry run)" : ""}...\n`);

for (const post of posts) {
	try {
		syncPost(post);
	} catch (err) {
		console.error(`  ✗  ${post.slug} — ${err.message}`);
	}
}

console.log("\ndone.\n");
