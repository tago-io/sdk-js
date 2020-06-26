interface Metadata {
  [key: string]: string | number | boolean | Metadata;
}

interface Data {
  id?: string;
  variable: string;
  value?: string | number | boolean | void;
  location?: { lat: number; lng: number };
  metadata?: Metadata;
  origin: string;
  time: Date;
  created_at: Date;
}

interface TagsObj {
  [key: string]: string;
}

export { Data, TagsObj };
