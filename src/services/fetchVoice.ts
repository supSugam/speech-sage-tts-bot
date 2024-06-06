import fetch from 'node-fetch';

export const fetchVoice = async ({
  voice_id,
  text,
}: {
  voice_id: string;
  text: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.TTS_API_URL!}/${voice_id}/stream`,
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

    if (!response.ok) {
      const err = await response.json();
      console.log('err', err);
      throw new Error(
        `Failed to fetch voice: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.arrayBuffer();
    const buffer = Buffer.from(data);
    return buffer;
  } catch (error) {
    console.error('Error fetching voice:', error);
    throw new Error('Error fetching voice');
  }
};
