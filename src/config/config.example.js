export const YEAR = new Date().getFullYear();

export const CONFIG = {
    TITLE: 'Nought',
    LOGO_TEXT: 'nought.', // IF DIFFERENT FROM TITLE
    DESCRIPTION: 'An Astro 5 starter with Tailwind CSS',
    DEFAULT_AUTHOR: 'ml',
    POSTS_DIR: 'src/dummy_posts', // RELATIVE TO PROJECT DIRECTORY    

    // DESCRIPTION_SIDEBAR defaults to DESCRIPTION if not set. Set to false for no sidebar description. Can contain HTML.
    // DESCRIPTION_SIDEBAR: false,//Can contain HTML, e.g. '<h2>An Astro 5 starter with Tailwind CSS. <a href="https://github.com/sec-ml/nought">More info</a>.</h2>',
    DESCRIPTION_SIDEBAR: '<h2>An Astro 5 starter with Tailwind CSS. <a href="https://github.com/sec-ml/nought" style="text-decoration:underline;"><strong>More info</strong></a>.</h2>',
    
    URL: 'https://nought.vercel.app', // URL OF SITE FOR METADATA, SITEMAP, ETC.

    // DEFAULT IF NOT SET: '© YEAR TITLE. All rights reserved. CAN CONTAIN HTML'
    COPYRIGHT: '© '+YEAR+' - Nought. All rights reserved. <a href="https://github.com/sec-ml/nought" style="text-decoration:underline;"><strong>More info</strong></a>',
    
    SIDEBAR_TAGS: true, // true/1 or false/0. SHOW TAGS IN SIDEBAR
    SIDEBAR_TAGS_MIN_POST_QTY: 1, // MINIMUM NUMBER OF POSTS ASSOCIATED WITH TAG FOR IT TO BE DISPLAYED IN SIDEBAR
    SIDEBAR_TAGS_MAX: 10, // MAX NUMBER OF TAGS TO DISPLAY IN SIDEBAR
    SIDEBAR_TAGS_SUPPRESS: ['maybe some tags are too long or look weird', 'or you just don\'t want some shown'], // TAGS TO SUPPRESS FROM SIDEBAR
    SIDEBAR_TAGS_SHOW_COUNT: true, // true/1 or false/0. SHOW NUMBER OF POSTS ASSOCIATED WITH TAG IN SIDEBAR

    NAV_LINKS: [
        { "label": "Home", "url": "/", "suppress": false },
        { "label": "Styling Examples", "url": "/styling-examples", "suppress": false },
        { "label": "Theme Repo", "url": "https://github.com/sec-ml/nought", "suppress": false }
      ],

    // BLOG POST //
    BLOG_POST_SHOW_AUTHOR: true, // true/1 or false/0. SHOW AUTHOR ON FULL BLOG POST PAGE
    BLOG_POST_SHOW_DATE: true, // true/1 or false/0. SHOW DATE ON FULL BLOG POST PAGE

    // POST LISTING - HOMEPAGE, TAG PAGE //
    POST_LISTING_SHOW_AUTHOR: true, // true/1 or false/0. SHOW AUTHOR ON POST LISTING PAGES
    POST_LISTING_SHOW_DATE: true, // true/1 or false/0. SHOW DATE ON POST LISTING PAGES

    SUPPORT_TWITTER_META: true, // true/1 or false/0. ADD TWITTER META TAGS

    // PAGINATION //
    PAGINATION_ITEMS_PER_PAGE: 4, // NUMBER OF POSTS PER PAGE
    PAGINATION_OLDER_POSTS_LABEL: 'Older Posts >', // TEXT FOR OLDER POSTS LINK
    PAGINATION_NEWER_POSTS_LABEL: '< Newer Posts', // TEXT FOR NEWER POSTS LINK

    SCHEDULED_POSTS: true, // true/1 or false/0. POSTS WITH FUTURE dateCreated WILL BE HIDDEN UNTIL PUBLISH DATE
    SCHEDULED_POSTS_SEE_IN_DEV: true, // true/1 or false/0. SHOW SCHEDULED POSTS IN DEV MODE
      
    // ROBOTS.TXT //
    // Set to blank string/remove to use default.
    // Default is:
    //// User-agent: *
    //// Allow: /
    //// Sitemap: CONFIG.URL (as set above)

    // Making changes in astro.config.mjs will break config option, but might be required for more specific use cases.
    // See https://www.npmjs.com/package/astro-robots-txt#usage for more info.
    ROBOTS_OVERRIDE: "User-agent: *\nDisallow: /\nSitemap: https://nought.vercel.app/sitemap-index.xml" // OVERRIDE FOR ROBOTS.TXT. DEFAULTS TO 'User-agent: *'
};


