# Data Model Notes

CareerUpAI's data model should reflect product concepts rather than UI screens.

## Principles

- Give each collection/entity a clear responsibility.
- Keep stable identifiers separate from display labels.
- Prefer explicit fields over storing important state inside free-form text.
- Avoid duplicating the same source of truth across multiple documents.
- Add timestamps where lifecycle or ordering matters.

## Relationships

Store relationships in a form that matches the expected access pattern and document ownership rules. Avoid deeply nested structures that make updates or validation difficult.

## Schema changes

When a field changes meaning, document the change and consider existing records. New required fields should have a migration/default strategy before deployment.

## Indexing

Create indexes for real query patterns, then verify that the index improves the intended operation rather than adding unnecessary write cost.
