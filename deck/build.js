const pptxgen = require('pptxgenjs');
const React = require('react'); const RDS = require('react-dom/server'); const sharp = require('sharp');
const fa = require('react-icons/fa');
const { applyTheme } = require('/root/.claude/skills/synced/b69c1f19-a5f1-49d6-afa9-57356bf7328d_65c1b891-339c-431d-ab15-1f06daf23283/pptx/scripts/apply_theme.js');
const THEME = { name: "Gender Roles", headFontFace: "Cambria", bodyFontFace: "Calibri",
  colors: { dk1:"2B2240", lt1:"FFFFFF", dk2:"3D2C5E", lt2:"F1EEF6", accent1:"2A9D8F", accent2:"E76F51", accent3:"E9C46A", accent4:"6C5B9E", accent5:"8AB17D", accent6:"264653", hlink:"2A9D8F", folHlink:"6C5B9E" } };
async function icon(name, color) {
  const svg = RDS.renderToStaticMarkup(React.createElement(fa[name], { color: "#"+color, size: 256 }));
  return "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
}
(async () => {
const pres = new pptxgen(); pres.layout = "LAYOUT_WIDE"; pres.theme = { headFontFace: "Cambria", bodyFontFace: "Calibri" };
pres.title = "Gender Roles and Expectations";
const C = pres.SchemeColor;
pres.defineSlideMaster({ title: "DARK", background: { color: THEME.colors.dk2 }, objects: [
  { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.3, w: 11.7, h: 1.6, fontSize: 48, bold: true, color: C.background1 }, text: "" } },
  { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.0, w: 11.7, h: 1.2, fontSize: 20, color: C.background2 }, text: "" } } ] });
pres.defineSlideMaster({ title: "CONTENT", background: { color: C.background1 }, slideNumber: { x: 12.3, y: 7.0, fontSize: 10, color: C.accent4 }, objects: [
  { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.4, w: 12.1, h: 0.9, fontSize: 36, bold: true, color: C.text2 }, text: "" } } ] });

const circle = async (s, x, y, d, name, fill) => {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
  s.addImage({ data: await icon(name, "FFFFFF"), x: x + d*0.25, y: y + d*0.25, w: d*0.5, h: d*0.5 });
};
const card = (s, x, y, w, h, fill = C.background2) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: fill }, shadow: { type: "outer", blur: 6, offset: 2, angle: 90, color: "000000", opacity: 0.15 } });
const txt = (s, t, o) => s.addText(t, { isTextBox: true, valign: "top", margin: 0, fontSize: 15, color: C.text1, ...o });
const S = (sec, m = "CONTENT") => { const s = pres.addSlide({ masterName: m, sectionTitle: sec }); return s; };

// 1 Title
pres.addSection({ title: "Introduction" });
let s = S("Introduction", "DARK");
s.addText("Gender Roles and Expectations", { placeholder: "title" });
s.addText("An introduction for a general audience: what they are, where they come from, and why they matter", { placeholder: "body" });
const ic = ["FaVenus","FaMars","FaGenderless","FaUsers"];
for (let i=0;i<4;i++) await circle(s, 0.8 + i*1.1, 1.0, 0.85, ic[i], [C.accent1,C.accent2,C.accent3,C.accent4][i]);
s.addNotes("Every society has ideas about how men and women should behave, what work they should do, and what they should value. This presentation explains these ideas in neutral terms, separates research findings from theory and opinion, and notes where experts disagree.");

// 2 Definitions
pres.addSection({ title: "1. Definition" });
s = S("1. Definition"); s.addText("Sex, gender roles, and gender expectations", { placeholder: "title" });
const defs = [
 ["FaDna", C.accent1, "Biological sex", "Physical traits such as chromosomes, hormones, and reproductive anatomy. Usually recorded as female or male; a small share of people have intersex variations."],
 ["FaTheaterMasks", C.accent2, "Gender roles", "The behaviours, jobs, and responsibilities a society associates with being a man or a woman, e.g. who earns, who cooks, who leads."],
 ["FaClipboardList", C.accent4, "Gender expectations", "The social pressure behind roles: the norms people feel they should meet, and the approval or disapproval they get when they do or don't."]];
for (let i=0;i<3;i++){ const x=0.6+i*4.15; card(s,x,1.6,3.85,4.6); await circle(s,x+0.3,1.9,0.9,defs[i][0],defs[i][1]);
  txt(s, defs[i][2], { x:x+0.3,y:3.0,w:3.3,h:0.5,fontSize:22,bold:true,fontFace:"Cambria",color:C.text2 });
  txt(s, defs[i][3], { x:x+0.3,y:3.6,w:3.3,h:2.4 }); }
txt(s, "Key distinction: sex is largely biological; roles and expectations are learned and change over time and place.", { x:0.6,y:6.5,w:12,h:0.5,italic:true,color:C.accent4,fontSize:16 });
s.addNotes("Social scientists widely use 'sex' for biology and 'gender' for social and cultural meanings. How much biology shapes average behavioural differences is still debated; most researchers see an interaction of biology and environment.");

// 3 History
pres.addSection({ title: "2. History" });
s = S("2. History"); s.addText("Roles have shifted across eras and cultures", { placeholder: "title" });
s.addShape(pres.shapes.LINE, { x:0.9,y:2.55,w:11.5,h:0, line:{ color:C.accent4, width:3 } });
const eras = [
 ["Foraging societies","Anthropologists find work was often divided by sex, but women's gathering frequently supplied much of the food; recent studies show women also hunted in many groups (still debated)."],
 ["Agrarian & ancient states","Property and inheritance laws often favoured men. Yet variety existed: Spartan women managed estates; Haudenosaunee women chose clan leaders."],
 ["Industrial era (1800s)","Paid work moved out of the home, popularising the 'male breadwinner, female homemaker' ideal, though working-class women kept working for wages."],
 ["20th century to today","Wartime labour, suffrage movements, contraception, and rising education brought women into paid work and public life at scale."]];
for (let i=0;i<4;i++){ const x=0.6+i*3.1; s.addShape(pres.shapes.OVAL,{x:x+1.15,y:2.3,w:0.5,h:0.5,fill:{color:[C.accent1,C.accent2,C.accent3,C.accent4][i]},line:{color:C.background1,width:2}});
  card(s,x,3.1,2.85,3.9); txt(s,eras[i][0],{x:x+0.2,y:3.3,w:2.45,h:0.7,fontSize:18,bold:true,fontFace:"Cambria",color:C.text2});
  txt(s,eras[i][1],{x:x+0.2,y:4.05,w:2.45,h:2.8,fontSize:14}); }
txt(s,"Ancient   →   Modern",{x:0.6,y:1.55,w:5,h:0.4,fontSize:14,italic:true,color:C.accent4});
s.addNotes("History shows roles are not fixed. Some examples: the Haudenosaunee (Iroquois) clan mothers held political power; in the Industrial Revolution the idea of 'separate spheres' spread among the middle classes; World War II drew millions of women into factories. Interpretations of prehistoric divisions of labour are actively debated.");

// 4 Learning
pres.addSection({ title: "3. How roles are learned" });
s = S("3. How roles are learned"); s.addText("How roles are learned: socialisation", { placeholder: "title" });
txt(s,"Socialisation is the process by which people learn the norms of their society, starting in early childhood.",{x:0.6,y:1.4,w:12,h:0.5,fontSize:16});
const ag = [["FaHome","Family","Chores, toys, and praise often differ by sex; children also copy what parents do."],
 ["FaSchool","Schools","Teacher attention, subject 'fit', and peer culture can steer interests."],
 ["FaTv","Media","Ads, films, and social media repeat images of who is a hero, carer, or expert."],
 ["FaUserFriends","Peers","Friends reward 'fitting in' and can tease those who don't, especially in adolescence."],
 ["FaPrayingHands","Religion","Many traditions teach views on family roles; interpretations range from traditional to egalitarian."]];
for (let i=0;i<5;i++){ const x=0.6+i*2.5; await circle(s,x+0.65,2.2,1.0,ag[i][0],[C.accent1,C.accent2,C.accent6,C.accent4,C.accent5][i]);
  txt(s,ag[i][1],{x,y:3.4,w:2.3,h:0.5,fontSize:20,bold:true,align:"center",fontFace:"Cambria",color:C.text2});
  txt(s,ag[i][2],{x:x+0.05,y:4.0,w:2.2,h:2.0,fontSize:14}); }
txt(s,"Theories differ on emphasis: social learning theory stresses imitation and reward; cognitive theories stress children actively sorting the world into categories; biosocial models add biological influences.",{x:0.6,y:6.1,w:12.1,h:0.9,italic:true,fontSize:14,color:C.accent4});

// 5 Culture
pres.addSection({ title: "4. Cultural variation" });
s = S("4. Cultural variation"); s.addText("Where cultures differ, and where they overlap", { placeholder: "title" });
card(s,0.6,1.6,5.9,5.2); card(s,6.8,1.6,5.9,5.2);
await circle(s,0.9,1.85,0.8,"FaGlobeAfrica",C.accent2); await circle(s,7.1,1.85,0.8,"FaHandsHelping",C.accent1);
txt(s,"Differences",{x:1.9,y:2.0,w:4,h:0.5,fontSize:22,bold:true,fontFace:"Cambria",color:C.text2});
txt(s,"Overlaps",{x:8.1,y:2.0,w:4,h:0.5,fontSize:22,bold:true,fontFace:"Cambria",color:C.text2});
const bl = a => a.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<a.length-1}}));
txt(s,bl(["Women's paid-work rates vary widely, from under 20% in some countries to over 60% in others (ILO data)",
 "Some cultures recognise more than two gender categories, e.g. hijra in South Asia, fa'afafine in Samoa",
 "Matrilineal societies (e.g. the Minangkabau of Indonesia) pass property through women",
 "Laws on inheritance, dress, and divorce differ greatly"]),{x:0.9,y:2.9,w:5.3,h:3.8,paraSpaceAfter:8});
txt(s,bl(["Caregiving for young children falls mostly to women in nearly every society surveyed",
 "Leadership and warfare have often been male-dominated",
 "Unpaid domestic work is unequally shared almost everywhere, though gaps vary in size",
 "Researchers debate whether overlaps reflect biology, shared economic history, or both"]),{x:7.1,y:2.9,w:5.3,h:3.8,paraSpaceAfter:8});

// 6 Effects
pres.addSection({ title: "5. Effects on individuals" });
s = S("5. Effects on individuals"); s.addText("How rigid expectations can affect people", { placeholder: "title" });
const fx = [["FaBriefcase","Work","Occupations stay segregated (e.g. nursing vs. engineering). Women do more unpaid care work; men may face stigma taking parental leave."],
 ["FaGraduationCap","Education","In many countries girls now outperform boys in reading and graduate university at higher rates, while remaining under-represented in fields like computing."],
 ["FaHeartbeat","Health","Men are less likely to seek medical or mental-health help; in the US men die by suicide about four times as often as women (CDC). Women report higher rates of depression and anxiety."],
 ["FaHeart","Relationships","Strict scripts can limit how partners share chores, money, and emotions. Research links more equal sharing with higher satisfaction for many couples, though results vary."]];
for (let i=0;i<4;i++){ const x=0.6+(i%2)*6.2, y=1.55+Math.floor(i/2)*2.75; card(s,x,y,5.9,2.5);
  await circle(s,x+0.3,y+0.3,0.85,fx[i][0],[C.accent1,C.accent2,C.accent4,C.accent6][i]);
  txt(s,fx[i][1],{x:x+1.4,y:y+0.3,w:4.2,h:0.45,fontSize:20,bold:true,fontFace:"Cambria",color:C.text2});
  txt(s,fx[i][2],{x:x+1.4,y:y+0.8,w:4.25,h:1.6,fontSize:14}); }
s.addNotes("These are average patterns; individuals vary widely. Causes are often multiple: for example, men's lower help-seeking is linked in research to norms about self-reliance, but access, cost, and other factors matter too.");

// 7 Trends
pres.addSection({ title: "6. Current trends" });
s = S("6. Current trends"); s.addText("Changing attitudes and laws, and ongoing debate", { placeholder: "title" });
await circle(s,0.6,1.6,0.8,"FaBalanceScale",C.accent1);
txt(s,"What has changed (established)",{x:1.6,y:1.75,w:5,h:0.5,fontSize:20,bold:true,fontFace:"Cambria",color:C.text2});
txt(s,bl(["Equal-pay and anti-discrimination laws in most countries","Paid parental leave, including leave reserved for fathers in places like Sweden and Norway","Surveys (e.g. Pew, World Values Survey) show wider support for shared roles, especially among younger people","Women now hold a growing share of parliamentary seats worldwide (about 27%, IPU)"]),{x:0.6,y:2.6,w:6.1,h:4.3,paraSpaceAfter:8});
card(s,7.0,1.5,5.7,5.4,C.text2);
await circle(s,7.3,1.8,0.8,"FaComments",C.accent2);
txt(s,"Where debate continues",{x:8.3,y:1.95,w:4.2,h:0.5,fontSize:20,bold:true,fontFace:"Cambria",color:C.background1});
txt(s,bl(["How much of the remaining pay gap reflects discrimination versus choices and constraints","The balance of biological and social causes of average differences","Policies on gender identity in schools, sport, and law","Whether traditional roles should be protected, adapted, or set aside: views differ by culture, religion, and politics"]),{x:7.3,y:2.85,w:5.1,h:3.9,paraSpaceAfter:8,color:C.background1});

// 8 Takeaways
pres.addSection({ title: "7. Key takeaways" });
s = S("7. Key takeaways","DARK");
txt(s,"Key takeaways",{x:0.8,y:0.6,w:11,h:0.9,fontSize:40,bold:true,fontFace:"Cambria",color:C.background1});
const tk=[["FaDna","Sex is largely biological; gender roles are social and learned."],["FaHistory","Roles have changed many times across history and cultures."],["FaHome","Family, school, media, peers, and religion all teach expectations."],["FaBalanceScale","Rigid expectations can limit both men and women in work, health, and relationships."],["FaComments","Laws and attitudes are shifting, but real debates remain."]];
for (let i=0;i<5;i++){ const y=1.75+i*1.05; await circle(s,0.9,y,0.75,tk[i][0],[C.accent1,C.accent2,C.accent3,C.accent5,C.accent4][i]);
  txt(s,tk[i][1],{x:1.95,y:y+0.17,w:10.5,h:0.5,fontSize:20,color:C.background1}); }

// 9 Sources
pres.addSection({ title: "Further reading" });
s = S("Further reading"); s.addText("Explore further", { placeholder: "title" });
const src=[["FaBook","UN Women: Progress of the World's Women","Global data on work, law, and family"],["FaChartBar","World Economic Forum: Global Gender Gap Report","Annual country rankings across four areas"],["FaGlobe","World Values Survey","Search: \"World Values Survey gender attitudes\""],["FaUniversity","Pew Research Center","Search: \"Pew gender roles survey\""],["FaSearch","Search term","\"socialization and gender roles research\""]];
for (let i=0;i<5;i++){ const y=1.55+i*1.1; card(s,0.6,y,12.1,0.9); await circle(s,0.8,y+0.1,0.7,src[i][0],[C.accent1,C.accent2,C.accent4,C.accent6,C.accent5][i]);
  txt(s,src[i][1],{x:1.75,y:y+0.22,w:6.3,h:0.5,fontSize:18,bold:true,color:C.text2}); txt(s,src[i][2],{x:8.0,y:y+0.25,w:4.5,h:0.5,fontSize:14,color:C.accent4}); }

await pres.writeFile({ fileName: "gender-roles.pptx" }); await applyTheme("gender-roles.pptx", THEME);
})();
