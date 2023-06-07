import { GenericID } from "../../common/common.types";

interface ExploreInfo {
  id: GenericID;
  name: string;
  desc_full: string;
  desc_short: string;
  main_image: string;
  visible: true;
  tags: string[];
  dashboard_id: GenericID;
  company: {
    name: string;
    website: string;
    logo_url: string;
  };
  alreadyInstalled: boolean;
}

export { ExploreInfo };
