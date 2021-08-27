const Car = require('../models/car')
const Document = require('../models/document')
const Driver =require('../models/driver')
const Revenue =require('../models/revenue')

const mongoose =  require('mongoose');
const car = require('../models/car');
const Schema = mongoose.Schema;

exports.getIndex = (req,res,next)=>{
    let today = new Date().toLocaleDateString()
    Car.find({user : req.user})
    .then(cars =>{
        return Driver.find({user : req.session.user})
        .then(drivers=>{
            
            res.render('users/index',{
                pageTitle:'home',
                path : '/',
                cars : cars,
                drivers :drivers,
                email : req.user.email,
                name : req.user.fname,
                isAuthenticated : req.session.isLoggedIn,
                date:today
            }) 
        })
    })
} 

exports.getAddCar = (req,res,next)=>{
    res.render('users/add-car',{
        pageTitle:'Add Car',
        path:'/add-car',
        isAuthenticated:req.session.isLoggedIn
    })
}

exports.getDetailCar = (req,res,next)=>{
    let message = req.flash('error');
    if(message.length>0){
        message = message[0]
    }else{
        message = null;
      }
const carId = req.params.carId
Car.findById(carId).populate('drivers')
.then(car=>{
    
    return Driver.find({user:req.user._id})
    .then(drivers =>{
        res.render('users/detail-car',{
            pageTitle:'Detail car',
            car:car,
            drivers: drivers,
            path:'/detail-car',
            isAuthenticated : req.session.isLoggedIn,
            errorMessage:message
        })
    })
})
.catch(err=>console.log(err))
}


exports.postAddCar= (req,res,next)=>{
const immatriculation = req.body.immatriculation;
const model = req.body.model;
const brand = req.body.brand;
const chasis = req.body.chasis;
const status = req.body.status;
const image = req.body.image;

const car = new Car({
    immatriculation: immatriculation,
    model: model,
    brand: brand,
    chasis: chasis,
    status: status,
    image: image,
    user : req.user,
    drivers : [],
    revenues : [],
    documents : []
})
car.save()

.then(result =>{
    res.redirect('/')
})
.catch(err=>{console.log(err)})
}

exports.postDeleteCar = (req , res , next) =>{
    const carId = req.body.carId;
    Car.findByIdAndRemove(carId)
    .then(result=>{
        res.redirect('/');
    })
}

exports.getAddDriver = (req,res,next) => {
res.render('users/add-driver',{
    pageTitle:'Add driver',
    path:'/add-driver',
   
});
}

exports.postAdddriver = (req, res,next) =>{

const fname = req.body.fname;
const lname = req.body.lname;  
const salary = req.body.salary;
const profile = req.body.profile;
const contact = req.body.contact;
const userId = req.user;  

const driver = new Driver({
    fname: fname,
    lname: lname,
    salary: salary,
    profile: profile,
    contact:contact,
    user : userId
})
driver.save()
.then(result =>{
    res.redirect('/');
})
.catch(err=>{
    console.log(err)
})
}

exports.getDetailDriver = (req,res,next)=>{
    const driverId = req.params.driverId
    Driver.findById(driverId)
    .then(driver=>{
        
        res.render('users/detail-driver',{
            pageTitle:'Detail driver',
            driver:driver,
            path:'/detail-driver',
        })
    })
    .catch(err=>console.log(err))
    }


exports.postDeleteDriver = (req , res , next) =>{
    const driverId = req.body.driverId;
    Driver.deleteOne({_id:driverId ,user:req.user._id})
    .then(result=>{
        res.redirect('/');
    })
}


exports.postAssignDriver = (req, res , next)=>{
    const carId = req.body.carId;
    const driverId = req.body.driverId;
    Car.findById(carId).populate('drivers')
    .then(car=>{
         const driversIndex = car.drivers.find(di=>{
            return di._id.toString() === driverId.toString()
        })
        const drivers = [...car.drivers]

        if(driversIndex){
          req.flash('error','driver already in the list'); 
          car.drivers = drivers;
        }else{
            drivers.push(driverId)
            car.drivers = drivers
            }
        car.save()
        req.flash('error','aassigned succesfully');
        return res.redirect('back'); 
    })
    .catch(err=>console.log(err))    
}

exports.postRemoveDriverfromCar = (req , res, next)=>{
    const driverId = req.params.driverId
    const carId = req.body.carId;
    let message = req.flash('error');
    if(message.length>0){
        message = message[0]
    }else{
        message = null;
      }
    Car.findById(carId)
    .then(car=>{
        const drivers = car.drivers.filter(d=>{
            return d._id.toString()!== driverId.toString();
        })
        car.drivers = drivers;
        car.save();
        req.flash('error','removed successfully')
        res.redirect('back'); 
     }).catch(err=>console.log(err))   
}

exports.getAddDocumentCar = (req,res,next)=>{
    const carId = req.params.carId
    res.render('users/add-documentCar',{
        pageTitle:'Add Document Car',
        path:'/add-document',
        carId:carId,
        isAuthenticated: req.session.isLoggedIn
    })
}
exports.getAddDocumentDriver = (req,res,next)=>{
    const driverId = req.params.driverId
    res.render('users/add-documentDriver',{
        pageTitle:'Add Document Driver',
        path:'/add-document',
        driverId:driverId,
       
    })
}

exports.postAddDocumentCar = (req,res,next)=>{
    const carId = req.body.carId;

    const name = req.body.name;
    const frontImage = req.body.frontImage
    const backImage = req.body.backImage
    const expiry = req.body.expiry

    const document = new Document({
        name: name,
        frontImage: frontImage,
        backImage: backImage,
        expiry: expiry,
        isAuthenticated: req.session.isLoggedIn 
    })
    document.save()
    return Car.findById(carId)
    .then(car=>{
        const documents = [...car.documents] 
        documents.push(document._id)
        car.documents = documents
        return car.save()    
    }).then(()=>{
        res.redirect('back');
    })
    .catch(err=>console.log(err))
}

exports.postAddDocumentDriver = (req,res,next)=>{
    const driverId = req.body.driverId;
    const name = req.body.name;
    const frontImage = req.body.frontImage
    const backImage = req.body.backImage
    const expiry = req.body.expiry

    const document = new Document({
        name: name,
        frontImage: frontImage,
        backImage: backImage,
        expiry: expiry
    })
     document.save()
    return Driver.findById(driverId)
    .then(driver=>{
        const documents = [...driver.documents]
        documents.push(document._id)
        driver.documents = documents
        return driver.save()
    }).then(()=>{
        res.redirect('back');
    })
    .catch(err=>console.log(err))

}

exports.getDisplayDocumentCar = (req,res,next) =>{
    const carId = req.params.carId
    
    Car.findById(carId).populate('documents')
    .then(car=>{
        res.render('users/detailDocument',{
            pageTitle:' Documents Car',
            path:'/displayDocumentCar',
            documents:car.documents
         })
    })
    .catch(err=>console.log(err))
}

exports.getDisplayDocumentDriver = (req,res,next) =>{
    const driverId = req.params.driverId
    
    Driver.findById(driverId).populate('documents')
    .then(driver=>{
        res.render('users/detailDocument',{
            pageTitle:' Documents Driver',
            path:'/displayDocumentDriver',
            documents:driver.documents
         })
    })
    .catch(err=>console.log(err))
}

exports.getEnterRevenue = (req,res,next) =>{
    let today = new Date().toLocaleDateString()
    const carId = req.params.carId;
    Car.findOne({_id:carId}).populate('drivers')
    .then(car=>{
        res.render('users/enterRevenue',{
            pageTitle:' Enter Revenue',
            path:'/enterRevenue',
            date:today,
            carId:carId,
            car:car
        })
    })
}

exports.postEnterRevenue = (req,res,next) =>{

    const date = req.body.date
    const car = req.body.carId
    const driver = req.body.driver
    const amount =  req.body.amount
    const user = req.user
    const failureDescription = req.body.failureDescription
    const failureAmount = req.body.failureAmount
    const total = amount-failureAmount;
    const revenue = new Revenue({
       date:date,
       car:car,
       driver:driver,
       amount:amount,
       user: user,
       failureDescription: failureDescription,
       failureAmount: failureAmount,
       total:total 
    })
    revenue.save()
    return Car.findById(car)
    .then(car=>{
        const revenues = [...car.revenues]
        revenues.push(revenue._id)
        car.revenues = revenues
        return car.save()
    }).then(()=>{
        res.redirect('/')
    })
    .catch(err=>console.log(err))
    
}

exports.getRevenue = (req,res,next)=>{
    Revenue.find({user:req.user}).populate('car').populate('driver')
    .then(revenues=>{
        console.log(revenues)
        res.render('users/revenue',{
            pageTitle:'Revenue',
            path:'/revenue',
            revenues:revenues,
           })
    })
   
}

exports.getSingleRevenue = (req,res,next) =>{
    const carId = req.params.carId;
    Car.findById(carId).populate('revenues')
    .then(car=>{
        res.render('users/singleRevenue',{
            pageTitle:'Revenue',
            path:'/singleRevenue',
            carId:carId,
            revenues:car.revenues
           })
    }).catch(err=>{
        console.log(err)
    })
}