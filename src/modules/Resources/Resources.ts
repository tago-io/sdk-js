import TagoIOModule, { type GenericModuleParams } from "../../common/TagoIOModule";
import Access from "./Access";
import Account from "./Account";
import Actions from "./Actions";
import Analyses from "./Analyses";
import Billing from "./Billing";
import Buckets from "./Buckets";
import Dashboards from "./Dashboards";
import Devices from "./Devices";
import Dictionaries from "./Dictionaries";
import Entities from "./Entities";
import Files from "./Files";
import Integration from "./Integration";
import Notifications from "./Notifications";
import PaymentHistory from "./PaymentHistory";
import PaymentMethods from "./PaymentMethods";
import Plan from "./Plan";
import Profile from "./Profile";
import Run from "./Run";
import Secrets from "./Secrets";
import ServiceAuthorization from "./ServiceAuthorization";
import TagoCores from "./TagoCores";
import Tags from "./Tags";
import Template from "./Template";

class Resources extends TagoIOModule<GenericModuleParams> {
  constructor(params?: GenericModuleParams) {
    super({ token: process.env.T_ANALYSIS_TOKEN, ...params });
  }

  public account: Account = new Account(this.params);
  static get account(): Account {
    return new Resources().account;
  }

  public actions: Actions = new Actions(this.params);
  static get actions(): Actions {
    return new Resources().actions;
  }

  public analysis: Analyses = new Analyses(this.params);
  static get analysis(): Analyses {
    return new Resources().analysis;
  }

  public buckets: Buckets = new Buckets(this.params);
  static get buckets(): Buckets {
    return new Resources().buckets;
  }

  public files: Files = new Files(this.params);
  static get files(): Files {
    return new Resources().files;
  }

  public dashboards: Dashboards = new Dashboards(this.params);
  static get dashboards(): Dashboards {
    return new Resources().dashboards;
  }

  public devices: Devices = new Devices(this.params);
  static get devices(): Devices {
    return new Resources().devices;
  }

  public dictionaries: Dictionaries = new Dictionaries(this.params);
  static get dictionaries(): Dictionaries {
    return new Resources().dictionaries;
  }

  public billing: Billing = new Billing(this.params);
  static get billing(): Billing {
    return new Resources().billing;
  }

  public notifications: Notifications = new Notifications(this.params);
  static get notifications(): Notifications {
    return new Resources().notifications;
  }

  public tags: Tags = new Tags(this.params);
  static get tags(): Tags {
    return new Resources().tags;
  }

  public paymentMethods: PaymentMethods = new PaymentMethods(this.params);
  static get paymentMethods(): PaymentMethods {
    return new Resources().paymentMethods;
  }

  public plan: Plan = new Plan(this.params);
  static get plan(): Plan {
    return new Resources().plan;
  }

  public paymentHistory: PaymentHistory = new PaymentHistory(this.params);
  static get paymentHistory(): PaymentHistory {
    return new Resources().paymentHistory;
  }

  public integration: Integration = new Integration(this.params);
  static get integration(): Integration {
    return new Resources().integration;
  }

  public template: Template = new Template(this.params);
  static get template(): Template {
    return new Resources().template;
  }

  public accessManagement: Access = new Access(this.params);
  static get accessManagement(): Access {
    return new Resources().accessManagement;
  }

  public run: Run = new Run(this.params);
  static get run(): Run {
    return new Resources().run;
  }

  public serviceAuthorization: ServiceAuthorization = new ServiceAuthorization(this.params);
  static get serviceAuthorization(): ServiceAuthorization {
    return new Resources().serviceAuthorization;
  }

  public profiles: Profile = new Profile(this.params);
  static get profiles(): Profile {
    return new Resources().profiles;
  }

  public tagocores: TagoCores = new TagoCores(this.params);
  static get tagocores(): TagoCores {
    return new Resources().tagocores;
  }

  public secrets: Secrets = new Secrets(this.params);
  static get secrets(): Secrets {
    return new Resources().secrets;
  }

  public entities: Entities = new Entities(this.params);
  static get entities(): Entities {
    return new Resources().entities;
  }
}

export default Resources;
