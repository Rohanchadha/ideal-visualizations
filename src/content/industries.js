// Industry-specific landing pages — drives /industries/<slug>.

export const INDUSTRIES = [
    {
        slug: 'architecture-firms',
        audience: 'Architecture Firms',
        title: '3D Rendering for Architecture Firms | Ideal Visualizations',
        description: 'Outsource your 3D rendering to a dedicated studio. Exterior renders, walkthroughs & 360° tours from your CAD/BIM files. 10+ years, 1500+ projects.',
        h1: '3D Rendering Partner for Architecture Firms',
        subhead: "Your team designs. We visualise. No hiring overhead, no render-farm costs, no missed deadlines.",
        priority: true,
        painPoints: [
            { title: 'Rendering in-house eats into design time', desc: 'Every hour your designers spend on materials and lighting is an hour they are not designing the next project.' },
            { title: 'Freelancers are unreliable at scale', desc: 'They miss deadlines, disappear mid-revision and cannot handle three projects at once. We can.' },
            { title: 'Your clients need to see it before they approve it', desc: 'Photoreal renders close the approval gap that drawings alone cannot. We deliver in 5–10 business days.' },
        ],
        howItWorks: [
            { step: 1, title: 'Send us your CAD, SketchUp, Revit or BIM files', desc: 'Plus material references and any reference renders you like the look of.' },
            { step: 2, title: 'We model, light, render and post-produce', desc: 'In 5–10 business days for stills, 10–15 days for walkthroughs.' },
            { step: 3, title: 'Receive photoreal deliverables', desc: 'Renders, walkthroughs or 360° tours ready for your client presentations or planning submissions.' },
        ],
        servicesShown: ['exterior-3d-rendering', 'interior-3d-rendering', '3d-walkthrough-animation', '360-virtual-tour', 'elevation-design'],
        caseStudies: [
            { name: '[Project Name 1]', city: '[City]', scope: '[e.g. 12-unit residential complex, 8 exterior + 4 interior renders]', turnaround: '8 business days', placeholder: true },
            { name: '[Project Name 2]', city: '[City]', scope: '[e.g. Boutique commercial façade, 6 elevation renders + 60s walkthrough]', turnaround: '14 business days', placeholder: true },
            { name: '[Project Name 3]', city: '[City]', scope: '[e.g. Mixed-use complex, master-plan render + 12 unit interior views]', turnaround: '21 business days', placeholder: true },
        ],
        pricing: [
            { service: 'Exterior render (per view)', price: 'from ₹[AMOUNT] / $[AMOUNT]' },
            { service: 'Interior render (per view)', price: 'from ₹[AMOUNT] / $[AMOUNT]' },
            { service: 'Walkthrough (per minute)', price: 'from ₹[AMOUNT] / $[AMOUNT]' },
            { service: '360° tour (per scene)', price: 'from ₹[AMOUNT] / $[AMOUNT]' },
            { service: 'Volume / retainer', price: 'Custom — discounts at 10+ views/month' },
        ],
        faqs: [
            { q: 'What file formats do you accept?', a: '.dwg, .dxf, .skp, .rvt, .3dm, .max, .fbx, .obj and PDF plans. We also work from hand sketches if that is all you have.' },
            { q: 'How many revisions are included?', a: 'Two free revision rounds per view. Additional revisions are billed at our hourly rate, quoted upfront.' },
            { q: 'Do you sign NDAs?', a: 'Yes — we sign your NDA, or use ours, before you share any files. Your unbuilt projects stay confidential.' },
            { q: "What's your turnaround time?", a: '5–10 business days for stills, 10–15 days for walkthroughs, 7–12 days for 360° tours. Rush available at 30–50% premium.' },
            { q: 'Do you offer bulk or retainer pricing?', a: 'Yes. Firms running 10+ views/month get a dedicated artist and discounted rates. We also offer per-project, per-view and monthly retainer models.' },
        ],
        relatedBlog: ['outsource-3d-rendering-architecture-firms', '3d-rendering-cost', 'hiring-3d-rendering-studio'],
    },
    {
        slug: 'interior-designers',
        audience: 'Interior Designers',
        title: '3D Rendering for Interior Designers | Ideal Visualizations',
        description: 'Photorealistic interior 3D renders from your mood boards and floor plans. Help clients visualise before committing. 5–10 day delivery.',
        h1: 'Bring Your Interior Concepts to Life in Photorealistic 3D',
        subhead: "Your clients can't visualise from mood boards alone. Our renders close the deal — and reduce expensive change orders during execution.",
        painPoints: [
            { title: 'Mood boards are not enough', desc: 'Clients say yes to a board and then say no to the executed room. A render closes that gap.' },
            { title: 'Material samples lie about scale', desc: 'A 4-inch swatch reads completely differently on a 12-foot wall. Renders show the truth.' },
            { title: 'Change orders eat your margin', desc: 'Every "I thought it would look different" costs you. A render up front protects your fee.' },
        ],
        howItWorks: [
            { step: 1, title: 'Send us your floor plan and mood board', desc: 'Even sketched plans and Pinterest boards work — we will fill in the gaps.' },
            { step: 2, title: 'We render in 5–10 business days', desc: 'Material accuracy, cinematic lighting, multiple lighting moods on request.' },
            { step: 3, title: 'Show your client. Close the project.', desc: 'And then re-use the renders in your portfolio and Instagram.' },
        ],
        servicesShown: ['interior-3d-rendering', '360-virtual-tour', 'interior-design'],
        caseStudies: [
            { name: '[Residence Name]', city: '[City]', scope: '[e.g. 4BHK apartment, 6 interior renders + lighting variants]', turnaround: '7 business days', placeholder: true },
            { name: '[Restaurant Name]', city: '[City]', scope: '[e.g. 80-cover restaurant, dining + bar + private room renders]', turnaround: '10 business days', placeholder: true },
            { name: '[Showroom Name]', city: '[City]', scope: '[e.g. retail fitout, hero render + 360° tour]', turnaround: '12 business days', placeholder: true },
        ],
        pricing: [
            { service: 'Interior render (per view)', price: 'from ₹[AMOUNT] / $[AMOUNT]' },
            { service: 'Lighting variant (same view)', price: '50% of original view' },
            { service: '360° tour (per scene)', price: 'from ₹[AMOUNT] / $[AMOUNT]' },
            { service: 'Designer retainer (5+ views/month)', price: 'Custom — talk to us' },
        ],
        faqs: [
            { q: 'I only have a Pinterest board, no CAD. Can you still render?', a: 'Yes. Send us a rough floor plan (even a phone-photo sketch) plus your Pinterest board and we will build the model.' },
            { q: 'Can I show the same room in different lighting moods?', a: 'Yes — warm evening, bright morning and dramatic night moods are commonly delivered together at half-price per variant.' },
            { q: "Can you match my supplier's exact materials?", a: 'Yes. Send the supplier link, sample photo or material code and we will match it to within visual tolerance.' },
            { q: 'How many revisions are included?', a: 'Two free revision rounds per view.' },
        ],
        relatedBlog: ['3d-rendering-for-interior-designers'],
    },
    {
        slug: 'builders-developers',
        audience: 'Builders & Developers',
        title: '3D Rendering for Builders & Developers | Ideal Visualizations',
        description: '3D marketing assets that sell properties before they are built. Photorealistic renders, walkthroughs & virtual tours for pre-sales and launches.',
        h1: '3D Marketing Assets That Sell Properties Before They Are Built',
        subhead: "Pre-sales require conviction. Photoreal renders, walkthroughs and virtual tours generate buyer confidence and accelerate bookings.",
        painPoints: [
            { title: 'Buyers will not commit to a hole in the ground', desc: 'A photoreal render gives them something to fall in love with — and a reason to write a cheque.' },
            { title: 'Brochure renders look like brochure renders', desc: 'Generic stock-style renders signal "we cut corners". Photoreal renders signal "we sweat the details".' },
            { title: 'Your sales team is selling intangibles', desc: 'Hand them a walkthrough video and a 360° tour and watch the close rate move.' },
        ],
        howItWorks: [
            { step: 1, title: 'Brief us on the project and the launch timeline', desc: 'Master plan, unit types, USPs, target buyer.' },
            { step: 2, title: 'We deliver a launch-ready asset bundle', desc: 'Hero exterior render, master plan, unit interior renders, walkthrough, 360° tour.' },
            { step: 3, title: 'Use them across every channel', desc: 'Website, brochure, hoardings, Instagram, YouTube, sales-office screen, WhatsApp campaigns.' },
        ],
        servicesShown: ['exterior-3d-rendering', '3d-walkthrough-animation', '360-virtual-tour', 'interior-3d-rendering'],
        caseStudies: [
            { name: '[Township Name]', city: '[City]', scope: '[e.g. 200-unit gated community, master plan + 4 unit-type renders + 90s walkthrough]', turnaround: '21 business days', placeholder: true },
            { name: '[Tower Name]', city: '[City]', scope: '[e.g. 28-storey tower, hero render + lobby + 3 typical floors + 360° tour]', turnaround: '28 business days', placeholder: true },
            { name: '[Villa Cluster]', city: '[City]', scope: '[e.g. 12 luxury villas, exterior + interior bundle + aerial fly-through]', turnaround: '21 business days', placeholder: true },
        ],
        pricing: [
            { service: 'Project-level launch bundle', price: 'from ₹[AMOUNT] / $[AMOUNT]' },
            { service: 'Master-plan render', price: 'from ₹[AMOUNT] / $[AMOUNT]' },
            { service: 'Unit-type render set', price: 'from ₹[AMOUNT] / $[AMOUNT]' },
            { service: 'Walkthrough (60–90s)', price: 'from ₹[AMOUNT] / $[AMOUNT]' },
            { service: '360° tour (per unit type)', price: 'from ₹[AMOUNT] / $[AMOUNT]' },
        ],
        faqs: [
            { q: 'How long does a full launch bundle take?', a: 'Typically 3–4 weeks for a tower or township launch bundle. We can compress to 2 weeks on rush.' },
            { q: 'Can you deliver vertical 9:16 cuts for Instagram & WhatsApp?', a: 'Yes. Every walkthrough is delivered in both 16:9 and 9:16 by default.' },
            { q: 'Do you handle on-site sales-office display loops?', a: 'Yes — we deliver looping 4K MP4s sized for any display, plus a touch-screen 360° tour build.' },
            { q: 'Can you white-label for our marketing agency?', a: 'Yes. Full white-label and NDA available for agencies.' },
        ],
        relatedBlog: ['3d-rendering-real-estate-presales', 'roi-of-3d-rendering'],
    },
];

export const INDUSTRY_BY_SLUG = Object.fromEntries(INDUSTRIES.map((i) => [i.slug, i]));
