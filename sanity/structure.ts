import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["homePage", "aboutPage", "siteSettings"]);

const singletonItem = (
  S: Parameters<StructureResolver>[0],
  type: string,
  title: string,
) =>
  S.listItem()
    .title(title)
    .schemaType(type)
    .child(S.document().schemaType(type).documentId(type).title(title));

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singletonItem(S, "homePage", "Home Page"),
      singletonItem(S, "aboutPage", "About Page"),
      singletonItem(S, "siteSettings", "Site Settings"),
      S.divider(),
      S.listItem()
        .title("Featured Works")
        .schemaType("work")
        .child(
          S.documentList()
            .title("Featured Works")
            .schemaType("work")
            .filter('_type == "work" && featured == true')
            .defaultOrdering([{ field: "featuredOrder", direction: "asc" }]),
        ),
      S.listItem()
        .title("All Works")
        .schemaType("work")
        .child(
          S.documentTypeList("work")
            .title("All Works")
            .defaultOrdering([{ field: "year", direction: "desc" }]),
        ),
      ...S.documentTypeListItems().filter(
        (item) =>
          !singletonTypes.has(item.getId() ?? "") && item.getId() !== "work",
      ),
    ]);
