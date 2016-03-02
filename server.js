var Analytics = require("analytics-reporter"),
		CronJob = require('cron').CronJob,
		fs = require('fs'),
		creds = require("cfenv").getAppEnv().getService(process.env.ANALYTICS_CREDS).credentials;

var key = creds.ANALYTICS_KEY_0 + creds.ANALYTICS_KEY_1 + creds.ANALYTICS_KEY_2 + creds.ANALYTICS_KEY_3;
var aws_settings = {
	bucket: creds.AWS_BUCKET,
  path: creds.AWS_BUCKET_PATH,
  cache: 0,
}
var analytics = new Analytics(
	key.replace(/\\n/g, '\n'),
	creds.ANALYTICS_REPORT_EMAIL,
	creds.ANALYTICS_REPORT_IDS,
	creds.ANALYTICS_REPORTS_PATH,
	aws_settings,
	true
);


var realtimeJobs = new CronJob({
  	cronTime: '*/2 * * * *',
  	onTick: function() {
			analytics.run({'csv': true, 'json': true, 'only': 'realtime', 'publish': true}, function() {
				console.log('Reports Finished')
			});
    },
    	start: false,
    	timeZone: 'America/Los_Angeles'
});

var dailyReports = new CronJob({
  	cronTime: '0 * * * *', //10 5 * * *
  	onTick: function() {
			analytics.run({'csv': true, 'json': true, 'only': 'os', 'publish': true}, function() {
				console.log('Reports Finished')
			});
    },
    	start: false,
    	timeZone: 'America/Los_Angeles'
});

realtimeJobs.start();
dailyReports.start();
