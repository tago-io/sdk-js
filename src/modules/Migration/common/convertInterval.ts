// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Converts the OLD INTERVAL to BLUEPRINT interval
// ? ====================================================================================

function convertInterval(intv: string): string {
  return intv.replace("hra", "hour").replace("wek", "week").replace("mth", "month").replace("yer", "year");
}

export default convertInterval;
