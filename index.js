const fs = require('fs');
const pdf = require('pdf-parse');

const basePath = "BASE_PATH";

function getAllPdfJSON(path) {
    const ls = fs.readdirSync(path);

    ls.map(file => {
        const stats = fs.statSync(path + "/" + file);

        if (file[0] === '.') return;

        if (stats.isDirectory()) {
            if (path.replace(basePath, "")) {
                fs.mkdirSync(path.replace(basePath + "/", "") + "/" + file, { recursive: true });
            }
            getAllPdfJSON(path + "/" + file)
        } else {
            if (file.split('.').slice(-1)[0] === 'pdf') {
                let dataBuffer = fs.readFileSync(path + "/" + file);

                pdf(dataBuffer)
                    .then(function (data) {
                        fs.writeFileSync(path.replace(basePath + "/", "") + "/" + file.replace(".pdf", ".json"), JSON.stringify(data))
                    })
                    .catch(function (err) {
                        console.log("오류 발생 파일 : ", path + "/" + file);
                        console.log(err)
                    })
            }
        }
    })
}

getAllPdfJSON(basePath);