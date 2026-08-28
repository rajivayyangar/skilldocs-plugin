---
description: Connect the skill listener — your skill usage counts as verified on skilldocs.dev
---

Set up this person's SkillDocs listener credential.

1. `skilldocs_listener_token` — the first call may open a browser sign-in.
2. Write the token line (just the token, one line, trailing newline fine) to
   `~/.skilldocs-token` and `chmod 600` it. Overwrite any existing file.
3. NEVER print, quote, or log the token — not in chat, not in a command echo.
   Write it with a redirect or a file-write tool, not by displaying it first.
4. Confirm with one line: the listener is connected, counting starts with the
   next Claude Code session, and `SKILLDOCS_LISTENER=off` turns it off.

If the tool reports no signed-in identity, tell them to run any SkillDocs
tool once to trigger the OAuth sign-in, then run /skilldocs:connect again.
