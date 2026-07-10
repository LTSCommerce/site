import type { HookContext } from '@longtermsupport/ts-qa-ci';

export default async function hookPost(_ctx: HookContext): Promise<void> {
  // Runs only after every phase succeeds - unreached on any upstream failure.
}
