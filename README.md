# Bolt Functions POC App 
See below for setup instructions in getting this test app off the ground:
## Choose up your development workspace
You have two options:
1. Get added to an existing workspace with beta flags enabled (and where you have permission to install apps)
2. Set up your own workspace with beta flags (ask Sarah for the flags)
## Setup app with manifest.json
* Head to api.slack.com/apps and "Create New App"
* Select "From an app manifest" and copy the contents of `manifest.json` in this project
* Set up your App Token (for Socketmode)
* Install the app to your development workspace

## Back in your local project
* Add your App Token and Bot Token to your environment variables
```bash
export SLACK_APP_TOKEN=<your-app-token>
export SLACK_BOT_TOKEN=<your-bot-token>
```
* Fire up the app `npm start` and confirm it's running
## Setup a workflow with your function
* Go to **Tools > Workflow Builder** 
* You should see a green button to access the Alpha experience
* That should open up a build ui
* Add the `bolt-reverse` step
* Name and publish your workflow (the experience is still under construction as of writing, hence the scant detail)

## Run your workflow
* However you setup your workflow to run, trigger it and see it working!