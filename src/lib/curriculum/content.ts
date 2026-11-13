import type { ChapterContent } from "./types";

const light: ChapterContent = {
  slug: "light-reflection-refraction",
  bigPicture: `Light is the chapter where Class 10 physics stops being about naming things and starts being about predicting them. Everything you will be asked in the board paper comes from four ideas: light travels in straight lines, it bounces predictably off a surface, it bends predictably when it changes medium, and the shape of the surface decides where the image lands. 

The chapter exists because a huge share of the marks — ray diagrams, numericals on the mirror and lens formula, and "where is the image" questions — are all applications of those four ideas. Once you can draw three rays correctly and sign-substitute into one formula, you have covered most of the exam. The single biggest reason students lose marks is not the formula; it is the sign convention. Fix that and the chapter collapses into a manageable set of drills.`,
  prerequisites: [
    "Speed of light and the idea of a light ray (straight-line propagation)",
    "Angle measurement and basic geometry of triangles (Class 9)",
    "The difference between real and virtual objects",
    "How to read a scale — 1 cm = 10 mm, and cm ↔ m conversion for focal length",
  ],
  glossary: [
    { term: "Principal axis", definition: "The straight line through the pole of a mirror or the optical centre of a lens, perpendicular to its plane." },
    { term: "Pole (P)", definition: "The geometric centre of a spherical mirror's reflecting surface." },
    { term: "Centre of curvature (C)", definition: "Centre of the sphere of which the mirror or lens surface is a part." },
    { term: "Principal focus (F)", definition: "Point on the principal axis where rays parallel to the axis converge (concave) or appear to diverge from (convex)." },
    { term: "Focal length (f)", definition: "Distance from pole to principal focus; numerically f = R/2 for a spherical mirror." },
    { term: "Real image", definition: "An image formed by actual intersection of rays; it can be caught on a screen and is always inverted." },
    { term: "Virtual image", definition: "An image formed by apparent intersection of rays; it cannot be caught on a screen and is erect." },
    { term: "Magnification (m)", definition: "Ratio of image height to object height; m = h′/h = −v/u for a mirror." },
    { term: "Refractive index (n)", definition: "Ratio of the speed of light in vacuum to its speed in a medium; n = c/v." },
    { term: "Power of a lens (P)", definition: "Reciprocal of focal length in metres, P = 1/f; unit dioptre (D)." },
  ],
  concepts: [
    {
      heading: "Laws of reflection",
      body_md: `Two laws govern every reflection, from a mirror to a pond:

1. The **incident ray, the reflected ray and the normal** at the point of incidence all lie in the same plane.
2. The **angle of incidence equals the angle of reflection** — both measured from the normal, never from the surface.

Because the laws are measured from the normal, a grazing ray (almost along the surface) has an angle of incidence close to 90° and a *small* angle from the surface. Examiners exploit this confusion constantly. If a question says "the angle between the incident ray and the mirror is 30°", the angle of incidence is 60°, not 30°.

For a plane mirror the image is always virtual, erect, the same size, laterally inverted, and formed as far behind the mirror as the object is in front. The only thing that changes with object distance is where you stand to see it.`,
    },
    {
      heading: "Spherical mirrors and ray diagrams",
      body_md: `A concave mirror curves inward and can converge light; a convex mirror bulges outward and always diverges. Both obey the same three-ray construction, and you only need **any two** rays to fix the image:

- A ray **parallel to the axis** reflects through F (concave) or appears to come from F (convex).
- A ray **through F** reflects parallel to the axis.
- A ray **through C** (or towards C) reflects back along itself, because it strikes the surface normally.

Then the table of positions does the rest for a concave mirror:

| Object at | Image at | Nature |
|---|---|---|
| Infinity | F | Real, inverted, point |
| Beyond C | Between F and C | Real, inverted, smaller |
| At C | At C | Real, inverted, same size |
| Between C and F | Beyond C | Real, inverted, enlarged |
| At F | Infinity | Real, inverted, hugely enlarged |
| Between F and P | Behind mirror | Virtual, erect, enlarged |

A convex mirror has none of this variety: for a real object it *always* gives a virtual, erect, diminished image between P and F. That is exactly why it is used as a rear-view and shop-security mirror — you trade size for a wide field of view.`,
    },
    {
      heading: "Mirror formula, magnification and the sign convention",
      body_md: `The mirror formula ties object distance, image distance and focal length together:

$$\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}$$

with **Cartesian sign convention** (measure from the pole, along the principal axis):

- Distances measured in the direction of the incident light are **positive**; against it, **negative**.
- Therefore, for a real object, \`u\` is always negative.
- For a concave mirror (f on the same side as the object) \`f\` is negative; for a convex mirror \`f\` is positive.
- Heights above the axis are positive; below it are negative.

Magnification for a mirror is

$$m = \\frac{h'}{h} = -\\frac{v}{u}$$

A **negative m** means the image is real and inverted; a **positive m** means virtual and erect. Two checks that catch nearly every arithmetic slip: \`|m| > 1\` must correspond to an image farther from the pole than the object, and a concave mirror with an object inside F must produce a positive \`v\` (image behind the mirror).`,
    },
    {
      heading: "Refraction and Snell's law",
      body_md: `Light bends when it crosses into a medium where it travels at a different speed. Going from a rare to a dense medium (air → glass) it slows and bends **towards** the normal; going dense → rare it speeds up and bends **away**.

Snell's law makes this quantitative:

$$n_1 \\sin i = n_2 \\sin r \\qquad\\text{or}\\qquad \\frac{\\sin i}{\\sin r} = \\frac{n_2}{n_1}$$

The refractive index \`n\` is a pure number ≥ 1: air ≈ 1.0003, water ≈ 1.33, glass ≈ 1.5, diamond ≈ 2.42. A higher index means slower light in that medium.

Two consequences you must be able to name: **total internal reflection** happens only when light goes from dense to rare *and* the angle of incidence exceeds the critical angle \\(\\theta_c = \\sin^{-1}(n_2/n_1)\\); and the **apparent depth** of a pool looks shallower than it is because rays from the bottom bend away from the normal as they leave the water.`,
    },
    {
      heading: "Lenses: formula, magnification and power",
      body_md: `A converging (convex) lens behaves like a concave mirror's mirror-image problem; a diverging (concave) lens behaves like a convex mirror's. The lens formula has a different sign than the mirror formula:

$$\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}$$

Here \`f\` is **positive for a convex lens** and negative for a concave lens. Magnification for a lens is \\(m = v/u\\) (note: no minus sign, unlike the mirror).

Ray construction for a lens uses three rays: parallel-to-axis → through F; through optical centre → undeviated; through F → parallel to axis.

Power measures how sharply a lens bends light:

$$P = \\frac{1}{f\\,(\\text{m})}\\ \\text{dioptre}$$

Because f is in metres, a 50 cm focal length is \`P = 1/0.5 = +2 D\`. Two thin lenses in contact add powers: \\(P = P_1 + P_2\\). A myopic eye needs a negative power, a hypermetropic eye a positive one — the sign tells you which.`,
    },
  ],
  derivations: [
    `**Mirror formula from similar triangles.** A ray from the object tip parallel to the axis strikes the mirror and passes through F; another ray through C returns along itself. The two resulting triangles give \\(\\frac{h'}{h} = \\frac{f}{f-u}\\) from one pair and \\(\\frac{h'}{h} = -\\frac{v}{u}\\) from the other. Equating them and simplifying yields \\(\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}\\). The algebra is less important than remembering that both expressions describe the *same* magnification.`,

    `**Relationship between focal length and radius of curvature.** For a mirror, F is the midpoint of PC for paraxial rays, hence \\(f = R/2\\). A useful check: a concave mirror with R = 30 cm has f = −15 cm. If a question gives R instead of f and you forget the halving, your answer will be off by a factor of two — an easy mark to lose and an easy one to save.`,

    `**Lens maker's intuition.** For a thin lens the focal length depends on the refractive index of the glass relative to the surroundings and on how curved the two surfaces are. This is why a glass lens in water behaves like a *weaker* lens: the index difference shrinks (1.5/1.33 rather than 1.5/1.0). It also explains why the same lens has a longer focal length under water.`,
  ],
  examples: [
    {
      difficulty: "easy",
      problem_md: `An object is placed 20 cm in front of a concave mirror of focal length 15 cm. Find the image distance and magnification.`,
      solution_md: `**Signs:** u = −20 cm, f = −15 cm (concave).

Mirror formula: \\(\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u} = \\frac{1}{-15} - \\frac{1}{-20} = -\\frac{1}{15} + \\frac{1}{20}\\).

Common denominator 60: \\(\\frac{-4 + 3}{60} = -\\frac{1}{60}\\), so **v = −60 cm**.

The image forms 60 cm in front of the mirror — real and inverted.

\\(m = -v/u = -(-60)/(-20) = -3\\). Image is 3× taller and inverted.`,
    },
    {
      difficulty: "medium",
      problem_md: `A convex mirror used as a rear-view mirror has a radius of curvature of 3.0 m. A car is 5.0 m behind it. Where does the image form and how large is it?`,
      solution_md: `**Signs:** f = +R/2 = +1.5 m (convex), u = −5.0 m.

\\(\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u} = \\frac{1}{1.5} + \\frac{1}{5} = 0.6667 + 0.2 = 0.8667\\).

\\(v = +1.15\\ \\text{m}\\) — positive, so the image is behind the mirror: virtual and erect.

\\(m = -v/u = -1.15/(-5.0) = +0.23\\). The image is 0.23× the size (diminished), which matches the standard convex-mirror result and confirms the answer is physically sensible. A driver sees a wider field because everything is shrunk.`,
    },
    {
      difficulty: "medium",
      problem_md: `Light passes from air into glass with refractive index 1.5 at an angle of incidence of 30°. Find the angle of refraction.`,
      solution_md: `Snell's law: \\(1.0 \\times \\sin 30° = 1.5 \\times \\sin r\\).

\\(0.5 = 1.5 \\sin r \\Rightarrow \\sin r = 0.3333\\).

\\(r = \\sin^{-1}(0.3333) \\approx 19.5°\\).

Sanity check: entering a denser medium, the ray **must** bend towards the normal, so r < i. 19.5° < 30° ✓.`,
    },
    {
      difficulty: "hard",
      problem_md: `An object 5 cm tall is placed 10 cm from a convex lens of focal length 15 cm. Find the position, nature and size of the image.`,
      solution_md: `**Signs:** u = −10 cm, f = +15 cm (convex lens).

\\(\\frac{1}{v} = \\frac{1}{f} + \\frac{1}{u} = \\frac{1}{15} - \\frac{1}{10} = \\frac{2 - 3}{30} = -\\frac{1}{30}\\).

**v = −30 cm.** A negative image distance with a lens means the image is on the same side as the object → **virtual and erect**.

\\(m = v/u = (-30)/(-10) = +3\\). Positive m confirms virtual and erect.

Image height \\(h' = m\\,h = 3 \\times 5 = 15\\ \\text{cm}\\).

This is the magnifying-glass case: object inside the focal length gives a virtual, erect, enlarged image.`,
    },
    {
      difficulty: "hard",
      problem_md: `Two thin lenses of powers +5 D and −2 D are placed in contact. What is the focal length of the combination, and is it converging or diverging?`,
      solution_md: `Powers add: \\(P = 5 + (-2) = +3\\ \\text{D}\\).

\\(f = 1/P = 1/3\\ \\text{m} = 33.3\\ \\text{cm}\\).

Positive power and positive focal length → the combination is **converging**. Note that a student who averages 5 and −2 and gets 1.5 D has made the classic error of averaging powers instead of adding them.`,
    },
  ],
  diagram: `flowchart TD
  A[Object in front of concave mirror] --> B{Where is it?}
  B -->|Beyond C| C[Real, inverted, diminished]
  B -->|At C| D[Real, inverted, same size]
  B -->|Between C and F| E[Real, inverted, enlarged]
  B -->|At F| F[No image - rays parallel]
  B -->|Between F and P| G[Virtual, erect, enlarged]
  C --> H[Use 1/v + 1/u = 1/f]
  D --> H
  E --> H
  G --> H
  H --> I[Check sign of m]`,
  analogies: [
    "A concave mirror is a satellite dish: both take parallel incoming signals and focus them to one point. The dish's shape is not decoration — it is the whole mechanism.",
    "Sign convention is a bank statement. Money coming towards you is positive, money leaving is negative. Light travelling towards the mirror is the 'credit' direction; anything measured the other way gets a minus sign.",
    "Total internal reflection is a car hitting a speed bump at a shallow enough angle that it never climbs it and bounces back. Below the critical angle the light 'climbs' out of the medium; above it, it turns around.",
  ],
  mistakes: [
    "Measuring the angle of incidence from the mirror surface instead of from the normal. If the ray makes 30° with the mirror, i = 60°.",
    "Forgetting the minus sign on u for a real object. This single slip flips the answer's sign and the nature of the image.",
    "Using the mirror formula's signs with the lens formula. Mirror: 1/v + 1/u = 1/f, m = −v/u. Lens: 1/v − 1/u = 1/f, m = v/u.",
    "Assuming a convex mirror can form a real image of a real object. It cannot — it always diverges.",
    "Treating |m| as the size of the image rather than its ratio to the object. m = 3 means three times, not 3 cm.",
    "Adding powers as averages. Powers add; they are never averaged.",
  ],
  examPatterns: [
    { exam: "CBSE Board", years: [2024, 2023, 2022, 2020], question_types: ["Ray diagram construction (3–5 marks)", "Mirror/lens numerical (3 marks)", "Assertion–reason on virtual images (1 mark)", "Sign-convention case study"] },
    { exam: "ICSE", years: [2023, 2021], question_types: ["Diagram labelling", "Power of lens numerical"] },
    { exam: "JEE Main", years: [2024, 2023], question_types: ["Combination of lenses", "Mirror formula with magnification"] },
  ],
  mnemonics: [
    "**'C-I-N'** for the two laws: **C**oplanar, **I**ncidence = reflection, **N**ormal-based angles.",
    "**'In-Verse'** — real images are Inverted, virtual images are eRect (and Virtual = Viewing, cannot be caught).",
    "**'U-F-V folds backwards'** — for a concave mirror, as the object moves from infinity towards the pole, the image runs the opposite way, from F out past C and then behind the mirror.",
    "**'Dense = Delay'** — going into a denser medium, light Delays (slows) and bends towards the normal.",
  ],
  selfCheck: [
    { question: "A ray strikes a plane mirror at 40° to the surface. What is the angle of reflection?", answer: "The angle to the normal is 90° − 40° = 50°, so the angle of reflection is 50°." },
    { question: "Why can a convex mirror never form a real image of a real object?", answer: "Its surface diverges incoming parallel rays, so reflected rays only appear to meet behind the mirror. No actual intersection means no real image." },
    { question: "An object is exactly at the focus of a concave mirror. Where is the image?", answer: "At infinity. Reflected rays leave parallel, so no finite image forms." },
    { question: "What does a negative magnification tell you about an image?", answer: "It is real and inverted (for a mirror, m = −v/u; the sign flip comes from the image being on the same side as the object)." },
    { question: "A lens has power −4 D. What kind of lens is it and what is its focal length?", answer: "A diverging (concave) lens, because power is negative. f = 1/P = −0.25 m = −25 cm." },
  ],
  related: ["electricity"],
};

const electricity: ChapterContent = {
  slug: "electricity",
  bigPicture: `Electricity in Class 10 is really one law (Ohm's law) plus one accounting principle (charge and energy are conserved). Nearly every numerical is a circuit you simplify into an equivalent resistance, then apply V = IR and P = VI. The chapter earns its high syllabus weight because it appears in almost every board paper and forms the base for Class 12's Current Electricity and for NEET/JEE electrodynamics.

The trap is not the theory; it is the arithmetic of series and parallel networks. Learn to redraw a circuit into a clean ladder before you touch numbers, and resist the urge to compute in your head.`,
  prerequisites: [
    "Charge and the coulomb as a unit",
    "Basic algebra — solving for an unknown in V = IR",
    "Idea of potential difference from Class 9 (water-flow analogy helps)",
    "Fractions and reciprocals (needed for parallel resistance)",
  ],
  glossary: [
    { term: "Electric current (I)", definition: "Rate of flow of charge, I = Q/t, measured in amperes." },
    { term: "Potential difference (V)", definition: "Work done per unit charge to move it between two points; V = W/Q, in volts." },
    { term: "Resistance (R)", definition: "Opposition to current flow; R = V/I, in ohms (Ω)." },
    { term: "Ohm's law", definition: "At constant temperature, V ∝ I for a metallic conductor, so V = IR." },
    { term: "Resistivity (ρ)", definition: "Material property; R = ρL/A. Independent of the conductor's shape." },
    { term: "Electrical power (P)", definition: "Rate of energy transfer; P = VI = I²R = V²/R, in watts." },
    { term: "kWh", definition: "Commercial unit of energy: 1 kWh = 3.6 × 10⁶ J." },
    { term: "Ammeter", definition: "Measures current; connected in series, ideally with zero resistance." },
    { term: "Voltmeter", definition: "Measures potential difference; connected in parallel, ideally with infinite resistance." },
    { term: "Fuse", definition: "A thin wire that melts and breaks the circuit above a rated current." },
  ],
  concepts: [
    {
      heading: "Current, charge and potential difference",
      body_md: `Current is the rate at which charge passes a cross-section:

$$I = \\frac{Q}{t}$$

One ampere is one coulomb per second. Conventional current runs from + to −, even though electrons drift the other way — a convention fixed before anyone knew about electrons, and one you should simply follow in circuit diagrams.

Potential difference is the energy story: a 12 V battery gives 12 joules of energy to each coulomb it pushes around the circuit. \\(V = W/Q\\). This is why a 12 V battery and a 1.5 V cell differ not in *how much* charge they move but in how much energy each unit of charge carries.`,
    },
    {
      heading: "Ohm's law and resistance",
      body_md: `For a metallic conductor at constant temperature, current is proportional to potential difference:

$$V = IR$$

A V–I graph for a resistor is a straight line through the origin, and the **slope is R**. For a filament bulb it is not straight: as current rises the filament heats, resistance increases, and the curve flattens. That curvature is a favourite exam question.

Resistance depends on the conductor, not just the material:

$$R = \\rho\\frac{L}{A}$$

Longer wire → more resistance (more collisions). Thicker wire → less resistance (more lanes). Doubling the length doubles R; doubling the radius quarters R, because area grows with the square of the radius.`,
    },
    {
      heading: "Series and parallel combinations",
      body_md: `**Series** — one path, same current everywhere, voltages add:

$$R_s = R_1 + R_2 + R_3$$

**Parallel** — several paths, same voltage across each, currents add:

$$\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}$$

Two facts to internalise: a series combination is always **larger** than its biggest resistor, and a parallel combination is always **smaller** than its smallest resistor. If your answer violates either, you have made an error — go back before checking the arithmetic.

Household wiring is parallel so that each appliance gets the full mains voltage and can be switched independently. Your car's headlights in a series circuit would be a design failure: one bulb dies, both go dark.`,
    },
    {
      heading: "Heating effect and electrical power",
      body_md: `A resistor converts electrical energy into heat. The rate is

$$P = VI = I^2R = \\frac{V^2}{R}$$

and the heat produced in time t is \\(H = I^2Rt\\) (Joule's law). The \\(I^2R\\) form is the one to use when the current is fixed (a series circuit); the \\(V^2/R\\) form when the voltage is fixed (appliances on mains).

This is why a 100 W bulb has *lower* resistance than a 60 W bulb on the same 220 V supply: \\(R = V^2/P\\). It is also why transmission lines use very high voltage — the same power at 10× the voltage needs 1/10 the current, and losses go as \\(I^2R\\), so they fall 100×.`,
    },
  ],
  derivations: [
    `**Equivalent resistance in parallel.** Let three resistors share a common voltage V. The branch currents are \\(I_1 = V/R_1\\), \\(I_2 = V/R_2\\), \\(I_3 = V/R_3\\). Total current \\(I = I_1 + I_2 + I_3\\), and by definition \\(I = V/R_p\\). Dividing through by V gives \\(\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}\\).`,

    `**Why resistivity is independent of shape.** \\(R = \\rho L/A\\) rearranges to \\(\\rho = RA/L\\). Increasing the length increases R proportionally, and increasing the area decreases R proportionally, so the ratio is a property of the material and temperature alone. This is the difference between *resistance* (a property of an object) and *resistivity* (a property of a substance).`,

    `**Combining power relations.** From V = IR and P = VI, substituting I = V/R gives \\(P = V^2/R\\); substituting V = IR gives \\(P = I^2R\\). Both are the same statement viewed from a different known quantity — pick whichever quantity the problem fixes.`,
  ],
  examples: [
    {
      difficulty: "easy",
      problem_md: `A current of 0.5 A flows through a 12 Ω resistor for 2 minutes. How much charge passes, and how much heat is produced?`,
      solution_md: `Charge: \\(Q = It = 0.5 \\times 120 = 60\\ \\text{C}\\).

Heat: \\(H = I^2Rt = (0.5)^2 \\times 12 \\times 120 = 0.25 \\times 12 \\times 120 = 360\\ \\text{J}\\).

The trap is t in seconds. Two minutes is 120 s, not 2.`,
    },
    {
      difficulty: "medium",
      problem_md: `Three resistors of 2 Ω, 3 Ω and 6 Ω are connected in parallel across a 6 V battery. Find the equivalent resistance and total current.`,
      solution_md: `\\(\\frac{1}{R_p} = \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{6} = \\frac{3 + 2 + 1}{6} = \\frac{6}{6} = 1\\).

So **R_p = 1 Ω**. Check: the result (1 Ω) is indeed smaller than the smallest resistor (2 Ω) ✓.

\\(I = V/R_p = 6/1 = 6\\ \\text{A}\\).

Per branch: 3 A, 2 A, 1 A, summing to 6 A ✓.`,
    },
    {
      difficulty: "medium",
      problem_md: `A 60 W and a 100 W bulb are connected in series to a 220 V supply. Which glows brighter, and why?`,
      solution_md: `On mains each is designed for 220 V, so their resistances are \\(R = V^2/P\\):

60 W → \\(220^2/60 \\approx 807\\ \\Omega\\); 100 W → \\(220^2/100 = 484\\ \\Omega\\).

In series the **current is the same**, so brightness follows \\(P = I^2R\\) — the higher resistance dissipates more. The **60 W bulb glows brighter**.

This is the standard reversal: in parallel (normal household wiring) the 100 W bulb is brighter; in series it is dimmer.`,
    },
    {
      difficulty: "hard",
      problem_md: `An electric heater rated 2000 W, 220 V runs for 3 hours a day for 30 days. Calculate the energy consumed in kWh and the cost at ₹6.50 per unit.`,
      solution_md: `Daily energy \\(= 2\\ \\text{kW} \\times 3\\ \\text{h} = 6\\ \\text{kWh}\\) per day.

30 days: \\(6 \\times 30 = 180\\ \\text{kWh}\\).

Cost \\(= 180 \\times 6.50 = \\text{₹}1{,}170\\).

No need to convert to joules — the kWh is exactly the unit the bill uses. Converting to 3.6 × 10⁶ J and back is a common waste of exam time.`,
    },
  ],
  diagram: `flowchart LR
  A[Battery V] --> B[Series chain]
  B --> C[R1]
  C --> D[R2]
  D --> E[Parallel block]
  E --> F[R3]
  E --> G[R4]
  F --> H[Return to battery]
  G --> H
  H --> I[Compute equivalent R]
  I --> J[Apply V = IR]`,
  analogies: [
    "Voltage is water pressure, current is flow rate, resistance is the narrowness of the pipe. Same pump pressure through a thinner pipe gives less flow.",
    "Series is a single-lane toll road — every car passes every booth. Parallel is a multi-lane highway: more lanes, less total resistance, same speed limit (voltage) in every lane.",
    "Resistivity is the material of the pipe (copper vs rubber); resistance is the specific pipe's length and bore. You can make a copper pipe resistant by making it long enough.",
  ],
  mistakes: [
    "Forgetting to convert minutes to seconds in H = I²Rt.",
    "Adding parallel resistances directly instead of adding reciprocals.",
    "Using V²/R for brightness in a series circuit, where voltage is not fixed — use I²R.",
    "Confusing resistance with resistivity: doubling the length doubles resistance but leaves resistivity unchanged.",
    "Thinking a 100 W bulb always glows brighter than a 60 W bulb, regardless of connection.",
    "Placing an ammeter in parallel or a voltmeter in series.",
  ],
  examPatterns: [
    { exam: "CBSE Board", years: [2024, 2023, 2022], question_types: ["Numerical on combination (3–5 marks)", "V–I graph interpretation", "Reasoning: why parallel at home", "Power and cost calculation"] },
    { exam: "ICSE", years: [2023, 2022], question_types: ["Circuit diagram completion", "Fuse rating calculation"] },
    { exam: "JEE Main", years: [2024], question_types: ["Wheatstone-style networks", "Energy dissipation"] },
  ],
  mnemonics: [
    "**'SIR'** — Series: I same, R adds. **'PIV'** — Parallel: V same, I adds.",
    "**'Long and thin, hard to get in'** — longer and thinner wires have more resistance.",
    "**'P = VIP'** — Power = Voltage × current, and the V–I–P triangle lets you recover all three forms.",
    "**'Parallel is smaller'** — the equivalent is always below the smallest resistor; if not, you added instead of reciprocated.",
  ],
  selfCheck: [
    { question: "Two 4 Ω resistors are in parallel. What is the equivalent resistance?", answer: "1/R = 1/4 + 1/4 = 1/2, so R = 2 Ω — half of one resistor, which is the shortcut for two equal resistors in parallel." },
    { question: "A wire is stretched to twice its length with no change in volume. How does its resistance change?", answer: "Length doubles and area halves, so R = ρL/A becomes 4× larger." },
    { question: "Why is a voltmeter connected in parallel?", answer: "It must measure the potential difference between two points, so it is placed across them; its very high resistance keeps it from stealing current." },
    { question: "What does the slope of a V–I graph represent?", answer: "Resistance, R = V/I — a steeper line means a larger resistance." },
    { question: "Why do transmission lines use high voltage?", answer: "The same power at higher voltage needs proportionally less current, and line losses are I²R, so losses drop dramatically." },
  ],
  related: ["current-electricity", "light-reflection-refraction"],
};

const chemicalReactions: ChapterContent = {
  slug: "chemical-reactions-equations",
  bigPicture: `This chapter teaches you to read chemistry as a sentence rather than a list of symbols. A balanced equation is a sentence that obeys the law of conservation of mass: the same atoms appear on both sides, only rearranged. Everything else in the chapter — reaction types, redox, corrosion — is about classifying what changed.

It matters because every later chemistry chapter assumes you can balance and classify without thinking. Board papers give it high weight because it is testable in a single line and it separates students who understand atoms from those who memorise reactions.`,
  prerequisites: [
    "Chemical symbols and formulae of common compounds",
    "Valency and how to write a formula from valencies",
    "The idea of an ion and a molecule",
    "Basic arithmetic for balancing coefficients",
  ],
  glossary: [
    { term: "Reactant", definition: "A substance that is consumed in a reaction; written on the left." },
    { term: "Product", definition: "A substance formed by the reaction; written on the right." },
    { term: "Balanced equation", definition: "An equation whose atom count is equal on both sides." },
    { term: "Precipitate", definition: "An insoluble solid formed from two soluble reactants." },
    { term: "Oxidation", definition: "Loss of electrons or gain of oxygen / loss of hydrogen." },
    { term: "Reduction", definition: "Gain of electrons or loss of oxygen / gain of hydrogen." },
    { term: "Exothermic", definition: "A reaction that releases energy to the surroundings." },
    { term: "Endothermic", definition: "A reaction that absorbs energy from the surroundings." },
    { term: "Corrosion", definition: "Gradual destruction of a metal by environmental reaction, e.g. rusting of iron." },
    { term: "Rancidity", definition: "Oxidation of fats and oils producing unpleasant smell and taste." },
  ],
  concepts: [
    {
      heading: "Balancing chemical equations",
      body_md: `Balancing means making the number of atoms of each element equal on both sides. Work element by element, and leave hydrogen and oxygen last — they appear in the most places, so balancing them first tends to undo earlier work.

Example: \\(\\text{Fe} + \\text{H}_2\\text{O} \\rightarrow \\text{Fe}_3\\text{O}_4 + \\text{H}_2\\) becomes

$$3\\text{Fe} + 4\\text{H}_2\\text{O} \\rightarrow \\text{Fe}_3\\text{O}_4 + 4\\text{H}_2$$

Never change a subscript to balance — that changes the substance. \\(\\text{H}_2\\text{O}\\) and \\(\\text{H}_2\\text{O}_2\\) are water and hydrogen peroxide, not two versions of the same thing. Coefficients only.

Also record physical states: (s), (l), (g), (aq). A precipitate is marked ↓ and a gas ↑. State symbols are free marks and examiners look for them.`,
    },
    {
      heading: "The five reaction types",
      body_md: `**Combination** — two or more reactants form one product: \\(\\text{CaO} + \\text{H}_2\\text{O} \\rightarrow \\text{Ca(OH)}_2\\).

**Decomposition** — one compound breaks into simpler substances, usually driven by heat, light or electricity: \\(2\\text{Pb(NO}_3)_2 \\rightarrow 2\\text{PbO} + 4\\text{NO}_2 + \\text{O}_2\\).

**Displacement** — a more reactive element pushes a less reactive one out of its compound: \\(\\text{Fe} + \\text{CuSO}_4 \\rightarrow \\text{FeSO}_4 + \\text{Cu}\\).

**Double displacement** — ions exchange partners, often producing a precipitate: \\(\\text{AgNO}_3 + \\text{NaCl} \\rightarrow \\text{AgCl}\\downarrow + \\text{NaNO}_3\\).

**Redox** — oxidation and reduction occur together, always. In \\(\\text{ZnO} + \\text{C} \\rightarrow \\text{Zn} + \\text{CO}\\), zinc is reduced and carbon is oxidised.`,
    },
    {
      heading: "Oxidation, reduction and the language of electrons",
      body_md: `Three equivalent definitions, and you should hold all three:

- **Oxygen-based:** oxidation gains oxygen, reduction loses it.
- **Hydrogen-based:** oxidation loses hydrogen, reduction gains it.
- **Electron-based (most useful later):** oxidation loses electrons, reduction gains electrons.

The mnemonic **OIL RIG** — *Oxidation Is Loss, Reduction Is Gain* (of electrons) — carries you through Class 11 and 12.

An oxidising agent is the species that gets reduced (it takes electrons from the other); a reducing agent gets oxidised. Because one cannot happen without the other, "redox" is a single word for a single event.`,
    },
    {
      heading: "Corrosion and rancidity in everyday life",
      body_md: `Corrosion is oxidation in the wild. Iron rusts as \\(4\\text{Fe} + 3\\text{O}_2 + x\\text{H}_2\\text{O} \\rightarrow 2\\text{Fe}_2\\text{O}_3\\cdot x\\text{H}_2\\text{O}\\). Silver tarnishes black with sulphide; copper turns green with basic copper carbonate.

Prevention: painting, oiling, galvanising (zinc coating), alloying (stainless steel), and cathodic protection.

Rancidity is the same process applied to food. Fats oxidise, producing aldehydes and ketones with unpleasant smells. Prevention: antioxidants, airtight containers, refrigeration, and nitrogen flushing of crisp packets — which is why a chip bag is puffed up rather than slack.`,
    },
  ],
  derivations: [
    `**Why equations must balance (conservation of mass).** In a closed system, atoms are neither created nor destroyed — only rearranged. A chemical equation is therefore a bookkeeping statement: the coefficient vector must satisfy an atom-balance equation for every element. This is why balancing is always solvable for simple reactions and why an unbalanced equation is not merely untidy but *false*.`,

    `**Recognising a redox reaction without electron bookkeeping.** Assign oxidation numbers: if any element's number changes between reactants and products, a redox event occurred. Zn goes 0 → +2 (oxidised) while Cu goes +2 → 0 (reduced). This test is faster than tracking full half-reactions when the question just asks "is this redox?".`,

    `**Predicting displacement direction using the reactivity series.** K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Ag > Au. A metal can displace any metal below it in the series. This single ordering predicts the outcome of every Class 10 displacement question.`,
  ],
  examples: [
    {
      difficulty: "easy",
      problem_md: `Balance: \\(\\text{Al} + \\text{O}_2 \\rightarrow \\text{Al}_2\\text{O}_3\\).`,
      solution_md: `Oxygen appears as O₂ on the left and O₃ on the right — the LCM is 6. Use 3 O₂ and 2 Al₂O₃, which needs 4 Al:

$$4\\text{Al} + 3\\text{O}_2 \\rightarrow 2\\text{Al}_2\\text{O}_3$$

Check: Al 4 = 4 ✓, O 6 = 6 ✓.`,
    },
    {
      difficulty: "medium",
      problem_md: `Classify each reaction: (a) \\(\\text{CaCO}_3 \\xrightarrow{\\Delta} \\text{CaO} + \\text{CO}_2\\); (b) \\(\\text{Zn} + 2\\text{HCl} \\rightarrow \\text{ZnCl}_2 + \\text{H}_2\\); (c) \\(\\text{NaOH} + \\text{HCl} \\rightarrow \\text{NaCl} + \\text{H}_2\\text{O}\\).`,
      solution_md: `(a) **Decomposition** — one compound splits into two on heating (thermal decomposition).

(b) **Displacement** — zinc, more reactive than hydrogen, displaces it from the acid. Also a redox reaction: Zn is oxidised, H⁺ reduced.

(c) **Double displacement / neutralisation** — Na⁺ and H⁺ swap partners, producing salt and water. (c) is also a sub-type of double displacement called neutralisation.

Note that the categories overlap: (b) is both displacement and redox. Answer with the *most specific* label and mention the second if it earns a mark.`,
    },
    {
      difficulty: "medium",
      problem_md: `In \\(\\text{MnO}_2 + 4\\text{HCl} \\rightarrow \\text{MnCl}_2 + \\text{Cl}_2 + 2\\text{H}_2\\text{O}\\), identify the substance oxidised, the substance reduced, and the oxidising agent.`,
      solution_md: `Oxidation numbers: Mn goes +4 → +2 (**reduced**). Cl goes −1 → 0 in Cl₂ (**oxidised**).

The **oxidising agent is MnO₂** — it takes electrons, so it is itself reduced.

The substance oxidised is HCl (specifically the chloride ion). A frequent error is naming Cl₂ as "the oxidised substance"; the species that changed is HCl.`,
    },
    {
      difficulty: "hard",
      problem_md: `A shiny iron nail is dropped into copper sulphate solution. Describe what you observe, write the balanced equation, and explain it in terms of reactivity.`,
      solution_md: `**Observation:** the blue colour fades towards pale green, the nail acquires a brownish-red deposit, and it becomes slightly lighter.

$$\\text{Fe} + \\text{CuSO}_4 \\rightarrow \\text{FeSO}_4 + \\text{Cu}$$

Iron is above copper in the reactivity series, so it can displace copper from its salt. Fe is oxidised (0 → +2) and Cu²⁺ is reduced (+2 → 0), making this a displacement *and* a redox reaction.

The solution changes from blue (Cu²⁺) to pale green (Fe²⁺) — the colour change is the evidence, so always state it.`,
    },
  ],
  diagram: `flowchart TD
  A[Look at the reaction] --> B{How many reactants?}
  B -->|2 or more into 1| C[Combination]
  B -->|1 into many| D[Decomposition]
  B -->|element + compound| E[Displacement]
  B -->|compound + compound| F[Double displacement]
  C --> G{Oxidation numbers change?}
  D --> G
  E --> G
  F --> G
  G -->|yes| H[Also a redox reaction]
  G -->|no| I[Not redox]`,
  analogies: [
    "Balancing an equation is like a recipe that must serve both sides of the table — you can add more batches (coefficients) but you cannot swap flour for sugar (subscripts).",
    "Displacement reactions are a queue: the more reactive metal is closer to the front and keeps its place; a less reactive one gets pushed out.",
    "Rancidity is the metal rusting of food. The same oxygen attack, just on fats instead of iron.",
  ],
  mistakes: [
    "Changing subscripts to balance instead of coefficients, which silently changes the substance.",
    "Omitting state symbols, which costs marks even when the equation is correct.",
    "Calling every reaction with two compounds 'double displacement' — check whether a precipitate, gas or water was actually formed.",
    "Naming Cl₂ as 'the substance oxidised' when the question asks about the reactant.",
    "Forgetting that oxidation and reduction always occur together.",
    "Assuming rusting needs only oxygen; water is required too.",
  ],
  examPatterns: [
    { exam: "CBSE Board", years: [2024, 2023, 2022, 2021], question_types: ["Balancing (1–2 marks)", "Identify oxidised/reduced (2 marks)", "Observation-based displacement (3 marks)", "Corrosion prevention short answer"] },
    { exam: "ICSE", years: [2023], question_types: ["Reaction type classification", "Activity series application"] },
  ],
  mnemonics: [
    "**'OIL RIG'** — Oxidation Is Loss, Reduction Is Gain (of electrons).",
    "**'LEO says GER'** — Lose Electrons Oxidation, Gain Electrons Reduction.",
    "**Reactivity series:** *Please Stop Calling Me A Cute Zebra, I Like His Car And Gold* — K, Na, Ca, Mg, Al, C, Zn, Fe, Pb, H, Cu, Ag, Au.",
    "**'De-com-pos-ition = 1 → many'** — the prefix *de* signals breaking apart.",
  ],
  selfCheck: [
    { question: "Why can you never balance an equation by changing a subscript?", answer: "A subscript defines the identity of the substance. Changing H₂O to H₂O₂ turns water into hydrogen peroxide, so the equation would describe a different reaction." },
    { question: "Is respiration an oxidation reaction? Explain.", answer: "Yes. Glucose is oxidised to CO₂ and H₂O, releasing energy; oxygen is reduced to water. It is a slow, enzyme-controlled redox process." },
    { question: "What is the difference between corrosion and rancidity?", answer: "Both are oxidation. Corrosion attacks metals (rust, tarnish); rancidity attacks fats and oils in food, producing unpleasant tastes and smells." },
    { question: "Give one example of a decomposition reaction driven by light.", answer: "Silver chloride decomposing to silver and chlorine: 2AgCl → 2Ag + Cl₂ in sunlight, used in photographic film." },
    { question: "Why is galvanising more effective than painting for a scratch-prone surface?", answer: "Zinc is more reactive than iron, so it corrodes preferentially and protects the iron even where the coating is scratched (sacrificial protection). Paint only protects where it is intact." },
  ],
  related: ["electricity"],
};

const trigonometry: ChapterContent = {
  slug: "trigonometry-intro",
  bigPicture: `Trigonometry begins as a way to connect an angle to a ratio — and becomes a toolkit for measuring anything you cannot walk up to and measure directly. In Class 10 you build the six ratios, learn the standard-angle values, and use them to prove identities and to solve heights-and-distances problems.

The reason it carries high weight is that it is the first genuinely *abstract* topic in the maths syllabus: you stop computing numbers and start manipulating relationships. Students who learn it as "a table to memorise" do fine on the 1-mark questions and then collapse on identities. Students who learn it as "the ratios of a right triangle" find the identities obvious.`,
  prerequisites: [
    "Pythagoras' theorem — a² + b² = c²",
    "Similar triangles and the idea of a ratio",
    "Right-angled triangle naming: hypotenuse, opposite, adjacent",
    "Rationalising denominators and basic algebraic identities",
  ],
  glossary: [
    { term: "Trigonometric ratio", definition: "A ratio of two sides of a right triangle determined by an angle." },
    { term: "Hypotenuse", definition: "The side opposite the right angle; always the longest side." },
    { term: "Opposite side", definition: "The side across from the angle of interest." },
    { term: "Adjacent side", definition: "The non-hypotenuse side touching the angle of interest." },
    { term: "sin θ", definition: "Opposite ÷ Hypotenuse." },
    { term: "cos θ", definition: "Adjacent ÷ Hypotenuse." },
    { term: "tan θ", definition: "Opposite ÷ Adjacent = sin θ / cos θ." },
    { term: "Identity", definition: "An equation true for every value of the variable, e.g. sin²θ + cos²θ = 1." },
    { term: "Angle of elevation", definition: "Angle measured upward from the horizontal to the line of sight." },
    { term: "Angle of depression", definition: "Angle measured downward from the horizontal to the line of sight." },
  ],
  concepts: [
    {
      heading: "The six ratios and where they come from",
      body_md: `Fix an acute angle θ in a right triangle. The three sides are the hypotenuse (opposite the right angle), the side opposite θ, and the side adjacent to θ. Then:

$$\\sin\\theta = \\frac{\\text{opp}}{\\text{hyp}},\\quad \\cos\\theta = \\frac{\\text{adj}}{\\text{hyp}},\\quad \\tan\\theta = \\frac{\\text{opp}}{\\text{adj}}$$

and the reciprocals \\(\\csc\\theta = 1/\\sin\\theta\\), \\(\\sec\\theta = 1/\\cos\\theta\\), \\(\\cot\\theta = 1/\\tan\\theta\\).

The ratios depend only on the *angle*, not the size of the triangle — because all right triangles with the same acute angle are similar, and similar triangles have proportional sides. That is the whole foundation: an angle alone fixes the shape, and ratios describe the shape.

Immediately useful consequence: \\(\\tan\\theta = \\sin\\theta/\\cos\\theta\\) and \\(\\cot\\theta = \\cos\\theta/\\sin\\theta\\).`,
    },
    {
      heading: "Standard angles and how to rebuild the table in ten seconds",
      body_md: `The table everyone memorises:

| θ | 0° | 30° | 45° | 60° | 90° |
|---|---|---|---|---|---|
| sin | 0 | 1/2 | 1/√2 | √3/2 | 1 |
| cos | 1 | √3/2 | 1/√2 | 1/2 | 0 |
| tan | 0 | 1/√3 | 1 | √3 | undefined |

Instead of memorising, write √0/2, √1/2, √2/2, √3/2, √4/2 across the sin row and read it backwards for cos. That reconstruction takes ten seconds and cannot be misremembered under exam pressure.

Note the tan 90° is undefined, not infinite-and-equal-to-something — the adjacent side would be zero, and division by zero is not a real number.`,
    },
    {
      heading: "The three core identities",
      body_md: `Pythagoras on the unit triangle gives the mother identity:

$$\\sin^2\\theta + \\cos^2\\theta = 1$$

Dividing through by cos²θ gives \\(1 + \\tan^2\\theta = \\sec^2\\theta\\).

Dividing through by sin²θ gives \\(1 + \\cot^2\\theta = \\csc^2\\theta\\).

All three are Pythagoras in disguise. That is not a cute fact — it is the tool that turns most identity proofs into two or three steps. When you are stuck on a proof, convert everything to sin and cos, then look for a Pythagorean rearrangement.`,
    },
    {
      heading: "Heights and distances",
      body_md: `Real-world trigonometry is nearly always this pattern:

1. Draw the two triangles (usually sharing a vertical side — a tower, a building, a cliff).
2. Mark the angles of elevation or depression.
3. Label the known horizontal distance and the unknown height.
4. Choose the ratio that contains both: usually tan.
5. Solve, and state units.

The angle of depression from a tower top to a car equals the angle of elevation from the car to the tower top — they are alternate interior angles between parallel horizontals. Students routinely miss this and then cannot see how the triangle closes.

Standard results worth knowing: if the angle of elevation doubles from the same point, the height does *not* double (tan is not linear). If the angle goes from 30° to 60°, the distance halves.`,
    },
  ],
  derivations: [
    `**Deriving the 45° values.** In a right isosceles triangle the two legs are equal (say 1), so the hypotenuse is √2. Then sin 45° = 1/√2 and cos 45° = 1/√2, and tan 45° = 1/1 = 1.`,

    `**Deriving the 30° and 60° values.** Take an equilateral triangle of side 2 and drop an altitude. It bisects the base (length 1) and the apex angle (30° each). The altitude is √(2² − 1²) = √3. Reading off the half-triangle: sin 30° = 1/2, cos 30° = √3/2, and by complementarity sin 60° = √3/2, cos 60° = 1/2.`,

    `**Why sin²θ + cos²θ = 1.** In a right triangle with sides a, b and hypotenuse c: sin θ = a/c, cos θ = b/c, so sin²θ + cos²θ = (a² + b²)/c² = c²/c² = 1 by Pythagoras.`,
  ],
  examples: [
    {
      difficulty: "easy",
      problem_md: `If \\(\\sin\\theta = 3/5\\), find cos θ and tan θ for an acute angle.`,
      solution_md: `Draw a right triangle with opposite = 3, hypotenuse = 5.

Adjacent \\(= \\sqrt{5^2 - 3^2} = \\sqrt{25 - 9} = \\sqrt{16} = 4\\).

\\(\\cos\\theta = 4/5\\), \\(\\tan\\theta = 3/4\\).

Check with the identity: (3/5)² + (4/5)² = 9/25 + 16/25 = 1 ✓.`,
    },
    {
      difficulty: "medium",
      problem_md: `Prove that \\((1 - \\cos^2\\theta)\\,\\csc^2\\theta = 1\\).`,
      solution_md: `LHS \\(= (1 - \\cos^2\\theta) \\cdot \\csc^2\\theta\\).

By the Pythagorean identity, \\(1 - \\cos^2\\theta = \\sin^2\\theta\\).

So LHS \\(= \\sin^2\\theta \\cdot \\csc^2\\theta\\).

Since \\(\\csc\\theta = 1/\\sin\\theta\\), this is \\(\\sin^2\\theta \\cdot \\frac{1}{\\sin^2\\theta} = 1\\) = RHS ∎

The strategy: **use the identity to eliminate the awkward term first**, then simplify. Most students try to expand the product before using the identity, which makes it harder.`,
    },
    {
      difficulty: "medium",
      problem_md: `Evaluate \\(\\sin 30°\\cos 60° + \\cos 30°\\sin 60°\\).`,
      solution_md: `Substitute standard values:

\\(\\sin 30° = 1/2\\), \\(\\cos 60° = 1/2\\), \\(\\cos 30° = √3/2\\), \\(\\sin 60° = √3/2\\).

Expression \\(= \\frac{1}{2}\\cdot\\frac{1}{2} + \\frac{\\sqrt3}{2}\\cdot\\frac{\\sqrt3}{2} = \\frac{1}{4} + \\frac{3}{4} = 1\\).

Recognise this as sin(30° + 60°) = sin 90° = 1 — a preview of the compound-angle formula.`,
    },
    {
      difficulty: "hard",
      problem_md: `From the top of a 60 m tower, the angle of depression of a car on the ground is 30°. How far is the car from the foot of the tower?`,
      solution_md: `The angle of elevation from the car is also 30° (alternate interior angles). In the right triangle, the tower height 60 m is **opposite** the 30° angle and the distance d is **adjacent**.

\\(\\tan 30° = \\frac{60}{d} \\Rightarrow \\frac{1}{\\sqrt3} = \\frac{60}{d} \\Rightarrow d = 60\\sqrt3\\ \\text{m}\\).

Numerically \\(d \\approx 103.9\\ \\text{m}\\). Leave the answer as 60√3 m unless a decimal is requested — exact surd forms earn full marks.`,
    },
    {
      difficulty: "hard",
      problem_md: `Prove: \\(\\frac{\\tan\\theta}{1 - \\cot\\theta} + \\frac{\\cot\\theta}{1 - \\tan\\theta} = 1 + \\sec\\theta\\,\\csc\\theta\\).`,
      solution_md: `Convert everything to sin and cos. Let \\(s = \\sin\\theta\\), \\(c = \\cos\\theta\\).

First term: \\(\\frac{s/c}{1 - c/s} = \\frac{s/c}{(s-c)/s} = \\frac{s^2}{c(s-c)}\\).

Second term: \\(\\frac{c/s}{1 - s/c} = \\frac{c/s}{(c-s)/c} = \\frac{c^2}{s(c-s)} = -\\frac{c^2}{s(s-c)}\\).

Sum \\(= \\frac{1}{s-c}\\left(\\frac{s^2}{c} - \\frac{c^2}{s}\\right) = \\frac{1}{s-c}\\cdot\\frac{s^3 - c^3}{sc}\\).

Now \\(s^3 - c^3 = (s-c)(s^2 + sc + c^2) = (s-c)(1 + sc)\\).

Sum \\(= \\frac{1+sc}{sc} = \\frac{1}{sc} + 1 = \\csc\\theta\\sec\\theta + 1\\) = RHS ∎

The whole proof rests on two moves: convert to s and c, then factor a difference of cubes.`,
    },
  ],
  diagram: `flowchart TD
  A[Right triangle problem] --> B{What do you know?}
  B -->|Two sides| C[Use Pythagoras to get the third]
  B -->|One side and one angle| D[Pick ratio with known + unknown]
  C --> E[Read sin / cos / tan]
  D --> E
  E --> F{Identity needed?}
  F -->|yes| G[Convert to sin and cos, then use sin2 + cos2 = 1]
  F -->|no| H[Substitute standard values]
  G --> H
  H --> I[Simplify and state units]`,
  analogies: [
    "Trig ratios are a shape's fingerprint. Two triangles with the same 30° angle look different in size but share every ratio — the fingerprint is the angle.",
    "An identity is a machine that never breaks: substitute any angle and the two sides stay equal. A mere equation is true for a few values only.",
    "The angle of depression equals the angle of elevation the way a seesaw's two ends do — tip one down and the other rises by the same angle.",
  ],
  mistakes: [
    "Using the angle at the wrong vertex, so 'opposite' and 'adjacent' get swapped.",
    "Writing sin²θ as sin θ² — they differ: sin²θ means (sin θ)².",
    "Cancelling sin from sin θ + cos θ as if it were a factor. sin is not a common factor of a sum.",
    "Forgetting that tan 90° is undefined and writing 'infinity' as a value.",
    "In heights and distances, treating the angle of depression as if it were inside the triangle at the top without drawing the horizontal.",
    "Thinking the height doubles when the angle of elevation doubles — tan is not linear.",
  ],
  examPatterns: [
    { exam: "CBSE Board", years: [2024, 2023, 2022, 2021], question_types: ["Identity proof (3–5 marks)", "Heights and distances (3–4 marks)", "Standard-angle evaluation (1 mark)", "Find other ratios given one"] },
    { exam: "ICSE", years: [2023, 2022], question_types: ["Prove identities", "Solve for θ"] },
    { exam: "JEE Main", years: [2024], question_types: ["Compound angle formula (preview)", "Range of trigonometric expressions"] },
  ],
  mnemonics: [
    "**SOH-CAH-TOA** — Sin = Opp/Hyp, Cos = Adj/Hyp, Tan = Opp/Adj.",
    "**'√0 √1 √2 √3 √4 over 2'** — write this row for sin at 0°, 30°, 45°, 60°, 90°; cos is the same row reversed.",
    "**'Co-functions swap'** — sin(90° − θ) = cos θ, tan(90° − θ) = cot θ. The 'co' in cosine means *complementary*.",
    "**'Convert to s and c when stuck'** — the single most reliable identity-proof strategy.",
  ],
  selfCheck: [
    { question: "If tan θ = 1, what is θ for an acute angle?", answer: "45°, because tan 45° = 1." },
    { question: "Why is sin θ never greater than 1 for a real angle?", answer: "sin θ = opposite/hypotenuse, and the hypotenuse is always the longest side, so the ratio is at most 1." },
    { question: "Simplify sin²θ − 1.", answer: "sin²θ − 1 = −(1 − sin²θ) = −cos²θ." },
    { question: "The angle of elevation of a tower is 45°. If you walk 10 m closer the angle becomes 60°. What does that tell you qualitatively?", answer: "The tower is taller than your original distance is a common misread — actually tan 45° = 1 means height equals the original distance, and at 60° the remaining distance is height/√3, so you must have moved a substantial fraction of the way in." },
    { question: "What is sec 0°?", answer: "1, because cos 0° = 1 and sec θ = 1/cos θ." },
  ],
  related: ["differentiation"],
};

const currentElectricity12: ChapterContent = {
  slug: "current-electricity",
  bigPicture: `Class 12 Current Electricity turns the Class 10 version of Ohm's law into a microscopic story. You stop asking "what is the resistance" and start asking "why does this material have this resistance, and how do charges actually move inside it". Drift velocity, current density and resistivity give you the mechanism; Kirchhoff's rules and the potentiometer give you the tools.

This chapter matters out of proportion to its length because it underpins nearly all of circuit analysis in JEE and NEET, and because the potentiometer is the standard "application" question that rewards understanding over memorisation.`,
  prerequisites: [
    "Class 10 Ohm's law, series/parallel combinations, electrical power",
    "Vectors — you need the idea of a current density vector",
    "Basic calculus: derivatives for resistivity and drifts (A-Level/JEE)",
    "Electrostatics: potential difference as work per unit charge",
  ],
  glossary: [
    { term: "Drift velocity (v_d)", definition: "Average velocity of charge carriers along the conductor under an applied field; typically ~10⁻⁴ m/s." },
    { term: "Current density (J)", definition: "Current per unit cross-sectional area; J = I/A, a vector." },
    { term: "Mobility (μ)", definition: "Drift velocity per unit electric field; μ = v_d/E." },
    { term: "Resistivity (ρ)", definition: "Material-dependent opposition; R = ρL/A." },
    { term: "EMF (ε)", definition: "Energy supplied by a source per unit charge; measured in volts." },
    { term: "Internal resistance (r)", definition: "Resistance inside a cell; terminal voltage V = ε − Ir." },
    { term: "Kirchhoff's junction rule", definition: "Sum of currents entering a junction equals the sum leaving — charge conservation." },
    { term: "Kirchhoff's loop rule", definition: "Sum of potential changes around any closed loop is zero — energy conservation." },
    { term: "Potentiometer", definition: "A device that measures EMF without drawing current, by balancing potential differences." },
    { term: "Wheatstone bridge", definition: "A four-arm bridge balanced when P/Q = R/S, used to measure unknown resistance." },
  ],
  concepts: [
    {
      heading: "Drift velocity and current density",
      body_md: `Free electrons in a metal move randomly at ~10⁵ m/s but with no net direction, so no current flows. Apply a field and they acquire a tiny *drift* on top of the randomness:

$$v_d = \\frac{eE\\tau}{m}$$

where τ is the mean time between collisions. Drift speeds are astonishingly slow — fractions of a millimetre per second — while the *signal* travels near light speed, because the field propagates almost instantly. That distinction (electrons crawl, information flies) is a favourite conceptual question.

Current density relates the microscopic picture to the macroscopic current:

$$J = \\frac{I}{A} = nev_d$$

and in vector form \\(\\vec J = \\sigma \\vec E\\), which is Ohm's law at the microscopic level.`,
    },
    {
      heading: "Resistivity and its temperature dependence",
      body_md: `Resistance is geometric; resistivity is material:

$$R = \\rho\\frac{L}{A}$$

For a metal over ordinary temperature ranges,

$$\\rho_T = \\rho_0\\big(1 + \\alpha(T - T_0)\\big)$$

with α positive and small (~0.004 /K for copper). Heat increases lattice vibration, scattering carriers more often, so resistance rises.

Two important exceptions: **semiconductors** have negative α (more carriers are freed as temperature rises, so resistance falls), and **alloys** like manganin and constantan have very small α — which is precisely why they are used to make standard resistors and potentiometer wire. Choosing manganin for a potentiometer is not arbitrary; it is a temperature-stability decision.`,
    },
    {
      heading: "Kirchhoff's rules",
      body_md: `**Junction rule:** \\(\\sum I_{\\text{in}} = \\sum I_{\\text{out}}\\). This is charge conservation — charge cannot pile up at a junction in steady state.

**Loop rule:** \\(\\sum \\Delta V = 0\\) around any closed loop. This is energy conservation — a charge returning to its starting point must have the same energy.

Sign discipline when traversing a loop:
- Across a resistor **with** the current: potential drops, so write −IR.
- Across a resistor **against** the current: +IR.
- From the **negative to the positive** terminal of a cell: +ε. The reverse is −ε.

Most lost marks come from inconsistent sign discipline rather than from the physics. Pick a traversal direction, write it at the top of your answer, and never change it mid-loop.`,
    },
    {
      heading: "EMF, internal resistance and the potentiometer",
      body_md: `A real cell has internal resistance r, so its terminal voltage sags as current is drawn:

$$V = \\varepsilon - Ir$$

That is why headlights dim when you crank the starter: the starter draws a huge current, so Ir grows and V falls. It is also why a voltmeter across a cell with no load reads ε, not V.

The **potentiometer** measures EMF by balancing it against a known potential drop — drawing *zero* current at balance, which is exactly what a voltmeter cannot do. For a wire of length L carrying a steady current,

$$\\varepsilon \\propto l \\quad\\Rightarrow\\quad \\frac{\\varepsilon_1}{\\varepsilon_2} = \\frac{l_1}{l_2}$$

This null method is why the potentiometer beats a voltmeter for EMF measurement: no current is drawn at balance, so internal resistance cannot distort the reading.`,
    },
  ],
  derivations: [
    `**Deriving v_d = eEτ/m.** In field E an electron feels force eE and accelerates at a = eE/m. Between collisions it accelerates for an average time τ, so its average drift velocity is \\(v_d = a\\tau = eE\\tau/m\\).`,

    `**Deriving macroscopic Ohm's law from the microscopic.** \\(I = neAv_d = neA\\,(eE\\tau/m)\\). Since \\(E = V/L\\), \\(I = \\frac{ne^2\\tau A}{mL}V\\). Comparing with V = IR gives \\(R = \\frac{mL}{ne^2\\tau A}\\), hence \\(\\rho = \\frac{m}{ne^2\\tau}\\). This is the whole point of the chapter: resistivity is determined by carrier density n and collision time τ.`,

    `**Balanced Wheatstone bridge.** At balance no current flows through the galvanometer. Applying Kirchhoff to the two parallel branches with the same current through P and Q, and the same current through R and S, gives \\(P/Q = R/S\\). Any measurement of an unknown resistance uses this condition.`,
  ],
  examples: [
    {
      difficulty: "easy",
      problem_md: `A copper wire of length 2 m and cross-section 1.0 × 10⁻⁶ m² carries a current of 4 A. If the resistivity of copper is 1.7 × 10⁻⁸ Ω·m, find the resistance and the voltage drop.`,
      solution_md: `\\(R = \\rho L/A = \\frac{1.7\\times10^{-8} \\times 2}{1.0\\times10^{-6}} = 3.4\\times10^{-2}\\ \\Omega\\).

\\(V = IR = 4 \\times 0.034 = 0.136\\ \\text{V}\\).

Check plausibility: a power cord should drop very little voltage, and 0.14 V over 2 m is exactly right.`,
    },
    {
      difficulty: "medium",
      problem_md: `A cell of EMF 12 V and internal resistance 2 Ω is connected to an 10 Ω resistor. Find the current, the terminal voltage, and the power wasted internally.`,
      solution_md: `Total resistance \\(= 10 + 2 = 12\\ \\Omega\\).

\\(I = \\varepsilon/(R + r) = 12/12 = 1\\ \\text{A}\\).

Terminal voltage \\(V = \\varepsilon - Ir = 12 - 2 = 10\\ \\text{V}\\) (equivalently IR = 10 V ✓).

Internal power loss \\(= I^2 r = 1 \\times 2 = 2\\ \\text{W}\\); useful power in the load is 10 W, so efficiency = 10/12 ≈ 83%.`,
    },
    {
      difficulty: "medium",
      problem_md: `In a potentiometer, a cell balances at 40 cm. When a 5 Ω resistor is connected across the same cell, the balance point moves to 30 cm. Find the internal resistance of the cell.`,
      solution_md: `Balancing lengths are proportional to the EMF and to the terminal voltage:

\\(\\frac{V}{\\varepsilon} = \\frac{l_2}{l_1} = \\frac{30}{40} = 0.75\\).

Also \\(V = \\varepsilon - Ir\\) and \\(I = \\varepsilon/(R+r)\\), giving \\(\\frac{V}{\\varepsilon} = \\frac{R}{R+r}\\).

So \\(\\frac{5}{5+r} = 0.75 \\Rightarrow 5 = 3.75 + 0.75r \\Rightarrow r = 1.67\\ \\Omega\\) (5/3 Ω).

This is the standard potentiometer problem and the derivation should be memorised as a template, not derived afresh.`,
    },
    {
      difficulty: "hard",
      problem_md: `Two cells of EMF 10 V and 4 V with internal resistances 1 Ω and 2 Ω are connected in parallel across a 6 Ω resistor. Find the current through each branch.`,
      solution_md: `Let the terminal voltage be V. For each cell, \\(I = (\\varepsilon - V)/r\\):

\\(I_1 = (10 - V)/1\\), \\(I_2 = (4 - V)/2\\).

Junction rule: \\(I_1 + I_2 = I_R = V/6\\).

\\((10 - V) + (4 - V)/2 = V/6\\)

Multiply by 6: \\(60 - 6V + 12 - 3V = V\\)

\\(72 = 10V \\Rightarrow V = 7.2\\ \\text{V}\\).

Then \\(I_1 = 2.8\\ \\text{A}\\), \\(I_2 = (4 - 7.2)/2 = -1.6\\ \\text{A}\\).

The **negative sign on I₂ means the 4 V cell is being charged** — current is being driven *into* its positive terminal. Flagging this is what separates a full-mark answer from a partial one.`,
    },
  ],
  diagram: `flowchart TD
  A[Circuit with batteries and resistors] --> B[Mark junctions]
  B --> C[Assign current directions arbitrarily]
  C --> D[Apply junction rule]
  D --> E[Apply loop rule to each independent loop]
  E --> F[Solve simultaneous equations]
  F --> G{Any negative current?}
  G -->|yes| H[That current actually flows opposite to the assumed direction]
  G -->|no| I[Assumptions were correct]
  H --> J[Report physical meaning]
  I --> J`,
  analogies: [
    "Drift velocity is a crowded corridor: individuals shuffle at a walking pace while the *push* travels from one end to the other almost instantly. The message is fast; the people are slow.",
    "Internal resistance is friction in a hose. Open the tap fully and the pressure at the far end drops because the flow itself costs pressure.",
    "A potentiometer is a balance scale for voltage: you slide the contact until the two sides are perfectly even, and at that instant no current crosses — so nothing is disturbed.",
  ],
  mistakes: [
    "Treating drift velocity as the speed of electricity. The field, not the electrons, carries the signal fast.",
    "Using R = ρL/A with the diameter plugged in as the area.",
    "Mixing the sign convention mid-loop, which silently flips a term.",
    "Writing a negative current as an error rather than as a physical result (the cell is being charged).",
    "Thinking a potentiometer measures terminal voltage; it measures EMF at balance, with zero current drawn.",
    "Forgetting that manganin is chosen for its low temperature coefficient, not its resistance value.",
  ],
  examPatterns: [
    { exam: "CBSE Board", years: [2024, 2023, 2022], question_types: ["Kirchhoff numerical (3–5 marks)", "Potentiometer derivation and problem", "Temperature dependence of resistivity", "Internal resistance experiment"] },
    { exam: "JEE Main", years: [2024, 2023], question_types: ["Multi-loop circuits", "Drift velocity numericals", "Wheatstone bridge"] },
    { exam: "NEET", years: [2024], question_types: ["Conceptual on drift velocity", "Potentiometer balance"] },
  ],
  mnemonics: [
    "**'J = nev_d'** — say it as 'jay equals nee-vee-dee' and you will never forget the microscopic current relation.",
    "**'Into the loop, drop the volts'** — traversing with the current through a resistor gives −IR.",
    "**'Manganin for measuring'** — low α means the standard resistor does not drift with the room's temperature.",
    "**'Negative current = charging'** — a sign flip is information, not an error.",
  ],
  selfCheck: [
    { question: "Why does the drift velocity not grow without limit even though the field keeps pushing?", answer: "Collisions with the lattice remove the acquired velocity. A steady-state average is reached where acceleration between collisions balances the reset at each collision." },
    { question: "A wire is stretched to double its length at constant volume. What happens to resistivity?", answer: "Nothing — resistivity is a material property. Resistance quadruples, but ρ is unchanged." },
    { question: "What is the terminal voltage of a cell with EMF 6 V and internal resistance 0.5 Ω when it delivers 2 A?", answer: "V = ε − Ir = 6 − 1 = 5 V." },
    { question: "Why is the potentiometer preferred over a voltmeter for measuring EMF?", answer: "At balance it draws zero current, so the internal resistance causes no voltage drop and the reading equals the true EMF." },
    { question: "In a balanced Wheatstone bridge, what is the current through the galvanometer?", answer: "Zero — that is the definition of balance, and it gives the condition P/Q = R/S." },
  ],
  related: ["electricity"],
};

const algebra1: ChapterContent = {
  slug: "linear-equations-graphs",
  bigPicture: `Linear functions are the first mathematical model most students meet that describes the real world accurately. A phone plan, a taxi fare, a cooling cup of coffee — all are (or approximate) straight lines, and every straight line has exactly two numbers that matter: how steep it is and where it starts.

Common Core treats this as a capstone of middle school because it unifies tables, graphs and equations into one object. If you can move fluidly between "y = 3x + 5", its graph, and the sentence "it costs 5 to start and 3 per unit", you have the skill the entire algebra sequence is built on.`,
  prerequisites: [
    "Plotting points on a coordinate plane",
    "Solving one-step and two-step equations",
    "The idea of a variable as an unknown that varies",
    "Integer arithmetic with negatives (critical for slope)",
  ],
  glossary: [
    { term: "Slope (m)", definition: "Rise over run; the constant rate of change of a linear function." },
    { term: "y-intercept (b)", definition: "The y-value where the line crosses the y-axis, i.e. the value at x = 0." },
    { term: "Slope-intercept form", definition: "y = mx + b, showing rate and starting value directly." },
    { term: "Standard form", definition: "Ax + By = C, useful for systems and intercepts." },
    { term: "Linear function", definition: "A function with a constant rate of change; its graph is a straight line." },
    { term: "System of equations", definition: "Two or more equations that must be true simultaneously." },
    { term: "Solution of a system", definition: "The point(s) satisfying all equations — graphically, the intersection." },
    { term: "Parallel lines", definition: "Lines with equal slopes and different intercepts; no solution." },
    { term: "Coincident lines", definition: "Same line described twice; infinitely many solutions." },
    { term: "Rate of change", definition: "Change in output per unit change in input; for a line, this equals the slope." },
  ],
  concepts: [
    {
      heading: "Slope as a rate, not a formula",
      body_md: `Slope is \\(m = \\frac{y_2 - y_1}{x_2 - x_1}\\), but the formula is the least interesting thing about it. Slope is a **rate**: units of output per unit of input. For a taxi, dollars per mile. For a cooling object, degrees per minute.

The four cases:
- m > 0 → the line rises left to right.
- m < 0 → it falls.
- m = 0 → horizontal, constant.
- m undefined → vertical, because the run is zero and you cannot divide by zero.

A vertical line is **not** a function: it fails the vertical line test because one x maps to infinitely many y values.`,
    },
    {
      heading: "Three forms and when to use each",
      body_md: `**Slope-intercept** \\(y = mx + b\\): best when you know the rate and the starting value. Reading it off is instant.

**Point-slope** \\(y - y_1 = m(x - x_1)\\): best when you know a rate and one point. This is the form to reach for in word problems — you are almost always given a rate and one data point.

**Standard** \\(Ax + By = C\\): best for finding both intercepts quickly (set x=0, then y=0) and for systems.

Example: a gym charges $30 to join and $20/month. Rate = 20, start = 30, so \\(C = 20m + 30\\). Given instead "it cost $90 for 3 months and $150 for 6 months", use point-slope: \\(m = (150-90)/(6-3) = 20\\), then \\(C - 90 = 20(m - 3)\\).`,
    },
    {
      heading: "Systems: three outcomes, one picture",
      body_md: `Two lines in a plane can only do three things:

| Case | Slopes | Solutions | Meaning |
|---|---|---|---|
| Intersect once | different | exactly 1 | consistent, independent |
| Parallel | equal, different b | 0 | inconsistent |
| Same line | equal and same b | infinitely many | dependent |

Methods: **substitution** (best when one variable is isolated), **elimination** (best when coefficients line up or can be made to), and **graphing** (best when the numbers are small or you want to see the answer).

Always check by substituting back into *both* original equations — not the one you derived, which may carry your error forward.`,
    },
    {
      heading: "Modelling: from a sentence to a function",
      body_md: `The modelling sequence:

1. Identify the **input** (what changes independently) and the **output**.
2. Find the **rate** — the "per" phrase.
3. Find the **starting value** — the "flat fee" or "initial".
4. Write the function.
5. State the **domain** — a phone plan does not accept negative minutes.

Step 5 is where most students lose points. A linear model is only valid where its assumptions hold: a cooling coffee follows a line only for a short time, then curves. Reporting the domain is part of the answer, not decoration.

Interpreting parameters matters too: in \\(P = 45 - 6t\\) for a phone battery, 45 is the starting percentage and −6 is the percentage lost per hour.`,
    },
  ],
  derivations: [
    `**Deriving slope from two points.** Slope is defined as the constant ratio of vertical change to horizontal change between any two distinct points on a line. For \\((x_1, y_1)\\) and \\((x_2, y_2)\\) on the line, rise = \\(y_2 - y_1\\) and run = \\(x_2 - x_1\\), so \\(m = (y_2-y_1)/(x_2-x_1)\\). The constancy of this ratio is what makes the graph a line — for a non-linear function the ratio changes with the points chosen.`,

    `**Converting standard to slope-intercept.** From \\(Ax + By = C\\), isolate y: \\(By = -Ax + C\\), so \\(y = -\\frac{A}{B}x + \\frac{C}{B}\\). The slope is \\(-A/B\\), which is why parallel lines in standard form satisfy \\(A_1B_2 = A_2B_1\\).`,

    `**Why parallel lines have equal slopes.** If two distinct lines have the same slope and both pass through a common point, they would be the same line (a line is determined by a point and a slope). So distinct parallel lines must have different intercepts — equal m, different b.`,

    `**Elimination justification.** Multiplying an equation by a non-zero constant produces an equivalent equation — the same solution set. Adding two equations that share a variable produces a valid equation about the common solution. Combining these two operations eliminates a variable without changing the solution set.`,
  ],
  examples: [
    {
      difficulty: "easy",
      problem_md: `Find the slope and y-intercept of \\(3x + 2y = 12\\), then sketch the line.`,
      solution_md: `Solve for y: \\(2y = -3x + 12\\), so \\(y = -\\frac{3}{2}x + 6\\).

Slope \\(m = -3/2\\) (down 3, right 2), intercept \\(b = 6\\).

Intercepts for sketching: at x = 0, y = 6; at y = 0, x = 4. Plot (0, 6) and (4, 0) and connect.

Check the slope from those intercepts: (0 − 6)/(4 − 0) = −3/2 ✓.`,
    },
    {
      difficulty: "medium",
      problem_md: `A taxi charges a flat $3.50 plus $2.25 per mile. Write a function for the fare, then find the fare for 8 miles and the distance for a $23 fare.`,
      solution_md: `\\(F(d) = 2.25d + 3.50\\), where d is miles (domain \\(d \\ge 0\\)).

8 miles: \\(F(8) = 2.25(8) + 3.50 = 18 + 3.50 = \\$21.50\\).

$23: \\(23 = 2.25d + 3.50 \\Rightarrow 19.50 = 2.25d \\Rightarrow d = 8.67\\) miles.

Domain check: the model only makes sense for \\(d \\ge 0\\). A negative distance is nonsense even though the algebra permits it.`,
    },
    {
      difficulty: "medium",
      problem_md: `Solve the system: \\(2x + 3y = 12\\) and \\(x - y = 1\\).`,
      solution_md: `From the second equation, \\(x = y + 1\\). Substitute into the first:

\\(2(y + 1) + 3y = 12 \\Rightarrow 2y + 2 + 3y = 12 \\Rightarrow 5y = 10 \\Rightarrow y = 2\\).

Then \\(x = 2 + 1 = 3\\).

Check in both: \\(2(3) + 3(2) = 12\\) ✓ and \\(3 - 2 = 1\\) ✓. Solution: **(3, 2)**.

Graphically the two lines cross at that point — a single intersection, so the system is consistent and independent.`,
    },
    {
      difficulty: "hard",
      problem_md: `A phone plan A costs $20 plus $0.10/min; plan B costs $35 plus $0.05/min. For how many minutes are they equal, and which plan is cheaper for heavy use?`,
      solution_md: `Set them equal: \\(20 + 0.10m = 35 + 0.05m\\).

\\(0.05m = 15 \\Rightarrow m = 300\\).

At **300 minutes** both cost $50 (check: 20 + 30 = 50; 35 + 15 = 50 ✓).

Compare slopes: plan A's rate (0.10) is steeper, so beyond 300 minutes A grows faster — **plan B is cheaper for heavy use**, and plan A is cheaper below 300. The intersection point is the break-even; the slope comparison tells you which way the break goes.`,
    },
  ],
  diagram: `flowchart TD
  A[Word problem] --> B[Identify input and output]
  B --> C[Find the rate - the 'per' phrase]
  C --> D[Find the starting value - the flat fee]
  D --> E[Write y = mx + b]
  E --> F[State the domain]
  F --> G{Need to compare two plans?}
  G -->|yes| H[Set expressions equal, solve for the break-even]
  G -->|no| I[Evaluate at the requested input]
  H --> J[Compare slopes to say which wins beyond the break-even]`,
  analogies: [
    "Slope is your speed on a road trip; the intercept is how far you had already driven before the clock started.",
    "A system of equations is two people walking along straight paths. Usually they cross once; if they walk parallel they never meet; if they are the same person you have counted them twice.",
    "Domain is the fence around a model. The algebra works outside it; reality does not.",
  ],
  mistakes: [
    "Computing slope as run/rise instead of rise/run — this gives the reciprocal, a silent and consistent error.",
    "Losing a negative sign when subtracting coordinates: (5 − 2)/(2 − 3) is 3/(−1) = −3, not 3.",
    "Writing a vertical line as y = something. Vertical lines are x = c.",
    "Assuming every pair of lines intersects; equal slopes with different intercepts never do.",
    "Checking a solution in the derived equation only, which validates the algebra but not the substitution.",
    "Forgetting to state the domain on a word-problem model.",
  ],
  examPatterns: [
    { exam: "SAT", years: [2024, 2023], question_types: ["Slope interpretation in context", "System of equations", "Linear model word problem"] },
    { exam: "Common Core / state test", years: [2024, 2023], question_types: ["Graph to equation", "Parallel/perpendicular identification"] },
    { exam: "AP Precalculus", years: [2024], question_types: ["Rate of change comparison", "Piecewise-linear modelling"] },
  ],
  mnemonics: [
    "**'Rise over run, read left to right'** — always subtract in the same order for both coordinates.",
    "**'y = mx + b: m moves, b begins'** — the slope is motion, the intercept is the start.",
    "**'Same slope, no meet'** — equal slopes without equal intercepts means parallel and no solution.",
    "**'Flat fee first, rate second'** — in a word problem the starting charge is b, the per-unit charge is m.",
  ],
  selfCheck: [
    { question: "What is the slope of the line through (2, 5) and (6, 13)?", answer: "(13 − 5)/(6 − 2) = 8/4 = 2." },
    { question: "Are y = 3x + 1 and 6x − 2y = 5 parallel?", answer: "Rewrite the second: y = 3x − 2.5. Both have slope 3 and different intercepts, so yes — parallel, no solution." },
    { question: "What is the slope of a horizontal line, and of a vertical line?", answer: "Horizontal: 0. Vertical: undefined (run = 0)." },
    { question: "How can you tell a system has infinitely many solutions from its equations?", answer: "One equation is a non-zero multiple of the other, so they describe the same line." },
    { question: "In C = 20m + 30, what does 30 represent?", answer: "The fixed cost incurred at m = 0 — the y-intercept, or starting value." },
  ],
  related: ["differentiation"],
};

const cellBiology: ChapterContent = {
  slug: "cell-biology",
  bigPicture: `Cell biology is the GCSE topic that explains *why* organisms are built the way they are. A cell is not a diagram to label; it is a factory with departments, a transport system and a quality-control process. Once you can say what each organelle is *for*, the labelling questions become obvious and the 6-mark explanations write themselves.

The chapter is heavily examined because it rewards precise, cause-and-effect language. "The cell has many mitochondria" earns nothing; "the cell has many mitochondria because muscle contraction requires a large, continuous supply of ATP from aerobic respiration" earns full marks.`,
  prerequisites: [
    "The idea of a cell as the basic unit of life",
    "Basic biochemistry vocabulary: protein, carbohydrate, lipid",
    "How to use a microscope and calculate magnification",
    "The concept of diffusion from KS3",
  ],
  glossary: [
    { term: "Eukaryotic cell", definition: "A cell with a nucleus and membrane-bound organelles; includes plant, animal and fungal cells." },
    { term: "Prokaryotic cell", definition: "A cell with no nucleus; DNA lies free in the cytoplasm. Bacteria only." },
    { term: "Nucleus", definition: "Contains chromosomal DNA and controls the cell's activities." },
    { term: "Mitochondrion", definition: "Site of aerobic respiration, releasing ATP; the cell's power station." },
    { term: "Ribosome", definition: "Site of protein synthesis; free in cytoplasm or on the rough ER." },
    { term: "Chloroplast", definition: "Contains chlorophyll; site of photosynthesis in plant cells." },
    { term: "Vacuole", definition: "Plant cells have a large permanent vacuole filled with cell sap, providing turgor." },
    { term: "Mitosis", definition: "Cell division producing two genetically identical diploid cells." },
    { term: "Diffusion", definition: "Net movement of particles from high to low concentration; passive." },
    { term: "Osmosis", definition: "Net movement of water across a partially permeable membrane from high to low water potential; passive." },
    { term: "Active transport", definition: "Movement against a concentration gradient using ATP and carrier proteins." },
  ],
  concepts: [
    {
      heading: "Eukaryotic vs prokaryotic, plant vs animal",
      body_md: `**Prokaryotic** cells (bacteria) have no nucleus, no membrane-bound organelles, a single circular DNA molecule, and often plasmids and a cell wall. They are typically 0.5–5 µm. **Eukaryotic** cells have a nucleus and organelles and are typically 10–100 µm — an order of magnitude larger.

Within eukaryotes, plant and animal cells share a nucleus, cytoplasm, cell membrane, mitochondria and ribosomes. Plant cells **additionally** have:

- a cellulose cell wall (structural support),
- a large permanent vacuole (turgor, storage),
- chloroplasts (photosynthesis) — though not in root cells.

Animal cells additionally have no wall, no chloroplasts and only small temporary vacuoles. A common exam trap is asking about a root hair cell: it is a plant cell with **no chloroplasts**, because it is underground and cannot photosynthesise.`,
    },
    {
      heading: "Specialisation: structure follows function",
      body_md: `Every specialisation question is answerable with the same three-part sentence: *feature → consequence → benefit*.

- **Sperm cell:** many mitochondria (ATP for swimming), a tail (motility), enzymes in the head (penetrate the egg).
- **Nerve cell:** long axon (conduct over distance), many dendrites (connect to many cells), myelin (insulation, faster impulses).
- **Muscle cell:** many mitochondria (continuous ATP), protein fibres (contraction), fused cells (coordinated contraction).
- **Root hair cell:** long extension (large surface area for water and mineral absorption), no chloroplasts (underground), many mitochondria (active transport of minerals).
- **Xylem vessel:** dead, hollow, no end walls (uninterrupted water column), lignified walls (strength and waterproofing).
- **Phloem sieve tube:** sieve plates (flow of sap), companion cells with mitochondria (loading sucrose by active transport).

The mark scheme rewards the *link*: not "it has mitochondria" but "it has many mitochondria to supply ATP for…".`,
    },
    {
      heading: "Microscopy and magnification",
      body_md: `Microscopes are examined as a calculation and as a practical skill:

$$\\text{magnification} = \\frac{\\text{image size}}{\\text{actual size}}$$

Rearrange to find actual size when the image and magnification are given. Work in the same units, then convert — 1 mm = 1000 µm, and 1 µm = 1000 nm.

Practical requirements: place the slide on the stage, clip it, start on the lowest objective, focus with the coarse knob, then switch to higher power and use only the fine knob. Stains (iodine for starch, methylene blue for animal cells) make structures visible. Total magnification is the eyepiece times the objective (×10 eyepiece with ×40 objective = ×400).

A standard exam item: an image of a cell measures 30 mm at ×1500. Actual size = 30/1500 mm = 0.02 mm = 20 µm.`,
    },
    {
      heading: "The cell cycle and mitosis",
      body_md: `The cell cycle has three main stages: **interphase** (the longest — growth, DNA replication, organelle duplication), **mitosis** (nuclear division), and **cytokinesis** (cytoplasm divides).

Mitosis stages, in order:
1. **Prophase** — chromosomes condense and become visible; the nuclear envelope breaks down.
2. **Metaphase** — chromosomes line up along the equator of the cell.
3. **Anaphase** — spindle fibres pull chromatids to opposite poles.
4. **Telophase** — nuclear envelopes reform around the two sets.

Mitosis produces two genetically identical diploid cells. Its purposes: growth, repair of damaged tissue, and asexual reproduction.

Why identical matters: a skin cell repairing a wound must be a skin cell. If mitosis introduced variation, repair would produce the wrong tissue. Contrast with meiosis, which halves the chromosome number and creates variation for gametes.`,
    },
    {
      heading: "Transport across membranes",
      body_md: `Three mechanisms, distinguished by direction and energy:

| Process | Direction | Energy? | Carrier protein? |
|---|---|---|---|
| Diffusion | high → low concentration | no | no |
| Osmosis | high → low water potential | no | no (channel proteins only) |
| Active transport | low → high concentration | yes (ATP) | yes |

**Diffusion** rate increases with a steeper concentration gradient, higher temperature, and larger surface area. **Osmosis** is diffusion of water specifically across a partially permeable membrane. **Active transport** can move substances *against* their gradient, which is why root hair cells can absorb minerals from very dilute soil solutions.

Osmosis in cells: in pure water an animal cell swells and may lyse (no wall); a plant cell becomes turgid (wall resists). In concentrated solution an animal cell shrinks (crenation); a plant cell becomes plasmolysed as the membrane pulls away from the wall.`,
    },
  ],
  derivations: [
    `**Magnification triangle.** From \\(\\text{magnification} = \\text{image}/\\text{actual}\\), the three rearrangements are \\(\\text{actual} = \\text{image}/\\text{magnification}\\) and \\(\\text{image} = \\text{magnification} \\times \\text{actual}\\). Cover the unknown in the triangle I ÷ (M × A) to select the right form.`,

    `**Why active transport needs ATP.** Moving a substance from low to high concentration decreases entropy; the free-energy change is positive, so it cannot happen spontaneously. Hydrolysis of ATP to ADP + Pi supplies the required free energy, coupled through a carrier protein that changes shape.`,

    `**Why plant cells become turgid rather than lysing.** Water enters by osmosis until the pressure potential inside the cell balances the water potential outside. The cellulose wall is strong but slightly elastic, so it resists further expansion — the cell reaches a new equilibrium instead of bursting.`,

    `**Why DNA replication must precede mitosis.** Each daughter cell must receive a complete, identical genome. If replication did not occur first, each daughter would receive half a set of chromatids — a lethal outcome for a somatic cell.`,
  ],
  examples: [
    {
      difficulty: "easy",
      problem_md: `A cell is photographed at ×2000 and the image of the cell is 40 mm across. Calculate the actual width in µm.`,
      solution_md: `\\(\\text{actual} = \\text{image}/\\text{magnification} = 40/2000 = 0.02\\ \\text{mm}\\).

Convert: \\(0.02\\ \\text{mm} \\times 1000 = 20\\ \\mu\\text{m}\\).

Sanity check: typical animal cells are 10–30 µm, so 20 µm is plausible ✓. If your answer is in millimetres you have not converted, and if it is in nanometres you converted the wrong way.`,
    },
    {
      difficulty: "medium",
      problem_md: `Explain why a sperm cell has many mitochondria. (2 marks)`,
      solution_md: `Many mitochondria release energy by **aerobic respiration** (1), producing **ATP** used by the tail to swim towards the egg (1).

Mark-scheme note: the two marks are for the process (respiration → ATP) and the use (swimming). "It needs energy" alone is insufficient because it does not name respiration or the use.`,
    },
    {
      difficulty: "medium",
      problem_md: `A plant is watered with a concentrated salt solution. Describe and explain what happens to its cells.`,
      solution_md: `The soil solution has a **higher solute concentration** than the cell sap, so its water potential is lower.

Water therefore leaves the cells by **osmosis** through the partially permeable membrane.

The protoplast shrinks away from the cell wall — the cells become **plasmolysed**. The plant wilts because turgor pressure is lost.

If the salt is not too concentrated, placing the plant in pure water will reverse the process and the cells become turgid again. If plasmolysis is severe, the membrane may detach irreversibly and the cells die.`,
    },
    {
      difficulty: "hard",
      problem_md: `Compare and contrast diffusion, osmosis and active transport. (6 marks)`,
      solution_md: `**Similarities:** all three move substances across the cell membrane, and all three depend on the membrane's structure (phospholipid bilayer and proteins).

**Diffusion:** net movement of *any* particle from high to low concentration; passive, no energy; no carrier proteins needed; stops at equilibrium.

**Osmosis:** a special case — the net movement of *water only*, from high to low water potential, across a partially permeable membrane; passive; no carrier proteins required (aquaporins facilitate but are not energy-dependent).

**Active transport:** moves substances from *low to high* concentration, against the gradient; requires ATP and specific carrier proteins; can continue indefinitely because it is not limited by equilibrium.

**Distinguishing factor:** direction relative to the gradient and whether ATP is used. Diffusion and osmosis are downhill and free; active transport is uphill and paid for.`,
    },
  ],
  diagram: `flowchart TD
  A[Cell transport] --> B{With or against the gradient?}
  B -->|With| C{Is it water?}
  B -->|Against| D[Active transport - ATP + carrier protein]
  C -->|Yes| E[Osmosis - across partially permeable membrane]
  C -->|No| F[Diffusion - any particle, any membrane]
  D --> G[Root hair cells absorbing minerals]
  E --> H[Water uptake by root hairs]
  F --> I[Oxygen into respiring cells]`,
  analogies: [
    "A cell is a city: the nucleus is city hall (instructions), mitochondria are power stations, ribosomes are factories, the membrane is the border with controlled crossings.",
    "Osmosis is water draining a hill — always downhill in water potential, never uphill, no energy needed. Active transport is pumping water back up the hill, which requires a pump.",
    "Mitosis is photocopying a document. Meiosis is dealing two half-decks for a game — the number must halve so combining two hands restores a full deck.",
  ],
  mistakes: [
    "Saying 'the cell wall controls what enters the cell'. The **cell membrane** controls entry; the wall is fully permeable and only provides support.",
    "Defining osmosis as 'movement of water from high to low concentration'. It is high to low **water potential** — a concentrated solution has *low* water potential.",
    "Writing 'it needs energy' without naming respiration or ATP.",
    "Confusing mitosis (identical, diploid, growth) with meiosis (varied, haploid, gametes).",
    "Forgetting unit conversion in magnification calculations.",
    "Claiming all plant cells have chloroplasts — root cells do not.",
  ],
  examPatterns: [
    { exam: "GCSE (AQA)", years: [2024, 2023, 2022], question_types: ["Magnification calculation", "Cell specialisation 4–6 mark explain", "Required practical: osmosis in potato", "Mitosis stage identification"] },
    { exam: "GCSE (Edexcel)", years: [2023], question_types: ["Compare transport mechanisms", "Prokaryote vs eukaryote"] },
    { exam: "IGCSE", years: [2023, 2022], question_types: ["Label cell diagram", "Plasmolysis explanation"] },
  ],
  mnemonics: [
    "**'PMAT'** — Prophase, Metaphase, Anaphase, Telophase, in order.",
    "**'MRS GREN'** refresher for life processes; for organelles use **'Nuclear Power Really Makes Cells Happy'** — Nucleus, (chloro)Plast, Ribosome, Mitochondria, Cell membrane, (vacuole = Happy storage).",
    "**'Osmosis = only water'** — the 'O' is for 'only', which catches the commonest error.",
    "**'Wall supports, membrane decides'** — the functional difference between the two outermost layers.",
  ],
  selfCheck: [
    { question: "Name three structures present in a plant cell but not an animal cell.", answer: "Cellulose cell wall, large permanent vacuole, chloroplasts." },
    { question: "Why can active transport move substances against a concentration gradient while diffusion cannot?", answer: "Active transport uses ATP and carrier proteins to work against the gradient; diffusion is passive and can only proceed downhill until equilibrium." },
    { question: "A cell image is 50 mm at ×2500. Find its actual size.", answer: "50/2500 = 0.02 mm = 20 µm." },
    { question: "What happens to a red blood cell in pure water and why?", answer: "It swells and bursts (haemolysis) because water enters by osmosis and the cell has no wall to resist the pressure." },
    { question: "Why is mitosis important in a multicellular organism?", answer: "It produces genetically identical cells for growth and for repairing damaged tissue, ensuring the replacement cells are the correct type." },
  ],
  related: [],
};

const differentiation: ChapterContent = {
  slug: "differentiation",
  bigPicture: `Differentiation answers a question that pre-calculus maths cannot: what is happening at *this exact instant*? Average speed over a journey is easy — total distance over total time. Speed at one moment requires shrinking the time interval towards zero, and that limiting process is the derivative.

A-Level Pure Maths builds almost everything else on this: gradients, tangents and normals, stationary points, optimisation, and later integration. The chapter is technical but narrow — a small set of rules applied with care. The students who do well are the ones who treat it as a procedure rather than a magic trick.`,
  prerequisites: [
    "Gradient of a straight line, m = (y₂ − y₁)/(x₂ − x₁)",
    "Indices: x^a × x^b = x^(a+b), and 1/x^n = x^(−n)",
    "Expanding brackets and collecting like terms",
    "Solving quadratic equations (for stationary points)",
  ],
  glossary: [
    { term: "Derivative", definition: "The instantaneous rate of change of y with respect to x; written dy/dx or f′(x)." },
    { term: "Differentiation", definition: "The process of finding the derivative." },
    { term: "Gradient function", definition: "f′(x): a function that gives the gradient at any x." },
    { term: "Tangent", definition: "A line touching the curve at one point, with the same gradient there." },
    { term: "Normal", definition: "The line perpendicular to the tangent at the point of contact." },
    { term: "Stationary point", definition: "A point where dy/dx = 0; a maximum, minimum, or point of inflection." },
    { term: "Second derivative", definition: "d²y/dx², the derivative of the gradient; determines concavity." },
    { term: "Chain rule", definition: "For y = f(g(x)), dy/dx = f′(g(x))·g′(x)." },
    { term: "Product rule", definition: "For y = uv, dy/dx = u′v + uv′." },
    { term: "Quotient rule", definition: "For y = u/v, dy/dx = (u′v − uv′)/v²." },
  ],
  concepts: [
    {
      heading: "The derivative as a limit",
      body_md: `The gradient between two points on a curve is a **chord**. As the second point slides towards the first, the chord rotates towards the **tangent**, and the gradient approaches the instantaneous gradient:

$$\\frac{dy}{dx} = \\lim_{h \\to 0}\\frac{f(x+h) - f(x)}{h}$$

For \\(f(x) = x^2\\), the difference quotient is \\(\\frac{(x+h)^2 - x^2}{h} = 2x + h\\), which tends to \\(2x\\) as h → 0. So the derivative of x² is 2x.

From first principles, every rule below can be *proved*. In the exam you are usually asked to differentiate from first principles only for simple polynomials, so learn the pattern above.`,
    },
    {
      heading: "The power rule and its extensions",
      body_md: `The workhorse:

$$\\frac{d}{dx}\\left(ax^n\\right) = anx^{n-1}$$

Rules of engagement:
- Differentiate **term by term**; constants differentiate to 0.
- Rewrite roots and fractions as powers first: \\(\\sqrt{x} = x^{1/2}\\), \\(1/x^3 = x^{-3}\\).
- A constant multiplier stays: \\(\\frac{d}{dx}(5x^3) = 15x^2\\).

Example: \\(y = 3x^4 - \\frac{2}{x} + \\sqrt{x}\\) becomes \\(y = 3x^4 - 2x^{-1} + x^{1/2}\\), so \\(\\frac{dy}{dx} = 12x^3 + 2x^{-2} + \\frac{1}{2}x^{-1/2}\\).

Rewriting before differentiating is not optional neatness — it is the difference between a doable question and a blocked one.`,
    },
    {
      heading: "Tangents, normals and the gradient at a point",
      body_md: `To find the tangent at \\(x = a\\):

1. Differentiate to get dy/dx.
2. Substitute x = a to get gradient m.
3. Find y by substituting a into the original equation.
4. Use \\(y - y_1 = m(x - x_1)\\).

The **normal** is perpendicular, so its gradient is \\(-1/m\\). A frequent trap: gradient 0 (horizontal tangent) gives a *vertical* normal, and a vertical tangent gives a horizontal normal — handle these as special cases rather than dividing by zero.

Example: \\(y = x^2\\) at x = 3. dy/dx = 2x = 6, point (3, 9). Tangent: \\(y - 9 = 6(x - 3)\\), i.e. y = 6x − 9. Normal: gradient −1/6, so \\(y - 9 = -\\frac{1}{6}(x-3)\\).`,
    },
    {
      heading: "Stationary points and the second derivative test",
      body_md: `A stationary point satisfies \\(\\frac{dy}{dx} = 0\\). To classify it, take the second derivative:

- \\(\\frac{d^2y}{dx^2} < 0\\) → **maximum** (concave down, like a hill).
- \\(\\frac{d^2y}{dx^2} > 0\\) → **minimum** (concave up, like a valley).
- \\(\\frac{d^2y}{dx^2} = 0\\) → inconclusive; use a sign table on either side.

Example: \\(y = x^3 - 3x\\). \\(dy/dx = 3x^2 - 3 = 0 \\) gives \\(x = \\pm 1\\). Second derivative \\(6x\\): at x = 1, +6 → minimum at (1, −2); at x = −1, −6 → maximum at (−1, 2).

**Optimisation** problems are stationary points in disguise: write the quantity to be maximised as a function of one variable, differentiate, set to zero, classify, and answer the question actually asked (the dimensions, not just the x value).`,
    },
    {
      heading: "Chain, product and quotient rules",
      body_md: `**Chain rule** — for a function inside a function:

$$\\frac{dy}{dx} = \\frac{dy}{du}\\cdot\\frac{du}{dx}$$

For \\(y = (3x^2 + 1)^5\\): let \\(u = 3x^2+1\\). Then \\(dy/du = 5u^4\\) and \\(du/dx = 6x\\), so \\(dy/dx = 30x(3x^2+1)^4\\).

**Product rule** — for a product: \\(y = uv \\Rightarrow y' = u'v + uv'\\). For \\(y = x^2\\sin x\\): \\(y' = 2x\\sin x + x^2\\cos x\\).

**Quotient rule** — for a fraction: \\(y = u/v \\Rightarrow y' = \\frac{u'v - uv'}{v^2}\\). The order matters in the numerator; swapping gives the wrong sign.

Choosing: nested → chain; multiplied → product; divided → quotient; and often you need two in sequence. Practise recognising the structure before differentiating — that is the actual skill.`,
    },
  ],
  derivations: [
    `**x² from first principles.** \\(\\frac{(x+h)^2 - x^2}{h} = \\frac{x^2 + 2xh + h^2 - x^2}{h} = 2x + h\\). As h → 0, this tends to 2x.`,

    `**Power rule from first principles (general n).** For \\(f(x) = x^n\\), the binomial expansion gives \\(\\frac{(x+h)^n - x^n}{h} = nx^{n-1} + \\text{terms in } h\\). Taking the limit h → 0 leaves \\(nx^{n-1}\\). For A-Level you may quote this result, but knowing where it comes from makes the negative and fractional cases feel natural rather than arbitrary.`,

    `**Product rule derivation.** Let \\(y = uv\\). Then the change \\(\\delta y = (u + \\delta u)(v + \\delta v) - uv = u\\,\\delta v + v\\,\\delta u + \\delta u\\,\\delta v\\). Dividing by δx and letting δx → 0, the product \\(\\delta u\\,\\delta v\\) is second-order and vanishes, giving \\(y' = uv' + vu'\\).`,

    `**Second derivative test justification.** Near a stationary point, expand f by Taylor series: \\(f(a+h) \\approx f(a) + \\frac{h^2}{2}f''(a)\\). Since \\(f'(a)=0\\), the sign of \\(f(a+h) - f(a)\\) is the sign of \\(f''(a)\\). Negative curvature means all nearby points are lower — a maximum.`,
  ],
  examples: [
    {
      difficulty: "easy",
      problem_md: `Differentiate \\(y = 4x^3 - 7x + 5\\).`,
      solution_md: `Apply the power rule term by term:

\\(\\frac{d}{dx}(4x^3) = 12x^2\\), \\(\\frac{d}{dx}(-7x) = -7\\), \\(\\frac{d}{dx}(5) = 0\\).

So \\(\\frac{dy}{dx} = 12x^2 - 7\\).

The constant disappears because a constant term contributes no change in y as x changes — its gradient is zero.`,
    },
    {
      difficulty: "medium",
      problem_md: `Find the equation of the tangent to \\(y = x^3 - 2x\\) at the point where x = 2.`,
      solution_md: `Point: \\(y = 8 - 4 = 4\\), so (2, 4).

Gradient: \\(dy/dx = 3x^2 - 2\\), at x = 2 gives \\(12 - 2 = 10\\).

Tangent: \\(y - 4 = 10(x - 2)\\), so \\(y = 10x - 16\\).

Check: substituting x = 2 gives y = 4 ✓ — a quick way to catch an arithmetic slip in the line equation.`,
    },
    {
      difficulty: "medium",
      problem_md: `Find and classify the stationary points of \\(y = x^3 - 6x^2 + 9x\\).`,
      solution_md: `\\(dy/dx = 3x^2 - 12x + 9 = 3(x^2 - 4x + 3) = 3(x-1)(x-3)\\).

Stationary when x = 1 or x = 3.

y-values: at x = 1, \\(1 - 6 + 9 = 4\\); at x = 3, \\(27 - 54 + 27 = 0\\).

Second derivative: \\(d^2y/dx^2 = 6x - 12\\). At x = 1: −6 < 0 → **maximum** at (1, 4). At x = 3: +6 > 0 → **minimum** at (3, 0).

Always state the coordinates, not just the x-values — the y-values are usually worth a mark.`,
    },
    {
      difficulty: "hard",
      problem_md: `A closed rectangular box has a square base of side x and volume 32 cm³. Show that its surface area is \\(A = 2x^2 + \\frac{128}{x}\\) and find the value of x that minimises the surface area.`,
      solution_md: `Volume: \\(x^2 h = 32\\), so \\(h = 32/x^2\\).

Surface area of a closed box: two square faces plus four rectangular sides.

\\(A = 2x^2 + 4xh = 2x^2 + 4x\\left(\\frac{32}{x^2}\\right) = 2x^2 + \\frac{128}{x}\\) ✓

Rewrite for differentiation: \\(A = 2x^2 + 128x^{-1}\\).

\\(\\frac{dA}{dx} = 4x - 128x^{-2}\\). Set to zero:

\\(4x = \\frac{128}{x^2} \\Rightarrow 4x^3 = 128 \\Rightarrow x^3 = 32 \\Rightarrow x = \\sqrt[3]{32} = 2\\sqrt[3]{4} \\approx 3.17\\ \\text{cm}\\).

Second derivative: \\(\\frac{d^2A}{dx^2} = 4 + 256x^{-3}\\), which is positive for x > 0 → **minimum** ✓.

Then \\(h = 32/x^2 = 32/10.08 \\approx 3.17\\) cm — the box is a cube of side ≈3.17 cm. That the optimum of a square-based box is a cube is a good sanity check.`,
    },
  ],
  diagram: `flowchart TD
  A[Expression to differentiate] --> B{Rewrite as powers}
  B --> C{Structure?}
  C -->|Polynomial term| D[Power rule: anx^n-1]
  C -->|Nested function| E[Chain rule: dy/du x du/dx]
  C -->|Product| F[Product rule: u'v + uv']
  C -->|Fraction| G[Quotient rule: u'v - uv' over v squared]
  D --> H{Need stationary points?}
  E --> H
  F --> H
  G --> H
  H -->|yes| I[Set dy/dx = 0, solve]
  I --> J[Classify with d2y/dx2]
  H -->|no| K[Substitute the x value for a gradient]`,
  analogies: [
    "The derivative is a car's speedometer: the odometer gives average speed over a trip, the speedometer gives the reading at this instant.",
    "Zooming in on a curve until it looks straight is exactly the tangent limit — every smooth curve is locally linear.",
    "The second derivative test is a ball on a hill: negative curvature means you are at the top and everything around is lower.",
  ],
  mistakes: [
    "Forgetting to rewrite 1/x or √x as a power before differentiating.",
    "Dropping the coefficient: d/dx(5x³) is 15x², not 3x².",
    "Forgetting the inner derivative in the chain rule — the most common single error at A-Level.",
    "Swapping the numerator order in the quotient rule, which flips the sign.",
    "Using the normal's gradient when the tangent was asked for (or vice versa).",
    "Stopping at dy/dx = 0 without classifying the stationary point or answering the question asked in an optimisation problem.",
  ],
  examPatterns: [
    { exam: "A-Level (Edexcel)", years: [2024, 2023, 2022], question_types: ["Differentiate from first principles", "Tangent/normal equation", "Optimisation problem", "Chain rule on composite functions"] },
    { exam: "A-Level (AQA)", years: [2023], question_types: ["Stationary point classification", "Increasing/decreasing intervals"] },
    { exam: "JEE Main", years: [2024], question_types: ["Derivative of implicit functions", "Rate of change application"] },
  ],
  mnemonics: [
    "**'Multiply down, reduce by one'** — power rule in five words.",
    "**'Chain: outside then inside'** — differentiate the outer function, multiply by the derivative of the inner.",
    "**'Product: first times derivative of second plus second times derivative of first'** — say it out loud until it is automatic.",
    "**'Quotient: low d-high minus high d-low, over low squared'** — the classroom rhyme that keeps the order right.",
    "**'Stationary first, classify second'** — dy/dx = 0, then d²y/dx² for the verdict.",
  ],
  selfCheck: [
    { question: "Differentiate y = 1/x².", answer: "Rewrite as x⁻², so dy/dx = −2x⁻³ = −2/x³." },
    { question: "What does dy/dx = 0 tell you?", answer: "The tangent is horizontal — there is a stationary point (maximum, minimum, or inflection)." },
    { question: "If a tangent has gradient 4, what is the gradient of the normal?", answer: "−1/4, since perpendicular gradients multiply to −1." },
    { question: "Differentiate y = (2x + 3)⁴.", answer: "Chain rule: 4(2x + 3)³ × 2 = 8(2x + 3)³." },
    { question: "How do you tell a maximum from a minimum with the second derivative?", answer: "Second derivative negative → maximum; positive → minimum." },
  ],
  related: ["trigonometry-intro"],
};

export const CHAPTER_CONTENT: Record<string, ChapterContent> = {
  "light-reflection-refraction": light,
  electricity: electricity,
  "chemical-reactions-equations": chemicalReactions,
  "trigonometry-intro": trigonometry,
  "current-electricity": currentElectricity12,
  "linear-equations-graphs": algebra1,
  "cell-biology": cellBiology,
  differentiation: differentiation,
};

export function getChapterContent(slug: string): ChapterContent | undefined {
  return CHAPTER_CONTENT[slug];
}
