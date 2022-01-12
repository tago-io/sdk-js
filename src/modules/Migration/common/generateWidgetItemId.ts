// ? ==================================== (c) TagoIO ====================================
// * What is this file?
//     Generates a random unique ID for a widget item in an array.
// ? ====================================================================================

import { nanoid } from "nanoid";

function generateWidgetItemID(): string {
  const id = nanoid();
  return id;
}

export default generateWidgetItemID;
