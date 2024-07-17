export interface FormState {
    email: string;
    password: string;
    fullName?: string;
    confirmPassword?: string;
}

type Action =
    | { type: 'SET_EMAIL'; payload: string }
    | { type: 'SET_PASSWORD'; payload: string }
    | { type: 'SET_FULLNAME'; payload: string }
    | { type: 'SET_CONFIRM_PASSWORD'; payload: string };

export const initialFormState: FormState = {
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
};

export function formReducer(state: FormState, action: Action): FormState {
    switch (action.type) {
        case 'SET_EMAIL':
            return { ...state, email: action.payload };
        case 'SET_PASSWORD':
            return { ...state, password: action.payload };
        case 'SET_FULLNAME':
            return { ...state, fullName: action.payload };
        case 'SET_CONFIRM_PASSWORD':
            return { ...state, confirmPassword: action.payload };
        default:
            return state;
    }
}
