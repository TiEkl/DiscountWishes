const getWishlist = require('./loaders/wishlistLoader');


let listNames = [];

console.log("Welcome to the DiscountWishes app");

async function main() {
    try {
        listNames = await getWishlists();
        console.log("Your saved wishlists: ");
        listNames.forEach((name, index) => {
            console.log(`${index + 1}. ${name}`)
        });
    } catch (error) {
        console.log(error);
    }

}

main()
