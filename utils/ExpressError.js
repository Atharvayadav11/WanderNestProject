class ExpressError  extends Error{
  constructor(statusCode,message){
    super();
    this.statusCode= statusCoade;
    this.message=message;
  
  }
}

module.exports=ExpressError;