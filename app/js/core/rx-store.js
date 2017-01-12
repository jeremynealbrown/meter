import deepEql from 'deep-eql'
import {Observable, Subject, Scheduler} from 'rxjs'

class RxStore {
    constructor(state = {}) {
        this.subject = new Subject();
        this.dispatcher = new Subject();
        const store = this.dispatcher
            .flatMap((action) => {
                if(action instanceof Observable) return action;
                return Observable.from([action]);
            })
            .startWith(state)
            .scan(this.reducer)
            .distinctUntilChanged((a, b) => {
                return deepEql(a, b);
            });
            
        store.subscribe(this.subject);
    }

    reducer(state, action) {
        return state;
    }

    dispatch(action) {
        this.dispatcher.next(action); 
        if(action.data instanceof Observable) {
            this.dispatcher.next(action.data);
        }
        return action;
    }

    subscribe(func, property) {
        if(property) {
            const get_property = (object, property) => {
                var iter = 0;
                var part = null; 
                var obj = object;
                var parts = property.split('.');
                while(parts.length && obj != null) {
                    part = parts.shift();
                    obj = obj[part];
                    iter++;
                }
                return obj
            };
            return this.subject.distinctUntilChanged((a, b) => {
                var prev = get_property(a, property);
                var next = get_property(b, property);
                return prev == next;
            })
            .subscribe(func);
        } else {
            return this.subject.subscribe(func);
        }
    }
}

export default RxStore
