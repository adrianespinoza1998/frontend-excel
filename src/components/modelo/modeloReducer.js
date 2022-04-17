export const modeloReducer = (state = {}, action) => {
    switch (action.type) {
        case 'loading':
            return {
                loading: true
            }
        case 'loaded':
            return {
                loading: false
            }

        default:
            return state;
    }
}