import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Life-Track',
    short_name: 'Life-Track',
    description: 'Gestion financière intelligente',
    start_url: '/dashboard',
    display: 'standalone', // Supprime la barre d'adresse
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-512.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}