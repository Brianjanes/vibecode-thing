import { Card } from "@/types/mtg";

interface DeckCard {
  card: Card;
  quantity: number;
  isSideboard: boolean;
}

export const calculateAverageMV = (cards: DeckCard[]): number => {
  const totalCards = cards.reduce((sum, { quantity }) => sum + quantity, 0);
  const totalMV = cards.reduce(
    (sum, { card, quantity }) => sum + card.cmc * quantity,
    0
  );
  return totalCards > 0 ? Number((totalMV / totalCards).toFixed(2)) : 0;
};

export const calculateColorDistribution = (
  cards: DeckCard[]
): Record<string, number> => {
  const distribution: Record<string, number> = {};
  const colors = ["W", "U", "B", "R", "G", "C"];

  colors.forEach((color) => {
    distribution[color] = cards.reduce(
      (sum, { card, quantity }) =>
        sum + (card.colors?.includes(color) ? quantity : 0),
      0
    );
  });

  return distribution;
};

export const countCardsByType = (cards: DeckCard[], type: string): number => {
  return cards.reduce(
    (sum, { card, quantity }) =>
      sum + (card.type_line.includes(type) ? quantity : 0),
    0
  );
};
