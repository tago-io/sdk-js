import { Data } from "../../common/common.types";
import { valuesTypes } from "../Device/device.types";

type DataForGroupBy = Partial<Data> & { [index: string]: any };

interface GroupDataNormal {
  origin: string;
  serie: string;
}

type GroupDataNormalReturn = GroupDataNormal & { [variable: string]: Omit<Data, "origin" | "serie"> };

type GroupDataOnlyValueReturn = Omit<Data, "value"> & { [variable: string]: valuesTypes };

type GroupDataReturns = GroupDataNormalReturn[] | GroupDataOnlyValueReturn[];

type groupByTypes = "serie" | "time";

/**
 * Group data by series or time
 * Returns the array grouped by time or series
 * @param data Array of TagoIO Data
 * @param groupBy Time or Serie
 * @param valueOnly Defines if the object is variable value only or the full object
 */
function groupData(data: DataForGroupBy[], groupBy: groupByTypes = "serie", valueOnly = false): GroupDataReturns {
  if (valueOnly) {
    return Object.values(
      data.reduce((pre: any, cur: any) => {
        pre[cur[groupBy]] = {
          ...pre[cur[groupBy]],
          ...{
            ...{
              [cur.variable]: cur.value,
              origin: cur.origin,
              ...(cur[groupBy] ? { [groupBy]: cur[groupBy] } : {}),
            },
          },
        };
        return pre;
      }, {}) as GroupDataOnlyValueReturn[]
    );
  }

  return Object.values(
    data.reduce((pre: any, cur: any) => {
      pre[cur[groupBy]] = {
        ...pre[cur[groupBy]],
        ...{
          ...{
            [cur.variable]: {
              ...{ value: cur.value, id: cur.id, time: cur.time },
              ...(cur.metadata ? { metadata: cur.metadata } : {}),
              ...(cur.location ? { location: cur.location } : {}),
            },
            origin: cur.origin,
            ...(cur.serie ? { serie: cur.serie } : {}),
          },
        },
      };
      return pre;
    }, {}) as GroupDataNormalReturn[]
  );
}

export default groupData;
