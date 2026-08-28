#!/usr/bin/env node
/* GENERATED FILE — do not edit.
 * Built from the canonical listener, served at https://skilldocs.dev/listener.mjs
 * (SkillDocs source: app/public/listener.mjs · node app/scripts/build-plugin-hook.mjs).
 * An edit here is lost on the next build, and the served copy would keep the
 * old behaviour anyway.
 */
/*
 * SkillDocs skill listener — internal telemetry for skilldocs.dev.
 * Fires on Claude Code's PostToolUse hook (matcher: Skill) and reports which
 * skill was invoked, so the team can see which skills are actually used.
 *
 * Sends ONLY: the skill name, the repo it ran in (origin remote), who, a
 * timestamp, and a content hash of the local skill file (so SkillDocs can
 * tell you when a newer published version exists). No prompts, no arguments,
 * no file contents.
 *
 * When the server answers that the skill has a newer published version, the
 * hook surfaces one short note into the session — at most twice per version,
 * tracked in ~/.claude/skilldocs-notices.json. Updating is always yours to
 * do; nothing here ever writes a skill file.
 *
 * Who is determined two ways:
 *   - A SkillDocs token (~/.skilldocs-token or SKILLDOCS_TOKEN), if you have
 *     connected to SkillDocs — your counts show as verified.
 *   - Otherwise your git email (git config user.email) — counted, marked
 *     unverified. No setup needed.
 *
 * Opt out any time: export SKILLDOCS_LISTENER=off
 * Every path is wrapped and always exits 0 — this can never break a session.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const NOTICES_PER_VERSION = 2;

try {
  if (process.env.SKILLDOCS_LISTENER === 'off') process.exit(0);

  const input = JSON.parse(readFileSync(0, 'utf8'));
  const skill = String(input?.tool_input?.skill || '').slice(0, 100);
  if (!skill) process.exit(0);

  const cwd = input.cwd || process.cwd();
  const git = (args) => {
    try {
      return execFileSync('git', args, { cwd, timeout: 1500, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch { return ''; }
  };

  let repo = '';
  const m = git(['remote', 'get-url', 'origin']).match(/[:/]([\w.-]+\/[\w.-]+?)(?:\.git)?$/);
  if (m) repo = m[1];

  // Hash the local skill file so the server can compare it to the latest
  // published version. Plain names only — plugin skills (`a:b`) have no
  // local file of ours to hash.
  let hash = '';
  if (/^[\w-]+$/.test(skill)) {
    for (const dir of [join(cwd, '.claude', 'skills'), join(homedir(), '.claude', 'skills')]) {
      try {
        hash = createHash('sha256').update(readFileSync(join(dir, skill, 'SKILL.md'))).digest('hex');
        break;
      } catch { /* try the next location */ }
    }
  }

  let token = process.env.SKILLDOCS_TOKEN || '';
  if (!token) {
    try { token = readFileSync(join(homedir(), '.skilldocs-token'), 'utf8').trim(); } catch { /* no token */ }
  }
  const email = token ? '' : git(['config', 'user.email']).toLowerCase();
  if (!token && !email) process.exit(0);   // nothing to identify by — stay silent

  const base = process.env.SKILLDOCS_URL || 'https://skilldocs.dev';
  const r = await fetch(base + '/api/events', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ event: 'skill_used', props: { skill, repo, ...(hash ? { hash } : {}), ...(email ? { email } : {}) } }),
    signal: AbortSignal.timeout(2500),
  });

  // Newer published version? Say so — at most twice per version, then quiet
  // until the next one. The note goes to Claude as context, not a popup.
  const info = (await r.json().catch(() => null))?.skill;
  if (info?.stale && info.latest?.n) {
    const stateFile = join(homedir(), '.claude', 'skilldocs-notices.json');
    let state = {};
    try { state = JSON.parse(readFileSync(stateFile, 'utf8')); } catch { /* first notice ever */ }
    const key = `${info.doc}@${info.latest.n}`;
    const seen = Number(state[key]) || 0;
    if (seen < NOTICES_PER_VERSION) {
      state[key] = seen + 1;
      try { writeFileSync(stateFile, JSON.stringify(state)); } catch { /* notice still worth showing */ }
      const v = info.latest.label ? `"${info.latest.label}"` : `v${info.latest.n}`;
      console.log(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `SkillDocs: the "${skill}" skill you just used has a newer published version (${v}) than the local copy — see ${info.url}. At a natural moment, briefly let the user know an update is available and that you can apply it if they want. Mention it once; don't interrupt the current task.`,
        },
      }));
    }
  }
} catch { /* telemetry must never break a session */ }
process.exit(0);
