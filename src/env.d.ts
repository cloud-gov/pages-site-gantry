export interface MediaValueProps {
  id: number;
  altText: string;
  caption: string | null;
  _status: "published";
  reviewReady: boolean;
  prefix: string;
  updatedAt: string;
  createdAt: string;
  url: string;
  thumbnailURL: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
  site: {
    bucket: string;
  };
  sizes: {
    thumbnail: Record<string, any>;
    square: Record<string, any>;
    small: Record<string, any>;
    medium: Record<string, any>;
    large: Record<string, any>;
    xlarge: Record<string, any>;
    og: Record<string, any>;
  };
}

export interface CollectionCategoryProps {
  id: number;
  title: string;
  slug?: string | null;
  slugLock?: boolean;
  site: {
    bucket: string;
  };
  parent: CollectionCategoryProps | null;
  breadcrumbs?: {
    doc?: CollectionCategoryProps | null;
    url?: string | null;
    label?: string | null;
    id?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}
