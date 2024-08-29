import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRequestDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  password?: string;
}
