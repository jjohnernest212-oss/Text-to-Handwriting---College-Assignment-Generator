import { HandwritingFont, InkPreset, PageSettings, AssignmentPreset } from './types';

export const BUILT_IN_FONTS: HandwritingFont[] = [
  {
    id: 'kalam',
    name: 'Kalam (Indian Student Style)',
    fontFamily: "'Kalam', cursive",
    category: 'neat',
  },
  {
    id: 'caveat',
    name: 'Caveat (Natural Notebook)',
    fontFamily: "'Caveat', cursive",
    category: 'casual',
  },
  {
    id: 'indie-flower',
    name: 'Indie Flower (Relaxed Pen)',
    fontFamily: "'Indie Flower', cursive",
    category: 'casual',
  },
  {
    id: 'shadows',
    name: 'Shadows Into Light (Clean Rounded)',
    fontFamily: "'Shadows Into Light', cursive",
    category: 'neat',
  },
  {
    id: 'patrick-hand',
    name: 'Patrick Hand (Classroom Notes)',
    fontFamily: "'Patrick Hand', cursive",
    category: 'neat',
  },
  {
    id: 'homemade-apple',
    name: 'Homemade Apple (Classic Cursive)',
    fontFamily: "'Homemade Apple', cursive",
    category: 'cursive',
  },
  {
    id: 'reenie-beanie',
    name: 'Reenie Beanie (Quick Ballpoint Scribe)',
    fontFamily: "'Reenie Beanie', cursive",
    category: 'messy',
  },
  {
    id: 'mansalva',
    name: 'Mansalva (Loose Nib Pen)',
    fontFamily: "'Mansalva', cursive",
    category: 'messy',
  },
  {
    id: 'nanum-pen',
    name: 'Nanum Pen Script (Rapid Ink Flow)',
    fontFamily: "'Nanum Pen Script', cursive",
    category: 'casual',
  },
  {
    id: 'just-another-hand',
    name: 'Just Another Hand (Tall Student Notes)',
    fontFamily: "'Just Another Hand', cursive",
    category: 'messy',
  },
  {
    id: 'gloria',
    name: 'Gloria Hallelujah (Felt-tip Marker)',
    fontFamily: "'Gloria Hallelujah', cursive",
    category: 'casual',
  },
  {
    id: 'architects',
    name: 'Architects Daughter (Draftsman Script)',
    fontFamily: "'Architects Daughter', cursive",
    category: 'neat',
  },
];

export const INK_PRESETS: InkPreset[] = [
  {
    name: 'Royal Blue Gel Pen',
    color: '#002699',
    type: 'gel',
    opacity: 0.95,
  },
  {
    name: 'Pilot Navy Blue',
    color: '#1a365d',
    type: 'gel',
    opacity: 0.92,
  },
  {
    name: 'Reynolds Ballpoint Blue',
    color: '#1d4ed8',
    type: 'ballpoint',
    opacity: 0.88,
  },
  {
    name: 'Exam Black Ink',
    color: '#111827',
    type: 'ballpoint',
    opacity: 0.96,
  },
  {
    name: 'Dark Charcoal Gel',
    color: '#1e293b',
    type: 'gel',
    opacity: 0.94,
  },
  {
    name: 'Prof Correction Red',
    color: '#b91c1c',
    type: 'ballpoint',
    opacity: 0.9,
  },
  {
    name: 'Fountain Green',
    color: '#166534',
    type: 'fountain',
    opacity: 0.92,
  },
  {
    name: '2B Graphite Pencil',
    color: '#475569',
    type: 'pencil',
    opacity: 0.82,
  },
];

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  fontId: 'kalam',
  fontSize: 18,
  lineHeight: 28,
  letterSpacing: 0.5,
  wordSpacing: 2,
  inkColor: '#002699',
  inkThickness: 1.0,
  inkOpacity: 0.94,
  paperType: 'ruled',
  topMargin: 56,
  leftMargin: 65,
  rightMargin: 40,
  bottomMargin: 48,
  showMarginLine: true,
  marginLinePosition: 58,
  marginLineColor: '#ef4444',
  paperEffect: 'subtle-shadow',
  humanJitter: true,
  jitterIntensity: 2,
  paperTilt: 0,
  snapLinesToText: true,
  inkBlots: true, // Default to true so users immediately enjoy the realistic handwriting ink smudge artifacts
  inkBlotIntensity: 2,
  inkBlotSeed: 42,
};

export const DEFAULT_STUDENT_HEADER = {
  enabled: true,
  name: 'Alex Johnson',
  rollNo: 'CS-2024-042',
  subject: 'Physics & Classical Mechanics (PHY-101)',
  date: 'October 15, 2026',
  showPageNumber: true,
};

export const ASSIGNMENT_PRESETS: AssignmentPreset[] = [
  {
    id: 'physics',
    title: "Physics: Newton's Laws & Friction",
    subject: 'Physics 101',
    description: 'Mechanics assignment with definitions, formula derivations, and problem solving.',
    recommendedFont: 'kalam',
    recommendedInk: '#002699',
    recommendedPaper: 'ruled',
    content: `ASSIGNMENT #3: MECHANICS & DYNAMICS

Question 1: State and explain Newton's Second Law of Motion.
Newton's Second law states that the rate of change of momentum of a body is directly proportional to the applied unbalanced force and takes place in the direction of the force.

Mathematically:
F = dp/dt
Since p = m * v (where m is constant mass):
F = m * (dv/dt)
Therefore, F = m * a

Here:
- F represents the net external force applied (in Newtons, N)
- m is the mass of the object (in kg)
- a is the resulting acceleration produced (in m/s²)

Question 2: Distinguish between Static and Kinetic Friction.
Static friction is the frictional force that comes into play when there is an applied force tending to cause motion, but the body has not started moving.
The maximum value of static friction is called Limiting Friction (f_s_max = μ_s * N).

Kinetic friction (or dynamic friction) is the opposing force experienced when two surfaces are in relative sliding motion against each other (f_k = μ_k * N).
Always remember: μ_k < μ_s because it takes more force to break surface interlocks than to keep them moving!

---page---
Question 3: Derivation of Terminal Velocity of a Sphere falling in a Viscous Medium.

Consider a small spherical body of radius 'r' and density 'ρ' falling freely through a viscous fluid of density 'σ' and coefficient of viscosity 'η'.

Forces acting on the sphere:
1. Downward gravitational force:
   W = mg = (4/3) * π * r³ * ρ * g
2. Upward buoyant force (Archimedes' Principle):
   F_b = (4/3) * π * r³ * σ * g
3. Upward viscous drag force (Stokes' Law):
   F_v = 6 * π * η * r * v

When the sphere attains constant terminal velocity (v_t), the net downward force is balanced by the total upward forces:
W = F_b + F_v

(4/3) * π * r³ * ρ * g = (4/3) * π * r³ * σ * g + 6 * π * η * r * v_t
6 * π * η * r * v_t = (4/3) * π * r³ * (ρ - σ) * g

Solving for terminal velocity v_t:
v_t = [2 * r² * (ρ - σ) * g] / [9 * η]

Conclusion:
The terminal velocity is directly proportional to the square of radius of the sphere and inversely proportional to viscosity.`,
  },
  {
    id: 'cs',
    title: 'Computer Science: Binary Search Trees',
    subject: 'Data Structures & Algorithms',
    description: 'DSA college assignment explaining BST operations, search complexities, and tree traversals.',
    recommendedFont: 'caveat',
    recommendedInk: '#111827',
    recommendedPaper: 'ruled',
    content: `DATA STRUCTURES & ALGORITHMS - ASSIGNMENT 4

Topic: Binary Search Trees (BST) & Traversal Algorithms

1. Definition of Binary Search Tree:
A Binary Search Tree is a node-based binary tree data structure where each node has at most two children. For every node 'N':
- Every key in the left subtree is strictly less than N.key
- Every key in the right subtree is strictly greater than N.key
- Both left and right subtrees must also be binary search trees.

2. Time Complexity Analysis:
- Search Operation:
  Average case: O(log n)
  Worst case (skewed tree): O(n)
- Insertion Operation:
  Average case: O(log n)
  Worst case: O(n)
- Deletion Operation:
  Average case: O(log n)
  Worst case: O(n)

To avoid O(n) worst-case degradation in degenerate trees, self-balancing BSTs like AVL Trees and Red-Black Trees perform tree rotations to guarantee O(log n) height.

---page---
3. Tree Traversal Algorithms:

a) Inorder Traversal (Left -> Root -> Right):
Produces non-decreasing order of elements for BSTs!
Algorithm:
void inorder(Node root) {
    if (root == null) return;
    inorder(root.left);
    print(root.val + " ");
    inorder(root.right);
}

b) Preorder Traversal (Root -> Left -> Right):
Useful for serializing and cloning tree structures.

c) Postorder Traversal (Left -> Right -> Root):
Essential for deleting tree nodes bottom-up without memory leaks.

Summary:
BSTs provide efficient dynamic sets supporting lookup, insert, and delete in logarithmic time when balanced properly.`,
  },
  {
    id: 'biology',
    title: 'Biology: Cellular Respiration & ATP Synthesis',
    subject: 'Biochemistry 201',
    description: 'Detailed lab notes on Glycolysis, Krebs cycle, and oxidative phosphorylation.',
    recommendedFont: 'patrick-hand',
    recommendedInk: '#1a365d',
    recommendedPaper: 'college-ruled',
    content: `LAB EXPERIMENT & REPORT: CELLULAR METABOLISM

Aim:
To study the metabolic pathway of cellular respiration and analyze net ATP yield per glucose molecule.

1. Introduction:
Cellular respiration is a series of metabolic reactions taking place in cells to convert biochemical energy from nutrients into Adenosine Triphosphate (ATP), and release waste products.

The overall chemical equation:
C6H12O6 + 6 O2  -->  6 CO2 + 6 H2O + ~30-32 ATP + Heat

2. Key Stages of Respiration:
Stage 1: Glycolysis (Cytoplasm)
- Glucose (6C) is cleaved into two molecules of Pyruvate (3C).
- Net yield: 2 ATP (via substrate-level phosphorylation) and 2 NADH.
- Does not require oxygen (anaerobic).

Stage 2: Pyruvate Oxidation (Mitochondrial Matrix)
- Each pyruvate is converted to Acetyl-CoA with the release of CO2.
- Generates 1 NADH per pyruvate (2 NADH per glucose).

---page---
Stage 3: Citric Acid Cycle / Krebs Cycle (Mitochondrial Matrix)
- Acetyl-CoA combines with Oxaloacetate to form Citrate.
- Through enzymatic steps, produces:
  2 ATP/GTP + 6 NADH + 2 FADH2 + 4 CO2 (per glucose)

Stage 4: Oxidative Phosphorylation & Chemiosmosis
- High energy electrons transferred through Complex I to IV in the inner mitochondrial membrane.
- H+ ions are pumped into the intermembrane space, creating a steep proton gradient.
- ATP Synthase acts as a molecular turbine, utilizing proton motive force to synthesize ATP from ADP and Pi.

Net ATP Production Summary:
- Glycolysis: 2 ATP + 2 NADH (~3 or 5 ATP)
- Pyruvate Decarboxylation: 2 NADH (~5 ATP)
- Krebs Cycle: 2 ATP + 6 NADH (~15 ATP) + 2 FADH2 (~3 ATP)
Theoretical Total: 30 to 32 ATP molecules.`,
  },
  {
    id: 'essay',
    title: 'Literature: The Evolution of Modernist Poetry',
    subject: 'English Literature',
    description: 'Handwritten analytical essay with vintage paper styling and cursive ink.',
    recommendedFont: 'homemade-apple',
    recommendedInk: '#111827',
    recommendedPaper: 'vintage',
    content: `THE FRACTURED REFLECTION: MODERNIST POETRY

In the aftermath of the First World War, the comfortable certainties of Victorian romanticism shattered irrevocably. Modernist poets abandoned traditional meter and pastoral idealism in favor of fragmented syntax, juxtaposition, and alienation.

As T.S. Eliot famously declared in 'The Waste Land':
"These fragments I have shored against my ruins."

The modernist movement reflected an industrial world grappling with mechanized warfare, rapid urban density, and spiritual disillusionment. Rather than presenting a unified narrative, writers like Ezra Pound and Wallace Stevens demanded that readers assemble meaning from broken shards of imagery.

The rhythmic cadence of the verse mirrored the syncopated pulse of modern machinery and jazz, permanently redefining the artistic landscape of the twentieth century.`,
  },
];
