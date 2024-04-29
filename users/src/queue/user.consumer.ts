import { IUserDocument } from "@users/database/@types/user.interface";
import { createQueueConnection } from "@users/queue/connection";
import { Channel, ConsumeMessage } from "amqplib";
import UserService from '@users/database/repositories/user.repository';
import { logger } from "@users/utils/logger";

export const consumeUserDirectMessage = async (channel: Channel): Promise<void> => {
  try {

    if (!channel) {
      channel = (await createQueueConnection()) as Channel;
    }

    const exchangeName = "microsample-user-update";
    const routingKey = "user-applier";
    const queueName = "user-applier-queue"

    await channel.assertExchange(exchangeName, 'direct');
    const applierQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false })
    await channel.bindQueue(applierQueue.queue, exchangeName, routingKey);

    channel.consume(applierQueue.queue, async (msg: ConsumeMessage | null) => {
      const userService = new UserService()

      const { type } = JSON.parse(msg!.content.toString())
      if (type === 'auth') {
        const { username, email, profile, phoneNumber, createdAt } = JSON.parse(msg!.content.toString());
        const user: IUserDocument = {
          username,
          email,
          profile,
          favorites: [],
          phoneNumber,
          createdAt
        }

        await userService.createUser(user);
      }
    })
  } catch (error) {
    logger.error(`UsersService UserConsumer consumeUserDirectMessage() method error: ${error}`)
    throw error;
  }
}