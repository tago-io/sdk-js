import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import Connectors from "./Integration.Connectors";
import Networks from "./Integration.Networks";

class Integration extends TagoIOModule<GenericModuleParams> {
  public connectors = new Connectors(this.params);

  public networks = new Networks(this.params);
}

export default Integration;
