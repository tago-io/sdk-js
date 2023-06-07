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
  public actions = new Actions(this.params);
  /**
   * @deprecated moved to Resources.analysis
   */
  public analysis = new Analyses(this.params);
  /**
   * @deprecated moved to Resources.buckets
   */
  public buckets = new Buckets(this.params);
  /**
   * @deprecated moved to Resources.files
   */
  public files = new Files(this.params);
  /**
   * @deprecated moved to Resources.dashboards
   */
  public dashboards = new Dashboards(this.params);
  /**
   * @deprecated moved to Resources.devices
   */
  public devices = new Devices(this.params);
  /**
   * @deprecated moved to Resources.dictionaries
   */
  public dictionaries = new Dictionaries(this.params);
  /**
   * @deprecated moved to Resources.billing
   */
  public billing = new Billing(this.params);
  /**
   * @deprecated moved to Resources.notifications
   */
  public notifications = new Notifications(this.params);
  /**
   * @deprecated moved to Resources.tags
   */
  public tags = new Tags(this.params);
  /**
   * @deprecated moved to Resources.paymentMethods
   */
  public paymentMethods = new PaymentMethods(this.params);
  /**
   * @deprecated moved to Resources.plan
   */
  public plan = new Plan(this.params);
  /**
   * @deprecated moved to Resources.paymentHistory
   */
  public paymentHistory = new PaymentHistory(this.params);
  /**
   * @deprecated moved to Resources.integration
   */
  public integration = new Integration(this.params);
  /**
   * @deprecated moved to Resources.template
   */
  public template = new Template(this.params);
  /**
   * @deprecated moved to Resources.accessManagement
   */
  public accessManagement = new Access(this.params);
  /**
   * @deprecated moved to Resources.run
   */
  public run = new Run(this.params);
  /**
   * @deprecated moved to Resources.serviceAuthorization
   */
  public ServiceAuthorization = new ServiceAuthorization(this.params);
  /**
   * @deprecated moved to Resources.profiles
   */
  public profiles = new Profile(this.params);
  /**
   * @deprecated moved to Resources.tagocores
   */
  public tagocores = new TagoCores(this.params);
}

export default AccountDeprecated;
