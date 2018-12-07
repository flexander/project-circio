export default class Storage {
    constructor(engine = false, painter = false, options) {
        this.engine = engine;
        this.painter = painter;
    }

    export(encode = true) {
        let data = {};
        let image = false;

        if(this.engine !== false) {
            data.engineData = this.engine.export(false);
        }

        if(this.painter !== false) {
            image = this.painter.exportImage();
            data.painterData = this.painter.export(false);
        }

        data.image = image;

        if(encode === true) {
            data = btoa(JSON.stringify(data));
        }

        return data;
    }

    import(data, decode = true) {
        if(decode === true) {
            data = atob(data);
        }

        const importData = JSON.parse(data);

        if(this.engine !== false) {
            this.engine.import(importData.engineData);
        }

        return data;
    }
}
