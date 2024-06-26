import { Context, Markup, Telegraf, session } from 'telegraf';
import dotenv from 'dotenv';
import { readFromJSON } from './utils/file';
import { VOICE_OPTIONS_PATH } from './utils/constants';
import { IVoice } from './interfaces/IVoice';
import { getEmojiByVoice } from './utils/emoji';
import { fetchVoice } from './services/fetchVoice';
import { splitStringIntoChunks } from './utils/string';

dotenv.config();

interface BotContext extends Context {
  session: {
    voice_id: string;
  };
}

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN!);
bot.use(
  session({
    defaultSession: (ctx) => ({
      voice_id: '',
    }),
  })
);

const handleTakeInputFromUser = async (ctx: BotContext, voice: IVoice[]) => {
  const voices = voice
    .sort((a, b) => {
      // Assign numeric values to each gender label
      const genderValues = { male: 0, female: 1 };
      // Compare the gender labels and sort accordingly
      return genderValues[a.labels.gender] - genderValues[b.labels.gender];
    })
    .map((voice) => ({
      text: `${voice.name} ${getEmojiByVoice(voice)}`,
      callback_data: voice.voice_id,
    }));

  const keyboard = [];
  for (let i = 0; i < voices.length; i += 2) {
    keyboard.push([voices[i], voices[i + 1]]);
  }

  // Send the reply with the populated keyboard
  await ctx.reply('Please select a voice:', {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
};

const handleTextToSpeechConversion = async (ctx: any, voice: IVoice) => {
  const voiceId = ctx.match?.input;
  await ctx.reply(
    `Good Choice, ${voice?.name || ''} ${getEmojiByVoice(
      voice!
    )} it is!\n\nNow send me the text you want to convert to speech. 🎤`
  );

  ctx.session = { ...ctx.session, voice_id: voice.voice_id };

  // Set up a text handler to capture the text input from the user
  // This handler will be responsible for processing the text input
  bot.hears(/.*/, async (ctx) => {
    const text = ctx.message.text;
    const userName = ctx.from.first_name;
    console.log('from', ctx.from);

    console.log('text', text);

    // Inform the user that text-to-speech conversion is initiated
    await ctx.reply(`Alright, let's start cooking up some audio for you! 🎧\n`);

    const chunks = splitStringIntoChunks(text, 500);
    const chunksPercentages = chunks.reduce((acc, chunk, i) => {
      const chunkPercentage = Math.min(
        Math.round((chunk.length / text.length) * 100),
        100
      );
      const cumulativePercentage =
        i === chunks.length - 1
          ? 100
          : chunkPercentage + (acc.length > 0 ? acc[acc.length - 1] : 0);
      acc.push(cumulativePercentage);
      return acc;
    }, [] as number[]);

    const buffers = [];
    for (let i = 0; i < chunks.length; i++) {
      const IsFirstChunk = i === 0;
      if (IsFirstChunk) await ctx.reply(`Processing the audio... ⏳`);
      const IsLastChunk = i === chunks.length - 1;
      const buffer = await fetchVoice({
        voice_id: ctx.session.voice_id,
        text: chunks[i],
      });
      buffers.push(buffer);
      await ctx.reply(
        `${
          IsLastChunk
            ? 'Processing Done! ✅ Sending the audio now...'
            : `${chunksPercentages[i]}% Done. ♨️`
        }`
      );
    }

    const mergedChunks = Buffer.concat(buffers);
    await ctx.replyWithAudio({
      source: mergedChunks,
      filename: `${userName}_${voice?.name}_${Date.now()}.mp3`,
    });

    await ctx.reply(
      `If you encounter any problem, Do not hesitate to DM me at @sugarnotsugam 🤗`
    );
  });
};

const handleDisplayAvailableVoices = async (ctx: Context, voices: IVoice[]) => {
  const voicesList = voices
    .map((voice) =>
      `*${voice.name} ${getEmojiByVoice(voice)}* \nBest for: ${
        voice.labels.use_case
      }, ${voice.labels.description || ''} content\\.`.replace(/-/g, '\\-')
    )
    .join('\n\n');

  await ctx.replyWithMarkdownV2(
    `Here are the available voices:\n\n${voicesList}`
  );
};

// Load voices asynchronously using dotenv and await
(async () => {
  const VOICES: IVoice[] = (await readFromJSON(VOICE_OPTIONS_PATH)) as IVoice[];

  bot.command('start', async (ctx) => {
    await ctx.reply(
      `Hi ${ctx.from.first_name}!\n\nWelcome to the Speech Sage TTS bot! 🎉\n\nTo get started right away, check out the following commands.`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Text to Speech', callback_data: 'tts' },
              { text: 'Available Voices', callback_data: 'voices' },
            ],
          ],
        },
      }
    );
  });

  bot.on('callback_query', async (ctx) => {
    const cbQueryAsAny = ctx.callbackQuery as any;
    const data = cbQueryAsAny.data;

    switch (data) {
      case 'tts':
        // Execute Text to Speech command
        await handleTakeInputFromUser(ctx, VOICES);
        // Call your function or execute your logic for Text to Speech
        break;
      case 'voices':
        // Execute Available Voices command
        await handleDisplayAvailableVoices(ctx, VOICES);
        // Call your function or execute your logic for Available Voices
        break;
      default:
        const selectedVoice = VOICES.find((voice) => voice.voice_id === data);
        if (selectedVoice) {
          await handleTextToSpeechConversion(ctx, selectedVoice);
        }
        // Handle other callback data if needed
        break;
    }
  });

  bot.command('tts', async (ctx) => {
    await handleTakeInputFromUser(ctx, VOICES);
  });

  //   bot.on('callback_query', async (ctx) => {
  //     const voiceId = ctx.callbackQuery.data;
  //     console.log(voiceId);
  //     return await ctx.reply(`You selected voice: ${voiceId}`);
  //   });

  bot.action(
    VOICES.map((voice) => voice.voice_id),
    async (ctx) => {
      const voice = VOICES.find((voice) => voice.voice_id === ctx.match?.input);
      if (voice) {
        await handleTextToSpeechConversion(ctx, voice);
      }
    }
  );

  bot.command('voices', async (ctx) => {
    await handleDisplayAvailableVoices(ctx, VOICES);
  });

  bot.launch({
    allowedUpdates: ['message', 'callback_query'],
  });
})();
