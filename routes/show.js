const router=require('express').Router();
const File=require('../models/file');

router.get('/:uuid',async(req,res)=>{
    try {
        const file= await File.findOne({uuid:req.params.uuid});
        if(!file)
        {
            return res.render("download",{error:"Link has been expired!"})
        }

        return res.render('download',{
            filename:file.filename,
            uuid:file.uuid,
            filesize:file.size,
            downloadLink:`${req.protocol}://${req.get("host")}/files/download/${file.uuid}`
        })

        
    } catch (error) {
        return res.render('download',{error:"Something went wrong"});
    }

})


router.get('/',(req,res)=>{
    return res.json({
        "name":"Akash",
        "clg":"mmmut"
    })
})

module.exports=router