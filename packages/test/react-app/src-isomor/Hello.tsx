import React from 'react';
import { getHello } from './server/data';
import { styleCard } from './styleCard';
import { Props } from './props';

export const Hello = ({ e2eId }: Props) => {
    const [hello, setHello] = React.useState<string>('loading...');
    const load = async () => {
        setHello(await getHello());
    }
    React.useEffect(() => { load(); }, []);
    return (
        <div style={styleCard} data-id={e2eId}>
            { hello }
        </div>
    );
}