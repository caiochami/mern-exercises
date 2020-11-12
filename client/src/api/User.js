import Axios from 'axios'

export default class User{

    static async get(){
        return await Axios.get('/users')
    }

    static async show(id){
        return await Axios.get('/users/' + id)
    }

    static async destroy(ids){
        return await Axios.post('/users/mass-destroy', {ids})
    }

    static async update(data){
        return await Axios.put('/users/' + data._id, data)
    }

    static async store(data){
        return await Axios.post('/users/', data)
    }

}