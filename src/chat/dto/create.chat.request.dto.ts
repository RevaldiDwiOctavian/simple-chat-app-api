import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly participants: string[];
}
