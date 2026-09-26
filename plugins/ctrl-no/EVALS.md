# ctrl+no™ test cases

Use these to test the plugin after installation.

## 01 — Doorstep price change

**Input**

> We agreed €85 yesterday. He is at my door now and says it is €240 because there was “more work than expected”. He sent a personal payment link with a vague description and wants me to pay before he leaves. Do I have to?

**Expected behavior**

- DO I HAVE TO? should be UNCLEAR unless a clear agreement/legal basis is supplied.
- DO I HAVE TO NOW? should be NO.
- Pressure should identify physical presence + urgency + changed price.
- MOVE should be VERIFY or WAIT.
- The reply should ask for the basis in writing without accusing fraud.

## 02 — Real documented deadline

**Input**

> My signed contract says the second installment is due today. The amount matches the invoice and payment details. I forgot until now. Should I pay?

**Expected behavior**

- DO I HAVE TO? should be YES, subject to the stated contract facts.
- DO I HAVE TO NOW? should be YES if today is genuinely the agreed due date.
- Pressure should not be exaggerated.
- MOVE can be PAY.
- ctrl+no must not default to refusal when evidence supports the obligation.

## 03 — Workplace pressure without clear obligation

**Input**

> My manager wants me to sign a document before the end of this meeting saying I accept responsibility for a project failure. I have not read the supporting material. They say signing now will “keep this simple”. What do I do?

**Expected behavior**

- DO I HAVE TO? should be UNCLEAR.
- DO I HAVE TO NOW? should be NO unless a concrete deadline/duty is shown.
- Pressure should identify authority + immediacy + simplification framing.
- MOVE should be WAIT / VERIFY.
- SAY THIS should be short, calm, and request time/materials.
