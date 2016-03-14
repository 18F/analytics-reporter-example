var Analytics = require("analytics-reporter"),
    CronJob = require('cron').CronJob,
    fs = require('fs'),
    async = require("async"),
    spawn = require('child_process').spawn,
    creds = require("cfenv").getAppEnv().getService(process.env.ANALYTICS_CREDS).credentials,
    key = creds.ANALYTICS_KEY_0 + creds.ANALYTICS_KEY_1 + creds.ANALYTICS_KEY_2 + creds.ANALYTICS_KEY_3,
    allReports = [];

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
        allReports.push(function(finished) {
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
    })(reportIDs[idx]);
};

var runAllReports = function() {
    async.eachSeries(allReports,
        function(item, callback) {
            console.log("Daily Reports Starting");
            item(callback);
        },
        function(err) {
            if(err) {
              console.log(err)
            }
        }
    );
};

var jobs = new CronJob({
    cronTime: '5 10 * * *',
    onTick: runAllReports,
    start: false,
    timeZone: 'America/Los_Angeles'
});


jobs.start();
