const { Command, Flags } = require('@oclif/core');

class Hello extends Command {
  async run() {
    const { flags } = await this.parse(Hello);
    this.log(`Hello ${flags.name}!`);
  }
}

Hello.description = 'Say hello to the world';

Hello.examples = ['$ mynewcli hello world', '$ mynewcli hello --name=jane'];

Hello.flags = {
  name: Flags.string({
    char: 'n',
    description: 'name to say hello to',
    required: false,
    default: 'world',
  }),
};

module.exports = Hello;
