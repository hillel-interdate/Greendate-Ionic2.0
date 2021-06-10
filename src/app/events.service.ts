import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
class EventsTemplate<T> {
    public store: Observable<T>;
    // tslint:disable-next-line:variable-name
    private _store$: BehaviorSubject<T>;
    public subscribe;

    constructor(data: any) {
        this._store$ = new BehaviorSubject<T>(data);
        this.store = this._store$.asObservable();
        this.subscribe = this.store.subscribe;
    }

    publish(value: T) {
        this._store$.next(value);
    }

}

export class EventsService {
    private logo$: EventsTemplate<string>;
    private statistics$: EventsTemplate<string>;
    private status$: EventsTemplate<string>;
    private messages$: EventsTemplate<{ type: string, data: {} }>;
    private user$: EventsTemplate<{ type: string, notifications: {} }>;

    constructor() {
        this.logo$ = new EventsTemplate('');
        this.messages$ = new EventsTemplate({type: '', data: {}});
        this.statistics$ = new EventsTemplate('');
        this.status$ = new EventsTemplate('');
        this.user$ = new EventsTemplate({type: '', notifications: {}});

    }

    public get logo() {
        return this.logo$.store;
    }

    public setLogo(val) {
        this.logo$.publish(val);
    }

    public get statistics() {
        return this.statistics$.store;
    }

    public setStatistics(val) {
        this.statistics$.publish(val);
    }

    public get user() {
        return this.user$.store;
    }

    public setUser(val) {
        this.user$.publish(val);
    }

    public get messages() {
        return this.messages$.store;
    }

    public setMessages(val) {
        this.messages$.publish(val);
    }

    public get status() {
        return this.status$.store;
    }
    public setStatus(val) {
        this.status$.publish(val);
    }
}
