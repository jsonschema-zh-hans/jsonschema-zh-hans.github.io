const axios = require('axios');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const request = require('request');
const base = "https://json.schemastore.org/";
const url_base = "https://json.schemastore.org/";
const url_catalog = `${base}api/json/catalog.json`;
const schemaDir = path.join(__dirname,"../schemas/");
const local_catalog = path.join(__dirname,"../data/catalog.json");
const timeout = 30000;


// 更新 catalog.json
function updateCatalog(){
    return requestCatalog().then(saveCatalog)
}
function requestCatalog(){
    return requestJSON(url_catalog);
}
function saveCatalog(data){ 
    return saveJSON(local_catalog,data)
}
function requestJSON(url){
    return axios.get(url,{timeout: timeout}).then(d=>d.data)
}

// 保存json到文件
function saveJSON(filename,data){ 
    return fs.promises.writeFile(filename,JSON.stringify(data,null,4));
}

// 下载json文件
function downloadJSON(url,filename){
    return fetch(url)
    .then(res => {
        res.body.pipe(fs.createWriteStream(filename));
    })
}


async function update(){
    let catalog = await requestCatalog();
    let list = catalog.schemas.filter(item=>item.url.startsWith(url_base))
    console.log(`共 ${list.length} 个文件`);
    
    let requestCount = 0;
    await Promise.all(list.map((item,i)=>downloadJSON(
            item.url,
            path.join(schemaDir,path.basename(new URL(item.url).pathname)),
        ).then(()=>{
            console.log(`[${++requestCount}/${list.length}]`)
        }))
    );
    console.log("所有 schema 下载完毕.")
}

module.exports = {
    update
}