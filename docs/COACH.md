# Emelifts for Em

This is your coaching app. Clients pay on the website, then train and message you here. It replaces Trainerize for new wedding clients.

## Log in

1. Go to [emelifts.com/login](https://emelifts.com/login)
2. Use the coach email and password you were given
3. You land on **Clients**

If a password is still the old demo one, change it under **Account**.

## What clients see

After they pay, they log in with the email and password they chose at checkout.

- **Today**: only this week. Dots are lift days. They tap a day, then Start, then log weights and reps, then Finish workout
- **Progress**: habits for the week
- **Messages**: a chat with you. They can edit a message for about 2 hours, or undo send for 30 seconds
- They cannot see week 5 while they are in week 1. That is on purpose

## Your week

**Programs** is the master plan for everyone on that product.

- **Lift with EME**: monthly, 4-week block
- **6 Week Challenge**: 6 weeks
- **12 Week Wedding Prep**: 12 weeks (this is what the homepage sells right now)

Week 1 is the default. Weeks 2–12 copy week 1 until you tap **Customize week N** and change the lifts.

**Send to clients** puts that master plan on the people you tick. Each person keeps **their** start date. A bride who started in March is on a different week 3 than a bride who started in May. Finished workouts stay as they logged them.

To change **one** client only (travel, injury, leftover equipment): open that client → **This client’s week** → Customize for this client. Reset week N to master when you want the shared plan again.

**Add a client without charging** is a free login. Use it for comps, not for paid wedding checkouts.

## Website

The public page shows **12 Week Wedding Prep** and **Start Prep**. That goes to checkout.

Monthly and the 6-week challenge are still in your Programs list. They are not on the homepage right now. If you need a private checkout link later, those can be turned on.

## Money (Paddle) before this is real

Checkout is in **test / sandbox** until Paddle is connected to the real business.

To take live wedding payments and have the money go to you:

1. Log in to Paddle (live, not sandbox)
2. Finish business verification
3. Add **bank / payout** details so Paddle can pay you
4. Create the live Wedding Prep product and copy the live **price** id (it starts with `pri_`)
5. Put live keys on the website host (not the sandbox `test_` token)
6. Point the Paddle webhook to  
   `https://emelifts.com/api/webhooks/paddle`  
   (not the old Trainerize site)

Until that is done, a card payment on the site is a test. It will not pay you, and a real client may get stuck on “Payment is confirming” if the webhook is still pointing at Trainerize.

Harsh or whoever deploys needs those live Paddle values in hosting env. You do the Paddle account + bank side.

## If something looks wrong

- Client paid but cannot see Today: webhook / live Paddle (above)
- Client sees the wrong week: check their start date on the client page, then Send this calendar
- You changed week 5 for everyone but one bride did not get it: Send to clients, and leave her start date as it is
- You only meant to change one bride: use **This client’s week**, not the master program
