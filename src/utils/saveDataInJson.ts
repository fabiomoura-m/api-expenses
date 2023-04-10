import fs from 'fs';

function saveDataInJson(data: [], database: string) {
    const dataproductsPath = `./database/${database}.json`;
    const productsString = JSON.stringify(data);
    return fs.writeFileSync(dataproductsPath, productsString);
}

export default saveDataInJson;
