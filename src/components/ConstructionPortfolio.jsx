import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GALLERY_IMAGES } from '../config/galleryManifest';

const featuredProjects = [
    { id: '1YpvkLO_PRlzRDw9Fl70B9E04i3crXsw7', title: 'Hut Residential House' },
    { id: '1utvi5j4wPhzm9hm-5sqzaGWjf6YnIfJt', title: 'Hut Residential House' },
    { id: '1XEMrRpZCcbhlaNWyxNuHY1fGEwwpwiKJ', title: 'Hut Residential House' },
    { id: '1FOIIiy_XKB0QMLDbf_nl33N5A-ZiV88G', title: 'Hut Residential House' },
    { id: '10bOYEuxz49caqm2NrErVk09KAyeki204', title: 'Residential House' },
    { id: '1NNyX4-4C_PZd9gnx6luBkHxnqzU8nl7K', title: 'Cafe', visualization: true },
];
const projects = featuredProjects.map(project => {
    const asset = GALLERY_IMAGES.find(item => item.id === project.id);
    return asset ? { ...asset, ...project } : null;
}).filter(Boolean);

export default function ConstructionPortfolio() {
    if (!projects.length) return null;

    return (
        <section id="construction-portfolio" aria-labelledby="construction-heading" className="bg-[#FAFAFA] px-4 py-20 md:px-8 md:py-28">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#F97316]">On Site</p>
                        <h2 id="construction-heading" className="text-4xl font-bold leading-tight text-[#52525B] md:text-5xl">
                            Construction <span className="font-serif font-normal italic">portfolio</span>
                        </h2>
                        <p className="mt-5 text-base leading-relaxed text-[#6B7280] md:text-lg">
                            A selection of our construction work and interior design projects.
                        </p>
                    </div>
                    <Link to="/portfolio?theme=Construction" className="inline-flex shrink-0 items-center gap-2 self-start border-b border-[#F97316] pb-2 font-semibold text-[#52525B] transition-colors hover:text-[#F97316] md:self-auto">
                        View construction projects <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </Link>
                </div>
                <div className="grid gap-8 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
                    {projects.map(item => (
                        <figure key={item.id} className="min-w-0">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#E4E4E7]">
                                <img
                                    src={item.thumb}
                                    srcSet={`${item.thumb} 400w, https://lh3.googleusercontent.com/d/${item.id}=w800 800w`}
                                    sizes="(min-width: 1280px) 411px, (min-width: 768px) 50vw, 100vw"
                                    width="800"
                                    height="600"
                                    alt={[item.title, item.visualization ? '3D visualization' : null, item.city].filter(Boolean).join(', ')}
                                    loading="lazy"
                                    decoding="async"
                                    referrerPolicy="no-referrer"
                                    className="h-full w-full object-cover"
                                />
                                {item.visualization && <span className="absolute left-3 top-3 rounded bg-white/95 px-2 py-1 text-xs font-medium text-[#52525B]">3D visualization</span>}
                            </div>
                            <figcaption className="pt-4">
                                <h3 className="break-words text-lg font-semibold text-[#52525B]">{item.title}</h3>
                                {item.city && <p className="mt-1 text-sm text-[#6B7280]">{[item.city, item.state].filter(Boolean).join(', ')}</p>}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}