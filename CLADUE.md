# General Code Style Rules

- Write comments where needed.
- Use types for everything including parameters, return types and variables.
- Never use short forms like auth, admin, db, temp, utils, tmp, config, 'e' or any other such abbreviations. Always use full form words no exceptions (except 'id', 'api', 'llm') when naming variables, functions, methods, parameters, classes, files or directories. Unless it is part of a third party library which you cannot change.
- All file and folder names should be in full form, for example use configurations.py not config.py.
- Always use fail early logic. That is, failure conditions should be checked first.
- Log lines if any should follow proper punctuation, all variables in logs should be single quoted.
- Try to avoid using variables, always inline logic, if it can prevent variable creation.

## Project Rules

- Always use functional patterns.
- Always use curly braces for if statements and functions and everywhere where fat arrow is used.
- This is soldijs design system project. Always use solidjs tags when possible.
- For CSS use Tailwind CSS.
