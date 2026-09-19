/**
 * SLATE CONCEPTS — Social Command Center builder
 * ------------------------------------------------------------------
 * This builds the ENTIRE workbook (all 8 tabs, headers, colors, frozen
 * rows) directly inside your own Google account. No uploads, no importing.
 *
 * HOW TO RUN (2 minutes):
 * 1. Go to https://sheets.new  (creates a blank Google Sheet).
 * 2. Menu: Extensions → Apps Script.
 * 3. Delete anything in the editor, paste ALL of this file.
 * 4. Click the ▶ "Run" button (choose the `buildWorkbook` function).
 * 5. Approve the permissions prompt (it only edits THIS sheet).
 * 6. Switch back to the sheet — all 8 tabs are built & styled.
 * ------------------------------------------------------------------
 */

function buildWorkbook() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('Slate Concepts — Social Command Center');

  const STATUS_COLORS = {
    'Idea': '#e5e7eb', 'Scripting': '#fef3c7', 'Shooting': '#fed7aa',
    'Editing': '#bfdbfe', 'Ready': '#bbf7d0', 'Scheduled': '#ddd6fe',
    'Posted': '#86efac', 'Needs Rework': '#fecaca'
  };

  DATA.forEach(function (tab, idx) {
    let sheet = ss.getSheetByName(tab.name);
    if (!sheet) sheet = ss.insertSheet(tab.name);
    sheet.clear();

    const rows = tab.rows;
    const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 1);
    // pad rows to equal length
    const padded = rows.map(r => {
      const c = r.slice();
      while (c.length < maxCols) c.push('');
      return c;
    });

    sheet.getRange(1, 1, padded.length, maxCols).setValues(padded);

    // Header styling (only sheets that have a real header row)
    if (tab.header) {
      const h = sheet.getRange(1, 1, 1, maxCols);
      h.setBackground('#1f2937').setFontColor('#ffffff').setFontWeight('bold');
      sheet.setFrozenRows(1);

      // status color coding
      const statusIdx = padded[0].findIndex(x => String(x).toLowerCase() === 'status');
      if (statusIdx >= 0) {
        for (let r = 1; r < padded.length; r++) {
          const v = String(padded[r][statusIdx]).trim();
          if (STATUS_COLORS[v]) {
            sheet.getRange(r + 1, statusIdx + 1).setBackground(STATUS_COLORS[v]);
          }
        }
      }
    } else {
      // dashboard/roles: bold first column labels + title
      sheet.getRange(1, 1).setFontSize(14).setFontWeight('bold').setFontColor('#1f2937');
      sheet.getRange(1, 1, padded.length, 1).setFontWeight('bold');
    }

    sheet.getRange(1, 1, padded.length, maxCols)
      .setVerticalAlignment('top').setWrap(true);
    sheet.setHiddenGridlines(true);

    // reasonable column widths
    for (let c = 1; c <= maxCols; c++) sheet.setColumnWidth(c, 170);
  });

  // remove the default empty "Sheet1" if present
  const def = ss.getSheetByName('Sheet1');
  if (def && DATA.every(d => d.name !== 'Sheet1')) ss.deleteSheet(def);

  SpreadsheetApp.getUi().alert('✅ Slate Concepts Command Center built! Share it with your team as Editors.');
}

/* ====== DATA: paste-in content for every tab ====== */
/* Kept compact; edit freely inside the sheet afterwards. */
const DATA = [
  { name: '🏠 Dashboard', header: false, rows: [
    ['SLATE CONCEPTS — SOCIAL COMMAND CENTER','','','',''],
    ['🎯 GOAL','20000 followers','Deadline','End of Q2 2027',''],
    ['📈 Current Followers','>> UPDATE WEEKLY <<','Weekly Growth Target','~350 net new/week',''],
    ['📆 Posting Cadence','1 post/day minimum','Reels per week','4-5',''],
    ['','','','',''],
    ['TEAM','','','',''],
    ['Role','Person','Handle','Responsibility','Backup'],
    ['Creative Lead / Strategist','>> NAME <<','>> @ <<','Owns calendar + approves ideas + writes hooks','Editor'],
    ['Producer / Shooter','>> NAME <<','>> @ <<','Captures raw footage + logs assets','Creative Lead'],
    ['Editor / Publisher','>> NAME <<','>> @ <<','Edits Reels + captions + schedules + posts','Producer'],
    ['','','','',''],
    ['GROUND RULES','','','',''],
    ['1','Log every raw clip in Raw Assets the same day it is shot.','','',''],
    ['2','No post goes live without a hook in first 3s + a CTA at the end.','','',''],
    ['3','Calendar filled 2 weeks ahead at all times.','','',''],
    ['4','Reels-first. When in doubt make it a Reel.','','',''],
    ['5','One owner per post. No orphan tasks.','','',''],
    ['6','Reply to every comment in the first 60 minutes.','','',''],
    ['','','','',''],
    ['QUICK LINKS','','','',''],
    ['Drive - Raw Footage','>> PASTE LINK <<','','',''],
    ['Drive - Final Exports','>> PASTE LINK <<','','',''],
    ['Canva / Templates','>> PASTE LINK <<','','',''],
    ['Scheduling Tool','>> PASTE LINK <<','','',''],
    ['Brand Kit','>> PASTE LINK <<','','','']
  ]},
  { name: '📅 Calendar', header: true, rows: [
    ['Post ID','Publish Date','Day','Time','Status','Format','Content Pillar','Working Title / Hook','Owner','Raw Asset IDs','Caption Ready?','CTA','Hashtag Set','Link to Final'],
    ['SC-001','2026-05-04','Mon','7:00 PM','Idea','Reel','Ceilings','3 ceiling designs that make a room look 2x bigger','Creative Lead','','No','Save this','SET-Design',''],
    ['SC-002','2026-05-06','Wed','1:00 PM','Idea','Carousel','What Not To Do','What NOT to do in your living room','Editor','','No','Tag someone','SET-Educational',''],
    ['SC-003','2026-05-08','Fri','7:30 PM','Idea','Reel','Bed Backs','This bed back cost less than you think','Producer','','No','DM BED','SET-Design',''],
    ['SC-004','2026-05-10','Sun','11:00 AM','Idea','Reel','Natural Light','Your house is dark? Here is the real reason','Creative Lead','','No','Comment LIGHT','SET-Educational',''],
    ['SC-005','2026-05-11','Mon','7:00 PM','Idea','Reel','Staircase','5 staircases that are actually art','Editor','','No','Which is your fav?','SET-Design',''],
    ['SC-006','2026-05-13','Wed','1:00 PM','Idea','Carousel','Color Combinations','Furniture + wall + curtain colors that never fail','Creative Lead','','No','Save this','SET-Educational',''],
    ['SC-007','2026-05-15','Fri','7:30 PM','Idea','Reel','Double Height Wall','How to fill an awkward double-height wall','Producer','','No','DM WALL','SET-Design',''],
    ['SC-008','2026-05-17','Sun','11:00 AM','Idea','Reel','Vastu Series','Vastu myth vs reality: main door edition','Creative Lead','','No','Follow series','SET-Educational',''],
    ['SC-009','2026-05-18','Mon','7:00 PM','Idea','Reel','Kitchen Heights','Your kitchen is the wrong height','Editor','','No','Save this','SET-Educational',''],
    ['SC-010','2026-05-20','Wed','1:00 PM','Idea','Carousel','Pets','Top 5 things to design for if you have pets','Producer','','No','Tag a pet parent','SET-Educational','']
  ]},
  { name: '💡 Ideas Bank', header: true, rows: [
    ['Idea #','Content Pillar','Best Format','Series Potential','Hook Angle','Example Episodes','Priority'],
    ['1','Ceilings','Reel','High','Ignored space','Coffered vs cove | Ceiling lighting','High'],
    ['2','Bed Backs','Reel','High','Before/After','Statement headboards | Budget bed backs','High'],
    ['3','Staircase','Reel','High','Wow factor','Staircases that are art | Under-stair storage','High'],
    ['4','Double Height Wall','Reel','Medium','Problem-solving','Chandelier drop | Art wall','Medium'],
    ['5','Kitchen Heights','Reel (AI VO)','High','You are doing it wrong','Counter height | Tray logic','High'],
    ['6','Holiday Calendar','Reel + Story','High','Timely','Diwali | Dhanteras | New Year','High'],
    ['7','Natural Light','Reel','Medium','Problem-solution','Why dark | Light-bouncing tricks','High'],
    ['8','Kids Safety','Reel/Carousel','Medium','Protective parent','5 kid-safety details','Medium'],
    ['9','What Not To Do (Memes)','Carousel/Reel','High','Humour','Living room mistakes | Lighting sins','High'],
    ['10','Pets','Carousel','Medium','Pet-parent niche','Door-bottom detail | Scratch-proof','Medium'],
    ['11','Mandir / Seating','Reel','Medium','Cultural','Perfect mandir corner | Vastu placement','Medium'],
    ['12','My Inspirations','Reel','Low','Personal story','Top 5 inspirations | My philosophy','Medium'],
    ['13','Celebrity Homes','Reel','High','Curiosity','Breaking down a celeb home','High'],
    ['14','Vastu Series','Reel','High','Myth vs reality','Main door | Kitchen direction','High'],
    ['15','Furniture Design','Reel','High','Craft + custom','Custom pieces this month','High'],
    ['16','Beam Hide Ideas','Reel','Medium','Problem-solving','4 ways to hide a beam','Medium'],
    ['17','Color Combinations','Carousel','High','Fool-proof palettes','Palettes that never fail','High'],
    ['18','Origin Series','Reel','High','Storytelling','How sage green won','Medium'],
    ['19','IKEA Series','Carousel/Reel','High','Budget hacks','IKEA hacks that look premium','High'],
    ['20','Bay Windows','Reel','Low','Cozy aspiration','Best seat in the house','Low'],
    ['21','Client Pushback','Reel','Medium','Honest','Top 5 client pushbacks','Medium'],
    ['22','Comparison Series','Carousel','High','Decision-helper','Laminate vs veneer | Marble vs quartz','High'],
    ['23','Automation','Reel','Medium','Worth the money','5 automations worth it','Medium'],
    ['24','Lighting Types','Reel','High','Where + why','Warm vs cool vs task','High']
  ]},
  { name: '🎞 Raw Assets', header: true, rows: [
    ['Asset ID','Date Shot','Type','Project / Location','Room / Subject','Description','Tags (pillars)','Drive Link','Shot By','Used In','Reusable?','Notes'],
    ['RAW-001','2026-05-01','Video','Example Villa','Living Room','Pan up to coffered ceiling','Ceilings, Lighting','>> LINK <<','Producer','SC-001','Yes','Good B-roll'],
    ['RAW-002','2026-05-01','Video','Example Villa','Master Bedroom','Fluted headboard reveal','Bed Backs','>> LINK <<','Producer','','Yes','Save for before/after'],
    ['RAW-003','2026-05-01','Photo','Example Villa','Staircase','Floating oak staircase','Staircase','>> LINK <<','Producer','','Yes','3 angles']
  ]},
  { name: '🪔 Festivals', header: true, rows: [
    ['Festival','2026 Date (verify)','Prep Window','Relevance','Content Angle','Format','Status'],
    ['Akshaya Tritiya','2026-04-20','~7 days before','Auspicious to start projects','Book your dream home','Reel + Story','Idea'],
    ['Navratri','2026-10-11','~5 days before','Festive prep','9 days to festival-ready home','Story series','Idea'],
    ['Karva Chauth','2026-10-28','~5 days before','Big in North India','Romantic terrace setup','Reel','Idea'],
    ['Dhanteras','2026-11-06','~7 days before','Auspicious buying','What to buy on Dhanteras','Reel + Story','Idea'],
    ['Diwali','2026-11-08','~14 days before','Biggest home occasion','Diwali-ready home in 5 steps','Reel series','Idea'],
    ['Bhai Dooj','2026-11-10','~3 days before','Family','Guest room hosting','Story','Idea'],
    ['Christmas','2026-12-25','~10 days before','Decor + hosting','Warm lighting living room','Reel','Idea'],
    ['New Year','2027-01-01','~7 days before','Fresh start','Renovate in 2027? Book a consult','Reel + Carousel','Idea'],
    ['NOTE','Verify exact dates yearly — lunar calendar shifts.','','','','','']
  ]},
  { name: '👥 Roles & Workflow', header: false, rows: [
    ['PRODUCTION WORKFLOW','','','',''],
    ['Stage','Owner','What Happens','Handoff','SLA'],
    ['1. Idea','Creative Lead','Pick pillar, write title + hook','Status = Scripting','Ongoing'],
    ['2. Scripting','Creative Lead','Write hook + on-screen text + shot list','Shot list ready','1 day'],
    ['3. Shooting','Producer','Capture footage, log in Raw Assets','Asset IDs added','Next shoot day'],
    ['4. Editing','Editor','Cut Reel, captions, brand kit','Draft in Drive','2 days'],
    ['5. Caption','Editor','Write caption + hashtags + CTA','Caption Ready = Yes','Same as edit'],
    ['6. Review','Creative Lead','Approve or send back','Scheduled/Rework','1 day'],
    ['7. Publish','Editor','Schedule at planned time','Status Posted','On date'],
    ['8. Engage','All 3','Reply to comments first 60 min','-','First hour'],
    ['9. Log Results','Creative Lead','Fill Metrics after 48h','-','Weekly'],
    ['','','','',''],
    ['WEEKLY RITUALS','','','',''],
    ['Monday','Planning call — fill next 2 weeks','All 3','30 min',''],
    ['Wednesday','Shoot day — batch capture','Producer','Half day',''],
    ['Friday','Edit + schedule the week','Editor','Half day',''],
    ['Sunday','Metrics review + note wins','Creative Lead','20 min','']
  ]},
  { name: '📈 Metrics', header: true, rows: [
    ['Week #','Week Start','Followers','Net New','Target (cumulative)','On Track?','Posts','Reels','Total Reach','Best Post','Saves','Shares','Notes & Learnings'],
    ['0','2026-05-04','>> BASELINE <<','-','BASELINE','-','-','-','-','-','-','-','Set baseline'],
    ['1','2026-05-11','','','+350','','','','','','','',''],
    ['2','2026-05-18','','','+700','','','','','','','',''],
    ['4','2026-06-01','','','+1400','','','','','','','',''],
    ['8','2026-06-29','','','+2800','','','','','','','',''],
    ['12','2026-07-27','','','+4200','','','','','','','',''],
    ['20','2026-09-21','','','+7000','','','','','','','',''],
    ['26','2026-11-02','','','+9100','','','','','','','','Diwali push — go daily'],
    ['40','2027-02-08','','','+14000','','','','','','','',''],
    ['52','2027-05-03','','','+18200','','','','','','','','']
  ]},
  { name: '# Caption & Hashtag Bank', header: true, rows: [
    ['Section','Item','Content','When To Use'],
    ['HOOK','Curiosity','Your [room] is missing ONE thing...','Reveals'],
    ['HOOK','Problem','Why does your house feel dark/small?','Educational'],
    ['HOOK','Bold','Stop doing this in your [room]. Please.','Memes'],
    ['HOOK','Number','5 things every North Indian home needs','Listicles'],
    ['HOOK','Myth','Vastu says X. Here is the truth.','Vastu'],
    ['CTA','Save','Save this before your next renovation','Educational'],
    ['CTA','DM','DM us [KEYWORD] and we will help you plan it','Lead-gen'],
    ['CTA','Follow','Follow @slate.concepts for the full series','Series'],
    ['HASHTAG','SET-Design','#interiordesign #interiordesignindia #gurgaoninteriors #luxuryinteriors #homedecorindia #modernhome #slateconcepts','Showcase'],
    ['HASHTAG','SET-Educational','#interiordesigntips #renovationtips #homedesignideas #northindiahomes #interiorinspo #slateconcepts','Tips'],
    ['HASHTAG','SET-Festival','#diwalidecor #festivehome #indianfestivals #homedecorindia #diwali2026 #slateconcepts','Festivals'],
    ['NOTE','Strategy','Use 8-15 tags. Mix big + niche + branded. Rotate sets.','']
  ]}
];
