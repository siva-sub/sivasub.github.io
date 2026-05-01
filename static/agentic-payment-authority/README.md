# Delegated Payment Authority Lab

Archetype: `scenario-lab` — scenario cards, decision path, failure/exception explanation
Reference family: `generic`.

Validate:

```bash
/home/ubuntu/.local/bin/visual-asset-debug --html-file static-preview.html --kind html --json
/home/ubuntu/.local/bin/visual-asset-debug --html-file ghost-card.html --kind html --json
/home/ubuntu/.local/bin/ghost-visual-debug --title "Delegated Payment Authority Lab" --html '<p>Intro</p>' --html-card-file ghost-card.html --require-inline-asset --json
```
