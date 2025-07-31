# Web5 DID:ION Creator

A minimal Node.js project to generate **Decentralized Identifiers (DIDs)** using the **ION (Identity Overlay Network)** method from the Web5 stack.

This project demonstrates how to create a **long-form DID** using the official [`@decentralized-identity/ion-tools`](https://github.com/decentralized-identity/ion-tools) library and is suitable for integration into Web5-enabled decentralized applications.

---

## 🌐 What is Web5?

**Web5** is a new decentralized web protocol championed by TBD (a Block subsidiary), aiming to give users full control over their identity and data. It combines:

- **Decentralized Identifiers (DIDs)** — W3C standard for self-sovereign identity.
- **Verifiable Credentials (VCs)** — Tamper-proof, cryptographically verifiable claims.
- **Decentralized Web Nodes (DWNs)** — Personal data stores hosted anywhere.
- **ION** — A public, permissionless DID method built on top of Bitcoin.

> Learn more at [web5.io](https://web5.io).

---

## 🔐 What is a DID?

A **Decentralized Identifier (DID)** is a new type of identifier that enables verifiable, self-sovereign digital identity. Unlike email or usernames, DIDs are:

- Globally unique
- Resolvable to DID Documents
- Controlled by the user, not a central authority

---

## 🧠 What is ION?

**ION** is a Layer 2 DID network built on top of Bitcoin. It uses a Sidetree protocol to anchor operations (create, update, deactivate) without needing consensus on every operation.

- Public and permissionless
- Anchors only hash commitments to Bitcoin
- Scales independently of Bitcoin block size

---

## 🚀 Features

- Generate a long-form DID using ION method
- Export the DID document and keys
- Purely local key generation (no network calls)
- Easy to integrate with other Web5 applications

---

## 📂 Project Structure

```
Web5DidCreator/
├── ion-tools/               # Cloned ION tools library
├── create-did.js            # Script to generate a DID
├── package.json
├── package-lock.json
└── README.md
🛠️ Prerequisites
Node.js v18+ (ESM support required)

npm

📦 Setup Instructions
1. Clone the repo



git clone https://github.com/yourname/Web5DidCreator.git
cd Web5DidCreator
2. Clone and build ion-tools



git clone https://github.com/decentralized-identity/ion-tools.git
cd ion-tools
npm install
npm run build
cd ..
Make sure the ion-tools folder is in the same directory as create-did.js.

3. Install project dependencies



npm install
▶️ Run the DID Creation Script



npm start
This will output something like:




DID: did:ion:EiA...
Public Key (JWK): { ... }
Private Key (JWK): { ... }
DID Document: { ... }
📚 Example Output
json


{
  "did": "did:ion:EiB...Q",
  "publicJwk": { "kty": "EC", "crv": "secp256k1", ... },
  "privateJwk": { "kty": "EC", "crv": "secp256k1", ... },
  "didDocument": {
    "@context": ["https://www.w3.org/ns/did/v1"],
    "id": "did:ion:EiB...Q",
    "verificationMethod": [...],
    "authentication": [...]
  }
}
🧠 How it works
Uses IonKeyUtility.generatePrivateKeyJwk() to generate a new secp256k1 key pair.

Converts the private key into a public JWK.

Constructs a DID document with optional services.

Calls IonDid.create() with public key and service info.

Outputs the long-form DID which includes the full initial state.

Note: The DID can be resolved immediately without anchoring to Bitcoin. Anchoring gives it permanence and global resolvability.

📘 References
Decentralized Identity Foundation (DIF)

ION GitHub Repo

W3C DID Core Spec

Web5 Documentation

🧩 Potential Integrations
 DID-based login system for your micro-SaaS

 Verifiable credentials for completed Learn2Earn courses

 Publishing DIDs to a Decentralized Web Node (DWN)

 Storing credentials in the user's Web5 agent

👩‍💻 Author
Monicka Akilan
Blockchain Specialist & Technical Architect
LinkedIn

