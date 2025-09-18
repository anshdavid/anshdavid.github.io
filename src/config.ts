export const SITE = {
  website: "https://anshdavid.com/", // replace this with your deployed domain
  author: "Ansh David",
  profile: "https://anshdavid.com/",
  desc: "Personal blog about technology, programming, AI and everything I like",
  title: "@AnshDavid",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/anshdavid/anshdavid.github.io/tree/master/src/blog",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Toronto", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
