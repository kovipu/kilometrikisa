import { format } from 'date-fns';
import fi from 'date-fns/locale/fi/index.js';

const formatDate = (date: number) => format(new Date(date), 'd. MMM', { locale: fi });

const formatTime = (dateTime: number) => format(new Date(dateTime), 'HH:mm');

const formatElapsedTime = (elapsedTime: number) => {
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime - hours * 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const formatSpeed = (speed: number) => `${Math.round(speed * 3.6)} km/h`;

const formatDistance = (distance: number): string => `${(distance / 1000).toFixed(1)} km`;

export { formatDate, formatTime, formatElapsedTime, formatSpeed, formatDistance };
