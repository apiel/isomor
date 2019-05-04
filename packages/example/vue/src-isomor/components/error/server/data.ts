export async function getSomethingWithError() {
    throw new Error('an example of error handling');

    return 'nothing';
}