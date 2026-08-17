# SkillDocs for Claude Code

Human review for the docs and skills your agent writes. Push a skill up, your
team edits and comments on it in the browser, the agent reads back the diff and
the threads, applies the feedback, replies, and pulls the finished text down.

## Install

```bash
/plugin marketplace add rajivayyangar/skilldocs-plugin
```

```bash
/plugin install skilldocs@skilldocs
```

The first tool call opens a browser to approve access. **There is no token to
paste** — `/mcp` is an OAuth protected resource, so the credential is issued to
the client and never shown to you.

Working in a workspace on its own subdomain, or against a local dev server? Set
**SkillDocs URL** when the plugin asks; it defaults to `https://skilldocs.dev`.

## What you get

A skill, `skilldocs-review`, that fires on "send this for review", "what did
people say about X", "apply the comments" — and four commands for when you'd
rather be explicit:

| Command | Does |
| :-- | :-- |
| `/skilldocs:find [text]` | Find docs by title, section, or your own |
| `/skilldocs:share <file>` | Push a file up, print its URL |
| `/skilldocs:feedback <doc_id>` | The diff and the open threads |
| `/skilldocs:apply <doc_id> <file>` | Edit → reply → resolve → push back |
| `/skilldocs:sync <doc_id> <file>` | Write the doc's text over the local file |

Eight tools underneath: `skilldocs_find`, `skilldocs_open`, `skilldocs_read`,
`skilldocs_diff`, `skilldocs_comments`, `skilldocs_reply`, `skilldocs_resolve`,
`skilldocs_pull`.

A doc you push lands in your own section of the left rail — created from your
first name if it doesn't exist yet.

## Not using Claude Code?

The plugin is only a wrapper — the server is a plain remote MCP endpoint at
`https://skilldocs.dev/mcp` and works in any client that speaks streamable HTTP.
The **⌁ MCP** link in the app's bottom-left has the exact setup for Claude,
Claude Desktop, ChatGPT, Codex and everything else.

## Developing it

No marketplace needed to try changes — clone this repo and run:

```bash
claude --plugin-dir .
```

The MCP server it talks to is hosted at `https://skilldocs.dev/mcp`; this repo
is only the client-side wrapper.
