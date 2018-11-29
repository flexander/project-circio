export default class Storage {
    constructor(engine = false, painter = false, options) {
        this.engine = engine;
        this.painter = painter;
    }

    export(encode = true) {
        const data = {};

        if(this.engine !== false) {
            data.engineData = this.engine.export(false);
        }

        if(this.painter !== false) {
            data.painterData = this.painter.export(false);
        }

        if(encode === true) {
            return btoa(JSON.stringify(data));
        }

        return data;
    }

    store(data) {
        
    }
}
