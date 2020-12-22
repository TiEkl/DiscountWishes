const needle = require('needle');
const fs = require("fs");
let listPath = './Wishlists/';
let steamURL = steamID => {
    return `https://store.steampowered.com/wishlist/profiles/${steamID}/wishlistdata/`;
}
async function addWishlist(listName) {
    if (fs.existsSync(listPath + listName + '.json')) {
        throw new Error("A wishlist with that name already exists");
    }
    else {
        let newWishlist = {
            name: listName,
            games: [],
        }
        await fs.promises.writeFile(listPath + listName + '.json', JSON.stringify(newWishlist), 'utf-8');
        return await openWishlist(listName);
    }
}

async function addSteamWishlist(listName, steamID, filterTags) {
    return new Promise((resolve, reject) => {
        needle('get', steamURL(steamID)).then(response => {
            let steamWishlist = {
                name: listName,
                games: [],
            }
            for (let key in response.body) {
                let steamgame = response.body[key];
                let price = null;
                let tags = [];
                if (filterTags) {
                    filterTags.forEach(tag => {
                        if (steamgame.tags.includes(tag)) {
                            tags.push(tag);
                        }
                    });
                }
                if (steamgame.subs[0] && steamgame.subs[0].price) {
                    price = parseFloat(steamgame.subs[0].price) / 100;
                }
                var game = {
                    name: steamgame.name,
                    steamprice: price,
                    steamtags: steamgame.tags,
                }
                if (tags.length > 0 || !filterTags) {
                    steamWishlist.games.push(game);
                }
            }
            console.log(steamWishlist.games.length)
            resolve(steamWishlist);
        }).catch(error => {
            reject(error);
        });
    })
}

async function removeWishlist(listName) {
    await fs.promises.unlink(listPath + listName + '.json');
}

async function openWishlist(listName) {

    try {
        let wishlist = await fs.promises.readFile(listPath + listName + '.json', 'utf-8');
        return JSON.parse(wishlist);
    }
    catch (err) {
        throw new Error("No such file found");
    }
}

function saveWishlist(list) {

}

module.exports = {
    addWishlist,
    addSteamWishlist,
    addSteamWishlistByTags: addSteamWishlist,
    removeWishlist,
    openWishlist,
    saveWishlist
};