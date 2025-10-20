import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'Complaints',
  title: 'Complaints',
  type: 'document',
  fields: [
    defineField({
      name: 'complaint',
      type: 'string',
      title: 'Complaint',
    }),
    defineField({
      name: 'complaint_status',
      type: 'string',
      title: 'Complaint Status',
    }),
    defineField({
      name: 'complaint_date',
      type: 'date',
      title: 'Complaint Date',
    }),
    defineField({
      name: 'complaint_category',
      type: 'string',
      title: 'Complaint Category',
    }),
    defineField({
      name: 'complaint_place',
      type: 'string',
      title: 'Complaint Place',
    }),
    defineField({
      name: 'complaint_description',
      type: 'string',
      title: 'Complaint Description',
    }),
    defineField({
      name: 'complaint_person_id',
      type: 'string',
      title: 'Complaint Person ID',
    }),
    defineField({
      name: 'complaint_person_nbr',
      type: 'string',
      title: 'Complaint Person Nbr',
    }),
  ],
})
