import TagoIOModule, { ShareModuleParams } from "../../common/TagoIOModule";
import { GenericID } from "../../common/comum.types";
import { InviteResponse, InviteInfo } from "./account.types";

class _Share extends TagoIOModule<ShareModuleParams> {
  public async invite(id: GenericID, data: InviteInfo): Promise<InviteResponse> {
    const result = await this.doRequest<InviteResponse>({
      path: `/share/${this.params.type}/${id}`,
      method: "POST",
      body: {
        ...data,
      },
    });

    return result;
  }
  public async edit(id: GenericID, data: Partial<InviteInfo>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/share/${this.params.type}/${id}`,
      method: "PUT",
      body: {
        ...data,
      },
    });

    return result;
  }
  public async list(id: GenericID): Promise<Readonly<InviteInfo[]>> {
    const result = await this.doRequest<InviteInfo[]>({
      path: `/share/${this.params.type}/${id}`,
      method: "GET",
    });

    return result;
  }
  public async remove(shareID: GenericID): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/share/${shareID}`,
      method: "DELETE",
    });

    return result;
  }
}

export default _Share;
