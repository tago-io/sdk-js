import axios from "axios";
import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

interface PDFResult {
  status: boolean;
  result: string;
}

interface PDFParams {
  /**
   * HTML as string
   */
  html?: string;

  /**
   * HTML on base64 format
   */
  base64?: string;

  /**
   * File name of pdf
   * Without filename, it will generate base64 response
   * With filename it will generate pdf binary
   */
  fileName?: string;

  /**
   * Generate pdf from URL
   */
  url?: string;

  /**
   * PDF Custom Options
   */
  options?: {
    /**
     * Display header and footer. Defaults to `false`.
     */
    displayHeaderFooter?: boolean;

    /**
     * HTML template for the print footer. Should use the same format as the `headerTemplate`.
     */
    footerTemplate?: string;

    /**
     * Paper format. If set, takes priority over `width` or `height` options. Defaults to 'Letter'.
     */
    format?: string;

    /**
     * HTML template for the print header. Should be valid HTML markup with following classes used to inject printing values
     * into them:
     * - `'date'` formatted print date
     * - `'title'` document title
     * - `'url'` document location
     * - `'pageNumber'` current page number
     * - `'totalPages'` total pages in the document
     */
    headerTemplate?: string;

    /**
     * Paper height, accepts values labeled with units.
     */
    height?: string | number;

    /**
     * Paper orientation. Defaults to `false`.
     */
    landscape?: boolean;

    /**
     * Paper margins, defaults to none.
     */
    margin?: {
      /**
       * Top margin, accepts values labeled with units. Defaults to `0`.
       */
      top?: string | number;

      /**
       * Right margin, accepts values labeled with units. Defaults to `0`.
       */
      right?: string | number;

      /**
       * Bottom margin, accepts values labeled with units. Defaults to `0`.
       */
      bottom?: string | number;

      /**
       * Left margin, accepts values labeled with units. Defaults to `0`.
       */
      left?: string | number;
    };

    /**
     * Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means print all pages.
     */
    pageRanges?: string;

    /**
     * Give any CSS `@page` size declared in the page priority over what is declared in `width` and `height` or `format`
     * options. Defaults to `false`, which will scale the content to fit the paper size.
     */
    preferCSSPageSize?: boolean;

    /**
     * Print background graphics. Defaults to `false`.
     */
    printBackground?: boolean;

    /**
     * Scale of the webpage rendering. Defaults to `1`. Scale amount must be between 0.1 and 2.
     */
    scale?: number;

    /**
     * Paper width, accepts values labeled with units.
     */
    width?: string | number;
  };
}

class PDFService extends TagoIOModule<GenericModuleParams> {
  /**
   * Generate a PDF from html, url or base64
   *
   */
  public async generate(params: PDFParams): Promise<PDFResult> {
    try {
      const result = await axios({
        method: "POST",
        url: "https://pdf.middleware.tago.io",
        data: params,
        headers: {
          token: this.params.token,
        },
      });

      return result?.data;
    } catch (error) {
      return Promise.reject(error?.response?.data || { result: false, stuats: "unknown error" });
    }
  }
}

export default PDFService;
export { PDFParams };
