import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subs.model.js";


export const createSubscription = async (req, res, next) => {
    try {
        const subs = await Subscription.create({
            ...req.body,
            user: req.user._id
        });
        const workflowResponse = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subs/reminder`,
            body: {
                subscriptionId: subs.id,
            },
            headers: {
                'content-type': 'application/json'
            },
            retries: 0,
        })

        res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            data: {
                ...subs.toObject(),
                workflowrunId: workflowResponse.workflowRunId || null,
            }
        });
    }catch(error){
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try{
        if(req.user.id !== req.params.id){
            const error = new Error('You are not authorized to view this subscription');
            error.statusCode = 401;
            throw error;
        }
        const subs = await Subscription.find({user: req.user.id});
        res.status(200).json({
            success: true,
            message: "Subscriptions retrieved successfully",
            data: subs,
        });
    }catch(error){
        next(error);
    }
}