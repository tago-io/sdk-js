import { QRCodeFormat } from "./utils.types";

/**
 * Parse a LoRaWAN QR Code string to JSON format.
 * example:
 * @param qr_code QR Code string, example: LW:D0:1122334455667788:AABBCCDDEEFF0011:AABB1122:OAABBCCDDEEFF:SYYWWNNNNNN:PFOOBAR:CAF2C
 */
function parseQRCode(qr_code: string): QRCodeFormat {
  const parsed = qr_code.split(":");

  if (parsed.length < 4) {
    throw "Invalid QR Code";
  }

  if (parsed.length >= 9) {
    return {
      type: parsed[0],
      schema_id: parsed[1],
      join_eui: parsed[2],
      dev_eui: parsed[3],
      profile_id: parsed[4],
      owner_token: parsed[5],
      sn_number: parsed[6],
      proprietary: parsed[7],
      checksum: parsed[8],
    };
  }

  return {
    type: parsed[0],
    schema_id: parsed[1],
    join_eui: parsed[2],
    dev_eui: parsed[3],
    profile_id: parsed[4],
  };
}

export default parseQRCode;
