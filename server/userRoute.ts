import express from 'express'
import fs from 'fs'
import formidable from "formidable";
import { knex } from './knex';
import AWS from 'aws-sdk';
import awsCloudfrontInvalidate from 'aws-cloudfront-invalidate';

export const userRoute = express.Router();

const s3 = new AWS.S3({
    accessKeyId: "AKIAZ4X2C6I5JGJ7B3MX",
    secretAccessKey: "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",
})

//   S3_BUCKET_NAME=unipiece
//   CLOUDFONT_DISTRIBUTION=E3P66WD0E266T0
// AWS_ACCESS_KEY_ID=AKIAZ4X2C6I5JGJ7B3MX
// AWS_ACCESS_KEY_ID=bzHlDqDVI+WNeYrkU/2Qoc2hxThKoWrby53+On10
// AWS_CLOUDFONT_DISTRIBUTION=E3P66WD0E266T0
// AWS_S3_REGION_NAME=ap-northeast-2

const uploadDir = "product_image";
fs.mkdirSync(uploadDir, { recursive: true })
userRoute.use("/product_image", express.static('/product_image'))

userRoute.post('/create_product', async (req, res) => {
    // console.log({ req })

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFiles: 1,
        maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB
        filter: part => part.mimetype?.startsWith('image/') || false,
    })

    // form.on('field', (field:any, value:any) => {
    //     console.log(`this is ${field} , and value is ${value}`)
    // })

    // form.on('file', (file:any, value:any) => {
    //     console.log(`this is ${file}`)
    //     console.log("and value is : ", value)

    //     fs.rename(file.path,)
    //     (new Date().toDateString().split(' ').join())
    // })

    form.parse(req, async (err, fields: any, files: any) => {
        try {
            if (err) console.error({ err })
            console.log({
                'fields': fields,
                'files': files
            })

            const getCategoryId = await knex('category').select('id').where("name", fields.category)
            console.log(getCategoryId[0].id)

            // FIXME: series ID not yet created in DB , please enable when user series function is ready
            // const getSeriesId = await knex('series').select('id').where("name", fields.category)
            // console.log(getCategoryId[0].id)

            const owner_id = fields.user_id
            const name = fields.name
            const price = fields.price            
            const type = fields.product_type
            // const series_id = fields.series FIXME:
            const image = files.newFilename
            const content = fields.content
            const quantity = 1
            const created_at = new Date()
            const category_id = getCategoryId[0].id
            const credit_by = fields.credit_by

            const imagePath = uploadDir + "/" + image
            const blob = fs.readFileSync(imagePath)

            const uploadedImage = await s3.upload({
                Bucket: "unipiece/img",
                Key: files.newFilename,
                Body: blob,
            }).promise()

            const uploadImgURL = uploadedImage.Location
            console.log("[AWS S3]image uploaded to S3 :", uploadImgURL)

            const distributionId = 'E3P66WD0E266T0'; // something like this

            awsCloudfrontInvalidate(distributionId).then((data) => {
                console.log('invalidating created', data.Invalidation.Id);
            });

            const res = await knex('product').insert({ image: image, owner_id: owner_id, name: name, price: price, type: type, content: content, quantity: quantity, created_at: created_at, credit_by: credit_by, category_id: category_id }).returning('id')
            console.log(res)
        }
        catch (err) {
            return res.status(500).json(`submitting error : ${err}`)
        }
        return res.status(200).json(`product submitted successfully!`)
    })

})

userRoute.post('/create_product', async (req, res, next) => {
    try{
    const form = formidable({
        multiples: true,
        uploadDir: uploadDir,
        filename: (name: any, ext: any, part: any) => 
            part.originalFilename,
            maxFileSize: 2**30*50,
      });
    //   res.json()
    //   console.log(form)
    //   console.log(result)
    //   getCropImages()
    //   form.uploadDir = uploadFolder+"/"+files.someExpressFiles.originalFilename;
    // form.on('progress',(bytesReceived,bytesExpected)=>{console.log({bytesReceived,bytesExpected})})

     form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        next(err);
        return;
      }
      let uploadedPath = files.file.filepath
      
      res.json({uploadedPath: uploadedPath})

    });
    }catch (err) {
        console.log(err)
    }
  });


userRoute.get('/test', async (req, res) => {
    const body = JSON.parse(req.body)
    console.log("hihihihihihhihih", body)
    res.json({data: body})
})

userRoute.get('/testupload', async (req, res) => {

    try{   

        const imagePath = "./testupload/XXX.png"
        const blob = fs.readFileSync(imagePath)

        const uploadedImage = await s3.upload({
            Bucket: "unipiece/img",
            Key: "XXX1.png",
            Body: blob,
        }).promise()

        const uploadImgURL = uploadedImage.Location
        console.log("[AWS S3] image uploaded to S3 :", uploadImgURL)

        const distributionId = 'E3P66WD0E266T0'; // something like this

        awsCloudfrontInvalidate(distributionId).then((data) => {
            console.log('[AWS Cloudfront] invalidating created', data.Invalidation.Id);
        });
        res.json({status: true, url: uploadImgURL})
        return
    }catch (err){
        res.json({status: false, message: err.message})
        return
    }
})

/*********************** comparing login JWT token user ID , with params url user ID ***********************/


userRoute.post('/:id', async (req, res) => {
    if (!req.body.tokenInfo) {
        return
    }

    try {
        console.log([req.body, req.params, req.query])

        // console.log(req.url)
        // console.log(req.baseUrl)
        // console.log(req.originalUrl)
        // console.log(req.body)
        console.log(req.body.tokenInfo)

        const tokenUserId = req.body.tokenInfo.userId
        console.log(req.body.tokenInfo.userId.toString())

        const postParamsId = req.params.id
        console.log({ postParamsId })
        // console.log("Params User ID : ", paramsId.UserId)
        // const verifiedUserUrl = req.baseUrl + "/" + paramsId.UserId
        // console.log(verifiedUserUrl)

        if (tokenUserId == postParamsId) {
            return res.json({ status: true })
        } else {
            return res.json({ status: false })
        }

    } catch (err) {
        console.log("[ERROR]userRoute.post('/:id') ", err.message)
    }
})


/*********************** fetch user profile detail to display on corresponding params url ***********************/

userRoute.get('/:id', async (req, res) => {
    // console.log(req.body, req.params, req.query)
    try {

        const getParamsId = req.params.id
        console.log({ getParamsId })

        const response = await knex('users').select("*").where('id', getParamsId)
        const user = response[0]
        return res.status(200).json(user)
    }
    catch (err) {
        return res.status(500).json({ status: err })
    }
})



/***************** fetch username on display to head bar *******************/

userRoute.post('/', async (req, res) => {
    // console.log(req)
    // console.log(req.body, req.params, req.query)
    try {

        const userId = req.body.userId;
        console.log({ userId })

        const response = await knex('users').select("name", "image").where('id', userId)
        const user = response[0]
        return res.status(200).json(user)
    }
    catch (err) {
        return res.status(500).json({ status: err })
    }

})