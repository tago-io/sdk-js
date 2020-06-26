import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";
import Middlewares from "./Middlewares";
import Tags from "./Tags";

class Account extends TagoIOModule<GenericModuleParams> {
  get middlewares() {
    return new Middlewares(this.params);
  }

  get tags() {
    return new Tags(this.params);
  }
}

export default Account;
