---
description: Install a skill from SkillDocs into ~/.claude/skills
argument-hint: <skilldocs URL, or a doc_id>
---

Install the SkillDocs skill at `$ARGUMENTS` as a local Claude Code skill.

1. **Get the doc id.** `$ARGUMENTS` is usually a full URL —
   `https://skilldocs.dev/?doc=<title-slug>~<id>`. Take the `doc` parameter
   whole and pass it as `doc_id`; the server parses the id off the end, so the
   slug is harmless. A bare id works too. If `$ARGUMENTS` is empty, ask for the
   URL — don't guess from `skilldocs_find`.

2. **`skilldocs_pull`** for the markdown.

3. **Find the skill name.** It is the `name:` field of the doc's YAML
   frontmatter, lowercased — *not* the title and not the URL slug. That name is
   the whole binding: it's what Claude Code invokes, and what the listener
   reports back so usage lands on this doc.

   No frontmatter, or no `name:`? Then this doc is a document, not a skill.
   Say so and stop — offer `/skilldocs:sync <doc_id> <path>` if they wanted the
   text written somewhere. Do not invent a name; a made-up one silently breaks
   the binding and the usage count goes nowhere.

4. **Write it** to `~/.claude/skills/<name>/SKILL.md`, creating the directory.
   Use the personal directory unless they asked for this project specifically,
   in which case `.claude/skills/<name>/SKILL.md` under the project root.

   If that file already exists, **stop and show the diff first** — a skill
   people have edited locally is not yours to overwrite silently. Ask, then
   write.

5. **Confirm in two lines**: the path you wrote, and that the skill is live in
   the next session (skills load at startup — this one won't see it).

Then, only if `~/.skilldocs-token` does not exist, add one line: `/skilldocs:connect`
makes their usage of it count as verified and turns on notices when the
published version moves ahead of their copy. Don't run it for them, and don't
mention it at all if the token file is already there.

Never write anything outside the skill directory, and never touch
`~/.claude/settings.json` — installing a skill is one file.
