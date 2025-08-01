import type { RouterConstructor } from "./router";

class RouterService {
  private serviceFunction: (...args: any[]) => any;
  private whenList: ((...args: any[]) => any)[] = [];
  constructor(service: (...args: any[]) => any) {
    this.serviceFunction = service;
  }

  private addFunc(func: (...args: any[]) => any) {
    this.whenList.push(func);
  }
  /**
   * Return true if specific variables are in the scope.
   * Information is available if Analysis is triggered by an widget or action.
   */
  public whenVariables(variable: string | string[]): RouterService {
    const variable_list = Array.isArray(variable) ? variable : [variable];
    this.addFunc((scope: any, _environment: any) => !!scope.find((x: any) => variable_list.includes(x?.variable)));
    return this;
  }

  /**
   * Return true if variable is included in any variable name in the scope.
   * Information is available if Analysis is triggered by an widget or action.
   */
  public whenVariableLike(variable: string): RouterService {
    this.addFunc((scope: any, _environment: any) => !!scope.find((x: any) => x?.variable?.includes(variable)));
    return this;
  }

  /**
   * Return true if value is present for any variable in the scope
   * Information is available if Analysis is triggered by an widget or action.
   */
  public whenValues(values: string | boolean | number | (string | boolean | number)[]): RouterService {
    const values_list = Array.isArray(values) ? values : [values];
    this.addFunc((scope: any, _environment: any) => !!scope.find((x: any) => values_list.includes(x?.value)));
    return this;
  }

  /**
   * Return true if serie is present for any variable in the scope
   * Information is available if Analysis is triggered by an widget or action.
   */
  public whenSeries(series: string | string[]): RouterService {
    const series_list = Array.isArray(series) ? series : [series];
    this.addFunc((scope: any, _environment: any) => !!scope.find((x: any) => series_list.includes(x?.serie)));
    return this;
  }

  /**
   * Return true if input form ID is the same
   * Information is available if Analysis is triggered by an input widget.
   */
  public whenInputFormID(id: string): RouterService {
    this.addFunc((scope: any, _environment: any) => !!scope.find((x: any) => x.input_form_button_id === id));
    return this;
  }

  /**
   * Return true if device list identifier ID is the same as sent by widget
   * Information is available if Analysis is triggered by an input widget.
   */
  public whenDeviceListIdentifier(btn_id: string): RouterService {
    this.addFunc(
      (scope: any, environment: any) =>
        environment._widget_exec === btn_id || !!scope.find((x: any) => x.device_list_button_id === btn_id)
    );
    return this;
  }

  /**
   * Return true if user list identifier ID is the same as sent by widget
   * Information is available if Analysis is triggered by an input widget.
   */
  public whenUserListIdentifier(btn_id: string): RouterService {
    this.addFunc(
      (scope: any, environment: any) =>
        environment._widget_exec === btn_id || !!scope.find((x: any) => x.user_list_button_id === btn_id)
    );
    return this;
  }

  /**
   * Return true if custom btn ID is the same as sent by widget.
   * Information is available if Analysis is triggered by an input widget.
   */
  public whenCustomBtnID(btn_id: string): RouterService {
    this.addFunc(
      (scope: any, environment: any) =>
        !!scope.find((x: any) => x.device_list_button_id === btn_id || x.user_list_button_id === btn_id) ||
        environment._widget_exec === btn_id // keep for legacy support
    );
    return this;
  }

  /**
   * Return true if a parameter key exists in the scope array
   * Useful to be used with Device List widget.
   */
  public whenParameterExists(parameter: string): RouterService {
    this.addFunc((scope: any, _environment: any) => !!scope.find((x: any) => parameter in x));
    return this;
  }

  /**
   * Return true if widget_exec is the same
   * Information is available if Analysis is triggered by an widget.
   */
  public whenWidgetExec(widget_exec: "insert" | "delete" | "edit"): RouterService {
    this.addFunc((_scope: any, environment: any) => environment._widget_exec === widget_exec);
    return this;
  }

  /**
   * Return true if action_when is the same
   * Information is available if Analysis is triggered by an action.
   */
  public whenActionWhen(action_when: "create" | "update" | "delete" | "mqtt_connect" | "mqtt_disconnect"): RouterService {
    this.addFunc((_scope: any, environment: any) => environment._action_when === action_when);
    return this;
  }

  /**
   * Return true if action_type is the same
   * Information is available if Analysis is triggered by an action.
   */
  public whenActionType(action_type: "resource" | "condition" | "delete"): RouterService {
    this.addFunc((_scope: any, environment: any) => environment._action_type === action_type);
    return this;
  }

  /**
   * Return true if input form ID is the same
   * Information is always available.
   */
  public whenEnv(key: string, value: string): RouterService {
    this.addFunc((_scope: any, environment: any) => environment[key] === value);
    return this;
  }

  /**
   * Start verifying if all when conditions are true.
   */
  public verifyConditionsTrue(scope: any, environment: any): boolean {
    for (const func of this.whenList) {
      const result = func(scope, environment);
      if (!result) {
        return false;
      }
    }

    return true;
  }

  /**
   *
   * @param router_params
   * @returns
   */
  public runService(router_params: RouterConstructor): void {
    return this.serviceFunction(router_params);
  }

  public getServiceName(): string {
    return this.serviceFunction.name;
  }
}

export default RouterService;
