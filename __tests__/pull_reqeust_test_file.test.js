/**
 * Repository meta tests for Pull Request template(s).
 *
 * Testing library/framework: Jest-compatible API (Jest or Vitest).
 * - Uses describe/it/expect which are supported by Jest and largely compatible with Vitest.
 * - No new dependencies added.
 *
 * These tests validate that PR templates exist and follow basic structural expectations.
 * They provide useful value even when no application code is directly under test.
 */

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

function safeStat(p) {
  try {
    return fs.statSync(p);
  } catch {
    return null;
  }
}

function listMarkdownFilesInDir(dirPath) {
  const st = safeStat(dirPath);
  if (!st || !st.isDirectory()) {
    return [];
  }
  return fs
    .readdirSync(dirPath)
    .map((entry) => path.join(dirPath, entry))
    .filter((p) => {
      const s = safeStat(p);
      return s && s.isFile() && /\.md$/i.test(p);
    });
}

/**
 * Find PR template files in common GitHub-supported locations:
 * - .github/pull_request_template.md
 * - .github/PULL_REQUEST_TEMPLATE.md
 * - .github/PULL_REQUEST_TEMPLATE/*.md
 * - PULL_REQUEST_TEMPLATE.md (repo root)
 * - PULL_REQUEST_TEMPLATE/*.md (repo root)
 * - Any file in .github containing 'pull_request' in its name with .md extension
 */
function findPRTemplatePaths(rootDir) {
  const candidates = [
    path.join(rootDir, ".github", "pull_request_template.md"),
    path.join(rootDir, ".github", "PULL_REQUEST_TEMPLATE.md"),
    path.join(rootDir, "PULL_REQUEST_TEMPLATE.md"),
  ];

  const results = [];

  for (const p of candidates) {
    const st = safeStat(p);
    if (st && st.isFile()) results.push(p);
  }

  // Directories containing multiple templates
  const multiDirs = [
    path.join(rootDir, ".github", "PULL_REQUEST_TEMPLATE"),
    path.join(rootDir, "PULL_REQUEST_TEMPLATE"),
  ];
  for (const d of multiDirs) {
    for (const file of listMarkdownFilesInDir(d)) {
      results.push(file);
    }
  }

  // Any .md in .github that matches pull_request pattern
  const ghDir = path.join(rootDir, ".github");
  const ghStat = safeStat(ghDir);
  if (ghStat && ghStat.isDirectory()) {
    for (const entry of fs.readdirSync(ghDir)) {
      if (/pull_request.*\.md/i.test(entry)) {
        const p = path.join(ghDir, entry);
        const sp = safeStat(p);
        if (sp && sp.isFile()) results.push(p);
      }
    }
  }

  // De-duplicate
  return Array.from(new Set(results));
}

describe("Pull request template(s) presence and structure", () => {
  const templates = findPRTemplatePaths(repoRoot);

  it("should have at least one PR template present", () => {
    expect(templates.length).toBeGreaterThan(0);
  });

  describe.each(templates)("Template validations for %s", (templatePath) => {
    let content = "";
    let lines = [];
    let filename = path.basename(templatePath);

    beforeAll(() => {
      content = fs.readFileSync(templatePath, "utf8");
      lines = content.split(/\r?\n/);
    });

    it("is a Markdown file", () => {
      expect(/\.md$/i.test(filename)).toBe(true);
    });

    it("is not empty and has meaningful length", () => {
      expect(content.trim().length).toBeGreaterThan(30);
    });

    it("contains at least one Markdown heading (e.g., ## Summary)", () => {
      const hasHeading = /^\s*#{1,6}\s+\S+/m.test(content);
      expect(hasHeading).toBe(true);
    });

    it("contains checkboxes or typical PR sections", () => {
      const hasCheckbox = /- \[[ xX]\]/.test(content);
      const hasCommonSections = /(summary|description|motivation|changes|testing|tests|checklist|screenshots?|breaking changes|related issues|risk|security|documentation)/i.test(
        content
      );
      expect(hasCheckbox || hasCommonSections).toBe(true);
    });

    it("does not contain obvious placeholder lorem text", () => {
      // Avoid false positives: allow TODO comments; only reject lorem ipsum style placeholder.
      expect(/lorem ipsum/i.test(content)).toBe(false);
    });

    it("does not contain excessively long lines (> 300 chars)", () => {
      const longLines = lines.filter((l) => l.length > 300);
      expect(longLines.length).toBe(0);
    });
  });
});