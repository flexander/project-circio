export default class Blueprints {
    constructor (storage) {

        if (typeof storage === "undefined") {
            throw "Please create an engine";
        }

        this.twoCircles = {
            "engineData": {
                "engine": {
                    "interval": 1,
                    "height": 1080,
                    "width": 1080,
                },
                "list": [
                    {
                        "id": 0,
                        "radius": 300,
                        "clockwise": false,
                        "outside": false,
                        "steps": 500,
                        "fixed": true
                    },
                    {
                        "id": 1,
                        "radius": 100,
                        "clockwise": true,
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

        this.threeCircles = {
            "engineData": {
                "engine": {
                    "interval": 1,
                    "height": 1080,
                    "width": 1080,
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

        this.fourCircles = {
            "engineData": {
                "engine": {
                    "interval": 1,
                    "height": 1080,
                    "width": 1080,
                },
                "list": [
                    {
                        "id": 0,
                        "radius": 120,
                        "clockwise": false,
                        "outside": false,
                        "steps": 1000,
                        "fixed": true,
                    },
                    {
                        "id": 1,
                        "radius": 60,
                        "clockwise": true,
                        "outside": true,
                        "steps": 500,
                        "fixed": true,
                    },
                    {
                        "id": 2,
                        "radius": 30,
                        "clockwise": false,
                        "outside": true,
                        "steps": 250,
                        "fixed": true,
                    },
                    {
                        "id": 3,
                        "radius": 15,
                        "clockwise": true,
                        "outside": true,
                        "steps": 125,
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

        this.fiveCircles = {
            "engineData": {
                "engine": {
                    "height": 1080,
                    "width": 1080,
                },
                "list": [
                    {
                        id: 0,
                        "radius": 10,
                        steps: 1000,
                    },
                    {
                        id: 1,
                        "radius": 20,
                        steps: 1000,
                    },
                    {
                        id: 2,
                        "radius": 30,
                        steps: 1000,
                    },
                    {
                        id: 3,
                        "radius": 40,
                        steps: 1000,
                    },
                    {
                        id: 4,
                        "radius": 50,
                        steps: 1000,
                    }

                ]
            },
            "painterData": {
                "brushes": [
                    null,
                    null,
                    null,
                    null,
                    [
                        {
                            "color": "#FFF",
                            "point": 0.5,
                        }
                    ]
                ]
            }
        };

        this.sixCircles = {
            "engineData": {
                "engine": {
                    "height": 1080,
                    "width": 1080,
                },
                "list": [
                    {
                        id: 0,
                        "radius": 10,
                        steps: 1000,
                    },
                    {
                        id: 1,
                        "radius": 20,
                        steps: 1000,
                    },
                    {
                        id: 2,
                        "radius": 30,
                        steps: 1000,
                    },
                    {
                        id: 3,
                        "radius": 40,
                        steps: 1000,
                    },
                    {
                        id: 4,
                        "radius": 50,
                        steps: 1000,
                    },
                    {
                        id: 5,
                        "radius": 60,
                        steps: 1000,
                    },

                ]
            },
            "painterData": {
                "brushes": [
                    null,
                    null,
                    null,
                    null,
                    null,
                    [
                        {
                            "color": "#FFF",
                            "point": 0.5,
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
