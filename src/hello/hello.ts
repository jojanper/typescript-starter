import { Observable } from 'rxjs';

export function createObservable(): Observable<{}> {
    return new Observable((observer) => {
        // observable execution
        observer.next('hello');
        observer.complete();
    });
}

export class Hello {
    constructor(private elem: HTMLElement) {
    }

    public fill(): void {
        this.elem.innerHTML = '<h1>Hello world!</h1>';
    }
}
