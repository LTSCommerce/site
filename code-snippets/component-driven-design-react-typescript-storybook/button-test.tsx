import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from './button-component';

// Because ButtonVariant, ButtonSize, and the disabled flag are finite,
// every valid combination can be enumerated and tested. No guessing what states exist.

const variants = ['primary', 'secondary', 'ghost'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
const disabledStates = [false, true] as const;

describe('Button', () => {
  describe('renders every variant/size/disabled combination', () => {
    for (const variant of variants) {
      for (const size of sizes) {
        for (const disabled of disabledStates) {
          const label = `${variant}/${size}${disabled ? '/disabled' : ''}`;

          it(`renders ${label} without throwing`, () => {
            const { container } = render(
              <Button variant={variant} size={size} label="Test" disabled={disabled} />,
            );
            expect(container.firstChild).toBeTruthy();
          });

          it(`matches snapshot for ${label}`, () => {
            const { container } = render(
              <Button variant={variant} size={size} label="Test" disabled={disabled} />,
            );
            expect(container).toMatchSnapshot();
          });
        }
      }
    }
  });

  // TypeScript enforces at compile time that invalid props cannot be passed,
  // so there is no need to test for "what happens with an unknown variant" —
  // that scenario literally cannot be compiled.
});
