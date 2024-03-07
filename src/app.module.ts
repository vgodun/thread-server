import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { SocketClient } from './gateway/gateway';




// @Module({
//   imports: [LikesModule,SocketModule,GatewayModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


@Module({
  imports: [GatewayModule],
  controllers: [AppController],
  providers: [AppService,SocketClient],
})
export class AppModule {}
