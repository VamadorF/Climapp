import { useQuery } from '@tanstack/react-query';
import { getForecast } from '@/features/weather/lib/openMeteo';
import type { SelectedLocation } from '@/features/weather/lib/types';

export function useForecast(location: SelectedLocation) {
  const query = useQuery({
    queryKey: ['forecast', location.latitude, location.longitude],
    queryFn: () => getForecast(location.latitude, location.longitude),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const error =
    query.error instanceof Error
      ? query.error.message
      : query.error
        ? 'No se pudo cargar el pronostico.'
        : null;

  return {
    forecast: query.data ?? null,
    loading: query.isLoading,
    fetching: query.isFetching,
    error,
    reload: query.refetch,
  };
}
