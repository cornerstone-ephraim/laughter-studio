import { type SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./aboutPage";
import { homePage } from "./homePage";
import { siteSettings } from "./siteSettings";
import { testimonial } from "./testimonial";
import { work } from "./work";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePage, aboutPage, siteSettings, work, testimonial],
};
