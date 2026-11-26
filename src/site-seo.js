import { essays, series } from "./content/blog-registry.js";

const siteUrl = "https://agneypraseed.github.io";
export const siteName = "Agney Praseed";

const pages = new Map([
    ["/", {
        title: "Agney Praseed | AI Research & Software Engineering",
        description: "Agney Praseed is a software engineer and AI researcher in Berlin. Explore his projects in machine learning, computer vision, and full-stack development.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: `${siteUrl}/`,
        },
    }],
    ["/about/", {
        title: "About Agney Praseed | AI Research & Software Engineering",
        description: "Learn about Agney Praseed’s background in software engineering and his AI research interests in dependable systems and vision-language models. View his CV and profiles.",
        structuredData: {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: `${siteUrl}/about/`,
            mainEntity: {
                "@type": "Person",
                name: siteName,
                sameAs: [
                    "https://github.com/Agneypraseed",
                    "https://www.linkedin.com/in/agney-praseed/",
                ],
            },
        },
    }],
    ["/projects/", {
        title: "AI & Software Engineering Projects | Agney Praseed",
        description: "Explore Agney Praseed’s software projects, including NemoDoc for research notebooks, TabPilot for browser workflows, and Neural Canvas for neural style transfer.",
    }],
    ["/blog/", {
        title: "Blog & Technical Notes | Agney Praseed",
        description: "Read essays and notes by Agney Praseed, and find his public collection of technical notes.",
    }],
    ["/footprints/", {
        title: "Travel Photography & Interactive Map | Agney Praseed",
        description: "Explore cities Agney Praseed has visited on an interactive globe with photos from his travels.",
    }],
    ["/books/", {
        title: "Books & Reading Lists | Agney Praseed",
        description: "Browse Agney Praseed’s bookshelf, his to-read list, and a technical reading list covering mathematics, computer science, and machine learning.",
    }],
    ["/videos/", {
        title: "Favorite Films, Anime & Series | Agney Praseed",
        description: "Browse Agney Praseed’s favorite films, anime, and series, with posters and selected scenes.",
    }],
    ["/music/", {
        title: "Music & Playlists | Agney Praseed",
        description: "Listen to Agney Praseed’s Spotify playlists and explore the music he collects and shares.",
    }],
]);

for (const essay of essays) {
    pages.set(`/blog/essays/${essay.slug}/`, {
        title: `${essay.title} | ${siteName}`,
        description: essay.description || `Read “${essay.title}” by ${siteName}.`,
        noindex: !essay.showOnBlog,
    });
}

for (const item of series) {
    pages.set(`/blog/${item.id}/`, {
        title: `${item.title} | ${siteName}`,
        description: item.description || `Read the “${item.title}” series by ${siteName}.`,
        noindex: !item.showOnBlog,
    });

    for (const chapter of item.chapters) {
        pages.set(`/blog/${item.id}/${chapter.slug}/`, {
            title: `${chapter.title} | ${siteName}`,
            description: chapter.description || `Read “${chapter.title}” from the “${item.title}” series by ${siteName}.`,
            noindex: !item.showOnBlog,
        });
    }
}

export const pagePaths = [...pages.keys()];

export function getPageMetadata(pathname) {
    const path = pathname.replace(/\/index\.html$/, "/").replace(/\/?$/, "/");
    const page = pages.get(path);

    return page
        ? { ...page, canonical: `${siteUrl}${path}` }
        : {
            title: `Page not found | ${siteName}`,
            description: "This page could not be found.",
            noindex: true,
        };
}
