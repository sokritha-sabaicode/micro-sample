import { logger } from '@notifications/utils/logger';
import { Channel, ConsumeMessage } from 'amqplib';
import { createQueueConnection } from './connection';
import { getConfig } from '@notifications/server';

export async function consumeAuthEmailMessages(
  channel: Channel
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createQueueConnection()) as Channel;
    }

    const exchangeName = 'microsample-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';

    await channel.assertExchange(exchangeName, 'direct');
    const queue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(queue.queue, exchangeName, routingKey);

    channel.consume(queue.queue, async (msg: ConsumeMessage | null) => {
      logger.info(JSON.parse(msg!.content.toString()));
      channel.ack(msg!);
    });
  } catch (error) {
    logger.error(
      `NotificationService EmailConsumer consumeAuthEmailMessages() method error: ${error}`
    );
  }
}

export async function consumeSubmissionEmailMessages(
  channel: Channel
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createQueueConnection()) as Channel;
    }

    const exchangeName = 'microsample-submission-notification';
    const routingKey = 'submission-email';
    const queueName = 'submission-email-queue';

    await channel.assertExchange(exchangeName, 'direct');
    const queue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(queue.queue, exchangeName, routingKey);

    channel.consume(queue.queue, async (msg: ConsumeMessage | null) => {
      const {receiverEmail, username, verifyLink, resetLink,template} = JSON.parse(msg!.content.toString());
      const locals = {
        appLink: `${getConfig().clientUrl}`,
        appIcon: '',
        username,
        verifyLink,
        resetLink
      }
    });
  } catch (error) {
    logger.error(
      `NotificationService EmailConsumer consumeAuthEmailMessages() method error: ${error}`
    );
  }
}
