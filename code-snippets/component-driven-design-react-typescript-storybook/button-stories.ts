import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button-component';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// --- Primary variant ---

export const PrimarySmall: Story = {
  args: { variant: 'primary', size: 'sm', label: 'Button' },
};

export const PrimaryMedium: Story = {
  args: { variant: 'primary', size: 'md', label: 'Button' },
};

export const PrimaryLarge: Story = {
  args: { variant: 'primary', size: 'lg', label: 'Button' },
};

export const PrimaryDisabled: Story = {
  args: { variant: 'primary', size: 'md', label: 'Button', disabled: true },
};

// --- Secondary variant ---

export const SecondarySmall: Story = {
  args: { variant: 'secondary', size: 'sm', label: 'Button' },
};

export const SecondaryMedium: Story = {
  args: { variant: 'secondary', size: 'md', label: 'Button' },
};

export const SecondaryLarge: Story = {
  args: { variant: 'secondary', size: 'lg', label: 'Button' },
};

export const SecondaryDisabled: Story = {
  args: { variant: 'secondary', size: 'md', label: 'Button', disabled: true },
};

// --- Ghost variant ---

export const GhostSmall: Story = {
  args: { variant: 'ghost', size: 'sm', label: 'Button' },
};

export const GhostMedium: Story = {
  args: { variant: 'ghost', size: 'md', label: 'Button' },
};

export const GhostLarge: Story = {
  args: { variant: 'ghost', size: 'lg', label: 'Button' },
};

export const GhostDisabled: Story = {
  args: { variant: 'ghost', size: 'md', label: 'Button', disabled: true },
};
