const { ORDER_STATUS } = require('./order.constants');

const getNextStatus = (currentStatus) => {
  const statusFlow = {
    [ORDER_STATUS.PENDING]: ORDER_STATUS.CONFIRMED,
    [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.PROCESSING,
    [ORDER_STATUS.PROCESSING]: ORDER_STATUS.SHIPPED,
    [ORDER_STATUS.SHIPPED]: ORDER_STATUS.DELIVERED,
  };

  return statusFlow[currentStatus] || null;
};

const canCancel = (status) => {
  return [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(status);
};

const canRefund = (status, paymentStatus) => {
  return (
    [ORDER_STATUS.CANCELLED, ORDER_STATUS.DELIVERED].includes(status) &&
    paymentStatus === 'completed'
  );
};

module.exports = {
  getNextStatus,
  canCancel,
  canRefund,
};

