// The whole view, drawn back to front: paper and sun, rows of far hills with mist between them, the still water,
// then the near bank and its thin trees. It depends only on the session's seed, so it is never drawn again
// mid-session and nothing flickers.

import { HEIGHT, WATER, WIDTH } from './scene/kit'
import { HILL_ROWS, banks, hillFills, hills } from './scene/land'
import { LIFE_STYLE, geese } from './scene/life'
import { SKY_STYLE, mist, paper, ripples, skyFills } from './scene/sky'
import { nearTrees, reeds } from './scene/trees'

const STILL = '@media (prefers-reduced-motion:reduce){*{animation:none!important}}'

export function sceneSvg(seed: number): string {
  let shore = ''

  for (let index = 0; index < HILL_ROWS; index += 1) {
    shore += hills(seed, index) + mist(index % 2 === 0 ? 420 : 1180, 500 + index * 52, 560, 30 + index * 4, 120 + index * 22)
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="xMidYMax slice">` +
    `<style>${SKY_STYLE}${LIFE_STYLE}${STILL}</style>` +
    `<defs>${skyFills()}${hillFills()}</defs>` +
    paper() +
    geese(seed) +
    shore +
    mist(800, WATER, 900, 26, 160) +
    mist(1320, 300, 150, 12, 140) +
    ripples(seed) +
    banks() +
    reeds(seed) +
    nearTrees(seed) +
    '</svg>'
  )
}
