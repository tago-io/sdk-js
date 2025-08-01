import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule.ts";
import Connectors from "./Integration.Connectors";
import Networks from "./Integration.Networks";

class Integration extends TagoIOModule<GenericModuleParams> {
  public connectors: Connectors = new Connectors(this.params);

  public networks: Networks = new Networks(this.params);
}

export default Integration;
