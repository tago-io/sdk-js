import { Account, Device } from "../../src/modules";
import AnalysisRouter, { RouterConstructor } from "../../src/modules/Utils/router/router";

const func = async () => {
  return true;
};

const params: RouterConstructor = {
  environment: { _action_when: "create", _widget_exec: "insert", _action_type: "resource" },
  scope: [],
  account: new Account({ token: "11a2ff6b-41bb-4290-45a1-6132a1114afd" }),
  config_dev: new Device({ token: "11a2ff6b-41bb-4290-45a1-6132a1114afd" }),
  context: { log: () => null, token: "", analysis_id: "", environment: [] },
};

describe("Analysis Router conditions", () => {
  test("All run tests with when conditions", async () => {
    const scope = [
      { variable: "test", value: 1, origin: "", time: new Date(), serie: "123" },
      { input_form_button_id: "122" },
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
    router.register(func).whenActionWhen("create");
    router.register(func).whenWidgetExec("insert");
    router.register(func).whenEnv("_widget_exec", "insert");
    router.register(func).whenInputFormID("122");
    const execution = await router.exec();

    // @ts-ignore
    expect(execution.status).toBeTruthy();
    expect(execution.services).toEqual(Array(13).fill("func", 0));
  });

  test("All tests with when invalid conditions", async () => {
    const scope = [
      { variable: "test", value: 1, origin: "", time: new Date(), serie: "123" },
      { input_form_button_id: "122" },
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
    router.register(func).whenActionWhen("delete");
    router.register(func).whenWidgetExec("delete");
    router.register(func).whenEnv("_widget_exec", "delete");
    router.register(func).whenInputFormID("444");
    const execution = await router.exec();

    // @ts-ignore
    expect(execution.status).toBeFalsy();
    expect(execution.services).toEqual([]);
  });
});
