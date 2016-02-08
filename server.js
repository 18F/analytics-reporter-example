var Analytics = require("analytics-reporter"),
	CronJob = require('cron').CronJob;

var job = new CronJob({
	cronTime: '0 */30 * * * *', 
	onTick: function() {
		var analytics = new Analytics();
		analytics.run({'csv': true, 'json': true}, function() {
			console.log('Reports Finished')
		});
	},
	start: false,
	timeZone: 'America/Los_Angeles'
});

job.start();