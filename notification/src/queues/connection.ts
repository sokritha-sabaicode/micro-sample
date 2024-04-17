import { getConfig } from '@notifications/server';
import { logger } from '@notifications/utils/logger';
import client, { Channel, Connection } from 'amqplib';
import {
  consumeAuthEmailMessages,
  consumeSubmissionEmailMessages,
} from './email.consumer';

export async function createQueueConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(
      `${getConfig().rabbitMQ}`
    );
    const channel: Channel = await connection.createChannel();
    logger.info('Nofiication server connected to queue successfully...');
    closeQueueConnection();
    return channel;
  } catch (error) {
    logger.error(
      `NotificationService createConnection() method error: ${error}`
    );
    return undefined;
  }
}

function closeQueueConnection() {
  process.once(
    'SIGINT',
    async (channel: Channel, connection: Connection): Promise<void> => {
      await channel.close();
      await connection.close();
    }
  );
}

export async function startQueue(): Promise<void> {
  const emailChannel: Channel = (await createQueueConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeSubmissionEmailMessages(emailChannel);

  await emailChannel.assertExchange('microsample-email-notification', 'direct');
  await emailChannel.assertExchange(
    'microsample-submission-notification',
    'direct'
  );

  const message = JSON.stringify({
    name: 'microsample',
    service: 'notification service',
  });
  const message1 = JSON.stringify({
    name: 'microsample',
    service: 'notification service',
  });
  emailChannel.publish(
    'microsample-email-notification',
    'auth-email',
    Buffer.from(message)
  );
  emailChannel.publish(
    'microsample-submission-notification',
    'submission-email',
    Buffer.from(message1)
  );
}
