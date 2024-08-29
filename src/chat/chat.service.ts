import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schema/chat.schema';
import { CreateChatRequestDto } from './dto/create.chat.request.dto';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../auth/schema/user.schema';
import { SendMessageRequestDto } from './dto/send-message.request.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private logger: Logger = new Logger('ChatService');

  async createChat(createChatDto: CreateChatRequestDto): Promise<Chat> {
    const newChat = new this.chatModel({
      participants: createChatDto.participants,
      messages: [],
    });

    return newChat.save();
  }

  async getChats(userId: string): Promise<Chat[]> {
    const rawChats = await this.chatModel
      .find({ participants: new Types.ObjectId(userId) })
      .exec();
    this.logger.log(rawChats);
    return this.chatModel
      .find({ participants: new Types.ObjectId(userId) })
      .populate('participants', 'email')
      .exec();
  }

  async getChatDetails(chatId: string): Promise<Chat> {
    return this.chatModel
      .findById(chatId)
      .populate('participants', 'email')
      .populate('messages.sender', 'email')
      .exec();
  }

  async sendMessage(
    chatId: string,
    userId: string,
    sendMessageDto: SendMessageRequestDto,
  ): Promise<Chat> {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    chat.messages.push({
      sender: new mongoose.Types.ObjectId(userId),
      content: sendMessageDto.content,
      timestamp: new Date(),
    });

    return chat.save();
  }
}
