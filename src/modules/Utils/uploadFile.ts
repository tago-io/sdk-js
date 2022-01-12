import Account from "../Account/Account";
import { UploadFileOptions } from "./utils.types";
import path from "path";

type FileURL = string;

/**
 * Upload a file and return it's URL.
 */
async function uploadFile(account: Account, options: UploadFileOptions): Promise<FileURL> {
  if (!(account instanceof Account)) {
    throw "The parameter 'account' must be an instance of a TagoIO Account.";
  }

  const { id: account_id } = await account.info();

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
  await account.files.uploadBase64([{ ...body, public: options.public || true }]);

  return `https://api.tago.io/file/${account_id}/${fixed_path}`;
}

export default uploadFile;
