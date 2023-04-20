import { Queue } from "bullmq";

const orderQueue = new Queue('orders');

module.exports = orderQueue;