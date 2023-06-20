var LIM=LIM||{};
LIM.STORAGE=LIM.STORAGE||{};
(function(_){
    /** 生成存档内容
     * @module storage
     * @method makeSaveContents
     * @example LIM.storage.makeSaveContents(1)
     * @param savefileId {int} 存档位
     * @return {String} 存档内容
     */
    _.key=CryptoJS.enc.Hex.parse('123318efc4b6388888af51a6cd932b12');
    _.makeSaveContents = function(savefileId) {
        let contents = {};
        if (savefileId < 0) {
            contents.storage={
                key: LIM.INPUT.controlMapper
            }
               
        }
        else if (savefileId === 0) {}
        else {
            contents.storage  = {
                key:LIM.$data.key,
                seed:LIM.$data.seed,
                init_seed:LIM.$data.init_seed,
                count_seed:LIM.$data.count_seed,
                inn:LIM.$data.inn,
                bool:LIM.$bool.arr,
                number:LIM.$number.arr,
            };
        }
        return CryptoJS.AES.encrypt(JSON.stringify(contents), LIM.STORAGE.key, { mode: CryptoJS.mode.ECB });
    };
    
    /** 读取存档内容
     * @module storage
     * @method loadSaveContents
     * @example LIM.storage.loadSaveContents(1,"data")
     * @param savefileId {int} 存档位
     * @param data {String} 存档内容
     */
    _.loadSaveContents = function(savefileId,data) {
        if(!data) return;
        else if (savefileId < 0) {
            let decrypted = CryptoJS.AES.decrypt(data, LIM.STORAGE.key, { mode: CryptoJS.mode.ECB });
            let contents = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            LIM.INPUT.controlMapper =contents.storage.key
        }
        else if (savefileId === 0) {}
        else {
            let contents = JSON.parse( CryptoJS.AES.decrypt(data, LIM.STORAGE.key, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8));
            LIM.$data.key=contents.storage.key
            LIM.$data.seed=contents.storage.seed
            LIM.$data.init_seed=contents.storage.init_seed
            LIM.$data.count_seed=contents.storage.count_seed
            LIM.$data.inn=contents.storage.inn
            LIM.$bool.arr=contents.storage.bool
            LIM.$number.arr=contents.storage.number
        }
    };

    /** 进行存档
     * @module storage
     * @method save
     * @example LIM.storage.save(1)
     * @param savefileId {int} 存档位
     */
    _.save = function(savefileId) {
        if (Utils.isNwjs()) _.saveToLocalFile(savefileId,_.makeSaveContents(savefileId));
        else _.saveToWebStorage(savefileId,_.makeSaveContents(savefileId));
    }

    /** 加载存档
     * @module storage
     * @method load
     * @example LIM.storage.load(1)
     * @param savefileId {int} 存档位
     */
    _.load = function(savefileId) {
        if (Utils.isNwjs()) _.loadSaveContents(savefileId,this.loadFromLocalFile(savefileId))
        else _.loadSaveContents(savefileId,this.loadFromWebStorage(savefileId))
    };

    /** 保存本地存档
     * @module storage
     * @method saveToLocalFile
     * @example LIM.storage.saveToLocalFile(1,"json")
     * @param savefileId {int} 存档位
     * @param json {String} 存档内容
     */
    _.saveToLocalFile = function(savefileId, json) {
        let fs = require('fs');
        let dirPath = this.localFileDirectoryPath();
        let filePath = this.localFilePath(savefileId);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath,json);
    };
    
    /** 加载本地存档
     * @module storage
     * @method loadFromLocalFile
     * @example LIM.storage.loadFromLocalFile(1)
     * @param savefileId {int} 存档位
     */
    _.loadFromLocalFile = function(savefileId) {
        let data = null;
        let fs = require('fs');
        let filePath = this.localFilePath(savefileId);
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath,{encoding: 'utf8' });
        }
        return data;
    };

    /** 保存浏览器存档
     * @module storage
     * @method saveToWebStorage
     * @example LIM.storage.saveToWebStorage(1,"json")
     * @param savefileId {int} 存档位
     * @param json {String} 存档内容
     */
    _.saveToWebStorage = function(savefileId, json) {
        let key = this.webStorageKey(savefileId);
        localStorage.setItem(key,json);
    };
    
    /** 加载网络存档
     * @module storage
     * @method loadFromWebStorage
     * @example LIM.storage.loadFromWebStorage(1)
     * @param savefileId {int} 存档位
     */
    _.loadFromWebStorage = function(savefileId) {
        let key = this.webStorageKey(savefileId);
        let data = localStorage.getItem(key);
        return data;
    };

    /** 获取游戏本地路径
     * @module storage
     * @method localFileDirectoryPath
     * @example LIM.storage.localFileDirectoryPath()
     * @return {String} 游戏路径
     */
    _.localFileDirectoryPath = function() {
        let path = require('path');
        let base = path.dirname(process.mainModule.filename);
        return path.join(base, 'save/');
    };
    
    /** 本地存档路径
     * @module storage
     * @method localFilePath
     * @example LIM.storage.localFilePath(1)
     * @param savefileId {int} 存档位
     * @return {String} 存档路径
     */
    _.localFilePath = function(savefileId) {
        let name;
        if (savefileId < 0) name = 'config.lim';
        else if (savefileId === 0) name = 'global.lim';
        else name = 'save%1.lim'.format(savefileId);
        return this.localFileDirectoryPath() + name;
    };

    /** 网络存档key
     * @module storage
     * @method webStorageKey
     * @example LIM.storage.webStorageKey(1)
     * @param savefileId {int} 存档位
     * @return {String} 存档key
     */
    _.webStorageKey = function(savefileId) {
        if (savefileId < 0) return 'RPG Config';
        else if (savefileId === 0) return 'RPG Global';
        else return 'RPG save%1'.format(savefileId);
    };
})(LIM.STORAGE);