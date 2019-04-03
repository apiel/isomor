import axios from 'axios';

export async function magic<OUTPUT, INPUT>(
    action: () => (input: INPUT) => Promise<OUTPUT>,
    input: INPUT,
): Promise<OUTPUT> {
    const isServer = process.env.SERVER;

    if (isServer !== undefined) {
        // instead we could require..
        return await action()(input);
    } else {
        console.log('wasist', action.toString());
        const regGetName = (/\)\.(.+);/gim).exec(action.toString());
        if (!regGetName) {
            throw(new Error('Could not get method name to query'));
        } else {
            const [none, name] = regGetName;

            const { data } = await axios.post(
                `http://127.0.0.1:3000/${name}`,
                input,
            );
            return data;
        }
    }
}