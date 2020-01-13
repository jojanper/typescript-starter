export class Hello {
    constructor(private elem: HTMLElement) {
    }

    public fill(): void {
        this.elem.innerHTML = '<h1>Hello world!</h1>';
    }
}
