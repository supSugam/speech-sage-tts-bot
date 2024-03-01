export const fetchVoice = async ({
  voice_id,
  text,
}: {
  voice_id: string;
  text: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.TTS_API_URL!}/${voice_id}/stream?`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
        },
        body: JSON.stringify({
          model_id: process.env.MODEL_ID!,
          text,
        }),
      }
    );
    const data = await response.arrayBuffer();
    const buffer = Buffer.from(data);
    return buffer;
  } catch (error) {
    console.error('Error fetching voice:', JSON.stringify(error, null, 2));
    throw new Error('Error fetching voice');
  }
};
