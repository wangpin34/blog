import mustache from 'mustache'

export default class Renderer {
  private template: string
  constructor(template: string) {
    this.template = template
    mustache.parse(this.template)
  }
  render(data: any) {
    return mustache.render(this.template, data)
  }
}