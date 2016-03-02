var Analytics = require("analytics-reporter"),
		CronJob = require('cron').CronJob,
		fs = require('fs'),
		creds = require("cfenv").getAppEnv().getService(process.env.ANALYTICS_CREDS).credentials;

var key = creds.ANALYTICS_KEY_0 + creds.ANALYTICS_KEY_1 + creds.ANALYTICS_KEY_2 + creds.ANALYTICS_KEY_3;
var analytics = new Analytics(
	key.replace(/\\n/g, '\n'),
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
	cronTime: '0 */5 * * * *',
	onTick: function() {
		analytics.run({'csv': true, 'json': true}, function() {
			console.log('Reports Finished')
		});
	},
	start: false,
	timeZone: 'America/Los_Angeles'
});

job.start();
