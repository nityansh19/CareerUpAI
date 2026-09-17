# Frontend Guide

The CareerUpAI frontend is a React application built with Vite.

## Priorities

- Keep the landing experience focused on the product value.
- Move deeper functionality into dedicated routes or feature modules.
- Prefer reusable components over repeated markup.
- Keep loading, empty and error states explicit.
- Preserve responsive behavior while adding visual effects.

## Component boundaries

A component should have one clear responsibility. Extract repeated UI, complex state transitions and feature-specific logic instead of expanding a single file indefinitely.

## State

Use local state for local UI behavior. Shared application state should only be introduced when multiple distant features genuinely depend on the same source of truth.

## Before merging frontend changes

Run the available lint/build commands, test the primary user flow, and check mobile and desktop layouts.
