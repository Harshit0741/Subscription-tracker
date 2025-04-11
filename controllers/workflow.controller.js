import { createRequire } from 'module';
import Subscription from '../models/subs.model.js';
import dayjs from 'dayjs';
import { sendReminderEmail } from '../utils/send-email.js';

const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

const REMINDERS = [7, 5, 2, 1]; // days before renewal date

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    console.log(`📩 sendReminders called with subscriptionId: ${subscriptionId}`);

    const subs = await fetchSubscription(context, subscriptionId);

    if (!subs || subs.status !== 'active') {
        console.warn(`⚠️ Subscription not found or inactive`);
        return;
    }

    const renewalDate = dayjs(subs.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`🛑 Subscription ${subscriptionId} is expired or past due`);
        return;
    }

    console.log(`✅ Subscription found: {
  id: '${subs._id}',
  user: '${subs.user?.email}',
  renewalDate: '${subs.renewalDate}'
}`);

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if (!reminderDate.isValid()) {
            console.warn(`⚠️ Invalid reminder date for ${daysBefore} days before`);
            continue;
        }

        console.log(`🕒 Checking reminder for ${daysBefore} days before: ${reminderDate.toISOString()}`);

        // 🚨 TEMP BYPASS: Skip sleepUntilReminder and send email immediately for testing
        console.log(`🚨 Skipping sleep for testing. Sending ${daysBefore} days before reminder now.`);
        await triggerReminder(context, `${daysBefore} days before reminder`, subs);

        // if (reminderDate.isAfter(dayjs())) {
        //     // Sleep until the reminder date (production logic)
        //     console.log(`⏳ Sleeping until ${reminderDate.format('YYYY-MM-DD')} to send reminder.`);
        //     await sleepUntilReminder(context, `${daysBefore} days before`, reminderDate);
        // } else {
        //     // Send the reminder immediately if the date has passed or it's today
        //     console.log(`🚨 Sending ${daysBefore} days before reminder now.`);
        //     await triggerReminder(context, `${daysBefore} days before reminder`, subs);
        // }
    }


});

const fetchSubscription = async (context, subscriptionId) => {
    console.log("📦 Fetching subscription from DB...");
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    });
};

const sleepUntilReminder = async (context, label, date) => {
    if (!date || typeof date.toDate !== 'function') {
        console.error(`❌ Invalid date in sleepUntilReminder for ${label}:`, date);
        return;
    }

    console.log(`😴 Sleeping until "${label}" reminder at ${date.toISOString()}`);
    await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subs) => {
    return await context.run(label, async () => {
        console.log(`📨 Triggering ${label} reminder email to ${subs.user?.email}`);
        await sendReminderEmail({
            to: subs.user.email,
            type: label,
            subscription: subs,
        });
    });
};
