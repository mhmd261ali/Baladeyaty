import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'Suggestion',
  title: 'Suggestion',
  type: 'document',
  fields: [
    defineField({
      name: 'suggestion',
      type: 'string',
      title: 'Suggestion',
    }),
    defineField({
      name: 'suggestion_date',
      type: 'date',
      title: 'Suggestion Date',
    }),
    defineField({
      name: 'suggestion_category',
      type: 'string',
      title: 'Suggestion Category',
    }),
    defineField({
      name: 'suggestion_description',
      type: 'string',
      title: 'Suggestion Description',
    }),
    defineField({
      name: 'suggestion_person_name',
      type: 'string',
      title: 'Suggestion Person Name',
    }),
    defineField({
      name: 'suggestion_person_nbr',
      type: 'string',
      title: 'Suggestion Person Nbr',
    }),
    defineField({
      name: 'suggestion_person_email',
      type: 'string',
      title: 'Suggestion Person Email',
    }),
  ],
})
