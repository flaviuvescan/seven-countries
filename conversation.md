# Conversation Handoff

This file stores a condensed history of working sessions for the project.

New instances should read this file first for session continuity, then read `project.md`.
`project.md` is the main project memory document: part design bible, part Kanban board, part caveats log, part nice-to-have list, part calendar, and part decisions/questions tracker.

## Handoff Workflow

- Read `conversation.md` for recent session summaries, active context, and handoff notes.
- Read `project.md` for the current product direction, roadmap, LLM suggestions, and ongoing decisions.
- Treat `project.md` as the source of truth for product intent and planned work.
- Treat `conversation.md` as the condensed narrative of what happened across sessions.

## Project Tone

- The project should feel fun, playful, and community-friendly.
- We are building this collaboratively over multiple sessions.
- Suggestions from LLMs should be preserved rather than lost between context windows.

## Current State

- The game is a static browser project with multiple playable versions.
- `Superheroes` currently seems like the most fun version, followed by `Europe` and `US States`.
- A likely design insight is that the best versions have hint categories that are intuitive, varied, and a little playful.
- The superhero dataset has already been expanded from 20 to 40 entries to reduce predictability.
- `project.md` now includes an `LLM Suggestions` section for candidate future versions and hint variables.

## Session Tally

- Total sessions logged: 1

## Sessions

### Session 1

- Date: 2026-03-27
- Summary:
  - Reviewed the existing game structure and `project.md`.
  - Discussed which current versions feel best and why.
  - Identified hint-category design as a likely key ingredient in what makes a version fun.
  - Added a persistent `LLM Suggestions` section to `project.md`.
  - Added a backlog of candidate game versions with suggested hint variables.
  - Expanded `data/superheroes.json` from 20 to 40 entries.
  - Created this handoff file to support continuity across context-window resets.

## Next Instance Notes

- Before suggesting new directions, check `project.md` so you do not duplicate or contradict earlier ideas.
- When a session ends, update both documents if needed:
  - Put durable product knowledge, plans, caveats, options, and decisions into `project.md`.
  - Put the condensed session narrative and tally update into `conversation.md`.
- Keep summaries short but specific enough that a new instance can continue work without guessing.
