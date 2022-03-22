const { App, LogLevel } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: LogLevel.DEBUG,
});

app.function('reverse', async ({ event, client, success, error }) => {
  const { stringToReverse, channel_id } = event.inputs;
  const reverseString = stringToReverse.split("").reverse().join("");
  try {
    await client.chat.postMessage({
      channel: channel_id,
      text: `You reversed ${stringToReverse} to ${reverseString}`
    })
    // call success callback with function outputs
    await success({ reverseString });
  } catch (err) {
    // call error callback with function outputs
    await error('There was an issue');
  }
});

(async () => {
  // Start your app.
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
