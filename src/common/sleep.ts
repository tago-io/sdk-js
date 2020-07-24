/**
 * Make the async function wait
 * @internal
 * @param timerMS Time to wait
 */
const sleep = (timerMS: number) => new Promise((resolve) => setTimeout(resolve, timerMS));

export default sleep;
