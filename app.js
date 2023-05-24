const { App } = require('@slack/bolt');
const OpenAI  = require('./openai')
require('dotenv').config();

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, // add this
    appToken: process.env.SLACK_APP_TOKEN, // add this,

    port: process.env.PORT || 3000
});

// Creating a new instance of the OpenAI class and passing in the OPENAI_KEY environment variable
const openAI = new OpenAI(process.env.OPENAI_KEY);
const model = process.env.OPENAI_MODEL || 'gpt-4'


// Listens to incoming message contain code
app.message('write code: ', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    let response  = `<@${message.user}>\n`
    response += `You ask: \`${message.text}\`\n`
    response += "and the devil said: "
    rep = await getReponse(message.text, message.user);

    if (rep.length <= 100) {
        response += `\`${rep}\`\n`
    } else {
        response += '```' + `\n` + `${rep}` + `\n` + '```'
    }

    await say(response);
});

// Listens to all incoming message
app.message('', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    let response  = `<@${message.user}>\n`
    response += `You ask: \`${message.text}\`\n`
    response += "and the devil said: "
    rep = await getReponse(message.text, message.user);

    if (rep.length <= 100) {
        response += `\`${rep}\`\n`
    } else {
        response += '```' + `\n` + `${rep}` + `\n` + '```'
    }

    await say(response);
});

// The echo command simply echoes on command
app.command('/ask', async ({ command, ack, respond }) => {
    await ack();

    let response  = `<@${command.user_id}>\n`
    response += `You ask: \`${command.text}\`\n`
    response += "and the devil said: "

    rep = await getReponse(command.text, command.user_id);

    if (rep.length <= 100) {
        response += `\`${rep}\`\n`
    } else {
        response += '```' + `\n` + `${rep}` + `\n` + '```'
    }

    // Acknowledge command request
    await respond(`${response}`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

async function getReponse(question, user_id) {

    try {
        return await openAI.generateText(question, model, 800, user_id)
    } catch (err) {
        console.log(err.response.data.error)
        return "Please ask questions that do not insult my intelligence.!"
    }
}