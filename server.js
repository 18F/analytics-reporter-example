var Analytics = require("analytics-reporter"),
    CronJob = require('cron').CronJob,
    fs = require('fs'),
    async = require("async"),
    creds = require("cfenv").getAppEnv().getService(process.env.ANALYTICS_CREDS).credentials;

var key = creds.ANALYTICS_KEY_0 + creds.ANALYTICS_KEY_1 + creds.ANALYTICS_KEY_2 + creds.ANALYTICS_KEY_3;
var aws_settings = {
    bucket: creds.AWS_BUCKET,
    path: creds.AWS_BUCKET_PATH,
    cache: 0,
}

var analyticsDHS = new Analytics(
    key.replace(/\\n/g, '\n'),
    creds.ANALYTICS_REPORT_EMAIL,
    creds.ANALYTICS_REPORT_IDS,
    creds.ANALYTICS_REPORTS_PATH,
    aws_settings,
    true
);

var dhsRealTime = function(finished) {
    analyticsDHS.run({
        'csv': true,
        'json': true,
        'frequency': 'realtime',
        'slim': true,
        'publish': true
    }, function() {
        console.log('Reports Finished');
        finished();
    });
}

var dhsDaily = function(finished) {
    analyticsDHS.run({
        'csv': true,
        'json': true,
        'frequency': 'daily',
        'slim': true,
        'publish': true
    }, function() {
        console.log('Reports Finished');
        finished();
    });
}


realtimeReports = [dhsRealTime];
dailyReports = [dhsDaily];

var runAllRealtime = function() {
    async.each(realtimeReports,
        function(item, callback) {
            item(callback);
        },
        function(err) {
            console.log("All Realtime Run");
        }
    );
};

var runAllDaily = function() {
    async.each(dailyReports,
        function(item, callback) {
            item(callback);
        },
        function(err) {
            console.log("All Daily Done");
        }
    );
};


var realtimeJobs = new CronJob({
    cronTime: '*/2 * * * *',
    onTick: runAllRealtime,
    start: false,
    timeZone: 'America/Los_Angeles'
});

var dailyReports = new CronJob({
    cronTime: '10 5 * * *',
    onTick: runAllDaily,
    start: false,
    timeZone: 'America/Los_Angeles'
});

realtimeJobs.start();
dailyReports.start();
