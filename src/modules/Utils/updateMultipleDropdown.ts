import Device from "../Device/Device";

/**
 * Go through variables used in Multiple Dropdown variables and remove a specified value.
 * Then updates the variables.
 * @param device TagoIO Device instanced class.
 * @param variables variables inside the device to be verified.
 * @param value value to be removed.
 */
async function updateMultipleDropdown(device: Device, variables: string | string[], values: string | string[]) {
  const fixed_values = Array.isArray(values) ? values : [values];

  const data_list = await device.getData({ variables, qty: 999 });

  data_list.forEach((item) => {
    let sentValues = item.metadata?.sentValues as { value: string; label: string }[];
    let new_data_value = (item.value as string).split(";");

    if (sentValues.find((x) => fixed_values.includes(x.value))) {
      sentValues = sentValues.filter((x) => {
        if (fixed_values.includes(x.value)) {
          new_data_value = new_data_value.filter((y) => !fixed_values.includes(y) && !fixed_values.includes(x.label));
        }
        return !fixed_values.includes(x.value);
      });

      const new_item = {
        ...item,
        value: new_data_value.join(";"),
        metadata: { ...item.metadata, sentValues },
      } as any;

      device.deleteData({ ids: item.id }).catch((e) => console.error(e));
      device.sendData(new_item).catch((e) => console.error(e));
    }
  });
}

export default updateMultipleDropdown;
