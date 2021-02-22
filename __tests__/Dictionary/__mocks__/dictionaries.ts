import { LanguageData } from "../../../src/modules/Account/dictionaries.types";

interface IMockLanguageData {
  [slug: string]: LanguageData;
}

const enUS: IMockLanguageData = {
  TEST: {
    dictionary: {
      STRING_WITH_PARAMETER: "This string has $0 as parameter",
      STRING_WITH_TWO_PARAMETERS: "This string has $0 and $1 as parameters",
      STRING_WITH_REPEATED_PARAMETERS: "This string has $0, $0, $0 as parameter 3 times",
      STRING_WITH_OUT_OF_RANGE_PARAMETERS: "This string has $0 and $1 as parameters, $2 is ignored",
      VARIABLE_LABEL: "Label: $0 (translated)",
      VARIABLE_VALUE: "Values: $0 & $1 (translated)",
      VARIABLE_ONE: "and it works",
      VARIABLE_TWO: "still works",
      VARIABLE_THREE: "working to the end",
      VARIABLE_PARAMS_ONE: "and it $0",
      VARIABLE_PARAMS_TWO: "and it $0 $1",
      VARIABLE_PARAMS_THREE: "and $0 $1 to the $2 of $0 all",
      VARIABLE_PARAMS_NO_ARGS: "$0, $1, and $2",
      VARIABLE_NO_PARAMS: "this variable has no parameters",
      BALANCE_LABEL: "Balance (USD): $ $0",

      TEST_KEY: "Some test value",
      TEST_RESOLVE_SINGLE_PARAM: "Resolved single param $0",
      TEST_RESOLVE_THREE_PARAMS: "Resolved params: 1 = $0, 2 = $1, 3 = $2",
      APPLY_ONE: "which is parsed and resolved",
      APPLY_ANOTHER_ONE: "one to see if the broken one does not break everything after",
      APPLY_WITH_COMMA: "one including $0",
      APPLY_WITH_HASH: "$0 (because # should work here as well)",
      APPLY_MESSY_PART_ONE: "FirstPart",
      APPLY_MESSY_PART_TWO: "$0Part",
    },
    active: true,
  },
  WIDGETS: {
    dictionary: {
      DISPLAY_TITLE: "Display with Dictionary",
      DISPLAY_HELP_TEXT: "This is some helpful text.",
      DISPLAY_HEADER_BUTTON1: "Run Main Analysis",
      DISPLAY_HEADER_BUTTON2: "Run Other Analysis",
      DISPLAY_VALUE: "Some value in English $0",
      DISPLAY_LABEL: "Some label in English $0 ($1)",
      DISPLAY_ALIAS: "Some alias in English $0",
    },
    active: true,
  },
};

const ptBR: IMockLanguageData = {
  TEST: {
    dictionary: {
      STRING_WITH_PARAMETER: "Essa string tem $0 como parâmetro",
      STRING_WITH_TWO_PARAMETERS: "Essa string tem $0 e $1 como parâmetros",
      STRING_WITH_REPEATED_PARAMETERS: "Essa string tem $0, $0, $0 como parâmetro três vezes",
      STRING_WITH_OUT_OF_RANGE_PARAMETERS: "Essa string tem $0 e $1 como parâmetros, $2 é ignorado",
      VARIABLE_LABEL: "Rótulo: $0 (substituídos)",
      VARIABLE_VALUE: "Valores: $0 & $1 (substituídos)",
      VARIABLE_ONE: "e funciona",
      VARIABLE_TWO: "ainda funciona",
      VARIABLE_THREE: "funciona até o fim",
      VARIABLE_PARAMS_ONE: "e isso $0",
      VARIABLE_PARAMS_TWO: "e isso $0 $1",
      VARIABLE_PARAMS_THREE: "e $0 $1 até o $2 de $0 tudo",
      VARIABLE_PARAMS_NO_ARGS: "$0, $1, e $2",
      VARIABLE_NO_PARAMS: "essa variável não tem parâmetros",
      BALANCE_LABEL: "Saldo (BRL): R$ $0",

      TEST_KEY: "Algum valor de teste",
      TEST_RESOLVE_SINGLE_PARAM: "Resolvido parâmetro único $0",
      TEST_RESOLVE_THREE_PARAMS: "Parâmetros resolvidos: 1 = $0, 2 = $1, 3 = $2",
      APPLY_ONE: "que é parseado e resolvido",
      APPLY_ANOTHER_ONE: "um para ver se o quebrado não quebra todo o resto depois",
      APPLY_WITH_COMMA: "um incluindo $0",
      APPLY_WITH_HASH: "$0 (porque # deve funcionar aqui também)",
      APPLY_MESSY_PART_ONE: "PrimeiraParte",
      APPLY_MESSY_PART_TWO: "$0Parte",
    },
    active: true,
  },
  WIDGETS: {
    dictionary: {
      DISPLAY_TITLE: "Display com Dictionary",
      DISPLAY_HELP_TEXT: "Isso é um texto de ajuda.",
      DISPLAY_HEADER_BUTTON1: "Rodar Analysis Principal",
      DISPLAY_HEADER_BUTTON2: "Rodar Outra Analysis",
      DISPLAY_VALUE: "Um valor em Português $0",
      DISPLAY_LABEL: "Uma label em Português $0 ($1)",
      DISPLAY_ALIAS: "Um alias em Português $0",
    },
    active: true,
  },
};

export { enUS, ptBR };
