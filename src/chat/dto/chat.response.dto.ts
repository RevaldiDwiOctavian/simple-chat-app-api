import { User } from '../../auth/schema/user.schema';

export class ChatResponseDto {
  readonly participants: User[];
}
