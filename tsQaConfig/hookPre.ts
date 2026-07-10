import type { HookContext } from '@longtermsupport/ts-qa-ci';

export default async function hookPre(_ctx: HookContext): Promise<void> {
  // Runs after config resolution, before any tool executes.
}
