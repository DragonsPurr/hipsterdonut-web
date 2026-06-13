function portableTextBlock(children: { text: string; marks?: string[] }[]) {
  return {
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: children.map(({ text, marks = [] }) => ({
      _type: 'span',
      marks,
      text,
    })),
  };
}

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
          initialValue: 'Kayt and Ryan',
          validation: (Rule: { required: () => unknown }) => Rule.required(),
        },
      ],
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'whoWeAreTitle',
      title: 'First section heading',
      type: 'string',
      description: 'Heading shown above the first column of body text.',
      initialValue: 'Who We Are',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'whoWeAreBody',
      title: 'First section body',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Main bio text beside the portrait image.',
      initialValue: [
        portableTextBlock([
          { text: "Hi! We're Kayt and Ryan, the humans behind " },
          { text: "Hipster Donut Apparel", marks: ['strong', 'em'] },
          {
            text: ' — a Dragon\'s Purr brand for dopey pop-culture mashups, culturejamming, and elder-millennial eye-rolling humour.',
          },
        ]),
      ],
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'whatWeMakeTitle',
      title: 'Second section heading',
      type: 'string',
      description: 'Heading for the second block of text.',
      initialValue: 'What We Make',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'whatWeMakeBody',
      title: 'Second section body',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Second column of text (e.g. what you make).',
      initialValue: [
        portableTextBlock([
          {
            text: 'We design and print apparel that celebrates the absurd — mashups, in-jokes, and sardonic takes on the stuff we grew up with. Every piece is made to be worn loudly and laughed at quietly.',
          },
        ]),
      ],
      validation: (Rule: { required: () => unknown }) => Rule.required(),
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
