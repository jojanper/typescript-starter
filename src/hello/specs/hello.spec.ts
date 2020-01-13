import { Hello } from '../hello';

describe('Hello', () => {
    it('renders header', () => {
        const elem = document.createElement('div');
        const hello = new Hello(elem);
        hello.fill();

        expect(elem.innerHTML).toContain('Hello world');
    });
});
