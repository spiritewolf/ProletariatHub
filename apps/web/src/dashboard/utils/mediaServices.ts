export enum MediaServiceId {
  Plex = 'plex',
  Overseerr = 'overseerr',
  Navidrome = 'navidrome',
  Audiobookshelf = 'audiobookshelf',
}

export const MEDIA_SERVICE_DISPLAY_LABEL: Record<MediaServiceId, string> = {
  [MediaServiceId.Plex]: 'Plex',
  [MediaServiceId.Overseerr]: 'Overseerr',
  [MediaServiceId.Navidrome]: 'Navidrome',
  [MediaServiceId.Audiobookshelf]: 'Audiobookshelf',
};

export const MEDIA_SERVICE_ROW_ORDER: MediaServiceId[] = [
  MediaServiceId.Plex,
  MediaServiceId.Overseerr,
  MediaServiceId.Navidrome,
  MediaServiceId.Audiobookshelf,
];
