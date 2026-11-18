// Vista theme: peaks standing out of a sea of clouds at sunrise. The tall peaks and the sun keep to the sides and the middle is
// left as empty sky, because the app lays the chat there, and a matching
// light color theme. The view depends only on the session's seed, so it is drawn once and never flickers.

import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { sceneSvg } from './scene'

const COMMAND = 'vista'
const SCENE = 'vista'
const SEED = { plugin: 'vista-theme', key: 'seed' } as const

const { theme, problems } = makeColors({
  label: 'Vista',
  only: 'light',
  roles: { accent: '#a8432c', danger: '#b3392f', success: '#2f7a55', warning: '#a86f14', pro: '#6d4f94' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f4e3cb',
        'surface-1': '#f9ecd9',
        'surface-2': '#fff8ec',
        'text-primary': '#2a1719',
        'text-secondary': '#523a37',
        'text-muted': '#6b524c',
      },
    },
  },
})

// The scene's name goes under `id` as well as `scene`, as the theme-examples plugin sets its own.
const LOOK = {
  colors: theme,
  backdrop: { scene: SCENE, id: SCENE, glass: { blur: 1, tint: '#fdebd2', opacity: 0.35 } },
} as unknown as ThemeSetArgs

/**
 * The backdrop hook must answer at once (the app shows a late answer as a still picture), so the seed is kept
 * here and the picture is built once per seed.
 */
let seed = 1
let built: { seed: number; source: string } | undefined

function backdropSource(): string {
  if (built?.seed !== seed) {
    built = { seed, source: sceneSvg(seed) }
  }

  return built.source
}

/** Every session gets its own view. The seed is kept in the session, so a reload draws the same one. */
async function pickSeed($: EngineInterface): Promise<void> {
  const { value } = await $.state.get(SEED)

  seed = value ?? Math.floor((await $.clock.now()) % 100_000) + 1
  if (value === undefined) {
    await $.state.set(SEED, seed)
  }
  $.ui.invalidate('ui.render')
}

async function show($: EngineInterface): Promise<string> {
  const unpainted = problems.find(problem => problem.startsWith("Desktop won't paint"))

  if (unpainted !== undefined) {
    return unpainted
  }

  const set = await $.theme.set(LOOK)

  return set.isDrawn ? 'The vista theme is on.' : `The vista theme is set, but this window does not draw it: ${set.reason}`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)

    await $.command.register({
      name: COMMAND,
      description: 'Vista theme: alone it turns the theme on; "off" clears it.',
    })
    await pickSeed($)

    const said = await show($)

    if (said !== 'The vista theme is on.') {
      void $.ui.toast(said)
    }

    return result
  })

  on('command.run', { command: COMMAND }, async ($, e) => {
    if (e.args.trim().toLowerCase() === 'off') {
      await $.theme.clear()

      return { text: 'The vista theme is off for this session. /vista turns it on again.' }
    }

    return { text: await show($) }
  }).catch(() => ({ text: 'The vista theme hit an error. Run /vista again.' }))

  // Not async, on purpose: see `seed`.
  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.props.scene !== SCENE || e.surface !== 'desktop') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg isInteractive alt="Peaks standing out of a sea of clouds at sunrise, tall ones at both sides with small firs on their ledges, a low sun at the right, and empty sky in the middle" source={backdropSource()} />
  })
}
