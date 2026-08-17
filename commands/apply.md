---
description: Work the open comment threads on a SkillDocs doc — edit, reply, resolve, push back
argument-hint: <doc_id> [path to the local file]
---

Apply the SkillDocs feedback on `$ARGUMENTS`.

For each open thread: make the edit locally, `skilldocs_reply` describing
specifically what you changed, then `skilldocs_resolve`. Leave a thread open and
reply saying why if you disagree with it — never resolve one you didn't act on.

When the file reflects the feedback, `skilldocs_open` with the same `doc_id` to
push it back so the doc and the repo agree.

Follow the skilldocs-review skill. If `$ARGUMENTS` doesn't name both the doc and
the local file, ask.
