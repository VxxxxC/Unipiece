import { Knex } from "knex";
import userSeed from '../stuff/Unipiece_Users_new.json';

export async function seed(knex: Knex): Promise<void> {
    // const pw1 = `$2b$12$V2H.h87uqNotL7ghOrt/bOEiSjTysL3WEpvW5yGKhqRb3rjvNNcWi`
    // let pw2 = `$2b$12$9rkDE7ZE/CWN9o0P.JKyQOo8JETeI4VnW7QRsO2e5FgRYzDkjuCrC`
    // Deletes ALL existing entries
    await knex("users").del();

    for (let user of userSeed ){
        
        await knex("users").insert(
            {      
                email: user.email,
                password: user.password,
                name: user.name,
                username: user.username,
                token_amount: user.token_amount,
                wallet_address: user.wallet_address,
                publickey: user.publickey,
                image: user.image,
                bg_image: user.bg_image,
                created_at: user.created_at,
                shipping_address: user.shipping_address,
                style: user.style,
                bio: user.bio
            }
        )
    }

};
