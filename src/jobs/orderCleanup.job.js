const cron = require("node-cron");
const Order = require("../modules/orders/order.model");
const { ORDER_STATUS } = require("../modules/orders/order.constants");

// Clean up pending orders older than 24 hours
const cleanupPendingOrders = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await Order.updateMany(
      {
        status: ORDER_STATUS.PENDING,
        createdAt: { $lt: oneDayAgo },
      },
      {
        status: ORDER_STATUS.CANCELLED,
      }
    );

    console.log(`Cleaned up ${result.modifiedCount} pending orders`);
  } catch (error) {
    console.log("Order cleanup job failed:", error);
  }
};

// Run daily at 2 AM
const startOrderCleanupJob = () => {
  cron.schedule("0 2 * * *", cleanupPendingOrders, {
    scheduled: true,
    timezone: "Asia/Kolkata",
  });
  console.log("Order cleanup job scheduled");
};

module.exports = {
  startOrderCleanupJob,
  cleanupPendingOrders,
};
