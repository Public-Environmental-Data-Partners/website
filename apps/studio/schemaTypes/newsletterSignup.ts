import {defineField, defineType} from 'sanity'

/** Created by the website API when visitors subscribe; browse-only for editors. */
export const newsletterSignup = defineType({
  name: 'newsletterSignup',
  title: 'Newsletter signup',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required().max(254),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      email: 'email',
      submittedAt: 'submittedAt',
    },
    prepare({email, submittedAt}) {
      const subtitle =
        typeof submittedAt === 'string'
          ? new Date(submittedAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })
          : undefined
      return {
        title: typeof email === 'string' && email.trim() ? email.trim() : 'Signup',
        subtitle,
      }
    },
  },
})
