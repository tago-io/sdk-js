import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";

class SDB extends TagoIOModule<GenericModuleParams> {
  /**
   * Retrieves a custom parameter of a Run user.
   * The Run user is identified by the token in the constructor.
   * @param tagoRunURL TagoIO Run url without http
   * @param key Identifier of the parameter
   */
  public async getItem(tagoRunURL: string, key: string): Promise<any> {
    const result = await this.doRequest<any>({
      path: `/run/${tagoRunURL}/sdb/${key}`,
      method: "GET",
    });
    return result;
  }

  /**
   * Creates or updates a custom parameter of a Run user.
   * The Run user is identified by the token in the constructor.
   * @param tagoRunURL TagoIO Run url without http
   * @param key Identifier of the parameter
   * @param value Value of the parameter
   */
  public async setItem(tagoRunURL: string, key: string, value: string): Promise<any> {
    const result = await this.doRequest<any>({
      path: `/run/${tagoRunURL}/sdb/${key}`,
      method: "POST",
      body: value,
    });
    return result;
  }

  /**
   * Delete a custom parameter of a Run user.
   * The Run user is identified by the token in the constructor.
   * @param tagoRunURL TagoIO Run url without http
   * @param key Identifier of the parameter
   */
  public async removeItem(tagoRunURL: string, key: string): Promise<any> {
    const result = await this.doRequest<any>({
      path: `/run/${tagoRunURL}/sdb/${key}`,
      method: "DELETE",
    });
    return result;
  }
}

export default SDB;
