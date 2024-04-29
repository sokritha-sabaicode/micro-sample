import { Schema, model } from 'mongoose';

const companySchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  industries: [{
    type: String,
    required: true
  }],
  location: { type: "Point", coordinates: [Number] },
  website: String,
  logo: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  versionKey: false // remove __v from return doc of mongodb
})

const CompanyModel = model("Company", companySchema)

export default CompanyModel