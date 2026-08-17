---
name: skilldocs-review
description: Send a local markdown file (a skill, doc or spec) to skilldocs.dev for human review, then read back and apply the comments. Use when asked to share a doc for review, put a skill in front of the team, check what people said about a doc, or apply review feedback.
---

# The SkillDocs review loop

skilldocs.dev is a collaborative markdown editor. The loop is: push a local
file up → humans edit it and leave comments anchored to the text they quote →
read back the diff and the threads → apply → reply → resolve.

These tools never touch your disk. You do the reading and writing with your own
tools; the tools here move text and comments between here and the doc.

## Share a file for review

1. Read the file.
2. `skilldocs_open` with its text as `content` and its path as `path`. The path
   is provenance only — it is displayed, never opened.

   A new doc is filed under the pusher's own section in the left rail, created
   if it doesn't exist yet. Pass `section` to put it somewhere else ("Growth"),
   or `section: ""` to leave it in the plain Docs list. Re-pushing an existing
   doc never moves it — if a human has filed it somewhere, it stays there.
3. Give the person the URL that comes back, and **say what you want reviewed**.
   "Here it is" wastes the round trip; "I'm unsure about the escalation rule in
   step 3" gets you an answer.

Creating a doc snapshots that first push as the version baseline automatically.
Later pushes do not re-baseline, which is what makes `skilldocs_diff` keep
showing everything collaborators changed since the start rather than just since
your last push.

Keep the `doc_id` for the rest of the session.

## Read the feedback

- `skilldocs_diff` — what collaborators changed in the text.
- `skilldocs_comments` — the open threads, each quoting the text it is anchored
  to. Resolved threads are hidden unless you ask for them.

Report both. A thread quoting text that the diff already shows changed usually
means the person edited *and* explained — don't re-apply an edit that has
already landed.

## Apply the feedback

For each open thread:

1. Make the edit locally.
2. `skilldocs_reply` saying specifically what you changed. "Done" is useless six
   weeks later; "moved the escalation rule above the triage step so it can't be
   skipped" is the record.
3. `skilldocs_resolve`.

Never resolve a thread you did not act on. If you disagree, reply saying why and
leave it open — that is a conversation, not a task.

When the local file reflects the feedback, `skilldocs_open` it again with the
same `doc_id` so the doc and the repo agree. After that the diff shows your
changes alongside the humans', both measured against the original baseline —
say so, rather than reporting your own edits back as new feedback.

## Pull the collaborated text down

`skilldocs_pull` returns the doc's current markdown and nothing else. Write it
over the local file. If the local file has changes of its own, show the diff
before overwriting.

## Finding a doc

`skilldocs_find` is how you turn "the triage skill" or "my folder" into a
`doc_id`. Search titles with `query`, narrow to a section with `section`, or
pass `mine: true` for the docs this account last touched.

Call it with **no arguments** to see every section and what is filed under
each. Do that before guessing at a section name — "my folder" is a section, and
the list tells you what it's actually called.

Doc ids also come back from `skilldocs_open`. Never guess one: pushing to a
guessed id splices your text into somebody else's document.

## Signing in

The first call opens a browser to approve access, and there is nothing to paste.
If a call fails saying authorization is required, tell the person to complete
that browser step; don't try to work around it.
