import { encodeBase64 } from '@oslojs/encoding'
import { sha256 } from '@oslojs/crypto/sha2'

// TODO: Replace with your database
const data = [
    {
        name: "John Doe",
        email: "johndoe@example.com"
    },
    {
        name: "Bob Ross",
        email: "bobross@example.com"
    }
];


// Hash-based

const globalSalt = "a8ca3201-4b76-4339-9f10-517c7c911873"
function hashName(name) {
    return encodeBase64(sha256(new TextEncoder().encode(name + "_" + globalSalt)))
}

const res1 = await fetch("https://refreshed-identity.tyler.place/api/lookup/hash/many", {
    body: JSON.stringify(data.map(row => hashName(row.name)))
}).json();

for (let i = 0; i < res1.length; i++) {
    if (res1[i] != undefined) data[i].name = res1[i];
}

// Email-based

const res2 = await fetch("https://refreshed-identity.tyler.place/api/lookup/email/many", {
    body: JSON.stringify(data.map(row => row.email))
}).json();

for (let i = 0; i < res2.length; i++) {
    if (res2[i] != undefined) data[i].name = res2[i];
}