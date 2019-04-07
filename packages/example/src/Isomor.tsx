import React, { createContext, useContext, useState, useEffect } from 'react';
import md5 from 'md5';

// use something else than JSON.stringify
// if time of last query with same id is less than 200ms use cache
// need to be able to update cache (like mutation)

interface Res {
    name: string,
    args: any,
    response: any,
    requestTime: Date,
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
        setId(getId(fn, args));
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

function getId(fn: (...args: any) => Promise<any>, args: any): string {
    return md5(`${fn.name}::${JSON.stringify(args)}`);
}

export class IsomorProvider extends React.Component<Props> {
    state = {
        ...initialState,
    };

    setResponse = (
        id: string,
        fn: (...args: any) => Promise<any>,
        args: any,
        requestTime: Date,
        response: any,
    ) => {
        return new Promise((resolve) => {
            const { name } = fn;
            const { responses } = this.state;
            responses[id] = { name, args, response, requestTime };
            this.setState({ responses }, resolve);
        });
    }

    setRequestTime = async(
        id: string,
        fn: (...args: any) => Promise<any>,
        args: any,
    ) => {
        const requestTime = new Date();
        const data = this.state.responses[id];
        const response = data ? data.response : null;
        await this.setResponse(id, fn, args, requestTime, response);
        return requestTime;
    }

    call = async (fn: (...args: any) => Promise<any>, ...args: any) => {
        const id = getId(fn, args);
        const requestTime = await this.setRequestTime(id, fn, args);
        const response = await fn(...args);
        await this.setResponse(id, fn, args, requestTime, response);
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
