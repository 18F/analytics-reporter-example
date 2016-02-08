var Analytics = require("analytics-reporter"),
	CronJob = require('cron').CronJob,
	fs = require('fs'),
	creds = require("cfenv").getAppEnv().getService(process.env.ANALYTICS_CREDS).credentials,
	key = JSON.parse(fs.readFileSync(creds.ANALYTICS_KEY_PATH, 'utf8')).private_key;

var analytics = new Analytics(
	key,
	creds.ANALYTICS_REPORT_EMAIL,
	creds.ANALYTICS_REPORT_IDS,
	creds.ANALYTICS_REPORTS_PATH,
	null,
	true
);

// Test run
analytics.run({'csv': true, 'json': true}, function() {
	console.log('Reports Finished')
});

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