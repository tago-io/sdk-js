import { GenericModuleParams } from "../../common/TagoIOModule";

interface IDictionaryModuleParams extends GenericModuleParams {
  options?: Object;
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

interface IDictionaryJSON {
  [dictionary: string]: {
    [key: string]: string;
  };
}

export { IDictionaryModuleParams, IParsedExpression, IResolveExpressionParams, IApplyToStringOptions, IDictionaryJSON };
