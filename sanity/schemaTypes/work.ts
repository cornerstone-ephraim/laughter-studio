import { DocumentVideoIcon } from "@sanity/icons/DocumentVideo";
import { defineField, defineType } from "sanity";

const workTypes = [
  "TV Series",
  "Feature Film",
  "Short Film",
  "Web Series",
  "Documentary",
  "Documentary Series",
  "Reality TV",
  "Commercial",
  "Music Video",
];

export const work = defineType({
  name: "work",
  title: "Work",
  type: "document",
  icon: DocumentVideoIcon,
  fieldsets: [
    { name: "basics", title: "Basic info", options: { columns: 2 } },
    { name: "story", title: "Story and role" },
    { name: "media", title: "Media" },
    { name: "preview", title: "Preview link" },
    {
      name: "homepage",
      title: "Homepage featuring",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "legacy",
      title: "Legacy import fields",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      fieldset: "basics",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      type: "string",
      fieldset: "basics",
      options: { list: workTypes },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "production",
      type: "string",
      fieldset: "basics",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      type: "number",
      fieldset: "basics",
      validation: (rule) =>
        rule
          .required()
          .integer()
          .min(1900)
          .max(new Date().getFullYear() + 2),
    }),
    defineField({
      name: "role",
      type: "string",
      fieldset: "story",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "synopsis",
      type: "text",
      rows: 5,
      fieldset: "story",
      validation: (rule) =>
        rule
          .required()
          .max(600)
          .warning("Shorter synopses fit the modal better."),
    }),
    defineField({
      name: "image",
      title: "Poster / image",
      type: "image",
      fieldset: "media",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "link",
      title: "Preview link",
      type: "url",
      fieldset: "preview",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "previewTitle",
      title: "Preview link label",
      type: "string",
      fieldset: "preview",
      initialValue: "Open link",
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      fieldset: "homepage",
      description:
        "Only works with this enabled appear in the homepage Selected Works section.",
      initialValue: false,
    }),
    defineField({
      name: "featuredOrder",
      title: "Homepage order",
      type: "number",
      fieldset: "homepage",
      description: "Lower numbers appear first. Use 1, 2, 3...",
      hidden: ({ document }) => !document?.featured,
      validation: (rule) =>
        rule.custom(async (value, context) => {
          const document = context.document;

          if (!document?.featured) return true;
          if (value === undefined || value === null) {
            return "Set a homepage order when showing this work on the homepage.";
          }
          if (!Number.isInteger(value) || value < 1) {
            return "Use a whole number greater than 0.";
          }

          const id = String(document._id ?? "").replace(/^drafts\./, "");
          const client = context.getClient({ apiVersion: "2026-06-26" });
          const count = await client.fetch<number>(
            `count(*[
              _type == "work" &&
              featured == true &&
              featuredOrder == $featuredOrder &&
              !(_id in [$id, "drafts." + $id])
            ])`,
            { featuredOrder: value, id },
          );

          return (
            count === 0 || "Another featured work already uses this order."
          );
        }),
    }),
    defineField({
      name: "featuredLayout",
      title: "Homepage card prominence",
      type: "string",
      fieldset: "homepage",
      description:
        "Controls whether this work appears as a standard or wider card in Selected Works. Auto follows the homepage grid rhythm.",
      initialValue: "auto",
      hidden: ({ document }) => !document?.featured,
      options: {
        layout: "radio",
        list: [
          { title: "Auto", value: "auto" },
          { title: "Standard", value: "standard" },
          { title: "Wide", value: "wide" },
        ],
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!context.document?.featured) return true;
          return value ? true : "Choose a homepage card prominence.";
        }),
    }),
    defineField({
      name: "imagePath",
      title: "Legacy image path",
      type: "string",
      fieldset: "legacy",
      description:
        "Read-only import artifact from the old JSON setup. Use Poster / image instead.",
      deprecated: {
        reason: "Images should now be uploaded to Sanity using Poster / image.",
      },
      readOnly: true,
      hidden: ({ value }) => value === undefined,
    }),
  ],
  orderings: [
    {
      title: "Year, newest first",
      name: "yearDesc",
      by: [
        { field: "year", direction: "desc" },
        { field: "title", direction: "asc" },
      ],
    },
    {
      title: "Featured order",
      name: "featuredOrder",
      by: [{ field: "featuredOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      production: "production",
      year: "year",
      media: "image",
    },
    prepare: ({ title, production, year, media }) => ({
      title,
      subtitle: [production, year].filter(Boolean).join(" - "),
      media,
    }),
  },
});
