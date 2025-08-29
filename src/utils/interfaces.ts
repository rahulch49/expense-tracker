export interface SignupBody {
    name: string,
    email: string,
    phone: string,
    password: string,
}

export interface LoginBody {
    email: string,
    password: string,
}