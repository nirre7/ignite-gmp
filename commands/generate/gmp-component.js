module.exports = {
  description: 'GMP component generator (alias: gc)',
  alias: ['gc'],
  run: async function (toolbox) {
    // grab some features
    const { parameters, strings, print, ignite, patching } = toolbox
    const { pascalCase, isBlank, kebabCase } = strings

    // validation
    if (isBlank(parameters.first)) {
      print.warning('A component name is required.')
      print.info('ignite generate gmp-component <name>')
      print.info('or')
      print.info('ignite generate gc <name>\n')
      return
    }

    const name = parameters.first
    const pascalName = pascalCase(name)
    const kebabName = kebabCase(name)
    const props = { name, pascalName }

    const typeCodeMessage = 'Which type of component?'
    const componentTypeChoices = ['React.Component', 'Stateless component', 'Hooks component']

    const codeAnswers = await toolbox.prompt.ask({
      name: 'type',
      type: 'select',
      message: typeCodeMessage,
      choices: componentTypeChoices
    })

    const jobs = []
    const target = `app/components/${kebabName}/${kebabName}.tsx`

    if (codeAnswers.type === componentTypeChoices[0].name) {
      jobs.push(
        {
          template: 'gmp-component.js.ejs',
          target: target
        }
      )
    }

    if (codeAnswers.type === componentTypeChoices[1].name) {
      jobs.push(
        {
          template: 'gmp-functional-component.js.ejs',
          target: target
        }
      )
    }

    if (codeAnswers.type === componentTypeChoices[2].name) {
      jobs.push(
        {
          template: 'gmp-hooks-component.js.ejs',
          target: target
        }
      )
    }

    await ignite.copyBatch(toolbox, jobs, props)

    await patching.prepend(
      './storybook/storybook-registry.ts',
      `require('../app/components/${kebabName}/${kebabName}.story')\n`
    )
  }
}
