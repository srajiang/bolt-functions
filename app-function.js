const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.function('reverse', async ({ event, client, success, error }) => {
  const { stringToReverse, channel_id } = event.inputs;
  const reverseString = stringToReverse.split("").reverse().join("");

  try {
    await client.chat.postMessage({
      channel: channel_id,
      text: `You reversed ${stringToReverse} from ${reverseString}`
    })
    success({ reverseString });
  } catch (err) {
    error('internal_error');
  }
});

(async () => {
  // Start your app.
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
