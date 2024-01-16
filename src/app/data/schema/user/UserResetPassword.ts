export interface UserResetPassword {
    id: number;
    passwordwithoutencryption: string;
    passwordconfirm: string;
    codeBase64Url:string;
  }
  