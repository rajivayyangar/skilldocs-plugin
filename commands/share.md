---
description: Push a markdown file to skilldocs.dev for review and print its URL
argument-hint: <path to a markdown file>
---

Share `$ARGUMENTS` on SkillDocs for human review.

1. Read the file. If `$ARGUMENTS` is empty, ask which file.
2. `skilldocs_open` with its text as `content` and the path as `path`.
3. Print the doc URL and the `doc_id`, then draft a one-line "please review"
   message naming what you actually want looked at — not "here it is".

Follow the skilldocs-review skill for anything beyond this.
