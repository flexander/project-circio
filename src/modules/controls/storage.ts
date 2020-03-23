import {
    CircInterface,
    CircStoreInterface,
    ControlInterface,
    EngineInterface,
    QuickControlInterface
} from "../../structure";
import Painter from "../painter";
import BackgroundPainter from "../backgroundPainter";
import {Engine} from "../engine";

export default class StorageControl implements ControlInterface, QuickControlInterface {
    protected stores: CircStoreInterface[];
    protected engine: EngineInterface;

    constructor(stores: CircStoreInterface[], engine: EngineInterface) {
        this.stores = stores;
        this.engine = engine;
    }

    public render(): DocumentFragment {
        return document.createDocumentFragment();
    }

    protected makeSaveFragment(): DocumentFragment {
        const html = `<button class="save">Save</button>`;

        const fragment = document.createRange().createContextualFragment(html);

        fragment.querySelector('button.save').addEventListener('click', e => {
            const name = prompt('Enter Circ name');
            if (name === '' || name === null) {
                return;
            }

            const circ = this.engine.export();
            circ.name = name;

            this.stores[0].store(name, circ);
        });

        return fragment;
    }

    protected makeLoadFragment(): DocumentFragment {
        const html = `<button class="load">Load</button>`;

        const fragment = document.createRange().createContextualFragment(html);

        fragment.querySelector('button.load').addEventListener('click', e => {
            this.engine.pause();
            const storeFront = <HTMLElement>document.querySelector('.store');
            storeFront.innerHTML = '';

            this.stores.forEach((store: CircStoreInterface) => {
                const storeListingHtml = `
                <h2>${store.name} Circs</h2>
                <div class="listing"></div>
                `;
                const circStore = document.createRange().createContextualFragment(storeListingHtml);
                const circListing = circStore.querySelector('.listing');
                store.list()
                    .then((circs: CircInterface[]) => {
                        circs.forEach((circ: CircInterface) => {
                            const tile = document.createRange().createContextualFragment(`<div class="circ" data-name="${circ.name}"><canvas class="canvasBack"></canvas><canvas class="canvasCirc"></canvas><div class="circName">${circ.name}</div></div>`);

                            const tileCanvas = <HTMLCanvasElement>tile.querySelector('canvas.canvasCirc');
                            tileCanvas.style.transformOrigin = '0 0'; //scale from top left
                            tileCanvas.style.transform = 'scale(' + 200 / circ.height + ')';
                            tileCanvas.style.width = circ.width + 'px';
                            tileCanvas.style.height = circ.height + 'px';
                            tileCanvas.setAttribute('height', tileCanvas.style.height);
                            tileCanvas.setAttribute('width', tileCanvas.style.width);
                            const tileBackCanvas = <HTMLCanvasElement>tile.querySelector('canvas.canvasBack');
                            tileBackCanvas.style.transformOrigin = '0 0'; //scale from top left
                            tileBackCanvas.style.transform = 'scale(' + 200 / circ.height + ')';
                            tileBackCanvas.style.width = circ.width + 'px';
                            tileBackCanvas.style.height = circ.height + 'px';
                            tileBackCanvas.setAttribute('height', tileBackCanvas.style.height);
                            tileBackCanvas.setAttribute('width', tileBackCanvas.style.width);

                            const previewPainter = new Painter(tileCanvas.getContext('2d'));
                            const previewBackgroundPainter = new BackgroundPainter(tileBackCanvas.getContext('2d'));
                            const previewEngine = new Engine();
                            previewEngine.addStepCallback(circ => previewPainter.draw(circ));
                            previewEngine.addStepCallback(circ => previewBackgroundPainter.draw(circ));
                            previewEngine.import(circ);

                            tile.querySelector('.circ').addEventListener('click', e => {
                                const circName = (e.target as HTMLElement).closest('[data-name]').getAttribute('data-name');
                                store
                                    .get(circName)
                                    .then((circ: CircInterface) => {
                                        this.engine.import(circ);
                                        this.engine.play();
                                        storeFront.style.display = 'none';
                                    });
                            });

                            tile.querySelector('.circ').addEventListener('mouseenter', e => {
                                const stepsLeftToRun = Math.min(1000000, circ.stepsToComplete-previewEngine.state.totalStepsRun);

                                if (stepsLeftToRun > 0) {
                                    previewEngine.stepFast(stepsLeftToRun);
                                }
                            });

                            tile.querySelector('.circ').addEventListener('mouseleave', e => {
                                previewEngine.pause()
                            });


                            circListing.appendChild(tile);
                        });
                    });

                storeFront.appendChild(circStore);
            });
            storeFront.style.display = 'block';
        });

        return fragment;
    }

    public getQuickControls(): ControlInterface[] {
        const self = this;

        return [
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeSaveFragment();
                }
            },
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeLoadFragment();
                }
            },
        ];
    }

}
