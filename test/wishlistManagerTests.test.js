const mocha = require('mocha');
const fs = require("fs");
const assert = require("assert");
const wishlistManager = require('../src/services/wishlistManager');
let testFilePath = "./Wishlists/test.json"
let testJSON = {
    name: 'test',
    value: 11,
    someString: 'hejhopp'
}
let emptyWishlistNoSteam = {
    name: "newWishlist",
    games: [],
}
let testID = "76561197985090074";



describe('WishlistManager', function () {
    describe('openWishlist', function () {
        it('Should successfully open the test file', async function () {
            fs.writeFileSync(testFilePath, JSON.stringify(testJSON), 'utf8');
            let actual = await wishlistManager.openWishlist('test')
            let expected = testJSON;
            assert.deepStrictEqual(actual, expected);

        })
        it('Should throw an error when trying to open a file that does not exist', async function () {
            try {
                let result = await wishlistManager.openWishlist('doesNotExist');
                throw new Error("Expected an error but didn't get one!");
            } catch (err) {
                let expected = "No such file found";
                let actual = err.message;
                assert.strictEqual(actual, expected);
            }
        })
    })
    describe('removeWishlist', function () {
        it('Should successfully remove the wishlist', async function () {
            await wishlistManager.removeWishlist('test');
            let expected = false;
            let actual = await fs.existsSync(testFilePath);
            assert.strictEqual(actual, expected);
        })
    })
    describe('addWishlist', function () {
        describe('Successes', function () {
            after(async () => {
                await fs.promises.unlink("./Wishlists/newWishlist.json");
            })
            it('Should successfully create a new .JSON file with base structure', async function () {
                let actual = await wishlistManager.addWishlist(emptyWishlistNoSteam.name);
                let expected = emptyWishlistNoSteam;
                assert.deepStrictEqual(actual, expected)
            })
        })
        describe('Errors', function () {
            it('Should give an error for trying to create a wishlist that already exists', async function () {
                try {
                    let result = await wishlistManager.addWishlist('alreadyExists');
                    throw new Error("Expected an error but didn't get one!");
                } catch (err) {
                    let expected = "A wishlist with that name already exists";
                    let actual = err.message;
                    assert.strictEqual(actual, expected);
                }
            })
        })
        describe('addSteamWishlist', function () {
            it('Should successfully return the wishlist object with the correct games array length', async function () {
                let actual = await wishlistManager.addSteamWishlist('steamList', testID);
                let expected = 95;
                assert.strictEqual(actual.games.length, expected);
            })
        })
        describe('addSteamWishlistByTags', function () {
            it('Should successfully return the wishlist object with the correct games array length', async function () {
                let actual = await wishlistManager.addSteamWishlistByTags('steamList', testID, ['Politics']);
                let expected = 1;
                assert.strictEqual(actual.games.length, expected);
            })
        })
    })
})