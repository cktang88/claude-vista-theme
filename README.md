# Vista theme for the Claude desktop app

A far view for the Code tab, at golden hour. You stand among tall firs and look out over layer after layer of forested ridges that fade into warm haze, all the way to distant peaks. A low sun sits in a gap between them, and a river carries its light through the valley.

![a wide golden-hour view over layers of forested ridges to distant peaks, with a low sun, a river, tall firs, thin clouds and birds](docs/preview.gif)

## What moves

- Long rays of light fan out from the sun and slowly grow and fade.
- Thin clouds, dusky on top and gold underneath, cross very slowly.
- A flock of birds crosses the sky, and a smaller flock passes low over the peaks the other way.
- An eagle glides in a wide slow circle.
- Fog drifts between the ridges, sunlight glitters on the river, the near firs sway, and specks of light rise near the trees.

## A new view every session

Each session draws its own view from its own seed (taken from when the session started): the shape of every ridge and peak, where the forest stands and where it opens, how the clouds lie. The view is drawn once and then left alone, so nothing flickers while Claude works.

The colors are a light theme with dark text. The chat column is lightly frosted, so text stays easy to read over the view.

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
