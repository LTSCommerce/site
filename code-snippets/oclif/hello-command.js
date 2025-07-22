import { Command, Flags } from '@oclif/core'

export default class Hello extends Command {
  static description = 'Say hello to the world'
  
  static examples = [
    '$ mynewcli hello world',
    '$ mynewcli hello --name=jane'
  ]
  
  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'name to say hello to',
      required: false,
      default: 'world'
    })
  }
  
  async run() {
    const { flags } = await this.parse(Hello)
    this.log(`Hello ${flags.name}!`)
  }
}