export type MediaTile = {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string | null;
};

export type MediaWidgetProps = {
  tiles: MediaTile[] | undefined;
  isLoading: boolean;
};
