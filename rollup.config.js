import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'

const config = [
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
    },
    plugins: [json(), nodeResolve({ browser: true }), commonjs(), typescript()],
    preserveEntrySignatures: false,
  },
]

export default config
