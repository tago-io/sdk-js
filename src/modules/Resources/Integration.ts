import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import Connectors from "./Integration.Connectors.ts";
import Networks from "./Integration.Networks.ts";

class Integration extends TagoIOModule<GenericModuleParams> {
  public connectors: Connectors = new Connectors(this.params);

  public networks: Networks = new Networks(this.params);
}

export default Integration;
