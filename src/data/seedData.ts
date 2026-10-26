import { Article, Category, Recipe, SiteSettings, User } from '../types/index.ts';

export const SEED_CATEGORIES: Category[] = [
  { id: 1, name: 'Nutrition & Diet', slug: 'nutrition', type: 'article', icon: '🥗', description: 'Evidence-based guidance on macronutrients, vitamins, and whole foods.' },
  { id: 2, name: 'Heart & Longevity', slug: 'heart-health', type: 'article', icon: '❤️', description: 'Preventive strategies for cardiovascular wellness and blood pressure.' },
  { id: 3, name: 'Fitness & Movement', slug: 'fitness', type: 'article', icon: '🏃', description: 'Practical exercise tips, mobility, and strength training for everyday life.' },
  { id: 4, name: 'Sleep & Recovery', slug: 'sleep', type: 'article', icon: '😴', description: 'Science of restorative sleep, circadian rhythm, and nighttime habits.' },
  { id: 5, name: 'Stress & Mental Health', slug: 'stress', type: 'article', icon: '🧘', description: 'Cortisol management, mindfulness, and nervous system regulation.' },
  { id: 6, name: 'Weight Management', slug: 'weight', type: 'article', icon: '⚖️', description: 'Sustainable fat loss, metabolic health, and mindful portion control.' },
  { id: 7, name: 'Healthy Breakfast', slug: 'healthy-breakfast', type: 'recipe', icon: '🌅', description: 'Energizing morning meals packed with protein and complex carbs.' },
  { id: 8, name: 'Lunch & Dinner', slug: 'lunch-dinner', type: 'recipe', icon: '🍽️', description: 'Balanced savory mains that keep you satisfied for hours.' },
  { id: 9, name: 'Healthy Snacks', slug: 'healthy-snacks', type: 'recipe', icon: '🍎', description: 'Wholesome pick-me-ups under 250 calories without refined sugars.' },
  { id: 10, name: 'Budget Meals ($3 and Under)', slug: 'budget-meals', type: 'recipe', icon: '💵', description: 'Nutritious family-friendly meals that maximize your grocery dollars.' },
  { id: 11, name: 'Quick Meals (Under 30 Min)', slug: 'quick-meals', type: 'recipe', icon: '⏱️', description: 'Fast weeknight dinners made with simple whole-food staples.' },
  { id: 12, name: 'Plant-Based & Vegan', slug: 'plant-based', type: 'recipe', icon: '🌱', description: 'Vibrant vegetarian and vegan recipes rich in fiber and micronutrients.' },
  { id: 13, name: 'High-Protein Fuel', slug: 'high-protein', type: 'recipe', icon: '🥩', description: 'Lean muscle-building dishes with 30g+ protein per serving.' }
];

export const SEED_USERS: User[] = [
  {
    id: 'user-demo-1',
    email: 'sarah.johnson@example.com',
    name: 'Sarah Johnson',
    role: 'user',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    dietaryPrefs: ['High-Protein', 'Low-Sugar'],
    measurementUnit: 'us',
    newsletterOptIn: true,
    createdAt: '2026-09-01T10:00:00Z',
    lastLoginAt: '2026-10-19T14:30:00Z'
  },
  {
    id: 'user-admin-1',
    email: 'admin@healthwiseusa.com',
    name: 'Dr. Alex Rivera, MS, RD',
    role: 'admin',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    dietaryPrefs: ['Mediterranean'],
    measurementUnit: 'us',
    newsletterOptIn: true,
    createdAt: '2026-08-15T08:00:00Z',
    lastLoginAt: '2026-10-19T20:15:00Z'
  }
];

export const SEED_SETTINGS: SiteSettings = {
  heroHeadline: 'Real Food. Real Health. Made Simple for Americans.',
  heroSubtext: 'Evidence-based health insights, budget-friendly wholesome recipes, and high-intelligence AI tools to fuel your everyday wellness.',
  heroCtaText: 'Generate 7-Day Meal Plan',
  dailyTip: 'Swapping refined carbohydrates for whole grains like oats, quinoa, or brown rice reduces post-meal glucose spikes and sustains steady afternoon energy.',
  healthyFoodOfDay: {
    name: 'Wild Alaskan Salmon',
    benefits: 'Exceptional source of EPA & DHA Omega-3 fatty acids, clinically shown to lower systemic inflammation and support cardiovascular endothelial function.',
    calorieSnippet: '206 kcal & 22g protein per 3 oz portion',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80'
  },
  featuredArticleIds: ['art-1', 'art-2', 'art-3', 'art-7'],
  featuredRecipeIds: ['rec-1', 'rec-2', 'rec-4', 'rec-7'],
  rateLimitGuest: 10,
  rateLimitUser: 50,
  highThinkingEnabled: true
};

export const SEED_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'The American Guide to Lowering Blood Pressure Naturally Through Food',
    slug: 'lowering-blood-pressure-naturally-dash-diet',
    excerpt: 'How adopting the clinically validated DASH dietary framework can drop systolic pressure by 8 to 14 points without restrictive gimmicks.',
    content: `
      <p class="lead">Hypertension affects nearly half of American adults according to the Centers for Disease Control and Prevention (CDC). While prescription medications play a critical role when necessary, comprehensive clinical trials demonstrate that targeted nutritional adjustments can yield reductions equivalent to first-line pharmacotherapy.</p>
      
      <h2>1. The Science of the Sodium-to-Potassium Ratio</h2>
      <p>Most public health guidelines focus exclusively on sodium restriction. However, landmark data from the National Health and Nutrition Examination Survey (NHANES) highlights that the <strong>sodium-to-potassium ratio</strong> is a vastly superior predictor of cardiovascular outcomes. Potassium triggers vasodilation in vascular smooth muscle and accelerates renal sodium excretion.</p>
      <p>Aim for 3,500 to 4,700 mg of dietary potassium daily through dark leafy greens, baked sweet potatoes, white beans, and avocados, while curtailing ultra-processed packaged meats and canned soups that drive sodium consumption beyond the 2,300 mg threshold.</p>

      <h2>2. The Endothelial Power of Dietary Nitrates</h2>
      <p>Inorganic nitrates abundant in beetroot, arugula, and Swiss chard undergo reduction into nitric oxide (NO) by oral microbiome bacteria and gastric acid. Nitric oxide serves as the principal signaling molecule signaling arterial walls to relax, attenuating arterial stiffness.</p>
      <p>A randomized crossover trial published in the <em>Journal of Nutrition</em> revealed that 250 mL of beetroot juice or two cups of fresh arugula daily reduced 24-hour ambulatory blood pressure within three hours of ingestion.</p>

      <h2>3. Magnesium: Nature's Calcium Channel Blocker</h2>
      <p>Magnesium competes with intracellular calcium, preventing vascular spasm. Over 50% of the US population fails to meet the Estimated Average Requirement (EAR) for magnesium. Integrating pumpkin seeds, chia seeds, black beans, and high-cacao dark chocolate (85%+) restores vascular tone.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    categoryId: 2,
    categoryName: 'Heart & Longevity',
    tags: ['Blood Pressure', 'Heart Health', 'DASH Diet', 'Potassium'],
    authorName: 'Dr. Alex Rivera, MS, RD',
    medicalReviewer: 'Dr. Michael Chen, MD, FACC',
    metaTitle: 'How to Lower Blood Pressure Naturally | HealthWise USA',
    metaDescription: 'Discover evidence-based strategies from the DASH diet, potassium-rich foods, and dietary nitrates to lower systolic blood pressure naturally.',
    readingTimeMin: 6,
    viewCount: 4210,
    status: 'published',
    publishedAt: '2026-10-12T09:00:00Z',
    lastReviewedAt: '2026-10-15T00:00:00Z',
    keyTakeaways: [
      'The sodium-to-potassium ratio is more predictive of arterial health than sodium restriction alone.',
      'Dietary nitrates from arugula and beetroot convert to nitric oxide, relaxing arterial walls within hours.',
      'Aim for 4,000 mg of potassium and 400 mg of magnesium from unrefined plant sources daily.'
    ],
    references: [
      { id: 1, title: 'CDC High Blood Pressure in the United States Facts', url: 'https://www.cdc.gov/bloodpressure/facts.htm', source: 'CDC' },
      { id: 2, title: 'DASH Dietary Pattern and Blood Pressure Meta-Analysis', url: 'https://www.nih.gov/health-information/dash-eating-plan', source: 'NIH' },
      { id: 3, title: 'Dietary Nitrate and Endothelial Function in Humans', url: 'https://pubmed.ncbi.nlm.nih.gov/23596162/', source: 'American Heart Association' }
    ]
  },
  {
    id: 'art-2',
    title: 'Protein Pacing: How Much Protein Do You Really Need as an Everyday American?',
    slug: 'protein-pacing-daily-requirements-guide',
    excerpt: 'Dismantling outdated RDA guidelines: Why 1.2 to 1.6 grams per kilogram preserves muscle mass, stabilizes glucose, and prevents sarcopenia.',
    content: `
      <p class="lead">The official Recommended Dietary Allowance (RDA) of 0.8 grams of protein per kilogram of body weight was established in 1943 simply to prevent clinical deficiency, not to optimize metabolic rate, body composition, or healthy aging.</p>

      <h2>The Concept of Muscle Protein Synthesis (MPS)</h2>
      <p>Skeletal muscle tissue functions as a metabolic sink for circulating glucose. Muscle protein synthesis (MPS) requires a critical threshold of the essential branched-chain amino acid <strong>leucine</strong>—typically 2.5 to 3 grams per meal (the "leucine trigger").</p>
      <p>Eating 10g of protein five times a day fails to trigger MPS. Instead, pacing 25 to 40g of complete protein across three to four meals maximally stimulates muscle repair and promotes satiety.</p>

      <h2>Practical US Whole Food Protein Sources</h2>
      <p>High-yield, affordable staples available in any American grocery store include:</p>
      <ul>
        <li>Plain non-fat Greek yogurt (17g protein per 3/4 cup)</li>
        <li>Liquid egg whites & whole pasture-raised eggs (6g protein per egg)</li>
        <li>Canned wild albacore tuna & wild pink salmon (28g protein per can)</li>
        <li>Organic edamame & firm tofu (18g protein per 1 cup)</li>
        <li>Cottage cheese (28g protein per 1 cup)</li>
      </ul>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80',
    categoryId: 1,
    categoryName: 'Nutrition & Diet',
    tags: ['Protein', 'Metabolism', 'Muscle', 'Healthy Aging'],
    authorName: 'Elena Rostova, CPT, CNS',
    medicalReviewer: 'Dr. Sarah Jenkins, MD',
    metaTitle: 'Protein Requirements Explained | HealthWise USA',
    metaDescription: 'Learn how much protein you need per day based on modern clinical studies, muscle protein synthesis, and everyday US grocery staples.',
    readingTimeMin: 7,
    viewCount: 3840,
    status: 'published',
    publishedAt: '2026-10-10T11:00:00Z',
    lastReviewedAt: '2026-10-14T00:00:00Z',
    keyTakeaways: [
      'The 0.8g/kg RDA is a minimum baseline against deficiency, not an optimal target for wellness.',
      'Optimal intake for active adults is 1.2 to 1.6g per kilogram (approx 0.7g/lb).',
      'Distribute protein evenly into 25–40g meals to cross the leucine trigger for muscle synthesis.'
    ],
    references: [
      { id: 4, title: 'Dietary Protein Intake and Muscle Preservation in Aging', url: 'https://pubmed.ncbi.nlm.nih.gov/28642676/', source: 'NIH' },
      { id: 5, title: 'International Society of Sports Nutrition Position Stand: Protein', url: 'https://jissn.biomedcentral.com/', source: 'ISSN' }
    ]
  },
  {
    id: 'art-3',
    title: 'The Gut-Brain Highway: How Fiber and Fermented Foods Silence Stress',
    slug: 'gut-brain-axis-microbiome-fiber-stress',
    excerpt: 'Why your microbiome manufactures 90% of your serotonin, and the specific prebiotic fibers proven to buffer anxiety and cortisol.',
    content: `
      <p class="lead">The enteric nervous system embedded throughout the gastrointestinal tract contains over 500 million neurons and maintains continuous bidirectional communication with the central nervous system via the vagus nerve.</p>

      <h2>Short-Chain Fatty Acids (SCFAs) as Neuro-Modulators</h2>
      <p>When gut bacteria ferment dietary fiber—particularly soluble viscous fibers and resistant starch—they synthesize short-chain fatty acids: acetate, propionate, and butyrate. Butyrate preserves the integrity of both the intestinal barrier and the blood-brain barrier, attenuating systemic neuro-inflammation.</p>

      <h2>The American Fiber Gap</h2>
      <p>Less than 5% of Americans consume the minimum recommended 28 to 38 grams of fiber daily. The standard American diet delivers approximately 14 grams, starving commensal beneficial taxa such as <em>Bifidobacterium</em> and <em>Akkermansia muciniphila</em>.</p>
      <p>Introducing one cup of raspberries (8g fiber), two tablespoons of ground chia seeds (8g fiber), and half a cup of black beans (7.5g fiber) closes this gap effortlessly.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    categoryId: 5,
    categoryName: 'Stress & Mental Health',
    tags: ['Gut Health', 'Microbiome', 'Fiber', 'Mental Clarity'],
    authorName: 'Dr. Alex Rivera, MS, RD',
    medicalReviewer: 'Dr. Emily Vance, MD',
    metaTitle: 'The Gut-Brain Axis & Mental Clarity | HealthWise USA',
    metaDescription: 'Explore the biological link between fiber, the microbiome, and mental resilience with actionable nutritional guidelines.',
    readingTimeMin: 5,
    viewCount: 2950,
    status: 'published',
    publishedAt: '2026-10-08T14:30:00Z',
    keyTakeaways: [
      'Microbial fermentation of prebiotic fiber yields butyrate, which crosses the blood-brain barrier to regulate mood.',
      'Only 5% of US adults meet daily fiber targets of 28–38 grams.',
      'Fermented foods like kefir, kimchi, and raw sauerkraut re-inoculate the digestive tract with live probiotic colonies.'
    ],
    references: [
      { id: 6, title: 'The Microbiome and the Gut-Brain Axis in Health and Disease', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6469458/', source: 'Nature Reviews' },
      { id: 7, title: 'USDA Dietary Guidelines for Americans: Fiber Deficit', url: 'https://www.dietaryguidelines.gov/', source: 'USDA' }
    ]
  },
  {
    id: 'art-4',
    title: 'Sleep Architecture 101: Nutritional Timing for Deep Restorative REM',
    slug: 'sleep-architecture-nutritional-timing-rem-rest',
    excerpt: 'Stop tossing and turning: How magnesium glycinate, kiwifruit, and evening meal timing enhance deep stage 3 and 4 sleep.',
    content: `
      <p class="lead">Chronic sleep deprivation elevates morning ghrelin (the hunger hormone) by 28% and suppresses leptin (the satiety hormone) by 18%, causing automatic cravings for hyper-palatable high-calorie foods throughout the subsequent day.</p>
      <h2>The Glycine and Serotonin Cascade</h2>
      <p>Consuming two green kiwifruits one hour before bedtime was shown in clinical trials at Taipei Medical University to increase sleep duration by 13.4% and sleep onset latency by 35%. Kiwifruits possess unique concentrations of natural serotonin and antioxidant carotenoids.</p>
      <h2>Avoid the Late-Night Thermal Trap</h2>
      <p>Eating heavy, high-fat dinners within two hours of sleep raises core body temperature as the liver and gut metabolize calories. Normal sleep induction requires core body temperature to drop by 1 to 2 degrees Fahrenheit.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=1200&q=80',
    categoryId: 4,
    categoryName: 'Sleep & Recovery',
    tags: ['Sleep', 'Recovery', 'Circadian Rhythm', 'Magnesium'],
    authorName: 'Marcus Cole, Sleep Science Specialist',
    readingTimeMin: 5,
    viewCount: 2180,
    status: 'published',
    publishedAt: '2026-10-05T08:00:00Z',
    keyTakeaways: [
      'Elevated core temperature from late meals impairs melatonin secretion.',
      'Magnesium glycinate activates inhibitory GABA receptors in the central nervous system.',
      'Finish your primary evening meal 3 hours prior to sleep for optimal nocturnal HRV.'
    ],
    references: [
      { id: 8, title: 'Kiwifruit Consumption and Sleep Quality in Adults', url: 'https://pubmed.ncbi.nlm.nih.gov/21669584/', source: 'Asia Pacific Journal of Clinical Nutrition' }
    ]
  },
  {
    id: 'art-5',
    title: 'The Truth About Seed Oils vs. Extra Virgin Olive Oil: A Bio-Chemical Breakdown',
    slug: 'seed-oils-vs-extra-virgin-olive-oil-breakdown',
    excerpt: 'Cut through internet hysteria with clear chemistry: Linoleic acid oxidation rates, polyphenol stability, and smoke point reality.',
    content: `
      <p class="lead">Few nutritional debates online evoke as much passion as the conflict between industrial vegetable seed oils and traditional cold-pressed fruit oils like extra virgin olive oil (EVOO).</p>
      <h2>Polyphenols Provide the Antioxidant Shield</h2>
      <p>Extra virgin olive oil contains oleocanthal, hydroxytyrosol, and oleuropein—potent biophenols that protect the monounsaturated oleic acid matrix from thermal oxidative degradation even when heated up to 410°F.</p>
      <h2>The Linoleic Acid Balance</h2>
      <p>The issue with seed oils (soybean, corn, canola) is primarily contextual: Americans consume them within ultra-processed snack foods and deep fryers that reuse oils multiple times, causing generation of lipid peroxides and acrolein.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80',
    categoryId: 1,
    categoryName: 'Nutrition & Diet',
    tags: ['Olive Oil', 'Fats', 'Inflammation', 'Cooking Oils'],
    authorName: 'Dr. Alex Rivera, MS, RD',
    readingTimeMin: 6,
    viewCount: 3120,
    status: 'published',
    publishedAt: '2026-10-02T10:15:00Z',
    keyTakeaways: [
      'High-polyphenol extra virgin olive oil resists oxidation significantly better than refined vegetable oils.',
      'Reuse of oils in commercial fryers generates toxic aldehydes; cook with fresh oils at home.',
      'Prioritize monounsaturated fats (EVOO, avocado) for optimal lipid panels.'
    ],
    references: [
      { id: 9, title: 'Evaluation of Chemical and Physical Changes in Different Commercial Oils during Heating', url: 'https://actahort.org/', source: 'Acta Scientific Nutritional Health' }
    ]
  },
  {
    id: 'art-6',
    title: 'Beating Insulin Resistance: How Muscle Acts as a Glucose Sponge',
    slug: 'beating-insulin-resistance-muscle-glucose-sponge',
    excerpt: 'Why 10-minute post-meal walks and resistance training activate non-insulin dependent GLUT4 transporters to stabilize blood sugar.',
    content: `
      <p class="lead">More than 96 million American adults—over 1 in 3—have prediabetes, and more than 80% don't know they have it. The standard dogma focuses purely on carbohydrate restriction, but skeletal muscle mechanics provide a far more empowering remedy.</p>
      <h2>GLUT4 Translocation Without Insulin</h2>
      <p>Under resting conditions, skeletal muscle cells require insulin to trigger glucose uptake. However, muscle contraction triggers AMP-activated protein kinase (AMPK), which translocates GLUT4 glucose transporters directly to cell surfaces completely independent of insulin.</p>
      <h2>The Power of the Soleus Pushup and 10-Minute Walk</h2>
      <p>A landmark University of Houston trial revealed that engaging the soleus muscle in the calves or taking a gentle 10-to-15 minute walk immediately following lunch blunts postprandial glucose spikes by up to 34%.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
    categoryId: 6,
    categoryName: 'Weight Management',
    tags: ['Insulin Resistance', 'Blood Sugar', 'Walking', 'Longevity'],
    authorName: 'Dr. Alex Rivera, MS, RD',
    medicalReviewer: 'Dr. Michael Chen, MD',
    readingTimeMin: 7,
    viewCount: 4100,
    status: 'published',
    publishedAt: '2026-09-28T09:30:00Z',
    keyTakeaways: [
      'Muscle contraction pulls glucose from the bloodstream without requiring insulin secretion.',
      'A 10-minute walk after meals reduces postprandial glycemic excursions by one-third.',
      'Resistance training builds long-term metabolic reserve against type 2 diabetes.'
    ],
    references: [
      { id: 10, title: 'CDC National Diabetes Statistics Report', url: 'https://www.cdc.gov/diabetes/data/statistics-report/index.html', source: 'CDC' },
      { id: 11, title: 'A potent physiological method to magnify and sustain soleus oxidative metabolism', url: 'https://www.sciencedirect.com/science/article/pii/S258900422201389X', source: 'iScience' }
    ]
  },
  {
    id: 'art-7',
    title: 'Eating Healthy on a Budget: How to Feed a Family for Under $3 Per Plate',
    slug: 'eating-healthy-budget-family-grocery-guide',
    excerpt: 'Proven supermarket navigation hacks, frozen produce secrets, and bulk pantry blueprints tailored for American households.',
    content: `
      <p class="lead">The persistent myth that nutritious eating is reserved for high-income households keeps millions of families from embracing whole foods. With strategic shopping, a family of four can thrive on under $100 per week.</p>
      <h2>Frozen vs. Fresh: The Nutritional Reality</h2>
      <p>Produce destined for the freezer aisle is flash-frozen at peak ripeness within hours of harvesting, locking in heat-sensitive vitamin C, beta-carotene, and folate. Studies conducted by UC Davis confirmed that frozen spinach, broccoli florets, and blueberries match or exceed the micronutrient density of fresh produce transported for weeks in transit.</p>
      <h2>The Trinity of Cheap Protein: Eggs, Lentils, and Canned Fish</h2>
      <p>Brown lentils cost roughly $0.15 per serving and deliver 18g of plant protein alongside 15g of prebiotic fiber. Combining lentils with canned tomatoes, cumin, and garlic yields hearty curries and soups at 80 cents per bowl.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    categoryId: 1,
    categoryName: 'Nutrition & Diet',
    tags: ['Budget Eating', 'Meal Prep', 'Family Health', 'US Groceries'],
    authorName: 'Sarah Johnson',
    readingTimeMin: 6,
    viewCount: 5200,
    status: 'published',
    publishedAt: '2026-09-24T12:00:00Z',
    keyTakeaways: [
      'Flash-frozen vegetables offer equal or superior nutrient density at half the retail cost.',
      'Dry legumes and canned whole tomatoes form the backbone of ultra-affordable anti-inflammatory meals.',
      'Shop perimeter staples first: eggs, oats, seasonal root crops, and bulk legumes.'
    ],
    references: [
      { id: 12, title: 'Nutritional comparison of fresh, frozen and canned fruits and vegetables', url: 'https://pubmed.ncbi.nlm.nih.gov/24499148/', source: 'Journal of Food Composition and Analysis' }
    ]
  },
  {
    id: 'art-8',
    title: 'Zone 2 Cardio Explained: The Metabolic Foundation of Cellular Longevity',
    slug: 'zone-2-cardio-metabolic-cellular-longevity',
    excerpt: 'Why low-intensity steady-state movement supercharges mitochondrial density, fat oxidation, and cardiovascular stamina.',
    content: `
      <p class="lead">Modern fitness culture often glorifies exhaustion: high-intensity interval training (HIIT), boot camps, and heart-rate spikes. Yet world-class endurance athletes spend 80% of their training volume in Zone 2.</p>
      <h2>Mitochondrial Clearance and Fat Oxidation</h2>
      <p>Zone 2 training represents the highest workload at which blood lactate remains near baseline (below 2 mmol/L). At this physiological juncture, type 1 slow-twitch muscle fibers utilize beta-oxidation to combust fatty acids inside the mitochondria, spurring mitochondrial biogenesis.</p>
      <h2>The Conversational Test</h2>
      <p>You do not need an expensive metabolic cart: Zone 2 is achieved when you can comfortably speak in full sentences without gasping, but cannot comfortably sing. Walking uphill at 3.5 mph with a slight incline frequently hits this target for most adults.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
    categoryId: 3,
    categoryName: 'Fitness & Movement',
    tags: ['Zone 2', 'Cardio', 'Longevity', 'Mitochondria'],
    authorName: 'Elena Rostova, CPT, CNS',
    readingTimeMin: 5,
    viewCount: 3100,
    status: 'published',
    publishedAt: '2026-09-20T15:00:00Z',
    keyTakeaways: [
      'Zone 2 trains the body to clear lactate and maximize cellular fat oxidation.',
      'Target 150 to 180 minutes per week broken into 30 to 45 minute conversational sessions.',
      'Low impact: brisk incline walking, cycling, or swimming protects joint cartilage.'
    ],
    references: [
      { id: 13, title: 'Mitochondrial function and lactate metabolism in endurance exercise', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6486214/', source: 'Sports Medicine' }
    ]
  },
  {
    id: 'art-9',
    title: 'Hydration Beyond Plain Water: Electrolytes, Sodium Balance, and Mental Sharpness',
    slug: 'hydration-electrolytes-sodium-balance-sharpness',
    excerpt: 'Drinking gallons of tap water can ironically deplete your cellular sodium. Here is how sodium, potassium, and magnesium fuel brain conductivity.',
    content: `
      <p class="lead">Every thought you have, nerve impulse you transmit, and heartbeat you sustain relies on an electrical gradient generated by sodium-potassium ATPase cellular pumps.</p>
      <h2>The Hyponatremia Risk of Overhydration</h2>
      <p>Drinking gallons of plain purified water without minerals dilutes extracellular sodium, triggering brain fog, headaches, and afternoon lethargy. If you eat whole foods without processed items, you actually need conscious salt intake.</p>
      <h2>Natural Electrolyte Formulation at Home</h2>
      <p>Instead of neon sugary commercial drinks, mix 16 oz water with 1/4 tsp of non-refined salt (Celtic or Redmond Real Salt), 2 tbsp fresh lemon juice, and a pinch of potassium chloride or coconut water.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80',
    categoryId: 1,
    categoryName: 'Nutrition & Diet',
    tags: ['Hydration', 'Electrolytes', 'Brain Health', 'Sodium'],
    authorName: 'Dr. Alex Rivera, MS, RD',
    readingTimeMin: 4,
    viewCount: 2780,
    status: 'published',
    publishedAt: '2026-09-15T09:00:00Z',
    keyTakeaways: [
      'Hydration is about cellular mineral saturation, not purely liquid volume.',
      'Active people eating clean whole foods need adequate dietary sodium to prevent fatigue.',
      'Natural citrus + mineral salt beats neon sports beverages packed with dyes and high-fructose syrup.'
    ],
    references: [
      { id: 14, title: 'ACSM Position Stand: Exercise and Fluid Replacement', url: 'https://pubmed.ncbi.nlm.nih.gov/17277604/', source: 'Medicine & Science in Sports & Exercise' }
    ]
  },
  {
    id: 'art-10',
    title: 'Managing Cortisol Naturally: 5 Daily Science-Backed Stress Shields',
    slug: 'managing-cortisol-naturally-stress-shields',
    excerpt: 'Lower chronic sympathetic tone with non-sleep deep rest (NSDR), morning sunlight, and targeted adaptogens.',
    content: `
      <p class="lead">Cortisol is essential for morning wakefulness and acute survival. However, sustained nocturnal hypercortisolemia breaks down lean tissue, promotes visceral abdominal adiposity, and suppresses immune surveillance.</p>
      <h2>1. The Morning Photonic Anchor</h2>
      <p>Viewing 10,000 lux natural outdoor sunlight within 45 minutes of waking triggers a sharp, healthy morning cortisol spike while anchoring the suprachiasmatic nucleus circadian clock, ensuring cortisol drops on schedule 14 hours later.</p>
      <h2>2. Physiological Sigh</h2>
      <p>Two inhales through the nose followed by an extended sigh through the mouth instantly reinflates collapsed lung alveoli and stimulates parasympathetic vagal decelerators, dropping resting heart rate within 30 seconds.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    categoryId: 5,
    categoryName: 'Stress & Mental Health',
    tags: ['Cortisol', 'Stress', 'Vagus Nerve', 'Breathwork'],
    authorName: 'Dr. Emily Vance, MD',
    readingTimeMin: 5,
    viewCount: 3600,
    status: 'published',
    publishedAt: '2026-09-10T11:30:00Z',
    keyTakeaways: [
      'Morning sunlight exposure sets a reliable circadian timer for nighttime melatonin secretion.',
      'The physiological sigh is the fastest verified biological brake on acute nervous system arousal.',
      'Chronically elevated cortisol directs fat storage preferentially to deep visceral visceral depots.'
    ],
    references: [
      { id: 15, title: 'Brief structured respiration practices enhance mood and reduce physiological arousal', url: 'https://www.cell.com/cell-reports-medicine/fulltext/S2666-3791(22)00474-8', source: 'Cell Reports Medicine' }
    ]
  },
  {
    id: 'art-11',
    title: 'Understanding Inflammation: The Acute Defender vs. The Chronic Smolder',
    slug: 'understanding-inflammation-acute-vs-chronic',
    excerpt: 'How systemic low-grade inflammation drives modern metabolic disorders, and the anti-inflammatory foods that quench it.',
    content: `
      <p class="lead">Acute inflammation saves your life when you cut your finger or contract an infection. Chronic systemic inflammation, however, silently damages endothelial linings, nerve sheaths, and joint capsules over decades.</p>
      <h2>Key Biomarkers: hs-CRP and Homocysteine</h2>
      <p>High-sensitivity C-reactive protein (hs-CRP) under 1.0 mg/L indicates low cardiovascular risk. Elevated levels above 3.0 mg/L frequently correlate with insulin resistance, non-alcoholic fatty liver disease (NAFLD), and metabolic syndrome.</p>
      <h2>Nutritional Quenchers: Turmeric, Ginger, and Anthocyanins</h2>
      <p>Curcumin from turmeric root, gingerols from ginger, and dark purple anthocyanins from wild blueberries inhibit the NF-kB inflammatory cascade as effectively as mild over-the-counter NSAIDs without gastric mucosal irritation.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
    categoryId: 2,
    categoryName: 'Heart & Longevity',
    tags: ['Inflammation', 'hs-CRP', 'Turmeric', 'Antioxidants'],
    authorName: 'Dr. Alex Rivera, MS, RD',
    readingTimeMin: 6,
    viewCount: 2900,
    status: 'published',
    publishedAt: '2026-09-05T14:00:00Z',
    keyTakeaways: [
      'hs-CRP measures systemic inflammatory burden and arterial wellness.',
      'Black pepper piperine boosts curcumin absorption by up to 2,000%.',
      'Replace refined seed-oil snack foods with raw walnuts, green tea, and wild oily fish.'
    ],
    references: [
      { id: 16, title: 'Influence of piperine on the pharmacokinetics of curcumin', url: 'https://pubmed.ncbi.nlm.nih.gov/9619120/', source: 'Planta Medica' }
    ]
  },
  {
    id: 'art-12',
    title: 'The Simple Science of Meal Prep: Save 10 Hours and $150 Every Week',
    slug: 'simple-science-meal-prep-save-time-money',
    excerpt: 'Batch-cooking formulas, food safety storage limits, and modular building blocks for busy parents and professionals.',
    content: `
      <p class="lead">Willpower is a finite cognitive resource. When you arrive home exhausted at 6:30 PM, decision fatigue will almost always route you toward delivery apps or frozen convenience foods unless a nutritious meal is already prepped.</p>
      <h2>The Component Method Over Identical Tupperware</h2>
      <p>Do not cook five identical containers of chicken, rice, and broccoli—taste fatigue sets in by Wednesday. Instead, cook modular components:</p>
      <ul>
        <li><strong>Two proteins:</strong> e.g., sheet-pan lemon herb chicken thighs & spiced black beans.</li>
        <li><strong>Two complex carbs:</strong> roasted sweet potato wedges & fluffy quinoa.</li>
        <li><strong>Two sheet pans of veggies:</strong> broccoli, bell peppers, zucchini, red onions.</li>
        <li><strong>Two homemade dressings:</strong> tahini lemon garlic & chimichurri.</li>
      </ul>
      <p>This delivers 8 distinct flavorful variations across the workweek.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    categoryId: 1,
    categoryName: 'Nutrition & Diet',
    tags: ['Meal Prep', 'Time Saving', 'Budget', 'Kitchen Habits'],
    authorName: 'Sarah Johnson',
    readingTimeMin: 5,
    viewCount: 4600,
    status: 'published',
    publishedAt: '2026-09-01T10:00:00Z',
    keyTakeaways: [
      'Prep modular components rather than identical daily meals to defeat palate boredom.',
      'Cooked poultry and fish stay fresh for 3 to 4 days refrigerated in airtight glass containers.',
      'Invest in high-quality freezer storage for emergency homemade soups and stews.'
    ],
    references: [
      { id: 17, title: 'USDA Food Safety and Inspection Service: Leftovers and Food Safety', url: 'https://www.fsis.usda.gov/', source: 'USDA' }
    ]
  },
  {
    id: 'art-13',
    title: 'Strength Training for Adults Over 40: The Antidote to Sarcopenia',
    slug: 'strength-training-over-40-antidote-sarcopenia',
    excerpt: 'After age 30, adults lose 3–8% of muscle mass per decade without progressive overload. Here is how to train joints safely for vitality.',
    content: `
      <p class="lead">Muscle is our primary organ of longevity. Beyond aesthetic form, your skeletal muscle mass dictates bone mineral density, fall prevention, insulin disposal, and basal metabolic rate throughout retirement.</p>
      <h2>Focus on Multi-Joint Compound Movements</h2>
      <p>Rather than isolated bicep curls, prioritize the five fundamental human movement patterns: squat, hinge, push, pull, and carry. Two to three 30-minute sessions per week provide the necessary stimulus for osteoblast activity and bone remodeling.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    categoryId: 3,
    categoryName: 'Fitness & Movement',
    tags: ['Strength Training', 'Aging', 'Bone Density', 'Joint Health'],
    authorName: 'Elena Rostova, CPT, CNS',
    readingTimeMin: 6,
    viewCount: 3400,
    status: 'published',
    publishedAt: '2026-08-28T16:00:00Z',
    keyTakeaways: [
      'Resistance training directly stimulates bone mineral density via the piezoelectric effect.',
      'Train movements (squat, hinge, press, row, carry) rather than isolated machines.',
      'Consistency at moderate intensity outperforms sporadic bouts of joint-straining maximums.'
    ],
    references: [
      { id: 18, title: 'Resistance Training for Health and Disease Prevention', url: 'https://pubmed.ncbi.nlm.nih.gov/31343717/', source: 'Mayo Clinic Proceedings' }
    ]
  },
  {
    id: 'art-14',
    title: 'The Mediterranean Lifestyle: Why It Is More Than Just Olive Oil and Tomatoes',
    slug: 'mediterranean-lifestyle-beyond-olive-oil',
    excerpt: 'Communal dining, daily walking, seasonal foods, and purposeful pacing: The full blueprint of the worlds most studied dietary pattern.',
    content: `
      <p class="lead">Decade after decade, epidemiological cohorts like the PREDIMED study position the traditional Mediterranean pattern as the gold standard for reducing cardiovascular events by up to 30%.</p>
      <h2>The Social Parasympathetic Component</h2>
      <p>In Mediterranean cultures, meals are rarely eaten rushed behind computer monitors or in driving traffic. Dining in community engages the social vagal system, optimizing cephalic phase digestive enzyme release and nutrient absorption.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    categoryId: 2,
    categoryName: 'Heart & Longevity',
    tags: ['Mediterranean Diet', 'Longevity', 'Community', 'Heart Health'],
    authorName: 'Dr. Alex Rivera, MS, RD',
    readingTimeMin: 5,
    viewCount: 2890,
    status: 'published',
    publishedAt: '2026-08-25T11:00:00Z',
    keyTakeaways: [
      'PREDIMED demonstrated a 30% reduction in major cardiovascular events with EVOO and nuts.',
      'Eating in relaxed social settings activates parasympathetic digestion.',
      'Prioritize seasonal leafy greens, pulses, seafood, and herbs like oregano and rosemary.'
    ],
    references: [
      { id: 19, title: 'Primary Prevention of Cardiovascular Disease with a Mediterranean Diet', url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1800389', source: 'NEJM' }
    ]
  },
  {
    id: 'art-15',
    title: 'Intermittent Fasting: Clinical Benefits vs. Overhyped Gimmicks',
    slug: 'intermittent-fasting-benefits-vs-myths',
    excerpt: 'Autophagy, metabolic flexibility, and circadian meal timing examined through randomized controlled trials.',
    content: `
      <p class="lead">Time-restricted feeding (e.g., 16:8) has exploded in popularity. While advocates claim miraculous fat burning, what does modern metabolic research really show?</p>
      <h2>Caloric Equality vs. Circadian Alignment</h2>
      <p>Head-to-head trials by Johns Hopkins University show that when calories and protein are matched, intermittent fasting achieves equivalent fat loss to continuous caloric restriction. However, early time-restricted feeding (eating between 8 AM and 4 PM) yields substantial improvements in insulin sensitivity due to circadian clock gene expression.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    categoryId: 6,
    categoryName: 'Weight Management',
    tags: ['Intermittent Fasting', 'Autophagy', 'Circadian Biology', 'Fat Loss'],
    authorName: 'Dr. Alex Rivera, MS, RD',
    readingTimeMin: 6,
    viewCount: 3950,
    status: 'published',
    publishedAt: '2026-08-20T13:00:00Z',
    keyTakeaways: [
      'Fasting is primarily a convenient tool for caloric balance and insulin resting.',
      'Eating earlier in the day aligns better with pancreatic circadian insulin output.',
      'Adequate protein intake during feeding windows is critical to prevent lean muscle catabolism.'
    ],
    references: [
      { id: 20, title: 'Early Time-Restricted Feeding Improves Insulin Sensitivity in Men with Prediabetes', url: 'https://pubmed.ncbi.nlm.nih.gov/29752076/', source: 'Cell Metabolism' }
    ]
  },
  {
    id: 'art-16',
    title: 'Decoding Nutrition Labels: 5 Clever Marketing Traps on American Supermarket Shelves',
    slug: 'decoding-nutrition-labels-supermarket-traps',
    excerpt: 'From "All Natural" and "Multi-Grain" to hidden sugar aliases, learn how food manufacturers disguise empty calories.',
    content: `
      <p class="lead">The front of a food box is marketing; the back is law. Food scientists and marketers engineer packaging to convey a "health halo" even on items packed with refined starches and high-fructose corn syrup.</p>
      <h2>1. The "Made with Whole Grains" Mirage</h2>
      <p>A package can boast "Made with Whole Grains" if it contains as little as a single gram of whole wheat, while the primary ingredient remains enriched bleached flour. Always look for <strong>100% Whole Wheat</strong> or the official Whole Grains Council stamp.</p>
      <h2>2. Sugar Under 60 Pseudonyms</h2>
      <p>Ingredients are listed by weight. Manufacturers frequently split sugar into 3 or 4 different types—dextrose, evaporated cane juice, barley malt, and agave nectar—so that none appear as the number one ingredient.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?auto=format&fit=crop&w=1200&q=80',
    categoryId: 1,
    categoryName: 'Nutrition & Diet',
    tags: ['Food Labels', 'Sugar', 'Consumer Defense', 'Smart Shopping'],
    authorName: 'Sarah Johnson',
    readingTimeMin: 5,
    viewCount: 3150,
    status: 'published',
    publishedAt: '2026-08-15T09:00:00Z',
    keyTakeaways: [
      'Always inspect the ingredient list first; ingredients are ordered by weight descending.',
      'Check "Added Sugars"—aim for less than 25g daily as recommended by the American Heart Association.',
      'Do not be misled by front-of-box claims like "Natural" or "Gluten-Free" on junk food.'
    ],
    references: [
      { id: 21, title: 'FDA How to Understand and Use the Nutrition Facts Label', url: 'https://www.fda.gov/food/nutrition-facts-label', source: 'FDA' }
    ]
  },
  {
    id: 'art-17',
    title: 'The Longevity Kitchen: Foods Consumed by Blue Zone Centenarians',
    slug: 'longevity-kitchen-blue-zones-centenarians',
    excerpt: 'What Ikaria, Okinawa, and Loma Linda elders eat daily to live vibrant, disease-free lives past 100.',
    content: `
      <p class="lead">In Blue Zone regions where people reach 100 at tenfold rates compared to the general US population, chronic degenerative illnesses like Alzheimer's, heart disease, and diabetes are remarkably scarce.</p>
      <h2>The Cornerstone: One Cup of Beans a Day</h2>
      <p>Across all five Blue Zones, legumes—black beans in Costa Rica, fava beans in Sardinia, soybeans in Okinawa—form the daily cornerstone. Dan Buettner's demographic data indicates that eating one cup of beans daily correlates with an extra 4 years of life expectancy.</p>
      <h2>Herbal Infusions Over Sugary Sodas</h2>
      <p>Centenarians regularly sip wild mountain teas rich in polyphenols like sage, rosemary, dandelion, and green tea, sipping fluids that continuously deliver mild anti-inflammatory flavonoids.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80',
    categoryId: 2,
    categoryName: 'Heart & Longevity',
    tags: ['Blue Zones', 'Longevity', 'Legumes', 'Herbs'],
    authorName: 'Dr. Alex Rivera, MS, RD',
    readingTimeMin: 5,
    viewCount: 4400,
    status: 'published',
    publishedAt: '2026-08-10T14:30:00Z',
    keyTakeaways: [
      'Beans and legumes are the single most consistent dietary predictor of longevity globally.',
      'Eat until you are 80% full (the Okinawan rule of Hara Hachi Bu).',
      'Move naturally throughout the day rather than sitting for 10 hours followed by one intense gym session.'
    ],
    references: [
      { id: 22, title: 'The Blue Zones: Lessons for Living Longer From the People Who Have Lived the Longest', url: 'https://www.bluezones.com/', source: 'National Geographic' }
    ]
  },
  {
    id: 'art-18',
    title: 'Plant-Based on a Budget: How to Get Complete Amino Acids Without Expensive Meat Substitutes',
    slug: 'plant-based-budget-complete-proteins-guide',
    excerpt: 'Say goodbye to $9 engineered patties: Build complete, delicious protein profiles with rice & beans, tofu, and nutritional yeast.',
    content: `
      <p class="lead">Transitioning toward more plant-centered eating does not require high-cost ultra-processed imitation meats. Traditional culinary traditions have solved protein complementarity for millennia.</p>
      <h2>Complementary Protein Combinations</h2>
      <p>While soy (edamame, tofu, tempeh) is already a complete protein containing all 9 essential amino acids in optimal ratios, pairing legumes (high in lysine, low in methionine) with grains (high in methionine, low in lysine) provides complete protein profiles across any 24-hour window.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    categoryId: 1,
    categoryName: 'Nutrition & Diet',
    tags: ['Plant-Based', 'Vegan', 'Amino Acids', 'Budget'],
    authorName: 'Elena Rostova, CPT, CNS',
    readingTimeMin: 5,
    viewCount: 2600,
    status: 'published',
    publishedAt: '2026-08-05T10:00:00Z',
    keyTakeaways: [
      'You do not need to combine proteins in the exact same forkful; cellular pools balance across the day.',
      'Tofu, tempeh, and edamame are complete, nutrient-dense proteins under $3 per pound.',
      'Fortify with Vitamin B12 and algae-derived EPA/DHA when eating 100% plant-based.'
    ],
    references: [
      { id: 23, title: 'Academy of Nutrition and Dietetics: Vegetarian Diets Position', url: 'https://pubmed.ncbi.nlm.nih.gov/27886704/', source: 'Journal of the Academy of Nutrition and Dietetics' }
    ]
  },
  {
    id: 'art-19',
    title: 'The Walking Revolution: How 7,500 Steps Lowers All-Cause Mortality by 50%',
    slug: 'walking-revolution-7500-steps-mortality',
    excerpt: 'Harvard and NIH cohort data confirms: You do not need extreme cardio to dramatically prolong life and protect cognitive function.',
    content: `
      <p class="lead">The widely cited "10,000 steps" benchmark was originally a 1965 Japanese pedometer marketing campaign (Manpo-kei). However, extensive modern epidemiological studies clarify the real biological dose-response curve.</p>
      <h2>The Inflection Point at 7,500 Steps</h2>
      <p>A landmark JAMA study led by Harvard medical researchers tracking over 16,000 older adults revealed that mortality rates dropped sharply as steps increased from 2,700 to 7,500 steps per day, leveling off thereafter. Achieving 7,500 steps reduced premature death risk by roughly 50% compared to sedentary baselines.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80',
    categoryId: 3,
    categoryName: 'Fitness & Movement',
    tags: ['Walking', 'NEAT', 'Longevity', 'Steps'],
    authorName: 'Dr. Michael Chen, MD',
    readingTimeMin: 4,
    viewCount: 3780,
    status: 'published',
    publishedAt: '2026-08-01T08:00:00Z',
    keyTakeaways: [
      'Mortality risk decreases by ~50% when progressing from 3,000 to 7,500 daily steps.',
      'Break steps into three 15-minute walks during workday calls or post-meal strolls.',
      'Walking in natural green spaces enhances parasympathetic tone and cognitive restoration.'
    ],
    references: [
      { id: 24, title: 'Association of Step Volume and Intensity With All-Cause Mortality in Older Women', url: 'https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2734709', source: 'JAMA Internal Medicine' }
    ]
  },
  {
    id: 'art-20',
    title: 'The Essential Vitamin D3 & K2 Synergy for Strong Bones and Clear Arteries',
    slug: 'vitamin-d3-k2-synergy-bones-arteries',
    excerpt: 'Why taking Vitamin D3 without K2 can misdirect calcium into soft tissues and coronary arteries instead of your skeleton.',
    content: `
      <p class="lead">Over 40% of American adults are clinically deficient in Vitamin D (serum 25(OH)D below 20 ng/mL). But megadosing Vitamin D alone without its physiological cofactors introduces a neglected biological dilemma.</p>
      <h2>The Traffic Cop of Calcium: Osteocalcin and MGP</h2>
      <p>Vitamin D3 enhances intestinal calcium absorption into circulating plasma. However, <strong>Vitamin K2 (menaquinone-7)</strong> acts as the biological traffic director: it activates osteocalcin to bind calcium into bones and teeth, and carboxylates Matrix Gla Protein (MGP) to prevent calcium from precipitating onto arterial walls.</p>
    `,
    coverImageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    categoryId: 2,
    categoryName: 'Heart & Longevity',
    tags: ['Vitamin D', 'Vitamin K2', 'Arterial Health', 'Calcium'],
    authorName: 'Dr. Alex Rivera, MS, RD',
    readingTimeMin: 5,
    viewCount: 3300,
    status: 'published',
    publishedAt: '2026-07-28T12:00:00Z',
    keyTakeaways: [
      'Vitamin D3 absorbs calcium; Vitamin K2 ensures that calcium enters bone tissue rather than blood vessel walls.',
      'Check your serum 25-hydroxyvitamin D level annually; 40–60 ng/mL is optimal for immune and metabolic health.',
      'Natural food sources of K2 include aged cheeses (Gouda, Edam), pasture-raised egg yolks, and natto.'
    ],
    references: [
      { id: 25, title: 'The Synergistic Interplay between Vitamins D and K for Bone and Cardiovascular Health', url: 'https://pubmed.ncbi.nlm.nih.gov/29138634/', source: 'International Journal of Endocrinology' }
    ]
  }
];

export const SEED_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Antioxidant Berry Overnight Oats with Chia & Greek Yogurt',
    slug: 'antioxidant-berry-overnight-oats',
    description: 'Creamy high-protein overnight oats infused with chia seeds, pure vanilla, and a cascade of antioxidant wild blueberries.',
    coverImageUrl: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=800&q=80',
    categoryId: 7,
    categoryName: 'Healthy Breakfast',
    dietaryTags: ['Vegetarian', 'High-Protein', 'High-Fiber', 'Budget'],
    allergens: ['dairy'],
    difficulty: 'easy',
    prepTimeMin: 10,
    cookTimeMin: 0,
    totalTimeMin: 10,
    baseServings: 2,
    costPerServing: 1.75,
    calories: 360,
    proteinG: 22,
    carbsG: 48,
    fatG: 8,
    fiberG: 9,
    sodiumMg: 95,
    ingredients: [
      { id: 1, amountUs: '1 cup', amountMetric: '90g', ingredient: 'Old-fashioned rolled oats', sortOrder: 1 },
      { id: 2, amountUs: '1 cup', amountMetric: '240ml', ingredient: 'Unsweetened almond milk or skim milk', sortOrder: 2 },
      { id: 3, amountUs: '3/4 cup', amountMetric: '170g', ingredient: 'Plain non-fat Greek yogurt', sortOrder: 3 },
      { id: 4, amountUs: '1 tbsp', amountMetric: '12g', ingredient: 'Chia seeds', sortOrder: 4 },
      { id: 5, amountUs: '1 tbsp', amountMetric: '15ml', ingredient: 'Pure maple syrup or raw honey', sortOrder: 5 },
      { id: 6, amountUs: '1/2 tsp', amountMetric: '2.5ml', ingredient: 'Pure vanilla extract', sortOrder: 6 },
      { id: 7, amountUs: '1 cup', amountMetric: '150g', ingredient: 'Fresh or frozen wild blueberries', groupName: 'Topping', sortOrder: 7 },
      { id: 8, amountUs: '1 tbsp', amountMetric: '10g', ingredient: 'Sliced raw almonds', groupName: 'Topping', sortOrder: 8 }
    ],
    instructions: [
      { id: 1, stepNumber: 1, instruction: 'In a mason jar or glass container, combine oats, milk, Greek yogurt, chia seeds, maple syrup, and vanilla extract.', tip: 'Stir vigorously to ensure chia seeds are evenly distributed and do not clump at the bottom.' },
      { id: 2, stepNumber: 2, instruction: 'Cover tightly with lid and refrigerate overnight (or at least 4 hours) to allow the oats and chia seeds to soften and absorb liquid.' },
      { id: 3, stepNumber: 3, instruction: 'In the morning, stir the oats. Top generously with wild blueberries and sliced almonds before serving cold.' }
    ],
    status: 'published',
    publishedAt: '2026-10-15T08:00:00Z',
    viewCount: 3120,
    saveCount: 420
  },
  {
    id: 'rec-2',
    title: 'Sheet-Pan Lemon Herb Wild Salmon & Roasted Asparagus',
    slug: 'sheet-pan-lemon-herb-salmon-asparagus',
    description: 'Crisp and tender wild salmon fillets roasted with fresh garlic, lemon slices, and crisp asparagus for an omega-3 packed 20-minute dinner.',
    coverImageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    categoryId: 8,
    categoryName: 'Lunch & Dinner',
    dietaryTags: ['High-Protein', 'Gluten-Free', 'Quick <30 Min'],
    allergens: ['fish'],
    difficulty: 'easy',
    prepTimeMin: 10,
    cookTimeMin: 15,
    totalTimeMin: 25,
    baseServings: 4,
    costPerServing: 4.85,
    calories: 420,
    proteinG: 38,
    carbsG: 8,
    fatG: 26,
    fiberG: 4,
    sodiumMg: 280,
    ingredients: [
      { id: 9, amountUs: '4 fillets (6 oz each)', amountMetric: '680g', ingredient: 'Wild Alaskan salmon fillets, skin on', sortOrder: 1 },
      { id: 10, amountUs: '1 lb', amountMetric: '450g', ingredient: 'Fresh asparagus spears, woody ends trimmed', sortOrder: 2 },
      { id: 11, amountUs: '2 tbsp', amountMetric: '30ml', ingredient: 'Extra virgin olive oil', sortOrder: 3 },
      { id: 12, amountUs: '3 cloves', amountMetric: '3 cloves', ingredient: 'Fresh garlic, minced', sortOrder: 4 },
      { id: 13, amountUs: '1 large', amountMetric: '1 large', ingredient: 'Lemon, halved (1 juiced, 1 sliced into rounds)', sortOrder: 5 },
      { id: 14, amountUs: '1 tbsp', amountMetric: '4g', ingredient: 'Fresh dill, chopped', sortOrder: 6 },
      { id: 15, amountUs: '1/2 tsp', amountMetric: '3g', ingredient: 'Sea salt and cracked black pepper', sortOrder: 7 }
    ],
    instructions: [
      { id: 4, stepNumber: 1, instruction: 'Preheat your oven to 400°F (200°C) and line a large baking sheet with parchment paper.' },
      { id: 5, stepNumber: 2, instruction: 'Arrange salmon fillets skin-side down in the center of the pan. Spread trimmed asparagus around the fish.' },
      { id: 6, stepNumber: 3, instruction: 'Drizzle olive oil over both salmon and asparagus. Rub minced garlic, salt, pepper, fresh dill, and fresh lemon juice over the fish. Lay lemon slices across salmon fillets.' },
      { id: 7, stepNumber: 4, instruction: 'Roast for 12 to 15 minutes until salmon flakes gently with a fork and internal temperature reaches 135°F to 140°F.', tip: 'Wild salmon cooks faster than farmed Atlantic salmon—do not overbake to keep it succulent.' }
    ],
    status: 'published',
    publishedAt: '2026-10-14T10:00:00Z',
    viewCount: 4890,
    saveCount: 650
  },
  {
    id: 'rec-3',
    title: 'Hearty Mediterranean Lentil & Spinach Soup',
    slug: 'mediterranean-lentil-spinach-soup',
    description: 'An aromatic, deeply satisfying soup loaded with brown lentils, baby spinach, crushed tomatoes, and warm cumin.',
    coverImageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    categoryId: 10,
    categoryName: 'Budget Meals ($3 and Under)',
    dietaryTags: ['Vegan', 'Vegetarian', 'Budget', 'High-Fiber', 'Gluten-Free'],
    allergens: [],
    difficulty: 'easy',
    prepTimeMin: 15,
    cookTimeMin: 30,
    totalTimeMin: 45,
    baseServings: 6,
    costPerServing: 1.25,
    calories: 280,
    proteinG: 16,
    carbsG: 46,
    fatG: 4,
    fiberG: 14,
    sodiumMg: 420,
    ingredients: [
      { id: 16, amountUs: '1.5 cups', amountMetric: '300g', ingredient: 'Dry brown or French green lentils, rinsed', sortOrder: 1 },
      { id: 17, amountUs: '1 medium', amountMetric: '1 medium', ingredient: 'Yellow onion, diced', sortOrder: 2 },
      { id: 18, amountUs: '2 stalks', amountMetric: '2 stalks', ingredient: 'Celery, diced', sortOrder: 3 },
      { id: 19, amountUs: '2 medium', amountMetric: '2 medium', ingredient: 'Carrots, diced', sortOrder: 4 },
      { id: 20, amountUs: '4 cloves', amountMetric: '4 cloves', ingredient: 'Garlic, minced', sortOrder: 5 },
      { id: 21, amountUs: '1 can (15 oz)', amountMetric: '400g', ingredient: 'Diced fire-roasted tomatoes', sortOrder: 6 },
      { id: 22, amountUs: '6 cups', amountMetric: '1.4L', ingredient: 'Low-sodium vegetable broth', sortOrder: 7 },
      { id: 23, amountUs: '1 tsp', amountMetric: '3g', ingredient: 'Ground cumin & smoked paprika', sortOrder: 8 },
      { id: 24, amountUs: '4 cups', amountMetric: '120g', ingredient: 'Fresh baby spinach leaves', sortOrder: 9 },
      { id: 25, amountUs: '2 tbsp', amountMetric: '30ml', ingredient: 'Extra virgin olive oil', sortOrder: 10 },
      { id: 26, amountUs: '1 tbsp', amountMetric: '15ml', ingredient: 'Fresh lemon juice', sortOrder: 11 }
    ],
    instructions: [
      { id: 8, stepNumber: 1, instruction: 'Heat olive oil in a large Dutch oven over medium heat. Sauté onion, celery, and carrots for 5 to 7 minutes until softened.' },
      { id: 9, stepNumber: 2, instruction: 'Add minced garlic, cumin, smoked paprika, salt, and black pepper. Stir for 1 minute until fragrant.' },
      { id: 10, stepNumber: 3, instruction: 'Pour in rinsed lentils, canned tomatoes with juices, and vegetable broth. Bring to a rolling boil, then lower heat, cover, and simmer for 25–30 minutes until lentils are tender.' },
      { id: 11, stepNumber: 4, instruction: 'Stir in fresh baby spinach and lemon juice. The residual heat will wilt the spinach in 2 minutes. Taste and adjust seasoning before serving.' }
    ],
    status: 'published',
    publishedAt: '2026-10-12T12:00:00Z',
    viewCount: 3950,
    saveCount: 510
  },
  {
    id: 'rec-4',
    title: 'Grilled Chicken & Quinoa Power Bowl with Green Goddess Tahini',
    slug: 'grilled-chicken-quinoa-power-bowl',
    description: 'Herb-marinated grilled chicken breast over fluffy quinoa, crisp cucumbers, cherry tomatoes, and a creamy herbaceous tahini dressing.',
    coverImageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    categoryId: 13,
    categoryName: 'High-Protein Fuel',
    dietaryTags: ['High-Protein', 'Gluten-Free', 'Meal Prep'],
    allergens: ['sesame'],
    difficulty: 'medium',
    prepTimeMin: 15,
    cookTimeMin: 20,
    totalTimeMin: 35,
    baseServings: 4,
    costPerServing: 3.40,
    calories: 490,
    proteinG: 44,
    carbsG: 42,
    fatG: 16,
    fiberG: 7,
    sodiumMg: 360,
    ingredients: [
      { id: 27, amountUs: '1.5 lbs', amountMetric: '680g', ingredient: 'Boneless skinless chicken breasts, sliced into cutlets', sortOrder: 1 },
      { id: 28, amountUs: '1 cup', amountMetric: '170g', ingredient: 'Dry white or tri-color quinoa, rinsed', sortOrder: 2 },
      { id: 29, amountUs: '2 cups', amountMetric: '480ml', ingredient: 'Water or chicken broth', sortOrder: 3 },
      { id: 30, amountUs: '1 pint', amountMetric: '300g', ingredient: 'Cherry tomatoes, halved', sortOrder: 4 },
      { id: 31, amountUs: '1 large', amountMetric: '1 large', ingredient: 'English cucumber, diced', sortOrder: 5 },
      { id: 32, amountUs: '1/3 cup', amountMetric: '80g', ingredient: 'Pure sesame tahini paste', groupName: 'Green Goddess Tahini Dressing', sortOrder: 6 },
      { id: 33, amountUs: '1/4 cup', amountMetric: '60ml', ingredient: 'Warm water (to thin)', groupName: 'Green Goddess Tahini Dressing', sortOrder: 7 },
      { id: 34, amountUs: '2 tbsp', amountMetric: '30ml', ingredient: 'Fresh lemon juice', groupName: 'Green Goddess Tahini Dressing', sortOrder: 8 },
      { id: 35, amountUs: '1/4 cup', amountMetric: '15g', ingredient: 'Fresh parsley & cilantro, minced', groupName: 'Green Goddess Tahini Dressing', sortOrder: 9 }
    ],
    instructions: [
      { id: 12, stepNumber: 1, instruction: 'Cook quinoa in 2 cups of broth or water; bring to boil, cover, reduce heat to low and simmer for 15 minutes. Fluff with a fork.' },
      { id: 13, stepNumber: 2, instruction: 'Season chicken cutlets with olive oil, oregano, garlic powder, salt, and pepper. Grill or sear in a skillet over medium-high heat for 5 to 6 minutes per side until 165°F.' },
      { id: 14, stepNumber: 3, instruction: 'Whisk tahini, warm water, lemon juice, minced herbs, and a pinch of salt until smooth and creamy.' },
      { id: 15, stepNumber: 4, instruction: 'Assemble bowls: spoon quinoa as the base, add sliced grilled chicken, diced cucumbers, and halved cherry tomatoes. Drizzle generously with Green Goddess tahini.' }
    ],
    status: 'published',
    publishedAt: '2026-10-10T14:00:00Z',
    viewCount: 4200,
    saveCount: 590
  },
  {
    id: 'rec-5',
    title: 'Crustless Garden Veggie & Goat Cheese Egg Muffins',
    slug: 'crustless-veggie-goat-cheese-egg-muffins',
    description: 'Protein-packed grab-and-go breakfast bites baked with sweet bell peppers, baby spinach, and creamy goat cheese.',
    coverImageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    categoryId: 7,
    categoryName: 'Healthy Breakfast',
    dietaryTags: ['Vegetarian', 'High-Protein', 'Gluten-Free', 'Meal Prep'],
    allergens: ['eggs', 'dairy'],
    difficulty: 'easy',
    prepTimeMin: 10,
    cookTimeMin: 20,
    totalTimeMin: 30,
    baseServings: 6,
    costPerServing: 1.45,
    calories: 160,
    proteinG: 12,
    carbsG: 3,
    fatG: 10,
    fiberG: 1,
    sodiumMg: 190,
    ingredients: [
      { id: 36, amountUs: '8 large', amountMetric: '8 large', ingredient: 'Pasture-raised eggs', sortOrder: 1 },
      { id: 37, amountUs: '1/4 cup', amountMetric: '60ml', ingredient: 'Unsweetened milk or cream', sortOrder: 2 },
      { id: 38, amountUs: '1 cup', amountMetric: '30g', ingredient: 'Baby spinach, finely chopped', sortOrder: 3 },
      { id: 39, amountUs: '1 medium', amountMetric: '1 medium', ingredient: 'Red bell pepper, finely diced', sortOrder: 4 },
      { id: 40, amountUs: '2 stalks', amountMetric: '2 stalks', ingredient: 'Green onions, sliced', sortOrder: 5 },
      { id: 41, amountUs: '3 oz', amountMetric: '85g', ingredient: 'Crumpled soft goat cheese or feta', sortOrder: 6 },
      { id: 42, amountUs: '1/2 tsp', amountMetric: '2g', ingredient: 'Sea salt, black pepper, and garlic powder', sortOrder: 7 }
    ],
    instructions: [
      { id: 16, stepNumber: 1, instruction: 'Preheat oven to 375°F (190°C) and grease a 12-cup muffin tin lightly with olive oil or avocado oil spray.' },
      { id: 17, stepNumber: 2, instruction: 'In a large bowl, whisk eggs, milk, salt, pepper, and garlic powder until fluffy.' },
      { id: 18, stepNumber: 3, instruction: 'Divide chopped spinach, diced peppers, and green onions evenly among muffin cavities. Pour whisked egg mixture over the vegetables until 3/4 full.' },
      { id: 19, stepNumber: 4, instruction: 'Crumble goat cheese over the top of each cup. Bake for 18 to 22 minutes until eggs are set and golden around edges.' }
    ],
    status: 'published',
    publishedAt: '2026-10-08T08:30:00Z',
    viewCount: 2850,
    saveCount: 390
  },
  {
    id: 'rec-6',
    title: 'Crispy Turmeric Spiced Roasted Chickpeas',
    slug: 'crispy-turmeric-roasted-chickpeas',
    description: 'Addictive crunchy snack loaded with prebiotic fiber, golden turmeric, smoked paprika, and sea salt.',
    coverImageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
    categoryId: 9,
    categoryName: 'Healthy Snacks',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Budget', 'High-Fiber'],
    allergens: [],
    difficulty: 'easy',
    prepTimeMin: 10,
    cookTimeMin: 30,
    totalTimeMin: 40,
    baseServings: 4,
    costPerServing: 0.65,
    calories: 180,
    proteinG: 7,
    carbsG: 26,
    fatG: 6,
    fiberG: 6,
    sodiumMg: 210,
    ingredients: [
      { id: 43, amountUs: '2 cans (15 oz each)', amountMetric: '800g', ingredient: 'Chickpeas (garbanzo beans), drained and rinsed', sortOrder: 1 },
      { id: 44, amountUs: '1.5 tbsp', amountMetric: '22ml', ingredient: 'Extra virgin olive oil', sortOrder: 2 },
      { id: 45, amountUs: '1 tsp', amountMetric: '3g', ingredient: 'Ground turmeric', sortOrder: 3 },
      { id: 46, amountUs: '1/2 tsp', amountMetric: '1.5g', ingredient: 'Smoked paprika & ground cumin', sortOrder: 4 },
      { id: 47, amountUs: '1/4 tsp', amountMetric: '1g', ingredient: 'Black pepper (activates turmeric curcumin)', sortOrder: 5 },
      { id: 48, amountUs: '1/2 tsp', amountMetric: '2.5g', ingredient: 'Fine sea salt', sortOrder: 6 }
    ],
    instructions: [
      { id: 20, stepNumber: 1, instruction: 'Preheat oven to 400°F (200°C). Thoroughly pat rinsed chickpeas dry with a clean kitchen towel. (Crispiness requires absolute dryness!).' },
      { id: 21, stepNumber: 2, instruction: 'Toss dry chickpeas with olive oil, turmeric, smoked paprika, cumin, black pepper, and salt on a rimmed baking sheet.' },
      { id: 22, stepNumber: 3, instruction: 'Roast for 25 to 30 minutes, tossing halfway through, until audibly crunchy. Let cool on the sheet pan for 10 minutes to crisp up further.' }
    ],
    status: 'published',
    publishedAt: '2026-10-06T15:00:00Z',
    viewCount: 2400,
    saveCount: 310
  },
  {
    id: 'rec-7',
    title: '15-Minute Skillet Turkey & Black Bean Tacos',
    slug: '15-minute-skillet-turkey-black-bean-tacos',
    description: 'Fast weeknight family tacos with lean ground turkey, fiber-packed black beans, avocado slices, and warm corn tortillas.',
    coverImageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    categoryId: 11,
    categoryName: 'Quick Meals (Under 30 Min)',
    dietaryTags: ['High-Protein', 'Quick <30 Min', 'Gluten-Free', 'Family-Friendly'],
    allergens: [],
    difficulty: 'easy',
    prepTimeMin: 5,
    cookTimeMin: 12,
    totalTimeMin: 17,
    baseServings: 4,
    costPerServing: 2.75,
    calories: 410,
    proteinG: 32,
    carbsG: 36,
    fatG: 14,
    fiberG: 8,
    sodiumMg: 380,
    ingredients: [
      { id: 49, amountUs: '1 lb', amountMetric: '450g', ingredient: '93% lean ground turkey', sortOrder: 1 },
      { id: 50, amountUs: '1 can (15 oz)', amountMetric: '400g', ingredient: 'Black beans, rinsed and drained', sortOrder: 2 },
      { id: 51, amountUs: '1 packet or 2 tbsp', amountMetric: '15g', ingredient: 'Low-sodium taco seasoning (chili powder, cumin, garlic, oregano)', sortOrder: 3 },
      { id: 52, amountUs: '1/3 cup', amountMetric: '80ml', ingredient: 'Water', sortOrder: 4 },
      { id: 53, amountUs: '8 small', amountMetric: '8 small', ingredient: '100% yellow corn tortillas, warmed', sortOrder: 5 },
      { id: 54, amountUs: '1 ripe', amountMetric: '1 ripe', ingredient: 'Avocado, sliced', groupName: 'Toppings', sortOrder: 6 },
      { id: 55, amountUs: '1 cup', amountMetric: '100g', ingredient: 'Shredded romaine lettuce & salsa fresca', groupName: 'Toppings', sortOrder: 7 }
    ],
    instructions: [
      { id: 23, stepNumber: 1, instruction: 'Heat a large skillet over medium-high heat. Add ground turkey, breaking it up with a spatula until browned (approx 6 minutes).' },
      { id: 24, stepNumber: 2, instruction: 'Stir in black beans, taco seasoning, and water. Simmer for 3 to 4 minutes until sauce thickens and coats the meat and beans.' },
      { id: 25, stepNumber: 3, instruction: 'Warm corn tortillas in a dry skillet for 30 seconds per side. Spoon turkey-bean mixture into tortillas and garnish with sliced avocado, salsa, and lettuce.' }
    ],
    status: 'published',
    publishedAt: '2026-10-04T17:00:00Z',
    viewCount: 3800,
    saveCount: 480
  },
  {
    id: 'rec-8',
    title: 'Creamy Avocado Cacao Mousse (Naturally Sweetened)',
    slug: 'creamy-avocado-cacao-mousse',
    description: 'Decadent chocolate dessert boasting silky monounsaturated fats from ripe Haas avocados, raw cacao powder, and pure maple syrup.',
    coverImageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    categoryId: 9,
    categoryName: 'Healthy Snacks',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Vegetarian'],
    allergens: [],
    difficulty: 'easy',
    prepTimeMin: 5,
    cookTimeMin: 0,
    totalTimeMin: 5,
    baseServings: 2,
    costPerServing: 1.80,
    calories: 240,
    proteinG: 4,
    carbsG: 28,
    fatG: 14,
    fiberG: 7,
    sodiumMg: 45,
    ingredients: [
      { id: 56, amountUs: '2 ripe', amountMetric: '2 ripe', ingredient: 'Haas avocados, pitted and peeled', sortOrder: 1 },
      { id: 57, amountUs: '1/3 cup', amountMetric: '30g', ingredient: 'Unsweetened raw cacao powder', sortOrder: 2 },
      { id: 58, amountUs: '1/4 cup', amountMetric: '60ml', ingredient: 'Pure grade A maple syrup', sortOrder: 3 },
      { id: 59, amountUs: '1/4 cup', amountMetric: '60ml', ingredient: 'Unsweetened almond milk', sortOrder: 4 },
      { id: 60, amountUs: '1 tsp', amountMetric: '5ml', ingredient: 'Vanilla extract and pinch of sea salt', sortOrder: 5 }
    ],
    instructions: [
      { id: 26, stepNumber: 1, instruction: 'Place avocados, cacao powder, maple syrup, almond milk, vanilla extract, and salt into a food processor or high-speed blender.' },
      { id: 27, stepNumber: 2, instruction: 'Blend on high for 60 to 90 seconds, stopping once to scrape the sides, until velvety smooth and glossy with no avocado lumps remaining.' },
      { id: 28, stepNumber: 3, instruction: 'Spoon into dessert glasses. Chill in refrigerator for 30 minutes before serving. Garnish with fresh raspberries or cacao nibs.' }
    ],
    status: 'published',
    publishedAt: '2026-10-02T19:00:00Z',
    viewCount: 2200,
    saveCount: 290
  },
  {
    id: 'rec-9',
    title: 'Hearty Tuscan White Bean & Kale Skillet Stew',
    slug: 'tuscan-white-bean-kale-skillet',
    description: 'Comforting rustic Italian dish featuring cannellini beans, tender Tuscan lacinato kale, sun-dried tomatoes, and rosemary in garlic broth.',
    coverImageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    categoryId: 12,
    categoryName: 'Plant-Based & Vegan',
    dietaryTags: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Budget', 'High-Fiber'],
    allergens: [],
    difficulty: 'easy',
    prepTimeMin: 10,
    cookTimeMin: 15,
    totalTimeMin: 25,
    baseServings: 4,
    costPerServing: 1.60,
    calories: 290,
    proteinG: 14,
    carbsG: 44,
    fatG: 7,
    fiberG: 11,
    sodiumMg: 380,
    ingredients: [
      { id: 61, amountUs: '2 cans (15 oz each)', amountMetric: '800g', ingredient: 'Cannellini white kidney beans, rinsed and drained', sortOrder: 1 },
      { id: 62, amountUs: '1 bunch', amountMetric: '200g', ingredient: 'Lacinato (dino) kale, thick stems stripped, leaves chopped', sortOrder: 2 },
      { id: 63, amountUs: '1/3 cup', amountMetric: '50g', ingredient: 'Sun-dried tomatoes in oil, drained and chopped', sortOrder: 3 },
      { id: 64, amountUs: '4 cloves', amountMetric: '4 cloves', ingredient: 'Garlic, thinly sliced', sortOrder: 4 },
      { id: 65, amountUs: '1.5 cups', amountMetric: '360ml', ingredient: 'Vegetable broth', sortOrder: 5 },
      { id: 66, amountUs: '1 tbsp', amountMetric: '15ml', ingredient: 'Extra virgin olive oil', sortOrder: 6 },
      { id: 67, amountUs: '1 tsp', amountMetric: '2g', ingredient: 'Fresh chopped rosemary or dried Italian herbs', sortOrder: 7 }
    ],
    instructions: [
      { id: 29, stepNumber: 1, instruction: 'Warm olive oil in a wide skillet over medium heat. Sauté sliced garlic, rosemary, and sun-dried tomatoes for 2 minutes.' },
      { id: 30, stepNumber: 2, instruction: 'Add cannellini beans and vegetable broth. Simmer for 8 minutes, lightly crushing a few beans with the back of a spoon to create a creamy sauce.' },
      { id: 31, stepNumber: 3, instruction: 'Fold in chopped kale. Cover for 4 minutes until kale is tender and vibrant green. Serve hot with toasted sourdough.' }
    ],
    status: 'published',
    publishedAt: '2026-09-30T13:00:00Z',
    viewCount: 2600,
    saveCount: 370
  },
  {
    id: 'rec-10',
    title: 'Zesty Lime Cilantro Shrimp with Roasted Sweet Potato Mash',
    slug: 'lime-cilantro-shrimp-sweet-potato-mash',
    description: 'Succulent wild-caught shrimp sauteed with garlic, lime, and crushed red pepper alongside naturally sweet, potassium-dense mashed sweet potatoes.',
    coverImageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80',
    categoryId: 8,
    categoryName: 'Lunch & Dinner',
    dietaryTags: ['High-Protein', 'Gluten-Free', 'Quick <30 Min'],
    allergens: ['shellfish'],
    difficulty: 'medium',
    prepTimeMin: 10,
    cookTimeMin: 15,
    totalTimeMin: 25,
    baseServings: 4,
    costPerServing: 4.25,
    calories: 380,
    proteinG: 34,
    carbsG: 38,
    fatG: 9,
    fiberG: 5,
    sodiumMg: 340,
    ingredients: [
      { id: 68, amountUs: '1.25 lbs', amountMetric: '560g', ingredient: 'Raw jumbo shrimp, peeled and deveined', sortOrder: 1 },
      { id: 69, amountUs: '2 large', amountMetric: '600g', ingredient: 'Orange sweet potatoes, peeled and cubed', sortOrder: 2 },
      { id: 70, amountUs: '2 tbsp', amountMetric: '30ml', ingredient: 'Extra virgin olive oil or ghee', sortOrder: 3 },
      { id: 71, amountUs: '3 cloves', amountMetric: '3 cloves', ingredient: 'Garlic, minced', sortOrder: 4 },
      { id: 72, amountUs: '2 whole', amountMetric: '2 whole', ingredient: 'Limes (1 juiced, 1 sliced for wedges)', sortOrder: 5 },
      { id: 73, amountUs: '1/3 cup', amountMetric: '15g', ingredient: 'Fresh cilantro, chopped', sortOrder: 6 }
    ],
    instructions: [
      { id: 32, stepNumber: 1, instruction: 'Steam or boil cubed sweet potatoes for 12 minutes until fork-tender. Mash with 1 tbsp olive oil, a pinch of sea salt, and a splash of milk.' },
      { id: 33, stepNumber: 2, instruction: 'In a large non-stick skillet, heat remaining olive oil over medium-high heat. Add garlic and shrimp; cook for 2 minutes per side until pink and opaque.' },
      { id: 34, stepNumber: 3, instruction: 'Deglaze pan with fresh lime juice and toss with fresh cilantro. Plate over a bed of warm sweet potato mash.' }
    ],
    status: 'published',
    publishedAt: '2026-09-26T18:00:00Z',
    viewCount: 3100,
    saveCount: 450
  }
];
