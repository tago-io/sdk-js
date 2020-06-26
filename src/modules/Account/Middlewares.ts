import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";

class Middlewares extends TagoIOModule<GenericModuleParams> {
  public async list(owner: boolean = false) {
    const params = {} as any;
    if (owner) {
      params.owner = true;
    }

    // TODO: Create interface on doRequest
    const result = await this.doRequest<any>({
      path: "/middleware",
      method: "GET",
      params: params,
    });

    return result;
  }

  public async genToken(middlewareName: string) {
    // TODO: Create interface on doRequest
    const result = await this.doRequest<any>({
      path: `/middleware/gen_token/${middlewareName}`,
      method: "PUT",
    });

    return result;
  }
}

export default Middlewares;
