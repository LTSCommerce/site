// TypeScript catches flag mismatches at compile time
import { Command, Flags } from '@oclif/core';

interface ParsedFlags {
  name: string;
  force: boolean;
}

// Strong typing throughout your commands
const { flags } = await this.parse<ParsedFlags>(MyCommand);
