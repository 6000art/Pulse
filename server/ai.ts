import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export async function generateOnboardingReply(history: { role: string; content: string }[], currentStep: number) {
  const ai = getAIClient();
  if (!ai) {
    return getFallbackOnboardingReply(currentStep, history);
  }

  try {
    const prompt = `Tu es le compagnon d'onboarding IA bienveillant et moderne de PULSE.
Marque : PULSE — "RESSENTEZ LA CONNEXION".
Mission : Connecter les gens à travers leur véritable énergie, des jeux multijoueurs et des expériences réelles plutôt que le swipe sans fin.
L'utilisateur est à l'étape ${currentStep} sur 6.

Historique de la conversation :
${history.map(h => `${h.role === 'assistant' ? 'IA' : 'Utilisateur'}: ${h.content}`).join('\n')}

Réponds toujours EN FRANÇAIS dans un ton chaleureux, naturel, bienveillant et complice.
Pose une question claire pour découvrir son authenticité (passions, jeux vidéo ou de société, intentions relationnelles, musique préférée, ambiance de week-end).
Ton message doit faire 2 à 3 phrases maximum.
Fournis 3 à 4 options de réponses courtes et naturelles adaptées à ta question.

Format de sortie strict en JSON :
{
  "message": "Texte de ta réponse ici en français",
  "suggestedReplies": ["Choix 1", "Choix 2", "Choix 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error('Erreur Gemini onboarding:', error);
    return getFallbackOnboardingReply(currentStep, history);
  }
}

function getFallbackOnboardingReply(step: number, history: any[]) {
  const replies = [
    {
      message: "Quel type de connexion souhaites-tu explorer en priorité sur PULSE ?",
      suggestedReplies: ["Étincelle amoureuse & dating", "Vraies amitiés sincères", "Partenaires de jeux vidéo/co-op", "Activités & sorties insolites", "Un peu de tout ça !"],
    },
    {
      message: "Superbe énergie ! Quand tu as du temps pour décompresser, quels jeux ou activités t'attirent le plus ?",
      suggestedReplies: ["Quiz & Blind tests musicaux", "Jeux de réflexion & Escape games", "Jeux de cartes & de plateau", "Concerts live & festivals", "Ateliers cuisine & gastronomie"],
    },
    {
      message: "J'adore ! Comment tes amis les plus proches décriraient-ils ton ambiance idéale le week-end ?",
      suggestedReplies: ["Oiseau de nuit dans des spots intimistes", "Aventurier(e) spontané(e)", "Discussions profondes autour d'un bon café", "Hôte de soirées jeux compétitives"],
    },
    {
      message: "Pour garantir la sécurité de notre communauté, confirme-nous que tu as bien 18 ans ou plus, et tes pronoms préférés.",
      suggestedReplies: ["18+ (iel/ille)", "18+ (elle)", "18+ (il)", "18+ (préfère ne pas préciser)"],
    },
    {
      message: "Presque terminé ! Quelle est la passion ou le sujet précis dont tu pourrais parler pendant des heures ?",
      suggestedReplies: ["Jeux indés & Sci-Fi", "Café de spécialité & torréfaction", "Musique électronique & vinyles", "Photographie & expos d'art"],
    },
  ];
  return replies[Math.min(step, replies.length - 1)];
}

export async function generateSynthesizedProfile(data: Record<string, any>) {
  const ai = getAIClient();
  const summaryContext = JSON.stringify(data);

  if (!ai) {
    return generateFallbackProfile(data);
  }

  try {
    const prompt = `Tu es l'architecte de profil IA de PULSE.
En te basant sur les réponses de l'utilisateur lors de l'onboarding :
${summaryContext}

Rédige TOUT EN FRANÇAIS un profil authentique, inspirant et sans clichés.
Inclus :
1. "bio": Une bio de 2-3 phrases captivante reflétant ses vraies réponses.
2. "tagline": Un slogan accrocheur de 4-6 mots.
3. "highlightTags": 4-6 tags de passions, musique ou gaming.
4. "recommendedGames": 3 jeux qui correspondent à son énergie (ex: "Quiz Alchimie Pulse", "Escape Vault Co-op", "Tu Préfères : Édition Nocturne", "Blind Test Musique Indé").
5. "recommendedActivities": 2 expériences partagées (ex: "Atelier Gnocchis Truffe & Dégustation", "Soirée Écoute Vinyles & Synthwave", "Session Escalade de Bloc").

Format JSON strict :
{
  "bio": "string",
  "tagline": "string",
  "highlightTags": ["tag1", "tag2"],
  "recommendedGames": ["game1", "game2", "game3"],
  "recommendedActivities": ["act1", "act2"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (err) {
    console.error('Échec génération profil Gemini:', err);
    return generateFallbackProfile(data);
  }
}

function generateFallbackProfile(data: any) {
  const interests = data.interests || ['Jeux Indés', 'Sessions Acoustiques', 'Cuisine'];
  return {
    bio: `Passionné(e) de ${interests.slice(0, 2).join(' & ')}, avec un goût prononcé pour les aventures spontanées et les soirées jeux collaboratives. Toujours partant(e) pour rencontrer des personnes authentiques et curieuses.`,
    tagline: `Explorer des mondes, une quête co-op à la fois.`,
    highlightTags: [...interests, 'Amateur de jeux', 'Esprit curieux'].slice(0, 5),
    recommendedGames: ['Quiz Alchimie Pulse', 'Tu Préfères : Piquant vs Profond', 'Blind Test Vinyles Indés'],
    recommendedActivities: ['Atelier Pizza Artisanale & Cocktails', 'Soirée Rooftop Synthwave'],
  };
}

export async function generateChemistryAnalysis(userA: any, userB: any) {
  const ai = getAIClient();

  if (!ai) {
    return {
      score: 91,
      headline: "Forte résonance créative et gaming",
      deepAnalysis: `${userA.firstName} et ${userB.firstName} partagent des intentions alignées et des passions communes pour le jeu et la découverte sociale. Vous vous épanouissez tous les deux dans le jeu collaboratif et les sorties authentiques.`,
      icebreaker: `Demande à ${userB.firstName} : "Si on était coincés dans un escape game à deux, tu décoderais les énigmes ou tu paniquerais avec style ?"`,
      sharedVibeCategories: ["Stratégie Co-op", "Vinyles Nocturnes", "Sorties Gourmandes"],
    };
  }

  try {
    const prompt = `Analyse l'alchimie sociale et amoureuse entre deux membres de PULSE.
Utilisateur 1: ${JSON.stringify(userA)}
Utilisateur 2: ${JSON.stringify(userB)}

Fournis TOUT EN FRANÇAIS une explication transparente et bienveillante de leur alchimie mutuelle.
Format JSON strict :
{
  "score": nombre entre 75 et 98,
  "headline": "Titre court et percutant",
  "deepAnalysis": "2 phrases expliquant pourquoi ils vibrent ensemble",
  "icebreaker": "Une phrase d'accroche spirituelle et personnalisée pour briser la glace",
  "sharedVibeCategories": ["string", "string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    return {
      score: 88,
      headline: "Synergie de jeu et curiosité partagée",
      deepAnalysis: `Vous partagez tous les deux une forte affinité pour les jeux sociaux dynamiques et les activités culturelles enrichissantes.`,
      icebreaker: `Demande à ${userB.firstName} quel est son jeu réconfortant ou son dessert favori du moment !`,
      sharedVibeCategories: ["Jeux Co-op", "Café & Vinyles", "Sorties Spontanées"],
    };
  }
}
