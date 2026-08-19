export interface Track {
  id: string;
  youtubeVideoId: string;
  title: string;
  artist: string;
  movieOrAlbum: string;
  year: number | string;
  era: '60s-70s' | '80s' | '90s' | '2000s' | 'Indie & Unplugged';
  category: string;
  channelId: string;
  duration?: string;
  language: string;
  mood: 'Romantic' | 'Nostalgic' | 'Soulful' | 'Rainy' | 'Upbeat' | 'Chill';
  description?: string;
}

export interface Channel {
  id: string;
  channelNumber: string;
  name: string;
  tagline: string;
  iconName: string;
  color: string;
  playlistId?: string;
}

export interface AmbiencePreset {
  id: 'rain' | 'vinyl' | 'fan' | 'crthum';
  name: string;
  icon: string;
  description: string;
}
