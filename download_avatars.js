const request = require('request');
const token = require('./secrets.js');
const fs = require('fs');
const path = require('path');

const owner = process.argv[2];
const repo = process.argv[3];

const mkdirSync = function (dirPath) {
 try {
    fs.mkdirSync(dirPath)
  } catch (err) {
   if (err.code !== 'EEXIST') throw err
  }
}

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if(!repoOwner || !repoName) {
    console.log("ERROR: Provide repo owner and name ");
    process.exit(1);
  }

  let options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${token.GITHUB_TOKEN}`
    }
  };

  request(options, function(err, res, body) {
    var bodyObject = JSON.parse(body);
    cb(err, bodyObject);
  });
}

function getAvatarUrl(err, result){
  if (err) {console.log(err, "ERROR")};
  Object.keys(result).forEach((user) => {
    downloadImageByURL(result[user].avatar_url,`./avatar/${result[user].login}`)
  })
}

function downloadImageByURL(url, filePath) {
  let options = {
    url: url
  }

  mkdirSync(path.resolve('./avatar'));

  request(options, (err, res, body) => {
  }).pipe(fs.createWriteStream(filePath));
}

getRepoContributors(owner, repo, getAvatarUrl);
