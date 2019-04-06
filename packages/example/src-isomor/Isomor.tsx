import React, { createContext, useContext, useState, useEffect } from 'react';
import md5 from 'md5';

// use something else than JSON.stringify

interface Res {
    name: string,
    args: any,
    response: any,
}

type Responses = { [id: string]: Res };

const initialState = {
    responses: {} as Responses,
};

export const IsomorContext = createContext({
    call: async (...args: any) => { },
    ...initialState,
});

interface Props {
    children: React.ReactNode
}

export const useIsomor = () => {
    const { call, responses } = useContext(IsomorContext);
    const [id, setId] = useState();
    const [response, setResponse] = useState();
    const myCall = async (fn: (...args: any) => Promise<any>, ...args: any) => {
        setId(getId(fn, ...args));
        call(fn, ...args);
    };
    useEffect(() => {
        const storeResponse: Res = responses[id];
        if (storeResponse && storeResponse.response &&
            (!response || JSON.stringify(response) !== JSON.stringify(storeResponse.response))) {
            setResponse(storeResponse.response);
        }
    }); // , [responses]
    return { call: myCall, response };
}

function getId(fn: (...args: any) => Promise<any>, ...args: any): string {
    return md5(`${fn.name}::${JSON.stringify(args)}`);
}

export class IsomorProvider extends React.Component<Props> {
    state = {
        ...initialState,
    };

    call = async (fn: (...args: any) => Promise<any>, ...args: any) => {
        const { name } = fn;
        const response = await fn(...args);
        const { responses } = this.state;
        const id = getId(fn, ...args);
        responses[id] = { name, args, response };
        this.setState({ responses });
    }

    render() {
        return (
            <IsomorContext.Provider value={{
                call: this.call,
                responses: this.state.responses,
            }}>
                {this.props.children}
            </IsomorContext.Provider>
        );
    }
}
