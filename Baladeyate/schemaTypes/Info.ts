import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'Info',
  title: 'Info',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Description',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'document',
      type: 'file',
      title: 'Document',
    }),
    defineField({
      name: 'info_date',
      type: 'date',
      title: 'Info Date',
    }),
    defineField({
      name: 'info_category',
      type: 'string',
      title: 'Info Category',
    }),
    defineField({
      name: 'info_status',
      type: 'string',
      title: 'Info Status',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
})
