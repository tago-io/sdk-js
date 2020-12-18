import { ExpireTimeOption, GenericID, PermissionOption } from "../../common/common.types";
import TagoIOModule, { ShareModuleParams } from "../../common/TagoIOModule";
import dateParser from "../Utils/dateParser";
import { InviteInfo, InviteResponse } from "./_share.types";

class _Share extends TagoIOModule<ShareModuleParams> {
  public async invite(id: GenericID, data: InviteInfo): Promise<InviteResponse> {
    let result = await this.doRequest<InviteResponse>({
      path: `/share/${this.params.type}/${id}`,
      method: "POST",
      body: {
        ...data,
      },
    });

    result = dateParser(result, ["expire_time"]);

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
  public async list(id: GenericID): Promise<InviteInfo[]> {
    let result = await this.doRequest<InviteInfo[]>({
      path: `/share/${this.params.type}/${id}`,
      method: "GET",
    });

    result = result.map((data) => dateParser(data, ["expire_time"]));

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
