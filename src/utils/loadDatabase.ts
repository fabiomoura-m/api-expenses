import fs from 'fs';

function loadDatabase(database:string) {

    const dataProductsPath = `./database/${database}.json`;

    const fileBuffer = fs.readFileSync(dataProductsPath, 'utf-8');
    const contentJson = JSON.parse(fileBuffer);
    return contentJson;
}

export default loadDatabase;
