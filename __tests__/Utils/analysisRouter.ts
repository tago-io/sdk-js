import type { Data } from "../../src/common/common.types.ts";
import { Account, Device } from "../../src/modules.ts";
import AnalysisRouter, { type RouterConstructor } from "../../src/modules/Utils/router/router.ts";
import type { DeviceListScope } from "../../src/modules/Utils/router/router.types.ts";

const func = async () => {
  return true;
};

const params: RouterConstructor = {
  environment: {
    _action_when: "create",
    _widget_exec: "insert",
    _action_type: "resource",
  },
  scope: [],
  account: new Account({ token: "11a2ff6b-41bb-4290-45a1-6132a1114afd" }),
  config_dev: new Device({ token: "11a2ff6b-41bb-4290-45a1-6132a1114afd" }),
  context: { log: () => null, token: "", analysis_id: "", environment: [] },
};

describe("Analysis Router conditions", () => {
  test("All run tests with when conditions", async () => {
    const scope = [
      {
        variable: "test",
        value: 1,
        id: "",
        device: "",
        origin: "",
        time: new Date(),
        serie: "123",
      },
      { input_form_button_id: "122" },
      { device_list_button_id: "125" },
      { user_list_button_id: "123" },
    ];
    const router = new AnalysisRouter({ ...params, scope });

    router.register(func).whenVariableLike("est");
    router.register(func).whenVariables("test");
    router.register(func).whenVariables(["test"]);
    router.register(func).whenActionWhen("create");
    router.register(func).whenValues(1);
    router.register(func).whenValues([1]);
    router.register(func).whenSeries("123");
    router.register(func).whenSeries(["123"]);
    router.register(func).whenActionType("resource");
    router.register(func).whenWidgetExec("insert");
    router.register(func).whenEnv("_widget_exec", "insert");
    router.register(func).whenInputFormID("122");
    router.register(func).whenUserListIdentifier("123");
    router.register(func).whenDeviceListIdentifier("125");
    const execution = await router.exec();

    // @ts-ignore
    expect(execution.status).toBeTruthy();
    expect(execution.services).toEqual(Array(14).fill("func", 0));
  });

  test("All tests with when invalid conditions", async () => {
    const scope = [
      {
        variable: "test",
        value: 1,
        id: "",
        device: "",
        origin: "",
        time: new Date(),
        serie: "123",
      },
      { input_form_button_id: "122" },
      { device_list_button_id: "123" },
      { user_list_button_id: "125" },
    ];
    const router = new AnalysisRouter({ ...params, scope });

    router.register(func).whenVariableLike("ab");
    router.register(func).whenVariables("temp");
    router.register(func).whenVariables(["temp"]);
    router.register(func).whenActionWhen("delete");
    router.register(func).whenValues(2);
    router.register(func).whenValues([2]);
    router.register(func).whenSeries("333");
    router.register(func).whenSeries(["333"]);
    router.register(func).whenActionType("condition");
    router.register(func).whenWidgetExec("delete");
    router.register(func).whenEnv("_widget_exec", "delete");
    router.register(func).whenInputFormID("444");
    router.register(func).whenUserListIdentifier("423");
    router.register(func).whenDeviceListIdentifier("425");
    const execution = await router.exec();

    // @ts-ignore
    expect(execution.status).toBeFalsy();
    expect(execution.services).toEqual([]);
  });
});

describe("Analysis Router conditions", () => {
  test("Receive data scope in the function", async () => {
    const scope = [
      {
        variable: "test",
        value: 1,
        id: "",
        device: "",
        origin: "",
        time: new Date(),
        group: "123",
      },
      { input_form_button_id: "122", device: "" },
    ];

    const func2 = ({ scope: testScope }: RouterConstructor & { scope: Data[] }) => {
      expect(testScope).toStrictEqual(scope);
    };

    const router = new AnalysisRouter({ ...params, scope });
    router.register(func2).whenInputFormID("122");
    const execution = await router.exec();
    expect(execution.status).toBeTruthy();
  });

  test("Receive device scope in the function", async () => {
    const scope = [{ name: "test", "tags.user": "xxx", device: "1234", old: {} }];
    const environment = { _widget_exec: "122" };

    const func2 = ({ scope: testScope }: RouterConstructor & { scope: DeviceListScope[] }) => {
      expect(testScope).toStrictEqual(scope);
    };

    const router = new AnalysisRouter({ ...params, scope, environment });
    router.register(func2).whenDeviceListIdentifier("122");
    const execution = await router.exec();
    expect(execution.status).toBeTruthy();
  });
});
