import Axios from 'axios'

export default class Exercise{

    static async get(){
        return await Axios.get('/exercises')
    }

    static async show(id){
        return await Axios.get('/exercises/' + id)
    }

    static async destroy(id){
        return await Axios.delete('/exercises/' + id)
    }

    static async update(id, data){
        return await Axios.put('/exercises/' + id, data)
    }

    static async store(data){
        return await Axios.post('/exercises/', data)
    }

}