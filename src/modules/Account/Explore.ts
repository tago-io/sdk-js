import { GenericID } from "../../common/common.types";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { ExploreInfo } from "./explore.types";

class Explore extends TagoIOModule<GenericModuleParams> {
  /**
   * Add item of explore in your account
   * @param exploreID Explore identification
   */
  public async addExplore(exploreID: GenericID): Promise<ExploreInfo[]> {
    const result = await this.doRequest<ExploreInfo[]>({
      path: `/explore/${exploreID}`,
      method: "POST",
    });

    return result;
  }

  /**
   * List explore items
   */
  public async list(): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/explore/`,
      method: "GET",
    });

    return result;
  }
}

export default Explore;
