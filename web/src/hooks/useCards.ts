import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCard, listCards, saveCard, type Card } from '../api';
import { useAuth } from './useAuth';

export function useCards() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Cards belong to a user, so don't ask for them while signed out (the API answers 401).
  const cardsQuery = useQuery<Card[], Error>({
    queryKey: ['cards'],
    queryFn: listCards,
    enabled: isAuthenticated,
  });

  const saveMutation = useMutation({
    mutationFn: (senseId: string) => saveCard(senseId),
    onSuccess: () => {
      // Invalidate both cards list and dictionary results so '+' turns into '✓' immediately
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryClient.invalidateQueries({ queryKey: ['dictionary'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (cardId: string) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryClient.invalidateQueries({ queryKey: ['dictionary'] });
    },
  });

  return {
    cards: isAuthenticated ? (cardsQuery.data ?? []) : [],
    isLoading: cardsQuery.isLoading,
    isError: cardsQuery.isError,
    error: cardsQuery.error,
    saveCard: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    savingSenseId: saveMutation.variables,
    deleteCard: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deletingCardId: deleteMutation.variables,
  };
}
