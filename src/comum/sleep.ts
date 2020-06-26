import { SSL_OP_EPHEMERAL_RSA } from "constants";

const sleep = (timerMS: number) => new Promise((resolve) => setTimeout(resolve, timerMS));

export default sleep;
