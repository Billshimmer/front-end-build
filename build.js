'use strict';

var fs = require('fs');
var glob = require('glob');
var dict = require('fs.io').directory;
var log = console.log.bind(this);

// 构建中的参数配置
var config = {
	//监听目录
	watchDir: './src',
	//被匹配引用的文件格式
	filePattern: './src/**/*.?(vue|js)',
	//最后写入文件
	writeFile: './req.js',
};

var watcher = chokidar.watch(config.watchDir, { ignored: /[\/\\]\./, persistent: true });

watcher
	.on('add', function(path) {
		log('File', path, 'has been added');
		buildRequires(config.filePattern);
	})
	.on('error', function(error) {
		log('error happens ', error);
	})
	.on('unlink', function(path) {
		log('File', path, 'has been removed');
		buildRequires(config.filePattern);
	});

function buildRequires(pattern) {
	var data = '{\n';
	var files = glob(pattern, { nodir: true, matchBase: true }, function(err, files) {
		if (err) {
			log(err);
		}
		for (var i = 0; i < files.length; i++) {
			var array = files[i].split('/'),
				length = array.length,
				last = array[length - 1];
			array[length - 1] = last.substring(0, last.lastIndexOf('.'));
			var string = array.join('.');
			data += "\t'" + string + "': () => require('" + files[i] + "'), \n";
		}
		data += '}';
		fs.readFile('./basicReq.js', function(err, basicData) {
			var functionBody = basicData.toString();
			functionBody = [functionBody.split('{}')[0], data, functionBody.split('{}')[1]].join('');
			writeFile(functionBody);
		});
	});
}

function writeFile(data) {
	fs.writeFile(config.writeFile, data, { flag: 'w' }, function(err, data) {
		if (err) {
			log(err);
		}
	});
}
