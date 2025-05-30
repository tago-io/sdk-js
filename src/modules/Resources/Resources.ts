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

  public account = new Account(this.params);
  static get account() {
    return new Resources().account;
  }

  public actions = new Actions(this.params);
  static get actions() {
    return new Resources().actions;
  }

  public analysis = new Analyses(this.params);
  static get analysis() {
    return new Resources().analysis;
  }

  public buckets = new Buckets(this.params);
  static get buckets() {
    return new Resources().buckets;
  }

  public files = new Files(this.params);
  static get files() {
    return new Resources().files;
  }

  public dashboards = new Dashboards(this.params);
  static get dashboards() {
    return new Resources().dashboards;
  }

  public devices = new Devices(this.params);
  static get devices() {
    return new Resources().devices;
  }

  public dictionaries = new Dictionaries(this.params);
  static get dictionaries() {
    return new Resources().dictionaries;
  }

  public billing = new Billing(this.params);
  static get billing() {
    return new Resources().billing;
  }

  public notifications = new Notifications(this.params);
  static get notifications() {
    return new Resources().notifications;
  }

  public tags = new Tags(this.params);
  static get tags() {
    return new Resources().tags;
  }

  public paymentMethods = new PaymentMethods(this.params);
  static get paymentMethods() {
    return new Resources().paymentMethods;
  }

  public plan = new Plan(this.params);
  static get plan() {
    return new Resources().plan;
  }

  public paymentHistory = new PaymentHistory(this.params);
  static get paymentHistory() {
    return new Resources().paymentHistory;
  }

  public integration = new Integration(this.params);
  static get integration() {
    return new Resources().integration;
  }

  public template = new Template(this.params);
  static get template() {
    return new Resources().template;
  }

  public accessManagement = new Access(this.params);
  static get accessManagement() {
    return new Resources().accessManagement;
  }

  public run = new Run(this.params);
  static get run() {
    return new Resources().run;
  }

  public serviceAuthorization = new ServiceAuthorization(this.params);
  static get serviceAuthorization() {
    return new Resources().serviceAuthorization;
  }

  public profiles = new Profile(this.params);
  static get profiles() {
    return new Resources().profiles;
  }

  public tagocores = new TagoCores(this.params);
  static get tagocores() {
    return new Resources().tagocores;
  }

  public secrets = new Secrets(this.params);
  static get secrets() {
    return new Resources().secrets;
  }

  public entities = new Entities(this.params);
  static get entities() {
    return new Resources().entities;
  }
}

export default Resources;
