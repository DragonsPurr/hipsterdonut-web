export const aboutPage = {
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    {
      name: 'portraitImage',
      title: 'Portrait image',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['palette', 'lqip'],
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description:
            'Describe the photo for screen readers. Use the image toolbar to crop the frame and set the focal point; the site uses that crop for the circular portrait.',
          validation: (Rule: { required: () => unknown }) => Rule.required(),
        },
      ],
    },
    {
      name: 'whoWeAreTitle',
      title: 'First section heading',
      type: 'string',
      description: 'Heading shown above the first column of body text.',
    },
    {
      name: 'whoWeAreBody',
      title: 'First section body',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Main bio text beside the portrait image.',
    },
    {
      name: 'whatWeMakeTitle',
      title: 'Second section heading',
      type: 'string',
      description: 'Heading for the second block of text.',
    },
    {
      name: 'whatWeMakeBody',
      title: 'Second section body',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Second column of text (e.g. what you make).',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'About page',
        subtitle: 'Site /about content',
      };
    },
  },
};
