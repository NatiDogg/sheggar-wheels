export interface UserRegisteredEvent{
      user: {
          id: string,
          email: string,
          
      };
      verifyToken: string;
      registeredAt: Date;
}
export interface UserForgetPasswordEvent {
    email: string;
    name: string;
    resetUrl: string;
}