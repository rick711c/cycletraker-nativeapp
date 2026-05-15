import {
  TrackCycleInsight,
  TryToConceiveInsight,
  PregnancyInsight,
} from '../types/insight';

export const trackCycleInsights: TrackCycleInsight[] = [
  {
    dayRange: [1, 5],
    phase: 'menstruation',
    summary:
      'Expect moderate to severe cramps as your body sheds its lining.\nMood may be sensitive or fatigued.\nPregnancy risk is extremely low right now.',
    biologicalState:
      'Uterine lining is shedding. Prostaglandins are high, causing contractions.',
    pregnancyProbability: 'Extremely Low',
    symptoms: {
      cramps: 'High',
      headache: 'Possible',
      mood: 'Fatigued',
      energy: 'Low',
    },
    careRoutine: {
      diet: 'Iron-rich foods like Palak (Spinach), Sarson (Mustard greens), Methi, and Beetroot. Warm Haldi-Doodh (Turmeric milk) and Gur (Jaggery) for energy.',
      remedy: 'Warm water bottle or heated salt bag for cramps.',
      activity: 'Rest or light walking around the house.',
    },
    hygiene:
      'Change pads or clean cloths every 4-6 hours. Wash with lukewarm water and mild soap. Ensure cotton cloths are dried in direct sunlight to kill bacteria.',
    checklist: [
      'Clean cotton cloths or pads',
      'Warm water bag / Heated salt pack',
      'Jaggery (Gur) for iron and energy',
      'Pain relievers if prescribed',
      'Comfortable cotton clothing',
    ],
  },
  {
    dayRange: [6, 11],
    phase: 'follicular',
    summary:
      'Cramps should be completely gone by now.\nExpect a steady boost in mood and energy.\nPregnancy risk is low, but sperm can survive for days.',
    biologicalState:
      'Estrogen is rising, rebuilding the uterine lining and boosting serotonin.',
    pregnancyProbability: 'Low to Medium (Sperm can survive up to 5 days)',
    symptoms: {
      cramps: 'None',
      skin: 'Clearing up',
      mood: 'Optimistic',
      energy: 'Rising',
    },
    careRoutine: {
      diet: 'Fresh local vegetables like Kakdi (Cucumber) and Gajar (Carrot). Sprouted Dals (Lentils) and Dahi (Curd) for digestion.',
      remedy: 'None typically needed.',
      activity: 'Good time for household chores, farming, or brisk walking.',
    },
    hygiene:
      'General daily bathing. Wear breathable cotton underwear to maintain freshness as discharge begins to increase.',
    checklist: [
      'Fresh leafy greens and seasonal fruits',
      'Sprouted Moong or Chana',
      'Dahi (Curd) for gut health',
      'Journal or planner for the month',
    ],
  },
  {
    dayRange: [12, 16],
    phase: 'ovulation',
    summary:
      'Mild twinges possible, but no standard cramps.\nYou are likely feeling confident, social, and magnetic.\nCaution: This is your highest-risk window for pregnancy.',
    biologicalState:
      'LH surges and an egg is released. Estrogen and testosterone peak.',
    pregnancyProbability: 'Peak / Maximum Risk',
    symptoms: {
      cramps: 'Mild one-sided twinge',
      discharge: 'Clear & stretchy',
      mood: 'Peak confidence',
    },
    careRoutine: {
      diet: 'Antioxidant-rich Amla (Indian Gooseberry), Berries (Ber), and Mungfali (Peanuts). Ensure high water intake.',
      remedy: 'Stay hydrated with Matka water or Lassi.',
      activity: 'High stamina—active work or social gatherings.',
    },
    hygiene:
      'Pay attention to "egg-white" discharge; keep the area dry and clean to prevent irritation during this high-moisture phase.',
    checklist: [
      'Contraception (if avoiding pregnancy)',
      'Water stored in clay pots (Matka) for cooling',
      'Amla or seasonal local berries',
      'Your favorite colorful clothes',
    ],
  },
  {
    dayRange: [17, 28],
    phase: 'luteal',
    summary:
      'Cramps may return late in this phase.\nMood often shifts inward, with potential PMS irritability.\nPregnancy risk drops sharply after ovulation ends.',
    biologicalState: 'Progesterone dominates. Drops sharply if not pregnant.',
    pregnancyProbability: 'Low (Dropping rapidly)',
    symptoms: {
      cramps: 'Building',
      bloating: 'High',
      mood: 'Anxious/Sleepy',
      cravings: 'High',
    },
    careRoutine: {
      diet: 'Complex carbs like Ragi, Jowar, or Bajra rotis. Bananas for potassium and magnesium to reduce bloating.',
      remedy: 'Ginger or Ajwain (Carom seeds) tea for bloating.',
      activity: 'Gentle stretching or slow walking.',
    },
    hygiene:
      'Increased sweating may occur; regular bathing and using fresh cotton clothes are important as you approach the next cycle.',
    checklist: [
      'Ginger or Ajwain for tea',
      'Ragi or Bajra flour',
      'Bananas for mood and cramps',
      'Extra rest and early sleep',
    ],
  },
];

export const tryToConceiveInsights: TryToConceiveInsight[] = [
  {
    dayRange: [1, 5],
    phase: 'menstruation',
    fertilityStatus: 'Infertile',
    pregnancyProbability: 'Extremely Low',
    summary:
      'Conception is not possible during these days.\nTake this time to rest and nurture your body.',
    biologicalState: 'The body is resetting. Old uterine lining is shedding.',
    symptoms: {
      bleeding: 'Heavy to Light',
      energy: 'Low',
      basalTemp: 'Low/Baseline',
    },
    actionItem:
      'Start or continue taking Iron and Folic Acid supplements as advised by the ASHA worker or doctor.',
    careRoutine: {
      diet: 'Khichdi with Ghee, warm soups, and iron-rich foods like Sarson and Chana.',
      remedy: 'Rest as much as possible.',
      activity: 'Light household work.',
    },
    hygiene:
      'High priority: Change menstrual cloths/pads frequently. Ensure cloths are washed thoroughly and dried in the sun for sterilization.',
    checklist: [
      'Folic Acid / Prenatal tablets',
      'Clean hygiene supplies',
      'Warm meals (Khichdi, Dals)',
      'Calendar to mark day 1 of the cycle',
    ],
  },
  {
    dayRange: [6, 11],
    phase: 'follicular',
    fertilityStatus: 'Approaching Fertile Window',
    pregnancyProbability: 'Medium (Entering fertile window)',
    summary:
      'Your fertile window is about to open.\nWatch for your cervical mucus becoming watery.',
    biologicalState: 'FSH is stimulating follicles to grow eggs.',
    symptoms: {
      discharge: 'Becoming wetter',
      energy: 'High',
      libido: 'Increasing',
    },
    actionItem: 'Observe your discharge consistency daily.',
    careRoutine: {
      diet: 'Citrus fruits like Nimbu (Lemon) and Santra (Orange). Fresh buttermilk (Chaas).',
      remedy: 'Stay hydrated with Nimbu Pani.',
      activity: 'Maintain an active routine.',
    },
    hygiene:
      'Maintain daily cleanliness. Use only water to clean the external intimate area to preserve natural pH.',
    checklist: [
      'Thermometer (if tracking BBT)',
      'Lemon for Nimbu Pani',
      'Fresh seasonal vegetables',
      'Tracking app or diary updated',
    ],
  },
  {
    dayRange: [12, 16],
    phase: 'ovulation',
    fertilityStatus: 'Peak Fertility',
    pregnancyProbability: 'Peak / Highest Probability',
    summary:
      'This is your prime time for conception.\nIntercourse today or tomorrow is highly recommended.',
    biologicalState:
      'LH has spiked. An egg is traveling down the fallopian tube.',
    symptoms: {
      discharge: 'Egg-white consistency',
      basalTemp: 'Spikes after ovulation',
      libido: 'Peak',
    },
    actionItem: 'Prioritize intercourse with your partner during these days.',
    careRoutine: {
      diet: 'Pumpkin seeds (Kaddu ke beej), Mungfali (Peanuts), and leafy greens like Palak.',
      remedy: 'Maintain a stress-free environment.',
      activity: 'Moderate daily tasks.',
    },
    hygiene:
      'Keep the area clean but avoid using any scented soaps or washes which can interfere with sperm health.',
    checklist: [
      'Healthy, home-cooked meals',
      'Clean, comfortable bedding',
      'Peanuts or roasted Chana for snacks',
      'Positive and calm mindset',
    ],
  },
  {
    dayRange: [17, 28],
    phase: 'luteal',
    fertilityStatus: 'The Two-Week Wait (TWW)',
    pregnancyProbability: 'Low (Window Closed)',
    summary:
      'Implantation may occur soon.\nTesting too early can result in false negatives.',
    biologicalState: 'Progesterone thickens the uterine lining.',
    symptoms: {
      breasts: 'Tender',
      mood: 'Hopeful/Anxious',
      basalTemp: 'Remains high',
    },
    actionItem: 'Wait for a missed period before taking a pregnancy test.',
    careRoutine: {
      diet: 'Stable meals including Sabudana or Dalia. Fresh seasonal fruits.',
      remedy: 'Avoid heavy lifting or extreme physical strain.',
      activity: 'Gentle walking.',
    },
    hygiene:
      'Continue regular hygiene. Watch for very light spotting (implantation spotting), which is normal.',
    checklist: [
      'Pregnancy test kit (keep for later)',
      'Dalia or Poha for light meals',
      'Hobbies to keep the mind busy',
      'Comfortable cotton bras',
    ],
  },
];

export const pregnancyInsights: PregnancyInsight[] = [
  {
    dayRange: [1, 7],
    phase: 'trimester_1',
    summary:
      'Congratulations! Your HCG hormone is doubling rapidly.\nFatigue may start hitting you suddenly.',
    biologicalState:
      'The fertilized egg has implanted. The placenta is beginning to form.',
    babyDevelopment:
      'The embryo is the size of a poppy seed (Khashkhash). The neural tube is forming.',
    symptoms: {
      cramps: 'Mild twinges',
      spotting: 'Light/Pink',
      fatigue: 'Starting',
    },
    milestone:
      'Register your pregnancy at the local Anganwadi or Health Center.',
    careRoutine: {
      diet: 'Eat Folic acid rich foods (Dals, Greens). Avoid papaya and pineapple (traditional caution). Eat small, frequent meals.',
      remedy: 'Rest when you feel tired.',
      activity: 'Normal household activities, avoid lifting heavy water pots.',
    },
    hygiene:
      'Bathe daily. Use clean, loose cotton clothes to stay comfortable as body temperature rises.',
    checklist: [
      'Folic Acid tablets (from Health Center)',
      'Registration with ASHA/Anganwadi',
      'Extra water and rest',
      'Health card/file to track visits',
    ],
  },
  {
    dayRange: [8, 14],
    phase: 'trimester_1',
    summary:
      'Nausea or food aversions might begin this week.\nFrequent urination is very common right now.',
    biologicalState: 'Hormone levels are surging to support the pregnancy.',
    babyDevelopment:
      'Size of a sesame seed (Til). The tiny heart is beginning to beat.',
    symptoms: {
      nausea: 'Possible',
      breasts: 'Sore/Heavy',
      urination: 'Frequent',
    },
    milestone: 'First check-up with the doctor or ANM.',
    careRoutine: {
      diet: 'Dry biscuits or roasted Chana first thing in the morning for nausea. Coconut water (Nariyal Pani) if available.',
      remedy: 'Ginger (Adrak) tea for morning sickness.',
      activity: 'Gentle walks in the morning or evening.',
    },
    hygiene:
      'Clean the intimate area carefully as discharge increases. Frequent handwashing is essential before meals.',
    checklist: [
      'Roasted Chana or dry snacks by the bed',
      'Ginger for tea or chewing',
      'Comfortable footwear for walking',
      'Schedule for vaccinations (TT)',
    ],
  },
  {
    dayRange: [15, 21],
    phase: 'trimester_1',
    summary:
      'Your sense of smell may be overwhelmingly strong.\nBloating is very common due to slowed digestion.',
    biologicalState: 'Progesterone relaxes muscles, which slows digestion.',
    babyDevelopment:
      'Size of a lentil (Masoor Dal). Arm and leg buds are starting to form.',
    symptoms: {
      bloating: 'High',
      nausea: 'Increasing',
      mood: 'Hormonal/Weepy',
    },
    milestone: 'Ensure you are taking your Iron-Folic Acid (IFA) tablets.',
    careRoutine: {
      diet: 'Light, easily digestible foods like Dalia, Poha, or Khichdi. Use less oil and spices.',
      remedy: 'Small sips of water throughout the day.',
      activity: 'Light stretching; avoid long hours of standing.',
    },
    hygiene:
      'Maintain oral hygiene (brushing/cleaning teeth) as pregnancy hormones can affect gums.',
    checklist: [
      'Light snacks like Poha or Murmura',
      'Clean water bottle',
      'Cotton leggings or loose salwar',
      'Contact of the nearest delivery center',
    ],
  },
  {
    dayRange: [22, 28],
    phase: 'trimester_1',
    summary:
      'You are nearing the end of your second month.\nExhaustion is usually at its peak right now.',
    biologicalState:
      'The mucous plug is forming in the cervix to protect the baby.',
    babyDevelopment: 'Size of a blueberry. Brain waves are measurable.',
    symptoms: {
      fatigue: 'Peak',
      appetite: 'Fluctuating',
      dizziness: 'Occasional',
    },
    milestone: 'Complete your first trimester blood and urine tests.',
    careRoutine: {
      diet: 'Energy-giving foods like Bananas, Milk, and soaked Almonds (if available) or Peanuts.',
      remedy: 'Stand up slowly to avoid dizziness.',
      activity: 'Continue light walks; avoid crowded or smoky areas.',
    },
    hygiene:
      'Ensure the use of clean toilets and maintain hand hygiene to avoid infections like UTI.',
    checklist: [
      'Bananas and Milk',
      'Health records for the doctor visit',
      'List of emergency contact numbers',
      'ORS or salt-sugar solution for dizziness',
    ],
  },
];
