---
description: Write a SkillDocs doc's current text over a local file
argument-hint: <doc_id> <path to the local file>
---

Pull SkillDocs doc `$ARGUMENTS` down over the local file.

1. `skilldocs_pull` for the doc's current markdown.
2. If the local file has uncommitted changes of its own, show the diff and
   confirm before overwriting — this replaces the file wholesale.
3. Write it.

If `$ARGUMENTS` doesn't name both the doc and the file, ask.
