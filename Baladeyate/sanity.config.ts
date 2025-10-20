import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Baladeyate',

  projectId: 'avx2zuog',
  dataset: 'complaints',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
