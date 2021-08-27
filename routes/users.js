const express = require('express');
const router = express.Router()
const userController = require('../controllers/user')   
const isAuth = require('../middleware/is-auth')

router.get('/',isAuth, userController.getIndex);

router.get('/add-car',isAuth, userController.getAddCar);

router.post('/add-car',isAuth, userController.postAddCar);

router.get('/detail-car/:carId' ,isAuth, userController.getDetailCar)

router.post('/delete-car',isAuth, userController.postDeleteCar);

router.post('/delete-driver',isAuth, userController.postDeleteDriver);

router.get('/add-driver',isAuth, userController.getAddDriver);

router.post('/add-driver',isAuth, userController.postAdddriver);

router.get('/detail-driver/:driverId' ,isAuth, userController.getDetailDriver)

router.post('/assign-driver',isAuth,userController.postAssignDriver)

router.post('/remove-driver/:driverId',isAuth, userController.postRemoveDriverfromCar);

router.get('/add-documentCar/:carId',isAuth,userController.getAddDocumentCar);

router.get('/add-documentDriver/:driverId',isAuth,userController.getAddDocumentDriver);

router.post('/add-documentCar',isAuth, userController.postAddDocumentCar)

router.post('/add-documentDriver',isAuth, userController.postAddDocumentDriver)

router.get('/displayDocumentCar/:carId',isAuth, userController.getDisplayDocumentCar)

router.get('/displayDocumentDriver/:driverId',isAuth, userController.getDisplayDocumentDriver)

router.get('/enterRevenue/:carId', isAuth, userController.getEnterRevenue)

router.post('/enterRevenue', isAuth, userController.postEnterRevenue)

router.get('/revenue', isAuth , userController.getRevenue)

router.get('/single-revenue/:carId', isAuth , userController.getSingleRevenue)



module.exports = router