import axios from 'axios';

const withBaseUrl = (path) => `http://localhost:4000/${path}`;

export class CrudService{
    static getAllUsers(){
        return axios.get(withBaseUrl('users'));
    }

    static getUser(id){
        return axios.get(withBaseUrl(`users/${id}`))
    }

    static addUser(user){
        return axios.post(withBaseUrl('users'), user);
    }

    static deleteUser(id){
        return axios.delete(withBaseUrl(`users/${id}`));
    }

    static updateUser(id, newInfo){
        return axios.put(withBaseUrl(`users/${id}`), newInfo);
    }
}