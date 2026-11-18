# Vista theme for the Claude desktop app

You stand on a high ledge at sunrise and look out over a sea of clouds. Peaks stand out of it like islands: pale and small far away, tall and warm near you, with tiny firs on their ledges. A low sun sits beside the tallest one.

![peaks standing out of a sea of clouds at sunrise, the tall ones at both sides, a low sun at the right, and calm empty sky in the middle](docs/preview.gif)

## Made to sit behind a conversation

The app lays the chat down the middle of the window, and a theme cannot move it. A full picture there ends up hidden behind your words. So this view follows the "one-corner" rule of old landscape painting: the subject keeps to the sides, and the middle is left as empty sky and cloud on purpose. The words rest on the calm part, and only a faint veil is needed. The sun and its glow stay at the side, never behind the text.

## What moves

- The sea of clouds rolls slowly, each row at its own pace.
- Ribbons of mist drift across the waists of the peaks.
- Thin streaks of high cloud cross the sky.
- A flock of birds crosses, a smaller flock passes far off, and an eagle glides in a wide slow circle.
- The dark firs on the ledge sway a little.

## A new view every session

Each session draws its own view from its own seed (taken from when the session started): the outline of every peak, its side summits and cracks, where the firs stand, how the clouds lie. The view is drawn once and then left alone, so nothing flickers while Claude works.

The colors are a light theme with dark text.

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
