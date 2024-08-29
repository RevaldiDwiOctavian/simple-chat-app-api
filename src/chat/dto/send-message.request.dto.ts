import { ApiProperty } from '@nestjs/swagger';

export class SendMessageRequestDto {
  @ApiProperty()
  content: string;
}
