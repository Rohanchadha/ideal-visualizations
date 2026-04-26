import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import CtaBlock from '../components/CtaBlock';
import Prose from '../components/Prose';
import { POST_BY_SLUG, POSTS_BY_DATE } from '../content/blog';
import { isPreviewMode, onlyPublished } from '../config/visibility';
import { SITE_URL, ORG_ID } from '../config/seo';

export default function BlogPost() {
    const { slug } = useParams();
    const post = POST_BY_SLUG[slug];
    if (!post) return <Navigate to="/blog" replace />;
    if (post.draft && !isPreviewMode()) return <Navigate to="/blog" replace />;
    const Content = post.Content;

    const breadcrumb = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: `/blog/${post.slug}` },
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        url: `${SITE_URL}/blog/${post.slug}`,
        datePublished: post.date,
        dateModified: post.date,
        author: { '@type': 'Person', name: post.author || 'Danish' },
        publisher: { '@id': ORG_ID },
        image: post.image ? `${SITE_URL}${post.image}` : undefined,
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        articleSection: post.category,
        keywords: post.keyword,
    };

    // 3 most recent other posts (published only)
    const others = onlyPublished(POSTS_BY_DATE).filter((p) => p.slug !== post.slug).slice(0, 3);

    return (
        <>
            <Seo
                title={post.title}
                description={post.description}
                path={`/blog/${post.slug}`}
                image={post.image}
                type="article"
                jsonLd={jsonLd}
                breadcrumb={breadcrumb}
                noIndex={post.draft}
            />
            <PageHero
                eyebrow={`${post.category} · ${post.readingTime} min read`}
                title={post.title}
                breadcrumb={breadcrumb}
            />

            <article className="px-6 md:px-12 pb-12">
                {post.image && (
                    <div className="max-w-5xl mx-auto pb-10">
                        <img src={post.image} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-3xl" width="1200" height="600" />
                    </div>
                )}
                <div className="max-w-3xl mx-auto">
                    <Prose>
                        <Content />
                    </Prose>
                    <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-[#6B7280]">
                        Written by <strong className="text-[#52525B]">{post.author || 'Danish'}</strong> · Published {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </article>

            <div className="px-6 md:px-12 pb-12">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#52525B] mb-6 tracking-tight">Read next</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {others.map((p) => (
                            <Link key={p.slug} to={`/blog/${p.slug}`} className="block bg-white border border-gray-200 hover:border-[#F97316] rounded-2xl p-5 transition-colors">
                                <p className="text-[#F97316] font-semibold text-xs uppercase tracking-wider mb-2">{p.category}</p>
                                <h3 className="font-bold text-[#52525B] text-base leading-snug">{p.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <CtaBlock />
        </>
    );
}
