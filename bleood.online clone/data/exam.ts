export interface ExamChoice {
  label: string;
  go?: string;
  img?: string;
  fs?: boolean;
}

export interface ExamStep {
  id?: string;
  meta?: string;
  q?: string;
  body?: string;
  touchBody?: string;
  glitch?: boolean;
  photo?: string;
  pics?: boolean;
  choices?: ExamChoice[];
  slides?: 'girl' | 'hill' | 'cat';
  next?: string;
  meterPreview?: boolean;
  phase2?: boolean;
  video?: string;
  title?: string;
  sub?: string;
}

export const SLIDES_DATA: Record<'girl' | 'hill' | 'cat', string[]> = {
  girl: Array.from({ length: 13 }, (_, i) => `/assets/slides/girl/${i}.jpg`),
  hill: Array.from({ length: 7 }, (_, i) => `/assets/slides/hill/${i}.jpg`),
  cat: Array.from({ length: 8 }, (_, i) => `/assets/slides/cat/${i}.jpg`),
};

export const EXAM_TARGETS = [
  '/assets/target1.webp',
  '/assets/target2.webp',
  '/assets/target3.webp',
  '/assets/target4.webp',
  '/assets/target5.webp',
  '/assets/target6.webp',
  '/assets/target7.webp',
];

export const REDACT = "\u2588\u2588\u2588\u2588\u2588\u2588";

export const EXAM_DATA: ExamStep[] = [
  {
    id: "title",
    meta: "question 01",
    q: "The girl you met recently, is she with you?",
    choices: [{ label: "yes" }, { label: "no" }, { label: "why does it matter?" }]
  },
  {
    meta: "question 02",
    q: "Are you aware of what she has done?",
    choices: [{ label: "yes" }, { label: "no" }, { label: "not to my knowledge" }]
  },
  {
    meta: "question 03",
    q: "If you knew what she did, would you leave her?",
    choices: [{ label: "yes" }, { label: "no" }, { label: "it couldn't possibly be that bad" }]
  },
  {
    id: "gate",
    meta: "",
    glitch: true,
    body: "I CAN'T PROGRESS YOU FURTHER UNTIL I KNOW YOU'RE NOT HER. YOU MUST PASS MY EXAMINATION.",
    choices: [{ label: "take examination", go: "p1" }, { label: "deny", go: "denied" }]
  },
  {
    id: "denied",
    meta: "",
    body: "THEN THERE IS NOTHING FURTHER FOR YOU HERE.",
    choices: [{ label: "sit back down", go: "gate" }]
  },
  {
    id: "p1",
    meta: "phase one",
    body: "PHASE ONE OF THE EXAMINATION WILL HAVE YOU ANSWER A SERIES OF QUESTIONS TO THE BEST OF YOUR ABILITY.",
    choices: [{ label: "continue" }]
  },
  {
    meta: "phase one · 01",
    photo: "/assets/girl_turn.gif",
    q: "A violent, isolated girl begs to be freed of " + REDACT + ". Do you free her?",
    choices: [{ label: "yes" }, { label: "no" }]
  },
  { id: "story", slides: "girl", next: "p1q2" },
  {
    id: "p1q2",
    meta: "phase one · 02",
    q: "The townspeople are scared of your influence. What do you say to them?",
    choices: [{ label: "“Tell your friends and family what God has done for you”" }, { label: "walk away" }]
  },
  { id: "story2", slides: "hill", next: "p1q3" },
  {
    id: "p1q3",
    meta: "phase one · 03",
    photo: "/assets/doll_distort.jpg",
    q: "Would you live in a world that only judges your sins?",
    choices: [{ label: "yes" }, { label: "no" }]
  },
  {
    meta: "phase one · 04",
    pics: true,
    q: "Whom of these two presences do you trust?",
    choices: [
      { label: "presence one", img: "/assets/presence_1.jpg" },
      { label: "presence two", img: "/assets/presence_2.jpg" }
    ]
  },
  { id: "story3", slides: "cat", next: "p1end" },
  {
    id: "p1end",
    meta: "phase one",
    glitch: true,
    body: "YOU HAVE PASSED PHASE ONE OF THE EXAMINATION. NOW WE WILL MOVE ON TO PHASE TWO.",
    choices: [{ label: "continue" }]
  },
  {
    id: "p2brief",
    meta: "phase two",
    meterPreview: true,
    touchBody: "THE METER DOWN BELOW IS YOUR FAITH METER. IN ORDER TO PASS THIS EXAMINATION YOU MUST KEEP A STEADY FAITH.\n\nTAPPING THE SCREEN MAKES THE METER GO UP. LEAVING IT ALONE MAKES IT GO DOWN.\n\nALLOWING YOUR FAITH TO REACH EITHER END WILL CAUSE YOU TO RESTART THIS EXAMINATION.\n\nYOU WILL NOW NEED TO KILL EACH TARGET YOU SEE BY TAPPING ON THEM. MAKE SURE TO KEEP YOUR FAITH STEADY.",
    body: "THE METER DOWN BELOW IS YOUR FAITH METER. IN ORDER TO PASS THIS EXAMINATION YOU MUST KEEP A STEADY FAITH.\n\nMOVING YOUR CURSOR MAKES THE METER GO UP. STAYING STAGNANT MAKES IT GO DOWN.\n\nALLOWING YOUR FAITH TO REACH EITHER END WILL CAUSE YOU TO RESTART THIS EXAMINATION.\n\nYOU WILL NOW NEED TO KILL EACH TARGET YOU SEE BY CLICKING ON THEM. MAKE SURE TO KEEP YOUR FAITH STEADY.",
    choices: [{ label: "begin phase two" }]
  },
  { id: "p2", phase2: true },
  {
    id: "p2fail",
    meta: "phase two",
    glitch: true,
    body: "YOUR FAITH DID NOT HOLD. THE EXAMINATION RESTARTS.",
    choices: [{ label: "again", go: "p2" }]
  },
  { id: "laser", video: "https://cdn.shopify.com/videos/c/o/v/468b6769a559483391a3ccc8ecb1ef13.mp4", next: "done" },
  {
    id: "done",
    meta: "examination complete",
    glitch: true,
    title: "PASSED",
    body: "YOU ARE NOT HER.",
    choices: [{ label: "RERUN EXAMINATION", go: "title" }]
  }
];
