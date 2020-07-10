import TagoIOModule, { GenericModuleParams } from "../../comum/TagoIOModule";
import { GenericID, PermissionOption, ExpireTimeOption } from "../../comum/comum.types";

type refType = "dashboard";

interface InviteData {
  email: string;
  permission?: PermissionOption;
}

interface InviteResponse {
  expire_time: ExpireTimeOption;
  id: GenericID;
}

interface InviteInfo {
  status: string;
  expire_time: ExpireTimeOption;
  allow_share: boolean;
  allow_tags: boolean;
  id: GenericID;
  name: string;
  email: string;
}

class _Share extends TagoIOModule<GenericModuleParams> {
  public async invite(type: refType, id: GenericID, data: InviteData): Promise<InviteResponse> {
    const result = await this.doRequest<InviteResponse>({
      path: `/share/${type}/${id}`,
      method: "POST",
      body: {
        ...data,
      },
    });

    return result;
  }
  public async edit(type: refType, id: GenericID, data: Partial<InviteData>): Promise<string> {
    const result = await this.doRequest<string>({
      path: `/share/${type}/${id}`,
      method: "PUT",
      body: {
        ...data,
      },
    });

    return result;
  }
  public async list(type: refType, id: GenericID): Promise<InviteInfo[]> {
    const result = await this.doRequest<InviteInfo[]>({
      path: `/share/${type}/${id}`,
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
