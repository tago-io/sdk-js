const sleep = (timerMS: number) => new Promise((resolve) => setTimeout(resolve, timerMS));

export default sleep;
