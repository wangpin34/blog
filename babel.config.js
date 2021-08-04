module.exports = function (api) {
  api.cache(true)

  const presets = ['@babel/preset-env', '@babel/preset-typescript']
  const plugins = [
    '@babel/plugin-transform-runtime',
    'macros',
    '@babel/plugin-proposal-class-properties',
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./packages'],
        alias: {
          utils: './packages/utils',
        },
      },
    ],
  ]

  return {
    presets,
    plugins,
  }
}
