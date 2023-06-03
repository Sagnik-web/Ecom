class ApiFeatures{
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        }:{}

        this.query = this.query.find({...keyword})

        return this
    }

    filter(){
        const quaryCopy = {...this.queryStr}

        const removeField = ['limit','page','kayword']
        removeField.filter(key => delete quaryCopy[key])

        let queryStr = JSON.stringify(quaryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=>`$${key}`)
        this.query = this.query.find(JSON.parse(queryStr))

        return this

    }

    pagination(numberOfProduct){
        const currentPage = this.queryStr.page || 1

        const skipProduct = (currentPage-1)*numberOfProduct
        
        this.query = this.query.limit(numberOfProduct).skip(skipProduct)

        return this
    }
}

module.exports = ApiFeatures