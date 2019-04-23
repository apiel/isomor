const fs = require('fs-extra');

describe('app', () => {
    beforeAll(async () => {
        await fs.remove('./data');
        await page.goto('http://localhost:3005/', { waitUntil: 'networkidle2' });
    });

    it('should load "hello world" from server', async () => {
        const value = await page.$eval('[data-id="hello-1"]', e => e.innerText);
        expect(value).toBe('hello world');
    });

    it('should load count without cache', async () => {
        const getValues = async () => {
            const value1 = await page.$eval('[data-id="count-1"]', e => e.innerText);
            const value2 = await page.$eval('[data-id="count-2"]', e => e.innerText);
            return [value1, value2];
        }

        expect(await getValues()).toEqual(['+ 0', '+ 0']);
        await page.$eval('[data-id="count-1"] button', e => e.click());
        await page.waitFor(100); // await page.waitForNavigation({ waitUntil: 'networkidle0' })
        expect(await getValues()).toEqual(['+ 1', '+ 0']);
        await page.$eval('[data-id="count-2"] button', e => e.click());
        await page.waitFor(100);
        expect(await getValues()).toEqual(['+ 1', '+ 2']);
    });
    
    it('should load color with cache', async () => {
        const getValues = async () => {
            const value1 = await page.$eval('[data-id="color-1"] b', e => e.innerText);
            const value2 = await page.$eval('[data-id="color-2"] b', e => e.innerText);
            return [value1, value2];
        }

        expect(await getValues()).toEqual(['red', 'red']);
        await page.$eval('[data-id="color-1"] button', e => e.click());
        await page.waitFor(100);
        expect(await getValues()).toEqual(['blue', 'blue']);
    });
});
