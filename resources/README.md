# Project resources

## Portfolio-World migration archive — 16 October 2026

The exact migration ZIP is stored in four binary parts (`.zip.part001` through `.zip.part004`) because the connected GitHub upload API could not accept the complete 90 MB file. All four parts are required. Download this folder or clone the repository, then run:

```sh
python3 resources/restore_archive.py
```

On Windows, `python resources/restore_archive.py` also works. The script recreates `resources/Portfolio-World_Complete_Migration_2026-10-16.zip` and verifies its SHA-256 before saving it. No third-party packages are required.

Preserved project handoff, decisions, original briefs, complete visual references, historical prototypes, source snapshot at `86024958b7bf77638049c798dc2025fd32154425`, and Git history. Extract the ZIP and start with `Portfolio-World_Migration/00_START_HERE.md`. Use `02_NEW_CHAT_PROMPT.txt` to continue in a new chat.

The archive documents missing source material and outstanding verification. It is a dated reference snapshot; use the current repository for subsequent implementation changes.

- File size: 90,047,764 bytes
- SHA-256: `e02a004dbb8ec6e6976612fe9507d089c10419596b75fa9a434cbff8dd7a170a`

These resources are preserved separately from the website's runtime assets.
