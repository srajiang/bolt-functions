const { App, LogLevel } = require('@slack/bolt');

/* 
This sample slack application uses SocketMode
For the companion getting started setup guide, 
see: https://slack.dev/bolt-js/tutorial/getting-started 
*/

// Initializes your app with your bot token and app token
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

// we should create an app.function listener instead of using app.event. 
// we probably want to provide a client that uses the event.workflow_token instead of the bot token
app.event('function_executed', async ({ event, body, client}) => {
    console.log(event);

    const reverseString = event.inputs.stringToReverse.split("").reverse().join("");


    /* 
        call "functions.completeSuccess" with {
        outputs,
        function_execution_id: functionExecutionId,
        }

        or 

        "functions.completeError" with {
        error: error,
        "function_execution_id": functionExecutionId,
        }
    */
   client.apiCall('functions.completeSuccess', {outputs: { reverseString }, function_execution_id: event.function_execution_id})

   //This should instead be a step in the workflow that uses the outputs from the functions.completeSuccess api call
   client.chat.postMessage({
       channel: event.inputs.channel_id,
       text: `You reversed "${event.inputs.stringToReverse}" to ${reverseString}`
   })

});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
