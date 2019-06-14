export default class Blueprints {
    constructor (storage) {

        if (typeof storage === "undefined") {
            throw "Please create an engine";
        }

        this.threeCircles = {
            "engineData": {
                "engine": {
                    "interval": 1,
                    "height": 900,
                    "width": 900,
                },
                "list": [
                    {
                        "id": 0,
                        "radius": 100,
                        "clockwise": false,
                        "outside": false,
                        "steps": 500,
                        "fixed": true
                    },
                    {
                        "id": 1,
                        "radius": 50,
                        "clockwise": true,
                        "outside": true,
                        "steps": 500,
                        "fixed": true
                    },
                    {
                        "id": 2,
                        "radius": 25,
                        "clockwise": false,
                        "outside": true,
                        "steps": 500,
                        "fixed": true
                    }
                ]
            },
            "painterData": {
                "painter": {
                    "draw": true,
                    "color": "#ffffff",
                    "point": 0.5,
                    "backgroundFill": "#1b5eec"
                },
                "brushes": [
                    null,
                    null,
                    [
                        {
                            "color": "#FFF",
                            "point": 0.5,
                            "offset": 0,
                            "degrees": 0,
                            "link": false
                        }
                    ]
                ]
            }
        };
    }

    load (name) {
        if (typeof this[name] === "undefined") {
            throw 'Blueprint not found';
        }

        storage.import(JSON.stringify(this[name]));
    }
}