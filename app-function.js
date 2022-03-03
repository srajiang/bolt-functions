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

// 
app.function('reverse', async ({func, client}) => {
  console.log(func);

  const reverseString = func.inputs.stringToReverse.split("").reverse().join("");

  //This should instead be a step in the workflow that uses the outputs from the functions.completeSuccess api call
  client.chat.postMessage({
      channel: func.inputs.channel_id,
      text: `You reversed "${func.inputs.stringToReverse}" to ${reverseString}`
  })

  client.apiCall('functions.completeSuccess', {outputs: { reverseString }, function_execution_id: event.function_execution_id})

});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
