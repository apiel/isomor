describe('app', () => {
    beforeAll(async () => {
        
        await page.goto('http://localhost:3000/', {waitUntil: 'networkidle2'});
    });

    it('should load "hello world" from server', async () => {
        const value = await page.$eval('[data-id="hello-1"]', e => e.innerText);
        expect(value).toBe('hello world');
    });
});
