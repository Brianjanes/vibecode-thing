export interface Card {
  id: string;
  name: string;
  lang: string;
  released_at: string;
  uri: string;
  scryfall_uri: string;
  layout: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  card_faces?: Array<{
    name: string;
    type_line?: string;
    oracle_text?: string;
    mana_cost?: string;
    colors?: string[];
    power?: string;
    toughness?: string;
    loyalty?: string;
    image_uris?: {
      small: string;
      normal: string;
      large: string;
      png: string;
      art_crop: string;
      border_crop: string;
    };
  }>;
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text: string;
  colors: string[];
  color_identity: string[];
  legalities: Record<string, string>;
  set: string;
  set_name: string;
  collector_number: string;
  rarity: string;
  prices: {
    usd?: string;
    usd_foil?: string;
    eur?: string;
    tix?: string;
  };
  power?: string;
  toughness?: string;
  loyalty?: string;
}

export interface DeckCard extends Card {
  quantity: number;
  isSideboard: boolean;
}

export interface Deck {
  id: string;
  name: string;
  format: string;
  cards: DeckCard[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
  };
}
