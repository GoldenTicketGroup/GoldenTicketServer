const express = require('express')
const router = express.Router()
const showModule = require('../../../models/show')
const upload = require('../../../config/multer')

//공연 리스트 조회
router.get('/', async(req, res) => {
    //res.status(200).send("test1");
    const result = await showModule.getShowList()
    res.status(200).send(result)
});

//공연 상세 조회
router.get('/:id', async(req, res) => {
    res.status(200).send("test2");
});

//공연 등록
router.post('/', upload.single('imageUrl'), async(req, res) => {
    //res.status(200).send("test1");
    const imageUrl = req.file.location
    const name = req.body.name
    const originalPrice = req.body.originalPrice
    const discountPrice = req.body.discountPrice
    const location = req.body.location
    const accountHolder = req.body.accountHolder
    const accountNumber = req.body.accountNumber
    const showInfo = {
        imageUrl,
        name,
        originalPrice,
        discountPrice,
        location,
        accountHolder,
        accountNumber
    }
    const result = await showModule.apply(showInfo)
    res.status(200).send(result)
});

//공연 수정
router.put('/', async(req, res) => {
    res.status(200).send("test1");
});

//공연 삭제
router.delete('/', async(req, res) => {
    res.status(200).send("test1");
});

module.exports = router;
