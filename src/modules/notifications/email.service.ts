import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  sendRegistrationLink(email: string, activationLink: string): void {
    console.log(`[EMAIL] Registration link for ${email}: ${activationLink}`);
  }

  sendEmploymentInvitation(email: string, invitationLink: string): void {
    console.log(`[EMAIL] Employment invitation for ${email}: ${invitationLink}`);
  }
}
