const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const DB = "mongodb+srv://mkaswan960:jjvuST23JyzydCtx@cluster0.f5zybrt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(DB,{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=>console.log("DataBase Connected")).catch((errr)=>{
    console.log(errr);
})