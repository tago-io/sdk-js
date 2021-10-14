import { Account, Device, Utils } from "../../src/modules";

const func = async () => {
  return true;
};

describe("Parse LoRaWAN QR Code", () => {
  test("8 Fields Success", async () => {
    const scope = [
      { variable: "test", value: 1, origin: "", time: new Date(), serie: "123" },
      { input_form_button_id: "122" },
    ];
    const qr_code = Utils.parseLorawanQRCode(
      "LW:D0:1122334455667788:AABBCCDDEEFF0011:AABB1122:OAABBCCDDEEFF:SYYWWNNNNNN:PFOOBAR:CAF2C"
    );

    // @ts-ignore
    expect(qr_code.join_eui).toBe("1122334455667788");
    expect(qr_code.dev_eui).toBe("AABBCCDDEEFF0011");
    expect(qr_code.profile_id).toBe("AABB1122");
    expect(qr_code.owner_token).toBe("OAABBCCDDEEFF");
    expect(qr_code.sn_number).toBe("SYYWWNNNNNN");
    expect(qr_code.proprietary).toBe("PFOOBAR");
    expect(qr_code.checksum).toBe("CAF2C");
  });

  test("4 Fields Success", async () => {
    const scope = [
      { variable: "test", value: 1, origin: "", time: new Date(), serie: "123" },
      { input_form_button_id: "122" },
    ];
    const qr_code = Utils.parseLorawanQRCode("LW:D0:1122334455667788:AABBCCDDEEFF0011");

    // @ts-ignore
    expect(qr_code.join_eui).toBe("1122334455667788");
    expect(qr_code.dev_eui).toBe("AABBCCDDEEFF0011");
  });

  test("Invalid QR Code", async () => {
    const scope = [
      { variable: "test", value: 1, origin: "", time: new Date(), serie: "123" },
      { input_form_button_id: "122" },
    ];

    let qr_code: any;
    try {
      qr_code = Utils.parseLorawanQRCode("Test");
    } catch (e) {
      expect(e).toBe("Invalid QR Code");
    }

    // @ts-ignore
    expect(qr_code).toBeUndefined();
  });
});
