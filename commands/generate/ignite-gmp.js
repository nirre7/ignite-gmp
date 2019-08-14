/**
 * This is an example Ignite plugin generator. You can run it when it's installed to
 * your project by doing `ignite generate Gmp foo`.
 *
 * You can rename this command to anything you'd like, or add others.
 *
 * For more information on plugins, check out https://github.com/infinitered/gluegun/blob/master/docs/plugins.md.
 */

module.exports = {
  description: "Example generator",
  run: async function (toolbox) {
    // Learn more about toolbox: https://infinitered.github.io/gluegun/#/toolbox-api.md
    const { parameters, strings, print, ignite } = toolbox
    const { pascalCase, isBlank } = strings

    // validation
    if (isBlank(parameters.first)) {
      print.info(`ignite generate Gmp <name>\n`)
      print.info('A name is required.')
      return
    }

    const name = pascalCase(parameters.first)
    const props = { name }

    // Copies the `Gmp.js.ejs` in your plugin's templates folder
    // into App/Things/${name}.js.
    const jobs = [{
      template: 'Gmp.js.ejs',
      target: `app/${name}.js`
    }]

    // make the templates and pass in props with the third argument here
    await ignite.copyBatch(toolbox, jobs, props)
  }
}
