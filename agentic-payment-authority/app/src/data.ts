export type LayerKey = 'mandate' | 'credential' | 'authorization' | 'settlement' | 'recourse';

export interface Layer {
  key: LayerKey;
  label: string;
  short: string;
  color: string;
  bg: string;
  border: string;
}

export const LAYERS: Layer[] = [
  { key: 'mandate', label: 'Mandate', short: 'M', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.35)' },
  { key: 'credential', label: 'Credential', short: 'C', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.35)' },
  { key: 'authorization', label: 'Authorization', short: 'A', color: '#22C55E', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.35)' },
  { key: 'settlement', label: 'Settlement', short: 'S', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)' },
  { key: 'recourse', label: 'Recourse', short: 'R', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)' },
];

export interface RailData {
  name: string;
  icon: string;
  description: string;
  layers: Record<LayerKey, { title: string; body: string; sources: string[] }>;
  scores: Record<string, number>;
  sources: { name: string; citation: string }[];
}

export const RAILS: Record<string, RailData> = {
  card: {
    name: 'Card Token',
    icon: 'credit-card',
    description: 'Scoped tokens with merchant + amount constraints. Stripe SPT, Visa Intelligent Commerce, Mastercard Agent Pay.',
    layers: {
      mandate: {
        title: 'Payment instruction → passkey approved',
        body: 'The cardholder issues a scoped payment instruction approved by a passkey or biometric. The mandate is the intent to pay, bound to a specific context (merchant, amount window, time limit).',
        sources: ['Stripe SPT', 'Visa / MC'],
      },
      credential: {
        title: 'Scoped token → amount + merchant',
        body: 'The token is not a raw PAN. It is a scoped grant: limited to a merchant category, a maximum amount, a usage count, and a TTL. Stripe SPT supports revoke and 3DS step-up. Visa and Mastercard issue agent-specific tokens with passkey binding.',
        sources: ['Stripe SPT', 'Visa / MC'],
      },
      authorization: {
        title: 'Network / issuer → authorization match',
        body: 'The network checks that the token scope matches the transaction request. Issuer runs velocity checks and 3DS if step-up is required. Authorization is real-time but settlement is deferred.',
        sources: ['Visa / MC'],
      },
      settlement: {
        title: 'Auth now, settle later → clearing',
        body: 'Card rails authorize instantly but settle in batch (T+1 or later). Clearing reconciles the authorized amount with the settled amount. Programmability is limited because the final settlement is not real-time.',
        sources: ['Visa / MC', 'BIS CPMI'],
      },
      recourse: {
        title: 'Chargeback + signals',
        body: 'Post-payment recourse is strong: chargeback rights, dispute lanes, and commerce signals (merchant risk scoring). The card network dispute infrastructure is mature, giving the payer a well-defined recovery path.',
        sources: ['Visa / MC', 'Stripe SPT'],
      },
    },
    scores: {
      'Credential Scoping': 88,
      'Post-payment Recourse': 82,
      'Settlement Programmability': 45,
    },
    sources: [
      { name: 'Stripe SPT', citation: 'Scoped grant with usage limits, amount caps, merchant binding, revoke, and 3DS step-up' },
      { name: 'Visa / MC', citation: 'Agent-specific tokens, passkey identifiers, commerce signals, and network-level dispute rails' },
    ],
  },
  bank: {
    name: 'Bank Rail',
    icon: 'building-bank',
    description: 'Fast-payment rails with consent objects and scheme-level recall. BIS CPMI, Google AP2.',
    layers: {
      mandate: {
        title: 'Consent object → payer + beneficiary',
        body: 'The mandate is a consent object registered with the payer’s bank or PSP. It names the beneficiary, the purpose, and the maximum liability. In fast-payment schemes, consent can be one-off or recurring with explicit payer confirmation.',
        sources: ['BIS CPMI', 'Google AP2'],
      },
      credential: {
        title: 'Account access → limit + release rule',
        body: 'Credentials are account-access grants with limit and release rules. Open-banking-style access can cap daily or per-transaction amounts. The credential is scoped to a payer–beneficiary pair and can carry an expiry.',
        sources: ['BIS CPMI', 'Product rule'],
      },
      authorization: {
        title: 'PSP / scheme → fraud screen',
        body: 'The PSP or scheme runs a fraud screen before releasing funds. The product rule here is to move fraud controls upstream of payment release, not after. Real-time payment systems must decide in seconds.',
        sources: ['BIS CPMI', 'Product rule'],
      },
      settlement: {
        title: 'Fast payment → RTS or DNS model',
        body: 'Settlement is real-time gross settlement (RTGS) or deferred net settlement (DNS). BIS CPMI notes that RTS models reduce settlement risk but require liquidity. DNS models batch risk. Finality is immediate in RTS, deferred in DNS.',
        sources: ['BIS CPMI'],
      },
      recourse: {
        title: 'Recall path → scheme + payee action',
        body: 'Recourse is a recall request through the scheme. Success depends on the payee’s bank and whether funds have been moved. BIS CPMI notes recall limits: once a fast payment is settled, recovery is not guaranteed.',
        sources: ['BIS CPMI'],
      },
    },
    scores: {
      'Credential Scoping': 68,
      'Post-payment Recourse': 42,
      'Settlement Programmability': 58,
    },
    sources: [
      { name: 'BIS CPMI', citation: 'Fast-payment finality, recall limits, RTS vs DNS settlement risk, and fraud-control placement' },
      { name: 'Product rule', citation: 'Move fraud controls before payment release, not after; upstream screening reduces irrevocable loss' },
    ],
  },
  stablecoin: {
    name: 'Stablecoin Rail',
    icon: 'coin',
    description: 'Wallet policies and smart-contract rules on programmable ledgers. BIS/FSB, emerging standards.',
    layers: {
      mandate: {
        title: 'Wallet policy → key authority',
        body: 'The mandate is a wallet policy that defines which keys can sign, under what conditions. Multi-sig, social recovery, and hardware-bound keys are common patterns. The policy itself is the root of authority.',
        sources: ['BIS/FSB'],
      },
      credential: {
        title: 'Spend policy → contract / wallet rule',
        body: 'Credentials are spend policies encoded in a smart contract or wallet rule: daily limits, allowed counterparties, time locks. The credential is as programmable as the ledger, but standards for delegation are still emerging.',
        sources: ['BIS/FSB'],
      },
      authorization: {
        title: 'Compliance layer → screen + hold',
        body: 'Authorization includes a compliance screen (sanctions, travel rule, KYC hold). Because settlement is ledger-final, the only place to intercept is before broadcast. A hold state can freeze a transaction pending review.',
        sources: ['BIS/FSB'],
      },
      settlement: {
        title: 'Token transfer → ledger finality',
        body: 'Settlement is the token transfer itself: once mined or confirmed, the ledger state is final. Programmability is high because settlement can be conditional (escrow, oracle triggers, multi-step release).',
        sources: ['BIS/FSB'],
      },
      recourse: {
        title: 'Redemption → issuer + legal claim',
        body: 'Recourse is redemption from the issuer or a legal claim. There is no chargeback rail. If keys are compromised or a policy is buggy, recovery depends on issuer cooperation or litigation. Native delegated-wallet standards and liability remain less mature.',
        sources: ['BIS/FSB', 'Open issue'],
      },
    },
    scores: {
      'Credential Scoping': 62,
      'Post-payment Recourse': 30,
      'Settlement Programmability': 90,
    },
    sources: [
      { name: 'BIS/FSB', citation: 'Token rails relevant to cross-border payment innovation; ledger finality and programmability advantages' },
      { name: 'Open issue', citation: 'Native delegated-wallet standards and liability frameworks remain less mature than card or bank rails' },
    ],
  },
};

export interface Claim {
  id: string;
  text: string;
  badge: 'safe' | 'qualify' | 'do-not-say';
  evidence: string;
  source: string;
}

export const CLAIMS: Claim[] = [
  {
    id: 'c1',
    text: 'Card token rails offer the strongest credential scoping for AI agents today.',
    badge: 'safe',
    evidence: 'Stripe SPT supports scoped grants with amount caps, merchant binding, usage limits, TTL, and revoke. Visa and Mastercard issue agent-specific tokens with passkey binding and commerce signals.',
    source: 'Stripe SPT, Visa Intelligent Commerce, Mastercard Agent Pay',
  },
  {
    id: 'c2',
    text: 'Bank rails provide real-time settlement with guaranteed post-payment recourse.',
    badge: 'do-not-say',
    evidence: 'BIS CPMI explicitly notes recall limits in fast-payment systems. Once funds are settled, recovery depends on the payee’s bank and is not guaranteed. Recourse score is 42% compared to 82% for card rails.',
    source: 'BIS CPMI',
  },
  {
    id: 'c3',
    text: 'Stablecoin rails have the highest settlement programmability but the weakest post-payment recourse.',
    badge: 'safe',
    evidence: 'Programmable settlement (escrow, oracle triggers) gives stablecoins a 90% programmability score. However, there is no chargeback rail; recovery depends on issuer redemption or legal claim, yielding a 30% recourse score.',
    source: 'BIS/FSB, Open issue',
  },
  {
    id: 'c4',
    text: 'Fraud controls in fast payments can be moved after the payment is released.',
    badge: 'do-not-say',
    evidence: 'The product rule from BIS CPMI and industry practice is to move fraud controls before payment release. In real-time systems, irrevocable settlement makes post-release fraud controls ineffective.',
    source: 'BIS CPMI, Product rule',
  },
  {
    id: 'c5',
    text: 'All three rails support some form of scoped mandate, but the implementation maturity varies.',
    badge: 'qualify',
    evidence: 'Card tokens have production-grade scoped grants. Bank rails have consent objects but interoperability is scheme-dependent. Stablecoin rails have wallet policies but no universal delegated-wallet standard yet.',
    source: 'Stripe SPT, BIS CPMI, BIS/FSB',
  },
  {
    id: 'c6',
    text: 'AI agents can hold and spend stablecoins without any compliance screening.',
    badge: 'do-not-say',
    evidence: 'Stablecoin authorization layers include compliance screens (sanctions, travel rule, KYC holds). BIS/FSB reports flag compliance as a necessary layer before ledger-final settlement.',
    source: 'BIS/FSB',
  },
];

export const SOURCES = [
  {
    name: 'Stripe SPT',
    full: 'Stripe Secure Payment Tokens',
    supports: 'Scoped grants with amount caps, merchant binding, usage limits, TTL, revoke, and 3DS step-up.',
    note: 'Production API available. Best-in-class credential scoping for agentic payments.',
  },
  {
    name: 'Visa / MC',
    full: 'Visa Intelligent Commerce & Mastercard Agent Pay',
    supports: 'Agent-specific tokens, passkey identifiers, commerce signals, network-level dispute rails.',
    note: 'Network-native capabilities. Strong authorization match and post-payment recourse via chargeback.',
  },
  {
    name: 'BIS CPMI',
    full: 'Bank for International Settlements — Committee on Payments and Market Infrastructures',
    supports: 'Fast-payment finality models (RTS vs DNS), recall limits, fraud-control placement guidance.',
    note: 'Authoritative on settlement risk and recall constraints in real-time payment systems.',
  },
  {
    name: 'Google AP2',
    full: 'Google Accounts Payable API (AP2) / PayOps product patterns',
    supports: 'Consent object design, payer–beneficiary binding, upstream fraud screening.',
    note: 'Product pattern emphasis: fraud controls must precede payment release.',
  },
  {
    name: 'BIS/FSB',
    full: 'BIS / Financial Stability Board',
    supports: 'Token rails for cross-border payment innovation; ledger finality; compliance layering.',
    note: 'Recognizes programmability advantages, but flags that delegated-wallet standards and liability remain immature.',
  },
];
