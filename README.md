# Vista theme for the Claude desktop app

A quiet view in grays, after the calmest old Chinese landscape paintings, drawn in a clean modern way. Low hills fade into mist across a wide, still water. A pale sun hangs at the right, and a few thin trees stand on a near bank in one corner. Most of the picture is left empty.

![a quiet gray view: low misty hills fading into a wide empty water, a pale sun, and a few thin trees on a near bank in the bottom right corner](docs/preview.gif)

## Made to sit behind a conversation

The app lays the chat down the middle of the window, and a theme cannot move it. So the middle of this picture is empty on purpose: pale hills at the top, open water below. The words rest there, and only a faint veil is needed. The one dark thing, the trees, keeps to the corner.

## Where the calm comes from

These are the old painters' means, kept; the antique look (seals, brush texture, yellowed paper) is left out.

- **Emptiness.** Most of the page is unpainted. The eye rests in it.
- **Level distance.** You look across flat water to low hills, not up at a towering peak. Long flat lines are calm.
- **Thin ink.** Each farther row of hills is paler, and every row fades to nothing at its foot, as mist takes it.
- **Soft edges.** Nothing far away has a hard line.
- **One dark note.** A few thin trees in one corner, so the rest reads as light and far.
- **Stillness.** The mist drifts, the water barely stirs, and one line of geese crosses very slowly.

## A new view every session

Each session draws its own view from its own seed (taken from when the session started): the shape of every row of hills, how the trees stand, where the mist lies. The view is drawn once and then left alone, so nothing flickers while Claude works.

The colors are a light theme in cool grays with dark text.

## Install

In a terminal session, at the prompt:

```
/plugin install vista-theme --marketplace cktang88/claude-vista-theme
```

Answer `y` to add the marketplace, then pick a scope (user is fine).

From a shell:

```
claude plugin install vista-theme --marketplace cktang88/claude-vista-theme
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `cktang88/claude-vista-theme`, then Add plugin.

`/vista` turns the theme on again, `/vista off` clears it for the session.

Only tried on the macOS desktop app. If your system asks for reduced motion, the view stays still.

## How it is made

The whole view is one SVG drawn by code in `hooks/scene/`: no image files. What it is modeled on, and the rules it follows, are in [docs/references.md](docs/references.md). The notes on what the app allows in an animated backdrop are in the README of the sister theme, [claude-garden-theme](https://github.com/cktang88/claude-garden-theme).

`hooks/make-colors.js` is the color helper that ships with Claude Code's plugin-authoring skill, copied in unchanged.
