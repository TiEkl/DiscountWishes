const fs = require('fs').promises;
let listPath = './Wishlists/';

async function getWishlists() {
    let listNames = [];
    if (await fs.stat(listPath) == null) {
        await fs.mkdir(listPath);
    }
    let files = await fs.readdir(listPath, { withFileTypes: true });

    if (files == null) {
        throw Error("Something went wrong!");
    }

    if (files != null) {
        files.forEach(file => {
            let splitFile = file.name.split(".");
            if (splitFile[1].toLowerCase() === "json") {
                listNames.push(splitFile[0]);
            }
        });
        return listNames;
    }
};

module.exports = getWishlists;

