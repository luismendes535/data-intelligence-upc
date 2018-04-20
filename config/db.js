const mongoose = require('mongoose');

mongoose.connect('mongodb://Luismendes535:root@ds231529.mlab.com:31529/dataintelligenceuminho')
.then(()=> console.log('MongoDB Connected'))
.catch(err=> console.log(err));
