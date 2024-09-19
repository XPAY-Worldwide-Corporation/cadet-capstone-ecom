import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { HASH_SALT_ROUNDS } from 'src/config';

@Injectable()
export class BcryptService {
   private readonly saltRounds = HASH_SALT_ROUNDS;

   async hashPassword (password : string) {
      const salt = await bcrypt.genSalt(this.saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      return hashedPassword;
   }

   async comparePassword(hashedPassword : string, plainPassword : string) {
      const comparedPassword = await bcrypt.compare(hashedPassword, plainPassword);
      return comparedPassword;
   }

}
