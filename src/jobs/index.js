const { startOrderCleanupJob } = require('./orderCleanup.job');

const startAllJobs = () => {
  startOrderCleanupJob();
};

module.exports = {
  startAllJobs,
};

