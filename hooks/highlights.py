"""The ==highlight== syntax, for the public site.

The staff dashboard renders these itself. This hook exists so the same
markdown means the same thing in both places — otherwise an author has
to remember which renderer they are writing for, and will not.

    ==!text==   a prohibition
    ==+text==   a permission
    ==~text==   a caution
    ==text==    emphasis with no verdict attached
"""

import re

# Non-greedy, so two highlights on one line stay two highlights.
PATTERN = re.compile(r"==([!+~]?)(.+?)==")

KINDS = {"!": "danger", "+": "ok", "~": "caution"}


def _replace(match: "re.Match[str]") -> str:
    flag, text = match.group(1), match.group(2)
    kind = KINDS.get(flag, "")
    css = f"hl {kind}".strip()
    return f'<mark class="{css}">{text}</mark>'


def on_page_markdown(markdown: str, **_kwargs) -> str:
    # Fenced code is left alone: a rule quoting the syntax should show
    # the syntax, not an example of it.
    parts = re.split(r"(```.*?```)", markdown, flags=re.DOTALL)
    return "".join(
        part if part.startswith("```") else PATTERN.sub(_replace, part)
        for part in parts
    )
