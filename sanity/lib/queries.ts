export const HOME_PAGE_QUERY = `
  *[_type == "homePage"][0]{
    heroHeadline,
    heroIntro,
    heroCtaLabel,
    heroCtaLink,
    quoteText,
    quoteAttribution,
    "gallery": gallery[]{
      _key,
      "id": _key,
      "type": "image",
      "src": image.asset->url,
      alt,
      "thumbnail": image.asset->url
    }
  }
`;

export const ABOUT_PAGE_QUERY = `
  *[_type == "aboutPage"][0]{
    headline,
    body,
    "headshot": headshot.asset->url,
    "focusCards": focusCards[]{
      _key,
      title,
      description,
      color
    },
    "tools": tools[]{
      _key,
      label,
      "id": coalesce(_key, label),
      "icon": coalesce(icon.asset->url, iconPath)
    },
    "brands": brands[]{
      _key,
      label,
      "id": coalesce(_key, label),
      "icon": coalesce(logo.asset->url, logoPath)
    }
  }
`;

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0]{
    contactHeading,
    contactIntro,
    email,
    bookingLink,
    seoTitle,
    seoDescription,
    "ogImage": ogImage.asset->url,
    "socials": socials[]{
      _key,
      label,
      link
    }
  }
`;

export const FEATURED_WORKS_QUERY = `
  *[_type == "work" && featured == true]
  | order(featuredOrder asc, year desc, title asc) {
    _id,
    title,
    type,
    production,
    year,
    role,
    synopsis,
    "imageUrl": coalesce(image.asset->url, imagePath),
    link,
    previewTitle,
    featuredLayout
  }
`;

export const ALL_WORKS_QUERY = `
  *[_type == "work"]
  | order(year desc, title asc) {
    _id,
    title,
    type,
    production,
    year,
    role,
    synopsis,
    "imageUrl": coalesce(image.asset->url, imagePath),
    link,
    previewTitle
  }
`;

export const TESTIMONIALS_QUERY = `
  *[_type == "testimonial" && visible != false]
  | order(order asc, name asc) {
    _id,
    name,
    title,
    quote,
    rating,
    "image": coalesce(image.asset->url, imagePath)
  }
`;
