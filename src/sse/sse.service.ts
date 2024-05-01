import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { CvEvent } from './entity/sseEntity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cv } from 'src/cv/entities/cv.entity';
@Injectable()
export class SseService {
    private readonly sseClients = new Map<string, Subject<string>>();

    constructor(
        @InjectRepository(CvEvent)
        private cvEventRepository: Repository<CvEvent>,   
    ) {}

    async sendMessageToClient(clientId: string, cv: Cv, message: string) {
        const cvEvent = new CvEvent();
        cvEvent.cv = cv;
        cvEvent.type = message;
        cvEvent.date = new Date();

        console.log(`Sending message to client ${clientId}: ${message}`);
        
        const client = this.sseClients.get(clientId);
        if (client) {
            client.next(message);
        } else {
            console.warn(`Client ${clientId} not found.`);
        }
    }

    addClient(clientId: string): Observable<any> {
        console.log(`Adding client ${clientId}`);
        const client = new Subject<any>();
        this.sseClients.set(clientId, client);
        
        return client.asObservable();
    }

    removeClient(clientId: string) {
        console.log(`Removing client ${clientId}`);
        this.sseClients.delete(clientId);
    }

    getSubject(clientId: string) {
        return this.sseClients.get(clientId);
    }
}

