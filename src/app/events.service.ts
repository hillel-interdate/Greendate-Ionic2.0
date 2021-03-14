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
    public logo: EventsTemplate<string>;
    public statistics: EventsTemplate<string>;
    public messages: EventsTemplate<{ type: string, data: {} }>;

    constructor() {
        this.logo = new EventsTemplate('');
        this.messages = new EventsTemplate({type: '', data: {}});
        this.statistics = new EventsTemplate('');
    }
}
