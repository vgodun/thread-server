import { Get, Injectable, OnModuleInit, Res } from "@nestjs/common";
import { io, Socket } from "socket.io-client";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@Injectable()
export class SocketClient implements OnModuleInit {
    public socketClient: Socket;

    constructor() {
        this.socketClient = io("https://thread-blond.vercel.app/");
    }

    onModuleInit() {
        this.registerConsumerEvents();
    }

    private registerConsumerEvents() {
        this.socketClient.on("connect", () => {
            console.log("Connected to Gateway");
        });
        // Приймаємо події "likes" і виводимо їх до консолі
        this.socketClient.on('likes', (payload: any) => {
            console.log('SocketClient');
            console.log('payload', payload);
        });
    }

    // Метод для відправлення повідомлення про лайк
    sendLike(threadId: string, userId: any) {
        this.socketClient.emit('likes', { threadId, userId });
    }
}

@Injectable()
@WebSocketGateway({
    cors: {
        origin: ['https://thread-blond.vercel.app/']
    }
})
export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connect', (socket) => {
            console.log('new connection', socket.id);
        })
    }

    // Приймаємо повідомлення про лайк і ретранслюємо його усім підключеним клієнтам
    @SubscribeMessage('likes')
    handleLikesEvent(client: any, payload: any) {
        console.log('Received like:', payload);
        this.server.emit('likes', payload);
    }
}