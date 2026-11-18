/** The number a session's view is drawn from. */
export type Seed = number

declare module 'claude-code' {
  interface PluginState {
    'vista-theme': {
      seed: Seed
    }
  }
}
