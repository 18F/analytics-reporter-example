var Analytics = require("analytics-reporter"),
    CronJob = require('cron').CronJob,
    fs = require('fs'),
    async = require("async"),
    spawn = require('child_process').spawn,
    creds = require("cfenv").getAppEnv().getService(process.env.ANALYTICS_CREDS).credentials,
    key = creds.ANALYTICS_KEY_0 + creds.ANALYTICS_KEY_1 + creds.ANALYTICS_KEY_2 + creds.ANALYTICS_KEY_3,
    realtimeReports = [],
    dailyReports = [];

var reportIDs = [{
    gaid: 'ga:68909496',
    path: 'data/sba'
}, {
    gaid: 'ga:67460690',
    path: 'data/dhs'
}]

for (idx in reportIDs) {
    (function(reportID) {
        var aws_settings = {
            bucket: creds.AWS_BUCKET,
            path: reportID.path,
            cache: 0,
        };
        var analytics = new Analytics(
            key.replace(/\\n/g, '\n'),
            creds.ANALYTICS_REPORT_EMAIL,
            reportID.gaid,
            creds.ANALYTICS_REPORTS_PATH,
            aws_settings,
            true
        );
        realtimeReports.push(function(finished) {
            analytics.run({
                'csv': true,
                'json': true,
                'frequency': 'realtime',
                'slim': true,
                'publish': true
            }, function() {
                console.log('Reports Finished');
                finished();
            });
        });
        dailyReports.push(function(finished) {
            analytics.run({
                'csv': true,
                'json': true,
                'frequency': 'daily',
                'slim': true,
                'publish': true
            }, function() {
                console.log('Reports Finished');
                finished();
            });
        });
    })(reportIDs[idx]);
};

var runAllRealtime = function() {
    async.eachSeries(realtimeReports,
        function(item, callback) {
            console.log("Realtime Reports Starting");
            item(callback);
        },
        function(err) {
            console.log("Error");
        }
    );
};

var runAllDaily = function() {
	async.eachSeries(dailyReports,
        function(item, callback) {
            console.log("Daily Reports Starting");
            item(callback);
        },
        function(err) {
            console.log("Error");
        }
    );
};

var realtimeJobs = new CronJob({
    cronTime: '*/2 * * * *',
    onTick: runAllRealtime,
    start: false,
    timeZone: 'America/Los_Angeles'
});

var dailyReportJobs = new CronJob({
    cronTime: '10 5 * * *',
    onTick: runAllDaily,
    start: false,
    timeZone: 'America/Los_Angeles'
});

realtimeJobs.start();
dailyReportJobs.start();
