import type { GenericModuleParams } from "../../common/TagoIOModule";
import type { Regions, RegionsObj } from "../../regions";

interface IDictionaryModuleParams extends GenericModuleParams {
  token: string;
  region?: Regions | RegionsObj;
  language?: string;
  options?: object;
}

interface IDictionaryModuleParamsAnonymous extends GenericModuleParams {
  runURL: string;
  region?: Regions | RegionsObj;
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

export type {
  IDictionaryModuleParams,
  IDictionaryModuleParamsAnonymous,
  IParsedExpression,
  IResolveExpressionParams,
  IApplyToStringOptions,
};
