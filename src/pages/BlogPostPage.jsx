/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom";
import { lazy, Suspense, useRef } from "react";
import { MDXProvider } from "@mdx-js/react";
import BlogLayout from "../components/blog/BlogLayout";
import ChapterNav from "../components/blog/ChapterNav";
import TextHighlighter from "../components/blog/TextHighlighter";
import { getMDXComponents } from "../components/blog/MDXComponents";
import useIsMobile from "../hooks/useIsMobile";
import { series, essays } from "../content/blog-registry";

// Every MDX file under src/content is bundled as its own lazy-loaded route.
// Adding a file and a registry entry is enough to publish a new post.
const mdxModules = Object.fromEntries(
    Object.entries(import.meta.glob("../content/**/*.mdx")).map(
        ([path, importer]) => [
            path.replace("../content/", "").replace(/\.mdx$/, ""),
            lazy(importer),
        ]
    )
);

const BlogPostPage = ({ darkMode }) => {
    const { seriesId, slug } = useParams();
    const { isMobile } = useIsMobile();
    const articleRef = useRef(null);

    // Determine if this is a series chapter or standalone essay
    const isEssay = seriesId === "essays";
    const contentKey = `${seriesId}/${slug}`;

    const MDXContent = mdxModules[contentKey];

    // Find series/chapter info for navigation
    let currentSeries = null;
    let currentChapterIndex = -1;
    let prevChapter = null;
    let nextChapter = null;
    let breadcrumb = "";
    let backLink = "/blog";
    let backLabel = "Writing";

    if (!isEssay) {
        currentSeries = series.find((s) => s.id === seriesId);
        if (currentSeries) {
            currentChapterIndex = currentSeries.chapters.findIndex(
                (c) => c.slug === slug
            );
            if (currentChapterIndex > 0) {
                prevChapter =
                    currentSeries.chapters[currentChapterIndex - 1];
            }
            if (
                currentChapterIndex >= 0 &&
                currentChapterIndex <
                currentSeries.chapters.length - 1
            ) {
                nextChapter =
                    currentSeries.chapters[currentChapterIndex + 1];
            }
            const currentChapter =
                currentSeries.chapters[currentChapterIndex];
            breadcrumb = currentChapter
                ? `${currentSeries.title} · Chapter ${currentChapter.chapter}`
                : currentSeries.title;
            backLink = `/blog/${seriesId}`;
            backLabel = currentSeries.title;
        }
    } else {
        const essay = essays.find((e) => e.slug === slug);
        if (essay) {
            breadcrumb = essay.date;
        }
    }

    if (!MDXContent) {
        return (
            <BlogLayout
                darkMode={darkMode}
                backLink={backLink}
                backLabel={backLabel}
            >
                <h1
                    style={{
                        fontFamily:
                            "'Georgia', 'Times New Roman', serif",
                        color: darkMode ? "#fff" : "#1a1a1a",
                    }}
                >
                    Post not found
                </h1>
                <p
                    style={{
                        color: darkMode
                            ? "rgba(255,255,255,0.6)"
                            : "#4b5563",
                    }}
                >
                    The blog post you’re looking for doesn’t exist
                    yet.
                </p>
            </BlogLayout>
        );
    }

    const components = getMDXComponents(darkMode, isMobile);

    return (
        <BlogLayout
            darkMode={darkMode}
            backLink={backLink}
            backLabel={backLabel}
            breadcrumb={breadcrumb}
        >
            <article className="blog-post-article" ref={articleRef}>
                <MDXProvider components={components}>
                    <Suspense
                        fallback={
                            <div
                                style={{
                                    padding: "4rem 0",
                                    textAlign: "center",
                                    color: darkMode
                                        ? "rgba(255,255,255,0.4)"
                                        : "rgba(0,0,0,0.3)",
                                }}
                            >
                                Loading...
                            </div>
                        }
                    >
                        <MDXContent
                            components={components}
                            darkMode={darkMode}
                        />
                    </Suspense>
                </MDXProvider>
            </article>

            <TextHighlighter
                darkMode={darkMode}
                key={contentKey}
                rootRef={articleRef}
                storageKey={contentKey}
            />

            {/* Chapter navigation for series */}
            {currentSeries && (
                <ChapterNav
                    darkMode={darkMode}
                    prevChapter={prevChapter}
                    nextChapter={nextChapter}
                    seriesId={seriesId}
                />
            )}
        </BlogLayout>
    );
};

export default BlogPostPage;
