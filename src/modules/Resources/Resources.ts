import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import Access from "./Access";
import Actions from "./Actions";
import Analyses from "./Analyses";
import Billing from "./Billing";
import Buckets from "./Buckets";
import Dashboards from "./Dashboards";
import Devices from "./Devices";
import Dictionaries from "./Dictionaries";
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
import Secrets from "./Secrets";

class Resources extends TagoIOModule<GenericModuleParams> {
  constructor(params?: GenericModuleParams) {
    super({ token: process.env.T_ANALYSIS_TOKEN, ...params });
  }

  public account = new Account(this.params);
  static get account() {
    return new this().account;
  }

  public actions = new Actions(this.params);
  static get actions() {
    return new this().actions;
  }

  public analysis = new Analyses(this.params);
  static get analysis() {
    return new this().analysis;
  }

  public buckets = new Buckets(this.params);
  static get buckets() {
    return new this().buckets;
  }

  public files = new Files(this.params);
  static get files() {
    return new this().files;
  }

  public dashboards = new Dashboards(this.params);
  static get dashboards() {
    return new this().dashboards;
  }

  public devices = new Devices(this.params);
  static get devices() {
    return new this().devices;
  }

  public dictionaries = new Dictionaries(this.params);
  static get dictionaries() {
    return new this().dictionaries;
  }

  public billing = new Billing(this.params);
  static get billing() {
    return new this().billing;
  }

  public notifications = new Notifications(this.params);
  static get notifications() {
    return new this().notifications;
  }

  public tags = new Tags(this.params);
  static get tags() {
    return new this().tags;
  }

  public paymentMethods = new PaymentMethods(this.params);
  static get paymentMethods() {
    return new this().paymentMethods;
  }

  public plan = new Plan(this.params);
  static get plan() {
    return new this().plan;
  }

  public paymentHistory = new PaymentHistory(this.params);
  static get paymentHistory() {
    return new this().paymentHistory;
  }

  public integration = new Integration(this.params);
  static get integration() {
    return new this().integration;
  }

  public template = new Template(this.params);
  static get template() {
    return new this().template;
  }

  public accessManagement = new Access(this.params);
  static get accessManagement() {
    return new this().accessManagement;
  }

  public run = new Run(this.params);
  static get run() {
    return new this().run;
  }

  public serviceAuthorization = new ServiceAuthorization(this.params);
  static get serviceAuthorization() {
    return new this().serviceAuthorization;
  }

  public profiles = new Profile(this.params);
  static get profiles() {
    return new this().profiles;
  }

  public tagocores = new TagoCores(this.params);
  static get tagocores() {
    return new this().tagocores;
  }

  public secrets = new Secrets(this.params);
  static get secrets() {
    return new this().secrets;
  }
}

export default Resources;
