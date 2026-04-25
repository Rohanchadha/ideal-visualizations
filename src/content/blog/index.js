// Blog post registry. Each post is a dedicated module under ./posts/<slug>.jsx
// exporting `meta` and a default content component.

import * as p1 from './posts/what-is-architectural-visualization.jsx';
import * as p2 from './posts/3d-rendering-cost.jsx';
import * as p3 from './posts/exterior-vs-interior-rendering.jsx';
import * as p4 from './posts/outsource-3d-rendering-architecture-firms.jsx';
import * as p5 from './posts/walkthrough-vs-360-tour.jsx';
import * as p6 from './posts/3d-rendering-turnaround-time.jsx';
import * as p7 from './posts/in-house-vs-outsource-rendering.jsx';
import * as p8 from './posts/before-after-3d-rendering.jsx';
import * as p9 from './posts/files-for-3d-rendering.jsx';
import * as p10 from './posts/vray-vs-corona-vs-lumion.jsx';
import * as p11 from './posts/3d-rendering-real-estate-presales.jsx';
import * as p12 from './posts/3d-rendering-process.jsx';
import * as p13 from './posts/hiring-3d-rendering-studio.jsx';
import * as p14 from './posts/3d-rendering-for-interior-designers.jsx';
import * as p15 from './posts/best-3d-rendering-studio-india.jsx';
import * as p16 from './posts/roi-of-3d-rendering.jsx';
import * as p17 from './posts/types-of-3d-rendering.jsx';
import * as p18 from './posts/3d-rendering-studio-dubai.jsx';
import * as p19 from './posts/outsource-3d-rendering-india-usa-canada.jsx';
import * as p20 from './posts/3d-rendering-portfolio-showcase.jsx';

const modules = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20];

export const POSTS = modules.map((m) => ({ ...m.meta, Content: m.default }));
export const POST_BY_SLUG = Object.fromEntries(POSTS.map((p) => [p.slug, p]));

// Sorted by date desc for blog index
export const POSTS_BY_DATE = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
