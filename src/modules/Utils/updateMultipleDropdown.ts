import Device from "../Device/Device";

async function fixSentValues(device: Device, variables: string | string[], value: string) {
  const dataList = await device.getData({ variables, qty: 999 });

  dataList.forEach((item) => {
    let sentValues = (item.metadata?.sentValues as any) as { value: string; label: string }[];
    let new_value = (item.value as string).split(";");

    if (sentValues.find((x) => x.value === value)) {
      sentValues = sentValues.filter((x) => {
        if (x.value === value) {
          new_value = new_value.filter((y) => y !== value && y !== x.label);
        }
        return x.value !== value;
      });

      const new_item = {
        ...item,
        value: new_value.join(";"),
        metadata: { ...item.metadata, sentValues },
      } as any;

      device.deleteData({ ids: item.id }).catch((e) => console.error(e));
      device.sendData(new_item).catch((e) => console.error(e));
    }
  });
}

export { fixSentValues };
