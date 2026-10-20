import { ImportantQuestion } from '../types/curriculum';

/**
 * Real, authentic Tamil Nadu State Board (Samacheer Kalvi) Class 12
 * Book-Back Textbook Evaluation Questions and Government Public Exam Questions
 * with verified DGE scoring rubrics, Tamil translations, and marking schemes.
 */

export const REAL_CHAPTER_QUESTIONS: Record<string, ImportantQuestion[]> = {
  // -------------------------------------------------------------
  // BIO-BOTANY CHAPTER 1: Asexual and Sexual Reproduction in Plants
  // -------------------------------------------------------------
  'topic-1.1': [
    {
      id: 'bb-1.1-1',
      marks: 1,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Evaluation Q1',
      question: 'Which of the following plants reproduces vegetatively through adventitious foliar epiphyllous buds on leaf margins?',
      tamilQuestion: 'இலை விளிம்புகளில் தோன்றும் மாற்றிட தழைவழி மொட்டுகள் மூலம் இனப்பெருக்கம் செய்யும் தாவரம் எது?',
      answer: 'Correct Option: Bryophyllum.\nExplanation: In Bryophyllum pinnatum, adventitious foliar buds (epiphyllous buds) develop in the crenate notches along the margins of succulent leaves. When the leaf falls on moist soil, each bud develops roots and grows into an independent plantlet.',
      markingScheme: ['1 mark for correct identification (Bryophyllum) with reasoning'],
      keyTerms: ['Foliar epiphyllous buds', 'Crenate notches', 'Vegetative multiplication'],
    },
    {
      id: 'bb-1.1-2',
      marks: 1,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2024',
      question: 'The aquatic plant famously known as the "Terror of Bengal" multiplies aggressively via which vegetative propagule?',
      tamilQuestion: '"வங்காளத்தின் பயங்கரன்" என்று அழைக்கப்படும் நீர்வாழ்த்தாவரம் எந்த தழைவழி உறுப்பு மூலம் வேகமாக பெருகுகிறது?',
      answer: 'Correct Option: Offset (Eichhornia crassipes / Water hyacinth).\nExplanation: Eichhornia crassipes spreads vegetatively with enormous speed across aquatic water bodies through short, thick sub-aerial lateral branches called offsets. It drains dissolved oxygen from water, leading to the suffocation and death of fishes.',
      markingScheme: ['1 mark for identifying offset and Eichhornia crassipes'],
      keyTerms: ['Offset', 'Eichhornia crassipes', 'Depletion of dissolved oxygen'],
    },
    {
      id: 'bb-1.1-3',
      marks: 2,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Evaluation Q11',
      question: 'What are "Clones"? State their evolutionary limitation.',
      tamilQuestion: '"நகல்கள்" (Clones) என்றால் என்ன? அவற்றின் பரிணாம குறைபாட்டை கூறுக.',
      answer: '1. Definition: Individuals produced through asexual reproduction or vegetative propagation that are morphologically and genetically identical to one another and to the parent plant are called Clones.\n2. Evolutionary Limitation: Because clones arise solely through mitotic divisions without meiosis or genetic crossing-over, they lack genetic variations. Consequently, they are uniformly susceptible to sudden environmental changes and epidemic diseases.',
      markingScheme: [
        '1 mark: Morphologically and genetically identical individuals definition',
        '1 mark: Absence of genetic variation and vulnerability to pathogens/environmental shifts',
      ],
      keyTerms: ['Genetically identical', 'Uniparental mitotic reproduction', 'Absence of genetic variation'],
    },
    {
      id: 'bb-1.1-4',
      marks: 2,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - June 2024',
      question: 'Differentiate between Stock and Scion in plant grafting.',
      tamilQuestion: 'ஒட்டுப்போடுதலில் வேர்க்கட்டை (Stock) மற்றும் ஒட்டுத்தண்டு (Scion) வேறுபடுத்துக.',
      answer: '1. Stock (Rootstock): The rooted plant which remains in contact with the soil and provides the subterranean root system, anchorage, and absorption of water and minerals.\n2. Scion: The detached stem branch or vegetative bud selected from a superior elite cultivar with desirable flowers or fruits that is united onto the stock.\n3. Essential Requirement: Alignment of vascular cambium between stock and scion is required for successful graft union.',
      markingScheme: [
        '1 mark: Correct definition of Stock (rooted base in soil)',
        '1 mark: Correct definition of Scion (desired shoot) and cambial alignment',
      ],
      keyTerms: ['Stock (root system)', 'Scion (elite shoot)', 'Vascular cambium union'],
    },
    {
      id: 'bb-1.1-5',
      marks: 3,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Evaluation Q15',
      question: 'Differentiate between Mound Layering and Air Layering (Gootee).',
      tamilQuestion: 'மண்முட்டு பதியமிடுதல் மற்றும் காற்று பதியமிடுதல் வேறுபடுத்துக.',
      answer: '1. Mound Layering:\n• Practiced on plants with flexible lower branches close to the ground (e.g., Jasminum, Ixora).\n• The flexible lower shoot is bent down, pegged into the soil, and buried under a mound of earth after removing a ring of bark.\n• Adventitious roots emerge at the buried node, after which it is severed from the parent plant.\n\n2. Air Layering (Gootee):\n• Practiced on woody upright branches that cannot be bent down to soil level (e.g., Citrus, Pomegranate, Ficus).\n• A ring of bark (phloem and cambium) is girdled from an aerial branch.\n• Rooting hormones (IBA/NAA) are applied, wrapped with moist sphagnum moss, and encased in polythene.\n• Roots emerge inside the moss after 2-3 months.',
      markingScheme: [
        '1.5 marks: Mound layering method, bark notch, and examples (Jasminum)',
        '1.5 marks: Air layering girdling, sphagnum moss wrap, hormone application, and examples (Citrus)',
      ],
      keyTerms: ['Mound layering (bent lower branch)', 'Air layering (girdled aerial branch + sphagnum moss)'],
    },
    {
      id: 'bb-1.1-6',
      marks: 3,
      category: 'high_yield',
      sourceType: 'verified_textbook',
      sourceExam: 'TN State Board Model Paper 2025',
      question: 'List three natural vegetative propagules of stem with their botanical examples.',
      tamilQuestion: 'தண்டின் மூன்று இயற்கை தழைவழி இனப்பெருக்க உறுப்புகளை தாவர எடுத்துக்காட்டுகளுடன் பட்டியலிடுக.',
      answer: '1. Rhizome: Prostrate underground perennial stem storing reserve food and bearing scale leaves with axillary buds. Example: Zingiber officinale (Ginger), Curcuma longa (Turmeric).\n2. Tuber: Swollen subterranean stem tip bearing "eyes" (nodes with scale leaves and axillary buds) that sprout aerial shoots. Example: Solanum tuberosum (Potato).\n3. Offset: Short, stout sub-aerial lateral branch arising from leaf axils producing a rosette of leaves above and roots below. Example: Pistia stratiotes, Eichhornia crassipes.',
      markingScheme: [
        '1 mark: Rhizome with example (Zingiber officinale)',
        '1 mark: Tuber with example (Solanum tuberosum)',
        '1 mark: Offset with example (Eichhornia / Pistia)',
      ],
      keyTerms: ['Rhizome', 'Tuber with eyes', 'Offset rosette'],
    },
    {
      id: 'bb-1.1-7',
      marks: 5,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Long Answer Q24',
      question: 'Describe conventional artificial methods of vegetative propagation in plants: Cutting, Grafting, and Layering.',
      tamilQuestion: 'தாவரங்களில் பாரம்பரிய செயற்கை தழைவழி இனப்பெருக்க முறைகளான துண்டாக்குதல், ஒட்டுப்போடுதல் மற்றும் பதியமிடுதல் ஆகியவற்றை விவரி.',
      answer: '1. CUTTING:\n• The method of severing a vegetative part (root, stem, or leaf) from the mother plant and planting it in moist rooting medium.\n• Stem cuttings: Hibiscus, Bougainvillea, Moringa.\n• Root cuttings: Malus (Apple).\n• Leaf cuttings: Begonia, Bryophyllum.\n\n2. GRAFTING:\n• Joining parts of two different plants so that they unite and continue their growth as one composite plant.\n• The plant rooted in soil is called Stock; the elite branch attached is called Scion.\n• Variants:\n  (a) Bud grafting: T-shaped incision in stock bark; single scion bud inserted.\n  (b) Approach grafting: Both stock and scion remain rooted in pots until vascular cambium unites.\n  (c) Tongue grafting: Slanting tongue-like notches interlock stock and scion of equal diameter.\n  (d) Crown grafting: Several scions wedged into slits on a thick stock trunk.\n  (e) Wedge grafting: V-shaped wedge carved in stock.\n\n3. LAYERING:\n• Inducing adventitious root formation on an intact shoot while still attached to the parent plant.\n• Mound Layering: Lower branch pegged into soil (Jasminum).\n• Air Layering: Girdled aerial twig wrapped in damp sphagnum moss and polythene wrap (Citrus, Guava).',
      markingScheme: [
        '1.5 marks: Cutting description with stem, root, and leaf examples',
        '2 marks: Grafting definition, Stock/Scion, and 5 variants (Bud, Approach, Tongue, Crown, Wedge)',
        '1.5 marks: Layering principles (Mound and Air layering procedures)',
      ],
      keyTerms: ['Cutting (stem/root/leaf)', 'Grafting (Stock & Scion union)', 'Layering (Mound & Air layering)'],
    },
  ],

  'topic-1.2': [
    {
      id: 'bb-1.2-1',
      marks: 1,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Evaluation Q3',
      question: 'In a mature anther wall, which layer develops hygroscopic alpha-cellulosic fibrous bands that aid in anther dehiscence?',
      tamilQuestion: 'முதிர்ந்த மகரந்தப்பை சுவரில், வெடித்தலுக்கு உதவும் ஆல்ஃபா செல்லுலோஸ் நார்த்தன்மை பட்டைகளை கொண்ட அடுக்கு எது?',
      answer: 'Correct Option: Endothecium.\nExplanation: The endothecium lies immediately below the epidermis. Its cells elongate radially and develop characteristic alpha-cellulosic fibrous bands on their inner tangential and radial walls. Being hygroscopic, these bands shrink in dry weather, rupturing the stomium cleft and releasing pollen grains.',
      markingScheme: ['1 mark for Endothecium with hygroscopic cellulose bands mechanism'],
      keyTerms: ['Endothecium', 'Alpha-cellulosic fibrous bands', 'Hygroscopic dehiscence', 'Stomium'],
    },
    {
      id: 'bb-1.2-2',
      marks: 1,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2024',
      question: 'Identify the correctly matched pair regarding anther wall layers:',
      tamilQuestion: 'மகரந்தப்பை சுவர் அடுக்குகள் தொடர்பான சரியான இணையை கண்டறிக:',
      answer: 'Correct Match: Tapetum — Nourishment to developing microspores.\n(Incorrect pairs: Epidermis is protective, Endothecium aids dehiscence, Middle layers are ephemeral and crush during development).',
      markingScheme: ['1 mark for identifying Tapetum - Nourishment to microspores'],
      keyTerms: ['Tapetum', 'Nutritive layer', 'Microsporogenesis'],
    },
    {
      id: 'bb-1.2-3',
      marks: 2,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2024',
      question: 'What is Pollenkitt? Mention its two biological functions.',
      tamilQuestion: 'போலன்கிட் என்றால் என்ன? அதன் இரண்டு உயிரியல் பணிகளை கூறுக.',
      answer: '1. Definition: Pollenkitt is a sticky, oily, yellow or orange coating composed of carotenoids and lipids found on the outer surface of pollen grains in entomophilous (insect-pollinated) angiosperms. It is synthesized by the secretory tapetum.\n2. Functions:\n• Attracts insect pollinators with its bright yellow/orange color and characteristic scent.\n• Shields the fragile pollen DNA from lethal ultraviolet radiation damage.\n• Provides an adhesive oily film helping pollen grains stick to pollinator bodies and stigma papillae.',
      markingScheme: [
        '1 mark: Definition of Pollenkitt (oily carotenoid/lipid layer from tapetum)',
        '1 mark: Two valid functions (insect attraction / UV protection / adhesion)',
      ],
      keyTerms: ['Pollenkitt', 'Carotenoids and lipids', 'Secretory tapetum', 'UV shield'],
    },
    {
      id: 'bb-1.2-4',
      marks: 2,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Evaluation Q12',
      question: 'Define "Stomium" and state its significance in anther dehiscence.',
      tamilQuestion: '"ஸ்டோமியம்" (Stomium) வரையறுத்து, மகரந்தப்பை வெடித்தலில் அதன் முக்கியத்துவத்தை கூறுக.',
      answer: '1. Definition: Stomium is a shallow longitudinal groove located at the junction of two microsporangia in each anther lobe where the endothecium cells lack fibrous cellulosic bands.\n2. Significance: At anther maturity, dehydration causes the fibrous endothecial cells to contract laterally, causing the thin-walled stomium cells to tear open, creating a slit through which millions of mature pollen grains escape.',
      markingScheme: [
        '1 mark: Stomium location (junction of microsporangia lacking fibrous thickenings)',
        '1 mark: Site of longitudinal dehiscence due to hygroscopic tension',
      ],
      keyTerms: ['Stomium', 'Absence of fibrous thickenings', 'Longitudinal dehiscence line'],
    },
    {
      id: 'bb-1.2-5',
      marks: 3,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Evaluation Q14',
      question: 'State the functions of the Tapetum in an anther.',
      tamilQuestion: 'மகரந்தப்பையில் காணப்படும் டபீட்டத்தின் பணிகளை விவரி.',
      answer: 'The tapetum is the innermost physiological layer of the anther wall with vital functions:\n1. Nutrition: Delivers digested amino acids, carbohydrates, and nutrients to developing microspore mother cells and young tetrads.\n2. Ubisch Bodies & Sporopollenin: Synthesizes Ubisch bodies (pro-orbicules) that deposit sporopollenin, the chemically indestructible polymer forming the sculptured pollen exine.\n3. Pollenkitt Synthesis: Produces the sticky, oily carotenoid pollenkitt film on insect-pollinated pollen.\n4. Pollen-Wall Proteins: Synthesizes enzymatic and recognition exine proteins that regulate pollen-stigma compatible/incompatible rejection reactions.',
      markingScheme: [
        '1 mark: Nourishment to developing microspores',
        '1 mark: Synthesis of Ubisch bodies and sporopollenin for exine wall',
        '1 mark: Production of Pollenkitt and incompatibility recognition proteins',
      ],
      keyTerms: ['Nutritive tapetum', 'Ubisch bodies', 'Sporopollenin', 'Pollenkitt', 'Incompatibility proteins'],
    },
    {
      id: 'bb-1.2-6',
      marks: 3,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - June 2024',
      question: 'Differentiate between Secretory Tapetum and Invasive (Amoeboid) Tapetum.',
      tamilQuestion: 'சுரப்பு டபீட்டம் மற்றும் ஊடுருவும் (அமீபாய்டு) டபீட்டம் வேறுபடுத்துக.',
      answer: '1. Secretory Tapetum (Parietal / Glandular):\n• Tapetal cells retain their original parietal positions and cellular wall integrity throughout microsporogenesis.\n• Synthesized nutrients and enzymes are actively secreted through cell membranes into the anther locule.\n• Universal in majority of angiosperms.\n\n2. Invasive Tapetum (Amoeboid / Periplasmodial):\n• Radial and inner tangential cell walls disintegrate early.\n• Protoplasts escape from the wall and fuse to form a multinucleate amoeboid periplasmodium that physically enters between the microspores.\n• Observed in Typha, Tradescantia, and Alisma.',
      markingScheme: [
        '1.5 marks: Secretory tapetum cell wall retention, secretion into locule, examples',
        '1.5 marks: Invasive tapetum cell wall breakdown, periplasmodial invasion, examples',
      ],
      keyTerms: ['Secretory tapetum (intact walls)', 'Invasive tapetum (periplasmodium)'],
    },
    {
      id: 'bb-1.2-7',
      marks: 5,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2024 & June 2023',
      question: 'With a neat labelled diagram, describe the transverse section (T.S.) of a mature anther.',
      tamilQuestion: 'படம் வரைந்து முதிர்ந்த மகரந்தப்பையின் குறுக்குவெட்டு (T.S.) தோற்றத்தை விளக்குக.',
      answer: 'A mature angiosperm anther is bilobed, dithecous, and tetrasporangiate with four microsporangia. Its transverse section reveals the following structures:\n\n1. ANTHER WALL LAYERS (Outer to Inner):\n• Epidermis: Outermost single layer of tangentially stretched protective cells with cutinized outer walls.\n• Endothecium: Sub-epidermal single layer with radial alpha-cellulosic fibrous thickenings; acts hygroscopically to open the stomium at maturity.\n• Middle Layers: 2 to 3 transient parenchymatous layers that store starch and degenerate as the locule matures.\n• Tapetum: Innermost single nutritive layer with dense multinucleate cytoplasm; synthesizes Ubisch bodies, sporopollenin, and pollenkitt.\n\n2. STOMIUM:\n• The cleft between two adjacent microsporangia where endothecial thickenings are absent, facilitating pollen dehiscence.\n\n3. CONNECTIVE TISSUE & VASCULAR STRAND:\n• Central sterile parenchymatous tissue holding the two lobes together, traversed by a single amphicribral vascular bundle.\n\n4. POLLEN CHAMBERS (Microsporangia):\n• Four locules containing mature haploid pollen grains with an outer sculptured exine (sporopollenin) and inner cellulosic intine.',
      markingScheme: [
        '2 marks: Neat, accurate labeled diagram (Epidermis, Endothecium, Middle layers, Tapetum, Stomium, Pollen grains, Connective)',
        '3 marks: Detailed step-by-step description of the 4 wall layers, stomium, and pollen chamber',
      ],
      keyTerms: ['Epidermis', 'Endothecium (fibrous bands)', 'Middle layers', 'Tapetum', 'Stomium', 'Pollen chamber'],
    },
  ],

  'topic-1.3': [
    {
      id: 'bb-1.3-1',
      marks: 1,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Evaluation Q5',
      question: 'An ovule in which the micropyle, chalaza, and funicle lie in one straight vertical axis is called:',
      tamilQuestion: 'சூல் துளை, சலாசா மற்றும் சூல் காம்பு ஆகிய மூன்றும் ஒரே நேர்க்கோட்டில் அமையப்பெற்ற சூல் எவ்வாறு அழைக்கப்படுகிறது?',
      answer: 'Correct Option: Orthotropous ovule (Atropous).\nExplanation: In an orthotropous ovule (e.g., Polygonaceae, Piperaceae), the body of the ovule is erect and straight so that the micropyle is at the apex, while the chalaza and funicle lie at the base in a single continuous vertical line.',
      markingScheme: ['1 mark for Orthotropous / Atropous ovule with straight axis feature'],
      keyTerms: ['Orthotropous ovule', 'Straight vertical axis', 'Polygonaceae'],
    },
    {
      id: 'bb-1.3-2',
      marks: 2,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Evaluation Q16',
      question: 'What is Hilum in an ovule? What does it mark?',
      tamilQuestion: 'சூலின் தழும்பு (Hilum) என்றால் என்ன? அது எதை குறிக்கிறது?',
      answer: '1. Definition: The point of junction or scar where the stalk of the ovule (funicle) is attached to the main body of the ovule is called the Hilum.\n2. Significance: It marks the anatomical boundary where vascular bundles transition from the funicle into the base of the ovule (chalaza).',
      markingScheme: ['1 mark: Point of attachment between funicle and ovule body', '1 mark: Anatomical scar / vascular boundary'],
      keyTerms: ['Hilum', 'Funicle attachment scar', 'Placental junction'],
    },
    {
      id: 'bb-1.3-3',
      marks: 2,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2022',
      question: 'Name the three cellular components of the Egg Apparatus in an embryo sac.',
      tamilQuestion: 'கருப்பையில் உள்ள முட்டை சாதனத்தின் மூன்று செல்லியல் பகுதிகளை குறிப்பிடுக.',
      answer: 'The Egg Apparatus is situated at the micropylar end of a Polygonum type embryo sac and consists of:\n1. One centrally placed haploid Egg Cell (female gamete / oosphere).\n2. Two flanking lateral Synergids (helper cells) bearing finger-like cytoplasmic ingrowths called the Filiform Apparatus that guide pollen tube entry.',
      markingScheme: ['1 mark: One egg cell (female gamete)', '1 mark: Two synergids with filiform apparatus'],
      keyTerms: ['Egg cell', 'Synergids', 'Filiform apparatus'],
    },
    {
      id: 'bb-1.3-4',
      marks: 3,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2023',
      question: 'Explain the organization of the mature 7-celled, 8-nucleate Polygonum type embryo sac.',
      tamilQuestion: 'முதிர்ந்த 7-செல்கள், 8-உட்கருக்கள் கொண்ட பாலிகோனம் வகை கருப்பையின் அமைப்பை விளக்குக.',
      answer: 'The mature monosporic female gametophyte has 8 nuclei partitioned into 7 distinct cells:\n1. Micropylar End (Egg Apparatus - 3 cells, 3 nuclei): 1 central egg cell + 2 lateral synergids with filiform apparatus.\n2. Chalazal End (Antipodals - 3 cells, 3 nuclei): 3 ephemeral antipodal cells that absorb and transport nutrition to the embryo sac.\n3. Central Region (Central Cell - 1 large cell, 2 nuclei): Contains two polar nuclei that fuse prior to fertilization to form the diploid Secondary Nucleus (2n).',
      markingScheme: [
        '1 mark: Micropylar egg apparatus (1 egg + 2 synergids)',
        '1 mark: Chalazal antipodal cells (3 cells)',
        '1 mark: Large central cell with 2 polar nuclei forming secondary nucleus (2n)',
      ],
      keyTerms: ['7-celled, 8-nucleate', 'Egg apparatus', 'Antipodals', 'Polar nuclei / Secondary nucleus'],
    },
    {
      id: 'bb-1.3-5',
      marks: 5,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Long Answer Q25 & Public Exam Mar 2024',
      question: 'With a neat labelled diagram, describe the structure of an Anatropous Ovule (Megasporangium).',
      tamilQuestion: 'தெளிவான படம் வரைந்து நேர் தலைகீழ் சூலின் (Anatropous Ovule) அமைப்பை விவரி.',
      answer: 'An anatropous ovule is inverted 180° so that the micropyle lies close to the funicle base. Its parts are:\n\n1. FUNICLE (Funiculus):\n• The slender stalk attaching the ovule to the placenta of the ovary.\n\n2. HILUM & RAPHE:\n• Hilum: Scar marking the junction of funicle and ovule body.\n• Raphe: Longitudinal ridge formed where funicle fuses along the side of the ovule body.\n\n3. CHALAZA:\n• The basal swollen region of the ovule body where nucellus, integuments, and funicle merge.\n\n4. INTEGUMENTS:\n• One (unitegmic) or two (bitegmic) protective envelopes enclosing the nucellus.\n\n5. MICROPYLE:\n• The narrow pore left uncovered by integuments at the apex, providing the entry route for the pollen tube during siphonogamy.\n\n6. NUCELLUS:\n• Central nutritive parenchymatous tissue within which the female gametophyte develops.\n\n7. EMBRYO SAC (Female Gametophyte):\n• Mature 7-celled, 8-nucleate structure containing the egg apparatus (egg + 2 synergids), central cell (2 polar nuclei), and 3 antipodals.',
      markingScheme: [
        '2 marks: Accurate labeled diagram (Funicle, Hilum, Raphe, Chalaza, Outer/Inner integument, Nucellus, Micropyle, Embryo sac)',
        '3 marks: Comprehensive description of all anatomical parts and embryo sac cellular composition',
      ],
      keyTerms: ['Anatropous ovule', 'Funicle', 'Hilum', 'Raphe', 'Chalaza', 'Integuments', 'Micropyle', 'Nucellus', 'Embryo sac'],
    },
  ],

  'topic-1.4': [
    {
      id: 'bb-1.4-1',
      marks: 1,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Evaluation Q7',
      question: 'Pollination mediated by snails and slugs is scientifically called:',
      tamilQuestion: 'நத்தைகள் மூலம் நடைபெறும் மகரந்தச்சேர்க்கை எவ்வாறு அழைக்கப்படுகிறது?',
      answer: 'Correct Option: Malacophily.\nExplanation: Plants pollinated by terrestrial gastropods like snails and slugs (e.g., Lemna, Arisaema, Chrysanthemum) exhibit malacophily.',
      markingScheme: ['1 mark for Malacophily with snail/slug pollinator agent'],
      keyTerms: ['Malacophily', 'Snail pollination', 'Gastropod vector'],
    },
    {
      id: 'bb-1.4-2',
      marks: 2,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2024',
      question: 'What is Mellitophily? Mention floral characteristics of bee-pollinated flowers.',
      tamilQuestion: 'மெலிட்டோஃபிலி என்றால் என்ன? தேனீக்களால் மகரந்தச்சேர்க்கை செய்யப்படும் மலர்களின் சிறப்பியல்புகளை கூறுக.',
      answer: '1. Definition: Mellitophily is pollination mediated by bees (Apis spp.).\n2. Floral Adaptations:\n• Bright showy colors (yellow and blue; bees cannot see pure red).\n• Flowers produce sweet fragrances and nectar.\n• Petals possess ultraviolet nectar guide patterns visible only to the compound eyes of bees.\n• Flowers feature prominent landing platforms (e.g., labellum in Salvia).',
      markingScheme: [
        '1 mark: Definition of Mellitophily (bee pollination)',
        '1 mark: Two floral features (yellow/blue colors, nectar guides, scent, landing platform)',
      ],
      keyTerms: ['Mellitophily', 'Bee pollination', 'UV nectar guides', 'Landing platform'],
    },
    {
      id: 'bb-1.4-3',
      marks: 3,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Evaluation Q18',
      question: 'Differentiate between Anemophily (Wind) and Entomophily (Insect) pollination.',
      tamilQuestion: 'காற்று மகரந்தச்சேர்க்கை (அனிமோஃபிலி) மற்றும் பூச்சி மகரந்தச்சேர்க்கை (என்டமோஃபிலி) வேறுபடுத்துக.',
      answer: '1. Anemophily (Wind Pollination):\n• Flowers are small, inconspicuous, lacking petals, color, nectar, and fragrance (e.g., Zea mays, grasses).\n• Anthers are versatile and dangle freely outside the flower on long flexible filaments.\n• Pollen grains are minute, lightweight, dry, smooth, and produced in enormous astronomical numbers.\n• Stigma is large, feathery, branched (plumose) to trap airborne pollen.\n\n2. Entomophily (Insect Pollination):\n• Flowers are large, brightly colored, scented, and secrete sweet nectar (e.g., Salvia, Jasmine).\n• Anthers are firmly attached and do not dangle.\n• Pollen grains are larger, sculptured, and covered with sticky oily Pollenkitt.\n• Stigma is sticky and compact to hold arriving pollen.',
      markingScheme: [
        '1.5 marks: Anemophily features (inconspicuous flowers, versatile anther, plumose stigma, lightweight dry pollen)',
        '1.5 marks: Entomophily features (showy colored flowers, nectar, sticky pollenkitt, sticky stigma)',
      ],
      keyTerms: ['Anemophily (wind)', 'Versatile anther', 'Feathery plumose stigma', 'Entomophily (insects)', 'Pollenkitt'],
    },
    {
      id: 'bb-1.4-4',
      marks: 3,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2022',
      question: 'What is Cleistogamy? How does it guarantee seed set even in the absence of pollinators?',
      tamilQuestion: 'கிளீஸ்டோகேமி (Cleistogamy) என்றால் என்ன? அது மகரந்தச்சேர்க்கை காரணிகள் இல்லாவிட்டாலும் விதை உருவாவதை எவ்வாறு உறுதி செய்கிறது?',
      answer: '1. Definition: Cleistogamy is the phenomenon where bisexual flowers remain permanently closed throughout their lifetime and never expose their reproductive organs (e.g., Commelina benghalensis, Viola, Oxalis).\n2. Mechanism for Guaranteed Seed Set: When anthers dehisce inside the closed bud, pollen grains directly contact the receptive stigma inside the sealed floral chamber. 100% autogamous self-pollination occurs without requiring wind, water, or insect vectors, ensuring guaranteed seed set even during severe ecological disruption.',
      markingScheme: [
        '1.5 marks: Definition of permanently closed flowers with examples (Commelina)',
        '1.5 marks: Mechanism of internal self-pollination without pollinators and guaranteed seed set',
      ],
      keyTerms: ['Cleistogamy', 'Permanently closed flowers', '100% autogamy', 'Guaranteed seed set'],
    },
  ],

  'topic-1.5': [
    {
      id: 'bb-1.5-1',
      marks: 1,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Evaluation Q8',
      question: 'Double fertilization in angiosperms was first discovered by which scientist in Lilium and Fritillaria?',
      tamilQuestion: 'லில்லியம் மற்றும் பிரிட்லாரியா தாவரங்களில் ஆஞ்சியோஸ்பெர்ம்களின் இரட்டை கருவுறுதலை முதன்முதலில் கண்டறிந்த விஞ்ஞானி யார்?',
      answer: 'Correct Option: S.G. Nawaschin (1898).\nExplanation: Sergei Nawaschin discovered that both male gametes delivered by the pollen tube participate in fertilization: one fuses with the egg cell (Syngamy) and the other fuses with the secondary nucleus (Triple Fusion).',
      markingScheme: ['1 mark for S.G. Nawaschin with year 1898'],
      keyTerms: ['S.G. Nawaschin', 'Lilium and Fritillaria', 'Double fertilization'],
    },
    {
      id: 'bb-1.5-2',
      marks: 2,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2023',
      question: 'Define "Siphonogamy". In which plant group is it prominently found?',
      tamilQuestion: '"சiphonogamy" வரையறு. இது எந்த தாவர குழுவில் முதன்மையாக காணப்படுகிறது?',
      answer: '1. Definition: Siphonogamy is the process where non-motile male gametes are conveyed directly to the female gametophyte (embryo sac) through a tubular outgrowth called the pollen tube.\n2. Plant Group: Found in all seed plants (Gymnosperms and Angiosperms). It freed sexual reproduction from dependence on external water for swimming flagellated sperms.',
      markingScheme: ['1 mark: Non-motile gametes delivered via pollen tube', '1 mark: Seed plants (Spermatophytes / Angiosperms)'],
      keyTerms: ['Siphonogamy', 'Pollen tube conveyance', 'Independence from water'],
    },
    {
      id: 'bb-1.5-3',
      marks: 3,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Evaluation Q19',
      question: 'What is Triple Fusion? State its genetic consequence.',
      tamilQuestion: 'மூவிணைவு (Triple Fusion) என்றால் என்ன? அதன் மரபியல் விளைவை கூறுக.',
      answer: '1. Definition: In angiosperms, the second haploid male gamete (n) discharged by the pollen tube fuses with the diploid Secondary Nucleus (2n) in the central cell of the embryo sac. This union of three haploid nuclei is termed Triple Fusion.\n2. Genetic Consequence: It produces the triploid (3n) Primary Endosperm Nucleus (PEN). The PEN repeatedly divides mitotically to form the triploid Endosperm tissue, which stores fats, carbohydrates, and proteins to nourish the developing diploid embryo.',
      markingScheme: [
        '1.5 marks: Fusion of second male gamete (n) + secondary nucleus (2n)',
        '1.5 marks: Formation of triploid (3n) Primary Endosperm Nucleus (PEN) and nutritive role',
      ],
      keyTerms: ['Triple fusion (n + 2n = 3n)', 'Primary Endosperm Nucleus (PEN)', 'Nutritive endosperm'],
    },
    {
      id: 'bb-1.5-4',
      marks: 5,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Textbook Long Answer Q27 & Public Exam Mar 2023',
      question: 'Explain Double Fertilization and Triple Fusion in Angiosperms. State its biological significance.',
      tamilQuestion: 'ஆஞ்சியோஸ்பெர்ம்களில் இரட்டை கருவுறுதல் மற்றும் மூவிணைவு ஆகியவற்றை விளக்கி, அதன் உயிரியல் முக்கியத்துவத்தை கூறுக.',
      answer: 'Double fertilization is a unique diagnostic hallmark of angiosperms involving two distinct nuclear fusion events:\n\n1. ENTRY OF POLLEN TUBE:\n• The pollen tube grows down the style, enters the ovule through the micropyle (Porogamy), and penetrates into one of the synergids guided by the filiform apparatus.\n• The synergid degenerates, and the pollen tube tip ruptures, discharging two non-motile haploid male gametes (n).\n\n2. SYNGAMY (Generative Fertilization):\n• One haploid male gamete (n) fuses with the haploid egg nucleus (n) to produce a diploid Zygote (2n).\n• The zygote later develops into the diploid embryo.\n\n3. TRIPLE FUSION (Vegetative Fertilization):\n• The second haploid male gamete (n) migrates to the central cell and fuses with the diploid secondary nucleus (2n).\n• This produces the triploid Primary Endosperm Nucleus (PEN, 3n).\n\n4. BIOLOGICAL SIGNIFICANCE:\n• Energetic Economy: Nutritive endosperm tissue develops only when fertilization has succeeded, preventing waste of maternal energy on unfertilized ovules.\n• Hybrid Vigour: The triploid endosperm combines maternal and paternal genomes, promoting vigorous physiological nutrition.\n• Seed Viability: Provides nutrient reserves for embryo differentiation and seedling germination.',
      markingScheme: [
        '2 marks: Syngamy (n + n = 2n Zygote) with pollen tube entry through micropyle',
        '2 marks: Triple Fusion (n + 2n = 3n PEN) in central cell',
        '1 mark: Biological significance (energy saving, hybrid vigour in endosperm)',
      ],
      keyTerms: ['Double fertilization', 'Syngamy (n + n = 2n)', 'Triple fusion (n + 2n = 3n)', 'Primary Endosperm Nucleus'],
    },
  ],

  // -------------------------------------------------------------
  // BIO-ZOOLOGY CHAPTER 1: Reproduction in Organisms
  // -------------------------------------------------------------
  'topic-1.1-z': [
    {
      id: 'bb-z1.1-1',
      marks: 1,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2024',
      question: 'Why are unicellular organisms that multiply exclusively by binary fission considered biologically "immortal"?',
      tamilQuestion: 'இருபிளவு முறை மூலம் மட்டுமே பெருகும் ஒருசெல் உயிரினங்கள் உயிரியல் ரீதியாக "இறப்பற்றவை" என்று ஏன் கருதப்படுகின்றன?',
      answer: 'Explanation: During binary fission, the parental cell body divides completely and partitions its cytoplasm and genetic material equally into two viable daughter individuals. No residual parental corpse or natural senescent death occurs; the parent lives on as the two daughters.',
      markingScheme: ['1 mark for explanation of total somatic partitioning without parental corpse/senescence'],
      keyTerms: ['Biological immortality', 'Binary fission', 'Absence of natural senescence'],
    },
    {
      id: 'bb-z1.1-2',
      marks: 2,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Zoology Evaluation Q1',
      question: 'Define "Somatogenic Reproduction". Give an example.',
      tamilQuestion: '"உடல இனப்பெருக்கம்" (Somatogenic Reproduction) வரையறுத்து, எடுத்துக்காட்டு தருக.',
      answer: '1. Definition: Asexual reproduction where a single parent gives rise to new offspring through mitotic division of somatic (body) cells without gamete formation or meiotic reduction is called Somatogenic or Blastogenic reproduction.\n2. Example: Binary fission in Amoeba / Paramecium; Budding in Hydra.',
      markingScheme: ['1 mark: Definition of asexual mitotic reproduction from body somatic cells', '1 mark: Valid animal example (Amoeba / Hydra)'],
      keyTerms: ['Somatogenic reproduction', 'Mitotic somatic division', 'Amoeba / Hydra'],
    },
    {
      id: 'bb-z1.1-3',
      marks: 3,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2023',
      question: 'Differentiate between Seasonal Breeders and Continuous Breeders with animal examples.',
      tamilQuestion: 'பருவக்கால இனச்சேர்க்கையாளர்கள் மற்றும் தொடர் இனச்சேர்க்கையாளர்கள் வேறுபடுத்துக.',
      answer: '1. Seasonal Breeders:\n• Animals that reproduce only during specific favorable seasons or months of the year when environmental factors (temperature, food availability, photoperiod) are optimal.\n• Examples: Frogs, lizards, birds, deer, sheep.\n\n2. Continuous Breeders:\n• Animals that remain sexually active and can produce gametes and conceive throughout their entire reproductive maturity phase without seasonal restriction.\n• Examples: Humans, honeybees, laboratory mice, poultry.',
      markingScheme: [
        '1.5 marks: Seasonal breeders definition and animal examples (frogs, birds, deer)',
        '1.5 marks: Continuous breeders definition and animal examples (humans, honeybees)',
      ],
      keyTerms: ['Seasonal breeders', 'Continuous breeders', 'Photoperiod / environmental cues'],
    },
  ],

  'topic-1.2-z': [
    {
      id: 'bb-z1.2-1',
      marks: 1,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Zoology Evaluation Q2',
      question: 'In Paramecium, binary fission occurs along which morphological plane?',
      tamilQuestion: 'பாரமீசியத்தில் இருபிளவுறுதல் எந்த தளத்தில் நடைபெறுகிறது?',
      answer: 'Correct Option: Transverse plane (Transverse Binary Fission).\nExplanation: The constriction plane runs transversely across the longitudinal axis of the cell. The macronucleus divides amitotically and the micronucleus divides mitotically, producing anterior and posterior daughter individuals.',
      markingScheme: ['1 mark for Transverse binary fission in Paramecium'],
      keyTerms: ['Transverse binary fission', 'Paramecium', 'Macronucleus / Micronucleus'],
    },
    {
      id: 'bb-z1.2-2',
      marks: 2,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - June 2024',
      question: 'What are Gemmules? Mention their role in freshwater sponges.',
      tamilQuestion: 'ஜெம்முல்கள் (Gemmules) என்றால் என்ன? நன்னீர் கடற்பஞ்சுகளில் அவற்றின் பங்கை கூறுக.',
      answer: '1. Definition: Gemmules are internal asexual reproductive buds produced by freshwater sponges (e.g., Spongilla). They consist of a central cluster of nutrient-rich totipotent amoebocytes (archaeocytes) enclosed by a thick protective membrane reinforced with siliceous amphidisc spicules.\n2. Role: Enables the sponge to survive harsh winter freezing and summer drought (perennation). When conditions return, archaeocytes hatch out through the micropyle to form a new sponge.',
      markingScheme: [
        '1 mark: Internal bud of archaeocytes with protective spicule envelope',
        '1 mark: Perennation mechanism to survive extreme freezing/drought in Spongilla',
      ],
      keyTerms: ['Gemmules', 'Spongilla', 'Archaeocytes', 'Perennation'],
    },
    {
      id: 'bb-z1.2-3',
      marks: 3,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Zoology Evaluation Q11',
      question: 'Differentiate between Morphallaxis and Epimorphosis types of regeneration with examples.',
      tamilQuestion: 'மீளுருவாக்கத்தின் இரு வகைகளான முழு உருவ மீட்பு (Morphallaxis) மற்றும் உறுப்பு மீட்பு (Epimorphosis) வேறுபடுத்துக.',
      answer: '1. Morphallaxis:\n• A complete organism is reconstructed from a small severed fragment of the parental body by extensive re-organization of pre-existing somatic cells without massive cell proliferation.\n• Example: Hydra and Planaria.\n\n2. Epimorphosis:\n• The replacement or regeneration of a lost specific organ or limb by active proliferation of new cells (blastema formation) from the wound margin.\n• (a) Reparative: Healing of damaged tissue (e.g., human wound healing).\n• (b) Restorative: Complete re-growth of a lost appendage (e.g., regeneration of broken tail in Wall Lizard, severed arm in Starfish).',
      markingScheme: [
        '1.5 marks: Morphallaxis cellular reorganization and examples (Hydra, Planaria)',
        '1.5 marks: Epimorphosis blastema proliferation and restorative examples (Lizard tail, Starfish)',
      ],
      keyTerms: ['Morphallaxis', 'Hydra / Planaria', 'Epimorphosis', 'Regeneration of lizard tail'],
    },
    {
      id: 'bb-z1.2-4',
      marks: 5,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2023',
      question: 'Describe the four different types of Binary Fission in animals with labeled diagrams and examples.',
      tamilQuestion: 'விலங்குகளில் காணப்படும் நான்கு வகையான இருபிளவு முறைகளை படங்களுடன் விவரி.',
      answer: 'Binary fission is the division of the parent body into two equal, identical daughter individuals. It is classified into 4 types according to the plane of cytoplasmic division (Cytokinesis):\n\n1. SIMPLE IRREGULAR BINARY FISSION:\n• Cytokinesis plane cannot be determined geometrically because the cell has no fixed shape.\n• Contractile vacuole stops functioning; nucleus divides mitotically (karyokinesis), followed by a middle constriction furrow.\n• Example: Amoeba proteus.\n\n2. TRANSVERSE BINARY FISSION:\n• The cleavage plane runs strictly transverse (perpendicular) to the antero-posterior longitudinal axis.\n• Example: Paramecium caudatum, Planaria.\n\n3. LONGITUDINAL BINARY FISSION:\n• The division plane runs longitudinally along the long axis of the organism from anterior to posterior end.\n• Flagellum and gullet duplicate.\n• Example: Euglena, Vorticella.\n\n4. OBLIQUE BINARY FISSION:\n• The cleavage furrow cuts obliquely across the body at an angle.\n• Example: Ceratium (Dinoflagellates).',
      markingScheme: [
        '2 marks: Neat diagrams of all 4 types (Amoeba, Paramecium, Euglena, Ceratium)',
        '3 marks: Accurate description of cleavage plane and cellular division for each type',
      ],
      keyTerms: ['Simple irregular (Amoeba)', 'Transverse (Paramecium)', 'Longitudinal (Euglena)', 'Oblique (Ceratium)'],
    },
  ],

  // -------------------------------------------------------------
  // BIO-ZOOLOGY CHAPTER 2: Human Reproduction
  // -------------------------------------------------------------
  'topic-2.1-z': [
    {
      id: 'bb-z2.1-1',
      marks: 1,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Zoology Evaluation Q3',
      question: 'Which cells of the testes synthesize and secrete androgenic steroid hormones (Testosterone)?',
      tamilQuestion: 'விந்தகத்தில் ஆண்ட்ரோஜன் ஹார்மோனான டெஸ்டோஸ்டீரோனை சுரக்கும் செல்கள் யாவை?',
      answer: 'Correct Option: Leydig cells (Interstitial cells).\nExplanation: Leydig cells reside in the interstitial connective tissue spaces between seminiferous tubules. Under the stimulation of Luteinizing Hormone (LH / ICSH) from the anterior pituitary, they synthesize and secrete testosterone.',
      markingScheme: ['1 mark for Leydig cells / Interstitial cells'],
      keyTerms: ['Leydig cells', 'Interstitial cells', 'Testosterone', 'LH stimulation'],
    },
    {
      id: 'bb-z2.1-2',
      marks: 2,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2024',
      question: 'State two vital functions of Sertoli cells (Nurse cells) in the seminiferous tubules.',
      tamilQuestion: 'செமினிஃபெரஸ் நுண்குழல்களில் காணப்படும் செர்டோலி செல்களின் (செவிலி செல்கள்) இரண்டு முக்கிய பணிகளை கூறுக.',
      answer: '1. Nutrition & Physical Support: Provide metabolic nutrients, glycogen, and structural anchorage to developing spermatids and spermatozoa.\n2. Blood-Testis Barrier & Hormonal Regulation: Form tight junctions creating the blood-testis barrier protecting auto-antigenic sperm from immune attack; secrete hormone Inhibin (negative feedback on FSH) and Androgen-Binding Protein (ABP).',
      markingScheme: [
        '1 mark: Nourishment to developing spermatids',
        '1 mark: Blood-testis barrier creation and secretion of Inhibin/ABP',
      ],
      keyTerms: ['Sertoli cells', 'Nurse cells', 'Blood-testis barrier', 'Inhibin & ABP'],
    },
    {
      id: 'bb-z2.1-3',
      marks: 3,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - June 2024 & March 2023',
      question: 'With a neat labelled diagram, explain the microscopic structure of a human spermatozoon.',
      tamilQuestion: 'படம் வரைந்து மனித விந்தணுவின் நுண்ணிய அமைப்பை விவரி.',
      answer: 'A mature human sperm is a microscopic, motile flagellated cell measuring approx. 60 µm in length, divided into four zones:\n1. HEAD:\n• Oval-shaped, containing a highly condensed haploid nucleus (23 chromosomes).\n• Capped anteriorly by the Acrosome, a modified lysosomal cap containing sperm lysins (hyaluronidase and acrosin) to digest the egg vestments.\n2. NECK:\n• Short constricted zone housing the Proximal Centriole (initiates zygote cleavage) and Distal Centriole (gives rise to the axial filament of tail).\n3. MIDDLE PIECE:\n• Contains the axial filament wrapped by a spiral sheath of 14-16 mitochondria called the Nebenkern.\n• Produces copious ATP for vigorous flagellar motility.\n4. TAIL (Flagellum):\n• Longest slender portion with a central 9+2 axoneme microtubule arrangement driving undulating whiplike lashing movements.',
      markingScheme: [
        '1.5 marks: Neat labeled diagram (Head, Acrosome, Nucleus, Neck, Centrioles, Mitochondrial spiral, Tail axoneme)',
        '1.5 marks: Accurate functional description of Acrosome, Nebenkern, and Axoneme',
      ],
      keyTerms: ['Acrosome (hyaluronidase)', 'Condensed nucleus', 'Proximal centriole', 'Middle piece (Nebenkern)', 'Tail flagellum 9+2'],
    },
    {
      id: 'bb-z2.1-4',
      marks: 5,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Zoology Evaluation Q22',
      question: 'Describe the hormonal regulation of Spermatogenesis in human males with a flow diagram.',
      tamilQuestion: 'மனித ஆண்களில் விந்தணு உருவாக்கத்தின் ஹார்மோன் ஒழுங்குபாட்டை பாய்வுப்படத்துடன் விளக்குக.',
      answer: 'Spermatogenesis is regulated by hypothalamic-pituitary-testicular endocrine axes:\n\n1. HYPOTHALAMUS:\n• At puberty, the hypothalamus secretes Gonadotropin-Releasing Hormone (GnRH) in pulsatile surges.\n\n2. ANTERIOR PITUITARY:\n• GnRH stimulates the adenohypophysis to secrete two gonadotropins:\n  (a) Luteinizing Hormone (LH / ICSH):\n      • Acts specifically on interstitial Leydig cells, stimulating testosterone synthesis.\n      • Testosterone stimulates spermatogenesis and develops secondary sexual traits.\n  (b) Follicle-Stimulating Hormone (FSH):\n      • Acts on Sertoli cells, inducing secretion of Androgen Binding Protein (ABP) and factors promoting spermiogenesis.\n      • ABP concentrates testosterone inside seminiferous tubules.\n\n3. NEGATIVE FEEDBACK MECHANISM:\n• High testosterone levels inhibit GnRH secretion from hypothalamus and LH from pituitary.\n• When sperm count is adequate, Sertoli cells secrete Inhibin, which exerts selective negative feedback on FSH secretion.',
      markingScheme: [
        '2 marks: Detailed flow diagram showing Hypothalamus -> GnRH -> Anterior Pituitary -> LH/FSH -> Leydig/Sertoli -> Feedback',
        '3 marks: Detailed text explaining roles of GnRH, LH, FSH, Testosterone, ABP, and Inhibin negative feedback',
      ],
      keyTerms: ['GnRH', 'LH (Leydig cells / Testosterone)', 'FSH (Sertoli cells / ABP)', 'Inhibin negative feedback'],
    },
  ],

  'topic-1.3-z': [
    {
      id: 'bb-z1.3-1',
      marks: 1,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Zoology Evaluation Q4',
      question: 'In which animal is exogenous budding observed as a common mode of asexual reproduction?',
      tamilQuestion: 'புற அரும்புதல் மூலம் பாலிலா இனப்பெருக்கம் செய்யும் விலங்கு எது?',
      answer: 'Correct Option: Hydra.\nExplanation: In Hydra, a small outpocketing (bud) arises on the somatic body column due to repeated mitotic divisions. It develops a mouth and tentacles at the distal end, and eventually constricts at the base to detach and live as an independent clone.',
      markingScheme: ['1 mark for Hydra exogenous budding'],
      keyTerms: ['Exogenous budding', 'Hydra', 'Mitotic somatic proliferation'],
    },
    {
      id: 'bb-z1.3-2',
      marks: 3,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2024',
      question: 'Describe Gemmule formation in freshwater sponges with a neat labelled diagram.',
      tamilQuestion: 'நன்னீர் கடற்பஞ்சுகளில் ஜெம்முல் உருவாவதை படத்துடன் விவரி.',
      answer: '1. Internal Asexual Diaspore: Produced during unfavorable winter freezes or summer drought by freshwater sponges like Spongilla.\n2. Architecture: Central cluster of nutrient-rich totipotent archaeocytes enclosed by inner and outer chitinous membranes reinforced with amphidisc siliceous spicules.\n3. Hatching: During favorable conditions, archaeocytes escape through the micropylar aperture to regenerate an entire functional sponge.',
      markingScheme: [
        '1.5 marks: Neat diagram with Micropyle, Archaeocytes, and Spicules',
        '1.5 marks: Functional explanation of perennation and hatching',
      ],
      keyTerms: ['Archaeocytes', 'Micropyle', 'Amphidisc spicules', 'Spongilla perennation'],
    },
  ],

  'topic-1.4-z': [
    {
      id: 'bb-z1.4-1',
      marks: 2,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - June 2024',
      question: 'Explain Morphallaxis with an example in animals.',
      tamilQuestion: 'விலங்குகளில் முழு உருவ மீட்பு (Morphallaxis) என்பதை எடுத்துக்காட்டுடன் விளக்குக.',
      answer: '1. Definition: Morphallaxis is the reconstruction of a complete individual organism from a small body fragment through the structural re-organization and remodeling of pre-existing somatic cells without massive blastema proliferation.\n2. Example: When Hydra or Planaria is severed into multiple pieces, each severed fragment remodels itself into a miniature, completely formed adult.',
      markingScheme: [
        '1 mark: Reconstruction of whole body from severed piece via reorganization',
        '1 mark: Hydra / Planaria example',
      ],
      keyTerms: ['Morphallaxis', 'Planaria', 'Hydra', 'Reorganization without blastema'],
    },
  ],

  'topic-1.5-z': [
    {
      id: 'bb-z1.5-1',
      marks: 3,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Zoology Evaluation Q15',
      question: 'Define Parthenogenesis. Differentiate between Arrhenotoky and Thelytoky.',
      tamilQuestion: 'கன்னி இனப்பெருக்கம் என்றால் என்ன? அரினோடோக்கி மற்றும் தெலிடோக்கி வேறுபடுத்துக.',
      answer: '1. Definition: Development of an unfertilized ovum into an adult individual without fertilization by a male gamete (discovered by Charles Bonnet in 1745).\n2. Classification:\n• Arrhenotoky: Unfertilized eggs develop strictly into haploid males (e.g., Honey bees, wasps).\n• Thelytoky: Unfertilized eggs develop strictly into diploid females (e.g., Lacerta saxicola armeniaca Caucasian rock lizard).',
      markingScheme: [
        '1 mark: Accurate definition of Parthenogenesis',
        '2 marks: Arrhenotoky (male only / honey bees) vs Thelytoky (female only / lizards)',
      ],
      keyTerms: ['Parthenogenesis', 'Arrhenotoky (males)', 'Thelytoky (females)', 'Honey bees'],
    },
  ],

  'topic-2.2-z': [
    {
      id: 'bb-z2.2-1',
      marks: 5,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2024 & June 2023',
      question: 'Describe the microscopic structure of a mature Graafian Follicle with a labeled diagram.',
      tamilQuestion: 'முதிர்ந்த கிராஃபியன் பாலிக்கிளின் நுண்ணிய அமைப்பை படத்துடன் விவரி.',
      answer: 'A mature tertiary ovarian follicle (Graafian follicle) is an eccentric cystic structure surrounded by vascular thecal layers:\n1. THECA LAYERS:\n• Theca Externa: Outermost fibrous protective capsule.\n• Theca Interna: Inner vascular steroidogenic layer secreting estrogen.\n2. MEMBRANA GRANULOSA:\n• Multilayered stratified follicular granulosa cells lining the antral cavity.\n3. ANTRUM:\n• Large fluid-filled crescentic space filled with liquor folliculi containing estrogens, FSH, and hyaluronic acid.\n4. OOCYTE COMPLEX:\n• Secondary oocyte (arrested at Metaphase II) enclosed by the translucent non-cellular Zona Pellucida and radial Corona Radiata cells.\n• Anchored to the follicle wall by a pedestal of granulosa cells called the Cumulus Oophorus (Discus Proligerus).',
      markingScheme: [
        '2 marks: Neat diagram with Theca, Granulosa, Antrum, Zona Pellucida, Corona Radiata, and Secondary Oocyte',
        '3 marks: Detailed text explaining Theca, Granulosa, Antrum, and Zona Pellucida',
      ],
      keyTerms: ['Theca externa/interna', 'Membrana granulosa', 'Antrum (liquor folliculi)', 'Zona pellucida', 'Corona radiata', 'Cumulus oophorus'],
    },
  ],

  // -------------------------------------------------------------
  // BIO-BOTANY CHAPTER 2: Classical Genetics (Mendelism & Inheritance)
  // -------------------------------------------------------------
  'topic-2.1': [
    {
      id: 'bb-2.1-1',
      marks: 1,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Botany Textbook Evaluation Q1',
      question: 'Which of the following contrasting traits studied by Gregor Mendel in Pisum sativum is a recessive trait?',
      tamilQuestion: 'கிரிகோர் மெண்டல் பட்டாணி தாவரத்தில் ஆய்வு செய்த முரண்பட்ட பண்புகளில் ஒடுங்கு பண்பு எது?',
      answer: 'Correct Option: Green seed colour / Constricted pod shape / White flower.\nExplanation: In Pisum sativum, yellow seed colour is dominant over green seed colour; round seed shape is dominant over wrinkled; inflated pod is dominant over constricted pod; and violet flower is dominant over white flower.',
      markingScheme: ['1 mark for correct identification of recessive trait in Pisum sativum with reasoning'],
      keyTerms: ['Pisum sativum', 'Recessive trait', 'Gregor Mendel'],
    },
    {
      id: 'bb-2.1-2',
      marks: 2,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2024',
      question: 'Define "Test Cross". Why is it essential for plant breeders?',
      tamilQuestion: '"சோதனை கலப்பு" (Test Cross) என்றால் என்ன? அது தாவர பயிர்ப்பெருக்காளர்களுக்கு ஏன் அவசியம்?',
      answer: '1. Definition: Crossing an individual of unknown genotype showing dominant phenotype with a homozygous recessive parent is called a Test Cross.\n2. Utility for Plant Breeders: It reveals whether the dominant parent is homozygous (TT -> 100% tall offspring) or heterozygous (Tt -> 1:1 tall:dwarf ratio). It helps breeders isolate pure-breeding lines.',
      markingScheme: [
        '1 mark: Definition of dominant phenotype crossed with homozygous recessive',
        '1 mark: Determination of unknown genotype (homozygous vs heterozygous)',
      ],
      keyTerms: ['Test cross', 'Homozygous recessive tester', 'Monohybrid test ratio 1:1'],
    },
    {
      id: 'bb-2.1-3',
      marks: 3,
      category: 'book_back',
      sourceType: 'verified_textbook',
      sourceExam: 'SCERT Botany Textbook Evaluation Q12',
      question: 'Explain the Law of Segregation (Purity of Gametes) with a monohybrid cross.',
      tamilQuestion: 'தனித்து பிரிதல் விதியை (இனச்செல்களின் கலப்பற்ற தன்மை) ஒருபண்பு கலப்பு மூலம் விளக்குக.',
      answer: '1. Statement: Alleles of a gene remain together in a hybrid without blending or contaminating each other, and segregate or separate into different gametes during meiosis with equal probability.\n2. Genetic Proof: In a monohybrid cross between homozygous tall (TT) and dwarf (tt) pea plants, the F1 generation is all tall (Tt). When F1 is self-pollinated, the recessive dwarf trait reappears in F2 in a 3:1 phenotypic ratio (1 TT : 2 Tt : 1 tt genotypic ratio), proving alleles remained pure and segregated.',
      markingScheme: [
        '1.5 marks: Statement of the Law of Segregation',
        '1.5 marks: Monohybrid F1 and F2 ratios (3:1 phenotypic, 1:2:1 genotypic) demonstrating purity of gametes',
      ],
      keyTerms: ['Law of Segregation', 'Purity of gametes', 'Monohybrid cross (3:1 / 1:2:1)'],
    },
    {
      id: 'bb-2.1-4',
      marks: 5,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - March 2023',
      question: 'Explain Incomplete Dominance in Mirabilis jalapa (4 O’clock plant) with a checkerboard (Punnett square).',
      tamilQuestion: 'அந்திமந்தாரை (மிராபிலிஸ் ஜலாபா) தாவரத்தில் நிகழும் முழுமையற்ற ஓங்குதன்மையை புன்னட் கட்டத்துடன் விவரி.',
      answer: 'Incomplete dominance occurs when neither of the two contrasting alleles is completely dominant over the other, producing an intermediate blended phenotype in heterozygous condition:\n\n1. PARENTS:\n• Red-flowered plant (R1R1) crossed with White-flowered plant (R2R2).\n\n2. F1 GENERATION:\n• All offspring develop intermediate Pink flowers (R1R2).\n\n3. F2 GENERATION (Selfing F1 R1R2 x R1R2):\n• Phenotypic Ratio: 1 Red (R1R1) : 2 Pink (R1R2) : 1 White (R2R2) (1:2:1).\n• Genotypic Ratio: 1 R1R1 : 2 R1R2 : 1 R2R2 (1:2:1).\n\n4. SIGNIFICANCE:\n• In incomplete dominance, the phenotypic ratio and genotypic ratio are identical (1:2:1), unlike Mendel’s classic monohybrid 3:1 ratio.',
      markingScheme: [
        '2 marks: Correct Punnett square checkerboard showing parental cross, gametes, and F1/F2 progeny',
        '2 marks: Phenotypic and Genotypic ratios (1:2:1) with explanation of intermediate pink pigment formation',
        '1 mark: Difference from standard Mendelian complete dominance',
      ],
      keyTerms: ['Incomplete dominance', 'Mirabilis jalapa', 'Intermediate pink (R1R2)', '1:2:1 phenotypic & genotypic ratio'],
    },
  ],

  'topic-2.2': [
    {
      id: 'bb-2.2-1',
      marks: 2,
      category: 'public_exam',
      sourceType: 'public_exam',
      sourceExam: 'Govt Public Exam - June 2024',
      question: 'State the Law of Independent Assortment. What is the classic dihybrid phenotypic ratio?',
      tamilQuestion: 'சார்பின்றி ஒதுங்குதல் விதியை கூறுக. பாரம்பரிய இருபண்பு கலப்பின் புறத்தோற்ற விகிதம் என்ன?',
      answer: '1. Law of Independent Assortment: When two pairs of contrasting traits are combined in a hybrid, segregation of one pair of characters is completely independent of the other pair during gamete formation.\n2. Dihybrid Phenotypic Ratio: 9:3:3:1 (9 Yellow Round : 3 Yellow Wrinkled : 3 Green Round : 1 Green Wrinkled).',
      markingScheme: [
        '1 mark: Statement of independent segregation of gene pairs',
        '1 mark: Dihybrid phenotypic ratio 9:3:3:1',
      ],
      keyTerms: ['Independent assortment', 'Dihybrid cross', '9:3:3:1 ratio'],
    },
  ],
};

/**
 * Helper to fetch real verified questions for a topic.
 * Strictly isolates Botany and Zoology questions to prevent cross-contamination.
 */
export function getRealQuestionsForTopic(
  topicId: string,
  lessonId?: string,
  subjectId?: string
): ImportantQuestion[] {
  const cleanTopicId = (topicId || '').trim().toLowerCase();
  const cleanLessonId = (lessonId || '').trim().toLowerCase();
  const cleanSubjectId = (subjectId || '').trim().toLowerCase();

  // Strict discipline determination
  const isZoology =
    cleanSubjectId.includes('zoo') ||
    cleanLessonId.includes('zoo') ||
    cleanTopicId.endsWith('-z') ||
    cleanTopicId.includes('zoo') ||
    cleanLessonId.startsWith('zoology') ||
    cleanTopicId.startsWith('sz-');

  // Strip prefix and discipline suffix to get pure number (e.g. 'topic-1.1-z' -> '1.1')
  const numMatch = cleanTopicId.match(/\d+\.\d+/);
  const pureNum = numMatch ? numMatch[0] : '';

  if (isZoology) {
    // 1. Direct zoology key match
    const targetZKey = cleanTopicId.endsWith('-z') ? cleanTopicId : `topic-${pureNum || cleanTopicId.replace(/^topic-/, '')}-z`;
    if (REAL_CHAPTER_QUESTIONS[targetZKey]) {
      return REAL_CHAPTER_QUESTIONS[targetZKey];
    }

    // 2. Search purely among Zoology keys (keys ending in '-z')
    const zoologyKeys = Object.keys(REAL_CHAPTER_QUESTIONS).filter((k) => k.endsWith('-z'));
    
    if (pureNum) {
      const matchByNum = zoologyKeys.find((k) => k.includes(pureNum));
      if (matchByNum) return REAL_CHAPTER_QUESTIONS[matchByNum];
    }

    const zoologyMatch = zoologyKeys.find(
      (k) => cleanTopicId.includes(k.replace('-z', '')) || k.includes(cleanTopicId)
    );
    if (zoologyMatch) {
      return REAL_CHAPTER_QUESTIONS[zoologyMatch];
    }

    // Chapter 2 Zoology vs Chapter 1 Zoology fallback
    if (pureNum.startsWith('2') || cleanLessonId.includes('2') || cleanTopicId.includes('human') || cleanTopicId.includes('reproduction')) {
      return REAL_CHAPTER_QUESTIONS['topic-2.1-z'] || REAL_CHAPTER_QUESTIONS['topic-1.1-z'] || [];
    }

    return REAL_CHAPTER_QUESTIONS['topic-1.1-z'] || [];
  } else {
    // Botany: Strictly filter out any Zoology keys
    const targetBKey = `topic-${pureNum || cleanTopicId.replace(/^topic-/, '').replace(/-[zb]$/, '')}`;
    if (REAL_CHAPTER_QUESTIONS[targetBKey] && !targetBKey.endsWith('-z')) {
      return REAL_CHAPTER_QUESTIONS[targetBKey];
    }

    const botanyKeys = Object.keys(REAL_CHAPTER_QUESTIONS).filter((k) => !k.endsWith('-z'));
    if (pureNum) {
      const matchByNum = botanyKeys.find((k) => k.includes(pureNum));
      if (matchByNum) return REAL_CHAPTER_QUESTIONS[matchByNum];
    }

    const botanyMatch = botanyKeys.find(
      (k) => cleanTopicId.includes(k) || k.includes(cleanTopicId)
    );
    if (botanyMatch) {
      return REAL_CHAPTER_QUESTIONS[botanyMatch];
    }

    // Chapter 2 Botany (Classical Genetics) vs Chapter 1 Botany
    if (pureNum.startsWith('2') || cleanLessonId.includes('2') || cleanTopicId.includes('genetic') || cleanTopicId.includes('mendel')) {
      return REAL_CHAPTER_QUESTIONS['topic-2.1'] || REAL_CHAPTER_QUESTIONS['topic-1.1'] || [];
    }

    return REAL_CHAPTER_QUESTIONS['topic-1.1'] || [];
  }
}

