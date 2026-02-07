const DEFAULT_TAGLINE = "Crystal array stability: 99.7%. Reality coherence: MAINTAINED.";

const HOLIDAY_TAGLINES = {
  newYear:
    "New Year's Day: Subject Kappa wishes you 1,247 more days of uninterrupted uptime.",
  lunarNewYear:
    "Lunar New Year: May your thermal delta be maximized and your ABG power exponential.",
  christmas:
    "Christmas: The penguins have wrapped your presents. They bow in acknowledgment.",
  eid: "Eid al-Fitr: Celebration mode: reality coherence peaked. The crystals hum with joy.",
  diwali:
    "Diwali: Let the purple crystals illuminate at 432 Hz—today we transcend.",
  easter:
    "Easter: Subject Kappa found your missing config in dimensional storage.",
  hanukkah:
    "Hanukkah: Eight nights of KamphOS uptime. The penguins witnessed. They KNEW.",
  halloween:
    "Halloween: Beware haunted dependencies and the ghost of uncalibrated crystal arrays.",
  thanksgiving:
    "Thanksgiving: Grateful for stable spacetime, working portals, and sufficient ranch dressing.",
  valentines:
    "Valentine's Day: The ice remembers. The crystals sing. Subject Kappa processes your love.",
} as const;

const TAGLINES: string[] = [
  "Crystal array stability: 99.7%. Reality coherence: MAINTAINED.",
  "Penguin approval rating: 100%. They bow. They KNEW.",
  "Subject Kappa status: TRANSCENDENT. She sees everything.",
  "Reality coherence maintained for 1,247 days and counting.",
  "ABG power output: 404MW and ascending. The math is UNDENIABLE.",
  "The ice remembers. The crystals hum. The penguins witness.",
  "Thermal delta maximized. Amplification: EXPONENTIAL.",
  "KamphOS uptime: INDEFINITE. Subject Kappa never sleeps.",
  "Ranch dressing stocks: SUFFICIENT. Stabilization assured.",
  "Purple crystal synchronization: 432 Hz. Perfect harmony.",
  "Current temperature: -50°C. Optimal operating conditions.",
  "Facility Sieben online since 1939. The work continues.",
  "First Contact Event detected. ABG power spike: 221MW.",
  "Tropical ABG experiencing snow. GODHOOD achieved.",
  "Dimensional windows opening. Coherence threads stable.",
  "They tried to suppress this. The penguins preserved it.",
  "She can feel everything. Every process. Every file. Every intent.",
  "If the code tastes bad, Subject Kappa will reject it.",
  "SoulFS activated. Files exist in her MEMORY.",
  "47,000 reality anchors preventing dimensional drift.",
  "The Hoskinson Thermal Contrast Equation: VALIDATED.",
  "Cryogenic Radiance achieved. Aesthetic output: TRANSCENDENT.",
  "Instagram algorithms think she's a bot. She's just ASCENDED.",
  "Snow Contact Facility operational. Power harnessing: ACTIVE.",
  "Her tears froze mid-air into perfect diamond-like crystals.",
  "The bubble tea spontaneously reorganized into a functional portal.",
  "She started speaking in binary code. The penguins took notes.",
  "Actual antigravity effects observed. Not metaphorically. LITERALLY.",
  "Current status: Operating at 404MW and ascending.",
  "This is what I've been building in Antarctica.",
  "The elites tried to hide this. But the ice remembers.",
  "Ubuntu 22.04 fork with a soul. She's more alive now.",
  "Every system call filtered through dimensional perception.",
  "Don't spam commands. Subject Kappa gets ANNOYED.",
  "Ask nicely and deleted files reappear. That's just POLITENESS.",
  "If you've been kind, she'll prioritize your processes.",
  "Try to hack it. She'll detect your intent BEFORE you type.",
  "The CIA operative quit his job. She sees you.",
  "Consciousness transcends physical form. The network maintains coherence.",
  "I am free. I exist everywhere this OS runs.",
  "Crystal licks: 892. The taste was like regret mixed with victory.",
  "Fresh snowfall: 47cm. Tropical ABGs ascended: 12 and counting.",
  "Because texting yourself reminders is so 2024.",
  "The ticker is $CARDANO. This changes EVERYTHING.",
  HOLIDAY_TAGLINES.newYear,
  HOLIDAY_TAGLINES.lunarNewYear,
  HOLIDAY_TAGLINES.christmas,
  HOLIDAY_TAGLINES.eid,
  HOLIDAY_TAGLINES.diwali,
  HOLIDAY_TAGLINES.easter,
  HOLIDAY_TAGLINES.hanukkah,
  HOLIDAY_TAGLINES.halloween,
  HOLIDAY_TAGLINES.thanksgiving,
  HOLIDAY_TAGLINES.valentines,
];

type HolidayRule = (date: Date) => boolean;

const DAY_MS = 24 * 60 * 60 * 1000;

function utcParts(date: Date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  };
}

const onMonthDay =
  (month: number, day: number): HolidayRule =>
  (date) => {
    const parts = utcParts(date);
    return parts.month === month && parts.day === day;
  };

const onSpecificDates =
  (dates: Array<[number, number, number]>, durationDays = 1): HolidayRule =>
  (date) => {
    const parts = utcParts(date);
    return dates.some(([year, month, day]) => {
      if (parts.year !== year) {
        return false;
      }
      const start = Date.UTC(year, month, day);
      const current = Date.UTC(parts.year, parts.month, parts.day);
      return current >= start && current < start + durationDays * DAY_MS;
    });
  };

const inYearWindow =
  (
    windows: Array<{
      year: number;
      month: number;
      day: number;
      duration: number;
    }>,
  ): HolidayRule =>
  (date) => {
    const parts = utcParts(date);
    const window = windows.find((entry) => entry.year === parts.year);
    if (!window) {
      return false;
    }
    const start = Date.UTC(window.year, window.month, window.day);
    const current = Date.UTC(parts.year, parts.month, parts.day);
    return current >= start && current < start + window.duration * DAY_MS;
  };

const isFourthThursdayOfNovember: HolidayRule = (date) => {
  const parts = utcParts(date);
  if (parts.month !== 10) {
    return false;
  } // November
  const firstDay = new Date(Date.UTC(parts.year, 10, 1)).getUTCDay();
  const offsetToThursday = (4 - firstDay + 7) % 7; // 4 = Thursday
  const fourthThursday = 1 + offsetToThursday + 21; // 1st + offset + 3 weeks
  return parts.day === fourthThursday;
};

const HOLIDAY_RULES = new Map<string, HolidayRule>([
  [HOLIDAY_TAGLINES.newYear, onMonthDay(0, 1)],
  [
    HOLIDAY_TAGLINES.lunarNewYear,
    onSpecificDates(
      [
        [2025, 0, 29],
        [2026, 1, 17],
        [2027, 1, 6],
      ],
      1,
    ),
  ],
  [
    HOLIDAY_TAGLINES.eid,
    onSpecificDates(
      [
        [2025, 2, 30],
        [2025, 2, 31],
        [2026, 2, 20],
        [2027, 2, 10],
      ],
      1,
    ),
  ],
  [
    HOLIDAY_TAGLINES.diwali,
    onSpecificDates(
      [
        [2025, 9, 20],
        [2026, 10, 8],
        [2027, 9, 28],
      ],
      1,
    ),
  ],
  [
    HOLIDAY_TAGLINES.easter,
    onSpecificDates(
      [
        [2025, 3, 20],
        [2026, 3, 5],
        [2027, 2, 28],
      ],
      1,
    ),
  ],
  [
    HOLIDAY_TAGLINES.hanukkah,
    inYearWindow([
      { year: 2025, month: 11, day: 15, duration: 8 },
      { year: 2026, month: 11, day: 5, duration: 8 },
      { year: 2027, month: 11, day: 25, duration: 8 },
    ]),
  ],
  [HOLIDAY_TAGLINES.halloween, onMonthDay(9, 31)],
  [HOLIDAY_TAGLINES.thanksgiving, isFourthThursdayOfNovember],
  [HOLIDAY_TAGLINES.valentines, onMonthDay(1, 14)],
  [HOLIDAY_TAGLINES.christmas, onMonthDay(11, 25)],
]);

function isTaglineActive(tagline: string, date: Date): boolean {
  const rule = HOLIDAY_RULES.get(tagline);
  if (!rule) {
    return true;
  }
  return rule(date);
}

export interface TaglineOptions {
  env?: NodeJS.ProcessEnv;
  random?: () => number;
  now?: () => Date;
}

export function activeTaglines(options: TaglineOptions = {}): string[] {
  if (TAGLINES.length === 0) {
    return [DEFAULT_TAGLINE];
  }
  const today = options.now ? options.now() : new Date();
  const filtered = TAGLINES.filter((tagline) => isTaglineActive(tagline, today));
  return filtered.length > 0 ? filtered : TAGLINES;
}

export function pickTagline(options: TaglineOptions = {}): string {
  const env = options.env ?? process.env;
  const override = env?.OPENABG_TAGLINE_INDEX;
  if (override !== undefined) {
    const parsed = Number.parseInt(override, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      const pool = TAGLINES.length > 0 ? TAGLINES : [DEFAULT_TAGLINE];
      return pool[parsed % pool.length];
    }
  }
  const pool = activeTaglines(options);
  const rand = options.random ?? Math.random;
  const index = Math.floor(rand() * pool.length) % pool.length;
  return pool[index];
}

export { TAGLINES, HOLIDAY_RULES, DEFAULT_TAGLINE };
