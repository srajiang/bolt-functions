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

app.shortcut('reverse_shortcut', async ({ shortcut, ack, client, logger }) => {

  try {
    // Acknowledge shortcut request
    await ack();

    // Call the views.open method using one of the built-in WebClients
    const result = await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        type: "modal",
        callback_id: "reverse",
        title: {
          type: "plain_text",
          text: "bolt-reverse-shortcut"
        },
        submit: {
          type: "plain_text",
          text: "Submit",
          emoji: true
        },
        close: {
          type: "plain_text",
          text: "Close"
        },
        blocks: [
          {
            type: "input",
            block_id: "stringToReverse",
            element: {
              type: "plain_text_input",
              action_id: "stringToReverse"
            },
            label: {
              type: "plain_text",
              text: "String To Reverse",
              emoji: true
            }
          },
          {
            type: "actions",
            block_id: "channel_id",
            elements: [
              {
                type: "channels_select",
                placeholder: {
                  type: "plain_text",
                  text: "Select a channel",
                  emoji: true
                },
                action_id: "channel_id"
              }
            ]
          }
        ]
      }
    });

    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
});

app.view('reverse', async ({ ack, body, view, client, logger }) => {
  // Acknowledge the view_submission request
  await ack();

  console.log(view);
  console.log(view['state']['values']);
  const stringToReverse = view['state']['values']['stringToReverse']['stringToReverse'].value
  const channel_id = view['state']['values']['channel_id']['channel_id'].selected_channel

  const reverseString = view['state']['values']['stringToReverse']['stringToReverse'].value.split("").reverse().join("");

  try {
    await client.chat.postMessage({
      channel: channel_id,
      text: `You reversed "${stringToReverse}" to ${reverseString}`
    })
  }
  catch (error) {
    console.error(error);
  }
});

// we should create an app.function listener instead of using app.event. 
// we probably want to provide a client that uses the event.workflow_token instead of the bot token
app.event('function_executed', async ({ event, body, client, success, error}) => {
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
  //  success(outputs)
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
