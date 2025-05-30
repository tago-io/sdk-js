import path from "path";

import Account from "../Resources/AccountDeprecated";
import Resources from "../Resources/Resources";
import type { UploadFileOptions } from "./utils.types";

type FileURL = string;

/**
 * Upload a file and return it's URL.
 * @requires Profile Access for the Analysis
 * @requires Files Access for the Analysis
 */
async function uploadFile(resource: Account | Resources, options: UploadFileOptions): Promise<FileURL> {
  if (!(resource instanceof Account) && !(resource instanceof Resources)) {
    throw "The parameter 'resource' must be an instance of a TagoIO Resource.";
  }

  const { info: profileInfo } = await resource.profiles.info("current");

  if (options.path) {
    if (!options.path.includes("/")) {
      throw `Invalid file path: ${options.path}`;
    }

    if (options.path.startsWith("/")) {
      options.path = options.path.substring(1);
    }
  }

  const fixed_path = path.join(options.path || "", options.filename);

  const body = { file: options.file_base64, filename: fixed_path };
  await resource.files.uploadBase64([{ ...body, public: options.public || true }]);

  return `https://api.tago.io/file/${profileInfo.id}/${fixed_path}`;
}

export default uploadFile;
