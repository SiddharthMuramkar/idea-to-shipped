---
title: Calling a model: what's underneath
slug: calling-a-model
summary: Calling Claude is an ordinary API call, and an agent is typically that call in a loop.
image: /images/lessons/calling-a-model.jpg
imageAlt: A huge white radio dish of the Deep Space Network points up at a clear blue sky above green hills.
---

## One call to the model

In [How coding agents work](/learn/how-agents-work), Claude Code ran tools for the model. But what does that look like in code? Say you're building a booking site for a yoga studio, the **practice project** in this library's Skills lessons. You want it to answer: "Which class on Monday has space?"

**Calling Claude is an ordinary API call, and an agent is typically that call in a loop.**

An **API** is how one program asks another for something: here, your code asks Anthropic's servers for Claude's reply.

**Anthropic** is the company that makes Claude. Its **SDK**, a package of ready-made code for calling a service from your programming language, installs for Python with `pip install anthropic`. One call sends your messages and gets Claude's reply back. `client` talks to Anthropic and `model` picks which Claude. Each message has a `role` (who speaks) and `content` (what they said):

```python
from anthropic import Anthropic

client = Anthropic()
message = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,  # the most tokens (word-sized chunks of text) Claude may write in one reply
    messages=[{"role": "user", "content": "Which class on Monday has space?"}],
)
```

To carry on a conversation, your code sends the whole list of messages with every call.

```checkpoint quick-1
You're about to send Claude the second message of a conversation. What does your code send?
- [x] The whole list of messages, including the first one.
- [ ] Only the new message, because Claude remembers the first.
- [ ] A conversation id, so the API can look up the first.
Why: To carry on a conversation, your code sends the whole list of messages with every call, the first message included.
```

## The API key stays on the server

`Anthropic()` reads your **API key**, the secret that proves the call is yours. It finds the key in the `ANTHROPIC_API_KEY` **environment variable**, a named setting your computer passes to programs. Treat the key like a credit card number: whoever has it runs up charges on your account.

```checkpoint quick-2
You paste your API key into a public chat by mistake. What can a stranger do with it?
- [x] Make calls that run up charges on your account.
- [ ] Read the code in your private repos.
- [ ] Nothing, because the key only works on your computer.
Why: Treat the key like a credit card number: whoever has it runs up charges on your account. So a key out in public can cost you money.
```

So it lives in an environment variable on the server, never in the browser and never in a file you commit to Git.

Anthropic's SDK for **TypeScript**, a language often used for websites, refuses to run in a web browser by default, so the key isn't exposed.

```checkpoint quick-3
You try Anthropic's TypeScript SDK in a web page, with its default settings. What happens?
- [x] It refuses to run, so the key isn't exposed.
- [ ] It runs, and hides the key from the page's visitors.
- [ ] It runs, and sends the call through your backend.
Why: Anthropic's SDK for TypeScript refuses to run in a web browser by default. That way the key isn't exposed.
```

So on the yoga-studio site, the call belongs in the **backend**, the part that runs on a server. It doesn't go in the website code that runs in visitors' browsers.

## A tool call

Claude can't see your database, so you give it a [tool](/learn/how-agents-work): a function in your code. You describe it with a name, a description and a **JSON Schema**. That's a description of the shape some data must have, written in JSON, a common text format for data.

```checkpoint quick-4
A member asks which class has space, and the answer is in your database. How can Claude find out?
- [x] You give it a tool, a function in your code.
- [ ] It reads the database, once it has the address.
- [ ] You raise `max_tokens`, so it has room to look.
Why: Claude can't see your database. A tool, a function in your code, is how it gets at that data.
```

Claude never runs anything itself. A **tool call** is Claude asking your code to run a tool, then getting the output.

```checkpoint quick-5
You've given Claude a `list_classes` tool, and it wants to use it. What does it do?
- [x] It asks your code to run the tool, then gets the output.
- [ ] It runs the tool itself, then writes the output in its reply.
- [ ] It asks Anthropic to run the tool, then reads the output.
Why: Claude never runs anything itself. A tool call is Claude asking your code to run a tool, then getting the output.
```

For example, with a `list_classes` function:

```
Claude's reply:
  stop_reason: "tool_use"
  content: [{"type": "tool_use", "id": "abc123", "name": "list_classes", "input": {"day": "Monday"}}]

Your code's next message:
  content: [{"type": "tool_result", "tool_use_id": "abc123", "content": "...the tool's output..."}]
```

- **`stop_reason`** is the reply field saying why Claude stopped.
- **`tool_use`** is the block in the reply's `content` list where Claude asks for a tool: its name, an `id` and the input.
- **`tool_result`** is the block carrying the output back to Claude, with the same id.

```checkpoint quick-6
Your code has a tool's output. How do you show Claude which request it answers?
- [x] Send it in a `tool_result` block, with the same id.
- [ ] Send it in a `tool_use` block, with a new id.
- [ ] Send it as plain text, starting with the tool's name.
Why: A `tool_result` block carries the tool's output back to Claude, with the same id as the `tool_use` block that asked for it.
```

## An agent is that call in a loop

That exchange repeats in the **agent loop**: your code calls Claude, Claude asks for a tool, your code runs it and sends the result back. The loop ends when a reply's `stop_reason` is no longer `"tool_use"`. Normally, Claude wants no more tools, and that reply is the answer.

```checkpoint quick-7
A reply comes back with `stop_reason: "end_turn"`. What does your loop do?
- [x] It stops, because Claude wants no more tools.
- [ ] It calls Claude again, with that reply added.
- [ ] It runs the last tool again, to check the output.
Why: The loop ends when a reply's `stop_reason` is no longer `"tool_use"`. `end_turn` means Claude wants no more tools, and that reply is the answer.
```

```diagram
type: cycle
caption: "An agent is that call in a loop"
steps: ["your code calls Claude", "Claude asks for a tool", "your code runs it", "sends the result back"]
outside: "The loop ends"
```

Claude Code runs on the same loop.

```checkpoint quick-8
Claude Code runs a command for you, such as your tests. What's happening underneath?
- [x] A tool call, in the same loop your own code would run.
- [ ] A separate program takes over, with Claude out of the loop.
- [ ] Claude runs the tests itself, inside the model, with no tool.
Why: Claude Code runs on the same loop, so running a command is a tool call.
```

## Going deeper

### Why it exists

Claude Code and Matt Pocock's Skills talk about agents, tool calls and [subagents](/learn/how-agents-work) without opening them up. All three are built from a call like the one above, and that explains how they behave.

An **LLM**, or large language model, is the kind of model Claude is. Matt says LLMs are "kind of like the guy from Memento", a film whose hero can't form new memories. They continually forget, and keep resetting back to the base state. He's talking about sessions, and the same holds for each API call. So your code sends the whole history every time.

```checkpoint quick-9
You call Claude twice, and the second call sends only your new message. What does Claude know of the first?
- [x] Nothing, so your code has to send the whole history.
- [ ] All of it, because the API saves the history for you.
- [ ] A summary of it, because the API keeps a short note.
Why: LLMs continually forget, and that holds for each API call. So your code sends the whole history every time.
```

A subagent is built the same way. Your agent calls another LLM with its own fresh context window (everything a model can see at once), and that LLM reports a summary back. [ask-matt](/learn/ask-matt) is Matt's guide to his other Skills. So when it offers you a subagent, that's the offer: the job goes to its own context window, and you get a report back.

### How it works underneath

Anthropic calls tool use a contract. Your code says which operations exist and what shape their inputs take. Claude decides when to call them.

```checkpoint quick-10
You've given Claude three tools. Which part of the contract is Claude's?
- [x] Deciding when to call each one.
- [ ] Deciding which operations exist.
- [ ] Deciding what shape each input takes.
Why: Your code says which operations exist and what shape their inputs take. Claude decides when to call them.
```

For tools your code runs, every tool call is a round trip: the model asks, you run it, you report back, the model goes on. A few tools, such as web search, run on Anthropic's servers instead.

In code, that round trip is a `while` loop on `stop_reason`. This is Anthropic's tutorial loop, shortened. Try it has a whole loop you can run.

```python
while response.stop_reason == "tool_use":
    tool_use = next(block for block in response.content if block.type == "tool_use")
    result = run_tool(tool_use.name, tool_use.input)

    messages.append({"role": "assistant", "content": response.content})
    messages.append(...)  # a user message holding the tool_result block

    response = client.messages.create(...)  # the same call, with the new messages
```

Each time round, the loop saves the reply and the tool's result into `messages`, then calls again. Any other stop reason ends it: `"end_turn"` means Claude has a final answer, while `"max_tokens"` or `"refusal"` are stops your code should handle.

```checkpoint quick-11
Your loop exits, and the last stop reason is `"max_tokens"`. What does that tell you?
- [x] Claude stopped for a reason your code should handle.
- [ ] Claude has a final answer, so there's nothing to do.
- [ ] Claude wants another tool, so the loop should go on.
Why: Any stop reason other than `"tool_use"` ends the loop. `"end_turn"` means a final answer, while `"max_tokens"` or `"refusal"` are stops your code should handle.
```

The tutorial's later steps run every `tool_use` block in a reply. They also send a failed tool's error back with `is_error: true`, so Claude can retry or ask.

What does the word _agent_ mean here? Anthropic's post on building effective agents draws the line by who picks the path. What Anthropic calls a "workflow" runs the model and tools through code paths written in advance. An agent's model directs its own steps and its own tool use.

```checkpoint quick-12
Your code always calls Claude to sort a request, then again to answer it. In Anthropic's terms, which is that?
- [x] A "workflow", because the path was written in advance.
- [ ] An agent, because the model is called more than once.
- [ ] An agent, because the model runs through two steps.
Why: What Anthropic calls a "workflow" runs the model through code paths written in advance. An agent's model directs its own steps.
```

```diagram
type: compare
caption: "Anthropic's post on building effective agents draws the line by who picks the path."
columns: ["What Anthropic calls a \"workflow\"", "An agent's model"]
rows:
  - label: "who picks the path"
    cells: ["code paths written in advance", "directs its own steps and its own tool use"]
```

Underneath, agents are typically "LLMs using tools based on environmental feedback in a loop." The loop above is that idea in code.

The post's advice is to find "the simplest solution possible", and to start with the API directly. Frameworks can hide the prompts, the text sent to the model, and the responses underneath. A later note says much of the tooling in the post has changed since December 2024. The loop idea hasn't: today's docs still describe a `while stop_reason == "tool_use"` loop.

### A real example

Anthropic built a coding agent for SWE-bench tasks, which ask for edits to many files from a written description. The model kept getting relative file paths wrong once the agent had moved out of the root folder, the project's top folder.

A **relative path**, like `src/app.py`, starts from the folder you're in, so it points somewhere else once you move to another folder. An **absolute path**, like `/home/you/project/src/app.py`, starts from the top of the disk, so it works from anywhere.

The fix was in the tool, not the prompt. Anthropic changed the tool to always require absolute paths, and the model then used it flawlessly.

```checkpoint quick-13
Your agent keeps getting relative paths wrong with a tool. Which fix matches Anthropic's?
- [x] Change the tool, so it always requires absolute paths.
- [ ] Add a line to the prompt, asking for more careful paths.
- [ ] Keep the agent in the root folder, so paths can't break.
Why: The fix was in the tool, not the prompt. Anthropic changed the tool to always require absolute paths, and the model then used it flawlessly.
```

So a tool deserves as much care as a prompt: Anthropic says it "spent more time optimizing our tools than the overall prompt."

### Where it goes wrong

**Your key stops working, and Anthropic emails you.** You probably committed it to a public repository, one of the most frequent causes of leaked keys. GitHub scans public repositories for Claude keys, and Anthropic "automatically deactivates the exposed API key." On your own machine, keep your next key in a `.env` file listed in `.gitignore`, the file that tells Git what to leave out.

**The SDK refuses to run in your website.** Anthropic's TypeScript SDK is off by default in a browser, "to avoid exposing your secret API credentials." Make the call from your backend instead. In January 2024 a developer asked for a way round it, in issue #248 on the SDK's GitHub page. In August 2024 the SDK shipped the switch, named `dangerouslyAllowBrowser`. It adds an extra header, a labelled piece of information sent with a request, called `anthropic-dangerous-direct-browser-access`.

**The API refuses your request with `tool_use ids were found without tool_result blocks immediately after`.** Each `tool_use` block needs a `tool_result` in the next message, and one is missing or comes after text. One agent crashed or timed out mid-run, leaving tool calls in its saved history with no results. After that, "every subsequent message hits the same orphaned tool_use in history". So send one `tool_result` for every `tool_use` block, before any text.

```checkpoint quick-14
Claude's reply asked for two tools, and your next message answers only one. What does the API do?
- [x] It refuses the request, as a `tool_result` is missing.
- [ ] It answers, and ignores the tool call you didn't run.
- [ ] It runs the missing tool itself, then answers as usual.
Why: Each `tool_use` block needs a `tool_result` in the next message. With one missing, the API refuses the request.
```

**The loop keeps running, and so does the bill.** This one is a warning, not a reported failure: agents mean "higher costs, and the potential for compounding errors." So add a stopping condition, such as a maximum number of iterations. The Agent SDK, Anthropic's package for running this loop in your own app, has `max_turns` for it. Without limits, the loop runs until Claude finishes on its own.

```checkpoint quick-15
You're about to let an agent run on a big job. What stops the loop running away?
- [x] A stopping condition, such as a maximum number of iterations.
- [ ] A line in the prompt, asking Claude to call fewer tools.
- [ ] A second agent, watching the first and stopping its errors.
Why: Agents mean higher costs and the potential for compounding errors. So add a stopping condition, such as a maximum number of iterations.
```

### Try it

You'll need a Git repository to work in, and Python 3.10 or later. You'll also need an account on the **Claude Console**, Anthropic's site for API keys, with credit on it. Your practice project works (the Try it "set up the practice project" in [Issues: keeping track of work](/learn/issues-and-keeping-track) creates it), and so does a new folder where you've run `git init`. Each call is charged to your account, so this script caps its loop.

On Windows, use Git Bash for these steps, as in [What Git and GitHub are](/learn/what-git-and-github-are).

1. In the Claude Console, open the **API keys** page and create a key.
2. From the repo root, make the folders: `mkdir -p api/scripts`.
3. Keep key files and the packages you'll install out of git: `echo .env >> .gitignore`, then `echo .venv/ >> .gitignore`.
4. Create `api/.env`, with your key in place of the placeholder:

```
ANTHROPIC_API_KEY=your-api-key-here
```

5. Check that git ignores it: `git check-ignore api/.env`. You should see `api/.env`.
6. Make a **virtual environment**, a separate space for this project's Python packages: `python3 -m venv .venv`. On Windows, type `python` instead of `python3`.
7. Turn it on: `source .venv/bin/activate`. In Git Bash on Windows, use `source .venv/Scripts/activate` instead.
8. Install the packages: `pip install anthropic python-dotenv`.
9. Save this as `api/scripts/agent_loop.py`. The tool returns two made-up classes.

```python
import json

from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
client = Anthropic()

tools = [{
    "name": "list_classes",
    "description": "List the yoga classes on one day, with free spaces.",
    "input_schema": {
        "type": "object",
        "properties": {"day": {"type": "string"}},
        "required": ["day"],
    },
}]

def list_classes(day):
    return [
        {"name": "Morning flow", "day": day, "free_spaces": 0},
        {"name": "Evening calm", "day": day, "free_spaces": 4},
    ]

messages = [{"role": "user", "content": "Which class on Monday has space?"}]

for turn in range(5):  # the cap, so a runaway loop stops
    response = client.messages.create(
        model="claude-opus-5-5",
        max_tokens=1024,
        tools=tools,
        tool_choice={"type": "auto", "disable_parallel_tool_use": True},  # at most one tool call per reply
        messages=messages,
    )
    print(response.stop_reason)
    if response.stop_reason != "tool_use":
        break

    tool_use = next(block for block in response.content if block.type == "tool_use")
    result = list_classes(tool_use.input["day"])

    messages.append({"role": "assistant", "content": response.content})
    messages.append({"role": "user", "content": [{
        "type": "tool_result",
        "tool_use_id": tool_use.id,
        "content": json.dumps(result),
    }]})

for block in response.content:
    if block.type == "text":
        print(block.text)
```

10. Run it: `python api/scripts/agent_loop.py`. You should see `tool_use`, then `end_turn`, then Claude's answer.

Keep this script and the key on the server side. Code that runs in a browser should never see the key.

### Read more

- [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works), Anthropic docs
- [Tutorial: Build a tool-using agent](https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent), Anthropic docs
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), Erik S. and Barry Zhang, Anthropic, 2024-12-19
- [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop), Anthropic's Claude Code docs
- [API key best practices: keep your keys safe and secure](https://support.claude.com/en/articles/9767949-api-key-best-practices-keep-your-keys-safe-and-secure), Anthropic Help Center, 2026-10-19
- [Add a dangerouslyAllowBrowser option (issue #248)](https://github.com/anthropics/anthropic-sdk-typescript/issues/248), jkomoros and others, opened 2024-01-06
- [Full Walkthrough: Workflow for AI Coding](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock, AI Engineer, 2026-04-24

## Remember

```flashcards
Q: In Anthropic's Python SDK, what makes one call to Claude, and where does the key come from?
A: `client.messages.create(...)`, with a model, `max_tokens` and a list of messages. The client reads the key from the `ANTHROPIC_API_KEY` environment variable.

Q: What does a `tool_use` block hold?
A: The tool's name, a unique `id` and the structured `input`. Your `tool_result` sends back that same id as its `tool_use_id`.

Q: What is an agent, in terms of calls to the model?
A: The same call in a loop. While Claude's reply asks for tools, run them, send the results back and call again. Normally, when it asks for none, that reply is the answer.

Q: What does `dangerouslyAllowBrowser` do in Anthropic's TypeScript SDK?
A: It lets the SDK run in a web browser, which is off by default so the API key isn't exposed. It adds the `anthropic-dangerous-direct-browser-access` header. It shipped in August 2024, after issue #248.

Q: Building its SWE-bench agent, what did Anthropic change to stop file-path mistakes?
A: The tool, not the prompt. The model slipped on relative paths once it left the root folder. So the tool was changed to require absolute paths, and the model then used it flawlessly.
```

## Final test

```final-test calling-a-model-where-the-key-lives
On the yoga-studio booking site, where should the Anthropic API key live?
- [x] In an environment variable on the backend, which makes the call to Claude.
- [ ] In a constant in the website's TypeScript code, so the browser can call Claude directly.
- [ ] In a settings file committed to the repo, so every developer gets the same key.
Why: Whoever has the key runs up charges on your account, so it has to stay where nobody else can read it. The website is out, since a key in a browser is exposed. That's why Anthropic's TypeScript SDK won't run there by default. A committed file is out too, since keys committed to public repos are a frequent cause of leaks. That leaves an environment variable on the backend.
```

```final-test calling-a-model-who-runs-a-tool
Claude's reply ends with `stop_reason "tool_use"` and asks for your `list_classes` function. Who runs it?
- [x] Your code runs it and sends the output back in a `tool_result` block with the same id.
- [ ] Anthropic runs your Python function on its servers and adds the output to the reply.
- [ ] Claude runs the function itself inside the model, then writes its answer in the next reply.
Why: Claude never runs anything on its own, and it never receives your function, only the schema you gave it and the result you send back. So the `tool_use` block is a request. Your code runs the tool, then sends the output in a `tool_result` block whose `tool_use_id` matches.
```

```final-test calling-a-model-when-the-loop-ends
An agent calls Claude, runs the tools it asks for, and calls again. When does the loop end?
- [x] When `stop_reason` is no longer `"tool_use"`, so Claude asks for no more tools.
- [ ] When the API's built-in limit of ten tool calls per conversation is reached.
- [ ] When your code sends Claude a `tool_result` block for the last tool it asked for.
Why: A reply's `stop_reason` is `"tool_use"` only while Claude wants a tool, so that's what keeps the loop going. Any other stop reason ends it, because Claude has either given its final answer or stopped for a reason your code should handle. Sending a `tool_result` doesn't end it, since Claude's next reply may ask for another tool.
```

```final-test calling-a-model-deeper-workflow-or-agent
What separates what Anthropic calls a workflow from an agent?
- [x] Who picks the path. A workflow runs predefined code paths; an agent's LLM directs its own steps and tools.
- [ ] How many tools it has. A workflow calls one tool at most; an agent can call several tools in one reply.
- [ ] Where it runs. A workflow runs on Anthropic's servers; an agent runs in your code with your own API key.
Why: The line is who picks the path. In what Anthropic calls a workflow, the model and tools run through code paths written in advance. An agent's model directs its own steps and its own tool use, which in practice means a model using tools in a loop. The number of tools and where the code runs don't decide it.
```

```final-test calling-a-model-deeper-unanswered-tool
Your script saved Claude's reply asking for two tools, then crashed before running them. On restart it sends the history. What happens?
- [x] The API refuses it, because each `tool_use` id needs a `tool_result` in the next message.
- [ ] Claude sees no results, so it quietly asks for the same two tools again in its reply.
- [ ] The API drops the unanswered `tool_use` blocks and answers from the rest of the history.
Why: Claude's saved reply asked for two tools, so the API expects a `tool_result` for each in the next message. They're missing, so it rejects the request with "tool_use ids were found without tool_result blocks immediately after". Sending the history again changes nothing: every later message hits the same orphaned `tool_use`.
```

```final-test calling-a-model-second-call
Your booking site asks Claude "Which class on Monday has space?" and gets a good answer. Then it asks "And on Tuesday?", sending only that new message, and Claude seems lost. What's wrong?
- [x] Each call stands alone, so your code must send the whole list of messages.
- [ ] The API forgot the first question, because its memory lasts a few seconds.
- [ ] Claude needs a tool call before it can answer a follow-up question.
Why: Models continually forget, and that holds for each API call. To carry on a conversation, your code sends the whole list of messages with every call, the first one included.
```

```final-test calling-a-model-fix-the-tool
Your agent keeps giving one tool the wrong file paths once it has moved out of the project's root folder. Which fix matches what Anthropic did for its SWE-bench agent?
- [x] Change the tool so that it always requires absolute paths.
- [ ] Add a sentence to the prompt asking for more careful paths.
- [ ] Raise `max_tokens`, so the model has more room to think.
Why: Anthropic fixed the tool, not the prompt. Once the tool required absolute paths, the model used it flawlessly. So a tool deserves as much care as a prompt.
```

```sources
- [anthropics/anthropic-sdk-python README](https://github.com/anthropics/anthropic-sdk-python), Anthropic
- [Tutorial: Build a tool-using agent](https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent), Anthropic
- [API key best practices: keep your keys safe and secure](https://support.claude.com/en/articles/9767949-api-key-best-practices-keep-your-keys-safe-and-secure), Anthropic (Claude Help Center), 2026-10-19
- [anthropics/anthropic-sdk-typescript README](https://github.com/anthropics/anthropic-sdk-typescript), Anthropic
- [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works), Anthropic
- [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop), Anthropic (Claude Code docs)
- [ask-matt: PHASE-BOUNDARIES.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/ask-matt/PHASE-BOUNDARIES.md), Matt Pocock's Skills
- [Full Walkthrough: Workflow for AI Coding — Matt Pocock](https://www.youtube.com/watch?v=-QFHIoCo-Ko), Matt Pocock (AI Engineer channel), 2026-04-24
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), Erik Schluntz and Barry Zhang, Anthropic, 2024-12-19
- [Add a dangerouslyAllowBrowser option to allow running in the browser (issue #248)](https://github.com/anthropics/anthropic-sdk-typescript/issues/248), jkomoros and others, anthropics/anthropic-sdk-typescript, 2024-01-06
- [Troubleshooting tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/troubleshooting-tool-use), Anthropic
- [Orphaned tool_use blocks in conversation history cause Anthropic 400 errors (issue #3308)](https://github.com/letta-ai/letta/issues/3308), just-cameron, letta-ai/letta
- [retro: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/engineering/retro/SKILL.md), Matt Pocock's Skills
- [grilling: SKILL.md](https://github.com/mattpocock/skills/blob/a496f5513d4a4cf889bc48e189e579f4b0bdf6aa/skills/productivity/grilling/SKILL.md), Matt Pocock's Skills
```
