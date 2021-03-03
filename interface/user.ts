export interface User extends Login{
    nome: string;
    token: string;
}

interface Login{
    email: string;
    password: string;
}