import { createParamDecorator, ExecutionContext} from "@nestjs/common";
 
export const CurrentUser = createParamDecorator(

    (data:unknown,cx:ExecutionContext)=>{
          const {user} = cx.switchToHttp().getRequest()

          return user
    }
    
    )