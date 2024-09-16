import dynamoose from 'dynamoose';


const userSchema = new dynamoose.Schema(
  {
    name: {
      type: String,
      required:true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      hashKey:true,
    },
    address: {
      type: String,
    },
    wrongPasswordCount: {
      type: Number,
      default: 0,
    },
    lockedTemp: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
    },
    expireTime: {
      type: Number,
    },
    createdOn: {
      type: String, 
      required: false,
      default: new Date().toISOString(), // Use Date.now as default value
    },
  },
  { autoCreate: false }
);

const userModel = dynamoose.model('User', userSchema, { tableName: 'user' }); 

export { userModel };
