import React from 'react';
import { Link } from 'react-router-dom';

export const meta = {
    slug: 'files-for-3d-rendering',
    title: 'What Files to Send a 3D Rendering Studio: A CAD Prep Checklist',
    description: 'Exactly what files, references and information to send your 3D rendering studio to get a fast, accurate quote and a smooth project. With downloadable checklist.',
    date: '2026-03-12',
    readingTime: 8,
    category: 'Process',
    keyword: 'files for 3d rendering',
    image: '/3D-Images/1.png',
    author: 'Danish',
};

export default function Post() {
    return (
        <>
            <p>Half the battle in a rendering project is the brief. A clean handoff package — right files, right references, right level of decision — shaves three to five days off any project and almost eliminates revision rounds. Here is exactly what to send.</p>

            <h2>File formats we accept</h2>
            <ul>
                <li><strong>CAD:</strong> .dwg, .dxf (AutoCAD)</li>
                <li><strong>SketchUp:</strong> .skp</li>
                <li><strong>Revit / BIM:</strong> .rvt, .rfa</li>
                <li><strong>3ds Max:</strong> .max</li>
                <li><strong>Rhino:</strong> .3dm</li>
                <li><strong>Generic 3D:</strong> .fbx, .obj, .dae</li>
                <li><strong>Plans only:</strong> .pdf — we can re-build from PDF if needed (adds 1–2 days)</li>
                <li><strong>Hand sketches:</strong> Yes, photograph and send. We will rebuild from sketch.</li>
            </ul>

            <h2>The complete CAD prep checklist</h2>
            <h3>Drawings</h3>
            <ul>
                <li>Floor plans (dimensioned, all levels)</li>
                <li>Elevations (all four sides)</li>
                <li>Sections (if the project is complex or multi-level)</li>
                <li>Roof plan</li>
                <li>Site plan (for exterior renders, with North arrow)</li>
            </ul>
            <h3>Materials and finishes</h3>
            <ul>
                <li>Material schedule or specification sheet</li>
                <li>Finish photographs or supplier links</li>
                <li>Mood board (Pinterest, Milanote, PDF — any format)</li>
                <li>Sample images of buildings/interiors with the look you want</li>
            </ul>
            <h3>Furniture (interior renders only)</h3>
            <ul>
                <li>Furniture layout (overlay on floor plan)</li>
                <li>Specific furniture pieces if locked in (with supplier links)</li>
                <li>Otherwise: general style direction (modern Scandinavian, classical Indian, etc.)</li>
            </ul>
            <h3>Site context (exterior renders only)</h3>
            <ul>
                <li>Site photos (4–8 from different angles)</li>
                <li>Surrounding building context (if relevant)</li>
                <li>Landscape direction (formal, naturalistic, minimal, none)</li>
            </ul>
            <h3>Camera and lighting preferences</h3>
            <ul>
                <li>Preferred camera angles (mark on plan with arrows)</li>
                <li>Time of day (morning, midday, golden hour, twilight, night)</li>
                <li>Sky and weather (clear, partly cloudy, dramatic)</li>
                <li>Reference renders you like the look of</li>
            </ul>
            <h3>Project meta</h3>
            <ul>
                <li>Project name and city</li>
                <li>Number of views needed</li>
                <li>Required deliverable resolution and format</li>
                <li>Hard deadline (if any)</li>
                <li>End use (client presentation, brochure, website, hoarding, social)</li>
            </ul>

            <h2>Common mistakes that delay projects</h2>
            <ol>
                <li><strong>Sending only a PDF plan.</strong> We can work from PDF but it adds 1–2 days for re-modeling. Send the source CAD or SketchUp where possible.</li>
                <li><strong>"Make it look modern" with no references.</strong> Modern means a hundred different things. Send 3–5 reference images.</li>
                <li><strong>Missing material specifications.</strong> "Marble floor" is too vague. Which marble? What veining? White or grey?</li>
                <li><strong>No furniture layout for interiors.</strong> We will guess; you will revise. Send a layout overlay.</li>
                <li><strong>Multiple decision-makers without one approver.</strong> Designate one person to consolidate feedback.</li>
                <li><strong>Drip-fed feedback over a week.</strong> Consolidate into one feedback round per draft.</li>
            </ol>

            <h2>How to send the files</h2>
            <p>WhatsApp works for files under 100 MB. WeTransfer, Google Drive, Dropbox or your firm's preferred file-share for anything larger. We sign your NDA before any files are shared if confidentiality matters.</p>

            <h2>The TL;DR checklist</h2>
            <p>One CAD/SketchUp/Revit file. One material spec. One mood board. One layout overlay (interiors). One reference render. One preferred camera angle marked on plan. One named approver. Hit send.</p>

            <p><strong>Ready to brief us?</strong> Talk to us on WhatsApp at +91 96467 24313 or email danish@slateconcepts.com — see <Link to="/process">our full process</Link> for what happens next.</p>
        </>
    );
}
