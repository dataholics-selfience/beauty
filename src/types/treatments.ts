export interface Treatment {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
}

export const TREATMENTS: Treatment[] = [
  {
    id: 'botox',
    name: 'Botox',
    description: 'Reduz linhas finas e rugas na testa e ao redor dos olhos',
    prompt: 'Reduce fine lines and wrinkles on forehead and around eyes, simulate botox treatment, natural skin texture, keep exact same identity and facial structure, photorealistic',
    icon: '💉'
  },
  {
    id: 'hyaluronic',
    name: 'Ácido Hialurônico',
    description: 'Aumenta volume labial e suaviza sulcos nasolabiais',
    prompt: 'Enhance lip volume slightly and smooth nasolabial folds, simulate hyaluronic acid filler, very natural and realistic, maintain same identity, no cartoon effect',
    icon: '💋'
  },
  {
    id: 'laser',
    name: 'Laser Lavieen',
    description: 'Uniformiza tom da pele e reduz pigmentação e melasma',
    prompt: 'Even out skin tone, reduce pigmentation and melasma, simulate Lavieen laser treatment, natural glow, preserve pores and skin texture, keep exact same identity',
    icon: '✨'
  },
  {
    id: 'collagen',
    name: 'Bioestimulador de Colágeno',
    description: 'Melhora elasticidade da pele e suaviza linhas finas',
    prompt: 'Improve skin elasticity, smooth static fine lines, simulate collagen biostimulator treatment, subtle and natural improvement, keep same face identity',
    icon: '🌟'
  }
];