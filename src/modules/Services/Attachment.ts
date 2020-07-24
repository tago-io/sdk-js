import TagoIOModule, { GenericModuleParams } from "../../common/TagoIOModule";
import { Base64 } from "../../common/common.types";

interface ArchiveFile {
  name: string;
  content: Base64;
  type: string;
}

class Attachment extends TagoIOModule<GenericModuleParams> {
  /**
   *  Send Attachment
   * @param archive Archive JSON Object
   */
  public async upload(archive: ArchiveFile): Promise<string> {
    const result = await this.doRequest<string>({
      path: "/analysis/services/attachment/upload",
      method: "POST",
      body: {
        archive: archive.content,
        filename: archive.name,
        type: archive.type,
      },
    });

    return result;
  }
}

export default Attachment;
