# Setup
### Set up a user defined service with credientals
After entering this command you'll be propmted for each creditnal individually.
```bash
cf cups analytics-reporter-creds -p "ANALYTICS_KEY_PATH, ANALYTICS_REPORT_EMAIL, ANALYTICS_REPORT_IDS, ANALYTICS_REPORTS_PATH"
```
### Deploy
```bash
cf push
```