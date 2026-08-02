# AGENTS.md

- Do not preserve backward compatibility. Remove obsolete code instead of adding compatibility
  layers or migrations.
- Choose the simplest solution that meets the current requirements.
- Build incrementally: start with a working end-to-end version and expand from there.
- Keep components modular and responsibilities clearly separated.
- Prefer proven libraries, especially ones already used by the project, over custom implementations.
- Check existing dependencies and documentation before adding packages or writing new code.
- Make architectural decisions that are maintainable long term, not temporary stopgaps.
