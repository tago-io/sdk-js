// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Converts the OLD DOWNSAMPLE to new DOWNSAMPLE
// ? ====================================================================================

function convertDownsample(oldWidgetDisplay: any): any {
  const enabled = oldWidgetDisplay?.downsample_enabled || false;
  const factor = oldWidgetDisplay?.downsample_factor || 10;
  const threshold = oldWidgetDisplay?.downsample_threshold || 1000;

  return {
    enabled,
    factor: Math.min(50, Number(factor)), // Case exceed the maximum value
    threshold: Math.min(10000, Number(threshold)), /// Case exceed the maximum value
  };
}

export default convertDownsample;
