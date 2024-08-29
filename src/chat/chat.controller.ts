import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatRequestDto } from './dto/create.chat.request.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Chat } from './schema/chat.schema';
import { SendMessageRequestDto } from './dto/send-message.request.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  private logger: Logger = new Logger('ChatController');

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard())
  createChat(@Body() createChatDto: CreateChatRequestDto): Promise<Chat> {
    return this.chatService.createChat(createChatDto);
  }

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard())
  async getChats(@Req() req): Promise<Chat[]> {
    return this.chatService.getChats(req.user._id);
  }

  @ApiBearerAuth()
  @Get('/:chatId')
  @UseGuards(AuthGuard())
  async getChatDetail(@Param('chatId') chatId: string): Promise<Chat> {
    return this.chatService.getChatDetails(chatId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post(':chatId/messages')
  async sendMessage(
    @Param('chatId') chatId: string,
    @Req() req,
    @Body() sendMessageDto: SendMessageRequestDto,
  ): Promise<Chat> {
    return this.chatService.sendMessage(
      chatId,
      req.user.userId,
      sendMessageDto,
    );
  }
}
