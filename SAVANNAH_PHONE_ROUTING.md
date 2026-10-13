# Savannah phone routing — phase 1

Status: PREPPED, not live.

## Goal

Route unanswered calls from Poppe's mobile line to Savannah without publishing Poppe's personal mobile number in the codebase.

Initial behaviour:

1. Poppe's mobile rings first.
2. If unanswered after the carrier's supported delay, the call forwards to Savannah's dedicated Dutch telephony number.
3. Vapi answers with the existing Savannah assistant.
4. Savannah screens the call, handles what she can, and only escalates when useful.
5. Vapi sends an end-of-call report to a ctrl+love server endpoint for a compact summary.

## Important privacy rule

Do **not** commit Poppe's personal mobile number, carrier credentials, Twilio/Telnyx secrets, Vapi private keys, or webhook secrets to this public repository.

Use Vercel environment variables for any server-side secrets and provider dashboards for telephony credentials.

## Vapi values already known in the site

- Assistant ID is already configured in the website Savannah widget.
- Savannah's browser voice uses the existing Vapi assistant.
- The website briefing remains separate from phone-specific behaviour.

## Still required before activation

- One dedicated Dutch phone number from a Vapi-compatible provider.
- Import that number into Vapi.
- Assign the Savannah assistant to that number for inbound calls.
- Configure the phone number or assistant Server URL for end-of-call reports.
- Add a webhook credential in Vapi and a matching secret in Vercel.
- Configure no-answer forwarding on the mobile carrier/eSIM to the dedicated Savannah number.
- Run the test matrix below.

## Recommended Vapi setup

For international/custom numbers, use an imported provider number rather than a free Vapi US number.

Preferred order for the first working version:

1. Twilio Dutch number, if provisioning succeeds cleanly.
2. Telnyx or another Vapi-supported provider if Dutch availability or verification is easier there.

Inbound settings:

- Assistant: Savannah
- First message: "Savannah at control love. What's up?"
- Background sound: office
- Server messages: at minimum end-of-call-report and status-update
- Max call duration: conservative first pass, e.g. 10 minutes
- Recording: keep off unless there is a clear reason and consent/compliance is handled

## Phone behaviour

Canonical phone-specific behaviour lives in:

`src/app/savannah-phone-briefing.ts`

This is intentionally not injected into the current website voice widget. It is for the phone assistant/server configuration so web chat does not suddenly behave like a switchboard.

## End-of-call summary target

Desired internal summary:

- WHO
- WHY
- URGENCY
- NEXT MOVE
- WEIRDNESS 0-3

Do not send a callback, email, calendar invite or transfer automatically until the relevant action is genuinely wired and tested.

## Test matrix before turning forwarding on

1. Poppe calls from another known number.
2. Known ctrl+love contact calls.
3. Unknown caller with a legitimate business reason.
4. Sales caller.
5. Withheld/anonymous caller.
6. Caller asks for private information.
7. Caller says "urgent" without context.
8. Transfer attempt to Poppe.
9. Failed transfer recovery.
10. End-of-call report arrives and contains a usable summary.

## Activation sequence

1. Acquire/import Dutch destination number.
2. Attach Savannah.
3. Add phone briefing to assistant configuration.
4. Add secure webhook.
5. Test direct calls to Savannah number.
6. Test transfer/escalation.
7. Enable **no-answer forwarding** from Poppe's mobile.
8. Only after a day or two of clean behaviour consider all-calls forwarding.

## Deliberately postponed

- Dutch SMS through Vapi.
- Automatic outbound callbacks.
- Calendar booking.
- Caller-specific CRM memory.
- Permanent/all-calls forwarding.

Those are phase 2 after the boring bit works.
