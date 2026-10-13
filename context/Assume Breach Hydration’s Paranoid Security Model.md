   Assume Breach: Hydration’s Paranoid Security Model                                                  

[

![Hydration's Newsletter](https://substackcdn.com/image/fetch/$s_!Mycl!,w_40,h_40,c_fill,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fde30f7e3-213e-4658-b249-02a180cf80d9_512x512.png)



](/)

# [Hydration's Newsletter](/)

SubscribeSign in

# Assume Breach: Hydration’s Paranoid Security Model

[

![Hydration's avatar](https://substackcdn.com/image/fetch/$s_!JMvK!,w_36,h_36,c_fill,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F243c0deb-34f9-4566-a572-843427b8aca9_512x512.png)



](https://substack.com/@hydration)

[Hydration](https://substack.com/@hydration)

Apr 21, 2026

Share

Last week, several exploits caused hundreds of millions in losses for liquidity providers. The much larger - yet unquantifiable - loss is user trust which will continue to weigh on DeFi.

We want to use this moment to reflect on how Hydration is surviving in this adversarial environment - something we don’t take for granted. This is not an opportunistic marketing post claiming “this couldn’t happen to us”. It could. And thinking in any other way would be foolishly irresponsible.

It is this level of paranoia driving Hydration’s mindset which motivated us to implement a multi-layered approach to security, with every layer designed with the assumption that a breach in some of the previous layers will eventually occur.

This approach spans the full stack - from security culture and review practices, through audits and adversarial testing, all the way to on-chain protections like rate limiters and circuit breakers. Together, these layers form what we think of as Hydration’s security “onion”.

Let’s cut it open.

[

![](https://substackcdn.com/image/fetch/$s_!3SUd!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbf02893b-c53b-472c-b491-982802d51ba6_3200x1800.png)



](https://substackcdn.com/image/fetch/$s_!3SUd!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbf02893b-c53b-472c-b491-982802d51ba6_3200x1800.png)

## Assume Breach (Culture & Design)

Everything starts with one assumption: at some point, something will break. Not because people are careless, but because complex systems fail in ways that are hard to predict - especially in an environment as adversarial and fast-moving as DeFi.

This has implications both for how systems are designed - their checks, safeguards, and failure modes - and for the processes around them. Integrations are a good example: Is the project you’re integrating as paranoid as you are?

An unfortunate recent example is Hyperbridge. We had it integrated in the runtime and it was part of the pipeline for the EURC rollout. However, after reviewing its overall security posture, we were forced to pull the plug at the last minute, pending improvements in process maturity and bug bounty coverage. We were saddened to see our concerns materialize, and we wish the Hyperbridge team and their users a quick recovery.

## Testing, Audits, Bounties (Adversarial Mindset)

Security starts with how software is built and tested. Hydration follows a development culture that assumes code will be pushed to its limits. That means strict review standards, but also heavy emphasis on testing beyond the happy path - property-based testing, invariant checks, and continuous fuzzing. Every release is fuzzed using an [in-house harness](https://github.com/galacticcouncil/hydration-fuzzers/tree/main/runtime-fuzzer) designed to surface edge cases and unexpected behavior before they reach production.

External audits are an important layer, but they are not enough on their own - they are snapshots in time. To scale this process, we are investing in AI-assisted auditing. Our [AI model for Substrate security audits](https://github.com/galacticcouncil/hydration-node/blob/master/.claude/skills/hydration_cl0wdit/SKILL.md) is trained on real audit data and ecosystem-specific vulnerabilities to expand coverage and reliability, as well as DeFi attack vectors and Hydration-specific data.

Beyond Hydration itself, members of our security team are actively involved in the [PAL initiative](https://dotpal.io/audits/reports), which has funded 30+ audits across the ecosystem (including Hydration). The findings from these audits are aggregated and fed back into the AI auditor, strengthening it over time.

What matters, ultimately, is continuous adversarial pressure.

This is where bug bounties play a critical role. Hydration runs [one of the most active Immunefi programs](https://immunefi.com/bug-bounty/hydration/information/), consistently ranking among the top 10 in crypto, with over $1M paid out to researchers so far. High payouts for critical issues are painful, but they are preferable to the alternative - getting exploited.

Since bug bounty payouts are capped (at 10% of economic damage), this also shapes protocol design. It has directly motivated mechanisms that limit how much damage can be done in the first place and how much value can be extracted from the chain - such as rate limiters and circuit breakers (covered below).

## Governance & Access Control

Once you accept that something can break - and you actively pressure the system to find those weaknesses - the next question is: who can act, and how much damage can they do?

Hydration minimizes both. There are no admin keys or multisigs. Privileged actions flow through OpenGov, removing single points of failure and ensuring transparency. Where fast response is required - such as emergency stops - responsibilities are scoped to the Technical Committee.

Permissions across the runtime are tightly controlled. Sensitive operations are restricted to specific origins, with fine-grained access per pallet and function.

This extends to the EVM: Contract deployment is permissioned, and only approved contracts can interact with critical components. Proxy permissions and unsigned transactions are similarly constrained.

## Execution Safety (Every Action Is Constrained)

Every action must prove it’s valid - and safe - before it executes. Transactions go through standard validity checks (nonce, weight, fees, versioning) and strict signature verification. Beyond that, execution is constrained at every step.

All operations enforce slippage bounds, ensuring users cannot be filled outside expected ranges - even across multi-hop routes. Execution is atomic: either everything succeeds, or nothing does.

At the protocol level, core invariants are enforced on every interaction. Trades, liquidity changes, and routing decisions must satisfy strict mathematical constraints, and routes must be objectively better unless explicitly overridden.

Parameters are also bounded by design - whether it’s pool composition, amplification, or trade sizing - limiting how far any single operation can deviate.

## Rate Limiters & Circuit Breakers (Containing the Damage)

Even with all safeguards in place, something can still go wrong. What matters then is how fast damage can spread.

Hydration introduces multiple layers of rate limiting and circuit breakers designed to slow attacks down and cap their impact in real time.

Trading and liquidity operations are constrained on a per-block basis, limiting how much value can move in or out of the system at once. On top of that, a global withdrawal limiter tracks aggregate outflows over time, applying decay and enforcing caps across assets.

Issuance and deposits are also bounded. If growth exceeds configured thresholds, assets can be automatically restricted or locked. Individual assets can be frozen entirely if needed—either manually or through predefined triggers.

These mechanisms operate continuously and do not rely on immediate governance intervention.

The underpinning idea is that exploits are not instant - they are processes. By slowing them down, Hydration ensures that even if an attacker finds a path, they cannot extract value arbitrarily fast. Damage is rate-limited, giving the system time to react and contain the situation.

## Market & Oracle Defenses (Making Attacks Unprofitable)

Not all exploits are bugs - many are economic. Hydration defends against manipulation at the market layer.

Trades are checked against oracle prices, with deviation limits enforced using both spot and EMA data. If prices move outside acceptable bounds, execution is blocked.

Fees are dynamic and adapt to market conditions, increasing during periods of high volatility or imbalance. This makes large, aggressive trades progressively more expensive.

Assets can also be partially or fully restricted. Buying, selling, or providing liquidity can be independently enabled or disabled, allowing fine-grained control under stress.

Additional mechanisms like slip fees and asset weight caps further limit how much any single asset or trade can distort the system.

The goal is to make manipulation difficult, expensive, and ultimately not worth it.

## External Boundaries (Where Risk Enters)

A lot of exploits don’t originate inside the system - they come from the edges. Hydration treats external interactions as high-risk by default.

Cross-chain execution (XCM) is tightly controlled. Only specific origins and message types are allowed, with strict validation before any state changes occur.

The EVM environment is sandboxed. Contract deployment is permissioned, and only approved contracts can interact with critical components. This prevents arbitrary code from gaining access to core protocol logic.

Flash loan usage is restricted to predefined actors and flows, avoiding open-ended execution paths that are difficult to reason about under stress.

Composability expands the attack surface. Constraining these boundaries reduces the risk of external issues propagating into the core system.

## Emergency Response & Recovery

Even with all layers in place, the possibility of failure remains. What matters then is maintaining control.

Hydration includes mechanisms to respond quickly and precisely when something goes wrong. Transactions can be paused at a granular level - down to specific pallets or functions - allowing targeted intervention without shutting down the entire system.

Where necessary, operations can be restricted or disabled, containing the issue while avoiding unnecessary disruption elsewhere.

These actions are governed through established processes, ensuring that responses remain controlled and transparent. At the same time, critical functions are intentionally left unpausable to avoid scenarios where the system becomes unrecoverable.

The goal is not just to stop the bleeding, but to do so in a way that preserves the integrity of the system and allows for orderly recovery.

---

Security is not something you achieve - it’s something you continuously defend. In an adversarial system, survival belongs to those who assume failure, constrain it, and outlast it.

Stay safu.

---

#### Subscribe to Hydration's Newsletter

Launched 5 years ago

By subscribing, you agree Substack's [Terms of Use](https://substack.com/tos), and acknowledge its [Information Collection Notice](https://substack.com/ccpa#personal-data-collected) and [Privacy Policy](https://substack.com/privacy).

Share

#### Discussion about this post

CommentsRestacks

TopLatestDiscussions

[LBP Announcement](https://hydration.substack.com/p/lbp-announcement)

[The liquidity bootstrapping event is here!](https://hydration.substack.com/p/lbp-announcement)

Feb 1, 2021 • [Hydration](https://substack.com/@hydration)

27

4

![](https://substackcdn.com/image/fetch/$s_!-1hW!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_center/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fa104e9b1-1409-4922-8bd3-31c20ebf6424_2928x874.png)

[LBP Price Discovery](https://hydration.substack.com/p/lbp-price-discovery)

[Wrapping your head around the LBP](https://hydration.substack.com/p/lbp-price-discovery)

Feb 5, 2021 • [Hydration](https://substack.com/@hydration)

21

1

![](https://substackcdn.com/image/fetch/$s_!6Jan!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_center/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F3e96fb81-35c0-4f5e-b2c2-0a9da20d787b_400x400.jpeg)

[HydraDX Distribution: Bootstrapping Liquidity](https://hydration.substack.com/p/hydradx-distribution-bootstrapping)

[This is not a sale](https://hydration.substack.com/p/hydradx-distribution-bootstrapping)

Jan 18, 2021 • [Hydration](https://substack.com/@hydration)

28

![](https://substackcdn.com/image/fetch/$s_!kBc7!,w_320,h_213,c_fill,f_auto,q_auto:good,fl_progressive:steep,g_center/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F3d8ca320-bdc6-4de3-aef2-6bf5e0f1133a_988x548.jpeg)

See all

### Ready for more?

© 2026 HydraDX · [Privacy](https://substack.com/privacy) ∙ [Terms](https://substack.com/tos) ∙ [Collection notice](https://substack.com/ccpa#personal-data-collected)

[Start your Substack](https://substack.com/signup?utm_source=substack&utm_medium=web&utm_content=footer)[Get the app](https://substack.com/app/app-store-redirect?utm_campaign=app-marketing&utm_content=web-footer-button)

[Substack](https://substack.com) is the home for great culture

   

Save