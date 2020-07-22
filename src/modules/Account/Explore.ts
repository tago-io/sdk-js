import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
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

class Explore extends TagoIOModule<GenericModuleParams> {
  public async addExplore(exploreID: GenericID): Promise<ExploreInfo[]> {
    const result = await this.doRequest<ExploreInfo[]>({
      path: `/explore/${exploreID}`,
      method: "POST",
    });

    return result;
  }
  public async list(): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/explore/`,
      method: "GET",
    });

    return result;
  }
}

export default Explore;
