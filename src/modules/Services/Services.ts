import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import ConsoleService from "./Console";

class Services extends TagoIOModule<GenericModuleParams> {
  get console() {
    return new ConsoleService(this.params);
  }
}

export default Services;
