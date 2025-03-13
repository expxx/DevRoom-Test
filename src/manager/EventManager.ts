import { Client } from "discord.js";
import Event from "../types/Event";
import { debug, info } from "../util/logger";
import fs from 'fs';
import path from "path";

class EventManager {
    public static events: Event[];

    constructor() {
        EventManager.events = [];
    }

    public registerEvent(event: Event) {
        EventManager.events.push(event);
    }

    public getEvents() {
        return EventManager.events;
    }

    public setEvents(events: Event[]) {
        EventManager.events = events;
    }

    public registerToClient(client: Client) {
        for (const event of EventManager.events) {
            if (event.once) {
                info(`[EVNT] Registering once event ${event.name}`);
                client.once(event.name, async (...args) => await event.handle(client, ...args));
            } else {
                info(`[EVNT] Registering many event ${event.name}`);
                client.on(event.name, async (...args) => await event.handle(client, ...args));
            }
        }
    }

    public async loadEvents(dir: string) {
        try {
            if (!dir) dir = __dirname + '/../events';
            const files = fs.readdirSync(dir, { withFileTypes: true });
            for (const file of files) {
                if (file.isDirectory()) {
                    info(`[EVNT] [DIR] Surfing ${file.name}`);
                    await this.loadEvents(path.join(dir, file.name));
                } else {
                    if(file.name.endsWith(".sig")) continue;
                    info(`[EVNT] [FILE] Slapping ${file.name}`);
                    const event = await import(`${path.join(dir, file.name)}`);
                    const eventObj = (await event.default) as Event;
                    this.registerEvent(eventObj);
                }
            }
        } catch (ex) {
            info('[EVNT] No events to load.');
        }
    }
}

export default EventManager;