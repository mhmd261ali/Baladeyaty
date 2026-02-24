import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {list: ['user', 'admin']},
      initialValue: 'user',
    }),
    defineField({
      name: 'passwordHash',
      title: 'Password hash',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
  ],
})
