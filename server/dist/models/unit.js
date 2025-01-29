import {Schema, model} from 'mongoose';
const unitSchema = new Schema({ // create a new schema
    name: {
        type: String, // define the type of the name property
        required: true, // enforce the name property
        unique: true, // enforce unique values
        trim: true // remove whitespace from the beginning and end of the string
    },
    missions: [{
            type: Schema.Types.ObjectId, // define the type of the missions property
            ref: 'Mission' // reference the Mission model
        }]
}, {
    toJSON: {
        virtuals: true, // include virtual properties when object is converted to JSON
    },
    timestamps: true // add timestamps to the schema
});
const Unit = model('Unit', unitSchema); // create the model
export default Unit; // export the model