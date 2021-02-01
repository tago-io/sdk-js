import { GenericID, Query } from "../../common/common.types";

interface DictionaryCreateInfo {
  name: string;
  slug: string;
  fallback: string;
}

interface DictionaryInfo extends DictionaryCreateInfo {
  id: GenericID;
  languages: string[];
  created_at: Date;
  updated_at: Date;
}

interface LanguageData {
  [key: string]: string;
}

interface LanguageInfoQuery {
  fallback?: boolean;
}

type DictionaryQuery = Query<DictionaryInfo, "name" | "slug" | "languages" | "fallback" | "created_at" | "updated_at">;

export { DictionaryCreateInfo, DictionaryInfo, LanguageInfoQuery, DictionaryQuery, LanguageData };
