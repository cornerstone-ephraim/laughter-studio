import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "quote",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      type: "number",
      initialValue: 5,
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "imagePath",
      title: "Existing image path",
      type: "string",
      description: "Use this only before uploading the image to Sanity.",
    }),
    defineField({ name: "order", type: "number" }),
    defineField({ name: "visible", type: "boolean", initialValue: true }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "title", media: "image" },
  },
});
