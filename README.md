# Vista theme for the Claude desktop app

A quiet view in ink grays, after old Chinese mountain paintings, drawn in a clean modern way. Steep peaks stand out of a sea of mist like islands: pale and soft far away, taller and a little darker near you, with tiny firs on their ledges and ribbons of mist across their waists.

![steep gray peaks standing out of a sea of mist, the tall ones at both sides, and calm empty sky in the middle](docs/preview.gif)

## Made to sit behind a conversation

The app lays the chat down the middle of the window, and a theme cannot move it. So the middle of this picture is empty on purpose: pale sky above, white mist below. The words rest there, and only a faint veil is needed. The tall peaks and the dark firs keep to the sides.

## Where the calm comes from

These are the old painters' means, kept; the antique look (seals, brush texture, yellowed paper) is left out.

- **Emptiness.** Most of the page is unpainted. The eye rests in it.
- **Thin ink.** Each farther range is paler and softer, and every peak fades into mist at its foot.
- **Gray only.** No strong color anywhere. The sun is just a white disc in the haze, so it never pulls the eye.
- **Low contrast.** Even the nearest firs and rock are a soft mid gray, never black, so nothing jars against the pale page.
- **Stillness.** The mist rolls slowly, ribbons of it drift across the peaks, and a few birds cross.

## A new view every session

Each session draws its own view from its own seed (taken from when the session started): the outline of every peak, its side summits and cracks, where the firs stand, how the mist lies. The view is drawn once and then left alone, so nothing flickers while Claude works.

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
