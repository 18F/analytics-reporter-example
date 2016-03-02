# Setup
### Set up a user defined service with credentials
After entering this command you'll be prompted for each credentials individually.
```bash
cf cups analytics-reporter-creds -p "ANALYTICS_KEY_0, ANALYTICS_KEY_1, ANALYTICS_KEY_2, ANALYTICS_KEY_3, ANALYTICS_REPORT_EMAIL, ANALYTICS_REPORT_IDS, ANALYTICS_REPORTS_PATH"
```
### Deploy
```bash
cf push
```

cf unbind-service analytics-reporter analytics-reporter-creds
cf ds analytics-reporter-creds
