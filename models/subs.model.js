import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price must be a positive number'],
    },
    currency: {
        type: String,
        required: [true, 'Subscription currency is required'],
        enum: ['USD', 'EUR', 'GBP','INR'],
        default: 'INR',
    },
    frequency:{
        type: String,
        required: [true, 'Subscription frequency is required'],
        enum: ['weekly','monthly', 'yearly'],
    },
    category: {
        type: String,
        required: [true, 'Subscription category is required'],
        enum: ['enterprise','sports','entertainment','news','education'], 
        default: 'basic',
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value)=> value <= new Date(),
            message: 'Start date cannot be in the future',
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function(value){
                return value > this.startDate
            },
            message: 'Renewal date must be after start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
}, {timestamps: true});

subscriptionSchema.pre('save', function(next) {
    if (!this.renewalDate) {
        const renewalPeriod = {
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency]);
    }
    if(this.renewalDate < new Date()){
        this.status = 'inactive';
    }
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
