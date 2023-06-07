import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import Access from "./Access";
import Actions from "./Actions";
import Analyses from "./Analyses";
import Billing from "./Billing";
import Buckets from "./Buckets";
import Dashboards from "./Dashboards";
import Devices from "./Devices";
import Dictionaries from "./Dictionaries";
import Explore from "./Explore";
import Files from "./Files";
import Notifications from "./Notifications";
import PaymentHistory from "./PaymentHistory";
import PaymentMethods from "./PaymentMethods";
import Plan from "./Plan";
import Profile from "./Profile";
import Run from "./Run";
import ServiceAuthorization from "./ServiceAuthorization";
import Tags from "./Tags";
import Template from "./Template";
import Integration from "./Integration";
import TagoCores from "./TagoCores";
import Account from "./Account";

class Resources extends TagoIOModule<GenericModuleParams> {
  constructor(params?: GenericModuleParams) {
    super({ token: process.env.T_ANALYSIS_TOKEN, ...params });
  }

  public account = new Account(this.params);
  static account = new this().account;

  public actions = new Actions(this.params);
  static actions = new this().actions;

  public analysis = new Analyses(this.params);
  static analysis = new this().analysis;

  public buckets = new Buckets(this.params);
  static buckets = new this().buckets;

  public files = new Files(this.params);
  static files = new this().files;

  public dashboards = new Dashboards(this.params);
  static dashboards = new this().dashboards;

  public devices = new Devices(this.params);
  static devices = new this().devices;

  public dictionaries = new Dictionaries(this.params);
  static dictionaries = new this().dictionaries;

  public billing = new Billing(this.params);
  static billing = new this().billing;

  public notifications = new Notifications(this.params);
  static notifications = new this().notifications;

  public tags = new Tags(this.params);
  static tags = new this().tags;

  public paymentMethods = new PaymentMethods(this.params);
  static paymentMethods = new this().paymentMethods;

  public plan = new Plan(this.params);
  static plan = new this().plan;

  public paymentHistory = new PaymentHistory(this.params);
  static paymentHistory = new this().paymentHistory;

  public explore = new Explore(this.params);
  static explore = new this().explore;

  public integration = new Integration(this.params);
  static integration = new this().integration;

  public template = new Template(this.params);
  static template = new this().template;

  public accessManagement = new Access(this.params);
  static accessManagement = new this().accessManagement;

  public run = new Run(this.params);
  static run = new this().run;

  public serviceAuthorization = new ServiceAuthorization(this.params);
  static serviceAuthorization = new this().serviceAuthorization;

  public profiles = new Profile(this.params);
  static profiles = new this().profiles;

  public tagocores = new TagoCores(this.params);
  static tagocores = new this().tagocores;
}

export default Resources;
