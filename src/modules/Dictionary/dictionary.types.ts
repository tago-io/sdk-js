import { GenericModuleParams } from "../../common/TagoIOModule";
import { Regions } from "../../regions";

interface IDictionaryModuleParams extends GenericModuleParams {
  token: string;
  region?: Regions;
  language?: string;
  options?: object;
}

interface IDictionaryModuleParamsAnonymous extends GenericModuleParams {
  runURL: string;
  region?: Regions;
  language?: string;
  options?: object;
}

interface IParsedExpression {
  dictionary: string;
  key: string;
  params?: string[];
}

interface IResolveExpressionParams {
  language: string;
  expression: IParsedExpression;
}

interface IApplyToStringOptions {
  language?: string;
}

export {
  IDictionaryModuleParams,
  IDictionaryModuleParamsAnonymous,
  IParsedExpression,
  IResolveExpressionParams,
  IApplyToStringOptions,
};
