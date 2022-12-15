import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { Project } from '../project.entity';

@EventSubscriber()
export class CreateProjectSubscriber implements EntitySubscriberInterface<Project> {

    listenTo(): any {
        return Project;
    }

    afterInsert(event: InsertEvent<Project>): Promise<any> | void {
        console.log('Project was updated', event.entity.uuid);
    }
}
