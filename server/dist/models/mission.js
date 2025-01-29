import { Schema, model } from 'mongoose';
const missionSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (endDate) {
                return endDate >= this.startDate;
            },
            message: 'End date must be after or equal to start date'
        }
    },
    unit: {
        type: Schema.Types.ObjectId,
        ref: 'Unit',
        required: true
    }
}, {
    toJSON: {
        virtuals: true,
    },
    timestamps: true
});
const Mission = model('Mission', missionSchema);
export default Mission;