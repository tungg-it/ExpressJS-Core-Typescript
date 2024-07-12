import { IsNotEmpty, IsString } from 'class-validator';

export class IExample {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  tiktok: string;

  @IsString()
  @IsNotEmpty()
  facebook: string;

  @IsString()
  @IsNotEmpty()
  youtube: string;
}

export class ICreateExampleRequest extends IExample {}
export class ICreateExampleResponse extends IExample {
  id: string;
}
