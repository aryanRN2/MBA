import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  ExternalLink,
  Download,
  Calculator,
  Brain,
  BookText,
  BarChart3,
  BookmarkCheck,
  Search,
  Lightbulb,
} from 'lucide-react';
import { MathRenderer } from './MathRenderer';

interface NotesTopic {
  id: string;
  category: 'quant' | 'reasoning' | 'verbal' | 'di' | 'syllabus';
  title: string;
  summary: string;
  content: string;
}

const NOTES_DATA: NotesTopic[] = [
  // --- QUANTITATIVE APTITUDE ---
  {
    id: 'quant-percentages',
    category: 'quant',
    title: 'Percentages & Fraction Equivalents',
    summary: 'Essential fraction-to-percentage conversions and change formulas.',
    content: `### Standard Fraction Equivalents
- $\\frac{1}{2} = 50\\%$ | $\\frac{1}{3} = 33.33\\%$ | $\\frac{1}{4} = 25\\%$
- $\\frac{1}{5} = 20\\%$ | $\\frac{1}{6} = 16.67\\%$ | $\\frac{1}{7} = 14.28\\%$
- $\\frac{1}{8} = 12.5\\%$ | $\\frac{1}{9} = 11.11\\%$ | $\\frac{1}{10} = 10\\%$
- $\\frac{1}{11} = 9.09\\%$ | $\\frac{1}{12} = 8.33\\%$ | $\\frac{1}{16} = 6.25\\%$ | $\\frac{1}{20} = 5\\%$

### Key Formulas:
- **Percentage Increase / Decrease**:
  $$\\text{Percentage Change} = \\frac{\\text{Change}}{\\text{Initial Value}} \\times 100$$
- **Successive Percentage Change**:
  $$\\text{Net Change} = \\left(a + b + \\frac{a \\times b}{100}\\right)\\%$$
- If the price of a commodity increases by $R\\%$, reduction in consumption to keep expenditure constant:
  $$\\text{Reduction} = \\left(\\frac{R}{100 + R} \\times 100\\right)\\%$$`
  },
  {
    id: 'quant-profit-loss',
    category: 'quant',
    title: 'Profit, Loss & Discount',
    summary: 'CP, SP, Marked Price, and Successive Discounts.',
    content: `### Basic Definitions & Formulas:
- $\\text{Gain} = \\text{SP} - \\text{CP}$ (when $\\text{SP} > \\text{CP}$)
- $\\text{Loss} = \\text{CP} - \\text{SP}$ (when $\\text{CP} > \\text{SP}$)
- $\\text{Gain}\\% = \\frac{\\text{Gain}}{\\text{CP}} \\times 100$
- $\\text{Loss}\\% = \\frac{\\text{Loss}}{\\text{CP}} \\times 100$
- $\\text{SP} = \\text{CP} \\times \\left(\\frac{100 + \\text{Gain}\\%}{100}\\right) = \\text{CP} \\times \\left(\\frac{100 - \\text{Loss}\\%}{100}\\right)$

### Discount & Marked Price (MP):
- $\\text{Discount} = \\text{MP} - \\text{SP}$
- $\\text{Discount}\\% = \\frac{\\text{Discount}}{\\text{MP}} \\times 100$
- Two successive discounts of $d_1\\%$ and $d_2\\%$ are equivalent to a single discount of:
  $$\\text{Single Discount} = \\left(d_1 + d_2 - \\frac{d_1 \\times d_2}{100}\\right)\\%$$`
  },
  {
    id: 'quant-sici',
    category: 'quant',
    title: 'Simple & Compound Interest',
    summary: 'Formulas for SI, CI, and 2-year & 3-year CI-SI differences.',
    content: `### Simple Interest (SI):
$$\\text{SI} = \\frac{P \\times R \\times T}{100}$$
$$\\text{Amount } (A) = P + \\text{SI} = P\\left(1 + \\frac{R \\times T}{100}\\right)$$

### Compound Interest (CI):
$$\\text{Amount } (A) = P\\left(1 + \\frac{R}{100}\\right)^n$$
$$\\text{CI} = A - P = P\\left[\\left(1 + \\frac{R}{100}\\right)^n - 1\\right]$$

### Crucial Shortcuts:
- **Difference between CI and SI for 2 years**:
  $$\\text{Difference } (D_2) = P\\left(\\frac{R}{100}\\right)^2$$
- **Difference between CI and SI for 3 years**:
  $$\\text{Difference } (D_3) = P\\left(\\frac{R}{100}\\right)^2 \\left(3 + \\frac{R}{100}\\right)$$`
  },
  {
    id: 'quant-time-work',
    category: 'quant',
    title: 'Time, Work & Pipes-Cisterns',
    summary: 'Efficiency method, LCM approach, and alternate work cycles.',
    content: `### LCM / Efficiency Approach:
- If A completes work in $x$ days and B in $y$ days, together they complete in:
  $$\\text{Time} = \\frac{x \\times y}{x + y} \\text{ days}$$
- If A, B, and C can complete in $x, y, z$ days respectively:
  $$\\text{Time} = \\frac{xyz}{xy + yz + zx}$$

### Chain Rule (Men, Days, Hours, Work):
$$\\frac{M_1 \\times D_1 \\times H_1 \\times E_1}{W_1} = \\frac{M_2 \\times D_2 \\times H_2 \\times E_2}{W_2}$$

### Pipes & Cisterns:
- Inlet pipe rate = $+\\frac{1}{A}$ per hour.
- Outlet / Leak rate = $-\\frac{1}{B}$ per hour.
- Net filling rate = $\\left(\\frac{1}{A} - \\frac{1}{B}\\right)$ per hour.`
  },
  {
    id: 'quant-tsd',
    category: 'quant',
    title: 'Time, Speed & Distance (Trains & Boats)',
    summary: 'Relative speed, unit conversion, trains crossing, and boat streams.',
    content: `### Conversions & Base Formula:
- $\\text{Distance} = \\text{Speed} \\times \\text{Time}$
- $1 \\text{ km/h} = \\frac{5}{18} \\text{ m/s}$ | $1 \\text{ m/s} = \\frac{18}{5} \\text{ km/h}$

### Average Speed:
- If equal distance is traveled at speeds $u$ and $v$:
  $$\\text{Average Speed} = \\frac{2uv}{u + v}$$

### Relative Speed:
- Same direction: $S_{\\text{rel}} = |u - v|$
- Opposite direction: $S_{\\text{rel}} = u + v$

### Boats & Streams:
- Let speed of boat in still water = $u$, speed of stream = $v$.
- Downstream Speed ($S_d$) = $u + v$
- Upstream Speed ($S_u$) = $u - v$
- Speed of boat in still water: $u = \\frac{S_d + S_u}{2}$
- Speed of stream: $v = \\frac{S_d - S_u}{2}$`
  },
  {
    id: 'quant-mensuration',
    category: 'quant',
    title: 'Mensuration (2D & 3D Geometry)',
    summary: 'Areas, Perimeters, Volumes, and Surface areas.',
    content: `### 2D Shapes:
- **Rectangle**: $\\text{Area} = l \\times b$, $\\text{Diagonal} = \\sqrt{l^2 + b^2}$
- **Circle**: $\\text{Area} = \\pi r^2$, $\\text{Circumference} = 2\\pi r$
- **Equilateral Triangle**: $\\text{Area} = \\frac{\\sqrt{3}}{4} a^2$, $\\text{Height} = \\frac{\\sqrt{3}}{2} a$
- **Trapezium**: $\\text{Area} = \\frac{1}{2} (a + b) \\times h$

### 3D Shapes:
- **Cylinder**: $\\text{Volume} = \\pi r^2 h$, $\\text{Curved SA} = 2\\pi r h$, $\\text{Total SA} = 2\\pi r (r + h)$
- **Cone**: $\\text{Volume} = \\frac{1}{3} \\pi r^2 h$, $\\text{Slant Height } l = \\sqrt{r^2 + h^2}$, $\\text{Curved SA} = \\pi r l$
- **Sphere**: $\\text{Volume} = \\frac{4}{3} \\pi r^3$, $\\text{Total SA} = 4\\pi r^2$
- **Hemisphere**: $\\text{Volume} = \\frac{2}{3} \\pi r^3$, $\\text{Total SA} = 3\\pi r^2$`
  },

  // --- LOGICAL REASONING ---
  {
    id: 'reasoning-blood-relations',
    category: 'reasoning',
    title: 'Blood Relations & Family Tree Notation',
    summary: 'Standard symbols, generation shifts, and relationship tree rules.',
    content: `### Family Tree Notation:
- **Male**: $[+]$ or Square $(\\square)$
- **Female**: $[-]$ or Circle $(\\bigcirc)$
- **Spouse / Married Couple**: $\\iff$ (Double line)
- **Siblings**: $\\text{---}$ (Single horizontal line)
- **Generations**: Vertical arrow $\\downarrow$

### Common Relationships:
- Father's / Mother's Brother = **Uncle (Maternal / Paternal)**
- Father's / Mother's Sister = **Aunt**
- Father's / Mother's Father = **Grandfather**
- Brother's / Sister's Son = **Nephew**
- Brother's / Sister's Daughter = **Niece**
- Spouse's Mother / Father = **Mother-in-law / Father-in-law**`
  },
  {
    id: 'reasoning-directions',
    category: 'reasoning',
    title: 'Direction & Distance Sense',
    summary: '8 Compass directions, right/left turn rules, and Pythagoras distance.',
    content: `### 8 Standard Directions:
- Cardinal: **North (Top), South (Bottom), East (Right), West (Left)**
- Intercardinal: **NE, NW, SE, SW**

### Turning Rules:
- **Right Turn**: 90° Clockwise
- **Left Turn**: 90° Counter-Clockwise

### Shortest Distance (Pythagoras Theorem):
$$\\text{Distance} = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}$$

### Shadow Rules (Sun Position):
- **Morning (Sunrise in East)**: Shadow falls to the **West**.
- **Evening (Sunset in West)**: Shadow falls to the **East**.
- **Noon (12 PM)**: No shadow.`
  },
  {
    id: 'reasoning-syllogisms',
    category: 'reasoning',
    title: 'Syllogisms & Deductive Logic',
    summary: 'Venn Diagram rules for All, Some, No, and Either/Or cases.',
    content: `### Statement Types:
1. **Universal Affirmative (A)**: "All A are B" $\\implies$ Circle A inside Circle B.
2. **Universal Negative (E)**: "No A is B" $\\implies$ Separate disjoint circles with a cross.
3. **Particular Affirmative (I)**: "Some A are B" $\\implies$ Intersecting circles.
4. **Particular Negative (O)**: "Some A are not B" $\\implies$ At least part of A is outside B.

### Either/Or Complementary Pairs:
Two conclusions form an **Either/Or** pair if:
1. Both conclusions are individually false / undetermined from the basic diagram.
2. They share the exact same Subject and Predicate.
3. They form one of the pairs:
   - **Some + No**
   - **All + Some Not**`
  },

  // --- LANGUAGE & VERBAL ABILITY ---
  {
    id: 'verbal-grammar-rules',
    category: 'verbal',
    title: 'High-Frequency Grammar Rules',
    summary: 'Subject-Verb agreement, modifiers, parallelism, and prepositions.',
    content: `### 1. Subject-Verb Agreement:
- **Neither... Nor / Either... Or / Not only... But also**: The verb agrees with the **closest subject**.
  - *Example*: "Neither the teacher nor the students **were** present."
- **Words like 'As well as', 'Along with', 'Together with', 'Accompanied by'**: The verb agrees with the **first subject**.
  - *Example*: "The captain, along with the players, **is** celebrating."

### 2. Each, Every, Either, Neither:
- Always followed by a **singular verb** and singular pronoun.
  - *Example*: "Each of the participants **has** submitted **his or her** work."

### 3. Modifiers & Dangling Participles:
- A modifier must be placed right next to the word it describes.
  - *Incorrect*: "Walking in the park, the trees looked green."
  - *Correct*: "Walking in the park, **I noticed** the trees looked green."`
  },
  {
    id: 'verbal-idioms',
    category: 'verbal',
    title: 'Must-Know CUET PG Idioms & Phrases',
    summary: 'Frequent idiomatic expressions in previous year papers.',
    content: `### Essential Idioms:
- **A blessing in disguise**: Something good that isn't recognized at first.
- **Bite the bullet**: To face a difficult situation with courage.
- **Break the ice**: To make people feel more comfortable in a social setting.
- **Burn the midnight oil**: To work late into the night.
- **Cut corners**: To do something poorly to save time or money.
- **Give the cold shoulder**: To intentionally ignore or be unfriendly to someone.
- **Once in a blue moon**: Very rarely.
- **Penny for your thoughts**: Asking someone what they are thinking.
- **Put all your eggs in one basket**: Risking everything on a single venture.
- **Through thick and thin**: In both good times and bad times.`
  },

  // --- DATA INTERPRETATION ---
  {
    id: 'di-techniques',
    category: 'di',
    title: 'Data Interpretation Shortcuts & Tables',
    summary: 'Fast percentage calculation, approximation, and chart analysis.',
    content: `### Key Calculation Formulas:
1. **Percentage of Total**:
   $$\\text{Percentage} = \\frac{\\text{Component Value}}{\\text{Total Value}} \\times 100$$
2. **Percentage Increase / Growth**:
   $$\\text{Growth} = \\frac{\\text{Value}_{\\text{Final}} - \\text{Value}_{\\text{Initial}}}{\\text{Value}_{\\text{Initial}}} \\times 100$$
3. **Ratio Comparison Shortcut**:
   - To compare $\\frac{a}{b}$ vs $\\frac{c}{d}$, cross-multiply: $a \\times d$ vs $b \\times c$.
4. **Pie Chart Angle Conversion**:
   - $100\\% = 360^\\circ \\implies 1\\% = 3.6^\\circ$
   - $\\text{Value for } \\theta^\\circ = \\frac{\\theta}{360} \\times \\text{Total}$`
  },

  // --- SYLLABUS ---
  {
    id: 'official-syllabus',
    category: 'syllabus',
    title: 'Official CUET PG MBA Syllabus (COQP12)',
    summary: 'Complete topic breakdown by NTA for COQP12 paper.',
    content: `### Examination Pattern:
- **Pattern**: 75 MCQs (COQP12) | 300 Marks (+4 / -1) | 90-105 Minutes.
- **Sections**:
  1. **Language Comprehension**: English OR Hindi (Grammar, Vocabulary, RC, Para Jumbles).
  2. **Quantitative Aptitude**: Arithmetic, Algebra, Geometry, Mensuration, Number Systems.
  3. **Logical Reasoning**: Puzzles, Coding, Relations, Syllogisms, Series, Critical Reasoning.
  4. **Data Interpretation**: Tables, Line Graphs, Bar Charts, Pie Charts, Mixed Graphs.`
  }
];

interface NotesViewProps {
  onBackToHome: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'cheatsheet'>('pdf');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTopicId, setActiveTopicId] = useState<string>(NOTES_DATA[0].id);

  const pdfUrl = '/notes/Abstract_Algebra_Dummit_Foote_Monograph.pdf';

  const categories = [
    { id: 'all', label: 'All Notes', icon: BookOpen },
    { id: 'quant', label: 'Quantitative', icon: Calculator },
    { id: 'reasoning', label: 'Reasoning', icon: Brain },
    { id: 'verbal', label: 'Verbal & English', icon: BookText },
    { id: 'di', label: 'Data Interpretation', icon: BarChart3 },
    { id: 'syllabus', label: 'Syllabus', icon: BookmarkCheck },
  ];

  const filteredTopics = NOTES_DATA.filter(topic => {
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeTopic = NOTES_DATA.find(t => t.id === activeTopicId) || filteredTopics[0] || NOTES_DATA[0];

  return (
    <div className="notes-view-root">
      {/* Notes Top Navigation Bar */}
      <div className="notes-top-bar">
        <button className="nav-home-btn" onClick={onBackToHome}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        {/* View Switcher: PDF Document vs Quick Cheat Sheets */}
        <div className="notes-view-mode-tabs">
          <button
            className={`notes-mode-tab ${activeTab === 'pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('pdf')}
          >
            <FileText size={16} />
            <span>Class Notes PDF</span>
          </button>
          <button
            className={`notes-mode-tab ${activeTab === 'cheatsheet' ? 'active' : ''}`}
            onClick={() => setActiveTab('cheatsheet')}
          >
            <BookOpen size={16} />
            <span>Formula Cheat Sheets</span>
          </button>
        </div>

        {/* External PDF Action Links */}
        <div className="notes-top-actions">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="notes-action-btn"
            title="Open in new window"
          >
            <ExternalLink size={15} />
            <span>Open in New Tab</span>
          </a>
          <a
            href={pdfUrl}
            download="Abstract_Algebra_Dummit_Foote_Monograph.pdf"
            className="notes-action-btn"
            title="Download PDF"
          >
            <Download size={15} />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* PDF View Tab */}
      {activeTab === 'pdf' && (
        <div className="notes-pdf-container">
          <div className="notes-pdf-header">
            <div className="pdf-header-info">
              <FileText size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <h2 className="pdf-doc-title">Abstract Algebra — Dummit & Foote Monograph</h2>
                <p className="pdf-doc-subtitle">Official Reference Class Notes Document</p>
              </div>
            </div>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-sm"
            >
              <ExternalLink size={14} /> Fullscreen Tab
            </a>
          </div>

          <div className="pdf-viewer-frame-wrapper">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0`}
              title="Notes PDF Viewer"
              className="notes-pdf-iframe"
            />
          </div>
        </div>
      )}

      {/* Cheat Sheets & Formulas Tab */}
      {activeTab === 'cheatsheet' && (
        <>
          <div className="notes-controls-bar">
            <div className="notes-category-tabs">
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    className={`notes-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <Icon size={15} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="notes-search-wrapper">
              <Search size={15} className="notes-search-icon" />
              <input
                type="text"
                className="notes-search-input"
                placeholder="Search formulas, shortcuts, rules..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="notes-layout">
            <aside className="notes-sidebar">
              <div className="notes-sidebar-header">
                <span>Topics ({filteredTopics.length})</span>
              </div>
              <div className="notes-topic-list">
                {filteredTopics.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-400">No notes match your search.</div>
                ) : (
                  filteredTopics.map(t => (
                    <div
                      key={t.id}
                      className={`notes-topic-card ${activeTopic?.id === t.id ? 'active' : ''}`}
                      onClick={() => setActiveTopicId(t.id)}
                    >
                      <h4 className="topic-card-title">{t.title}</h4>
                      <p className="topic-card-summary">{t.summary}</p>
                    </div>
                  ))
                )}
              </div>
            </aside>

            <main className="notes-content-panel">
              {activeTopic ? (
                <article className="notes-article">
                  <header className="notes-article-header">
                    <div className="notes-badge-tag">
                      {activeTopic.category.toUpperCase()}
                    </div>
                    <h1 className="notes-article-title">{activeTopic.title}</h1>
                    <p className="notes-article-desc">{activeTopic.summary}</p>
                  </header>

                  <div className="notes-article-body">
                    <MathRenderer text={activeTopic.content} />
                  </div>

                  <div className="notes-tip-box">
                    <Lightbulb size={18} style={{ color: '#d97706', flexShrink: 0 }} />
                    <div>
                      <strong>Pro Tip for CUET PG MBA:</strong>
                      <span> Practice questions immediately after reviewing formulas to lock in retention.</span>
                    </div>
                  </div>
                </article>
              ) : (
                <div className="notes-empty-state">Select a topic from the left to view notes.</div>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
};
