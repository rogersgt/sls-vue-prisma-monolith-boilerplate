export class User {
  id: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  email: string;
  emailVerified: boolean;
  googleUserId: string;
  
  constructor({
    id,
    firstName,
    lastName,
    pictureUrl,
    email,
    emailVerified,
    googleUserId
  }: Partial<{
    id: string;
    firstName: string;
    lastName: string;
    pictureUrl: string;
    email: string;
    emailVerified: boolean;
    googleUserId: string;
  }>) {
    this.id = id ?? '';
    this.email = email ?? '';
    this.firstName = firstName ?? '';
    this.lastName = lastName ?? '';
    this.pictureUrl = pictureUrl ?? '';
    this.emailVerified = emailVerified ?? false;
    this.googleUserId = googleUserId ?? '';
  }
}
