import { UserIcon } from "@sanity/icons/User";
import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "About Laughter",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headshot",
      title: "Headshot",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "focusCards",
      title: "Focus cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "color",
              title: "Card color",
              type: "string",
              initialValue: "#4F46E5",
              validation: (rule) =>
                rule
                  .regex(/^#[0-9A-Fa-f]{6}$/)
                  .error("Use a hex color, like #4F46E5"),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        }),
      ],
      validation: (rule) =>
        rule
          .length(4)
          .warning("The current about layout is designed for exactly 4 cards."),
    }),
    defineField({
      name: "tools",
      title: "Editing tools",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "iconPath",
              title: "Existing icon path",
              type: "string",
              description:
                "Advanced: use only for existing SVGs in /public, e.g. /icons/avid.svg.",
            }),
          ],
          preview: { select: { title: "label", media: "icon" } },
        }),
      ],
    }),
    defineField({
      name: "brands",
      title: "Featured brands",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "logo",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "logoPath",
              title: "Existing logo path",
              type: "string",
              description:
                "Advanced: use only for existing SVGs in /public, e.g. /icons/netflix.svg.",
            }),
          ],
          preview: { select: { title: "label", media: "logo" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Page" }),
  },
});
