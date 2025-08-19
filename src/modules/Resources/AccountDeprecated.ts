import Access from "./Access.ts";
import Account from "./Account.ts";
import Actions from "./Actions.ts";
import Analyses from "./Analyses.ts";
import Billing from "./Billing.ts";
import Buckets from "./Buckets.ts";
import Dashboards from "./Dashboards.ts";
import Devices from "./Devices.ts";
import Dictionaries from "./Dictionaries.ts";
import Files from "./Files.ts";
import Integration from "./Integration.ts";
import Notifications from "./Notifications.ts";
import PaymentHistory from "./PaymentHistory.ts";
import PaymentMethods from "./PaymentMethods.ts";
import Plan from "./Plan.ts";
import Profile from "./Profile.ts";
import Run from "./Run.ts";
import ServiceAuthorization from "./ServiceAuthorization.ts";
import TagoCores from "./TagoCores.ts";
import Tags from "./Tags.ts";
import Template from "./Template.ts";

/**
 * @internal
 * @deprecated Moved to Resources.account
 * * Resources.account.info(); Relies on Access Manage Permissions
 * * new Resources().account.info(); Relies on Access Manage Permissions
 * * new Resources({token: "TOKEN"}).account.info(); Relies on Analysis/Profile Token
 */
class AccountDeprecated extends Account {
  /**
   * @deprecated moved to Resources.actions
   */
  public actions: Actions = new Actions(this.params);
  /**
   * @deprecated moved to Resources.analysis
   */
  public analysis: Analyses = new Analyses(this.params);
  /**
   * @deprecated moved to Resources.buckets
   */
  public buckets: Buckets = new Buckets(this.params);
  /**
   * @deprecated moved to Resources.files
   */
  public files: Files = new Files(this.params);
  /**
   * @deprecated moved to Resources.dashboards
   */
  public dashboards: Dashboards = new Dashboards(this.params);
  /**
   * @deprecated moved to Resources.devices
   */
  public devices: Devices = new Devices(this.params);
  /**
   * @deprecated moved to Resources.dictionaries
   */
  public dictionaries: Dictionaries = new Dictionaries(this.params);
  /**
   * @deprecated moved to Resources.billing
   */
  public billing: Billing = new Billing(this.params);
  /**
   * @deprecated moved to Resources.notifications
   */
  public notifications: Notifications = new Notifications(this.params);
  /**
   * @deprecated moved to Resources.tags
   */
  public tags: Tags = new Tags(this.params);
  /**
   * @deprecated moved to Resources.paymentMethods
   */
  public paymentMethods: PaymentMethods = new PaymentMethods(this.params);
  /**
   * @deprecated moved to Resources.plan
   */
  public plan: Plan = new Plan(this.params);
  /**
   * @deprecated moved to Resources.paymentHistory
   */
  public paymentHistory: PaymentHistory = new PaymentHistory(this.params);
  /**
   * @deprecated moved to Resources.integration
   */
  public integration: Integration = new Integration(this.params);
  /**
   * @deprecated moved to Resources.template
   */
  public template: Template = new Template(this.params);
  /**
   * @deprecated moved to Resources.accessManagement
   */
  public accessManagement: Access = new Access(this.params);
  /**
   * @deprecated moved to Resources.run
   */
  public run: Run = new Run(this.params);
  /**
   * @deprecated moved to Resources.serviceAuthorization
   */
  public ServiceAuthorization: ServiceAuthorization = new ServiceAuthorization(this.params);
  /**
   * @deprecated moved to Resources.profiles
   */
  public profiles: Profile = new Profile(this.params);
  /**
   * @deprecated moved to Resources.tagocores
   */
  public tagocores: TagoCores = new TagoCores(this.params);
}

export default AccountDeprecated;
